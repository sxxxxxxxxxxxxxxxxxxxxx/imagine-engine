'use client';

import { useState } from 'react';
import SpotlightCard from './SpotlightCard';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  plan: string;
  avatar?: string;
  rating?: number;
  date?: string;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  language: 'zh' | 'en';
}

export default function TestimonialCarousel({ testimonials, language }: TestimonialCarouselProps) {
  const [isPaused, setIsPaused] = useState(false);

  // 复制数组以实现无缝循环（需要足够多的副本）
  const duplicatedTestimonials = [...testimonials, ...testimonials, ...testimonials];

  return (
    <div 
      className="relative overflow-hidden"
      style={{
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 滚动容器 - 使用 CSS 动画实现平滑滚动，全屏无边界 */}
      <div 
        className={`flex gap-6 animate-testimonial-scroll ${isPaused ? 'paused' : ''}`}
        style={{
          width: 'max-content',
        }}
      >
        {duplicatedTestimonials.map((review, idx) => (
          <div
            key={idx}
            className="flex-shrink-0 w-[320px] md:w-[400px] lg:w-[450px]"
          >
            <SpotlightCard className="card p-6 border-l-4 border-primary-500 h-full">
              {/* 评分 */}
              {review.rating && (
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating!
                          ? 'text-yellow-400 fill-current'
                          : 'text-dark-300 dark:text-dark-600'
                      }`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
              )}
              
              <p className="text-dark-700 dark:text-dark-300 mb-4 leading-relaxed text-sm">
                "{review.quote}"
              </p>
              
              <div className="flex items-center gap-3 pt-4 border-t border-dark-200 dark:border-dark-800">
                {/* 用户头像 */}
                <div className="relative w-10 h-10 flex-shrink-0">
                  {review.avatar ? (
                    <>
                      <img
                        src={review.avatar}
                        alt={review.author}
                        className="w-10 h-10 rounded-full object-cover border-2 border-primary-200 dark:border-primary-800"
                        onError={(e) => {
                          // 如果头像加载失败，隐藏图片显示首字母
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.parentElement?.querySelector('.avatar-fallback') as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                      <div className="avatar-fallback hidden w-10 h-10 rounded-full bg-primary-500/20 items-center justify-center text-primary-600 dark:text-primary-400 font-bold absolute inset-0">
                        {review.author.charAt(0)}
                      </div>
                    </>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold">
                      {review.author.charAt(0)}
                    </div>
                  )}
                </div>
                
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-dark-900 dark:text-dark-50 truncate text-sm">
                    {review.author}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-xs text-dark-500 truncate">
                      {review.role}
                    </p>
                    {review.date && (
                      <>
                        <span className="text-xs text-dark-400">·</span>
                        <p className="text-xs text-dark-500">
                          {review.date}
                        </p>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-primary-600 dark:text-primary-400 font-medium mt-0.5">
                    {review.plan}
                  </p>
                </div>
              </div>
            </SpotlightCard>
          </div>
        ))}
      </div>
    </div>
  );
}

