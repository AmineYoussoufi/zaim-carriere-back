// src/stock/stock.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stock } from './entities/stock.entity';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
  ) {}

  async findAll(paginationDto: PaginationDto): Promise<any> {
    if (!paginationDto.page) {
      return this.stockRepository.find();
    }
    const { page = 1, limit = 10, search } = paginationDto;
    const skip = (page - 1) * limit;

    const query = this.stockRepository.createQueryBuilder('stock');

    if (search) {
      query.where('stock.name LIKE :search', { search: `%${search}%` });
    }

    const [data, total] = await query.skip(skip).take(limit).getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  findOne(id: number): Promise<Stock | null> {
    return this.stockRepository.findOneBy({ id });
  }

  findByType(type: string): Promise<Stock[]> {
    return this.stockRepository.find({
      where: { type },
    });
  }

  useQuantity(id: number, quantity: number): Promise<Stock | null> {
    return this.stockRepository.findOneBy({ id }).then((stock) => {
      if (stock) {
        stock.quantity -= quantity;
        return this.stockRepository.save(stock);
      }
      return null;
    });
  }

  create(stock: any): Promise<Stock> {
    return this.stockRepository.save(stock);
  }

  async update(id: number, stock: any): Promise<Stock> {
    await this.stockRepository.update(id, stock);
    return this.stockRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.stockRepository.delete(id);
  }

  async getbyNameAndUpdate(data: {
    productName: string;
    quantity: number;
  }): Promise<any> {
    let product = await this.stockRepository.findOneBy({
      name: data.productName,
    });
    if (product) {
      product.quantity += data.quantity;
    } else
      product = this.stockRepository.create({
        quantity: data.quantity,
        name: data.productName,
      });
    await this.stockRepository.save(product);
  }
}
