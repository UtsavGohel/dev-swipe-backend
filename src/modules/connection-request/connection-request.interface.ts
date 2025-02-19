import { Document } from 'mongoose';

export interface ConnectionRequest extends Document {
  fromUserId: string;
  toUserId: string;
  status: string;
}
