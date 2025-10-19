'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Boxes, Plus, Wand2, Image as ImageIcon, Sparkles } from 'lucide-react';

export default function ToolsPage() {
  const { language } = useLanguage();
  const [imageCount, setImageCount] = useState(2);

  return (
    <div className="page-container">
      <div className="content-wrapper">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark-900 dark:text-dark-50 mb-2">
            {language === 'zh' ? '创意工坊' : 'Creative Tools'}
          </h1>
          <p className="text-dark-600 dark:text-dark-400">
            {language === 'zh' ? '多图融合和创意合成工具' : 'Multi-image fusion and creative composition'}
          </p>
        </div>

        {/* 工具选择 */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card-hover p-6">
            <Boxes className="w-12 h-12 text-primary-600 dark:text-primary-400 mb-4" />
            <h3 className="text-lg font-semibold text-dark-900 dark:text-dark-50 mb-2">
              {language === 'zh' ? '图像融合' : 'Image Fusion'}
            </h3>
            <p className="text-sm text-dark-600 dark:text-dark-400 mb-4">
              {language === 'zh' ? '将 2-6 张图片无缝融合' : 'Seamlessly merge 2-6 images'}
            </p>
            <span className="badge-primary">
              {language === 'zh' ? '即将推出' : 'Coming Soon'}
                </span>
              </div>

          <div className="card-hover p-6 opacity-50">
            <Wand2 className="w-12 h-12 text-dark-400 mb-4" />
            <h3 className="text-lg font-semibold text-dark-900 dark:text-dark-50 mb-2">
              {language === 'zh' ? '风格迁移' : 'Style Transfer'}
            </h3>
            <p className="text-sm text-dark-600 dark:text-dark-400 mb-4">
              {language === 'zh' ? '将一张图的风格应用到另一张' : 'Apply style from one image to another'}
            </p>
            <span className="badge-neutral">
              {language === 'zh' ? '计划中' : 'Planned'}
                </span>
          </div>

          <div className="card-hover p-6 opacity-50">
            <Sparkles className="w-12 h-12 text-dark-400 mb-4" />
            <h3 className="text-lg font-semibold text-dark-900 dark:text-dark-50 mb-2">
              {language === 'zh' ? '批量处理' : 'Batch Processing'}
            </h3>
            <p className="text-sm text-dark-600 dark:text-dark-400 mb-4">
              {language === 'zh' ? '批量编辑多张图片' : 'Edit multiple images at once'}
            </p>
            <span className="badge-neutral">
              {language === 'zh' ? '计划中' : 'Planned'}
              </span>
            </div>
              </div>
              
        {/* 占位内容 */}
        <div className="card p-12 text-center">
          <div className="w-20 h-20 bg-primary-50 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Boxes className="w-10 h-10 text-primary-600 dark:text-primary-400" />
          </div>
          <h2 className="text-2xl font-bold text-dark-900 dark:text-dark-50 mb-3">
            {language === 'zh' ? '高级工具开发中' : 'Advanced Tools in Development'}
          </h2>
          <p className="text-dark-600 dark:text-dark-400 max-w-2xl mx-auto">
            {language === 'zh' 
              ? '图像融合、风格迁移等高级工具正在开发中，敬请期待！' 
              : 'Image fusion, style transfer and other advanced tools are coming soon!'}
          </p>
        </div>
      </div>
    </div>
  );
}
