import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { EventType } from '../types/event.type';
import { PaginatedEventsType } from '../types/paginated-events.type';
import { CreateEventInput, UpdateEventInput, EventFiltersInput } from '../types/event.input';
import { CreateEventUseCase } from '@application/use-cases/events/create-event.use-case';
import { UpdateEventUseCase } from '@application/use-cases/events/update-event.use-case';
import { PublishEventUseCase } from '@application/use-cases/events/publish-event.use-case';
import { CancelEventUseCase } from '@application/use-cases/events/cancel-event.use-case';
import { GetEventsUseCase } from '@application/use-cases/events/get-events.use-case';
import { GqlAuthGuard } from '@presentation/guards/gql-auth.guard';
import { CurrentUser } from '@presentation/decorators/current-user.decorator';
import { DateTime } from '@core/value-objects/date-time.vo';
import { HeroImage } from '@core/value-objects/hero-image.vo';
import { Location } from '@core/value-objects/location.vo';
import { Inject } from '@nestjs/common';
import { IEventRepository } from '@core/interfaces/event.repository.interface';
import { Event } from '@core/entities/event.entity';
import { UpdateEventDto } from '@application/dto/events/update-event.dto';

@Resolver(() => EventType)
export class EventResolver {
  constructor(
    private readonly createEventUseCase: CreateEventUseCase,
    private readonly updateEventUseCase: UpdateEventUseCase,
    private readonly publishEventUseCase: PublishEventUseCase,
    private readonly cancelEventUseCase: CancelEventUseCase,
    private readonly getEventsUseCase: GetEventsUseCase,
    @Inject('IEventRepository')
    private readonly eventRepository: IEventRepository,
  ) {}

  @Query(() => PaginatedEventsType)
  async events(
    @Args('filters', { nullable: true }) filters?: EventFiltersInput,
  ): Promise<PaginatedEventsType> {
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;

    const result = await this.eventRepository.findWithFilters(
      {
        status: filters?.status,
        organizerId: filters?.organizerId,
        category: filters?.category,
        type: filters?.type,
        search: filters?.search,
      },
      { page, limit },
    );

    // Debug logging
    if (result.data.length > 0) {
      const firstEvent = result.data[0];
      console.log('\n=== RESOLVER DEBUG ===');
      console.log('First event location:', firstEvent.location);
      console.log('Location keys:', firstEvent.location ? Object.keys(firstEvent.location) : 'null');
      console.log('City value:', firstEvent.location?.city);
    }

    return {
      events: result.data.map(this.mapEventToGraphQL),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  @Query(() => EventType, { nullable: true })
  async event(@Args('id') id: string): Promise<EventType | null> {
    const event = await this.eventRepository.findById(id);
    return event ? this.mapEventToGraphQL(event) : null;
  }

  @Query(() => EventType, { nullable: true })
  async eventBySlug(@Args('slug') slug: string): Promise<EventType | null> {
    const event = await this.eventRepository.findBySlug(slug);
    return event ? this.mapEventToGraphQL(event) : null;
  }

  @Mutation(() => EventType)
  @UseGuards(GqlAuthGuard)
  async createEvent(
    @Args('input') input: CreateEventInput,
    @CurrentUser() user: { sub: string },
  ): Promise<EventType> {
    const startDate = new Date(input.dateTime.start);
    const endDate = new Date(input.dateTime.end);

    // Calculate duration string
    const durationMs = endDate.getTime() - startDate.getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    const duration = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

    // Generate display string
    const display = startDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: input.dateTime.timezone || 'UTC',
    });

    const event = await this.createEventUseCase.execute(
      {
        title: input.title,
        summary: input.summary,
        description: input.description,
        category: input.category,
        type: input.type,
        hero: new HeroImage(input.hero),
        dateTime: new DateTime({
          start: startDate,
          end: endDate,
          timezone: input.dateTime.timezone,
          display,
          duration,
        }),
        location: new Location({
          mode: input.type, // Use event type as location mode (ONLINE or IN_PERSON)
          country: input.location.country,
          city: input.location.city,
          address: input.location.address,
          venue: input.location.venue,
          coordinates: input.location.coordinates,
        }),
        capacity: input.capacity,
        highlights: input.highlights,
      },
      user.sub,
    );

    return this.mapEventToGraphQL(event);
  }

  @Mutation(() => EventType)
  @UseGuards(GqlAuthGuard)
  async updateEvent(
    @Args('id') id: string,
    @Args('input') input: UpdateEventInput,
    @CurrentUser() user: { sub: string },
  ): Promise<EventType> {
    const updateData: Record<string, unknown> = { ...input };

    if (input.hero) {
      updateData.hero = new HeroImage(input.hero);
    }

    if (input.dateTime) {
      const startDate = new Date(input.dateTime.start);
      const endDate = new Date(input.dateTime.end);

      // Calculate duration string
      const durationMs = endDate.getTime() - startDate.getTime();
      const hours = Math.floor(durationMs / (1000 * 60 * 60));
      const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
      const duration = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

      // Generate display string
      const display = startDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: input.dateTime.timezone || 'UTC',
      });

      updateData.dateTime = new DateTime({
        start: startDate,
        end: endDate,
        timezone: input.dateTime.timezone,
        display,
        duration,
      });
    }

    if (input.location) {
      updateData.location = new Location({
        mode: input.type || 'IN_PERSON', // Use event type or default
        ...input.location,
      });
    }

    const event = await this.updateEventUseCase.execute(id, updateData as UpdateEventDto, user.sub);
    return this.mapEventToGraphQL(event);
  }

  @Mutation(() => EventType)
  @UseGuards(GqlAuthGuard)
  async publishEvent(
    @Args('id') id: string,
    @CurrentUser() user: { sub: string },
  ): Promise<EventType> {
    const event = await this.publishEventUseCase.execute(id, user.sub);
    return this.mapEventToGraphQL(event);
  }

  @Mutation(() => EventType)
  @UseGuards(GqlAuthGuard)
  async cancelEvent(
    @Args('id') id: string,
    @CurrentUser() user: { sub: string },
  ): Promise<EventType> {
    const event = await this.cancelEventUseCase.execute(id, user.sub);
    return this.mapEventToGraphQL(event);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteEvent(
    @Args('id') id: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @CurrentUser() _user: { sub: string },
  ): Promise<boolean> {
    await this.eventRepository.delete(id);
    return true;
  }

  private mapEventToGraphQL(event: Event): EventType {
    return {
      id: event.id,
      slug: event.slug,
      title: event.title,
      summary: event.summary,
      description: event.description,
      category: event.category,
      type: event.type,
      status: event.status,
      hero: event.hero
        ? {
            url: event.hero.url,
            alt: event.hero.alt,
            width: event.hero.width,
            height: event.hero.height,
          }
        : undefined,
      dateTime: {
        start: event.dateTime.start.toISOString(),
        end: event.dateTime.end.toISOString(),
        timezone: event.dateTime.timezone,
        display: event.dateTime.display,
        duration: event.dateTime.duration,
      },
      location: event.location
        ? {
            mode: event.location.mode,
            country: event.location.country,
            city: event.location.city,
            address: event.location.address,
            venue: event.location.venue,
            coordinates: event.location.coordinates,
          }
        : undefined,
      capacity: event.capacity,
      bookedCount: event.bookedCount,
      organizerId: event.organizerId,
      highlights: event.highlights,
      availableSeats: event.availableSeats(),
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
    };
  }
}
