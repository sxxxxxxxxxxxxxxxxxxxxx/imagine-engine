'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { ProviderManager } from '@/lib/apiProviders';
import { Microscope, FlaskConical, Atom, Wrench, Heart, Sparkles, Loader2, Download, FileText, Upload, Image as ImageIcon, Zap, Star, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import AuthModal from '@/components/AuthModal';
import { supabase } from '@/lib/supabase';
import { downloadImage } from '@/lib/downloadUtils';
import { ScientificDiscipline, DrawingType, DrawingStyle } from '@/types/scientific';
import { getTemplatesByDiscipline } from '@/lib/scientificTemplates';
import { ScientificTemplate } from '@/types/scientific';

export default function ScientificDrawingPage() {
  const { isLoggedIn } = useAuth();
  const { language } = useLanguage();
  const [selectedDiscipline, setSelectedDiscipline] = useState<ScientificDiscipline>('biology');
  const [description, setDescription] = useState('');
  const [drawingType, setDrawingType] = useState<DrawingType>('illustration');
  const [style, setStyle] = useState<DrawingStyle>('clean');
  const [size, setSize] = useState<'A4' | '16:9' | '1:1'>('A4');
  const [components, setComponents] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ScientificTemplate | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [variants, setVariants] = useState<Array<{ imageUrl: string; variantIndex: number }>>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiConfig, setApiConfig] = useState<{ apiKey: string; baseUrl: string; model: string } | null>(null);
  
  // 新增状态：生成模式、参考图、风格强度
  const [generationMode, setGenerationMode] = useState<'single' | 'lottery' | 'reference'>('single');
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [styleStrength, setStyleStrength] = useState(70);
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  // 默认选择Gemini模型（推荐）
  const getDefaultModel = () => {
    const pockgoProvider = ProviderManager.getProviderById('pockgo-image');
    const imageModels = pockgoProvider?.models.filter(m => m.type === 'image') || [];
    const geminiModels = imageModels.filter(m => m.id.includes('gemini'));
    const defaultGemini = geminiModels.find(m => m.id === 'gemini-2.5-flash-image')?.id || geminiModels[0]?.id;
    return defaultGemini || localStorage.getItem('imagine-engine-model') || 'gemini-2.5-flash-image';
  };
  
  const [selectedModel, setSelectedModel] = useState<string>(getDefaultModel());
  const [templatesExpanded, setTemplatesExpanded] = useState(false);
  const [modelsExpanded, setModelsExpanded] = useState(false);

  // 获取可用的图像模型（优先Gemini）
  const pockgoProvider = ProviderManager.getProviderById('pockgo-image');
  const imageModels = pockgoProvider?.models.filter(m => m.type === 'image') || [];
  const geminiModels = imageModels.filter(m => m.id.includes('gemini')).sort((a, b) => {
    // 排序：优先推荐 gemini-2.5-flash-image，然后是 gemini-3-pro 系列
    if (a.id === 'gemini-2.5-flash-image') return -1;
    if (b.id === 'gemini-2.5-flash-image') return 1;
    if (a.id.includes('gemini-3-pro')) return -1;
    if (b.id.includes('gemini-3-pro')) return 1;
    return 0;
  });
  const otherModels = imageModels.filter(m => !m.id.includes('gemini'));

  // 从ProviderManager获取API配置
  useEffect(() => {
    const loadConfig = () => {
      const modelId = selectedModel || localStorage.getItem('imagine-engine-model') || 'gemini-2.5-flash-image';
      const providerConfig = ProviderManager.getProviderByModelId(modelId);
      
      if (providerConfig) {
        const apiKey = ProviderManager.getApiKey(providerConfig.provider.id) || '';
        const baseUrl = providerConfig.provider.baseUrl;
        setApiConfig({ apiKey, baseUrl, model: modelId });
      } else {
        const apiKey = localStorage.getItem('imagine-engine-api-key') || '';
        const baseUrl = localStorage.getItem('imagine-engine-base-url') || 'https://newapi.aicohere.org/v1/chat/completions';
        setApiConfig({ apiKey, baseUrl, model: modelId });
      }
    };
    
    loadConfig();
    const interval = setInterval(loadConfig, 1000);
    return () => clearInterval(interval);
  }, [selectedModel]);

  // 当选择模板时，自动填充参数
  useEffect(() => {
    if (selectedTemplate) {
      setDescription(selectedTemplate.description[language]);
      setDrawingType(selectedTemplate.type);
      setStyle(selectedTemplate.parameters.style?.[0] || 'clean');
      setComponents(selectedTemplate.parameters.components || []);
    }
  }, [selectedTemplate, language]);

  const disciplines = [
    { id: 'biology' as ScientificDiscipline, icon: Microscope, labelZh: '生物学', labelEn: 'Biology' },
    { id: 'chemistry' as ScientificDiscipline, icon: FlaskConical, labelZh: '化学', labelEn: 'Chemistry' },
    { id: 'physics' as ScientificDiscipline, icon: Atom, labelZh: '物理学', labelEn: 'Physics' },
    { id: 'engineering' as ScientificDiscipline, icon: Wrench, labelZh: '工程学', labelEn: 'Engineering' },
    { id: 'medicine' as ScientificDiscipline, icon: Heart, labelZh: '医学', labelEn: 'Medicine' },
  ];

  const templates = getTemplatesByDiscipline(selectedDiscipline);

  // 处理参考图上传
  const handleReferenceImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setReferenceImage(base64);
      setGenerationMode('reference');
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!description.trim()) {
      setError(language === 'zh' ? '请输入绘图描述' : 'Please enter a description');
      return;
    }

    if (generationMode === 'reference' && !referenceImage) {
      setError(language === 'zh' ? '请先上传参考图片' : 'Please upload a reference image');
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

    setIsGenerating(true);
    setError(null);
    setResult(null);
    setVariants([]);
    setSelectedVariant(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch('/api/scientific-drawing', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': session ? `Bearer ${session.access_token}` : ''
        },
        body: JSON.stringify({
          description,
          discipline: selectedDiscipline,
          drawingType,
          style,
          components,
          size,
          templateId: selectedTemplate?.id,
          referenceImage: referenceImage || undefined,
          styleStrength: generationMode === 'reference' ? styleStrength : undefined,
          mode: generationMode,
          variantCount: generationMode === 'lottery' ? 4 : undefined,
          apiKey: apiConfig.apiKey,
          baseUrl: apiConfig.baseUrl,
          model: selectedModel || apiConfig.model
        })
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.message || data.error);
      }

      // 处理抽卡模式的结果
      if (data.variants && Array.isArray(data.variants)) {
        setVariants(data.variants.filter((v: any) => v.imageUrl && !v.error));
      } else if (data.imageUrl) {
        setResult(data.imageUrl);
      }
    } catch (err: any) {
      setError(err.message || (language === 'zh' ? '生成失败，请重试' : 'Generation failed, please try again'));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="page-container">
      <div className="content-wrapper max-w-6xl mx-auto">
        
        {/* Hero区 */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-500/20 rounded-2xl mb-6">
            <Microscope className="w-10 h-10 text-primary-500" />
          </div>
          <h1 className="text-5xl font-bold text-dark-900 dark:text-dark-50 mb-4">
            {language === 'zh' ? 'AI科研绘图助手' : 'AI Scientific Drawing Assistant'}
          </h1>
          <p className="text-xl text-dark-600 dark:text-dark-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            {language === 'zh'
              ? '5分钟生成专业学术配图，符合期刊发表要求'
              : 'Generate publication-ready scientific illustrations in 5 minutes'}
          </p>

          {/* 配额提示 */}
          <div className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg shadow-lg shadow-primary-500/30 border-2 border-primary-400">
            <Sparkles className="w-5 h-5 text-white" />
            <span className="text-sm font-semibold text-white">
              {language === 'zh' ? '消耗3张配额' : '3 quota per use'}
              {!isLoggedIn && (language === 'zh' ? ' · 注册送20张免费配额' : ' · Sign up for 20 free')}
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* 左侧：配置区 */}
          <div className="space-y-6">
            {/* 生成模式选择 */}
            <div>
              <h3 className="text-lg font-semibold text-dark-900 dark:text-dark-50 mb-4">
                {language === 'zh' ? '生成模式' : 'Generation Mode'}
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => {
                    setGenerationMode('single');
                    setReferenceImage(null);
                    setVariants([]);
                  }}
                  className={`p-4 rounded-lg border-2 transition-all text-center ${
                    generationMode === 'single'
                      ? 'border-primary-500 bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                      : 'border-dark-200 dark:border-dark-700 hover:border-primary-300 bg-white dark:bg-dark-900'
                  }`}
                >
                  <FileText className={`w-6 h-6 mx-auto mb-2 ${
                    generationMode === 'single' ? 'text-white' : 'text-primary-500'
                  }`} />
                  <p className={`text-xs font-medium mb-1 ${
                    generationMode === 'single' ? 'text-white' : 'text-dark-900 dark:text-dark-50'
                  }`}>{language === 'zh' ? '单张生成' : 'Single'}</p>
                  <p className={`text-xs ${
                    generationMode === 'single' ? 'text-white/90' : 'text-dark-500 dark:text-dark-400'
                  }`}>3 {language === 'zh' ? '配额' : 'quota'}</p>
                </button>
                <button
                  onClick={() => {
                    setGenerationMode('lottery');
                    setReferenceImage(null);
                    setVariants([]);
                  }}
                  className={`p-4 rounded-lg border-2 transition-all text-center ${
                    generationMode === 'lottery'
                      ? 'border-primary-500 bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                      : 'border-dark-200 dark:border-dark-700 hover:border-primary-300 bg-white dark:bg-dark-900'
                  }`}
                >
                  <Zap className={`w-6 h-6 mx-auto mb-2 ${
                    generationMode === 'lottery' ? 'text-white' : 'text-primary-500'
                  }`} />
                  <p className={`text-xs font-medium mb-1 ${
                    generationMode === 'lottery' ? 'text-white' : 'text-dark-900 dark:text-dark-50'
                  }`}>{language === 'zh' ? '抽卡模式' : 'Lottery'}</p>
                  <p className={`text-xs ${
                    generationMode === 'lottery' ? 'text-white/90' : 'text-dark-500 dark:text-dark-400'
                  }`}>12 {language === 'zh' ? '配额' : 'quota'}</p>
                </button>
                <button
                  onClick={() => {
                    setGenerationMode('reference');
                    setVariants([]);
                  }}
                  className={`p-4 rounded-lg border-2 transition-all text-center ${
                    generationMode === 'reference'
                      ? 'border-primary-500 bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                      : 'border-dark-200 dark:border-dark-700 hover:border-primary-300 bg-white dark:bg-dark-900'
                  }`}
                >
                  <ImageIcon className={`w-6 h-6 mx-auto mb-2 ${
                    generationMode === 'reference' ? 'text-white' : 'text-primary-500'
                  }`} />
                  <p className={`text-xs font-medium mb-1 ${
                    generationMode === 'reference' ? 'text-white' : 'text-dark-900 dark:text-dark-50'
                  }`}>{language === 'zh' ? '参考图' : 'Reference'}</p>
                  <p className={`text-xs ${
                    generationMode === 'reference' ? 'text-white/90' : 'text-dark-500 dark:text-dark-400'
                  }`}>3 {language === 'zh' ? '配额' : 'quota'}</p>
                </button>
              </div>
            </div>

            {/* 参考图上传（仅在参考图模式显示） */}
            {generationMode === 'reference' && (
              <div>
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                  {language === 'zh' ? '上传参考图片' : 'Upload Reference Image'}
                </label>
                {referenceImage ? (
                  <div className="relative">
                    <img src={referenceImage} alt="Reference" className="w-full rounded-lg border-2 border-primary-500" />
                    <button
                      onClick={() => setReferenceImage(null)}
                      className="absolute top-2 right-2 px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
                    >
                      {language === 'zh' ? '移除' : 'Remove'}
                    </button>
                  </div>
                ) : (
                  <label className="block p-8 border-2 border-dashed border-dark-300 dark:border-dark-700 rounded-lg text-center cursor-pointer hover:border-primary-500 transition-colors">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-dark-400" />
                    <p className="text-sm text-dark-600 dark:text-dark-400">
                      {language === 'zh' ? '点击上传参考图片' : 'Click to upload reference image'}
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleReferenceImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
                
                {/* 风格强度调节 */}
                {referenceImage && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                      {language === 'zh' ? '风格强度' : 'Style Strength'}: {styleStrength}%
                    </label>
                    <input
                      type="range"
                      min="30"
                      max="90"
                      step="10"
                      value={styleStrength}
                      onChange={(e) => setStyleStrength(Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-dark-500 dark:text-dark-400 mt-1">
                      <span>{language === 'zh' ? '低' : 'Low'}</span>
                      <span>{language === 'zh' ? '中' : 'Medium'}</span>
                      <span>{language === 'zh' ? '高' : 'High'}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 学科选择 */}
            <div>
              <h3 className="text-lg font-semibold text-dark-900 dark:text-dark-50 mb-4">
                {language === 'zh' ? '选择学科' : 'Select Discipline'}
              </h3>
              <div className="grid grid-cols-5 gap-3">
                {disciplines.map((d) => {
                  const Icon = d.icon;
                  return (
                    <button
                      key={d.id}
                      onClick={() => {
                        setSelectedDiscipline(d.id);
                        setSelectedTemplate(null);
                        setDescription('');
                      }}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedDiscipline === d.id
                          ? 'border-primary-500 bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                          : 'border-dark-200 dark:border-dark-700 hover:border-primary-300 bg-white dark:bg-dark-900'
                      }`}
                    >
                      <Icon className={`w-6 h-6 mx-auto mb-2 ${
                        selectedDiscipline === d.id ? 'text-white' : 'text-primary-500'
                      }`} />
                      <p className={`text-xs font-medium ${
                        selectedDiscipline === d.id ? 'text-white' : 'text-dark-900 dark:text-dark-50'
                      }`}>
                        {language === 'zh' ? d.labelZh : d.labelEn}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 模板选择（折叠式） */}
            {templates.length > 0 && (
              <div>
                <button
                  onClick={() => setTemplatesExpanded(!templatesExpanded)}
                  className="w-full flex items-center justify-between p-4 rounded-lg border-2 border-dark-200 dark:border-dark-700 hover:border-primary-300 transition-all mb-3"
                >
                  <h3 className="text-lg font-semibold text-dark-900 dark:text-dark-50">
                    {language === 'zh' ? '快速模板' : 'Quick Templates'} ({templates.length})
                  </h3>
                  {templatesExpanded ? (
                    <ChevronUp className="w-5 h-5 text-dark-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-dark-500" />
                  )}
                </button>
                
                {templatesExpanded && (
                  <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
                    {templates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => {
                          setSelectedTemplate(template);
                          setTemplatesExpanded(false); // 选择后自动折叠
                        }}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          selectedTemplate?.id === template.id
                            ? 'border-primary-500 bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                            : 'border-dark-200 dark:border-dark-700 hover:border-primary-300 bg-white dark:bg-dark-900'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {selectedTemplate?.id === template.id && (
                            <CheckCircle2 className="w-4 h-4 text-white mt-0.5 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <p className={`text-sm font-medium mb-1 ${
                              selectedTemplate?.id === template.id
                                ? 'text-white'
                                : 'text-dark-900 dark:text-dark-50'
                            }`}>
                              {language === 'zh' ? template.name.zh : template.name.en}
                            </p>
                            <p className={`text-xs line-clamp-2 ${
                              selectedTemplate?.id === template.id
                                ? 'text-white/90'
                                : 'text-dark-500 dark:text-dark-400'
                            }`}>
                              {language === 'zh' ? template.description.zh : template.description.en}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 模型选择（折叠式） */}
            <div>
              <button
                onClick={() => setModelsExpanded(!modelsExpanded)}
                className="w-full flex items-center justify-between p-4 rounded-lg border-2 border-dark-200 dark:border-dark-700 hover:border-primary-300 transition-all mb-3"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary-500" />
                  <h3 className="text-lg font-semibold text-dark-900 dark:text-dark-50">
                    {language === 'zh' ? '选择模型' : 'Select Model'}
                  </h3>
                  <span className="text-xs text-primary-600 dark:text-primary-400">
                    {language === 'zh' ? '（推荐Gemini）' : '(Gemini recommended)'}
                  </span>
                </div>
                {modelsExpanded ? (
                  <ChevronUp className="w-5 h-5 text-dark-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-dark-500" />
                )}
              </button>
              
              {modelsExpanded && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* Gemini模型（推荐） */}
                  {geminiModels.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">
                          {language === 'zh' ? '⭐ 推荐：Gemini系列' : '⭐ Recommended: Gemini Series'}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {geminiModels.map((model) => (
                          <button
                            key={model.id}
                            onClick={() => setSelectedModel(model.id)}
                            className={`w-full p-3 rounded-lg border-2 text-left transition-all relative ${
                              selectedModel === model.id
                                ? 'border-primary-500 bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                                : 'border-dark-200 dark:border-dark-700 hover:border-primary-300 bg-white dark:bg-dark-900'
                            }`}
                          >
                            {model.id === 'gemini-2.5-flash-image' && (
                              <span className={`absolute top-2 right-2 px-2 py-0.5 text-xs rounded-full font-semibold ${
                                selectedModel === model.id
                                  ? 'bg-white text-primary-600'
                                  : 'bg-primary-500 text-white'
                              }`}>
                                {language === 'zh' ? '推荐' : 'Best'}
                              </span>
                            )}
                            <div className="flex items-center justify-between pr-8">
                              <div>
                                <p className={`text-sm font-medium ${
                                  selectedModel === model.id
                                    ? 'text-white'
                                    : 'text-dark-900 dark:text-dark-50'
                                }`}>
                                  {language === 'zh' ? model.nameZh : model.name}
                                </p>
                                <p className={`text-xs mt-1 ${
                                  selectedModel === model.id
                                    ? 'text-white/90'
                                    : 'text-dark-500 dark:text-dark-400'
                                }`}>
                                  {language === 'zh' ? model.descriptionZh : model.description}
                                </p>
                              </div>
                              {selectedModel === model.id && (
                                <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0 ml-2" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 其他模型 */}
                  {otherModels.length > 0 && (
                    <details className="group">
                      <summary className="cursor-pointer text-sm font-medium text-dark-700 dark:text-dark-300 mb-2 flex items-center gap-2">
                        <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform" />
                        {language === 'zh' ? '其他模型' : 'Other Models'}
                      </summary>
                      <div className="mt-2 space-y-2">
                        {otherModels.map((model) => (
                          <button
                            key={model.id}
                            onClick={() => setSelectedModel(model.id)}
                            className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                              selectedModel === model.id
                                ? 'border-primary-500 bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                                : 'border-dark-200 dark:border-dark-700 hover:border-primary-300 bg-white dark:bg-dark-900'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className={`text-sm font-medium ${
                                  selectedModel === model.id
                                    ? 'text-white'
                                    : 'text-dark-900 dark:text-dark-50'
                                }`}>
                                  {language === 'zh' ? model.nameZh : model.name}
                                </p>
                                <p className={`text-xs mt-1 ${
                                  selectedModel === model.id
                                    ? 'text-white/90'
                                    : 'text-dark-500 dark:text-dark-400'
                                }`}>
                                  {language === 'zh' ? model.descriptionZh : model.description}
                                </p>
                              </div>
                              {selectedModel === model.id && (
                                <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0 ml-2" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </details>
                  )}
                </div>
              )}
            </div>

            {/* 描述输入 */}
            <div>
              <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                {language === 'zh' ? '绘图描述' : 'Drawing Description'}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={language === 'zh' 
                  ? '例如：绘制一个真核细胞结构图，包含细胞核、线粒体、内质网'
                  : 'e.g., Draw a eukaryotic cell structure with nucleus, mitochondria, ER'}
                className="w-full h-32 px-4 py-3 border-2 border-dark-200 dark:border-dark-700 rounded-lg bg-white dark:bg-dark-900 text-dark-900 dark:text-dark-50 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 resize-none"
              />
            </div>

            {/* 参数配置 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                  {language === 'zh' ? '绘图类型' : 'Drawing Type'}
                </label>
                <select
                  value={drawingType}
                  onChange={(e) => setDrawingType(e.target.value as DrawingType)}
                  className="w-full px-4 py-2 border-2 border-dark-200 dark:border-dark-700 rounded-lg bg-white dark:bg-dark-900 text-dark-900 dark:text-dark-50 focus:border-primary-500"
                >
                  <option value="illustration">{language === 'zh' ? '示意图' : 'Illustration'}</option>
                  <option value="flowchart">{language === 'zh' ? '流程图' : 'Flowchart'}</option>
                  <option value="structure">{language === 'zh' ? '结构图' : 'Structure'}</option>
                  <option value="diagram">{language === 'zh' ? '图表' : 'Diagram'}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                  {language === 'zh' ? '风格' : 'Style'}
                </label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value as DrawingStyle)}
                  className="w-full px-4 py-2 border-2 border-dark-200 dark:border-dark-700 rounded-lg bg-white dark:bg-dark-900 text-dark-900 dark:text-dark-50 focus:border-primary-500"
                >
                  <option value="clean">{language === 'zh' ? '简洁' : 'Clean'}</option>
                  <option value="detailed">{language === 'zh' ? '详细' : 'Detailed'}</option>
                  <option value="3d">{language === 'zh' ? '3D' : '3D'}</option>
                </select>
              </div>
            </div>

            {/* 尺寸选择 */}
            <div>
              <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                {language === 'zh' ? '图片尺寸' : 'Image Size'}
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['A4', '16:9', '1:1'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      size === s
                        ? 'border-primary-500 bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                        : 'border-dark-200 dark:border-dark-700 hover:border-primary-300 bg-white dark:bg-dark-900'
                    }`}
                  >
                    <p className={`text-sm font-medium ${
                      size === s ? 'text-white' : 'text-dark-900 dark:text-dark-50'
                    }`}>{s}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* 生成按钮 */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !description.trim() || (generationMode === 'reference' && !referenceImage)}
              className="w-full btn-primary py-4 text-base font-semibold shadow-md hover:shadow-lg disabled:opacity-50 transition-all"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {language === 'zh' ? '生成中...' : 'Generating...'}
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  {generationMode === 'lottery' 
                    ? (language === 'zh' ? '抽卡生成（12张配额，4个变体）' : 'Lottery Generate (12 quota, 4 variants)')
                    : generationMode === 'reference'
                    ? (language === 'zh' ? '参考图生成（3张配额）' : 'Reference Generate (3 quota)')
                    : (language === 'zh' ? '生成科研绘图（3张配额）' : 'Generate Scientific Drawing (3 quota)')
                  }
                </>
              )}
            </button>

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}
          </div>

          {/* 右侧：结果展示 */}
          <div>
            <h3 className="text-lg font-semibold text-dark-900 dark:text-dark-50 mb-4">
              {language === 'zh' ? '生成结果' : 'Result'}
            </h3>
            
            {/* 抽卡模式：并排显示多个变体 */}
            {variants.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {variants.map((variant, index) => (
                    <div
                      key={index}
                      className={`relative rounded-lg border-2 transition-all cursor-pointer ${
                        selectedVariant === index
                          ? 'border-primary-500 ring-2 ring-primary-200 dark:ring-primary-800'
                          : 'border-dark-200 dark:border-dark-700 hover:border-primary-300'
                      }`}
                      onClick={() => setSelectedVariant(index)}
                    >
                      <img
                        src={variant.imageUrl}
                        alt={`Variant ${variant.variantIndex}`}
                        className="w-full rounded-lg"
                      />
                      {selectedVariant === index && (
                        <div className="absolute top-2 right-2 bg-primary-500 text-white rounded-full p-1">
                          <Star className="w-4 h-4 fill-current" />
                        </div>
                      )}
                      <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                        {language === 'zh' ? `变体 ${variant.variantIndex}` : `Variant ${variant.variantIndex}`}
                      </div>
                    </div>
                  ))}
                </div>
                
                {selectedVariant !== null && (
                  <div className="space-y-3">
                    <p className="text-sm text-dark-600 dark:text-dark-400 text-center">
                      {language === 'zh' 
                        ? `已选择变体 ${selectedVariant + 1}，点击下方按钮下载`
                        : `Selected variant ${selectedVariant + 1}, click below to download`}
                    </p>
                    <button
                      onClick={async () => {
                        setIsDownloading(true);
                        setError(null);
                        try {
                          await downloadImage(
                            variants[selectedVariant].imageUrl,
                            `scientific-drawing-${selectedDiscipline}-variant-${variants[selectedVariant].variantIndex}-${Date.now()}.png`
                          );
                        } catch (error) {
                          setError(language === 'zh' ? '下载失败，请重试' : 'Download failed, please try again');
                        } finally {
                          setIsDownloading(false);
                        }
                      }}
                      disabled={isDownloading}
                      className="w-full py-3 btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isDownloading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          {language === 'zh' ? '下载中...' : 'Downloading...'}
                        </>
                      ) : (
                        <>
                          <Download className="w-5 h-5" />
                          {language === 'zh' ? '下载选中的科研图' : 'Download Selected Drawing'}
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ) : result ? (
              // 单张模式：显示单张结果
              <div className="space-y-4">
                <img src={result} alt="Scientific Drawing" className="w-full rounded-lg border-2 border-primary-500" />
                <button
                  onClick={async () => {
                    setIsDownloading(true);
                    setError(null);
                    try {
                      await downloadImage(result, `scientific-drawing-${selectedDiscipline}-${Date.now()}.png`);
                    } catch (error) {
                      setError(language === 'zh' ? '下载失败，请重试' : 'Download failed, please try again');
                    } finally {
                      setIsDownloading(false);
                    }
                  }}
                  disabled={isDownloading}
                  className="w-full py-3 btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {language === 'zh' ? '下载中...' : 'Downloading...'}
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      {language === 'zh' ? '下载科研图' : 'Download Scientific Drawing'}
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="text-center py-20 bg-dark-50 dark:bg-dark-800 rounded-xl border-2 border-dashed border-dark-300 dark:border-dark-700">
                <Microscope className="w-20 h-20 mx-auto mb-4 text-dark-400 dark:text-dark-500" />
                <p className="text-dark-500 dark:text-dark-400 font-medium">
                  {language === 'zh' ? '生成的科研绘图将在这里显示' : 'Generated scientific drawing will appear here'}
                </p>
              </div>
            )}

        {/* 功能说明 */}
        <div className="card p-6 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 border-2 border-primary-300 dark:border-primary-700">
              <h4 className="font-semibold text-primary-900 dark:text-primary-100 mb-3">
                {language === 'zh' ? '✨ 功能特点' : '✨ Features'}
              </h4>
              <ul className="space-y-2 text-sm text-primary-800 dark:text-primary-200">
                <li className="flex items-start gap-2">
                  <span className="text-primary-500">✓</span>
                  <span>{language === 'zh' ? '符合学术期刊发表要求' : 'Meets academic journal standards'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-500">✓</span>
                  <span>{language === 'zh' ? '支持5大学科领域' : 'Supports 5 scientific disciplines'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-500">✓</span>
                  <span>{language === 'zh' ? '30+专业模板快速开始（折叠式）' : '30+ professional templates (collapsible)'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-500">✓</span>
                  <span>{language === 'zh' ? '模型选择：推荐Gemini系列' : 'Model selection: Gemini recommended'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-500">✓</span>
                  <span>{language === 'zh' ? '抽卡模式：一次生成4个变体' : 'Lottery mode: 4 variants at once'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-500">✓</span>
                  <span>{language === 'zh' ? '参考图模式：模仿优秀图片风格' : 'Reference mode: mimic style from images'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-500">✓</span>
                  <span>{language === 'zh' ? '专业提示词：符合学术期刊标准' : 'Professional prompts: meets journal standards'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-500">✓</span>
                  <span>{language === 'zh' ? '高清输出（300 DPI）' : 'High resolution (300 DPI)'}</span>
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
