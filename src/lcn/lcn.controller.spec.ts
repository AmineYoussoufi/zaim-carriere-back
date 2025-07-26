import { Test, TestingModule } from '@nestjs/testing';
import { LcnController } from './lcn.controller';
import { LcnService } from './lcn.service';

describe('LcnController', () => {
  let controller: LcnController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LcnController],
      providers: [LcnService],
    }).compile();

    controller = module.get<LcnController>(LcnController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
