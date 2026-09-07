"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = validateRequest;
const express_validator_1 = require("express-validator");
const http_status_codes_1 = require("http-status-codes");
function validateRequest(req, res, next) {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            message: "Validation failed",
            errors: errors.array(),
        });
        return;
    }
    next();
}
