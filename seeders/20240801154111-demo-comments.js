import { models } from "../src/models/index.js";

const { Comment, Post, User } = models;

// Define the seedComments function
export const seedComments = async () => {
  try {
    // Insert predefined comments
    await Comment.bulkCreate([
      {
        content: 'This article on AI in healthcare is very insightful. I can see how this will change the industry!',
        postId: 1, // Assuming the first post has id 1
        userId: 2, // Assuming the second user has id 2
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        content: 'Great read! The advancements in technology are truly groundbreaking.',
        postId: 1, // Assuming the first post has id 1
        userId: 1, // Assuming the first user has id 1
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        content: 'Thanks for sharing this information. It’s fascinating to see how AI is being applied in different fields.',
        postId: 2, // Assuming the second post has id 2
        userId: 3, // Assuming the third user has id 3
        createdAt: new Date(),
        updatedAt: new Date()
      },{
        content: 'I never realized the impact of these technologies until now. Very well explained!',
        postId: 2, // Assuming the second post has id 2
        userId: 4, // Assuming the fourth user has id 4
        createdAt: new Date(),
        updatedAt: new Date()
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
      'Amazing article, you’ve gained a new follower!'
    ];

    for (let i = 0; i < numberOfAdditionalComments; i++) {
      additionalComments.push({
        content: realisticComments[i % realisticComments.length],
        postId: (i % 19) + 1, // Cycle through posts
        userId: (i % 19) + 1, // Cycle through users
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
