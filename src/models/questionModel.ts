import mongoose, { Document } from 'mongoose';
import validator from 'validator';

export interface IQuestion extends Document {
  question: String;
  options: (string | number | boolean)[];
  answer: string | number | boolean;
  owner: typeof mongoose.Schema.ObjectId;
  sessionId: string;
}

const questionSchema = new mongoose.Schema<IQuestion>(
  {
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Question require an owner'],
    },
    sessionId: {
      type: String,
      required: [true, 'Questions must have a session'],
    },
    question: {
      type: String,
      required: [true, 'Question must have a question'],
    },
    options: {
      type: [{ type: String || Number, trim: true }],
      validate: {
        validator: function (this: IQuestion, options: any): boolean {
          return options.length <= 4 && options.length > 1;
        },
        message: 'Options must not be more than 4',
      },
      required: [true, 'Question must have options'],
    },
    answer: {
      type: String || Number,
      validate: {
        validator: function (this: IQuestion, val: string | number | boolean) {
          return this.options.includes(val);
        },
        message: 'Answer must be included in options',
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const Question = mongoose.model('Question', questionSchema);

export default Question;
