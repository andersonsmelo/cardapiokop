import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { hash } from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { users } from '../src/db/schema';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    console.error('DATABASE_URL not set');
    process.exit(1);
}

const TARGET_EMAIL = process.env.TARGET_EMAIL || 'anderson.smelo@outlook.com';
const newPassword = process.env.NEW_PASSWORD;

if (!newPassword || newPassword.length < 8) {
    console.error('NEW_PASSWORD must be set and have at least 8 characters');
    process.exit(1);
}

const NEW_PASSWORD = newPassword;

const client = postgres(connectionString);
const db = drizzle(client);

async function updatePassword() {
    console.log(`Updating password for: ${TARGET_EMAIL}`);

    const passwordHash = await hash(NEW_PASSWORD, 12);

    const result = await db.update(users)
        .set({ passwordHash })
        .where(eq(users.email, TARGET_EMAIL))
        .returning({ id: users.id, email: users.email });

    if (result.length === 0) {
        console.error(`User not found: ${TARGET_EMAIL}`);
        await client.end();
        process.exit(1);
    }

    console.log(`Password updated successfully for: ${result[0].email}`);
    await client.end();
    process.exit(0);
}

updatePassword().catch((err) => {
    console.error('Failed:', err);
    process.exit(1);
});
