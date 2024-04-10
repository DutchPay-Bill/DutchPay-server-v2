import { JwtService } from '@nestjs/jwt';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from '../dto/create-user.dto';
import { PhoneDto } from '../dto/check-phone-number.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { Request, Response } from 'express';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            registerUserbyPhoneService: jest.fn(),
            checkRegisteredPhoneService: jest.fn(),
            loginUserService: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('registerByPhone', () => {
    it('should register a user by phone', async () => {
      const createUserDto: CreateUserDto = {
        fullname: 'testuser',
        phone_number: '1234567890',
        password: 'abc123',
      };
      const expectedResult = {
        fullname: 'testuser',
        phone_number: '1234567890',
        password: 'abc123',
      };
      jest.spyOn(authService, 'registerUserbyPhoneService').mockResolvedValue(expectedResult as any);

      const result = await controller.registerByPhone(createUserDto);

      expect(result).toEqual({
        success: true,
        message: 'User registered successfully',
        data: expectedResult,
      });
    });
  });

  describe('checkPhoneNumber', () => {
    it('should check if a phone number is available', async () => {
      const phoneDto: PhoneDto = {
        phone_number: '1234567890',
      };
      const expectedResult = { phone_number: '1234567890' };
      (authService.checkRegisteredPhoneService as jest.Mock).mockResolvedValue(expectedResult);

      const result = await controller.checkPhoneNumber(phoneDto);

      expect(result).toEqual({
        success: true,
        message: 'Phone Number is available to register',
        data: expectedResult,
      });
    });
  });

  describe('loginByPhoneNumber', () => {
    it('should login a user by phone number', async () => {
      const userData: LoginUserDto = {
        phone_number: '1234567890',
        password: 'abc123',
      };
      const expectedResult = {
        user: { id: 1 },
        expiredToken: new Date(),
      };
      (authService.loginUserService as jest.Mock).mockResolvedValue(expectedResult);
      const req = {} as Request;
      const res = {
        json: jest.fn(),
        cookie: jest.fn(),
      } as any;

      await controller.loginByPhoneNumber(userData, req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'User logged in successfully.',
        expiration: expectedResult.expiredToken,
      });
      expect(jwtService.sign).toHaveBeenCalled();
    });
  });

  describe('googleAuthCallback', () => {
    it('should redirect to success URL if user exists', async () => {
      const mockRequest = {} as Request;
      const mockResponse = {
        redirect: jest.fn(),
        cookie: jest.fn(),
      } as unknown as Response;
      const mockUser = { id: 1 };

      mockRequest.user = mockUser;

      await controller.googleAuthCallback(mockRequest, mockResponse);

      expect(mockResponse.redirect).toHaveBeenCalledWith(`${process.env.FE_URL}/google-auth/success`);
      expect(mockResponse.cookie).toHaveBeenCalledWith('access_token', 'dummy_token', expect.any(Object));
    });
  });
});
