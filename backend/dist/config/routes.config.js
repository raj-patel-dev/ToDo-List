"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addRoutes = addRoutes;
const container_1 = require("./container");
const task_Router_1 = require("../tasks/interfaces/task.Router");
function addRoutes(app) {
    const taskRouter = container_1.container.get(task_Router_1.TaskRouter);
    app.use("/tasks", taskRouter.router);
    return app;
}
