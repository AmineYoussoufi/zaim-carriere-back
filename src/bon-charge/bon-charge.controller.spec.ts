import { Test, TestingModule } from '@nestjs/testing';
import { BonChargeController } from './bon-charge.controller';
import { BonChargeService } from './bon-charge.service';

describe('BonChargeController', () => {
  let controller: BonChargeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BonChargeController],
      providers: [BonChargeService],
    }).compile();

    controller = module.get<BonChargeController>(BonChargeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
