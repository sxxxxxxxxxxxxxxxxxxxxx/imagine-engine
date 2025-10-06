'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import FirstTimeGuide from '@/components/FirstTimeGuide';

export default function HomePage() {
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    const hasApiKey = localStorage.getItem('imagine-engine-api-key');
    const hasCompletedGuide = localStorage.getItem('imagine-engine-guide-completed');
    
    if (!hasApiKey && !hasCompletedGuide) {
      setShowGuide(true);
    }
  }, []);
  const modules = [
    {
      icon: '✨',
      title: 'AI 创作',
      description: '文字生成图片，多种风格选择',
      features: ['比例控制', '艺术风格', '参考图上传'],
      path: '/create',
      gradient: 'from-purple-600 to-pink-600'
    },
    {
      icon: '🔧',
      title: 'AI 编辑',
      description: '智能图片编辑，专业修图工具',
      features: ['智能修复', '背景移除', '证件照换背景'],
      path: '/edit',
      gradient: 'from-blue-600 to-cyan-600'
    },
    {
      icon: '🎨',
      title: '创意工坊',
      description: '图像融合，创意无限',
      features: ['图像融合', '风格迁移', '创意合成'],
      path: '/tools',
      gradient: 'from-green-600 to-teal-600'
    },
    {
      icon: '💬',
      title: 'AI 伙伴',
      description: '对话式创作，沉浸体验',
      features: ['智能对话', '语音输入', '连续创作'],
      path: '/chat',
      gradient: 'from-orange-600 to-red-600'
    },
    {
      icon: '🖼️',
      title: '创意画廊',
      description: '精选案例，GitHub 14k⭐',
      features: ['110+案例', '输入输出对比', '一键应用'],
      path: '/gallery',
      gradient: 'from-pink-600 to-rose-600'
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10">
        {/* Hero 区域 */}
        <div className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <div className="inline-block mb-6">
              <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center animate-pulse-glow mx-auto">
                <span className="text-4xl">🎨</span>
              </div>
            </div>
            <h1 className="text-6xl font-bold mb-6" style={{ fontFamily: 'Orbitron, sans-serif', color: 'var(--text-primary)' }}>
              <span className="text-gradient">创想引擎</span>
              <span> v1.0</span>
            </h1>
            <p className="text-2xl mb-4" style={{ color: 'var(--text-secondary)' }}>专业AI创意工作台</p>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
              功能强大、分区清晰、体验专业<br />
              让创意触手可及，将想象力转化为杰出的视觉作品
            </p>
          </div>

          {/* 功能模块卡片 */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {modules.map((module) => (
              <Link
                key={module.path}
                href={module.path}
                className="group"
              >
                <div className="glass-card p-6 h-full hover:scale-105 transition-all duration-300 cursor-pointer">
                  <div className={`w-14 h-14 bg-gradient-to-br ${module.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <span className="text-3xl">{module.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{module.title}</h3>
                  <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{module.description}</p>
                  <ul className="space-y-2">
                    {module.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm" style={{ color: 'var(--text-muted)' }}>
                        <span className="text-purple-500 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex items-center text-purple-400 font-semibold group-hover:translate-x-2 transition-transform">
                    开始使用
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* 特性展示 */}
          <div className="glass-card p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8" style={{ color: 'var(--text-primary)' }}>为什么选择创想引擎？</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-3">🎯</div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>专业工作台</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>参考Leonardo.ai设计，专业布局清晰直观</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">⚡</div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>高效创作</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>模块化设计，让每个功能触手可及</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">💎</div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>精致体验</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>双主题+玻璃拟态，视觉效果出众</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t py-8" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="container mx-auto px-4">
            <p className="text-center text-sm" style={{ color: 'var(--text-muted)' }}>
              © 2024 创想引擎 v2.0 - 专业AI创意工作台
            </p>
          </div>
        </footer>
      </div>

      {/* 首次使用引导 */}
      {showGuide && (
        <FirstTimeGuide
          onComplete={() => {
            setShowGuide(false);
            window.location.href = '/create';
          }}
        />
      )}
    </div>
  );
}