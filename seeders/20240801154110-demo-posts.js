import prisma from "../prisma/client.js";
import { getRandomImagePath } from "./imagespath.js";

export const POST_CATEGORIES = [
  'Technology',
  'Health',
  'Finance',
  'Education',
  'Entertainment',
  'Sports',
  'Lifestyle',
  'Travel',
];

export const getRandomCategory = () => {
  const randomIndex = Math.floor(Math.random() * POST_CATEGORIES.length);
  return POST_CATEGORIES[randomIndex];
};


const getRandomDate = (year, month) => {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
  return new Date(randomTime);
};

export const seedPosts = async () => {
  try {
    // Predefined posts
    await prisma.post.createMany({
      data: [
        {
          title: 'The Future of AI in Healthcare',
          content:
            'Artificial Intelligence is transforming the healthcare industry by providing tools for better diagnosis, treatment, and patient care. In this post, we explore the current and future applications of AI in healthcare.',
          category: POST_CATEGORIES[1],
          authorId: 1,
          image: getRandomImagePath(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: 'Top 10 Emerging Technologies in 2024',
          content:
            '2024 is a year of technological breakthroughs, from quantum computing to AI-driven cybersecurity. Here, we discuss the top 10 technologies that are set to shape the future.',
          category: POST_CATEGORIES[0],
          authorId: 2,
          image: getRandomImagePath(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    });

    console.log('Predefined posts seeded successfully!');

    // Additional posts
    const numberOfAdditionalPosts = 20;
    const additionalPosts = [];

    for (let i = 0; i < numberOfAdditionalPosts; i++) {
      const randomMonth = Math.floor(Math.random() * 12);
      const randomYear = 2024;

      additionalPosts.push({
        title: generateTitle(i + 3),
        content: generateContent(i + 3),
        category: POST_CATEGORIES[i % POST_CATEGORIES.length],
        authorId: (i % 19) + 1,
        image: getRandomImagePath(),
        createdAt: getRandomDate(randomYear, randomMonth),
        updatedAt: new Date(),
      });
    }

    await prisma.post.createMany({
      data: additionalPosts,
    });

    console.log('Additional posts seeded successfully!');
  } catch (error) {
    console.error('Error seeding posts:', error);
  } finally {
    await prisma.$disconnect();
  }
};

// Dynamic title/content generation
function generateTitle(index) {
  const titles = [
    'How to Stay Healthy While Traveling',
    'The Ultimate Guide to Financial Freedom',
    'Breaking Down the Latest in Entertainment',
    'Advancements in Sports Science for Athletes',
    'Lifestyle Hacks for a More Productive Day',
    'Travel Tips: Exploring the World on a Budget',
    'The Role of Education in Modern Society',
    'Finance 101: Managing Your Money Wisely',
    'Tech Innovations That Will Change the World',
    'Entertainment Trends to Watch This Year',
    'The Importance of Mental Health Awareness',
    'How to Balance Work and Personal Life',
    'Travel Destinations for Adventure Seekers',
    'The Evolution of Sports in the Digital Age',
    'Building a Sustainable Lifestyle',
    'The Future of Online Education',
    'Investing in Technology: What You Need to Know',
    'The Best Wellness Practices for a Balanced Life',
    'Top Entertainment Picks for the Summer',
    'Exploring New Frontiers in Space Travel',
  ];
  return titles[index % titles.length];
}

function generateContent(index) {
  const contents = [
    'Traveling can be exciting but staying healthy on the road is crucial...',
    'Financial freedom is a goal many strive for...',
    'The entertainment industry is constantly evolving...',
    'Sports science has come a long way...',
    'Productivity is key to a successful life...',
    'Exploring the world doesn’t have to break the bank...',
    'Education plays a vital role in shaping society...',
    'Managing your money wisely is more important than ever...',
    'Technology is advancing rapidly...',
    'Entertainment is more than just a pastime...',
    'Mental health awareness is crucial...',
    'Balancing work and personal life is a challenge...',
    'For those who crave adventure...',
    'Digital technology is transforming sports...',
    'Sustainability is more than just a buzzword...',
    'Online education is on the rise...',
    'Investing in technology can be rewarding...',
    'Wellness practices are key to a balanced life...',
    'Summer is the season for entertainment...',
    'Space travel is no longer just a dream...',
  ];
  return contents[index % contents.length];
}

// Run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedPosts().catch(console.error);
}