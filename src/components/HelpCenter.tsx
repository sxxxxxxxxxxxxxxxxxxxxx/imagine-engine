'use client';

import { useState } from 'react';

interface HelpCenterProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function HelpCenter({ isVisible, onClose }: HelpCenterProps) {
  const [activeTab, setActiveTab] = useState('quickstart');

  if (!isVisible) return null;

  const tabs = [
    { id: 'quickstart', icon: '🚀', label: '快速开始' },
    { id: 'shortcuts', icon: '⌨️', label: '快捷键' },
    { id: 'faq', icon: '❓', label: '常见问题' },
    { id: 'docs', icon: '📚', label: '文档' },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4" 
      style={{ background: 'rgba(0, 0, 0, 0.75)' }}
      onClick={onClose}
    >
      <div 
        className="w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl flex flex-col"
        style={{ background: 'var(--bg-secondary)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="px-8 py-6 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                ❓ 帮助中心
              </h2>
              <p className="text-base mt-2" style={{ color: 'var(--text-secondary)' }}>
                快速了解创想引擎的使用方法
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full hover:bg-red-500/10 flex items-center justify-center transition-colors"
            >
              <span className="text-2xl">×</span>
            </button>
          </div>
        </div>

        {/* 标签页 */}
        <div className="px-6 py-3 border-b flex gap-2" style={{ borderColor: 'var(--border-subtle)' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-primary text-white shadow-md'
                  : 'btn-secondary'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === 'quickstart' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  🚀 5分钟快速上手
                </h3>
                
                <div className="space-y-4">
                  <div className="glass-card p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">1️⃣</span>
                      <div>
                        <h4 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>配置API密钥</h4>
                        <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                          点击左侧导航栏"⚙️ 设置"按钮，选择"Nano Banana"，输入API密钥，保存设置
                        </p>
                        <a 
                          href="https://newapi.aicohere.org" 
                          target="_blank"
                          className="text-xs text-purple-500 hover:text-purple-600"
                        >
                          → 获取免费API密钥
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">2️⃣</span>
                      <div>
                        <h4 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>开始创作</h4>
                        <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                          按 <kbd className="px-2 py-1 bg-purple-500/10 rounded text-xs">G</kbd> 键进入AI创作，按 <kbd className="px-2 py-1 bg-purple-500/10 rounded text-xs">P</kbd> 键打开提示词画廊
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">3️⃣</span>
                      <div>
                        <h4 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>生成第一张图</h4>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          选择一个模板或输入提示词，按 <kbd className="px-2 py-1 bg-purple-500/10 rounded text-xs">Ctrl+Enter</kbd> 快速生成
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl" style={{ 
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
                border: '1px solid rgba(59, 130, 246, 0.2)'
              }}>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  💡 <strong>提示</strong>: 按 <kbd className="px-2 py-1 bg-white/10 rounded text-xs">?</kbd> 键随时查看完整快捷键列表
                </p>
              </div>
            </div>
          )}

          {activeTab === 'shortcuts' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                ⌨️ 键盘快捷键
              </h3>

              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>🧭 导航</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: 'G', desc: '切换到AI创作' },
                      { key: 'E', desc: '切换到AI编辑' },
                      { key: 'T', desc: '打开创意工坊' },
                      { key: 'C', desc: '打开AI伙伴' },
                      { key: 'L', desc: '查看创意画廊' },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-2 rounded" style={{ background: 'var(--bg-tertiary)' }}>
                        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{item.desc}</span>
                        <kbd className="px-2 py-1 bg-purple-500/20 text-purple-600 rounded text-xs font-mono">{item.key}</kbd>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>⚡ 操作</h4>
                  <div className="space-y-2">
                    {[
                      { key: 'Ctrl+Enter', desc: '执行生成/编辑' },
                      { key: 'Shift+R', desc: '重新生成' },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-2 rounded" style={{ background: 'var(--bg-tertiary)' }}>
                        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{item.desc}</span>
                        <kbd className="px-2 py-1 bg-purple-500/20 text-purple-600 rounded text-xs font-mono">{item.key}</kbd>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>📋 面板</h4>
                  <div className="space-y-2">
                    {[
                      { key: 'H', desc: '显示/隐藏历史' },
                      { key: 'P', desc: '打开提示词画廊' },
                      { key: '?', desc: '显示快捷键帮助' },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-2 rounded" style={{ background: 'var(--bg-tertiary)' }}>
                        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{item.desc}</span>
                        <kbd className="px-2 py-1 bg-purple-500/20 text-purple-600 rounded text-xs font-mono">{item.key}</kbd>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                ❓ 常见问题
              </h3>

              <div className="space-y-3">
                {[
                  {
                    q: '如何获取API密钥？',
                    a: '点击左侧"⚙️ 设置"，选择Nano Banana提供商，访问 https://newapi.aicohere.org 注册获取免费API密钥'
                  },
                  {
                    q: '为什么提示"请配置API密钥"？',
                    a: 'v2.0为了安全，不再内置API密钥。您需要使用自己的密钥，在设置中配置即可'
                  },
                  {
                    q: '如何提高生成质量？',
                    a: '点击"💡 提示"按钮查看提示词质量建议，学习5个关键要素：主体、场景、动作、风格、相机参数'
                  },
                  {
                    q: '如何保存历史记录？',
                    a: '所有生成的图片自动保存在本地localStorage和IndexedDB中，按 H 键查看历史记录'
                  },
                  {
                    q: '支持哪些模型？',
                    a: '支持9个主流提供商：Nano Banana、OpenAI、Stability AI、Midjourney、FLUX等，共20+个模型'
                  },
                  {
                    q: '如何切换语言？',
                    a: '点击左侧导航栏底部的"🇨🇳 中文"或"🇬🇧 English"按钮即可切换'
                  },
                ].map((item, idx) => (
                  <div key={idx} className="glass-card p-4">
                    <h4 className="font-semibold mb-2 text-sm" style={{ color: 'var(--text-primary)' }}>
                      Q: {item.q}
                    </h4>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      A: {item.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'docs' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                📚 文档资源
              </h3>

              <div className="grid md:grid-cols-2 gap-3">
                {[
                  {
                    icon: '📖',
                    title: '快速开始指南',
                    desc: '5分钟快速上手教程',
                    file: 'QUICK_START_GUIDE.md'
                  },
                  {
                    icon: '🎯',
                    title: '功能演示手册',
                    desc: '完整功能使用案例',
                    file: 'FEATURES_SHOWCASE.md'
                  },
                  {
                    icon: '⚙️',
                    title: '设置功能指南',
                    desc: 'API配置详细说明',
                    file: '设置功能使用指南.md'
                  },
                  {
                    icon: '🎨',
                    title: '创意画廊指南',
                    desc: '60+案例使用说明',
                    file: '创意画廊使用指南.md'
                  },
                  {
                    icon: '📊',
                    title: '技术文档',
                    desc: '完整技术架构说明',
                    file: 'README_v2.md'
                  },
                  {
                    icon: '🔍',
                    title: 'GitHub项目分析',
                    desc: '技术深度分析报告',
                    file: 'GITHUB_PROJECTS_ANALYSIS.md'
                  },
                ].map((doc) => (
                  <div key={doc.file} className="glass-card p-4 hover:shadow-lg transition-all cursor-pointer">
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{doc.icon}</span>
                      <div>
                        <h4 className="font-semibold mb-1 text-sm" style={{ color: 'var(--text-primary)' }}>
                          {doc.title}
                        </h4>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                          {doc.desc}
                        </p>
                        <p className="text-xs mt-2 font-mono" style={{ color: 'var(--text-muted)' }}>
                          {doc.file}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl" style={{ 
                background: 'rgba(138, 43, 226, 0.1)',
                border: '1px solid rgba(138, 43, 226, 0.2)'
              }}>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  💡 所有文档都在项目根目录中，使用代码编辑器或文本编辑器查看
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 底部 */}
        <div className="px-6 py-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="flex items-center justify-between">
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              创想引擎 v2.0 · 专业AI创意工作台
            </p>
            <button
              onClick={onClose}
              className="btn-gradient px-6 py-2"
            >
              开始使用
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

