import mongoose, { Document } from 'mongoose';

export interface ITempUser extends Document {
  name: string;
  score: number;
  session_id: typeof mongoose.Schema.ObjectId;
  answers: any[];
}

const tempUserSchema = new mongoose.Schema<ITempUser>(
  {
    name: {
      type: String,
      required: [true, 'A temp user must have a name'],
    },
    score: {
      type: Number,
    },
    session_id: {
      type: mongoose.Schema.ObjectId,
      ref: 'Session',
      required: [true, 'A temp user must belong session'],
    },
    answers: [
      {
        question_id: {
          type: mongoose.Schema.ObjectId,
          ref: 'Question',
        },
        score: Number,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const TempUser = mongoose.model<ITempUser>('TempUser', tempUserSchema);

export default TempUser;
