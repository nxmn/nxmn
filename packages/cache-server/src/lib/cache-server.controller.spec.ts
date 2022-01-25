import { Test } from '@nestjs/testing';
import { CacheServerController } from './cache-server.controller';

describe('CacheServerController', () => {
  let controller: CacheServerController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [],
      controllers: [CacheServerController],
    }).compile();

    controller = module.get(CacheServerController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
