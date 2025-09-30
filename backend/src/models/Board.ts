import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IColumn {
  id: string;
  title: string;
  color?: string;
  position: number;
}

export interface IBoard extends Document {
  title: string;
  description?: string;
  columns: IColumn[];
  teamMembers: Types.ObjectId[];
  createdBy: Types.ObjectId;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const columnSchema = new Schema<IColumn>({
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  color: {
    type: String,
    default: '#6b7280'
  },
  position: {
    type: Number,
    required: true,
    default: 0
  }
}, { _id: false });

const boardSchema = new Schema<IBoard>({
  title: {
    type: String,
    required: [true, 'Please add a board title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  columns: {
    type: [columnSchema],
    default: [
      { id: 'todo', title: 'To Do', color: '#ef4444', position: 0 },
      { id: 'in-progress', title: 'In Progress', color: '#f59e0b', position: 1 },
      { id: 'completed', title: 'Completed', color: '#10b981', position: 2 }
    ]
  },
  teamMembers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for better query performance
boardSchema.index({ createdBy: 1 });
boardSchema.index({ teamMembers: 1 });

export const Board = mongoose.model<IBoard>('Board', boardSchema);