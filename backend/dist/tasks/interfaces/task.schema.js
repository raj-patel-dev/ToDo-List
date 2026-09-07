"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const mongoose_1 = require("mongoose");
const taskSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, "title is required"],
        maxLength: [100, "maximum 100 letters"],
        trim: true
    },
    description: {
        type: String,
        required: true,
        maxLength: 500,
        trim: true
    },
    status: {
        type: String,
        required: true,
        enum: ["todo", "inProgress", "completed"],
        default: "todo"
    },
    priority: {
        type: String,
        required: true,
        enum: ["low", "normal", "high"],
        default: "normal"
    },
    dueDate: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});
exports.Task = (0, mongoose_1.model)("Task", taskSchema);
