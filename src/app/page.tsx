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
      description: '批量生成，角色一致性',
      features: ['批量生成 1-4 张', '超写实/动漫风格', '参考图引导'],
      path: '/create',
      gradient: 'from-purple-600 to-pink-600',
      badge: 'NEW'
    },
    {
      icon: '🔧',
      title: 'AI 编辑',
      description: '精确编辑，智能修图',
      features: ['智能遮罩', '背景移除', '证件照制作'],
      path: '/edit',
      gradient: 'from-blue-600 to-cyan-600',
      badge: null
    },
    {
      icon: '🎨',
      title: '创意工坊',
      description: '多图融合，场景合成',
      features: ['2-6张图融合', '场景统一', '创意合成'],
      path: '/tools',
      gradient: 'from-green-600 to-teal-600',
      badge: 'HOT'
    },
    {
      icon: '💬',
      title: 'AI 伙伴',
      description: '对话式创作助手',
      features: ['智能对话', '创意建议', '连续创作'],
      path: '/chat',
      gradient: 'from-orange-600 to-red-600',
      badge: null
    },
    {
      icon: '🖼️',
      title: '创意画廊',
      description: '72+ 精选案例',
      features: ['分类浏览', '一键应用', 'GitHub 收藏'],
      path: '/gallery',
      gradient: 'from-pink-600 to-rose-600',
      badge: null
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
            <div className="inline-flex items-center gap-3 mb-4 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-purple-200">
              <span className="text-2xl">🍌</span>
              <span className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Powered by Nano Banana AI
              </span>
            </div>
            <h1 className="text-6xl font-bold mb-6" style={{ fontFamily: 'Orbitron, sans-serif', color: 'var(--text-primary)' }}>
              <span className="text-gradient">创想引擎</span>
            </h1>
            <p className="text-2xl mb-4" style={{ color: 'var(--text-secondary)' }}>
              基于 Google Gemini 2.5 的专业图像创作平台
            </p>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
              采用世界顶级 Nano Banana AI 技术<br />
              支持批量生成、角色一致性、场景融合等专业级功能
            </p>
          </div>

          {/* 功能模块卡片 - 紧凑小卡片 */}
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8 max-w-7xl mx-auto">
            {modules.map((module) => (
              <Link
                key={module.path}
                href={module.path}
                className="group"
              >
                <div className="glass-card p-5 h-full hover:scale-105 transition-all duration-300 cursor-pointer relative overflow-hidden">
                  {/* Badge 标签 */}
                  {module.badge && (
                    <div className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      module.badge === 'NEW' ? 'bg-green-500' :
                      module.badge === 'HOT' ? 'bg-red-500' :
                      'bg-blue-500'
                    } text-white shadow-md`}>
                      {module.badge}
                    </div>
                  )}

                  <div className={`w-12 h-12 bg-gradient-to-br ${module.gradient} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-md`}>
                    <span className="text-2xl">{module.icon}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{module.title}</h3>
                  <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>{module.description}</p>
                  <ul className="space-y-1.5 mb-3">
                    {module.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-xs" style={{ color: 'var(--text-muted)' }}>
                        <span className="text-purple-500 mr-2 text-sm">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center text-purple-500 text-sm font-semibold group-hover:translate-x-1 transition-transform">
                    开始使用 →
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Nano Banana AI 特性展示 */}
          <div className="glass-card p-6 max-w-7xl mx-auto">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="text-2xl">🍌</span>
                <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  Nano Banana AI 核心技术
                </h2>
              </div>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                基于 Google Gemini 2.5 Flash 的世界顶级图像生成模型
              </p>
            </div>
            
            <div className="grid md:grid-cols-6 gap-4">
              <div className="text-center p-4 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200">
                <div className="text-3xl mb-2">👥</div>
                <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>角色一致性</h3>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>保持角色外观</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200">
                <div className="text-3xl mb-2">🔀</div>
                <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>场景融合</h3>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>多图无缝合成</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-gradient-to-br from-green-50 to-teal-50 border border-green-200">
                <div className="text-3xl mb-2">⚡</div>
                <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>批量生成</h3>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>1-4张快速创作</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200">
                <div className="text-3xl mb-2">💬</div>
                <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>自然语言</h3>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>中文精确控制</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200">
                <div className="text-3xl mb-2">🏆</div>
                <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>专业输出</h3>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>商业级质量</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-200">
                <div className="text-3xl mb-2">🔒</div>
                <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>SynthID 水印</h3>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>透明标识AI内容</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t py-12" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <h4 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <span>🎨</span>
                  <span>创想引擎</span>
                </h4>
                <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                  基于 Nano Banana AI 的专业图像创作平台
                </p>
                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <span>🍌</span>
                  <span>Powered by Google Gemini 2.5</span>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>快速链接</h4>
                <ul className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <li><Link href="/create" className="hover:text-purple-500 transition-colors">AI 创作</Link></li>
                  <li><Link href="/edit" className="hover:text-purple-500 transition-colors">AI 编辑</Link></li>
                  <li><Link href="/tools" className="hover:text-purple-500 transition-colors">创意工坊</Link></li>
                  <li><Link href="/gallery" className="hover:text-purple-500 transition-colors">创意画廊</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>支持与帮助</h4>
                <ul className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <li><Link href="/settings" className="hover:text-purple-500 transition-colors">设置中心</Link></li>
                  <li><Link href="/help" className="hover:text-purple-500 transition-colors">帮助中心</Link></li>
                  <li>
                    <a href="https://fooocus.one/zh-TW/nano-banana" target="_blank" rel="noopener noreferrer" className="hover:text-purple-500 transition-colors flex items-center gap-1">
                      了解 Nano Banana
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="pt-6 border-t text-center" style={{ borderColor: 'var(--border-subtle)' }}>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                © 2025 创想引擎 - 基于 Nano Banana AI 技术 | 专业图像创作平台
              </p>
            </div>
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