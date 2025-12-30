'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { ProviderManager } from '@/lib/apiProviders';
import { Code2, PlayCircle, Settings2, BarChart3, Download, Loader2, Clock, DollarSign, Zap, AlertCircle, CheckCircle2, X } from 'lucide-react';
import AuthModal from '@/components/AuthModal';
import CustomSelect from '@/components/CustomSelect';
import { supabase } from '@/lib/supabase';
import { downloadImage } from '@/lib/downloadUtils';

interface ModelResult {
  imageUrl?: string;
  error?: string;
  time?: number;
  cost?: number;
  tokens?: number;
  apiRequest?: any;
  timestamp?: number;
}

export default function PlaygroundPage() {
  const { language } = useLanguage();
  const { isLoggedIn } = useAuth();
  const [selectedModel1, setSelectedModel1] = useState('gemini-2.5-flash-image');
  const [selectedModel2, setSelectedModel2] = useState('gemini-3-pro-image-preview');
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [style, setStyle] = useState('');
  const [result1, setResult1] = useState<ModelResult | null>(null);
  const [result2, setResult2] = useState<ModelResult | null>(null);
  const [isGenerating1, setIsGenerating1] = useState(false);
  const [isGenerating2, setIsGenerating2] = useState(false);
  const [showApiRequest, setShowApiRequest] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiConfig, setApiConfig] = useState<{ apiKey: string; baseUrl: string } | null>(null);

  // 获取可用的图像模型
  const pockgoProvider = ProviderManager.getProviderById('pockgo-image');
  const imageModels = pockgoProvider?.models.filter(m => m.type === 'image') || [];

  // 从ProviderManager获取API配置
  useEffect(() => {
    const loadConfig = () => {
      const modelId = localStorage.getItem('imagine-engine-model') || 'gemini-2.5-flash-image';
      const providerConfig = ProviderManager.getProviderByModelId(modelId);
      
      if (providerConfig) {
        const apiKey = ProviderManager.getApiKey(providerConfig.provider.id) || '';
        const baseUrl = providerConfig.provider.baseUrl;
        setApiConfig({ apiKey, baseUrl });
      } else {
        const apiKey = localStorage.getItem('imagine-engine-api-key') || '';
        const baseUrl = localStorage.getItem('imagine-engine-base-url') || 'https://newapi.aicohere.org/v1/chat/completions';
        setApiConfig({ apiKey, baseUrl });
      }
    };
    
    loadConfig();
    const interval = setInterval(loadConfig, 1000);
    return () => clearInterval(interval);
  }, []);

  const generateWithModel = async (modelId: string, isModel1: boolean) => {
    if (!prompt.trim()) {
      setError(language === 'zh' ? '请输入提示词' : 'Please enter a prompt');
      return;
    }

    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }

    if (!apiConfig || !apiConfig.apiKey) {
      setError(language === 'zh' ? '请先在设置中配置API密钥' : 'Please configure API key in settings');
      return;
    }

    const setIsGenerating = isModel1 ? setIsGenerating1 : setIsGenerating2;
    const setResult = isModel1 ? setResult1 : setResult2;
    
    setIsGenerating(true);
    setError(null);
    setResult(null);

    const startTime = Date.now();
    const apiRequest = {
      prompt,
      model: modelId,
      aspectRatio,
      style: style || undefined,
      apiKey: apiConfig.apiKey,
      baseUrl: apiConfig.baseUrl
    };

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify(apiRequest)
      });

      const data = await response.json();
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;

      if (data.error) {
        throw new Error(data.message || data.error);
      }

      // 计算成本（基于模型配置）
      const modelConfig = imageModels.find(m => m.id === modelId);
      const estimatedCost = modelConfig?.costPer1k ? (modelConfig.costPer1k * (data.usage?.total_tokens || 1000) / 1000) : 0;

      setResult({
        imageUrl: data.imageUrl,
        time: duration,
        cost: estimatedCost,
        tokens: data.usage?.total_tokens,
        apiRequest,
        timestamp: Date.now()
      });
    } catch (err: any) {
      setResult({
        error: err.message || (language === 'zh' ? '生成失败' : 'Generation failed'),
        apiRequest,
        timestamp: Date.now()
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const runComparison = async () => {
    setResult1(null);
    setResult2(null);
    setError(null);

    // 并行生成两个模型的结果
    await Promise.all([
      generateWithModel(selectedModel1, true),
      generateWithModel(selectedModel2, false)
    ]);
  };

  const generateSingle = async (isModel1: boolean) => {
    const modelId = isModel1 ? selectedModel1 : selectedModel2;
    await generateWithModel(modelId, isModel1);
  };

  const aspectRatios = [
    { value: '1:1', label: '1:1' },
    { value: '16:9', label: '16:9' },
    { value: '9:16', label: '9:16' },
    { value: '4:3', label: '4:3' },
    { value: '3:4', label: '3:4' },
  ];

  const styles = [
    { value: '', label: language === 'zh' ? '默认' : 'Default' },
    { value: 'realistic', label: language === 'zh' ? '写实' : 'Realistic' },
    { value: 'artistic', label: language === 'zh' ? '艺术' : 'Artistic' },
    { value: 'anime', label: language === 'zh' ? '动漫' : 'Anime' },
  ];

  return (
    <div className="page-container">
      <div className="content-wrapper max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-500/20 rounded-2xl mb-6">
            <Code2 className="w-10 h-10 text-primary-500" />
          </div>
          <h1 className="text-5xl font-bold text-dark-900 dark:text-dark-50 mb-4">
            {language === 'zh' ? 'AI 实验室' : 'AI Playground'}
          </h1>
          <p className="text-xl text-dark-600 dark:text-dark-400 max-w-2xl mx-auto leading-relaxed">
            {language === 'zh'
              ? '对比测试不同模型，调优参数，探索AI生成的最佳效果'
              : 'Compare models, tune parameters, explore the best AI generation results'}
          </p>
        </div>

        {/* Control Panel */}
        <div className="card p-8 mb-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
              <Settings2 className="w-5 h-5 text-primary-500" />
            </div>
            <h2 className="text-xl font-semibold text-dark-900 dark:text-dark-50">
              {language === 'zh' ? '配置参数' : 'Configuration'}
            </h2>
          </div>

          <div className="space-y-6">
            {/* Prompt */}
            <div>
              <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-3">
                {language === 'zh' ? '提示词' : 'Prompt'}
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={language === 'zh' ? '输入你想要生成的图片描述...' : 'Enter your image description...'}
                className="textarea h-32 w-full text-base"
              />
            </div>

            {/* Model Selection & Parameters */}
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-3">
                  {language === 'zh' ? '模型 A' : 'Model A'}
                </label>
                <CustomSelect
                  value={selectedModel1}
                  onChange={setSelectedModel1}
                  options={imageModels.map((model) => ({
                    value: model.id,
                    label: language === 'zh' ? model.nameZh : model.name
                  }))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-3">
                  {language === 'zh' ? '模型 B' : 'Model B'}
                </label>
                <CustomSelect
                  value={selectedModel2}
                  onChange={setSelectedModel2}
                  options={imageModels.map((model) => ({
                    value: model.id,
                    label: language === 'zh' ? model.nameZh : model.name
                  }))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-3">
                  {language === 'zh' ? '宽高比' : 'Aspect Ratio'}
                </label>
                <CustomSelect
                  value={aspectRatio}
                  onChange={setAspectRatio}
                  options={aspectRatios}
                  className="w-full"
                />
              </div>
            </div>

            {/* Style Selection */}
            <div>
              <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-3">
                {language === 'zh' ? '风格' : 'Style'}
              </label>
              <div className="flex flex-wrap gap-3">
                {styles.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setStyle(s.value)}
                    className={`px-5 py-2.5 rounded-lg border-2 transition-all font-medium ${
                      style === s.value
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-400 ring-2 ring-primary-200 dark:ring-primary-800'
                        : 'border-dark-200 dark:border-dark-700 text-dark-700 dark:text-dark-300 hover:border-primary-300 hover:bg-dark-50 dark:hover:bg-dark-800'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 flex-wrap pt-2">
              <button
                onClick={runComparison}
                disabled={isGenerating1 || isGenerating2}
                className="btn-primary px-6 py-3 text-base font-semibold"
              >
                {isGenerating1 || isGenerating2 ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {language === 'zh' ? '生成中...' : 'Generating...'}
                  </>
                ) : (
                  <>
                    <PlayCircle className="w-5 h-5" />
                    {language === 'zh' ? '对比测试' : 'Run Comparison'}
                  </>
                )}
              </button>
              <button
                onClick={() => generateSingle(true)}
                disabled={isGenerating1}
                className="btn-secondary px-5 py-3 text-base"
              >
                {isGenerating1 ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {language === 'zh' ? '生成中...' : 'Generating...'}
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    {language === 'zh' ? '仅测试模型 A' : 'Test Model A Only'}
                  </>
                )}
              </button>
              <button
                onClick={() => generateSingle(false)}
                disabled={isGenerating2}
                className="btn-secondary px-5 py-3 text-base"
              >
                {isGenerating2 ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {language === 'zh' ? '生成中...' : 'Generating...'}
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    {language === 'zh' ? '仅测试模型 B' : 'Test Model B Only'}
                  </>
                )}
              </button>
              <button
                onClick={() => setShowApiRequest(!showApiRequest)}
                className="btn-secondary px-5 py-3 text-base"
              >
                <Code2 className="w-5 h-5" />
                {language === 'zh' ? '查看 API 请求' : 'View API Request'}
              </button>
            </div>

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* API Request Viewer */}
        {showApiRequest && (result1?.apiRequest || result2?.apiRequest) && (
          <div className="card p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-dark-900 dark:text-dark-50 flex items-center gap-2">
                <Code2 className="w-5 h-5 text-primary-500" />
                {language === 'zh' ? 'API 请求详情' : 'API Request Details'}
              </h3>
              <button
                onClick={() => setShowApiRequest(false)}
                className="text-dark-400 hover:text-dark-600 dark:hover:text-dark-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              {result1?.apiRequest && (
                <div>
                  <p className="text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                    {language === 'zh' ? '模型 A 请求' : 'Model A Request'}
                  </p>
                  <pre className="bg-dark-50 dark:bg-dark-900 p-4 rounded-lg text-xs overflow-x-auto">
                    {JSON.stringify(result1.apiRequest, null, 2)}
                  </pre>
                </div>
              )}
              {result2?.apiRequest && (
                <div>
                  <p className="text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                    {language === 'zh' ? '模型 B 请求' : 'Model B Request'}
                  </p>
                  <pre className="bg-dark-50 dark:bg-dark-900 p-4 rounded-lg text-xs overflow-x-auto">
                    {JSON.stringify(result2.apiRequest, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Model A Result */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                  <span className="text-primary-500 font-bold text-lg">A</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-dark-900 dark:text-dark-50">
                    {imageModels.find(m => m.id === selectedModel1)?.nameZh || imageModels.find(m => m.id === selectedModel1)?.name}
                  </h3>
                  <p className="text-xs text-dark-500 dark:text-dark-400 mt-0.5">
                    {language === 'zh' ? '模型 A' : 'Model A'}
                  </p>
                </div>
              </div>
              {result1?.imageUrl && (
                <button
                  onClick={() => downloadImage(result1.imageUrl!, `playground-model-a-${Date.now()}.png`)}
                  className="btn-secondary text-sm py-2 px-3"
                >
                  <Download className="w-4 h-4" />
                </button>
              )}
            </div>
            
            {isGenerating1 ? (
              <div className="aspect-square bg-dark-100 dark:bg-dark-900 rounded-xl flex items-center justify-center border-2 border-dashed border-dark-300 dark:border-dark-700">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 animate-spin text-primary-500 mx-auto mb-4" />
                  <p className="text-dark-500 font-medium">{language === 'zh' ? '生成中...' : 'Generating...'}</p>
                </div>
              </div>
            ) : result1?.imageUrl ? (
              <div className="space-y-4">
                <div className="relative rounded-xl overflow-hidden border-2 border-primary-500">
                  <img src={result1.imageUrl} alt="Model A Result" className="w-full" />
                </div>
                <div className="space-y-3 p-4 bg-dark-50 dark:bg-dark-800 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-dark-600 dark:text-dark-400">
                      <Clock className="w-4 h-4" />
                      {language === 'zh' ? '生成时间' : 'Time'}
                    </span>
                    <span className="font-mono font-semibold text-dark-900 dark:text-dark-50">{result1.time?.toFixed(2)}s</span>
                  </div>
                  {result1.cost !== undefined && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-dark-600 dark:text-dark-400">
                        <DollarSign className="w-4 h-4" />
                        {language === 'zh' ? '估算成本' : 'Est. Cost'}
                      </span>
                      <span className="font-mono font-semibold text-dark-900 dark:text-dark-50">${result1.cost.toFixed(4)}</span>
                    </div>
                  )}
                  {result1.tokens && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-dark-600 dark:text-dark-400">{language === 'zh' ? 'Token 数' : 'Tokens'}</span>
                      <span className="font-mono font-semibold text-dark-900 dark:text-dark-50">{result1.tokens.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : result1?.error ? (
              <div className="aspect-square bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center justify-center border-2 border-red-200 dark:border-red-800">
                <div className="text-center p-6">
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <p className="text-red-700 dark:text-red-300 font-medium">{result1.error}</p>
                </div>
              </div>
            ) : (
              <div className="aspect-square bg-dark-100 dark:bg-dark-900 rounded-xl flex items-center justify-center border-2 border-dashed border-dark-300 dark:border-dark-700">
                <p className="text-dark-500">{language === 'zh' ? '暂无结果' : 'No results yet'}</p>
              </div>
            )}
          </div>

          {/* Model B Result */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                  <span className="text-primary-500 font-bold text-lg">B</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-dark-900 dark:text-dark-50">
                    {imageModels.find(m => m.id === selectedModel2)?.nameZh || imageModels.find(m => m.id === selectedModel2)?.name}
                  </h3>
                  <p className="text-xs text-dark-500 dark:text-dark-400 mt-0.5">
                    {language === 'zh' ? '模型 B' : 'Model B'}
                  </p>
                </div>
              </div>
              {result2?.imageUrl && (
                <button
                  onClick={() => downloadImage(result2.imageUrl!, `playground-model-b-${Date.now()}.png`)}
                  className="btn-secondary text-sm py-2 px-3"
                >
                  <Download className="w-4 h-4" />
                </button>
              )}
            </div>
            
            {isGenerating2 ? (
              <div className="aspect-square bg-dark-100 dark:bg-dark-900 rounded-xl flex items-center justify-center border-2 border-dashed border-dark-300 dark:border-dark-700">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 animate-spin text-primary-500 mx-auto mb-4" />
                  <p className="text-dark-500 font-medium">{language === 'zh' ? '生成中...' : 'Generating...'}</p>
                </div>
              </div>
            ) : result2?.imageUrl ? (
              <div className="space-y-4">
                <div className="relative rounded-xl overflow-hidden border-2 border-primary-500">
                  <img src={result2.imageUrl} alt="Model B Result" className="w-full" />
                </div>
                <div className="space-y-3 p-4 bg-dark-50 dark:bg-dark-800 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-dark-600 dark:text-dark-400">
                      <Clock className="w-4 h-4" />
                      {language === 'zh' ? '生成时间' : 'Time'}
                    </span>
                    <span className="font-mono font-semibold text-dark-900 dark:text-dark-50">{result2.time?.toFixed(2)}s</span>
                  </div>
                  {result2.cost !== undefined && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-dark-600 dark:text-dark-400">
                        <DollarSign className="w-4 h-4" />
                        {language === 'zh' ? '估算成本' : 'Est. Cost'}
                      </span>
                      <span className="font-mono font-semibold text-dark-900 dark:text-dark-50">${result2.cost.toFixed(4)}</span>
                    </div>
                  )}
                  {result2.tokens && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-dark-600 dark:text-dark-400">{language === 'zh' ? 'Token 数' : 'Tokens'}</span>
                      <span className="font-mono font-semibold text-dark-900 dark:text-dark-50">{result2.tokens.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : result2?.error ? (
              <div className="aspect-square bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center justify-center border-2 border-red-200 dark:border-red-800">
                <div className="text-center p-6">
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <p className="text-red-700 dark:text-red-300 font-medium">{result2.error}</p>
                </div>
              </div>
            ) : (
              <div className="aspect-square bg-dark-100 dark:bg-dark-900 rounded-xl flex items-center justify-center border-2 border-dashed border-dark-300 dark:border-dark-700">
                <p className="text-dark-500">{language === 'zh' ? '暂无结果' : 'No results yet'}</p>
              </div>
            )}
          </div>
        </div>

        {/* Performance Comparison */}
        {result1 && result2 && result1.imageUrl && result2.imageUrl && (
          <div className="card p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary-500" />
              </div>
              <h3 className="text-xl font-semibold text-dark-900 dark:text-dark-50">
                {language === 'zh' ? '性能对比' : 'Performance Comparison'}
              </h3>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-dark-50 dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-5 h-5 text-primary-500" />
                  <div className="text-sm font-medium text-dark-600 dark:text-dark-400">
                    {language === 'zh' ? '生成速度' : 'Generation Speed'}
                  </div>
                </div>
                <div className="text-2xl font-bold text-dark-900 dark:text-dark-50 mb-2">
                  {result1.time && result2.time ? (
                    result1.time < result2.time ? (
                      <span className="text-primary-600 dark:text-primary-400">
                        {language === 'zh' ? '模型 A 更快' : 'Model A Faster'}
                      </span>
                    ) : (
                      <span className="text-primary-600 dark:text-primary-400">
                        {language === 'zh' ? '模型 B 更快' : 'Model B Faster'}
                      </span>
                    )
                  ) : '--'}
                </div>
                <div className="text-xs text-dark-500 dark:text-dark-400">
                  {result1.time && result2.time && (
                    `${Math.abs(result1.time - result2.time).toFixed(2)}s ${language === 'zh' ? '差异' : 'difference'}`
                  )}
                </div>
              </div>
              <div className="p-6 bg-dark-50 dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700">
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="w-5 h-5 text-primary-500" />
                  <div className="text-sm font-medium text-dark-600 dark:text-dark-400">
                    {language === 'zh' ? '成本对比' : 'Cost Comparison'}
                  </div>
                </div>
                <div className="text-2xl font-bold text-dark-900 dark:text-dark-50 mb-2">
                  {result1.cost !== undefined && result2.cost !== undefined ? (
                    result1.cost < result2.cost ? (
                      <span className="text-primary-600 dark:text-primary-400">
                        {language === 'zh' ? '模型 A 更便宜' : 'Model A Cheaper'}
                      </span>
                    ) : (
                      <span className="text-primary-600 dark:text-primary-400">
                        {language === 'zh' ? '模型 B 更便宜' : 'Model B Cheaper'}
                      </span>
                    )
                  ) : '--'}
                </div>
                <div className="text-xs text-dark-500 dark:text-dark-400">
                  {result1.cost !== undefined && result2.cost !== undefined && (
                    `${Math.abs(result1.cost - result2.cost).toFixed(4)} $${language === 'zh' ? '差异' : 'difference'}`
                  )}
                </div>
              </div>
              <div className="p-6 bg-dark-50 dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-primary-500" />
                  <div className="text-sm font-medium text-dark-600 dark:text-dark-400">
                    {language === 'zh' ? '质量评分' : 'Quality Score'}
                  </div>
                </div>
                <div className="text-2xl font-bold text-dark-900 dark:text-dark-50 mb-2">
                  {language === 'zh' ? '需人工评估' : 'Manual Review'}
                </div>
                <div className="text-xs text-dark-500 dark:text-dark-400">
                  {language === 'zh' ? '请对比视觉效果' : 'Compare visual quality'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Info Card */}
        <div className="card p-8 bg-primary-50 dark:bg-primary-950/30 border-2 border-primary-200 dark:border-primary-800">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary-500/20 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-6 h-6 text-primary-500" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-lg text-dark-900 dark:text-dark-50 mb-4">
                {language === 'zh' ? '使用提示' : 'Usage Tips'}
              </h4>
              <ul className="space-y-3 text-sm text-dark-700 dark:text-dark-300">
                <li className="flex items-start gap-2">
                  <span className="text-primary-500 mt-1">•</span>
                  <span>{language === 'zh' ? '对比测试会同时生成两个模型的结果，消耗2张配额' : 'Comparison test generates both models simultaneously, consumes 2 quota'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-500 mt-1">•</span>
                  <span>{language === 'zh' ? '可以单独测试某个模型，只消耗1张配额' : 'You can test a single model, consumes only 1 quota'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-500 mt-1">•</span>
                  <span>{language === 'zh' ? '性能指标仅供参考，实际效果以视觉对比为准' : 'Performance metrics are for reference only, visual comparison is the standard'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-500 mt-1">•</span>
                  <span>{language === 'zh' ? '建议使用相同的提示词和参数进行公平对比' : 'Use the same prompt and parameters for fair comparison'}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => setShowAuthModal(false)}
        initialMode="signup"
      />
    </div>
  );
}
