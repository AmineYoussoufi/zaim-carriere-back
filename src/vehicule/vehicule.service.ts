// src/vehicule/vehicule.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicule } from './entities/vehicule.entity';
import { Document } from './entities/document.entity';
import { CreateVehiculeDto } from './dto/create-vehicule.dto';
import { UpdateVehiculeDto } from './dto/update-vehicule.dto';
import { Express } from 'express';

@Injectable()
export class VehiculeService {
  constructor(
    @InjectRepository(Vehicule)
    private repository: Repository<Vehicule>,
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
  ) {}

  async create(createUserDto: CreateVehiculeDto) {
    return await this.repository.save(createUserDto);
  }

  async findAll() {
    return await this.repository.find({
      relations: {
        client: true,
        chauffeur: true,
      },
    });
  }

  async findLocals() {
    return await this.repository.find({
      where: {
        type: 'Local',
      },
      relations: {
        chauffeur: true,
      },
    });
  }

  async findOne(id: number) {
    return await this.repository.findOne({
      where: { id },
      relations: {
        client: true,
        chauffeur: true,
        piecesDeRechange: {
          stock: true,
        },
        bons: true,
        carburants: true,
        vidanges: true,
        documents: true,
        visitesTechniques: true,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateVehiculeDto) {
    return await this.repository.update(id, updateUserDto);
  }

  async remove(id: number) {
    return await this.repository.delete(id);
  }

  async addDocument(
    vehiculeId: number,
    createDocumentDto: any,
    file?: Express.Multer.File,
  ): Promise<any> {
    const vehicule = await this.repository.findOne({
      where: { id: vehiculeId },
    });
    console.log('Vehicule found:', vehicule);
    console.log('Create Document DTO:', createDocumentDto);
    console.log('File:', file);
    if (!vehicule) {
      throw new NotFoundException(`Vehicle with ID ${vehiculeId} not found`);
    }

    const document: any = this.documentRepository.create({
      ...createDocumentDto,
      vehicule,
    });

    if (file) {
      document.filePath = file.path;
      document.originalFileName = file.originalname;
      document.fileSize = file.size;
      document.mimeType = file.mimetype;
    }

    return this.documentRepository.save(document);
  }

  async getVehicleDocuments(vehiculeId: number): Promise<Document[]> {
    return this.documentRepository.find({
      where: { vehicule: { id: vehiculeId } },
      order: { dateExpiration: 'ASC' },
    });
  }

  async getVehicleDocument(
    vehiculeId: number,
    documentId: number,
  ): Promise<Document> {
    const document = await this.documentRepository.findOne({
      where: { id: documentId, vehicule: { id: vehiculeId } },
    });

    if (!document) {
      throw new NotFoundException(
        `Document with ID ${documentId} not found for vehicle ${vehiculeId}`,
      );
    }

    return document;
  }

  async updateVehicleDocument(
    vehiculeId: number,
    documentId: number,
    updateDocumentDto: any,
    file?: Express.Multer.File,
  ): Promise<any> {
    const document = await this.getVehicleDocument(vehiculeId, documentId);
    Object.assign(document, updateDocumentDto);

    if (file) {
      // Delete old file if exists (implement this)
      document.filePath = file.path;
      document.originalFileName = file.originalname;
      document.fileSize = file.size;
      document.mimeType = file.mimetype;
    }

    return this.documentRepository.save(document);
  }

  async removeVehicleDocument(
    vehiculeId: number,
    documentId: number,
  ): Promise<void> {
    const document = await this.getVehicleDocument(vehiculeId, documentId);
    await this.documentRepository.remove(document);
  }
}
