'use client';

import { useState, useRef } from 'react';

export interface Transformation {
  id: string;
  emoji: string;
  title: string;
  titleEn: string;
  description: string;
  prompt: string;
  category: 'style' | 'edit' | 'generate' | 'professional' | 'effects';
  needsInput: boolean;
  items?: Transformation[];
}

const transformations: Transformation[] = [
  {
    id: 'style',
    emoji: '🎭',
    title: '风格转换',
    titleEn: 'Style Transfer',
    description: '15种风格转换效果',
    prompt: '',
    category: 'style',
    needsInput: false,
    items: [
      {
        id: 'pixar',
        emoji: '🎬',
        title: 'PIXAR 3D',
        titleEn: 'PIXAR 3D',
        description: 'Pixar风格可爱3D头像',
        prompt: '生成一幅3D头像：对象为上传图像中的人物，面带灿烂笑容，背景干净白色，概念数字艺术风格，Pixar风格，高质量渲染，柔和光照，纹理光滑，色彩鲜明',
        category: 'style',
        needsInput: true
      },
      {
        id: 'lego',
        emoji: '🧱',
        title: '乐高化',
        titleEn: 'LEGO Style',
        description: '转换为乐高玩具',
        prompt: '将照片中的人物转化为乐高小人包装盒的风格，以等距透视呈现。在包装盒上标注标题"LEGO"。展示基于照片中人物的乐高小人，配有配件',
        category: 'style',
        needsInput: true
      },
      {
        id: 'figurine',
        emoji: '🎎',
        title: '手办化',
        titleEn: 'Figurine',
        description: '制作角色手办',
        prompt: '将这张照片变成角色手办。在它后面放置一个印有角色图像的盒子，盒子上有一台电脑显示Blender建模过程。在盒子前面添加一个圆形塑料底座，角色手办站在上面',
        category: 'style',
        needsInput: true
      },
      {
        id: 'cosplay',
        emoji: '🎪',
        title: '真人Coser',
        titleEn: 'Cosplay',
        description: '动漫转真人',
        prompt: '生成一个女孩cosplay这张插画的照片，背景设置在Comiket。高度还原插画的姿势、服装和风格',
        category: 'style',
        needsInput: true
      },
      {
        id: 'manga',
        emoji: '📚',
        title: '漫画风格',
        titleEn: 'Manga Style',
        description: '日式漫画线稿',
        prompt: '将输入的图片处理为黑白漫画风格线稿',
        category: 'style',
        needsInput: true
      },
    ]
  },
  {
    id: 'edit',
    emoji: '✏️',
    title: '创意编辑',
    titleEn: 'Creative Edit',
    description: '智能图像编辑',
    prompt: '',
    category: 'edit',
    needsInput: false,
    items: [
      {
        id: 'enhance',
        emoji: '✨',
        title: '自动增强',
        titleEn: 'Auto Enhance',
        description: 'AI自动修图',
        prompt: '这张照片很无聊很平淡。增强它！增加对比度，提升色彩，改善光线使其更丰富，你可以裁剪和删除影响构图的细节',
        category: 'edit',
        needsInput: true
      },
      {
        id: 'colorize',
        emoji: '🎨',
        title: '黑白上色',
        titleEn: 'Colorize',
        description: '旧照片上色',
        prompt: '为这张黑白照片上色，使其看起来像真实的彩色照片',
        category: 'edit',
        needsInput: true
      },
      {
        id: 'outpaint',
        emoji: '🖼️',
        title: '智能外扩',
        titleEn: 'Outpaint',
        description: '扩展图像边缘',
        prompt: '智能扩展图像边缘，补全被裁切的内容',
        category: 'edit',
        needsInput: true
      },
      {
        id: 'remove',
        emoji: '🧹',
        title: '移除物体',
        titleEn: 'Remove Object',
        description: '精准移除元素',
        prompt: '精准移除图像中的特定物体',
        category: 'edit',
        needsInput: true
      },
    ]
  },
  {
    id: 'generate',
    emoji: '🚀',
    title: '创意生成',
    titleEn: 'Creative Gen',
    description: 'AI创意创作',
    prompt: '',
    category: 'generate',
    needsInput: false,
    items: [
      {
        id: 'food-explosion',
        emoji: '💥',
        title: '爆炸食物',
        titleEn: 'Food Explosion',
        description: '食物爆炸分解',
        prompt: '生成食物爆炸分解的艺术效果',
        category: 'generate',
        needsInput: false
      },
      {
        id: 'sticker',
        emoji: '🏷️',
        title: '贴纸生成',
        titleEn: 'Sticker',
        description: '卡通贴纸效果',
        prompt: '将角色变成白色轮廓贴纸。角色需要转换成网页插画风格，并添加一个俏皮的白色轮廓短语',
        category: 'generate',
        needsInput: true
      },
      {
        id: 'emoji-set',
        emoji: '😀',
        title: '表情包',
        titleEn: 'Emoji Set',
        description: '批量生成表情',
        prompt: '角色表、面部表情、喜悦、愤怒、悲伤、快乐',
        category: 'generate',
        needsInput: true
      },
    ]
  },
  {
    id: 'professional',
    emoji: '💼',
    title: '专业应用',
    titleEn: 'Professional',
    description: '专业级工具',
    prompt: '',
    category: 'professional',
    needsInput: false,
    items: [
      {
        id: 'id-photo',
        emoji: '🆔',
        title: '证件照',
        titleEn: 'ID Photo',
        description: '标准证件照',
        prompt: '将普通照片转换为标准证件照',
        category: 'professional',
        needsInput: true
      },
      {
        id: 'character-design',
        emoji: '📐',
        title: '角色设定',
        titleEn: 'Character Design',
        description: '完整设计三视图',
        prompt: '为我生成人物的角色设定：比例设定（不同身高对比）、三视图（正面、侧面、背面）、表情设定、动作设定、服装设定',
        category: 'professional',
        needsInput: true
      },
      {
        id: '3d-render',
        emoji: '🏠',
        title: '3D渲染',
        titleEn: '3D Render',
        description: '平面图转3D',
        prompt: '将平面图转换为3D室内渲染效果',
        category: 'professional',
        needsInput: true
      },
    ]
  },
  {
    id: 'effects',
    emoji: '✨',
    title: '特效合成',
    titleEn: 'Effects',
    description: '视觉特效',
    prompt: '',
    category: 'effects',
    needsInput: false,
    items: [
      {
        id: 'explode',
        emoji: '💣',
        title: '爆炸拆解',
        titleEn: 'Explode View',
        description: '设备拆解图',
        prompt: '生成设备的爆炸拆解示意图',
        category: 'effects',
        needsInput: false
      },
      {
        id: 'glass-jar',
        emoji: '🫙',
        title: '瓶中世界',
        titleEn: 'In a Jar',
        description: '玻璃瓶纪念品',
        prompt: '将场景装入玻璃瓶制作纪念品效果',
        category: 'effects',
        needsInput: true
      },
      {
        id: 'miniature',
        emoji: '🏘️',
        title: '微缩场景',
        titleEn: 'Miniature',
        description: '迷你模型效果',
        prompt: '将图片转换为微缩模型场景',
        category: 'effects',
        needsInput: true
      },
    ]
  },
];

