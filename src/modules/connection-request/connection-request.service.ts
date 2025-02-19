import { BadRequestException, Injectable } from '@nestjs/common';

import mongoose, { Model } from 'mongoose';
import { User } from '../users/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { ConnectionRequest } from './connection-request.interface';
import { GetUserFeedDto } from './dto/user-feed.dto';

@Injectable()
export class ConnectionRequestService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('ConnectionRequest')
    private readonly connectionRequestModel: Model<ConnectionRequest>,
  ) {}

  async sendConnectionRequest({
    req,
    toUserId,
    status,
  }: {
    req;
    toUserId: string;
    status: string;
  }) {
    const fromUserId = req.user.sub;

    if (!['ignore', 'interested'].includes(status)) {
      throw new BadRequestException('Invalid status');
    }

    const isValidUserId = mongoose.Types.ObjectId.isValid(toUserId);

    if (!isValidUserId) {
      throw new BadRequestException('Please provide a valid user ID.');
    }

    const isValidToUserId = await this.userModel.findById(toUserId);

    if (!isValidToUserId) {
      throw new BadRequestException('Provide valid user ID');
    }

    if (fromUserId === toUserId) {
      throw new BadRequestException(
        'You cannot send a connection request to yourself.',
      );
    }

    const isRequestExist = await this.connectionRequestModel.find({
      $or: [
        { fromUserId: fromUserId, toUserId: toUserId }, // Request from `fromUserId` to `toUserId`
        { fromUserId: toUserId, toUserId: fromUserId }, // Request from `toUserId` to `fromUserId`
      ],
    });

    if (isRequestExist.length) {
      throw new BadRequestException('Request already exists');
    }
    const centralizedData = {
      fromUserId: fromUserId,
      toUserId: toUserId,
      status: status,
    };

    const insertedId =
      await this.connectionRequestModel.insertOne(centralizedData);

    if (!insertedId) {
      throw new BadRequestException('Error while creating records');
    }

    return {
      message: 'Connection request sent succesfully',
      data: insertedId,
    };
  }

  async reviewConnectionRequest({
    req,
    status,
    requestId,
  }: {
    req;
    status: string;
    requestId: string;
  }) {
    const validStatus = ['accepted', 'rejected'];

    if (!validStatus.includes(status)) {
      throw new BadRequestException('Invalid status');
    }

    const isValidrequestId = mongoose.Types.ObjectId.isValid(requestId);

    if (!isValidrequestId) {
      throw new BadRequestException('Please provide a valid request ID.');
    }

    const loggedInuserId = req.user.sub;

    const findRequest = await this.connectionRequestModel.findOne({
      _id: requestId,
      toUserId: loggedInuserId,
      status: 'interested',
    });

    if (!findRequest) {
      throw new BadRequestException('No connection request exist');
    }

    const isUpdated = await this.connectionRequestModel.updateOne(
      { _id: requestId },
      {
        status: status,
      },
    );

    if (!isUpdated) {
      throw new BadRequestException('Something went wrong');
    }

    return {
      message: `Connection request is ${status}`,
    };
  }

  async getRecievedConnectionRequest(req) {
    const loggedInuserId = req.user.sub;

    const findRequests = await this.connectionRequestModel
      .find({
        toUserId: loggedInuserId,
        status: 'interested',
      })
      .populate('fromUserId', 'firstName lastName photoUrl');

    if (!findRequests.length) {
      return {
        message: 'No data found',
        success: true,
      };
    }

    return {
      message: 'Success',
      success: true,
      data: findRequests,
    };
  }

  async getUserConnections(req) {
    const loggedInuserId = req.user.sub;

    const findConnection = await this.connectionRequestModel
      .find({
        $or: [
          {
            toUserId: loggedInuserId,
            status: 'accepted',
          },
          {
            fromUserId: loggedInuserId,
            status: 'accepted',
          },
        ],
      })
      .populate('fromUserId', 'firstName lastName photoUrl')
      .populate('toUserId', 'firstName lastName photoUrl');

    if (!findConnection) {
      throw new BadRequestException('No connection found');
    }

    const connectionData = findConnection.map((item) => {
      const fromUserIdData = item.fromUserId as unknown as Record<
        string,
        unknown
      >;

      if (fromUserIdData._id.toString() === loggedInuserId.toString()) {
        return item.toUserId;
      }
      return item.fromUserId;
    });

    return {
      message: 'Success',
      data: connectionData,
    };
  }

  async getUserFeed(req, reqBody: GetUserFeedDto) {
    const loggedInuserId = req.user.sub;

    const { start, limit = 10 } = reqBody;

    const startValue = start || 1;

    const limitValue = limit > 50 ? 50 : limit;

    const skip = (startValue - 1) * limitValue;

    const alreadyRequestedUser = await this.connectionRequestModel
      .find({
        $or: [{ fromUserId: loggedInuserId }, { toUserId: loggedInuserId }],
      })
      .select('fromUserId toUserId');

    const hideUserFromFeed = new Set();

    alreadyRequestedUser.forEach((user) => {
      hideUserFromFeed.add(user.fromUserId.toString());
      hideUserFromFeed.add(user.toUserId.toString());
    });

    const hideUserIds = [...hideUserFromFeed];

    const findUsers = await this.userModel
      .find({
        $and: [
          { _id: { $nin: hideUserIds } },
          { _id: { $ne: loggedInuserId } },
        ],
      })
      .select('firstName lastName')
      .skip(skip)
      .limit(limitValue);

    if (!findUsers.length) {
      return {
        success: true,
        data: findUsers || [],
      };
    }

    return {
      success: true,
      data: findUsers,
    };
  }
}
