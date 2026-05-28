import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { VideosService } from './videos.service';
import { Video } from './entities/video.entity';

describe('VideosService', () => {
  let service: VideosService;

  const mockRepo = {
    find: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue(null),
    findAndCount: jest.fn().mockResolvedValue([[], 0]),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    increment: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      getMany: jest.fn().mockResolvedValue([]),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VideosService,
        { provide: getRepositoryToken(Video), useValue: mockRepo },
        { provide: 'RedisService', useValue: { get: jest.fn(), set: jest.fn(), incr: jest.fn(), keys: jest.fn(), del: jest.fn() } },
        { provide: 'AuditService', useValue: { log: jest.fn() } },
      ],
    }).compile();

    service = module.get<VideosService>(VideosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated videos', async () => {
      const result = await service.findAll({ page: 1, pageSize: 10 });
      expect(result).toHaveProperty('list');
      expect(result).toHaveProperty('total');
    });
  });
});
