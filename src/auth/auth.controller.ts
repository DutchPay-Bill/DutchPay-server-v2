import {
  Controller,
  Post,
  Body,
  UseFilters,
  Get,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dto/create-user.dto';
import { ErrorCatch } from 'src/common/filters/error-catch.filter';
import { AuthService } from './auth.service';
import { PhoneDto } from './dto/check-phone-number.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Controller('users')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwt: JwtService,
  ) {}

  @Post()
  @UseFilters(ErrorCatch)
  async registerByPhone(@Body() createUserDto: CreateUserDto) {
    try {
      const result =
        await this.authService.registerUserbyPhoneService(createUserDto);
      return {
        success: true,
        message: 'User registered successfully',
        data: result,
      };
    } catch (error: any) {
      throw error;
    }
  }

  @Post()
  @UseFilters(ErrorCatch)
  async checkPhoneNumber(@Body() phone: PhoneDto) {
    try {
      const result = await this.authService.checkRegisteredPhoneService(phone);
      return {
        success: true,
        message: 'Phone Number is available to register',
        data: result,
      };
    } catch (error: any) {
      throw error;
    }
  }

  @Post()
  @UseFilters(ErrorCatch)
  async loginByPhoneNumber(
    @Body() userData: LoginUserDto,
    @Req() req: any,
    @Res() res: any,
  ) {
    try {
      const result = await this.authService.loginUserService(userData);
      const token = await result.accessToken;
      const oneWeekInSeconds = 7 * 24 * 3600;
      res.cookie('access_token', token, {
        maxAge: oneWeekInSeconds * 1000,
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
      });
      return {
        success: true,
        message: 'User logged in successfully.',
        data: result,
      };
    } catch (error: any) {
      throw error;
    }
  }

  @Get('v1/auth/google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('v1/auth/google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req: any, @Res() res: any) {
    try {
      const user = req.user;
      if (!user) {
        return res.redirect(`${process.env.FE_URL}/google-auth/failed`);
      }
      const payload = {
        id: req.user,
      };
      console.log('userID', payload);
      const token = this.jwt.sign(payload, { expiresIn: '7d' });
      const oneWeekInSeconds = 7 * 24 * 3600;
      res.cookie('access_token', token, {
        maxAge: oneWeekInSeconds * 1000,
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
      });
      return res.redirect(`${process.env.FE_URL}/google-auth/success`);
    } catch (error) {
      console.error(error);
      return res.redirect(`${process.env.FE_URL}/google-auth/failed`);
    }
  }
}
