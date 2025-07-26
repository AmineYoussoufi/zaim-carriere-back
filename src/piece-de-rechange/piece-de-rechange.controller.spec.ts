import { Test, TestingModule } from '@nestjs/testing';
import { PieceDeRechangeController } from './piece-de-rechange.controller';
import { PieceDeRechangeService } from './piece-de-rechange.service';

describe('PieceDeRechangeController', () => {
  let controller: PieceDeRechangeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PieceDeRechangeController],
      providers: [PieceDeRechangeService],
    }).compile();

    controller = module.get<PieceDeRechangeController>(
      PieceDeRechangeController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
