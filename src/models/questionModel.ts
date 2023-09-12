import mongoose, { Document } from 'mongoose';
import validator from 'validator';

export interface IQuestion extends Document {
  question: String;
  options: String[] | number[] | boolean[];
  answer: String | number | boolean;
}

const questionSchema = new mongoose.Schema<IQuestion>(
  {
    question: {
      type: String,
      required: [true, 'Question must have a question'],
    },
    options: {
      type: [{ type: String || Number, trim: true }],
      validate: {
        validator: function (this: IQuestion, options: any): boolean {
          return options.length <= 4;
        },
        message: 'Options must not be more than 4',
      },
      required: [true, 'Question must have options'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
