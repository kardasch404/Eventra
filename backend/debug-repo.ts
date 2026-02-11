import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { EventRepository } from './src/infrastructure/database/repositories/event.repository';
import { EventStatus } from './src/shared/enums/event-status.enum';

async function check() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const eventRepo = app.get(EventRepository);
  
  const result = await eventRepo.findWithFilters(
    { status: EventStatus.PUBLISHED },
    { page: 1, limit: 3 }
  );
  
  console.log('\nEvents from repository:');
  result.data.forEach((event, i) => {
    console.log(`\nEvent ${i + 1}: ${event.title}`);
    console.log('Location object:', event.location);
    console.log('Location.city:', event.location?.city);
    console.log('Location keys:', event.location ? Object.keys(event.location) : 'null');
  });
  
  await app.close();
}

check()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
