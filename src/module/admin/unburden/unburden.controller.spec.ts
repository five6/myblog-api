import { Test, TestingModule } from '@nestjs/testing';
import { UnburdenController } from './unburden.controller';

describe('Unburden Controller', () => {
  let controller: UnburdenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnburdenController],
    }).compile();

    controller = module.get<UnburdenController>(UnburdenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
