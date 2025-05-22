import prisma from "../prisma/client.js";


// Helper functions
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomDate = (year, month) => {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
  return new Date(randomTime);
};

export const seedComments = async () => {
  try {
    // Predefined comments
    await prisma.comment.createMany({
      data: [
        {
          content: 'This article on AI in healthcare is very insightful. I can see how this will change the industry!',
          postId: 1,
          userId: 2,
          createdAt: new Date('2024-01-15T10:00:00Z'),
          updatedAt: new Date('2024-01-15T10:00:00Z'),
        },
        {
          content: 'Great read! The advancements in technology are truly groundbreaking.',
          postId: 1,
          userId: 1,
          createdAt: new Date('2024-02-20T11:00:00Z'),
          updatedAt: new Date('2024-02-20T11:00:00Z'),
        },
        {
          content: 'Thanks for sharing this information. It’s fascinating to see how AI is being applied in different fields.',
          postId: 2,
          userId: 3,
          createdAt: new Date('2024-03-10T12:00:00Z'),
          updatedAt: new Date('2024-03-10T12:00:00Z'),
        },
        {
          content: 'I never realized the impact of these technologies until now. Very well explained!',
          postId: 2,
          userId: 4,
          createdAt: new Date('2024-04-05T13:00:00Z'),
          updatedAt: new Date('2024-04-05T13:00:00Z'),
        },
      ],
    });

    console.log('Predefined comments seeded successfully!');

    // Dynamic comments
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
    const dynamicComments = [];

    for (let i = 0; i < 20; i++) {
      const month = getRandomInt(0, 11);
      dynamicComments.push({
        content: realisticComments[i % realisticComments.length],
        postId: (i % 19) + 1,
        userId: (i % 19) + 1,
        createdAt: getRandomDate(currentYear, month),
        updatedAt: getRandomDate(currentYear, month),
      });
    }

    await prisma.comment.createMany({
      data: dynamicComments,
    });

    console.log('Additional comments seeded successfully!');
  } catch (error) {
    console.error('Error seeding comments:', error);
  } finally {
    await prisma.$disconnect();
  }
};

// Run if called directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  seedComments().catch(console.error);
}
