import { Test, TestingModule } from '@nestjs/testing';
import { StockOperationService } from './stock-operation.service';

describe('StockOperationService', () => {
  let service: StockOperationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StockOperationService],
    }).compile();

    service = module.get<StockOperationService>(StockOperationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
