import mongoose, { Schema, Document } from 'mongoose';
import Task from './taskModel'

export interface IUser extends Document {
  fullname: string;
  email: string;
  password: string;
  tasks: mongoose.Types.ObjectId[]; 
}

const UserSchema: Schema = new Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }]
});

export default mongoose.model<IUser>('User', UserSchema);
