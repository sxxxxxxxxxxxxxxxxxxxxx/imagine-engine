'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Code2, PlayCircle, Settings2, BarChart3 } from 'lucide-react';

export default function PlaygroundPage() {
  const { language, t } = useLanguage();
  const [selectedModel1, setSelectedModel1] = useState('gemini-2.5-flash');
  const [selectedModel2, setSelectedModel2] = useState('dall-e-3');
  const [prompt, setPrompt] = useState('');

  const models = [
    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', provider: 'Google' },
    { id: 'dall-e-3', name: 'DALL-E 3', provider: 'OpenAI' },
    { id: 'sd-xl', name: 'Stable Diffusion XL', provider: 'Stability' },
  ];

  return (
    <div className="page-container">
      <div className="content-wrapper">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark-900 dark:text-dark-50 mb-2">
            {t('playground.title')}
          </h1>
          <p className="text-dark-600 dark:text-dark-400">
            {t('playground.subtitle')}
          </p>
        </div>

        {/* Control Panel */}
        <div className="card p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Settings2 className="w-5 h-5 text-primary-400" />
            <h2 className="text-lg font-semibold text-dark-900 dark:text-dark-50">
              {t('playground.configuration')}
            </h2>
          </div>

          <div className="space-y-4">
            {/* Prompt */}
            <div>
              <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                {t('playground.prompt')}
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={t('playground.promptPlaceholder')}
                className="textarea h-24"
              />
            </div>

            {/* Model Selection */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                  {t('playground.model1')}
                </label>
                <select
                  value={selectedModel1}
                  onChange={(e) => setSelectedModel1(e.target.value)}
                  className="select"
                >
                  {models.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name} ({model.provider})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                  {t('playground.model2')}
                </label>
                <select
                  value={selectedModel2}
                  onChange={(e) => setSelectedModel2(e.target.value)}
                  className="select"
                >
                  {models.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name} ({model.provider})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button className="btn-primary">
                <PlayCircle className="w-5 h-5" />
                {t('playground.runComparison')}
              </button>
              <button className="btn-secondary">
                <Code2 className="w-5 h-5" />
                {language === 'zh' ? '查看 API 请求' : 'View API Request'}
              </button>
              <button className="btn-secondary">
                <BarChart3 className="w-5 h-5" />
                {language === 'zh' ? '性能指标' : 'Performance Metrics'}
              </button>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Model A Result */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-dark-900 dark:text-dark-50 mb-4">
              {models.find(m => m.id === selectedModel1)?.name}
            </h3>
            <div className="aspect-square bg-dark-100 dark:bg-dark-900 rounded-lg flex items-center justify-center">
              <p className="text-dark-500">{t('playground.noResults')}</p>
            </div>
            <div className="mt-4 text-sm text-dark-600 dark:text-dark-400">
              <div className="flex justify-between">
                <span>{language === 'zh' ? '时间' : 'Time'}:</span>
                <span className="font-mono">--</span>
              </div>
              <div className="flex justify-between">
                <span>{language === 'zh' ? '成本' : 'Cost'}:</span>
                <span className="font-mono">--</span>
              </div>
            </div>
          </div>

          {/* Model B Result */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-dark-900 dark:text-dark-50 mb-4">
              {models.find(m => m.id === selectedModel2)?.name}
            </h3>
            <div className="aspect-square bg-dark-100 dark:bg-dark-900 rounded-lg flex items-center justify-center">
              <p className="text-dark-500">{t('playground.noResults')}</p>
            </div>
            <div className="mt-4 text-sm text-dark-600 dark:text-dark-400">
              <div className="flex justify-between">
                <span>{language === 'zh' ? '时间' : 'Time'}:</span>
                <span className="font-mono">--</span>
              </div>
              <div className="flex justify-between">
                <span>{language === 'zh' ? '成本' : 'Cost'}:</span>
                <span className="font-mono">--</span>
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="card p-6 mt-6 border-2 border-primary-200 dark:border-primary-800">
          <div className="text-center">
            <div className="inline-flex w-16 h-16 bg-primary-50 dark:bg-primary-900/20 rounded-2xl items-center justify-center mb-4">
              <Code2 className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-xl font-semibold text-dark-900 dark:text-dark-50 mb-2">
              {t('playground.comingSoon')}
            </h3>
            <p className="text-dark-600 dark:text-dark-400 max-w-2xl mx-auto">
              {t('playground.comingSoonDesc')}
              {language === 'zh' && '。高级功能包括参数调优、API 调试和性能分析。'}
              {language === 'en' && ' Advanced features including parameter tuning, API debugging, and performance analytics.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

