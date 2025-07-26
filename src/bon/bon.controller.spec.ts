import { Test, TestingModule } from '@nestjs/testing';
import { BonController } from './bon.controller';
import { BonService } from './bon.service';

describe('BonController', () => {
  let controller: BonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BonController],
      providers: [BonService],
    }).compile();

    controller = module.get<BonController>(BonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
