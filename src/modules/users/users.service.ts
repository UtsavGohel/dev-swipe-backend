import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.interface';
import { SignInUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async signUpUser(reqBody: CreateUserDto, res) {
    try {
      const {
        email,
        password,
        firstName,
        lastName,
        city,
        gender,
        age,
        userImage,
      } = reqBody;

      if (!email || !password) {
        throw new BadRequestException('Missing Credentials');
      }

      const isUserExist = await this.userModel.findOne({ email: email });

      if (isUserExist) {
        throw new BadRequestException('Email already exists');
      }

      const salt = await bcrypt.genSalt(10);

      const hashPassword = await bcrypt.hash(password, salt);

      const newUser = await new this.userModel({
        email,
        password: hashPassword,
        firstName,
        lastName,
        city,
        gender,
        age,
        userImage,
      });

      const isInserted = await newUser.save();

      if (!isInserted) {
        throw new InternalServerErrorException();
      }

      await this.authService.signInUser({ email, password }, res);

      return {
        message: 'SignUp Succesfully',
        success: true,
        data: isInserted,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async editProfile(req, reqBody: UpdateUserDto) {
    const userId = req.user.sub;

    const {
      firstName,
      lastName,
      userImage,
      age,
      city,
      gender,
      designation,
      experience,
      education,
      bio,
      website,
      github,
      skills,
    } = reqBody;

    const isUpdated = await this.userModel.updateOne(
      { _id: userId },
      {
        firstName,
        lastName,
        age,
        city,
        gender,
        userImage,
        designation,
        experience,
        education,
        bio,
        website,
        github,
        skills,
      },
    );

    if (!isUpdated) {
      throw new InternalServerErrorException();
    }
    const userDetails = await this.getUserProfile(req);

    return {
      message: 'Profile updated succesfully',
      data: userDetails,
      success: true,
    };
  }

  async changePassword(req, reqBody: UpdateUserDto) {
    const userId = req.user.sub;

    const { password } = reqBody;

    if (!password) {
      throw new BadRequestException('Missing password');
    }

    const salt = await bcrypt.genSalt(10);

    const hashPassword = await bcrypt.hash(password, salt);

    const user = await this.userModel.findOne({ _id: userId });

    const userLastPassword = user.password;

    const isSameLastPassword = await bcrypt.compare(
      hashPassword,
      userLastPassword,
    );

    if (isSameLastPassword) {
      throw new BadRequestException(
        'Password update failed. Please try again with a new password.',
      );
    }

    const isUpdated = await this.userModel.updateOne(
      { _id: userId },
      {
        password: hashPassword,
      },
    );

    if (!isUpdated) {
      throw new InternalServerErrorException();
    }

    return {
      message: 'Passowrd updated succesfully',
      success: true,
    };
  }

  async getUserProfile(req) {
    const userId = req.user.sub;

    if (!userId) {
      throw new BadRequestException('Invalid User');
    }

    const getUser = await this.userModel.findOne(
      { _id: userId },
      {
        firstName: 1,
        lastName: 1,
        city: 1,
        userImage: 1,
        age: 1,
        gender: 1,
        designation: 1,
        experience: 1,
        education: 1,
        bio: 1,
        website: 1,
        github: 1,
        skills: 1,
      },
    );

    return {
      data: getUser,
      success: true,
    };
  }
}
