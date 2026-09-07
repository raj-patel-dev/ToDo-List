"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTasksProvider = void 0;
const inversify_1 = require("inversify");
const task_Services_1 = require("../task.Services");
let GetTasksProvider = class GetTasksProvider {
    constructor(taskService) {
        this.taskService = taskService;
    }
    findAllTasks(pagination) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const page = (_a = pagination.page) !== null && _a !== void 0 ? _a : 1;
            const limit = (_b = pagination.limit) !== null && _b !== void 0 ? _b : 10;
            const order = (_c = pagination.order) !== null && _c !== void 0 ? _c : "desc";
            const tasks = yield this.taskService.findAll({
                page,
                limit,
                order
            });
            const totalTasks = yield this.taskService.countDocuments();
            const completedTasks = yield this.taskService.countDocuments({
                status: "completed"
            });
            const todoTasks = yield this.taskService.countDocuments({
                status: "todo"
            });
            const inProgressTasks = yield this.taskService.countDocuments({
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
        });
    }
};
exports.GetTasksProvider = GetTasksProvider;
exports.GetTasksProvider = GetTasksProvider = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(task_Services_1.TaskServices)),
    __metadata("design:paramtypes", [task_Services_1.TaskServices])
], GetTasksProvider);
