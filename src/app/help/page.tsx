'use client';

import { useState } from 'react';
import WorkspaceLayout from '@/components/WorkspaceLayout';
import Link from 'next/link';

export default function HelpPage() {
  const [activeTab, setActiveTab] = useState('quickstart');

  const tabs = [
    { id: 'nanobanana', icon: '🍌', label: 'Nano Banana' },
    { id: 'quickstart', icon: '🚀', label: '快速开始' },
    { id: 'shortcuts', icon: '⌨️', label: '快捷键' },
    { id: 'faq', icon: '❓', label: '常见问题' },
  ];

  return (
    <WorkspaceLayout>
      <div className="min-h-screen p-6 max-w-[1800px] mx-auto">
        {/* 页面标题 */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>❓ 帮助中心</h1>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                快速了解创想引擎的使用方法
              </p>
            </div>
            <Link href="/create" className="btn-gradient px-6 py-3">
              开始创作
            </Link>
          </div>
        </div>

        {/* 标签页 */}
        <div className="mb-6 flex gap-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg text-base font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-primary text-white shadow-lg'
                  : 'btn-secondary'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* 内容区域 */}
        <div className="glass-card p-8">
          {activeTab === 'nanobanana' && (
            <div className="space-y-6 max-w-4xl">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-3 mb-4 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-300">
                  <span className="text-3xl">🍌</span>
                  <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                    Nano Banana AI
                  </span>
                </div>
                <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                  世界顶级图像生成技术
                </h2>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Google Gemini 2.5 Flash Image 模型的官方名称
                </p>
              </div>

              {/* 核心特性 */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="glass-card p-5 border-2 border-purple-200">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">👥</span>
                    <div>
                      <h3 className="font-bold mb-2" style={{ color: 'var(--text-primary)' }}>角色一致性</h3>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        完美保持人物、宠物和物体在不同图像中的一致外观，适合创建系列作品和连续故事
                      </p>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-5 border-2 border-blue-200">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">🔀</span>
                    <div>
                      <h3 className="font-bold mb-2" style={{ color: 'var(--text-primary)' }}>场景融合</h3>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        将多张图像无缝融合为一张，创造统一的场景和视觉效果，适合复合创作
                      </p>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-5 border-2 border-green-200">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">⚡</span>
                    <div>
                      <h3 className="font-bold mb-2" style={{ color: 'var(--text-primary)' }}>批量生成</h3>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        一次生成 1-4 张变体，快速对比选择最佳效果，提升创作效率
                      </p>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-5 border-2 border-orange-200">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">💬</span>
                    <div>
                      <h3 className="font-bold mb-2" style={{ color: 'var(--text-primary)' }}>自然语言控制</h3>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        使用中文描述即可精确控制图像转换，无需复杂的技术参数
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 最佳实践 */}
              <div className="glass-card p-6 bg-gradient-to-r from-blue-50/50 to-purple-50/50 border-2 border-purple-200">
                <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  💡 Nano Banana 最佳实践
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-lg">✓</span>
                    <div>
                      <strong style={{ color: 'var(--text-primary)' }}>详细描述</strong>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>使用具体的情感、状态、颜色、材质和环境描述</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-lg">✓</span>
                    <div>
                      <strong style={{ color: 'var(--text-primary)' }}>批量生成</strong>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>一次生成 2-4 张变体，对比选择最佳效果</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-lg">✓</span>
                    <div>
                      <strong style={{ color: 'var(--text-primary)' }}>参考图引导</strong>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>上传参考图保持角色和风格一致性</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-lg">✓</span>
                    <div>
                      <strong style={{ color: 'var(--text-primary)' }}>多图融合</strong>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>使用创意工坊融合 2-6 张图像，创作独特效果</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* 外部链接 */}
              <div className="flex gap-4">
                <a 
                  href="https://fooocus.one/zh-TW/nano-banana" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 glass-card p-4 hover:border-purple-400 border-2 border-transparent transition-all text-center"
                >
                  <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                    了解 Nano Banana
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    官方介绍和技术详情 →
                  </p>
                </a>
                <a 
                  href="https://github.com/lllyasviel/Fooocus" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 glass-card p-4 hover:border-purple-400 border-2 border-transparent transition-all text-center"
                >
                  <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                    Fooocus 项目
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    GitHub 46.7k+ ⭐ →
                  </p>
                </a>
              </div>
            </div>
          )}

          {activeTab === 'quickstart' && (
            <div className="space-y-6 max-w-4xl">
              <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                🚀 5分钟快速上手
              </h2>
              
              <div className="grid gap-6">
                <div className="glass-card p-6">
                  <div className="flex items-start gap-4">
                    <span className="text-4xl">1️⃣</span>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                        配置API密钥
                      </h3>
                      <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                        点击左侧导航栏"⚙️ 设置"，选择"Nano Banana"，输入API密钥，保存设置
                      </p>
                      <Link 
                        href="https://newapi.aicohere.org" 
                        target="_blank"
                        className="text-sm text-purple-500 hover:text-purple-600 font-semibold"
                      >
                        → 获取免费API密钥
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-6">
                  <div className="flex items-start gap-4">
                    <span className="text-4xl">2️⃣</span>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                        开始创作
                      </h3>
                      <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                        按 <kbd className="px-3 py-1 bg-purple-500/10 rounded text-sm">G</kbd> 键进入AI创作，
                        按 <kbd className="px-3 py-1 bg-purple-500/10 rounded text-sm">P</kbd> 键打开提示词画廊
                      </p>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-6">
                  <div className="flex items-start gap-4">
                    <span className="text-4xl">3️⃣</span>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                        生成第一张图
                      </h3>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        选择一个模板或输入提示词，
                        按 <kbd className="px-3 py-1 bg-purple-500/10 rounded text-sm">Ctrl+Enter</kbd> 快速生成
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl mt-8" style={{ 
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
                border: '1px solid rgba(59, 130, 246, 0.2)'
              }}>
                <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
                  💡 <strong>提示</strong>: 按 <kbd className="px-2 py-1 bg-white/10 rounded text-sm">?</kbd> 键随时查看完整快捷键列表
                </p>
              </div>
            </div>
          )}

          {activeTab === 'shortcuts' && (
            <div className="space-y-6 max-w-4xl">
              <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                ⌨️ 键盘快捷键
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                  <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                    🧭 导航快捷键
                  </h3>
                  <div className="space-y-3">
                    {[
                      { key: 'G', desc: '切换到AI创作' },
                      { key: 'E', desc: '切换到AI编辑' },
                      { key: 'T', desc: '打开创意工坊' },
                      { key: 'C', desc: '打开AI伙伴' },
                      { key: 'L', desc: '查看创意画廊' },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--bg-tertiary)' }}>
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item.desc}</span>
                        <kbd className="px-4 py-2 bg-purple-500/20 text-purple-600 rounded-lg font-mono font-bold">{item.key}</kbd>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card p-6">
                  <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                    ⚡ 操作快捷键
                  </h3>
                  <div className="space-y-3">
                    {[
                      { key: 'Ctrl+Enter', desc: '执行生成/编辑' },
                      { key: 'Shift+R', desc: '重新生成变体' },
                      { key: 'H', desc: '显示/隐藏历史' },
                      { key: 'P', desc: '打开提示词画廊' },
                      { key: '?', desc: '显示快捷键帮助' },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--bg-tertiary)' }}>
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item.desc}</span>
                        <kbd className="px-4 py-2 bg-purple-500/20 text-purple-600 rounded-lg text-sm font-mono font-bold">{item.key}</kbd>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="space-y-4 max-w-4xl">
              <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                ❓ 常见问题
              </h2>

              <div className="space-y-4">
                {[
                  {
                    q: '如何获取API密钥？',
                    a: '点击左侧"⚙️ 设置"，选择Nano Banana提供商，访问 https://newapi.aicohere.org 注册获取免费API密钥'
                  },
                  {
                    q: '为什么提示"请配置API密钥"？',
                    a: 'v2.0为了安全，不再内置API密钥。您需要使用自己的密钥，在设置中配置即可，配置一次永久有效'
                  },
                  {
                    q: '如何提高生成质量？',
                    a: '点击"💡 提示"按钮查看提示词质量建议，学习5个关键要素：主体描述、场景环境、动作描述、艺术风格、相机参数。写完整的句子而不是关键词堆砌'
                  },
                  {
                    q: '如何保存历史记录？',
                    a: '所有生成的图片自动保存在本地localStorage和IndexedDB中，永久保存。按 H 键查看历史记录，支持对比和导出'
                  },
                  {
                    q: '支持哪些模型？',
                    a: '支持9个主流提供商：Nano Banana (Gemini)、OpenAI (DALL-E)、Stability AI、Midjourney、FLUX、Recraft、Ideogram等，共20+个模型可选'
                  },
                  {
                    q: '如何切换语言？',
                    a: '点击左侧导航栏底部的"🇨🇳 中文"或"🇬🇧 English"按钮即可切换，支持中英双语界面'
                  },
                  {
                    q: '快捷键不生效怎么办？',
                    a: '确保鼠标点击了页面空白处（不在输入框内）。在输入框内只有 Ctrl+Enter 可用，其他快捷键需要在输入框外使用'
                  },
                  {
                    q: '下载的图片在哪里？',
                    a: '图片会下载到浏览器默认下载文件夹，文件名格式为 imagine-时间戳.png 或 edited-时间戳.png'
                  },
                ].map((item, idx) => (
                  <div key={idx} className="glass-card p-6">
                    <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                      Q: {item.q}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      A: {item.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'docs' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                📚 文档资源
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    icon: '📖',
                    title: '快速开始指南',
                    desc: '5分钟快速上手教程，从配置到创作的完整流程',
                    file: 'QUICK_START_GUIDE.md'
                  },
                  {
                    icon: '🎯',
                    title: '功能演示手册',
                    desc: '12大功能完整演示，实战案例分析',
                    file: 'FEATURES_SHOWCASE.md'
                  },
                  {
                    icon: '⚙️',
                    title: '设置功能指南',
                    desc: 'API配置详细说明，9个提供商使用指南',
                    file: '设置功能使用指南.md'
                  },
                  {
                    icon: '🎨',
                    title: '创意画廊指南',
                    desc: '60+案例使用说明，提示词学习资源',
                    file: '创意画廊使用指南.md'
                  },
                  {
                    icon: '📊',
                    title: '技术文档',
                    desc: '完整技术架构说明，API接口文档',
                    file: 'README_v2.md'
                  },
                  {
                    icon: '🔍',
                    title: 'GitHub项目分析',
                    desc: '深度技术分析报告，学习3个优秀项目',
                    file: 'GITHUB_PROJECTS_ANALYSIS.md'
                  },
                  {
                    icon: '🎉',
                    title: '升级报告',
                    desc: 'v2.0完整升级记录，3000+行代码优化',
                    file: 'UPGRADE_COMPLETE_REPORT.md'
                  },
                  {
                    icon: '📐',
                    title: '分辨率保持说明',
                    desc: '无损修图技术文档，两步缩放算法',
                    file: '分辨率保持功能说明.md'
                  },
                  {
                    icon: '🏆',
                    title: '最终审查报告',
                    desc: '技术主管专业审查，A+评级认证',
                    file: 'TECHNICAL_REVIEW_REPORT.md'
                  },
                ].map((doc) => (
                  <div 
                    key={doc.file} 
                    className="glass-card p-6 hover:shadow-xl hover:scale-105 transition-all cursor-pointer"
                  >
                    <div className="text-5xl mb-4">{doc.icon}</div>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                      {doc.title}
                    </h3>
                    <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                      {doc.desc}
                    </p>
                    <p className="text-xs font-mono p-2 rounded" style={{ 
                      color: 'var(--text-muted)',
                      background: 'var(--bg-tertiary)'
                    }}>
                      {doc.file}
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-6 rounded-xl mt-8" style={{ 
                background: 'rgba(138, 43, 226, 0.1)',
                border: '1px solid rgba(138, 43, 226, 0.2)'
              }}>
                <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
                  💡 所有文档都在项目根目录中，使用代码编辑器或文本编辑器查看
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </WorkspaceLayout>
  );
}

