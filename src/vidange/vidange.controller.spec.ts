import { Test, TestingModule } from '@nestjs/testing';
import { VidangeController } from './vidange.controller';
import { VidangeService } from './vidange.service';

describe('VidangeController', () => {
  let controller: VidangeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VidangeController],
      providers: [VidangeService],
    }).compile();

    controller = module.get<VidangeController>(VidangeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
