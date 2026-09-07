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
exports.TaskController = void 0;
const inversify_1 = require("inversify");
const express_validator_1 = require("express-validator");
const task_Services_1 = require("../task.Services");
const updateTaskProviders_1 = require("../providers/updateTaskProviders");
const getTaskProviders_1 = require("../providers/getTaskProviders");
let TaskController = class TaskController {
    constructor(taskServices, updateTaskProvider, getTaskProvider) {
        this.taskServices = taskServices;
        this.updateTaskProvider = updateTaskProvider;
        this.getTaskProvider = getTaskProvider;
    }
    // GET /tasks
    handleGetTask(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const validatedData = (0, express_validator_1.matchedData)(req);
            try {
                const tasks = yield this.getTaskProvider.findAllTasks(validatedData);
                return tasks;
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    // POST /tasks
    handlePostTask(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.taskServices.createTask(req.body);
        });
    }
    // PATCH /tasks
    handlePatchTask(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const validatedData = (0, express_validator_1.matchedData)(req);
            return this.updateTaskProvider.updateTask(validatedData);
        });
    }
};
exports.TaskController = TaskController;
exports.TaskController = TaskController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(task_Services_1.TaskServices)),
    __param(1, (0, inversify_1.inject)(updateTaskProviders_1.UpdateTaskProvider)),
    __param(2, (0, inversify_1.inject)(getTaskProviders_1.GetTasksProvider)),
    __metadata("design:paramtypes", [task_Services_1.TaskServices,
        updateTaskProviders_1.UpdateTaskProvider,
        getTaskProviders_1.GetTasksProvider])
], TaskController);
