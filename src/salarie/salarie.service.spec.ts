import { Test, TestingModule } from '@nestjs/testing';
import { SalarieService } from './salarie.service';

describe('SalarieService', () => {
  let service: SalarieService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SalarieService],
    }).compile();

    service = module.get<SalarieService>(SalarieService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
