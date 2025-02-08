import {
  BadRequestException,
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

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async signUpUser(reqBody: CreateUserDto) {
    try {
      const { email, password, firstName, lastName, city, gender, age } =
        reqBody;

      if (!email || !password) {
        throw new BadRequestException('Missing Credentials');
      }

      const isUserExist = await this.userModel.findOne({ email: email });

      if (isUserExist) {
        throw new BadRequestException('Already Signed Up');
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
      });

      const isInserted = newUser.save();
      if (!isInserted) {
        throw new InternalServerErrorException();
      }

      return {
        message: 'SignUp Succesfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async validateUser(reqBody: SignInUserDto) {
    const { email, password } = reqBody;

    if (!email || !password) {
      throw new BadRequestException('Missing Credentials');
    }

    const user = await this.userModel.findOne({ email: email });

    if (!user) {
      throw new UnauthorizedException('Invalid Credential');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid Credential');
    }

    //and add more validatioj on fnam and lnam, password strong

    return user;
  }

  async getUser() {
    return {
      message: 'Succesfully Auth',
    };
  }
}
