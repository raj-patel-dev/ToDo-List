import {checkSchema} from "express-validator";

export const getTaskValidator = checkSchema({
    limit: {
        in: ["query"],
        optional: true,
        isInt: {
            options: {
                min: 1,
                max: 100
            },
            errorMessage: "Limit must be an integer between 1 and 100"
        },
        toInt: true
    },
    page : {
        in: ["query"],
        optional: true,
        isInt: {    
            options: {
                min: 1
            },
            errorMessage: "Page must be an integer greater than 0"
        },
        toInt: true
    },
    order : {
        in: ["query"],
        optional: true,
        isIn: { 
            options: [["asc", "desc"]],
            errorMessage: "Order must be either 'asc' or 'desc'"
        }   
    }
})
