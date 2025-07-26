import { Test, TestingModule } from '@nestjs/testing';
import { EntreeService } from './entree.service';

describe('EntreeService', () => {
  let service: EntreeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EntreeService],
    }).compile();

    service = module.get<EntreeService>(EntreeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
