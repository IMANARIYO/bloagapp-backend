import { models } from "../src/models/index.js";
import { getRandomImagePath } from "./imagespath.js";

export const getRandomCategory = () => {
  const randomIndex = Math.floor(Math.random() * POST_CATEGORIES.length);
  return POST_CATEGORIES[randomIndex];
};

const { Post } = models;

// Define the seedPosts function
export const POST_CATEGORIES = [
  'Technology',
  'Health',
  'Finance',
  'Education',
  'Entertainment',
  'Sports',
  'Lifestyle',
  'Travel'
];

export const seedPosts = async () => {
  try {
    // Insert the predefined posts
    await Post.bulkCreate([
      {
        title: 'First Post',
        content: 'This is the content of the first post.',
        category:  POST_CATEGORIES[1],
        authorId: 1, // Assuming the first user created in the users seeder has id 1
        image: getRandomImagePath(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Second Post',
        content: 'Content of the second post.',
        category: POST_CATEGORIES[0],
        authorId: 2, // Assuming the second user created in the users seeder has id 2
        image: getRandomImagePath(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    console.log('Predefined posts seeded successfully!');

    // Generate additional posts
    const numberOfAdditionalPosts = 20; // Adjust the number of additional posts
    const additionalPosts = [];

    for (let i = 0; i < numberOfAdditionalPosts; i++) {
      additionalPosts.push({
        title: `Post ${i + 3}`, // Continue numbering from Post 3
        content: `Content of post ${i + 3}.`,
        category:  POST_CATEGORIES[i % POST_CATEGORIES.length],
        authorId: (i % 19) + 1, // Cycle through 5 authors
        image: getRandomImagePath(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Bulk create additional posts
    await Post.bulkCreate(additionalPosts);

    console.log('Additional posts seeded successfully!');
  } catch (error) {
    console.error('Error seeding posts:', error);
  }
};

// Use ES6 import.meta.url to check if the file is being run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedPosts().catch(console.error);
}
