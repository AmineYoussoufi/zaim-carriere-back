import { Test, TestingModule } from '@nestjs/testing';
import { BonChargeService } from './bon-charge.service';

describe('BonChargeService', () => {
  let service: BonChargeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BonChargeService],
    }).compile();

    service = module.get<BonChargeService>(BonChargeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
