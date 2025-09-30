import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  assignedTo?: Types.ObjectId;
  teamMember?: string;
  board: Types.ObjectId;
  column: string;
  position: number;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>({
  title: {
    type: String,
    required: [true, 'Please add a task title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  dueDate: {
    type: Date
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  teamMember: {
    type: String,
    trim: true
  },
  board: {
    type: Schema.Types.ObjectId,
    ref: 'Board',
    required: true
  },
  column: {
    type: String,
    required: true,
    default: 'todo'
  },
  position: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for better query performance
taskSchema.index({ board: 1, column: 1, position: 1 });
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ createdBy: 1 });

export const Task = mongoose.model<ITask>('Task', taskSchema);