import { db } from '.';
import { usersTable } from './schema';
import { eq } from 'drizzle-orm';

const user: typeof usersTable.$inferInsert = {
  name: 'John',
  age: 30,
  email: 'john@example.com',
};

console.log('Starting database seeding...');

try {
  await db.insert(usersTable).values(user);
  console.log('New user created!');

  const users = await db.select().from(usersTable);
  console.log('Getting all users from the database: ', users);

  await db
    .update(usersTable)
    .set({
      age: 31,
    })
    .where(eq(usersTable.email, user.email));
  console.log('User info updated!');

  await db.delete(usersTable).where(eq(usersTable.email, user.email));
  console.log('User deleted!');
  
  console.log('Seeding completed successfully!');
} catch (err) {
  console.error('Error seeding database:', err);
  process.exit(1);
} 