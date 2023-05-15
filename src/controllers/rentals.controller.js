import { db } from "../database/database.connection.js";
import dayjs from "dayjs";

export async function postRental(req, res) {
    const { customerId, gameId, daysRented } = req.body;

    try {
        const clientId = await db.query(`SELECT id FROM customers WHERE id = $1`, [customerId]);
        if (!clientId.rowCount) return res.status(400).send("Cliente não cadastrado.");

        const gameFindId = await db.query(`SELECT "pricePerDay", "stockTotal" FROM games WHERE id = $1;`, [gameId]);
        if (!gameFindId.rowCount) return res.status(400).send("Produto não encontrado.");

        const rentedGame = await db.query(`SELECT * FROM rentals WHERE "gameId" = $1 AND "returnDate" IS NULL;`, [gameId]);
        if (rentedGame.rowCount === gameFindId.rows[0].stockTotal) return res.status(400).send("Não disponível.");

        const listInsert = [customerId, gameId, dayjs().format("YYYY-MM-DD"), daysRented, null, daysRented * gameFindId.rows[0].pricePerDay, null]

        await db.query(`
            INSERT INTO 
            rentals 
            ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
            VALUES ($1, $2, $3, $4, $5, $6, $7);`, listInsert
        );
        res.sendStatus(201);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function getRentals(req, res) {
    try {
        const rentals = await db.query(`
        SELECT rentals.*, customers.name AS "customer", games.name AS "game"
        FROM rentals JOIN customers
        ON rentals."customerId" = customers.id
        JOIN games
        ON rentals."gameId" = games.id;`);
        res.send(rentals.rows.map(r => ({ ...r, customer: { id: r.customerId, name: r.customer }, game: { id: r.gameId, name: r.game } })));
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function finishRent(req, res) {
    const { id } = req.params;

    const findRent = await db.query(`SELECT * FROM rentals WHERE id = $1;`, [id]);
    if (!findRent.rowCount) return res.sendStatus(404);
    if (findRent.rows[0].returnDate) return res.sendStatus(400);

    const pricePerDay = findRent.rows[0].originalPrice / findRent.rows[0].daysRented;
    const date1 = findRent.rows[0].rentDate;
    const date2 = dayjs(dayjs().format("YYYY-MM-DD"));
    let diffDays = Math.floor(date2.diff(date1) / 86400000) - findRent.rows[0].daysRented;
    if(Math.sign(diffDays)===-1) diffDays=0;

    try {
        await db.query(`
            UPDATE rentals SET "returnDate" = $1, "delayFee" = $2
            WHERE id = $3;`,
            [date2, diffDays * pricePerDay, id]
        );
        res.send("Produto devolvido.");
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function deleteRent(req, res) {
    const { id } = req.params;
    try {
        const findRent = await db.query(`SELECT * FROM rentals WHERE id = $1;`, [id]);
        if (!findRent.rowCount) return res.sendStatus(404);
        if (!findRent.rows[0].returnDate) return res.sendStatus(400);

        await db.query(`DELETE FROM rentals WHERE id = $1;`, [id]);
        res.send("Registro deletado com sucesso.");
    } catch (error) {
        res.status(500).send(error.message);
    }
}