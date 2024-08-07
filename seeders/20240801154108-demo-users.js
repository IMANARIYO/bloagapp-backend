import { models } from "../src/models/index.js";
import { passHashing } from "../src/utils/passwordfunctions.js";
import { getRandomImagePath, imagePaths } from "./imagespath.js";

const { User } = models;
// Function to get a random image path

// Define the seedUsers function
export const seedUsers = async () => {
  try {
    // Hash the passwords for admin and regular users
    const adminHashedPassword = await passHashing('admin123');
    const userHashedPassword = await passHashing('user123');

    // First, insert the specific admin and user
    await User.bulkCreate([
      {
        username: 'admin',
        email: 'admin@gmail.com',
        password: adminHashedPassword,
        profilePicture: getRandomImagePath(),
        role: 'admin',
        fullNames: 'Imanariyobaptiste',
        gender: 'male',
        phoneNumber: '0787795163'
      },
      {
        username: 'user',
        email: 'user@gmailyy.com',
        fullNames: 'User Full Name',
        password: userHashedPassword,
        profilePicture: getRandomImagePath(),
        role: 'user',
        gender: 'male',
        phoneNumber: '0787795163'
      }
    ]);

    console.log('Admin and user seeded successfully!');

    // Generate and insert additional users
    const numberOfAdditionalUsers = 20; // Adjust as needed
    const additionalUsers = [];

    for (let i = 0; i < numberOfAdditionalUsers; i++) {
      additionalUsers.push({
        username: `user${i + 3}`, // Continue numbering from user3
        email: `user${i + 3}@example.com`,
        password: userHashedPassword,
        profilePicture: getRandomImagePath(),
        role: 'user',
        fullNames: `User ${i + 3}`,
        gender: i % 2 === 0 ? 'male' : 'female', // Alternate gender
        phoneNumber: `07877951${i + 20}` // Generate dummy phone numbers
      });
    }

    // Bulk create additional users
    await User.bulkCreate(additionalUsers);

    console.log('Additional users seeded successfully!');

    // Optionally fetch and log the inserted users to verify
    // const insertedUsers = await User.findAll({
    //   where: {
    //     username: ['admin', 'user'].concat(additionalUsers.map(user => user.username))
    //   }
    // });
    // console.log('Inserted Users:', insertedUsers);
  } catch (error) {
    console.error('Error seeding users:', error);
  }
};

// Use ES6 import.meta.url to check if the file is being run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedUsers().catch(console.error);
}
