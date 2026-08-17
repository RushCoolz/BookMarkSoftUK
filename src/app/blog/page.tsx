import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog & Resources | BookmarkSoft',
  description: 'Read the latest articles, guides, and tips on web development, security, and productivity.',
};

const POSTS = [
  {
    title: 'Essential Developer Tools for Modern Web Development',
    slug: 'essential-developer-tools',
    date: 'August 17, 2026',
    excerpt: 'Explore the must-have formatting, encoding, and debugging tools that every developer needs to speed up their workflow and write better code.',
    category: 'Development'
  },
  {
    title: 'How to Protect Your Online Privacy in 2026',
    slug: 'protect-online-privacy',
    date: 'August 14, 2026',
    excerpt: 'Learn the best practices for generating secure passwords, encrypting data, and understanding what your browser footprint reveals about you.',
    category: 'Security'
  },
  {
    title: 'The Ultimate Guide to Optimizing Images for the Web',
    slug: 'optimizing-images-web',
    date: 'August 10, 2026',
    excerpt: 'Large images are the #1 cause of slow websites. Learn how to resize, compress, and convert images to modern formats like WebP.',
    category: 'Media'
  }
];

export default function BlogIndex() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 py-12">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-800 dark:text-slate-100 sm:text-5xl">
          BookmarkSoft <span className="text-blue-600 dark:text-blue-500">Blog</span>
        </h1>
        <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Guides, tutorials, and insights to help you build faster, stay secure, and work smarter.
        </p>
      </div>

      <div className="grid gap-8 mt-12">
        {POSTS.map((post) => (
          <Link href={`/blog/${post.slug}`} key={post.slug} className="group block">
            <article className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-900/50 transition-all">
              <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 mb-4">
                <span className="font-semibold text-blue-600 dark:text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
                  {post.category}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> {post.date}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {post.title}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                {post.excerpt}
              </p>
              <div className="flex items-center text-blue-600 dark:text-blue-500 font-medium">
                Read Article <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
