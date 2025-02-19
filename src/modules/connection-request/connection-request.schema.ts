import mongoose from 'mongoose';

export const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', //reference to user collection
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', //reference to user collection
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ['ignore', 'interested', 'accepted', 'rejected'],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  { timestamps: true },
);

//composite index
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });
