"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTaskValidator = void 0;
const express_validator_1 = require("express-validator");
exports.createTaskValidator = (0, express_validator_1.checkSchema)({
    title: {
        in: ["body"],
        notEmpty: {
            errorMessage: "Title is required",
        },
        isString: {
            errorMessage: "Title must be a string",
        },
        trim: true,
        isLength: {
            options: {
                min: 1,
                max: 100,
            },
            errorMessage: "Title must be between 1 and 100 characters",
        },
    },
    description: {
        in: ["body"],
        notEmpty: {
            errorMessage: "Description is required",
        },
        isString: {
            errorMessage: "Description must be a string",
        },
        trim: true,
        isLength: {
            options: {
                min: 1,
                max: 200,
            },
            errorMessage: "Description must be between 1 and 200 characters",
        },
    },
    status: {
        in: ["body"],
        notEmpty: {
            errorMessage: "Status is required",
        },
        isIn: {
            options: [["todo", "inProgress", "completed"]],
            errorMessage: "Status must be one of 'todo', 'inProgress', or 'completed'",
        },
    },
    priority: {
        in: ["body"],
        notEmpty: {
            errorMessage: "Priority is required",
        },
        isIn: {
            options: [["low", "normal", "high"]],
            errorMessage: "Priority must be one of 'low', 'medium', or 'high'",
        },
    },
    dueDate: {
        in: ["body"],
        notEmpty: {
            errorMessage: "Due date is required",
        },
        isISO8601: {
            errorMessage: "Due date must be a valid ISO 8601 date",
        },
    }
});
