import joi from "joi";

export const addGames = joi.object({
    name: joi.string().required(),
    image: joi.string().required().uri(),
    stockTotal: joi.number().integer().positive().required(),
    pricePerDay: joi.number().precision(2).positive().required()
});