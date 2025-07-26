import { Test, TestingModule } from '@nestjs/testing';
import { PieceDeRechangeService } from './piece-de-rechange.service';

describe('PieceDeRechangeService', () => {
  let service: PieceDeRechangeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PieceDeRechangeService],
    }).compile();

    service = module.get<PieceDeRechangeService>(PieceDeRechangeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
