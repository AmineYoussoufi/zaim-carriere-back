import { Test, TestingModule } from '@nestjs/testing';
import { CarburantController } from './carburant.controller';
import { CarburantService } from './carburant.service';

describe('CarburantController', () => {
  let controller: CarburantController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarburantController],
      providers: [CarburantService],
    }).compile();

    controller = module.get<CarburantController>(CarburantController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
