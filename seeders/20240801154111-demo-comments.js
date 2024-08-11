import { models } from "../src/models/index.js";

const { Comment, Post, User } = models;

// Helper function to generate a random integer between min and max (inclusive)
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper function to generate a random date within a given year and month
const getRandomDate = (year, month) => {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
  return new Date(randomTime).toISOString(); // Return ISO string format
};

// Define the seedComments function
export const seedComments = async () => {
  try {
    // Insert predefined comments
    await Comment.bulkCreate([
      {
        content: 'This article on AI in healthcare is very insightful. I can see how this will change the industry!',
        postId: 1, // Assuming the first post has id 1
        userId: 2, // Assuming the second user has id 2
        createdAt: new Date('2024-01-15T10:00:00Z').toISOString(),
        updatedAt: new Date('2024-01-15T10:00:00Z').toISOString(),
      },
      {
        content: 'Great read! The advancements in technology are truly groundbreaking.',
        postId: 1, // Assuming the first post has id 1
        userId: 1, // Assuming the first user has id 1
        createdAt: new Date('2024-02-20T11:00:00Z').toISOString(),
        updatedAt: new Date('2024-02-20T11:00:00Z').toISOString(),
      },
      {
        content: 'Thanks for sharing this information. It’s fascinating to see how AI is being applied in different fields.',
        postId: 2, // Assuming the second post has id 2
        userId: 3, // Assuming the third user has id 3
        createdAt: new Date('2024-03-10T12:00:00Z').toISOString(),
        updatedAt: new Date('2024-03-10T12:00:00Z').toISOString(),
      },
      {
        content: 'I never realized the impact of these technologies until now. Very well explained!',
        postId: 2, // Assuming the second post has id 2
        userId: 4, // Assuming the fourth user has id 4
        createdAt: new Date('2024-04-05T13:00:00Z').toISOString(),
        updatedAt: new Date('2024-04-05T13:00:00Z').toISOString(),
      },
    ]);

    console.log('Predefined comments seeded successfully!');

    // Generate additional comments
    const numberOfAdditionalComments = 20;
    const additionalComments = [];
    const realisticComments = [
      'This is a great perspective. Thanks for sharing!',
      'I found this article very helpful. Keep up the good work!',
      'Could you elaborate more on this point?',
      'I totally agree with your views on this topic.',
      'This post is very informative and well-researched.',
      'I have a different opinion, but this was a great read.',
      'What a brilliant article, I learned a lot!',
      'I appreciate the detailed explanation in this post.',
      'I’ve been following this topic for a while, and this is one of the best articles I’ve read on it.',
      'I found the examples you used particularly helpful.',
      'This is very relevant to my work. Thanks for the insights!',
      'I’m looking forward to more posts like this.',
      'Great post! I especially liked the section about...',
      'I’m curious about your thoughts on the future of this technology.',
      'This is a well-written and thought-provoking post.',
      'Thanks for breaking down such a complex topic!',
      'I’m glad I came across this post; it’s very enlightening.',
      'I never thought about it this way before. Thanks for the new perspective!',
      'This is exactly what I was looking for, thanks!',
      'Amazing article, you’ve gained a new follower!',
    ];

    const currentYear = new Date().getFullYear();

    for (let i = 0; i < numberOfAdditionalComments; i++) {
      const month = getRandomInt(0, 11); // Random month
      additionalComments.push({
        content: realisticComments[i % realisticComments.length],
        postId: (i % 19) + 1, // Cycle through posts
        userId: (i % 19) + 1, // Cycle through users
        createdAt: getRandomDate(currentYear, month),
        updatedAt: getRandomDate(currentYear, month),
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
