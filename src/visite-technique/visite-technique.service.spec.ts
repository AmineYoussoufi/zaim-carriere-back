import { Test, TestingModule } from '@nestjs/testing';
import { VisiteTechniqueService } from './visite-technique.service';

describe('VisiteTechniqueService', () => {
  let service: VisiteTechniqueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VisiteTechniqueService],
    }).compile();

    service = module.get<VisiteTechniqueService>(VisiteTechniqueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
