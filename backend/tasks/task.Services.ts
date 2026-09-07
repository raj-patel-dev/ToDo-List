import { QueryFilter, Model } from "mongoose";
import { ITask } from "./interfaces/task.interface";
import { Task } from "./interfaces/task.schema";
import { injectable } from "inversify";
import { ITaskPagination } from "./interfaces/Pgination";

@injectable()
export class TaskServices {
    private taskModel: Model<ITask> = Task;

    // Create Task
    public async createTask(taskData: ITask) {
        const task = new this.taskModel(taskData);

        await task.save();

        return task;
    }

    // Find Task By ID
    public async findById(id: string) {
        return await this.taskModel.findById(id);
    }

    // Find Active Tasks With Pagination
    public async findByActive(pagination: ITaskPagination) {
        const { page, limit } = pagination;

        const skip = (page - 1) * limit;

        return await this.taskModel
            .find()
            .skip(skip)
            .limit(limit)
            .sort({
                createdAt: pagination.order === "asc" ? 1 : -1
            });
    }

    // Count Documents
    public async countDocuments(filter?: QueryFilter<ITask>) {
        return await this.taskModel.countDocuments(filter);
    }

    // Find All Tasks With Pagination
    public async findAll(pagination: ITaskPagination) {
        return await this.taskModel
            .find()
            .limit(pagination.limit)
            .skip((pagination.page - 1) * pagination.limit)
            .sort({
                createdAt: pagination.order === "asc" ? 1 : -1
            });
    }
}