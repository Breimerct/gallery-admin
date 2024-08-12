import { Test, TestingModule } from '@nestjs/testing';

import { AuthGuard } from './auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    authGuard = module.get<AuthGuard>(AuthGuard);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authGuard).toBeDefined();
  });

  it('should throw UnauthorizedException if no token is provided', async () => {
    const context = createMockExecutionContext({ authorization: undefined });

    await expect(authGuard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if token is invalid', async () => {
    const context = createMockExecutionContext({
      authorization: 'Bearer invalid-token',
    });

    (jwtService.verifyAsync as jest.Mock).mockRejectedValueOnce(new Error());

    await expect(authGuard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should allow access if token is valid', async () => {
    const context = createMockExecutionContext({
      authorization: 'Bearer valid-token',
    });

    const mockPayload = { userId: '123', username: 'testuser' };
    (jwtService.verifyAsync as jest.Mock).mockResolvedValueOnce(mockPayload);

    const result = await authGuard.canActivate(context);
    const request = context.switchToHttp().getRequest();

    expect(result).toBe(true);
    expect(request['user']).toEqual(mockPayload);
  });

  // Helper function to create a mock ExecutionContext
  function createMockExecutionContext(headers: { [key: string]: string }) {
    const request = {
      headers,
    } as Request;

    return {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as unknown as ExecutionContext;
  }
});
