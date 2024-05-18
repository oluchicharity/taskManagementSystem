"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const taskController_1 = require("../controllers/taskController");
const authentication_1 = require("../middleware/authentication");
const router = express_1.default.Router();
router.post('/createTask', authentication_1.authenticateUser, taskController_1.create);
router.get('/getAllTask/:id', taskController_1.getAllTasks);
router.get('/getOneTask/:taskId', taskController_1.getOneTask);
router.put('/updateTask/:taskId', authentication_1.authenticateUser, taskController_1.updateTask);
router.delete('/deleteTask/:taskId', authentication_1.authenticateUser, taskController_1.deleteTask);
exports.default = router;
