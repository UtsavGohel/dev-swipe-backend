import { Document } from 'mongoose';

export interface User extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: number;
  userImage: string;
  age: number;
  city: string;
  designation: string;
  bio: string;
  experience: string;
  education: string;
  github: string;
  website: string;
  skills: string;
}
