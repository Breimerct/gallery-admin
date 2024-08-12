import { ValidateMongoIdGuard } from './validate-mongo-id.guard';

describe('ValidateMongoIdGuard', () => {
  it('should be defined', () => {
    expect(new ValidateMongoIdGuard()).toBeDefined();
  });
});
