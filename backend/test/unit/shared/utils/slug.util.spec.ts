import { generateSlug, generateUniqueSlug } from '@shared/utils/slug.util';

describe('Slug Utility', () => {
  describe('generateSlug', () => {
    it('should convert text to lowercase slug', () => {
      expect(generateSlug('Hello World')).toBe('hello-world');
    });

    it('should remove special characters', () => {
      expect(generateSlug('Hello@World!')).toBe('helloworld');
      expect(generateSlug('Test#Event$2024')).toBe('testevent2024');
    });

    it('should replace spaces with hyphens', () => {
      expect(generateSlug('My Event Title')).toBe('my-event-title');
    });

    it('should handle multiple spaces', () => {
      expect(generateSlug('Hello    World')).toBe('hello-world');
    });

    it('should trim leading and trailing spaces', () => {
      expect(generateSlug('  Hello World  ')).toBe('hello-world');
    });

    it('should handle empty string', () => {
      expect(generateSlug('')).toBe('');
    });

    it('should handle underscores', () => {
      expect(generateSlug('hello_world_test')).toBe('hello-world-test');
    });

    it('should remove leading and trailing hyphens', () => {
      expect(generateSlug('-hello-world-')).toBe('hello-world');
    });
  });

  describe('generateUniqueSlug', () => {
    it('should generate slug with suffix', () => {
      expect(generateUniqueSlug('Hello World', '123')).toBe('hello-world-123');
    });

    it('should generate slug without suffix', () => {
      expect(generateUniqueSlug('Hello World')).toBe('hello-world');
    });

    it('should handle empty suffix', () => {
      expect(generateUniqueSlug('Test Event', '')).toBe('test-event');
    });
  });
});
