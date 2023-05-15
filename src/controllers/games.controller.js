import { db } from "../database/database.connection.js";

export async function postGames(req, res) {
    const { name, image, stockTotal, pricePerDay } = req.body;

    try {
        const nameGame = await db.query(`SELECT name FROM games WHERE name = $1;`, [name]);
        if (nameGame.rowCount) return res.status(409).send("Jogo já cadastrado.");

        await db.query(`
            INSERT INTO games (name, image, "stockTotal", "pricePerDay") 
            VALUES ($1, $2, $3, $4)`, [name, image, stockTotal, pricePerDay]);

        res.status(201).send("Item adicionado com sucesso");
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function getGames(req, res) {
    const { offset, limit } = req.query;
    try {
        const games = await db.query(`SELECT * FROM games LIMIT $1 OFFSET $2;`, [limit, offset]);

        res.send(games.rows);
    } catch (error) {
        res.status(500).send(error.message);
    }
}