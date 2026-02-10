import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../../app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from '../schemas/user.schema';
import { EventDocument } from '../schemas/event.schema';
import { uuidv7 } from 'uuidv7';
import { SEED_EVENTS } from './events.seed';

/**
 * Standalone event seeder script
 * 
 * Run with: npx ts-node -r tsconfig-paths/register src/infrastructure/database/seeds/seed-events.ts
 * Or: npm run seed:events (if added to package.json)
 */
async function seedEvents() {
  console.log('🎫 Starting event seeding...\n');
  
  const app = await NestFactory.createApplicationContext(AppModule);

  const userModel = app.get<Model<UserDocument>>(getModelToken('UserDocument'));
  const eventModel = app.get<Model<EventDocument>>(getModelToken('EventDocument'));

  // Find admin user to use as organizer
  const adminEmail = 'admin@eventra.co';
  const adminUser = await userModel.findOne({ email: adminEmail });

  if (!adminUser) {
    console.error('❌ Admin user not found. Please run the main seeder first: npm run seed');
    await app.close();
    process.exit(1);
  }

  console.log(`👤 Using organizer: ${adminUser.email} (${adminUser.id})\n`);

  let created = 0;
  let skipped = 0;

  for (const event of SEED_EVENTS) {
    const exists = await eventModel.findOne({ slug: event.slug });
    
    if (!exists) {
      const bookedCount = Math.floor(Math.random() * Math.floor(event.capacity * 0.3));
      
      await eventModel.create({
        id: uuidv7(),
        ...event,
        organizerId: adminUser.id,
        bookedCount,
      });
      
      console.log(`  ✓ Created: ${event.title}`);
      console.log(`    📍 ${event.location.city} | 📅 ${event.dateTime.display}`);
      console.log(`    🎟️ Capacity: ${event.capacity} | Booked: ${bookedCount}\n`);
      created++;
    } else {
      console.log(`  ℹ Skipped (exists): ${event.title}`);
      skipped++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✅ Event seeding completed!`);
  console.log(`   Created: ${created} events`);
  console.log(`   Skipped: ${skipped} events (already exist)`);
  console.log(`   Total:   ${SEED_EVENTS.length} events in seed data`);
  console.log('='.repeat(50));

  await app.close();
}

seedEvents()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Event seeding failed:', error);
    process.exit(1);
  });
