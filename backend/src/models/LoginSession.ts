import mongoose, { Document, Schema } from 'mongoose';

export interface ILoginSession extends Document {
  user: mongoose.Types.ObjectId;
  loginTime: Date;
  logoutTime?: Date;
  ipAddress?: string;
  userAgent?: string;
  sessionDuration?: number; // in seconds
  isActive: boolean;
}

const LoginSessionSchema = new Schema<ILoginSession>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    loginTime: {
      type: Date,
      default: Date.now,
      required: true,
    },
    logoutTime: {
      type: Date,
      default: null,
    },
    ipAddress: {
      type: String,
      default: null,
    },
    userAgent: {
      type: String,
      default: null,
    },
    sessionDuration: {
      type: Number, // Duration in seconds
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
LoginSessionSchema.index({ user: 1, loginTime: -1 });
LoginSessionSchema.index({ isActive: 1 });
LoginSessionSchema.index({ loginTime: -1 });

// Method to end session
LoginSessionSchema.methods.endSession = function() {
  this.logoutTime = new Date();
  this.isActive = false;
  this.sessionDuration = Math.floor((this.logoutTime.getTime() - this.loginTime.getTime()) / 1000);
  return this.save();
};

export default mongoose.model<ILoginSession>('LoginSession', LoginSessionSchema);
