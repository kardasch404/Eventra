# Database Seeding

## Admin User Credentials

The seeder creates an admin user with the following credentials:

- **Email**: `admin@eventra.co`
- **Password**: `eventra`
- **First Name**: `admin`
- **Last Name**: `admin`
- **Role**: Admin (with full permissions)

## Running the Seeder

### Option 1: Using npm script (Recommended)

```bash
cd backend
npm run seed
```

### Option 2: Using ts-node directly

```bash
cd backend
npx ts-node -r tsconfig-paths/register src/infrastructure/database/seeds/seed.ts
```

## What Gets Seeded

1. **Permissions** - All system permissions from `roles-permissions.seed.ts`
2. **Roles** - Admin and Participant roles
3. **Admin User** - The admin user with credentials above

## Notes

- The seeder is idempotent - it won't create duplicates if run multiple times
- The admin user's email is verified by default
- The password is hashed using bcrypt before storage
- Make sure MongoDB is running before executing the seeder

## Troubleshooting

If you encounter issues:

1. Ensure MongoDB is running: `docker-compose up -d mongodb`
2. Check your `.env` file has the correct `MONGODB_URI`
3. Verify all dependencies are installed: `npm install`
