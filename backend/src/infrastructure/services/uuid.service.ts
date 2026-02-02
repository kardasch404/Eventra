import { Injectable } from '@nestjs/common';
import { uuidv7 } from 'uuidv7';

@Injectable()
export class UuidService {
  generate(): string {
    return uuidv7();
  }

  isValid(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
}
