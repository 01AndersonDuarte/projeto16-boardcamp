import dayjs from "dayjs";
import { db } from "../database/database.connection.js";

export async function postClient(req, res) {
    const { name, phone, cpf, birthday } = req.body;

    try {
        const clientCpf = await db.query(`SELECT cpf FROM customers WHERE cpf=$1;`, [cpf]);
        if (clientCpf.rowCount) return res.status(409).send("Cliente já cadastrado.");

        await db.query(`
            INSERT INTO customers 
            (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4);`,
            [name, phone, cpf, birthday]
        );
        res.status(201).send("Cliente cadastrado.");
    } catch (error) {
        res.status(500).send(error.message);
    }

}

export async function getClients(req, res) {
    try {
        const clients = await db.query(`SELECT * FROM customers;`);
        const geralClients = clients.rows.map(c=>({...c, birthday: dayjs(c.birthday).format("YYYY-MM-DD")}));
        res.send(geralClients);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function getOneClient(req, res) {
    const { id } = req.params;
    try {
        const client = await db.query(`SELECT * FROM customers WHERE id = $1;`, [id]);
        if (!client.rowCount) return res.status(404).send("Usuário não encontrado.");

        res.send({...(client.rows[0]), birthday: dayjs(client.rows[0].birthday).format("YYYY-MM-DD")});
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function updateOneClient(req, res) {
    const { id } = req.params;
    const { name, phone, cpf, birthday } = req.body;

    try {
        const clientCpf = await db.query(`SELECT id FROM customers WHERE cpf=$1;`, [cpf]);
        if (clientCpf.rows[0].id && clientCpf.rows[0].id != id) return res.sendStatus(409);

        await db.query(`
            UPDATE customers
            SET name=$1, phone=$2, cpf=$3, birthday=$4 
            WHERE id=$5;`,
            [name, phone, cpf, birthday, id]
        );
        res.send("Atualização concluída.");
    } catch (error) {
        res.status(500).send(error.message);
    }

}