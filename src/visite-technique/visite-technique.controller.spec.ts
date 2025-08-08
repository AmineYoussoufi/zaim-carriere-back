import { Test, TestingModule } from '@nestjs/testing';
import { VisiteTechniqueController } from './visite-technique.controller';
import { VisiteTechniqueService } from './visite-technique.service';

describe('VisiteTechniqueController', () => {
  let controller: VisiteTechniqueController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VisiteTechniqueController],
      providers: [VisiteTechniqueService],
    }).compile();

    controller = module.get<VisiteTechniqueController>(
      VisiteTechniqueController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
