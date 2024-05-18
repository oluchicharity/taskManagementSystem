import mongoose, { Schema, Document } from 'mongoose';

interface ITask extends Document {
    title: string;
    description: string;
    dueDate: Date;
    status: string;
    priority: string;
    user: mongoose.Types.ObjectId;
}

const TaskSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date, default: Date.now }, 
    status: { type: String, enum: ['pending', 'in_progress', 'completed'], default: 'pending' }, 
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' }, 
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true } 
});

const Task = mongoose.model<ITask>('Task', TaskSchema);

export default Task;
