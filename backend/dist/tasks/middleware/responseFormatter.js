"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseFromatter = responseFromatter;
const http_status_codes_1 = require("http-status-codes");
function responseFromatter(req, res, next) {
    const originalJson = res.json.bind(res);
    res.json = (data) => {
        const statusCode = res.statusCode ? res.statusCode : http_status_codes_1.StatusCodes.OK;
        const response = {
            status: statusCode >= 200 && statusCode < 300 ? "success" : "error",
            statusCode: statusCode,
            message: (0, http_status_codes_1.getReasonPhrase)(res.statusCode),
        };
        if (statusCode >= 200 && statusCode < 300) {
            response.data = data.meta ? data.data : data;
        }
        if (statusCode >= 300) {
            response.error = data;
        }
        if (data.meta) {
            response.meta == data.meta;
        }
        ;
        return originalJson(response);
    };
    next();
}
