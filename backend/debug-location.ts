import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Location } from './src/core/value-objects/location.vo';

async function check() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const eventModel = app.get<Model<any>>(getModelToken('EventDocument'));
  
  const sampleEvent = await eventModel.findOne({ 'location.city': 'Casablanca' }).lean();
  console.log('\nDatabase location data:');
  console.log(JSON.stringify(sampleEvent?.location, null, 2));
  
  if (sampleEvent?.location) {
    const loc = new Location(sampleEvent.location);
    console.log('\nLocation Value Object:');
    console.log({ mode: loc.mode, city: loc.city, country: loc.country, address: loc.address });
  }
  
  await app.close();
}

check()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
