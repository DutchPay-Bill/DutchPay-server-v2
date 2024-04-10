import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { PhoneDto } from '../dto/check-phone-number.dto';
import { PrismaService } from '../../db/db.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { ErrorHandler } from '../../common/filters/error-handler';
import { LoginUserDto } from '../dto/login-user.dto';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            client: {
              users: {
                findUnique: jest.fn(),
                create: jest.fn(),
              },
            },
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should check if a phone number is already registered', async () => {
    const phoneDto: PhoneDto = { phone_number: '1234567890' };
    jest.spyOn(prismaService.client.users, 'findUnique').mockResolvedValueOnce(null);

    const result = await service.checkRegisteredPhoneService(phoneDto);

    expect(result).toBeDefined();
  });

  it('should throw an error if the phone number is already registered', async () => {
    const phoneDto: PhoneDto = { phone_number: '1234567890' };
    jest.spyOn(prismaService.client.users, 'findUnique').mockResolvedValueOnce({
      id: null,
      username: '',
      password: '',
      fullname: '',
      phone_number: '1234567890',
      email: '',
      bio: '',
      dob: new Date(),
      photo_profile: '',
      created_at: new Date(),
      update_at: new Date(),
    });

    try {
      await service.checkRegisteredPhoneService(phoneDto);
      fail('Expected checkRegisteredPhoneService to throw an error, but it did not.');
    } catch (error) {
      expect(error).toBeInstanceOf(ErrorHandler);
    }
  });

  it('should register a user by phone', async () => {
    const createUserDto: CreateUserDto = {
      fullname: 'Test User',
      phone_number: '123456789',
      password: 'Password123',
    };

    jest.spyOn(prismaService.client.users, 'findUnique').mockResolvedValueOnce(null);
    jest.spyOn(prismaService.client.users, 'create').mockResolvedValueOnce(createUserDto as any);

    const result = await service.registerUserbyPhoneService(createUserDto);

    expect(result).toEqual(createUserDto);
  });

  it('should login a user by phone', async () => {
    const loginUserDto: LoginUserDto = {
      phone_number: '1234567890',
      password: 'abc123',
    };
    const foundUser = {
      id: 1,
      username: 'test',
      password: '$2b$10$hVdYFaVKG3U/9KViYfMNw.rEg9QaCFYgvAgcpWfNQt5PBpyFNStuu',
      fullname: 'Test User',
      phone_number: '1234567890',
      email: 'test@test.com',
      bio: 'test',
      dob: new Date(),
      photo_profile: 'test.com/test',
      created_at: new Date(),
      update_at: new Date(),
    };

    jest.spyOn(prismaService.client.users, 'findUnique').mockResolvedValueOnce(foundUser);

    const result = await service.loginUserService(loginUserDto);

    expect(result).toBeDefined();
  });

  it('should register a user by Google', async () => {
    const fullname = 'Test user';
    const email = 'test@test.com';

    jest.spyOn(prismaService.client.users, 'create').mockResolvedValueOnce({
      id: 1,
      username: 'test',
      password: '',
      fullname: 'Test user',
      phone_number: '1234567890',
      email: 'test@test.com',
      bio: 'test',
      dob: new Date(),
      photo_profile: 'test.com/test',
      created_at: new Date(),
      update_at: new Date(),
    });
    jest.spyOn(prismaService.client.users, 'findUnique').mockResolvedValueOnce({
      id: 1,
      username: 'test',
      password: '',
      fullname: 'Test user',
      phone_number: '1234567890',
      email: 'test@test.com',
      bio: 'test',
      dob: new Date(),
      photo_profile: 'test.com/test',
      created_at: new Date(),
      update_at: new Date(),
    });

    const result = await service.registerUserbyGoogleService(fullname, email);

    expect(result).toEqual(1);
    expect(prismaService.client.users.create).toHaveBeenCalledWith({
      data: { fullname, email },
    });
    expect(prismaService.client.users.findUnique).toHaveBeenCalledWith({
      where: { email },
    });
  });
});
