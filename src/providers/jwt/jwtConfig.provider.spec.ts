import { Test, TestingModule } from '@nestjs/testing';

import { JwtConfigProvider } from './jwtConfig.provider';

describe('JwtProvider', () => {
  let provider: JwtConfigProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtConfigProvider],
    }).compile();

    provider = module.get<JwtConfigProvider>(JwtConfigProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
