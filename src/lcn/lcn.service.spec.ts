import { Test, TestingModule } from '@nestjs/testing';
import { LcnService } from './lcn.service';

describe('LcnService', () => {
  let service: LcnService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LcnService],
    }).compile();

    service = module.get<LcnService>(LcnService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
