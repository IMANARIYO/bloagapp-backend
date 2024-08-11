import { models } from "../src/models/index.js";
import { getRandomImagePath } from "./imagespath.js";

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

export const getRandomCategory = () => {
  const randomIndex = Math.floor(Math.random() * POST_CATEGORIES.length);
  return POST_CATEGORIES[randomIndex];
};

// Helper function to get a random date within a given year and month
const getRandomDate = (year, month) => {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
  return new Date(randomTime);
};

const { Post } = models;

export const seedPosts = async () => {
  try {
    // Insert predefined posts
    await Post.bulkCreate([
      {
        title: 'The Future of AI in Healthcare',
        content: 'Artificial Intelligence is transforming the healthcare industry by providing tools for better diagnosis, treatment, and patient care. In this post, we explore the current and future applications of AI in healthcare.',
        category: POST_CATEGORIES[1],
        authorId: 1, // Assuming the first user created in the users seeder has id 1
        image: getRandomImagePath(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Top 10 Emerging Technologies in 2024',
        content: '2024 is a year of technological breakthroughs, from quantum computing to AI-driven cybersecurity. Here, we discuss the top 10 technologies that are set to shape the future.',
        category: POST_CATEGORIES[0],
        authorId: 2, // Assuming the second user created in the users seeder has id 2
        image: getRandomImagePath(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    console.log('Predefined posts seeded successfully!');

    // Generate additional posts
    const numberOfAdditionalPosts = 20; 
    const additionalPosts = [];

    for (let i = 0; i < numberOfAdditionalPosts; i++) {
      // Generate a random month (0-11) and year
      const randomMonth = Math.floor(Math.random() * 12);
      const randomYear = 2024; // Set the year or make it dynamic if needed
      
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

    // Bulk create additional posts
    await Post.bulkCreate(additionalPosts);

    console.log('Additional posts seeded successfully!');
  } catch (error) {
    console.error('Error seeding posts:', error);
  }
};

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
    'Exploring New Frontiers in Space Travel'
  ];
  return titles[index % titles.length];
}

function generateContent(index) {
  const contents = [
    'Traveling can be exciting but staying healthy on the road is crucial. This post provides practical tips to maintain your health while exploring new places.',
    'Financial freedom is a goal many strive for. In this guide, we cover essential steps to take control of your finances and achieve long-term stability.',
    'The entertainment industry is constantly evolving. This post breaks down the latest trends and what to expect in the coming year.',
    'Sports science has come a long way, helping athletes achieve peak performance. We delve into the latest advancements and how they are making a difference.',
    'Productivity is key to a successful life. Here are some lifestyle hacks that can help you make the most of your day.',
    'Exploring the world doesn’t have to break the bank. We share top tips for budget-friendly travel that doesn’t compromise on experience.',
    'Education plays a vital role in shaping modern society. This post examines its impact and the future of learning.',
    'Managing your money wisely is more important than ever. We offer practical advice on how to handle your finances effectively.',
    'Technology is advancing rapidly, with innovations set to change our lives. This post highlights the top tech trends to watch.',
    'Entertainment is more than just a pastime. Discover the emerging trends that are shaping the future of how we consume content.',
    'Mental health awareness is crucial in today’s fast-paced world. Learn about the importance of mental health and ways to support it.',
    'Balancing work and personal life is a challenge many face. We provide tips on how to achieve harmony between the two.',
    'For those who crave adventure, these travel destinations offer thrilling experiences that will satisfy your wanderlust.',
    'Digital technology is transforming sports. Explore how these innovations are changing the game for athletes and fans alike.',
    'Sustainability is more than just a buzzword. We discuss how to build a lifestyle that supports a healthier planet.',
    'Online education is on the rise. We explore the benefits and challenges of this growing trend in the world of learning.',
    'Investing in technology can be rewarding but risky. Learn what you need to know before diving into tech investments.',
    'Wellness practices are key to a balanced life. This post shares the best practices to incorporate into your daily routine.',
    'Summer is the season for entertainment. We highlight the top picks to enjoy during the warm months.',
    'Space travel is no longer just a dream. Discover the new frontiers being explored and what the future holds for space exploration.'
  ];
  return contents[index % contents.length];
}

// Use ES6 import.meta.url to check if the file is being run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedPosts().catch(console.error);
}
