import { Test, TestingModule } from '@nestjs/testing';
import { StockOperationController } from './stock-operation.controller';
import { StockOperationService } from './stock-operation.service';

describe('StockOperationController', () => {
  let controller: StockOperationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockOperationController],
      providers: [StockOperationService],
    }).compile();

    controller = module.get<StockOperationController>(StockOperationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
