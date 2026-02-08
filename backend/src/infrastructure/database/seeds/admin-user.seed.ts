import * as bcrypt from 'bcrypt';
import { uuidv7 } from 'uuidv7';

export const ADMIN_USER = {
  id: uuidv7(),
  email: 'admin@eventra.co',
  firstName: 'admin',
  lastName: 'admin',
  password: 'eventra', // Will be hashed
  isEmailVerified: true,
};

export async function hashPassword(plainPassword: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(plainPassword, saltRounds);
}

export async function getAdminUserData() {
  return {
    ...ADMIN_USER,
    password: await hashPassword(ADMIN_USER.password),
  };
}
