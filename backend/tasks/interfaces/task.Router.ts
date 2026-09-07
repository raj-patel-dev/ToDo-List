import { Router, Request, Response } from "express";
import { TaskController } from "./TaskController";
import { inject, injectable } from "inversify";
import { IPartialTaskWithId, ITask } from "./task.interface";
import { createTaskValidator } from "../validators/createTask.vakidator";
import { getTaskValidator } from "../validators/getTask.vakidator";
import { updateTaskValidator } from "../validators/updateTask.vakidator";
import { validateRequest } from "../middleware/validateRequest";

@injectable()
export class TaskRouter {
    public router: Router;

    constructor(
        @inject(TaskController)
        private taskController: TaskController
    ) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post(
            "/create",
            createTaskValidator,
            validateRequest,
            async (req: Request, res: Response) => {
                const newTask = await this.taskController.handlePostTask(req);
                res.status(201).json(newTask);
            }
        );

        this.router.get(
            "/check",
            getTaskValidator,
            validateRequest,
            async (req: Request, res: Response) => {
                const tasks = await this.taskController.handleGetTask(req);
                res.json(tasks);
            }
        );
        this.router.patch(
            "/change",
            updateTaskValidator,
            validateRequest,
            async (req: Request, res: Response) => {
                const task = await this.taskController.handlePatchTask(req);
                res.json(task);
            }
        );
    }
}
