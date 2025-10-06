'use client';

import { useState, useEffect, useMemo } from 'react';

interface QualityTipsProps {
  prompt: string;
  onPromptImprove: (improvedPrompt: string) => void;
  isVisible: boolean;
}

interface QualityTip {
  type: 'error' | 'warning' | 'suggestion' | 'success';
  message: string;
  suggestion?: string;
  category: 'length' | 'detail' | 'style' | 'technical' | 'composition';
}

export default function QualityTips({ prompt, onPromptImprove, isVisible }: QualityTipsProps) {
  const [tips, setTips] = useState<QualityTip[]>([]);
  const [score, setScore] = useState(0);

  // 分析提示词质量
  const analyzePrompt = useMemo(() => {
    if (!prompt.trim()) {
      return {
        tips: [{
          type: 'error' as const,
          message: '提示词不能为空',
          category: 'length' as const
        }],
        score: 0
      };
    }

    const tips: QualityTip[] = [];
    let score = 0;

    // 长度检查
    const wordCount = prompt.trim().split(/\s+/).length;
    if (wordCount < 3) {
      tips.push({
        type: 'warning',
        message: '提示词过短，建议添加更多描述',
        suggestion: '尝试添加颜色、风格、情感等描述词',
        category: 'length'
      });
    } else if (wordCount >= 5 && wordCount <= 20) {
      score += 20;
      tips.push({
        type: 'success',
        message: '提示词长度适中',
        category: 'length'
      });
    } else if (wordCount > 50) {
      tips.push({
        type: 'warning',
        message: '提示词过长，可能影响生成效果',
        suggestion: '保留最重要的描述，删除冗余内容',
        category: 'length'
      });
    }

    // 细节检查
    const detailKeywords = ['颜色', '材质', '光线', '纹理', '细节', '质感', '高清', '4K', '精细', '清晰'];
    const hasDetails = detailKeywords.some(keyword => prompt.includes(keyword));
    if (hasDetails) {
      score += 15;
      tips.push({
        type: 'success',
        message: '包含细节描述，有助于提升图片质量',
        category: 'detail'
      });
    } else {
      tips.push({
        type: 'suggestion',
        message: '建议添加细节描述',
        suggestion: '如：高清、精细、质感丰富、细节清晰等',
        category: 'detail'
      });
    }

    // 风格检查
    const styleKeywords = ['写实', '动漫', '油画', '水彩', '素描', '摄影', '艺术', '风格', '复古', '现代'];
    const hasStyle = styleKeywords.some(keyword => prompt.includes(keyword));
    if (hasStyle) {
      score += 15;
      tips.push({
        type: 'success',
        message: '指定了艺术风格，有助于风格统一',
        category: 'style'
      });
    } else {
      tips.push({
        type: 'suggestion',
        message: '建议指定艺术风格',
        suggestion: '如：写实风格、动漫风格、油画风格等',
        category: 'style'
      });
    }

    // 技术参数检查
    const technicalKeywords = ['专业', '摄影', '灯光', '构图', '景深', '对焦', '曝光'];
    const hasTechnical = technicalKeywords.some(keyword => prompt.includes(keyword));
    if (hasTechnical) {
      score += 10;
      tips.push({
        type: 'success',
        message: '包含技术参数，有助于专业效果',
        category: 'technical'
      });
    }

    // 构图检查
    const compositionKeywords = ['特写', '全景', '俯视', '仰视', '侧面', '正面', '背景', '前景'];
    const hasComposition = compositionKeywords.some(keyword => prompt.includes(keyword));
    if (hasComposition) {
      score += 10;
      tips.push({
        type: 'success',
        message: '指定了构图方式，有助于画面布局',
        category: 'composition'
      });
    } else {
      tips.push({
        type: 'suggestion',
        message: '建议指定构图方式',
        suggestion: '如：特写、全景、俯视角度等',
        category: 'composition'
      });
    }

    // 情感检查
    const emotionKeywords = ['温暖', '冷酷', '梦幻', '神秘', '欢快', '忧郁', '宁静', '激动'];
    const hasEmotion = emotionKeywords.some(keyword => prompt.includes(keyword));
    if (hasEmotion) {
      score += 10;
      tips.push({
        type: 'success',
        message: '包含情感描述，增强画面感染力',
        category: 'style'
      });
    }

    // 负面词检查
    const negativeWords = ['模糊', '低质量', '丑陋', '扭曲', '错误'];
    const hasNegative = negativeWords.some(word => prompt.includes(word));
    if (hasNegative) {
      tips.push({
        type: 'warning',
        message: '包含负面描述词，可能影响生成质量',
        suggestion: '移除负面词汇，使用正面描述',
        category: 'technical'
      });
      score -= 10;
    }

    return { tips, score: Math.max(0, Math.min(100, score)) };
  }, [prompt]);

  useEffect(() => {
    const { tips, score } = analyzePrompt;
    setTips(tips);
    setScore(score);
  }, [analyzePrompt]);

  // 生成改进建议
  const generateImprovedPrompt = () => {
    let improved = prompt.trim();
    
    // 添加质量词汇
    if (!improved.includes('高清') && !improved.includes('4K')) {
      improved += ', 高清, 细节丰富';
    }
    
    // 添加专业词汇
    if (!improved.includes('专业') && !improved.includes('摄影')) {
      improved += ', 专业摄影';
    }
    
    // 添加风格描述
    if (!tips.some(tip => tip.category === 'style' && tip.type === 'success')) {
      improved += ', 写实风格';
    }
    
    onPromptImprove(improved);
  };

  // 获取评分颜色
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  // 获取提示类型图标
  const getTipIcon = (type: string) => {
    switch (type) {
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'suggestion': return '💡';
      case 'success': return '✅';
      default: return '💡';
    }
  };

  if (!isVisible) return null;

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">📊 质量分析</h3>
        <div className={`text-2xl font-bold ${getScoreColor(score)}`}>
          {score}/100
        </div>
      </div>

      {/* 评分条 */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>提示词质量</span>
          <span>{score}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              score >= 80 ? 'bg-green-500' :
              score >= 60 ? 'bg-yellow-500' :
              score >= 40 ? 'bg-orange-500' : 'bg-red-500'
            }`}
            style={{ width: `${score}%` }}
          ></div>
        </div>
      </div>

      {/* 提示列表 */}
      <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-thin">
        {tips.map((tip, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg border-l-4 ${
              tip.type === 'error' ? 'bg-red-50 border-red-400' :
              tip.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
              tip.type === 'suggestion' ? 'bg-blue-50 border-blue-400' :
              'bg-green-50 border-green-400'
            }`}
          >
            <div className="flex items-start space-x-2">
              <span className="text-lg">{getTipIcon(tip.type)}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {tip.message}
                </p>
                {tip.suggestion && (
                  <p className="text-xs text-gray-600 mt-1">
                    💡 {tip.suggestion}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 改进按钮 */}
      {score < 80 && prompt.trim() && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={generateImprovedPrompt}
            className="btn-primary w-full flex items-center justify-center space-x-2"
          >
            <span>✨</span>
            <span>一键优化提示词</span>
          </button>
        </div>
      )}

      {/* 质量标准说明 */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
          <p className="font-medium mb-2">📋 质量评分标准：</p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-green-600">✅ 加分项：</span>
              <ul className="mt-1 space-y-1">
                <li>• 适中的长度 (+20)</li>
                <li>• 细节描述 (+15)</li>
                <li>• 风格指定 (+15)</li>
                <li>• 技术参数 (+10)</li>
                <li>• 构图描述 (+10)</li>
                <li>• 情感表达 (+10)</li>
              </ul>
            </div>
            <div>
              <span className="text-red-600">❌ 扣分项：</span>
              <ul className="mt-1 space-y-1">
                <li>• 过短或过长</li>
                <li>• 缺少细节</li>
                <li>• 无风格指定</li>
                <li>• 负面词汇 (-10)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}