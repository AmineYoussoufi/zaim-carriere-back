import { Test, TestingModule } from '@nestjs/testing';
import { BonService } from './bon.service';

describe('BonService', () => {
  let service: BonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BonService],
    }).compile();

    service = module.get<BonService>(BonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
