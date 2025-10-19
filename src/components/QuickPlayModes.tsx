'use client';

import { useState } from 'react';

interface PlayMode {
  id: string;
  icon: string;
  title: string;
  description: string;
  prompt: string;
  requiresUpload: boolean;
  category: string;
}

// 基于 ZHO-nano-banana-Creation 的46种玩法
const playModes: PlayMode[] = [
  {
    id: 'figure',
    icon: '🎭',
    title: '变手办',
    description: '一键将图片变成手办模型',
    prompt: '将这张照片变成角色手办。在它后面放置一个印有角色图像的盒子，盒子上有一台电脑显示Blender建模过程。在盒子前面添加一个圆形塑料底座，角色手办站在上面。场景设置在室内',
    requiresUpload: true,
    category: '玩具转换'
  },
  {
    id: 'lego',
    icon: '🧱',
    title: '变乐高',
    description: '转换为乐高小人包装',
    prompt: '将照片中的人物转化为乐高小人包装盒的风格，以等距透视呈现。在包装盒上标注标题。在盒内展示基于照片中人物的乐高小人，并配有配件。在盒子旁边，也展示实际乐高小人本身',
    requiresUpload: true,
    category: '玩具转换'
  },
  {
    id: 'pixar',
    icon: '✨',
    title: 'Pixar风格',
    description: '转换为Pixar 3D风格',
    prompt: '生成一幅 3D 头像：对象为上传图像中的人物，面带灿烂笑容，背景干净白色，概念数字艺术风格，Pixar 风格，高质量渲染，柔和光照，色彩鲜明',
    requiresUpload: true,
    category: '风格转换'
  },
  {
    id: 'id_photo',
    icon: '📸',
    title: '证件照',
    description: '生成标准证件照',
    prompt: '截取图片人像头部，帮我做成2寸证件照，要求：1、蓝底 2、职业正装 3、正脸 4、微笑',
    requiresUpload: true,
    category: '实用工具'
  },
  {
    id: 'restore',
    icon: '🎨',
    title: '老照片修复',
    description: '上色并修复老照片',
    prompt: '修复并为这张照片上色。增强细节，移除噪点，调整对比度和亮度',
    requiresUpload: true,
    category: '实用工具'
  },
  {
    id: 'stickers',
    icon: '😊',
    title: '表情包',
    description: '生成9宫格表情包',
    prompt: '为图片中的人物生成9宫格表情包，包含：开心、生气、悲伤、惊讶、困惑、兴奋、害羞、酷炫、可爱等多种表情',
    requiresUpload: true,
    category: '创意生成'
  },
  {
    id: 'character_sheet',
    icon: '👤',
    title: '角色设定',
    description: '完整角色设定图',
    prompt: '为我生成人物的角色设定：比例设定、三视图（正面、侧面、背面）、表情设定、动作设定、服装设定',
    requiresUpload: true,
    category: '创意生成'
  },
  {
    id: 'coser',
    icon: '🎪',
    title: '动漫转真人',
    prompt: '生成一个女孩cosplay这张插画的照片，背景设置在Comiket。高度还原插画的姿势、服装和风格',
    description: '插画变Coser照片',
    requiresUpload: true,
    category: '风格转换'
  },
  {
    id: 'process',
    icon: '🎬',
    title: '绘画过程',
    description: '展示绘画四步骤',
    prompt: '为人物生成绘画过程四宫格，第一步：线稿，第二步：平铺颜色，第三步：增加阴影，第四步：细化成型',
    requiresUpload: true,
    category: '创意生成'
  },
  {
    id: '3d_render',
    icon: '🏗️',
    title: '平面图转3D',
    description: '建筑平面图变3D',
    prompt: '帮我把这个住宅平面图转换为房屋的等距照片级真实感 3D 渲染',
    requiresUpload: true,
    category: '专业应用'
  },
  {
    id: 'makeup',
    icon: '💄',
    title: '虚拟试妆',
    description: '换不同妆容效果',
    prompt: '为图一人物化上图二的妆，保持图一的姿势。精确还原妆容的色彩、风格和细节',
    requiresUpload: true,
    category: '特效合成'
  },
  {
    id: 'hairstyle',
    icon: '💇',
    title: '发型尝试',
    description: '看看不同发型效果',
    prompt: '以九宫格的方式生成这个人不同发型的头像。包含短发、长发、卷发、直发、波浪、丸子头等多种风格',
    requiresUpload: true,
    category: '特效合成'
  }
];

interface QuickPlayModesProps {
  onSelectMode: (mode: PlayMode) => void;
}

export default function QuickPlayModes({ onSelectMode }: QuickPlayModesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');

  const categories = ['全部', '玩具转换', '风格转换', '实用工具', '创意生成', '专业应用', '特效合成'];

  const filteredModes = selectedCategory === '全部' 
    ? playModes 
    : playModes.filter(mode => mode.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* 分类选择 */}
      <div className="overflow-x-auto">
        <div className="flex gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-gradient-primary text-white'
                  : 'btn-secondary'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* 玩法网格 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {filteredModes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => onSelectMode(mode)}
            className="glass-card p-4 text-left hover:scale-105 transition-all"
          >
            <div className="text-3xl mb-2">{mode.icon}</div>
            <div className="font-semibold mb-1 text-sm" style={{ color: 'var(--text-primary)' }}>
              {mode.title}
            </div>
            <div className="text-xs line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
              {mode.description}
            </div>
            {mode.requiresUpload && (
              <div className="mt-2 text-xs px-2 py-1 rounded inline-block" style={{
                background: 'rgba(138, 43, 226, 0.1)',
                color: 'var(--accent-purple)'
              }}>
                需上传图片
              </div>
            )}
          </button>
        ))}
      </div>

      {filteredModes.length === 0 && (
        <div className="text-center py-12">
          <span className="text-4xl">🔍</span>
          <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>
            该分类暂无玩法
          </p>
        </div>
      )}
    </div>
  );
}
