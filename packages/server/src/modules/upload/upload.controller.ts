import { Controller, Post, Delete, Param, UseInterceptors, UploadedFile, UploadedFiles, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { multerOptions, imageMulterOptions } from './multer.options';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('文件上传')
@ApiBearerAuth()
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('file')
  @Roles('admin', 'super_admin')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: '上传单个文件' })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser('id') userId: number,
  ) {
    const record = await this.uploadService.saveFile(file, userId);
    return {
      id: record.id,
      url: record.fileUrl,
      originalName: record.originalName,
      fileSize: record.fileSize,
      mimeType: record.mimeType,
    };
  }

  @Post('files')
  @Roles('admin', 'super_admin')
  @UseInterceptors(FilesInterceptor('files', 10, multerOptions))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: '上传多个文件（最多10个）' })
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @CurrentUser('id') userId: number,
  ) {
    const records = await this.uploadService.saveFiles(files, userId);
    return records.map((r) => ({
      id: r.id,
      url: r.fileUrl,
      originalName: r.originalName,
      fileSize: r.fileSize,
      mimeType: r.mimeType,
    }));
  }

  @Post('image')
  @Roles('admin', 'super_admin')
  @UseInterceptors(FileInterceptor('file', imageMulterOptions))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: '上传图片' })
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser('id') userId: number,
  ) {
    const record = await this.uploadService.saveFile(file, userId);
    return {
      id: record.id,
      url: record.fileUrl,
      originalName: record.originalName,
      fileSize: record.fileSize,
    };
  }

  @Delete(':id')
  @Roles('admin', 'super_admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '删除文件' })
  async deleteFile(@Param('id', ParseIntPipe) id: number) {
    return this.uploadService.deleteRecord(id);
  }
}
