import React from 'react';
import { BookOpen, ArrowUpRight } from 'lucide-react';
import { BLOG_POSTS } from '../../data/content';
import { BlogPost } from '../../types';
import { sound } from '../../lib/audio';
import { useContent } from '../../lib/contentStore';

interface BlogInsightsProps {
  onOpenArticle: (post: BlogPost) => void;
}

export const BlogInsights: React.FC<BlogInsightsProps> = ({ onOpenArticle }) => {
  const content = useContent();
  const blogData = content.blog || {};
  const posts: BlogPost[] = blogData.posts && blogData.posts.length > 0 ? blogData.posts : BLOG_POSTS;

  return (
    <section id="insights" className="py-24 border-b border-[var(--border-color)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#F4A300] mb-3">
            <BookOpen className="h-3.5 w-3.5" />
            <span>{blogData.kicker || 'The Kulfi Journal'}</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--text-primary)] text-balance">
            {blogData.heading || 'Cold Takes & Engineering Recipes.'}
          </h2>
          <p className="mt-4 text-base text-[var(--text-secondary)] leading-relaxed">
            {blogData.description ||
              'Observations, architectural post-mortems, and design philosophies straight from our production kitchen.'}
          </p>
        </div>

        {/* 3 Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              onClick={() => {
                sound.playPop();
                onOpenArticle(post);
              }}
              data-cursor="Read"
              className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-8 transition-all duration-300 hover:border-[#F4A300] hover:shadow-lg hover:shadow-[#3B2418]/5 group cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Clean unboxed metadata per design rules */}
                <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] mb-4">
                  <span className="text-[#F4A300] font-semibold">{post.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{post.date}</span>
                  <span aria-hidden="true">·</span>
                  <span>{post.readTime}</span>
                </div>

                <h3 className="font-display text-xl font-bold text-[var(--text-primary)] mb-3 group-hover:text-[#F4A300] transition-colors leading-snug">
                  {post.title}
                </h3>

                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                  {post.summary}
                </p>
              </div>

              <div className="pt-6 border-t border-[var(--border-color)] flex items-center justify-between text-xs font-semibold text-[var(--text-primary)] group-hover:text-[#F4A300] transition-colors">
                <span>Read Full Recipe</span>
                <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
