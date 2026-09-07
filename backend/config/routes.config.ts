import { Application } from "express";
import { container } from "./container";
import { TaskRouter } from "../tasks/interfaces/task.Router";

export function addRoutes(app:Application):Application{
    const taskRouter = container.get<TaskRouter>(TaskRouter);
    app.use("/tasks",taskRouter.router);
    return app;
}