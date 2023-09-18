import mongoose, { Document } from 'mongoose';

export interface ISession extends Document {
  startTime: Date;
  endTime: Date;
  creatorId: typeof mongoose.Schema.ObjectId;
}

const sessionSchema = new mongoose.Schema<ISession>(
  {
    startTime: {
      type: Date,
      required: [true, 'A session must have a start time'],
    },
    endTime: {
      type: Date,
      required: [true, 'A session must have an end time'],
    },
    creatorId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A session needs a creator Id'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const Session = mongoose.model<ISession>('Session', sessionSchema);

export default Session;
