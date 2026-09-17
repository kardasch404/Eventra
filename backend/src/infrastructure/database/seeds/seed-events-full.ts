import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../../app.module';
import { fullEventsSeedData } from './events-full.seed';
import { v7 as uuidv7 } from 'uuid';

async function seedFullEvents() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const eventModel = app.get('EventModel');
    const userModel = app.get('UserModel');

    // Find admin user as organizer
    const admin = await userModel.findOne({ email: 'admin@eventra.ma' });
    if (!admin) {
      console.error('❌ Admin user not found!');
      return;
    }

    console.log(`🌱 Starting to seed ${fullEventsSeedData.length} events...\n`);

    let created = 0;
    let skipped = 0;

    for (const eventData of fullEventsSeedData) {
      // Check if event already exists
      const exists = await eventModel.findOne({ slug: eventData.slug });

      if (exists) {
        console.log(`⏭️  Skipping: ${eventData.title} (already exists)`);
        skipped++;
        continue;
      }

      // Create the event
      const event = new eventModel({
        _id: uuidv7(),
        ...eventData,
        organizer: admin._id,
        bookedCount: Math.floor(Math.random() * (eventData.capacity * 0.6)),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await event.save();
      console.log(`✅ Created: ${event.title} (${event.category} - ${event.location.city})`);
      created++;
    }

    console.log(`\n✅ Full event seeding completed!`);
    console.log(`   Created: ${created} events`);
    console.log(`   Skipped: ${skipped} events`);
    console.log(`   Total: ${created + skipped} events processed`);
  } catch (error) {
    console.error('❌ Error seeding events:', error);
  } finally {
    await app.close();
  }
}

seedFullEvents();
