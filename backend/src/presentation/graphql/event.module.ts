import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventResolver } from './resolvers/event.resolver';
import { CreateEventUseCase } from '@application/use-cases/events/create-event.use-case';
import { UpdateEventUseCase } from '@application/use-cases/events/update-event.use-case';
import { PublishEventUseCase } from '@application/use-cases/events/publish-event.use-case';
import { CancelEventUseCase } from '@application/use-cases/events/cancel-event.use-case';
import { GetEventsUseCase } from '@application/use-cases/events/get-events.use-case';
import { EventSchema } from '@infrastructure/database/schemas/event.schema';
import { EventRepository } from '@infrastructure/database/repositories/event.repository';
import { UuidService } from '@infrastructure/services/uuid.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Event', schema: EventSchema }])],
  providers: [
    EventResolver,
    CreateEventUseCase,
    UpdateEventUseCase,
    PublishEventUseCase,
    CancelEventUseCase,
    GetEventsUseCase,
    UuidService,
    {
      provide: 'IEventRepository',
      useClass: EventRepository,
    },
  ],
})
export class EventModule {}
