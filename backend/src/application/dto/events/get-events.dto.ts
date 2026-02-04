import { EventStatus } from '@shared/enums/event-status.enum';

export class GetEventsDto {
  status?: EventStatus;
  organizerId?: string;
}
