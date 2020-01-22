import { Test, TestingModule } from '@nestjs/testing';
import { UnburdenService } from './unburden.service';

describe('UnburdenService', () => {
  let service: UnburdenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UnburdenService],
    }).compile();

    service = module.get<UnburdenService>(UnburdenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
