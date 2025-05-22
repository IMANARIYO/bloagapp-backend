import prisma from "../prisma/client.js"
import { passHashing } from "../src/utils/index.js"

import { getRandomImagePath } from "./imagespath.js"



// Helper functions
const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min

const getRandomDate = (year, month) => {
  const startDate = new Date(year, month, 1)
  const endDate = new Date(year, month + 1, 0)
  const randomTime =
    startDate.getTime() +
    Math.random() * (endDate.getTime() - startDate.getTime())
  return new Date(randomTime)
}

export const seedUsers = async () => {
  try {
    // 1. Hash the passwords
    const adminHashedPassword = await passHashing('admin123')
    const userHashedPassword = await passHashing('user123')

    // 2. Insert the fixed admin + user
    await prisma.user.createMany({
      data: [
        {
          username: 'admin',
          email: 'admin@gmail.com',
          password: adminHashedPassword,
          profilePicture: getRandomImagePath(),
          role: 'admin',
          fullNames: 'Imanariyobaptiste',
          gender: 'male',
          phoneNumber: '0787795163',
          createdAt: new Date('2024-01-01T00:00:00Z'),
          updatedAt: new Date('2024-01-01T00:00:00Z'),
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
          createdAt: new Date('2024-02-01T00:00:00Z'),
          updatedAt: new Date('2024-02-01T00:00:00Z'),
        },
      ],
      skipDuplicates: true, // in case they already exist
    })

    console.log('Admin and user seeded successfully!')

    // 3. Generate additional users
    const numberOfAdditionalUsers = 20
    const usernames = [
      'johndoe',
      'janedoe',
      'alice',
      'bob',
      'charlie',
      'dave',
      'eve',
      'frank',
      'grace',
      'heidi',
    ]
    const domains = ['example.com', 'mail.com', 'test.com']
    const firstNames = [
      'John',
      'Jane',
      'Alice',
      'Bob',
      'Charlie',
      'Dave',
      'Eve',
      'Frank',
      'Grace',
      'Heidi',
    ]
    const lastNames = [
      'Doe',
      'Smith',
      'Johnson',
      'Brown',
      'Taylor',
      'Anderson',
      'Thomas',
      'Jackson',
      'White',
      'Harris',
    ]
    const currentYear = new Date().getFullYear()

    const additionalUsers = Array.from({ length: numberOfAdditionalUsers }).map(
      (_, i) => {
        const firstName = firstNames[i % firstNames.length]
        const lastName = lastNames[i % lastNames.length]
        const username = `${firstName.toLowerCase()}${i + 3}`
        const emailDomain = domains[i % domains.length]
        const email = `${username}@${emailDomain}`
        const fullNames = `${firstName} ${lastName}`
        const month = getRandomInt(0, 11)
        const createdAt = getRandomDate(currentYear, month)
        const updatedAt = getRandomDate(currentYear, month)

        return {
          username,
          email,
          password: userHashedPassword,
          profilePicture: getRandomImagePath(),
          role: 'user',
          fullNames,
          gender: i % 2 === 0 ? 'male' : 'female',
          phoneNumber: `0787795${String(i + 20).padStart(2, '0')}`,
          createdAt,
          updatedAt,
        }
      }
    )

    await prisma.user.createMany({
      data: additionalUsers,
      skipDuplicates: true,
    })

    console.log('Additional users seeded successfully!')
  } catch (error) {
    console.error('Error seeding users:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the seeder if this file is invoked directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedUsers().catch(console.error)
}
