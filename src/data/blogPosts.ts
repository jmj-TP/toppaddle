export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  thumbnail: string;
  author: string;
  date: string;
  content: string;
  relatedQuizLink?: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "choosing-first-racket",
    title: "How to Choose Your First Table Tennis Racket",
    excerpt: "Starting your table tennis journey? Learn the essential factors to consider when selecting your first racket and avoid common beginner mistakes.",
    thumbnail: "https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=800&q=80",
    author: "TopPaddle Team",
    date: "2025-01-15",
    content: "Full blog post content here...",
    relatedQuizLink: "/",
  },
  {
    id: "rubber-types-explained",
    title: "Table Tennis Rubber Types Explained",
    excerpt: "Understanding the differences between inverted, pimpled, and anti-spin rubbers can transform your game. Here's everything you need to know.",
    thumbnail: "https://images.unsplash.com/photo-1534158914592-062992fbe900?w=800&q=80",
    author: "TopPaddle Team",
    date: "2025-01-10",
    content: "Full blog post content here...",
    relatedQuizLink: "/",
  },
  {
    id: "upgrade-timing",
    title: "When Should You Upgrade Your Equipment?",
    excerpt: "Knowing when to upgrade your table tennis equipment can significantly impact your performance. Discover the signs it's time for new gear.",
    thumbnail: "https://images.unsplash.com/photo-1611371805351-5e4736f67e01?w=800&q=80",
    author: "TopPaddle Team",
    date: "2025-01-05",
    content: "Full blog post content here...",
    relatedQuizLink: "/",
  },
  {
    id: "blade-speed-ratings",
    title: "Understanding Blade Speed Ratings",
    excerpt: "Blade speed ratings can be confusing. We break down what they mean and how to choose the right speed for your playing style.",
    thumbnail: "https://images.unsplash.com/photo-1559511260-66a654ae982a?w=800&q=80",
    author: "TopPaddle Team",
    date: "2024-12-28",
    content: "Full blog post content here...",
    relatedQuizLink: "/",
  },
];
