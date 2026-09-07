import { injectable, inject } from "inversify";
import { TaskServices } from "../task.Services";
import {
    IPartialTaskWithId,
    ITask
} from "../interfaces/task.interface";
import { Document } from "mongoose";

@injectable()
export class UpdateTaskProvider {

    constructor(
        @inject(TaskServices)
        private taskService: TaskServices
    ) {}

    public async updateTask(
        update: IPartialTaskWithId
    ): Promise<Document & ITask> {

        const task: (Document & ITask) | null =
            await this.taskService.findById(update._id);

        if (!task) {
            throw new Error("Task doesn't exist");
        }

        task.title = update.title ?? task.title;
        task.description = update.description ?? task.description;
        task.dueDate = update.dueDate ?? task.dueDate;
        task.priority = update.priority ?? task.priority;
        task.status = update.status ?? task.status;

        return await task.save();
    }
}
