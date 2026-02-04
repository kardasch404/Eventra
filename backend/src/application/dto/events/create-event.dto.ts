import { EventType } from '@shared/enums/event-type.enum';
import { DateTime } from '@core/value-objects/date-time.vo';
import { HeroImage } from '@core/value-objects/hero-image.vo';
import { Location } from '@core/value-objects/location.vo';
import { Highlight } from '@core/entities/event.entity';

export class CreateEventDto {
  title: string;
  summary: string;
  description: string[];
  category: string;
  type: EventType;
  hero: HeroImage;
  dateTime: DateTime;
  location: Location;
  capacity: number;
  highlights: Highlight[];
}
