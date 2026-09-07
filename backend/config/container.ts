import "reflect-metadata";
import { Container } from "inversify";
import { TaskController} from "../tasks/interfaces/TaskController";
import { TaskRouter } from "../tasks/interfaces/task.Router";
import { TaskServices } from "../tasks/task.Services";
import { UpdateTaskProvider } from "../tasks/providers/updateTaskProviders";
import { GetTasksProvider } from "../tasks/providers/getTaskProviders";

export const container  = new Container();
container.bind(TaskController).toSelf().inTransientScope();
container.bind(TaskRouter).toSelf().inTransientScope();
container.bind(TaskServices).toSelf().inSingletonScope();
container.bind(UpdateTaskProvider).toSelf().inSingletonScope();
container.bind(GetTasksProvider).toSelf().inSingletonScope();
