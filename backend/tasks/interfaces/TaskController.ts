import { Request } from "express";
import { inject, injectable } from "inversify";
import { matchedData } from "express-validator";
import { Document } from "mongoose";
import { IPartialTaskWithId, ITask } from "./task.interface";
import { TaskServices } from "../task.Services";
import { UpdateTaskProvider } from "../providers/updateTaskProviders";
import { GetTasksProvider } from "../providers/getTaskProviders";

@injectable()
export class TaskController {
    constructor(
        @inject(TaskServices)
        private taskServices: TaskServices,

        @inject(UpdateTaskProvider)
        private updateTaskProvider: UpdateTaskProvider,

        @inject(GetTasksProvider)
        private getTaskProvider: GetTasksProvider,
    ) {}

    // GET /tasks
    public async handleGetTask(
        req: Request
    ): Promise<{data : ITask[]; meta: {}}> {
        const validatedData = matchedData(req);
        try {
            const tasks : {data : ITask[]; meta : {} } = 
            await this.getTaskProvider.findAllTasks(validatedData);
            return tasks;
        } catch(error : any) {
            throw new Error(error);
        }
    }

    // POST /tasks
    public async handlePostTask(
        req: Request<{}, {}, ITask>
    ) {
        return this.taskServices.createTask(req.body);
    }

    // PATCH /tasks
    public async handlePatchTask(
        req: Request<{}, {}, IPartialTaskWithId>
    ) {
        const validatedData: IPartialTaskWithId = matchedData(req);
        return this.updateTaskProvider.updateTask(validatedData);
    }
}
