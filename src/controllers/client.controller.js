import { db } from "../database/database.connection.js";

export async function postClient(req, res){
    const {name, phone, cpf, birthday} = req.body;
    
    try{
        await db.query(`
            INSERT INTO customers 
            (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4);`,
            [name, phone, cpf, birthday]
        );
        res.send("Cliente cadastrado.");
    }catch(error){
        res.status(500).send(error.message);
    }

}