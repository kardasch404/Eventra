import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../../app.module';

async function checkEvents() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const eventModel = app.get('EventModel');
  
  const total = await eventModel.countDocuments();
  console.log('\n📊 Total events in DB:', total);
  
  const published = await eventModel.countDocuments({ status: 'PUBLISHED' });
  console.log('✅ Published events:', published);
  
  const draft = await eventModel.countDocuments({ status: 'DRAFT' });
  console.log('📝 Draft events:', draft);
  
  const events = await eventModel.find({ status: 'PUBLISHED' }).select('title category location.city').lean();
  console.log('\n📋 Events list:\n');
  events.forEach((e: any, i: number) => {
    console.log(`${i+1}. ${e.title} - ${e.category} - ${e.location?.city || 'No city'}`);
  });
  
  // Group by category
  const byCategory: any = {};
  events.forEach((e: any) => {
    const cat = e.category || 'NO_CATEGORY';
    byCategory[cat] = (byCategory[cat] || 0) + 1;
  });
  console.log('\n🏷️  Events by Category:');
  Object.entries(byCategory).forEach(([cat, count]) => {
    console.log(`  ${cat}: ${count}`);
  });
  
  // Group by city
  const byCity: any = {};
  events.forEach((e: any) => {
    const city = e.location?.city || 'NO_CITY';
    byCity[city] = (byCity[city] || 0) + 1;
  });
  console.log('\n🌍 Events by City:');
  Object.entries(byCity).forEach(([city, count]) => {
    console.log(`  ${city}: ${count}`);
  });
  
  await app.close();
}

checkEvents().catch(console.error);
