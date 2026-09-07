import { checkSchema } from "express-validator";

export const updateTaskValidator = checkSchema({
    _id: {
        in: ["body"],
        isMongoId: {
            errorMessage: "A valid task id is required",
        },
    },
    title: {
        in: ["body"],
        optional: true,
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
        optional: true,
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
        optional: true,
        isIn: {
            options: [["todo", "inProgress", "completed"]],
            errorMessage:
                "Status must be one of 'todo', 'inProgress', or 'completed'",
        },
    },

    priority: {
        in: ["body"],
        optional: true,
        isIn: {
            options: [["low", "normal", "high"]],
            errorMessage:
                "Priority must be one of 'low', 'medium', or 'high'",
        },
    },
    dueDate: {
        in: ["body"],
        optional: true,
        isISO8601: {
            errorMessage: "Due date must be a valid ISO 8601 date",
        },
    }
});

