'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  BookOpen, 
  Zap, 
  Keyboard, 
  HelpCircle,
  ChevronDown,
  Search
} from 'lucide-react';

export default function HelpPage() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('quickstart');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const tabs = [
    { id: 'quickstart', icon: Zap, label: language === 'zh' ? '快速开始' : 'Quick Start' },
    { id: 'shortcuts', icon: Keyboard, label: language === 'zh' ? '快捷键' : 'Shortcuts' },
    { id: 'faq', icon: HelpCircle, label: language === 'zh' ? '常见问题' : 'FAQ' },
  ];

  const faqs = language === 'zh' ? [
    {
      q: '如何配置 API 密钥？',
      a: '点击导航栏右上角的"设置"图标，选择你喜欢的 API 提供商，输入密钥后保存即可。'
    },
    {
      q: '批量生成为什么只显示一张？',
      a: '这个问题已在 v2.1.0 修复。如果仍有问题，请清除浏览器缓存后重试。'
    },
    {
      q: '如何控制生成图片的比例？',
      a: '在 AI Studio 页面选择图片比例（1:1、16:9、9:16 等），系统会自动创建对应比例的画布控制 AI 生成。'
    },
    {
      q: '编辑后的图片分辨率会降低吗？',
      a: '不会。系统会自动保持原始分辨率，编辑后如有变化会自动调整回原始尺寸。'
    },
    {
      q: '作品会保存吗？',
      a: '会的。所有生成的作品都会自动保存到浏览器本地，刷新页面后仍然存在。最多保存 50 张。'
    },
    {
      q: '如何使用快捷键？',
      a: '按 Ctrl+Enter 快速生成/编辑，按 G 跳转 AI Studio，按 E 跳转 Editor，按 ? 查看所有快捷键。'
    }
  ] : [
    {
      q: 'How to configure API key?',
      a: 'Click the "Settings" icon in the top-right corner, select your preferred API provider, enter your key and save.'
    },
    {
      q: 'Why batch generation only shows one image?',
      a: 'This issue was fixed in v2.1.0. If it persists, try clearing your browser cache.'
    },
    {
      q: 'How to control image aspect ratio?',
      a: 'Select aspect ratio in AI Studio (1:1, 16:9, 9:16, etc.). System will auto-create a canvas to control AI generation.'
    },
    {
      q: 'Will edited images lose resolution?',
      a: 'No. System automatically maintains original resolution and adjusts back if needed.'
    },
    {
      q: 'Are artworks saved?',
      a: 'Yes. All generated artworks are auto-saved to browser local storage. Max 50 images.'
    },
    {
      q: 'How to use keyboard shortcuts?',
      a: 'Press Ctrl+Enter to generate/edit, G for AI Studio, E for Editor, ? to see all shortcuts.'
    }
  ];

  return (
    <div className="page-container">
      <div className="content-wrapper">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark-900 dark:text-dark-50 mb-2">
            {language === 'zh' ? '帮助中心' : 'Help Center'}
          </h1>
          <p className="text-dark-600 dark:text-dark-400">
            {language === 'zh' ? '快速了解和使用 Imagine Engine' : 'Quick guides and FAQs'}
          </p>
        </div>

        {/* 搜索 */}
        <div className="mb-6">
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'zh' ? '搜索帮助内容...' : 'Search help...'}
              className="input pl-10"
            />
          </div>
        </div>

        {/* 标签页 */}
        <div className="flex gap-2 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-500 text-white'
                    : 'bg-dark-100 dark:bg-dark-900 text-dark-600 dark:text-dark-400 hover:bg-dark-200 dark:hover:bg-dark-800'
                }`}
              >
                <Icon className="w-4 h-4 inline mr-2" />
                {tab.label}
            </button>
            );
          })}
        </div>

        {/* 内容区域 */}
        <div className="max-w-4xl">
          {/* 快速开始 */}
          {activeTab === 'quickstart' && (
            <div className="space-y-6">
              <div className="card p-8">
                <h2 className="text-2xl font-bold text-dark-900 dark:text-dark-50 mb-6">
                  {language === 'zh' ? '5 分钟快速开始' : '5-Minute Quick Start'}
              </h2>
              
                <div className="space-y-8">
                  {/* Step 1 */}
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">
                        1
                      </div>
                      <h3 className="text-lg font-semibold text-dark-900 dark:text-dark-50">
                        {language === 'zh' ? '配置 API 密钥' : 'Configure API Key'}
                      </h3>
                    </div>
                    <p className="text-dark-600 dark:text-dark-400 pl-11">
                      {language === 'zh' 
                        ? '前往设置页面，选择 API 提供商，输入密钥并保存。' 
                        : 'Go to Settings, select API provider, enter key and save.'}
                    </p>
                  </div>

                  {/* Step 2 */}
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">
                        2
                </div>
                      <h3 className="text-lg font-semibold text-dark-900 dark:text-dark-50">
                        {language === 'zh' ? '创建第一张图片' : 'Create First Image'}
                      </h3>
                    </div>
                    <p className="text-dark-600 dark:text-dark-400 pl-11">
                      {language === 'zh' 
                        ? '访问 AI Studio，输入提示词，选择比例和风格，点击生成。' 
                        : 'Visit AI Studio, enter prompt, select ratio and style, click generate.'}
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">
                        3
                </div>
                      <h3 className="text-lg font-semibold text-dark-900 dark:text-dark-50">
                        {language === 'zh' ? '编辑和优化' : 'Edit and Optimize'}
                      </h3>
                    </div>
                    <p className="text-dark-600 dark:text-dark-400 pl-11">
                      {language === 'zh' 
                        ? '点击图片上的"编辑"按钮，使用智能修复、移除背景等工具进一步优化。' 
                        : 'Click "Edit" on image to use inpaint, remove background and other tools.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 快捷键 */}
          {activeTab === 'shortcuts' && (
            <div className="card p-8">
              <h2 className="text-2xl font-bold text-dark-900 dark:text-dark-50 mb-6">
                {language === 'zh' ? '键盘快捷键' : 'Keyboard Shortcuts'}
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-dark-900 dark:text-dark-50 mb-3">
                    {language === 'zh' ? '导航' : 'Navigation'}
                  </h3>
                  <div className="space-y-2">
                    {[
                      { key: 'G', desc: language === 'zh' ? '跳转到 AI Studio' : 'Go to AI Studio' },
                      { key: 'E', desc: language === 'zh' ? '跳转到 Editor' : 'Go to Editor' },
                      { key: 'L', desc: language === 'zh' ? '跳转到 Gallery' : 'Go to Gallery' },
                      { key: 'T', desc: language === 'zh' ? '跳转到 Playground' : 'Go to Playground' },
                    ].map((item) => (
                      <div key={item.key} className="flex justify-between items-center p-3 bg-dark-50 dark:bg-dark-900 rounded-lg">
                        <span className="text-dark-700 dark:text-dark-300">{item.desc}</span>
                        <kbd className="px-3 py-1 bg-white dark:bg-dark-800 border border-dark-300 dark:border-dark-700 rounded font-mono text-sm">
                          {item.key}
                        </kbd>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-dark-900 dark:text-dark-50 mb-3">
                    {language === 'zh' ? '操作' : 'Actions'}
                  </h3>
                  <div className="space-y-2">
                    {[
                      { key: 'Ctrl+Enter', desc: language === 'zh' ? '执行生成/编辑' : 'Execute generate/edit' },
                      { key: 'P', desc: language === 'zh' ? '打开提示词画廊' : 'Open prompt gallery' },
                      { key: '?', desc: language === 'zh' ? '显示快捷键帮助' : 'Show shortcuts help' },
                    ].map((item) => (
                      <div key={item.key} className="flex justify-between items-center p-3 bg-dark-50 dark:bg-dark-900 rounded-lg">
                        <span className="text-dark-700 dark:text-dark-300">{item.desc}</span>
                        <kbd className="px-3 py-1 bg-white dark:bg-dark-800 border border-dark-300 dark:border-dark-700 rounded font-mono text-sm">
                          {item.key}
                        </kbd>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 常见问题 */}
          {activeTab === 'faq' && (
              <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="card">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full p-6 text-left flex items-center justify-between"
                  >
                    <h3 className="font-semibold text-dark-900 dark:text-dark-50">
                      {faq.q}
                    </h3>
                    <ChevronDown className={`w-5 h-5 text-dark-400 transition-transform ${
                      openFaq === idx ? 'rotate-180' : ''
                    }`} />
                  </button>
                  {openFaq === idx && (
                    <div className="px-6 pb-6 text-dark-600 dark:text-dark-400">
                      {faq.a}
                    </div>
                  )}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
