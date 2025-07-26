import { Test, TestingModule } from '@nestjs/testing';
import { CarburantService } from './carburant.service';

describe('CarburantService', () => {
  let service: CarburantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CarburantService],
    }).compile();

    service = module.get<CarburantService>(CarburantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
