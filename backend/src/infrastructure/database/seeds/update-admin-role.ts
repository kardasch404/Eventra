import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../../app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from '../schemas/user.schema';

/**
 * Update admin user to have admin role
 */
async function updateAdminRole() {
  console.log('🔧 Updating admin user role...\n');
  
  const app = await NestFactory.createApplicationContext(AppModule);
  const userModel = app.get<Model<UserDocument>>(getModelToken('UserDocument'));

  const adminEmail = 'admin@eventra.co';
  const result = await userModel.findOneAndUpdate(
    { email: adminEmail },
    { roles: ['admin', 'organizer'] },
    { new: true }
  );

  if (result) {
    console.log(`✅ Updated user: ${result.email}`);
    console.log(`   Roles: ${result.roles?.join(', ') || 'none'}`);
  } else {
    console.log('❌ Admin user not found');
  }

  await app.close();
}

updateAdminRole()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Failed:', error);
    process.exit(1);
  });
