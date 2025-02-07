import { Schema } from 'mongoose';
import { isaValidEmail } from 'src/validator/user.validator';

export const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email) => {
          return isaValidEmail(email);
        },
      },
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    city: {
      type: String,
    },
    gender: {
      type: String,
    },
    age: {
      type: Number,
    },
  },
  {
    timestamps: true,
  },
);
