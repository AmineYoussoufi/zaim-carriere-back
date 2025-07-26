import { Test, TestingModule } from '@nestjs/testing';
import { SalaireController } from './salaire.controller';
import { SalaireService } from './salaire.service';

describe('SalaireController', () => {
  let controller: SalaireController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalaireController],
      providers: [SalaireService],
    }).compile();

    controller = module.get<SalaireController>(SalaireController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
