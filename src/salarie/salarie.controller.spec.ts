import { Test, TestingModule } from '@nestjs/testing';
import { SalarieController } from './salarie.controller';
import { SalarieService } from './salarie.service';

describe('SalarieController', () => {
  let controller: SalarieController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalarieController],
      providers: [SalarieService],
    }).compile();

    controller = module.get<SalarieController>(SalarieController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
