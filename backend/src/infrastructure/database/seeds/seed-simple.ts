import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { uuidv7 } from 'uuidv7';

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://admin:admin_pass@localhost:27018/eventra?authSource=admin';

async function seed() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    const connection = await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Seed Admin User
    console.log('👤 Seeding admin user...');

    const usersCollection = connection.connection.collection('userdocuments');

    const adminEmail = 'admin@eventra.co';

    const existingAdmin = await usersCollection.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('eventra', 10);
      const adminUser = {
        id: uuidv7(),
        email: adminEmail,
        password: hashedPassword,
        firstName: 'admin',
        lastName: 'admin',
        isEmailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await usersCollection.insertOne(adminUser);
      console.log(`✅ Created admin user: ${adminEmail}`);
      console.log(`   Password: eventra`);
      console.log(`   ID: ${adminUser.id}`);
    } else {
      console.log(`ℹ️  Admin user already exists: ${adminEmail}`);
    }

    console.log('✅ Seeding completed!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

void seed();
