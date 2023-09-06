import mongoose, { Document } from 'mongoose';
import validator from 'validator';

enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}

export interface IUser extends Document {
  name: String;
  email: string;
  password: string;
  passwordConfirm: string;
  passwordResetAt: Date;
  role: UserRole;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: [true, 'User must have a name'] },
    email: {
      type: String,
      required: [true, 'User must have an email'],
      unique: true,
      trim: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'User must have a password'],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'User must input a passwordConfirm'],
      validate: {
        validator: function (this: IUser, val: string): boolean {
          return val === this.password;
        },
        message: 'Password Confirm must match Password',
      },
    },
    role: {
      type: String,
      required: [true, 'User must be assigned a role'],
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
    passwordResetAt: Date,
  },

  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const User = mongoose.model<IUser>('User', userSchema);
export default User;
