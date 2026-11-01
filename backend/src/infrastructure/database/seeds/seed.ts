import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../../app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from '../schemas/user.schema';
import { RoleDocument } from '../schemas/role.schema';
import { PermissionDocument } from '../schemas/permission.schema';
import { EventDocument } from '../schemas/event.schema';
import { Password } from '../../../core/value-objects/password.vo';
import { uuidv7 } from 'uuidv7';
import { SEED_PERMISSIONS, SEED_ROLES } from './roles-permissions.seed';
import { SEED_EVENTS } from './events.seed';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userModel = app.get<Model<UserDocument>>(getModelToken('UserDocument'));
  const roleModel = app.get<Model<RoleDocument>>(getModelToken('RoleDocument'));
  const permissionModel = app.get<Model<PermissionDocument>>(getModelToken('PermissionDocument'));
  const eventModel = app.get<Model<EventDocument>>(getModelToken('EventDocument'));

  console.log('🌱 Starting seeding...');

  // Seed Permissions
  console.log('📝 Seeding permissions...');
  for (const perm of SEED_PERMISSIONS) {
    const exists = await permissionModel.findOne({ slug: perm.slug });
    if (!exists) {
      await permissionModel.create({ id: uuidv7(), ...perm });
      console.log(`  ✓ Created permission: ${perm.slug}`);
    }
  }

  // Seed Roles
  console.log('👥 Seeding roles...');
  for (const role of SEED_ROLES) {
    const exists = await roleModel.findOne({ slug: role.slug });
    if (!exists) {
      await roleModel.create({ id: uuidv7(), ...role });
      console.log(`  ✓ Created role: ${role.name}`);
    }
  }

  // Seed Admin User
  console.log('👤 Seeding admin user...');
  const adminEmail = 'admin@eventra.co';
  const existingAdmin = await userModel.findOne({ email: adminEmail });

  if (!existingAdmin) {
    const hashedPassword = await Password.fromPlainText('eventra123');
    const adminUser = await userModel.create({
      id: uuidv7(),
      email: adminEmail,
      password: hashedPassword.getValue(),
      firstName: 'admin',
      lastName: 'admin',
      roles: ['admin', 'organizer'],
      isEmailVerified: true,
    });
    console.log(`  ✓ Created admin user: ${adminEmail}`);
    console.log(`    - Password: eventra123`);
    console.log(`    - ID: ${adminUser.id}`);

    // Seed Events (after admin user is created so we have an organizer ID)
    console.log('🎫 Seeding events...');
    for (const event of SEED_EVENTS) {
      const exists = await eventModel.findOne({ slug: event.slug });
      if (!exists) {
        await eventModel.create({
          id: uuidv7(),
          ...event,
          organizerId: adminUser.id,
          bookedCount: Math.floor(Math.random() * Math.floor(event.capacity * 0.3)), // Random booked count up to 30%
        });
        console.log(`  ✓ Created event: ${event.title}`);
      }
    }
  } else {
    console.log(`  ℹ Admin user already exists: ${adminEmail}`);

    // Still seed events if they don't exist
    console.log('🎫 Seeding events...');
    for (const event of SEED_EVENTS) {
      const exists = await eventModel.findOne({ slug: event.slug });
      if (!exists) {
        await eventModel.create({
          id: uuidv7(),
          ...event,
          organizerId: existingAdmin.id,
          bookedCount: Math.floor(Math.random() * Math.floor(event.capacity * 0.3)),
        });
        console.log(`  ✓ Created event: ${event.title}`);
      } else {
        console.log(`  ℹ Event already exists: ${event.title}`);
      }
    }
  }

  console.log('✅ Seeding completed!');
  await app.close();
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
