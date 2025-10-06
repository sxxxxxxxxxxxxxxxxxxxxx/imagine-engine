'use client';

import { useState } from 'react';

export interface PosePreset {
  id: string;
  name: string;
  nameEn: string;
  category: 'standing' | 'sitting' | 'action' | 'yoga' | 'dance' | 'sport';
  emoji: string;
  description: string;
  prompt: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const posePresets: PosePreset[] = [
  // 站立姿势
  {
    id: 'stand-normal',
    name: '标准站立',
    nameEn: 'Standard Standing',
    category: 'standing',
    emoji: '🧍',
    description: '自然放松的站立姿势',
    prompt: '人物保持自然站立姿势，双手自然垂放，表情轻松',
    difficulty: 'easy'
  },
  {
    id: 'stand-confident',
    name: '自信站立',
    nameEn: 'Confident Pose',
    category: 'standing',
    emoji: '💪',
    description: '双手叉腰，自信姿态',
    prompt: '人物双手叉腰，抬头挺胸，展现自信姿态',
    difficulty: 'easy'
  },
  {
    id: 'stand-model',
    name: '模特站姿',
    nameEn: 'Model Pose',
    category: 'standing',
    emoji: '💃',
    description: '时尚模特经典姿势',
    prompt: '时尚模特站姿，一只手放在臀部，另一只手自然垂放，略微倾斜身体',
    difficulty: 'medium'
  },

  // 坐姿
  {
    id: 'sit-chair',
    name: '椅子坐姿',
    nameEn: 'Sitting on Chair',
    category: 'sitting',
    emoji: '🪑',
    description: '优雅的坐姿',
    prompt: '人物坐在椅子上，背部挺直，双手放在膝盖上',
    difficulty: 'easy'
  },
  {
    id: 'sit-floor',
    name: '地面坐姿',
    nameEn: 'Sitting on Floor',
    category: 'sitting',
    emoji: '🧘',
    description: '席地而坐',
    prompt: '人物盘腿坐在地上，双手放在膝盖上，表情平静',
    difficulty: 'medium'
  },

  // 动作姿势
  {
    id: 'run',
    name: '跑步',
    nameEn: 'Running',
    category: 'action',
    emoji: '🏃',
    description: '动感奔跑姿势',
    prompt: '人物奔跑姿势，一腿向前迈出，双臂摆动，展现运动感',
    difficulty: 'hard'
  },
  {
    id: 'jump',
    name: '跳跃',
    nameEn: 'Jumping',
    category: 'action',
    emoji: '🤸',
    description: '腾空跳跃',
    prompt: '人物腾空跳跃，双腿离地，双臂向上伸展，充满活力',
    difficulty: 'hard'
  },
  {
    id: 'walk',
    name: '行走',
    nameEn: 'Walking',
    category: 'action',
    emoji: '🚶',
    description: '自然行走',
    prompt: '人物行走姿势，一只脚向前迈步，双臂自然摆动',
    difficulty: 'medium'
  },

  // 瑜伽姿势
  {
    id: 'yoga-tree',
    name: '树式',
    nameEn: 'Tree Pose',
    category: 'yoga',
    emoji: '🌳',
    description: '瑜伽树式平衡',
    prompt: '瑜伽树式姿势，单腿站立，另一只脚放在大腿内侧，双手合十举过头顶',
    difficulty: 'hard'
  },
  {
    id: 'yoga-warrior',
    name: '战士式',
    nameEn: 'Warrior Pose',
    category: 'yoga',
    emoji: '🗡️',
    description: '瑜伽战士姿势',
    prompt: '瑜伽战士式姿势，前腿弯曲，后腿伸直，双臂向两侧伸展',
    difficulty: 'hard'
  },

  // 舞蹈姿势
  {
    id: 'dance-ballet',
    name: '芭蕾舞姿',
    nameEn: 'Ballet Pose',
    category: 'dance',
    emoji: '🩰',
    description: '优雅芭蕾姿态',
    prompt: '芭蕾舞姿势，单腿支撑，另一只腿向后抬起，双臂优雅伸展',
    difficulty: 'hard'
  },
  {
    id: 'dance-hip-hop',
    name: '街舞姿势',
    nameEn: 'Hip Hop Pose',
    category: 'dance',
    emoji: '🕺',
    description: '动感街舞动作',
    prompt: '街舞姿势，身体倾斜，一只手指向天空，充满节奏感',
    difficulty: 'hard'
  },

  // 运动姿势
  {
    id: 'sport-basketball',
    name: '投篮姿势',
    nameEn: 'Basketball Shot',
    category: 'sport',
    emoji: '🏀',
    description: '篮球投篮动作',
    prompt: '篮球投篮姿势，双臂向上举起，准备投篮，膝盖微曲',
    difficulty: 'medium'
  },
  {
    id: 'sport-soccer',
    name: '足球射门',
    nameEn: 'Soccer Kick',
    category: 'sport',
    emoji: '⚽',
    description: '足球踢球动作',
    prompt: '足球射门姿势，一只腿向前踢出，身体后仰，充满力量感',
    difficulty: 'hard'
  },
];

const categoryNames = {
  standing: '🧍 站立',
  sitting: '🪑 坐姿',
  action: '🏃 动作',
  yoga: '🧘 瑜伽',
  dance: '💃 舞蹈',
  sport: '⚽ 运动',
};

interface PosePresetsProps {
  onSelectPose: (pose: PosePreset) => void;
  showInModal?: boolean;
}

export default function PosePresets({ onSelectPose, showInModal = false }: PosePresetsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('standing');
  const [selectedPose, setSelectedPose] = useState<PosePreset | null>(null);

  const filteredPoses = posePresets.filter(pose => pose.category === selectedCategory);

  const handleSelectPose = (pose: PosePreset) => {
    setSelectedPose(pose);
    onSelectPose(pose);
  };

  const Content = (
    <div className="space-y-4">
      {/* 分类选择 */}
      <div>
        <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          📂 姿势分类
        </h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(categoryNames).map(([key, name]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`text-xs px-3 py-1 rounded-full transition-all ${
                selectedCategory === key
                  ? 'bg-gradient-primary text-white shadow-md'
                  : 'btn-secondary'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* 姿势网格 */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            🎭 选择姿势
          </h3>
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {filteredPoses.length} 个姿势
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {filteredPoses.map((pose) => (
            <button
              key={pose.id}
              onClick={() => handleSelectPose(pose)}
              className={`group relative p-4 rounded-lg border-2 transition-all ${
                selectedPose?.id === pose.id
                  ? 'border-purple-500 bg-purple-500/10 scale-105'
                  : 'border-transparent hover:border-purple-500/30 hover:-translate-y-1'
              }`}
              style={{ background: selectedPose?.id === pose.id ? undefined : 'var(--bg-tertiary)' }}
            >
              {/* 难度标识 */}
              <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${
                pose.difficulty === 'easy' ? 'bg-green-500' :
                pose.difficulty === 'medium' ? 'bg-yellow-500' :
                'bg-red-500'
              }`} title={pose.difficulty} />

              <div className="flex flex-col items-center gap-2">
                <span className="text-3xl transition-transform group-hover:scale-110">
                  {pose.emoji}
                </span>
                <span className="text-xs font-semibold text-center" style={{ color: 'var(--text-primary)' }}>
                  {pose.name}
                </span>
                <span className="text-xs text-center line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                  {pose.description}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 当前选择预览 */}
      {selectedPose && (
        <div className="glass-card p-4">
          <div className="flex items-start gap-3">
            <span className="text-4xl">{selectedPose.emoji}</span>
            <div className="flex-1">
              <h4 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                {selectedPose.name}
              </h4>
              <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
                {selectedPose.description}
              </p>
              <div className="text-xs p-2 rounded font-mono" style={{ 
                background: 'var(--bg-tertiary)',
                color: 'var(--text-muted)'
              }}>
                {selectedPose.prompt}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (showInModal) {
    return (
      <div className="glass-card p-6">
        {Content}
      </div>
    );
  }

  return Content;
}

export { posePresets, type PosePreset };