interface TransformationSelectorProps {
  onSelect: (transformation: Transformation) => void;
  showDescription?: boolean;
}

export default function TransformationSelector({ 
  onSelect,
  showDescription = true 
}: TransformationSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<Transformation | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [orderedTransformations, setOrderedTransformations] = useState(transformations);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const items = [...orderedTransformations];
    const draggedItem = items[draggedIndex];
    items.splice(draggedIndex, 1);
    items.splice(index, 0, draggedItem);

    setDraggedIndex(index);
    setOrderedTransformations(items);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleItemClick = (item: Transformation) => {
    if (item.items && item.items.length > 0) {
      setActiveCategory(item);
    } else {
      onSelect(item);
    }
  };

  const renderGrid = (items: Transformation[]) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {items.map((trans, index) => (
        <button
          key={trans.id}
          draggable={!activeCategory}
          onDragStart={(e) => !activeCategory && handleDragStart(e, index)}
          onDragOver={(e) => !activeCategory && handleDragOver(e, index)}
          onDragEnd={!activeCategory ? handleDragEnd : undefined}
          onClick={() => handleItemClick(trans)}
          className={`group relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
            !activeCategory ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'
          } ${
            draggedIndex === index
              ? 'opacity-40 scale-95'
              : 'hover:-translate-y-1 hover:shadow-lg'
          }`}
          style={{ 
            background: 'var(--bg-card)',
            borderColor: 'var(--border-primary)'
          }}
        >
          {/* 需要输入标识 */}
          {trans.needsInput && (
            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
              <span className="text-xs">📷</span>
            </div>
          )}

          <span className="text-4xl mb-2 transition-transform group-hover:scale-110">
            {trans.emoji}
          </span>
          <span className="font-semibold text-sm text-center" style={{ color: 'var(--text-primary)' }}>
            {trans.title}
          </span>
          {showDescription && (
            <span className="text-xs text-center mt-1 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
              {trans.description}
            </span>
          )}

          {/* 子项数量标识 */}
          {trans.items && trans.items.length > 0 && (
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-500 text-white">
              {trans.items.length}
            </div>
          )}
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {!activeCategory ? (
        <>
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              🎭 选择转换效果
            </h2>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              拖动卡片可以调整顺序 · 点击分类查看子项
            </p>
          </div>
          {renderGrid(orderedTransformations)}
        </>
      ) : (
        <>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveCategory(null)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-purple-500/10 transition-colors"
              style={{ color: 'var(--text-primary)' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              返回
            </button>
            <h2 className="text-3xl font-bold flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
              <span>{activeCategory.emoji}</span>
              {activeCategory.title}
            </h2>
          </div>
          {activeCategory.items && renderGrid(activeCategory.items)}
        </>
      )}
    </div>
  );
}

export { transformations, type Transformation };

