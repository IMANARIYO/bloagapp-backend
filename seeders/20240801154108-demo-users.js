import { models } from "../src/models/index.js";
import { passHashing } from "../src/utils/passwordfunctions.js";
import { getRandomImagePath } from "./imagespath.js";

const { User } = models;

// Helper function to generate a random integer between min and max (inclusive)
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper function to generate a random date within a given year and month
const getRandomDate = (year, month) => {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
  return new Date(randomTime).toISOString(); // Return ISO string format
};

// Define the seedUsers function
export const seedUsers = async () => {
  try {
    // Hash the passwords for admin and regular users
    const adminHashedPassword = await passHashing('admin123');
    const userHashedPassword = await passHashing('user123');

    // Insert the specific admin and user
    await User.bulkCreate([
      {
        username: 'admin',
        email: 'admin@gmail.com',
        password: adminHashedPassword,
        profilePicture: getRandomImagePath(),
        role: 'admin',
        fullNames: 'Imanariyobaptiste',
        gender: 'male',
        phoneNumber: '0787795163',
        createdAt: new Date('2024-01-01T00:00:00Z').toISOString(),
        updatedAt: new Date('2024-01-01T00:00:00Z').toISOString(),
      },
      {
        username: 'user',
        email: 'user@gmail.com',
        password: userHashedPassword,
        profilePicture: getRandomImagePath(),
        role: 'user',
        fullNames: 'User Full Name',
        gender: 'male',
        phoneNumber: '0787795164',
        createdAt: new Date('2024-02-01T00:00:00Z').toISOString(),
        updatedAt: new Date('2024-02-01T00:00:00Z').toISOString(),
      }
    ]);

    console.log('Admin and user seeded successfully!');

    // Generate and insert additional users
    const numberOfAdditionalUsers = 20; // Adjust as needed
    const additionalUsers = [];
    const usernames = ['johndoe', 'janedoe', 'alice', 'bob', 'charlie', 'dave', 'eve', 'frank', 'grace', 'heidi'];
    const domains = ['example.com', 'mail.com', 'test.com'];
    const firstNames = ['John', 'Jane', 'Alice', 'Bob', 'Charlie', 'Dave', 'Eve', 'Frank', 'Grace', 'Heidi'];
    const lastNames = ['Doe', 'Smith', 'Johnson', 'Brown', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris'];
    const currentYear = new Date().getFullYear(); // Get the current year

    for (let i = 0; i < numberOfAdditionalUsers; i++) {
      const firstName = firstNames[i % firstNames.length];
      const lastName = lastNames[i % lastNames.length];
      const username = `${firstName.toLowerCase()}${i + 3}`;
      const emailDomain = domains[i % domains.length];
      const email = `${username}@${emailDomain}`;
      const fullName = `${firstName} ${lastName}`;
      const month = getRandomInt(0, 11); // Random month

      additionalUsers.push({
        username: username,
        email: email,
        password: userHashedPassword,
        profilePicture: getRandomImagePath(),
        role: 'user',
        fullNames: fullName,
        gender: i % 2 === 0 ? 'male' : 'female', // Alternate gender
        phoneNumber: `0787795${(i + 20).toString().padStart(2, '0')}`, // Generate dummy phone numbers
        createdAt: getRandomDate(currentYear, month),
        updatedAt: getRandomDate(currentYear, month),
      });
    }

    // Bulk create additional users
    await User.bulkCreate(additionalUsers);

    console.log('Additional users seeded successfully!');
  } catch (error) {
    console.error('Error seeding users:', error);
  }
};

// If this file is run directly, execute the seedUsers function
if (import.meta.url === `file://${process.argv[1]}`) {
  seedUsers().catch(console.error);
}
