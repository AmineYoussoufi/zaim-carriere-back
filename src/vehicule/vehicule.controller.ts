import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  NotFoundException,
  StreamableFile,
  Res,
  Header,
  Query,
} from '@nestjs/common';
import { VehiculeService } from './vehicule.service';
import { CreateVehiculeDto } from './dto/create-vehicule.dto';
import { UpdateVehiculeDto } from './dto/update-vehicule.dto';
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'fs';
import { join } from 'path';
import { Response } from 'express';
import { DocumentVehiculeInterceptor } from './interceptors/document-vehicule.interceptor';

@Controller('vehicule')
export class VehiculeController {
  constructor(private readonly vehiculeService: VehiculeService) {}

  @Post()
  create(@Body() createVehiculeDto: CreateVehiculeDto) {
    return this.vehiculeService.create(createVehiculeDto);
  }

  @Get()
  findAll() {
    return this.vehiculeService.findAll();
  }

  @Get('/locals')
  findLocals() {
    return this.vehiculeService.findLocals();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vehiculeService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateVehiculeDto: UpdateVehiculeDto,
  ) {
    return this.vehiculeService.update(+id, updateVehiculeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vehiculeService.remove(+id);
  }

  @Post(':id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.vehiculeService.addDocument(id, file);
  }

  @Post(':id/documents')
  @UseInterceptors(DocumentVehiculeInterceptor)
  async addDocument(
    @Param('id', ParseIntPipe) id: number,
    @Body() createDocumentDto: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.vehiculeService.addDocument(id, createDocumentDto, file);
  }

  @Get(':id/documents')
  async getDocuments(
    @Param('id', ParseIntPipe) id: number,
    @Query('type') type?: string,
  ) {
    const documents = await this.vehiculeService.getVehicleDocuments(id);
    return type ? documents.filter((doc) => doc.type === type) : documents;
  }

  @Get(':id/documents/:documentId')
  async getDocument(
    @Param('id', ParseIntPipe) id: number,
    @Param('documentId', ParseIntPipe) documentId: number,
  ) {
    return this.vehiculeService.getVehicleDocument(id, documentId);
  }

  @Patch(':id/documents/:documentId')
  @UseInterceptors(DocumentVehiculeInterceptor)
  async updateDocument(
    @Param('id', ParseIntPipe) id: number,
    @Param('documentId', ParseIntPipe) documentId: number,
    @Body() updateDocumentDto: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.vehiculeService.updateVehicleDocument(
      id,
      documentId,
      updateDocumentDto,
      file,
    );
  }

  @Delete(':id/documents/:documentId')
  async removeDocument(
    @Param('id', ParseIntPipe) id: number,
    @Param('documentId', ParseIntPipe) documentId: number,
  ) {
    return this.vehiculeService.removeVehicleDocument(id, documentId);
  }

  @Get(':id/documents/:documentId/download')
  @Header('Content-Type', 'application/octet-stream')
  @Header('Content-Disposition', 'attachment')
  async downloadDocument(
    @Param('id', ParseIntPipe) id: number,
    @Param('documentId', ParseIntPipe) documentId: number,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const document = await this.vehiculeService.getVehicleDocument(
      id,
      documentId,
    );
    if (!document.filePath) {
      throw new NotFoundException('No file associated with this document');
    }
    res.set({ 'Content-Type': document.mimeType });
    const file = createReadStream(join(process.cwd(), document.filePath));
    return new StreamableFile(file);
  }

  @Get(':id/documents/:documentId/view')
  async viewDocument(
    @Param('id', ParseIntPipe) id: number,
    @Param('documentId', ParseIntPipe) documentId: number,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const document = await this.vehiculeService.getVehicleDocument(
      id,
      documentId,
    );
    if (!document.filePath) {
      throw new NotFoundException('No file associated with this document');
    }
    res.set({ 'Content-Type': document.mimeType });
    const file = createReadStream(join(process.cwd(), document.filePath));
    return new StreamableFile(file);
  }
}
