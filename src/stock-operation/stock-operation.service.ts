import { Injectable } from '@nestjs/common';
import { CreateStockOperationDto } from './dto/create-stock-operation.dto';
import { UpdateStockOperationDto } from './dto/update-stock-operation.dto';

@Injectable()
export class StockOperationService {
  create(createStockOperationDto: CreateStockOperationDto) {
    return 'This action adds a new stockOperation';
  }

  findAll() {
    return `This action returns all stockOperation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} stockOperation`;
  }

  update(id: number, updateStockOperationDto: UpdateStockOperationDto) {
    return `This action updates a #${id} stockOperation`;
  }

  remove(id: number) {
    return `This action removes a #${id} stockOperation`;
  }
}
