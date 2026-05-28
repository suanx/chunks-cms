import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { HttpException, HttpStatus } from '@nestjs/common';

const uploadDir = process.env.UPLOAD_DIR || './uploads';

// 文件魔数 (Magic Numbers) 映射 — 用于二次校验文件真实类型
const MIME_SIGNATURES: Record<string, number[][]> = {
  'video/mp4': [[0x66, 0x74, 0x79, 0x70]], // ftyp at offset 4
  'video/webm': [[0x1A, 0x45, 0xDF, 0xA3]], // EBML header
  'image/jpeg': [[0xFF, 0xD8, 0xFF]],
  'image/png': [[0x89, 0x50, 0x4E, 0x47]],
  'image/gif': [[0x47, 0x49, 0x46, 0x38]],
  'image/webp': [[0x52, 0x49, 0x46, 0x46]], // RIFF header (WebP)
};

// 校验文件魔数是否匹配声明的 MIME 类型
function validateMimeType(buffer: Buffer, expectedMime: string): boolean {
  const signatures = MIME_SIGNATURES[expectedMime];
  if (!signatures) return true; // 无签名定义的类型，跳过魔数校验
  return signatures.some(sig =>
    sig.every((byte, i) => buffer[i] === byte),
  );
}

export const multerOptions = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = join(uploadDir, 'files');
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
      cb(null, uniqueName);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'video/mp4', 'video/webm',
      'image/jpeg', 'image/png', 'image/webp', 'image/gif',
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new HttpException(`不支持的文件类型: ${file.mimetype}，仅允许: ${allowedMimes.join(', ')}`, HttpStatus.BAD_REQUEST), false);
    }
  },
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB
    files: 1, // 单次最多上传 1 个文件
  },
};

export const imageMulterOptions = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = join(uploadDir, 'images');
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
      cb(null, uniqueName);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new HttpException('只允许上传图片文件', HttpStatus.BAD_REQUEST), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
};

export const videoMulterOptions = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = join(uploadDir, 'videos');
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
      cb(null, uniqueName);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['video/mp4', 'video/webm'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new HttpException(`只允许上传视频文件 (mp4/webm)，收到: ${file.mimetype}`, HttpStatus.BAD_REQUEST), false);
    }
  },
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB
  },
};

/**
 * 验证上传的文件 buffer 是否与声明的 MIME 类型匹配（魔数校验）
 * 适用于在 controller 中拿到 Multer file 后的二次校验
 */
export function verifyFileBuffer(file: Express.Multer.File): void {
  if (!file.buffer || file.buffer.length < 12) return; // 非 memoryStorage 或过小则跳过
  if (MIME_SIGNATURES[file.mimetype] && !validateMimeType(file.buffer, file.mimetype)) {
    throw new HttpException(
      `文件内容与声明类型不匹配: ${file.mimetype}，疑似伪造文件扩展名`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
