import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UploadRecord } from './entities/upload-record.entity';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private readonly uploadDir: string;

  constructor(
    @InjectRepository(UploadRecord)
    private readonly uploadRecordRepository: Repository<UploadRecord>,
  ) {
    this.uploadDir = process.env.UPLOAD_DIR || './uploads';
  }

  async saveFile(file: Express.Multer.File, uploaderId?: number): Promise<UploadRecord> {
    const fileUrl = `/uploads/${file.filename}`;
    const fileType = this.getFileType(file.mimetype);

    const record = this.uploadRecordRepository.create({
      originalName: file.originalname,
      storedName: file.filename,
      filePath: file.path,
      fileUrl,
      mimeType: file.mimetype,
      fileSize: file.size,
      fileType,
      uploaderId,
      status: 1,
    });

    return this.uploadRecordRepository.save(record);
  }

  async saveFiles(files: Express.Multer.File[], uploaderId?: number): Promise<UploadRecord[]> {
    const records = await Promise.all(
      files.map((file) => this.saveFile(file, uploaderId)),
    );
    return records;
  }

  async getRecord(id: number) {
    return this.uploadRecordRepository.findOne({ where: { id } });
  }

  async deleteRecord(id: number) {
    const record = await this.uploadRecordRepository.findOne({ where: { id } });
    if (record) {
      // Delete physical file
      try {
        if (fs.existsSync(record.filePath)) {
          fs.unlinkSync(record.filePath);
        }
      } catch (e) {
        this.logger.warn(`Failed to delete file: ${record.filePath}`);
      }
      await this.uploadRecordRepository.remove(record);
    }
    return { message: '删除成功' };
  }

  private getFileType(mimeType: string): number {
    if (mimeType.startsWith('image/')) return 1;
    if (mimeType.startsWith('video/')) return 2;
    if (mimeType.startsWith('audio/')) return 3;
    return 9; // other
  }
}
