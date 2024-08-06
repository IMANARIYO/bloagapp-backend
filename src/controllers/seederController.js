import { seedUsers } from "./../../seeders/20240801154108-demo-users.js";
import { seedPosts } from "./../../seeders/20240801154110-demo-posts.js";
import { seedComments } from "./../../seeders/20240801154111-demo-comments.js";

export const seedDatabase = async (req, res) => {
  try {
    // Run each seeder
    await seedUsers()
    await seedPosts()
    await seedComments()

    res.status(200).json({ message: 'Database seeded successfully!' })
  } catch (error) {
    console.error('Error seeding database:', error)
    res.status(500).json({ message: 'Error seeding database', error })
  }
}
