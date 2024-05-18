
import express from 'express';
import { create, getAllTasks, getOneTask, updateTask, deleteTask } from '../controllers/taskController';

import { authenticateUser } from '../middleware/authentication';

const router = express.Router();

router.post('/createTask',authenticateUser, create);
router.get('/getAllTask/:id', getAllTasks);
router.get('/getOneTask/:taskId', getOneTask);
router.put('/updateTask/:taskId', authenticateUser,updateTask);
router.delete('/deleteTask/:taskId', authenticateUser, deleteTask);

export default router;
