'use client';

interface QuickActionsProps {
  onQuickGenerate: (prompt: string, style: string) => void;
  isGenerating: boolean;
}

export default function QuickActions({ onQuickGenerate, isGenerating }: QuickActionsProps) {
  const quickActions = [
    {
      id: 'anime_girl',
      title: '动漫少女',
      prompt: '可爱的动漫少女，大眼睛，粉色头发，校服，樱花背景',
      style: 'anime',
      emoji: '👧',
      color: 'from-pink-400 to-rose-500',
    },
    {
      id: 'cyberpunk_city',
      title: '赛博朋克',
      prompt: '未来科技城市夜景，霓虹灯闪烁，飞行汽车，高楼大厦',
      style: 'cyberpunk',
      emoji: '🌃',
      color: 'from-cyan-400 to-blue-500',
    },
    {
      id: 'fantasy_landscape',
      title: '奇幻风景',
      prompt: '梦幻森林，发光蘑菇，彩虹瀑布，独角兽，魔法光芒',
      style: 'watercolor',
      emoji: '🦄',
      color: 'from-purple-400 to-pink-500',
    },
    {
      id: 'cute_animal',
      title: '可爱动物',
      prompt: '超可爱的小猫咪，毛茸茸，大眼睛，坐在彩虹上',
      style: 'realistic',
      emoji: '🐱',
      color: 'from-orange-400 to-red-500',
    },
    {
      id: 'space_scene',
      title: '太空场景',
      prompt: '宇宙星空，银河系，宇航员漂浮，地球背景，科幻感',
      style: 'realistic',
      emoji: '🚀',
      color: 'from-indigo-400 to-purple-500',
    },
    {
      id: 'food_art',
      title: '美食艺术',
      prompt: '精美的日式料理，寿司拼盘，艺术摆盘，专业摄影',
      style: 'realistic',
      emoji: '🍣',
      color: 'from-green-400 to-teal-500',
    },
  ];

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">⚡ 一键生成</h2>
      <p className="text-sm text-gray-600 mb-4">
        精选热门主题，点击即可快速生成
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {quickActions.map((action) => (
          <button
            key={action.id}
            onClick={() => onQuickGenerate(action.prompt, action.style)}
            disabled={isGenerating}
            className={`
              relative p-4 rounded-lg border-2 border-gray-200 
              hover:border-gray-300 hover:shadow-md transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              text-left overflow-hidden
            `}
          >
            {/* 背景渐变 */}
            <div className={`
              absolute inset-0 bg-gradient-to-br ${action.color} opacity-10 rounded-lg
            `} />
            
            {/* 内容 */}
            <div className="relative z-10">
              <div className="text-2xl mb-2">{action.emoji}</div>
              <div className="font-medium text-gray-900 text-sm mb-1">
                {action.title}
              </div>
              <div className="text-xs text-gray-600 line-clamp-2">
                {action.prompt}
              </div>
            </div>

            {/* 悬停效果 */}
            <div className="absolute inset-0 bg-white bg-opacity-0 hover:bg-opacity-10 transition-all rounded-lg" />
          </button>
        ))}
      </div>

      {/* 随机生成按钮 */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={() => {
            const randomAction = quickActions[Math.floor(Math.random() * quickActions.length)];
            onQuickGenerate(randomAction.prompt, randomAction.style);
          }}
          disabled={isGenerating}
          className="btn-secondary w-full flex items-center justify-center space-x-2"
        >
          <span>🎲</span>
          <span>随机生成</span>
        </button>
      </div>
    </div>
  );
}