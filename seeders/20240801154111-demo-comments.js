import { models } from "../src/models/index.js";

const { Comment, Post, User } = models;

// Define the seedComments function
export const seedComments = async () => {
  try {
    // Insert predefined comments
    await Comment.bulkCreate([
      {
        content: 'This is a comment on the first post by user 2.',
        postId: 1, // Assuming the first post has id 1
        userId: 2, // Assuming the second user has id 2
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        content: 'Another comment on the first post by user 1.',
        postId: 1, // Assuming the first post has id 1
        userId: 1, // Assuming the first user has id 1
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    console.log('Predefined comments seeded successfully!');

    // Generate additional comments
    const numberOfAdditionalComments = 20; // Adjust the number of additional comments
    const additionalComments = [];

    for (let i = 0; i < numberOfAdditionalComments; i++) {
      additionalComments.push({
        content: `This is comment number ${i + 1}.`,
        postId: (i % 19) + 1, // Cycle through posts 1 and 2
        userId: (i % 19) + 1, // Cycle through users 1 to 5
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // Bulk create additional comments
    await Comment.bulkCreate(additionalComments);

    console.log('Additional comments seeded successfully!');
  } catch (error) {
    console.error('Error seeding comments:', error);
  }
};

// If this file is run directly, execute the seedComments function
if (import.meta.url === `file://${process.argv[1]}`) {
  seedComments().catch(console.error);
}
