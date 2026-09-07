import { ITask } from "../interfaces/task.interface";
import { injectable, inject } from "inversify";
import { TaskServices } from "../task.Services";
import { ITaskPagination } from "../interfaces/Pgination";

@injectable()
export class GetTasksProvider {
    constructor(
        @inject(TaskServices)
        private taskService: TaskServices
    ) {}

    public async findAllTasks(
        pagination: Partial<ITaskPagination>
    ): Promise<{
        data: ITask[];
        meta: {
            totalTasks: number;
            completedTasks: number;
            todoTasks: number;
            inProgressTasks: number;
        };
    }> {

        const page = pagination.page ?? 1;
        const limit = pagination.limit ?? 10;
        const order = pagination.order ?? "desc";

        const tasks: ITask[] = await this.taskService.findAll({
            page,
            limit,
            order
        });

        const totalTasks = await this.taskService.countDocuments();

        const completedTasks =
            await this.taskService.countDocuments({
                status: "completed"
            });

        const todoTasks =
            await this.taskService.countDocuments({
                status: "todo"
            });

        const inProgressTasks =
            await this.taskService.countDocuments({
                status: "inProgress"
            });

        return {
            data: tasks,
            meta: {
                totalTasks,
                completedTasks,
                todoTasks,
                inProgressTasks
            }
        };
    }
}