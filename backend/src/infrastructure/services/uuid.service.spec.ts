import { Test, TestingModule } from '@nestjs/testing';
import { UuidService } from '@infrastructure/services/uuid.service';

describe('UuidService', () => {
  let service: UuidService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UuidService],
    }).compile();

    service = module.get<UuidService>(UuidService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generate', () => {
    it('should generate a valid UUID v7', () => {
      const uuid = service.generate();
      expect(uuid).toBeDefined();
      expect(typeof uuid).toBe('string');
      expect(uuid).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
    });

    it('should generate unique UUIDs', () => {
      const uuid1 = service.generate();
      const uuid2 = service.generate();
      expect(uuid1).not.toBe(uuid2);
    });
  });

  describe('isValid', () => {
    it('should return true for valid UUID v7', () => {
      const uuid = service.generate();
      expect(service.isValid(uuid)).toBe(true);
    });

    it('should return false for invalid UUID', () => {
      expect(service.isValid('invalid-uuid')).toBe(false);
      expect(service.isValid('12345678-1234-1234-1234-123456789012')).toBe(false);
      expect(service.isValid('')).toBe(false);
    });

    it('should return false for non-v7 UUID', () => {
      const uuidv4 = '550e8400-e29b-41d4-a716-446655440000';
      expect(service.isValid(uuidv4)).toBe(false);
    });
  });
});
