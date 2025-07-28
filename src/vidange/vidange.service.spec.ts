import { Test, TestingModule } from '@nestjs/testing';
import { VidangeService } from './vidange.service';

describe('VidangeService', () => {
  let service: VidangeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VidangeService],
    }).compile();

    service = module.get<VidangeService>(VidangeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
