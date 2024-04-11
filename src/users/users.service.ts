import { Injectable } from '@nestjs/common';
import { PrismaService } from '../db/db.service';
import { ErrorHandler } from '../common/filters/error-handler';
import { UserDto } from './dto/user.dto';
import { ProfileDto } from './dto/profile.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfileService(user: UserDto) {
    try {
      const userProfile = await this.prisma.client.users.findUnique({
        where: { id: user.id },
      });
      if (!userProfile) {
        throw new ErrorHandler({
          success: false,
          message: 'User not found or not registered yet',
          status: 404,
        });
      }
      return userProfile;
    } catch (error: any) {
      console.error(error);
      throw new ErrorHandler({
        success: false,
        status: error.status || 500,
        message: error.message || 'An error occurred',
      });
    }
  }

  async updateProfileService(user: UserDto, profile: ProfileDto) {
    try {
      const editProfile = await this.prisma.client.users.update({
        where: { id: user.id },
        data: {
          username: profile.username,
          password: profile.password,
          fullname: profile.fullname,
          phone_number: profile.phone_number,
          email: profile.email,
          bio: profile.bio,
          dob: profile.dob,
          photo_profile: profile.photo_profile,
        },
      });
      return editProfile;
    } catch (error: any) {
      console.error(error);
      throw new ErrorHandler({
        success: false,
        status: error.status || 500,
        message: error.message || 'An error occurred',
      });
    }
  }

  async deleteUserService(user: UserDto) {
    try {
      const deletedUser = await this.prisma.client.users.delete({
        where: { id: user.id },
      });
      return deletedUser;
    } catch (error: any) {
      console.error(error);
      throw new ErrorHandler({
        success: false,
        status: error.status || 500,
        message: error.message || 'An error occurred',
      });
    }
  }
}
