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
        if(rentedGame.rowCount===gameFindId.rows[0].stockTotal) return res.status(400).send("Não disponível.");

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