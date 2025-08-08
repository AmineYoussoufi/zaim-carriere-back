// src/vehicule/interceptors/document-vehicule.interceptor.ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Injectable()
export class DocumentVehiculeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): any {
    const fileInterceptor = FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/vehicles/documents',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (
          !file.originalname.match(/\.(jpg|jpeg|png|pdf|doc|docx|xls|xlsx)$/)
        ) {
          return callback(
            new Error('Only image, PDF and Office files are allowed!'),
            false,
          );
        }
        callback(null, true);
      },
      limits: {
        fileSize: 1024 * 1024 * 10, // 10MB
      },
    });

    return new fileInterceptor().intercept(context, next);
  }
}
