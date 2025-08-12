import { Test, TestingModule } from '@nestjs/testing';
import { AchatTypeService } from './achat-type.service';

describe('AchatTypeService', () => {
  let service: AchatTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AchatTypeService],
    }).compile();

    service = module.get<AchatTypeService>(AchatTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
