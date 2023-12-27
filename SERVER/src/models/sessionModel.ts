import mongoose, { Document } from 'mongoose';
import generateSessionCode from '../utils/generateSessionCode';

export interface ISession extends Document {
  startTime: Date;
  endTime: Date;
  creatorId: typeof mongoose.Schema.ObjectId;
  active: boolean;
  code?: string;
  amountOfPlayers: number;
}

const sessionSchema = new mongoose.Schema<ISession>(
  {
    code: { type: String },
    amountOfPlayers: Number,
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
    active: Boolean,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
// set and initial value of zero to number of players when the schema is created
sessionSchema.pre('save', function (this: ISession, next) {
  if (this.isNew) {
    this.amountOfPlayers = 0;
    next();
  }

  next();
});

sessionSchema.pre('save', async function (this: ISession, next) {
  if (!this.isNew) next();

  // generate new session code
  const sessionCode = generateSessionCode();
  // check if code already exist
  const existingSession = await Session.findOne({
    code: sessionCode,
  });

  // carrys out the entire process if code already exist
  if (existingSession) {
    return next();
  }
  this.code = sessionCode;
  next();
});

const Session = mongoose.model<ISession>('Session', sessionSchema);

export default Session;
