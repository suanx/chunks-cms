import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { Role } from '../users/entities/role.entity';

describe('AuthService', () => {
  let service: AuthService;

  const mockUserRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };
  const mockJwtService = { sign: jest.fn().mockReturnValue('mock-token'), decode: jest.fn() };
  const mockRedisService = { get: jest.fn(), set: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
        { provide: JwtService, useValue: mockJwtService },
        { provide: 'RedisService', useValue: mockRedisService },
        { provide: getRepositoryToken(Role), useValue: { find: jest.fn().mockResolvedValue([]) } },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return null for invalid credentials', async () => {
      mockUserRepo.findOne.mockResolvedValue(null);
      const result = await service.validateUser('nonexistent', 'password');
      expect(result).toBeNull();
    });
  });
});
