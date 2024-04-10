import { Controller, Post, Body, UseFilters, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from './auth.service';
import { PhoneDto } from './dto/check-phone-number.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ErrorCatch } from '../common/filters/error-catch.filter';
import { Request, Response } from 'express';

@Controller('/v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwt: JwtService,
  ) {}

  @Post('/register')
  @UseFilters(ErrorCatch)
  async registerByPhone(@Body() createUserDto: CreateUserDto) {
    try {
      const result = await this.authService.registerUserbyPhoneService(createUserDto);
      return {
        success: true,
        message: 'User registered successfully',
        data: result,
      };
    } catch (error: any) {
      throw error;
    }
  }

  @Post('/check-number')
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

  @Post('/login')
  @UseFilters(ErrorCatch)
  async loginByPhoneNumber(@Body() userData: LoginUserDto, @Req() req: Request, @Res() res: Response) {
    try {
      const result = await this.authService.loginUserService(userData);
      const payload = { id: result.user.id };
      const token = this.jwt.sign(payload);
      const oneWeekInSeconds = 7 * 24 * 3600;
      res.cookie('access_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
        maxAge: oneWeekInSeconds * 1000,
      });
      return res.json({
        success: true,
        message: 'User logged in successfully.',
        expiration: result.expiredToken,
      });
    } catch (error: any) {
      throw error;
    }
  }

  @Get('/google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('/google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    try {
      const user = req.user as { id: number };
      if (!user) {
        return res.redirect(`${process.env.FE_URL}/google-auth/failed`);
      }
      const payload = {
        id: user.id,
      };
      const token = this.jwt.sign(payload, { expiresIn: '7d' });
      // Mocking token for testing purpose
      // const token = 'dummy_token';
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

  @Post('/logout')
  @UseFilters(ErrorCatch)
  async userLogout(@Req() req: Request, @Res() res: Response) {
    try {
      const expirationDate = new Date('January 1, 2000');
      res.cookie('access_token', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        expires: expirationDate,
        path: '/',
      });
      return res.json({
        success: true,
        message: 'See you next time..!',
      });
    } catch (error: any) {
      throw error;
    }
  }
}
