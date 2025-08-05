import { Injectable } from '@nestjs/common';
import { CreateVehiculeDto } from './dto/create-vehicule.dto';
import { UpdateVehiculeDto } from './dto/update-vehicule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicule } from './entities/vehicule.entity';

@Injectable()
export class VehiculeService {
  constructor(
    @InjectRepository(Vehicule)
    private repository: Repository<Vehicule>,
  ) {}
  async create(createUserDto: CreateVehiculeDto) {
    return await this.repository.save(createUserDto);
  }

  async findAll() {
    return await this.repository.find({
      relations: {
        client: true,
        chauffeur: true, // Include the chauffeur relation
      },
    });
  }

  async findLocals() {
    return await this.repository.find({
      where: {
        type: 'Local',
      },
      relations: {
        chauffeur: true, // Include the chauffeur relation
      },
    });
  }

  async findOne(id: number) {
    return await this.repository.findOne({
      where: { id: id },
      relations: {
        client: true,
        chauffeur: true,
        piecesDeRechange: true,
        bons: true,
        carburants: true,
        vidanges: true,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateVehiculeDto) {
    return await this.repository.update({ id: id }, updateUserDto);
  }

  async remove(id: number) {
    return await this.repository.delete(id);
  }
}
