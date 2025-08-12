import { Test, TestingModule } from '@nestjs/testing';
import { AchatTypeController } from './achat-type.controller';
import { AchatTypeService } from './achat-type.service';

describe('AchatTypeController', () => {
  let controller: AchatTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AchatTypeController],
      providers: [AchatTypeService],
    }).compile();

    controller = module.get<AchatTypeController>(AchatTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
