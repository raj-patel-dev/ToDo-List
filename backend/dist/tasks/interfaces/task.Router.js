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
exports.TaskRouter = void 0;
const express_1 = require("express");
const TaskController_1 = require("./TaskController");
const inversify_1 = require("inversify");
const createTask_vakidator_1 = require("../validators/createTask.vakidator");
const getTask_vakidator_1 = require("../validators/getTask.vakidator");
const updateTask_vakidator_1 = require("../validators/updateTask.vakidator");
const validateRequest_1 = require("../middleware/validateRequest");
let TaskRouter = class TaskRouter {
    constructor(taskController) {
        this.taskController = taskController;
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post("/create", createTask_vakidator_1.createTaskValidator, validateRequest_1.validateRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const newTask = yield this.taskController.handlePostTask(req);
            res.status(201).json(newTask);
        }));
        this.router.get("/check", getTask_vakidator_1.getTaskValidator, validateRequest_1.validateRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const tasks = yield this.taskController.handleGetTask(req);
            res.json(tasks);
        }));
        this.router.patch("/change", updateTask_vakidator_1.updateTaskValidator, validateRequest_1.validateRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const task = yield this.taskController.handlePatchTask(req);
            res.json(task);
        }));
    }
};
exports.TaskRouter = TaskRouter;
exports.TaskRouter = TaskRouter = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(TaskController_1.TaskController)),
    __metadata("design:paramtypes", [TaskController_1.TaskController])
], TaskRouter);
