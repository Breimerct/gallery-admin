import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from './auth.controller';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { AuthService } from './auth.service';
import { CreateUserDto } from '@/user/dto/create-user.dto';
import { ResponseUserDto } from '@/user/dto/response-user.dto';
import { UpdatePassDto } from './dto/update-pass.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const userDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'testPassword',
        name: 'Test',
        lastName: 'User',
      };

      const expectedResult: AuthResponseDto = {
        user: new ResponseUserDto({
          _id: 'some-user-id',
          name: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          password: 'hashedPassword',
        }),
        token: 'generated-jwt-token',
      };

      jest.spyOn(service, 'register').mockResolvedValue(expectedResult);

      const result = await controller.register(userDto);

      expect(result).toEqual(expectedResult);
      expect(service.register).toHaveBeenCalledWith(userDto);
    });
  });

  describe('login', () => {
    it('should log in with email and password', async () => {
      const loginDto: AuthLoginDto = {
        email: 'test@example.com',
        password: 'testPassword',
      };

      const expectedResult: AuthResponseDto = {
        user: new ResponseUserDto({
          _id: 'some-user-id',
          name: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          password: 'hashedPassword',
        }),
        token: 'generated-jwt-token',
      };

      jest.spyOn(service, 'login').mockResolvedValue(expectedResult);

      const result = await controller.login(loginDto);

      expect(result).toEqual(expectedResult);
      expect(service.login).toHaveBeenCalledWith(loginDto);
    });
  });

  describe('updatePassword', () => {
    it('should update password of a user', async () => {
      const id = 'test-id';
      const passwordDto: UpdatePassDto = {
        oldPassword: 'oldPassword123',
        newPassword: 'newPassword123',
      };

      const expectedResult: ResponseUserDto = new ResponseUserDto({
        _id: id,
        name: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'hashedNewPassword',
      });

      jest.spyOn(service, 'updatePassword').mockResolvedValue(expectedResult);

      const result = await controller.updatePassword(id, passwordDto);

      expect(result).toEqual(expectedResult);
      expect(service.updatePassword).toHaveBeenCalledWith(id, passwordDto);
    });
  });
});
