'use client';

import { useState } from 'react';

interface PromptLibraryProps {
  onPromptSelect: (prompt: string) => void;
  onClose: () => void;
}

interface PromptTemplate {
  id: string;
  title: string;
  prompt: string;
  category: string;
  tags: string[];
  example?: string;
}

export default function PromptLibrary({ onPromptSelect, onClose }: PromptLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // 基于Awesome-Nano-Banana-images项目的完整提示词库
  const promptTemplates: PromptTemplate[] = [
    // 人物角色类
    {
      id: '1',
      title: '动漫转真人Coser',
      prompt: '将这个动漫角色转换为真实的Cosplay照片，保持角色特征和服装细节，真人摄影风格',
      category: 'character',
      tags: ['动漫', '真人', 'cosplay'],
      example: '适用于动漫角色图片'
    },
    {
      id: '2',
      title: '不同时代照片',
      prompt: '将这个人物的照片转换为1950年代的复古风格，包括服装、发型和摄影风格',
      category: 'character',
      tags: ['复古', '时代', '人物'],
      example: '适用于人物肖像照'
    },
    {
      id: '3',
      title: '虚拟试妆',
      prompt: '为这个人物添加精致的妆容，包括眼影、口红和腮红，保持自然真实的效果',
      category: 'character',
      tags: ['化妆', '美容', '人物'],
      example: '适用于人脸照片'
    },
    {
      id: '4',
      title: '更换多种发型',
      prompt: '为这个人物尝试不同的发型设计，包括短发、长发、卷发等多种风格',
      category: 'character',
      tags: ['发型', '造型', '设计'],
      example: '适用于人物肖像'
    },
    {
      id: '5',
      title: 'OOTD穿搭',
      prompt: '为这个人物设计今日穿搭，时尚搭配，包括服装、配饰和整体造型',
      category: 'character',
      tags: ['穿搭', '时尚', '造型'],
      example: '适用于人物照片'
    },
    {
      id: '6',
      title: '人物换衣',
      prompt: '为这个人物更换不同风格的服装，保持人物特征不变',
      category: 'character',
      tags: ['换装', '服装', '风格'],
      example: '适用于人物全身照'
    },
    {
      id: '7',
      title: '人物姿势修改',
      prompt: '调整这个人物的姿势和动作，使其更加自然生动',
      category: 'character',
      tags: ['姿势', '动作', '调整'],
      example: '适用于人物照片'
    },
    {
      id: '8',
      title: '参考图控制人物表情',
      prompt: '根据参考图调整人物的面部表情，保持自然真实',
      category: 'character',
      tags: ['表情', '情感', '控制'],
      example: '适用于人脸照片'
    },
    {
      id: '9',
      title: '控制人物脸型',
      prompt: '微调人物的脸型轮廓，使其更加协调美观',
      category: 'character',
      tags: ['脸型', '轮廓', '美化'],
      example: '适用于人脸照片'
    },
    {
      id: '10',
      title: '制作证件照',
      prompt: '将这张照片制作成标准证件照格式，白色背景，正面免冠',
      category: 'character',
      tags: ['证件照', '正式', '标准'],
      example: '适用于人物肖像'
    },

    // 风格转换类
    {
      id: '11',
      title: '插画变手办',
      prompt: '将这个插画角色转换为精致的手办模型，3D渲染效果，展示台背景',
      category: 'style',
      tags: ['手办', '3D', '模型'],
      example: '适用于动漫插画'
    },
    {
      id: '12',
      title: '漫画风格转换',
      prompt: '将这张图片转换为日式漫画风格，黑白线条，网点阴影，漫画分镜效果',
      category: 'style',
      tags: ['漫画', '黑白', '日式'],
      example: '适用于任何图片'
    },
    {
      id: '13',
      title: '乐高玩具小人',
      prompt: '将这个人物转换为乐高小人风格，方块化造型，鲜艳色彩，玩具质感',
      category: 'style',
      tags: ['乐高', '玩具', '积木'],
      example: '适用于人物图片'
    },
    {
      id: '14',
      title: '高达模型小人',
      prompt: '将这个角色设计成高达模型风格，机械感，金属质感，细节丰富',
      category: 'style',
      tags: ['高达', '机械', '模型'],
      example: '适用于角色设计'
    },
    {
      id: '15',
      title: 'Pixar风格图片',
      prompt: '将这张图片转换为Pixar动画电影风格，3D卡通渲染，温暖色调',
      category: 'style',
      tags: ['Pixar', '3D', '卡通'],
      example: '适用于任何图片'
    },
    {
      id: '16',
      title: 'Minecraft风格场景',
      prompt: '将这个场景转换为Minecraft游戏风格，方块化世界，像素艺术',
      category: 'style',
      tags: ['Minecraft', '像素', '方块'],
      example: '适用于场景图片'
    },
    {
      id: '17',
      title: '等距全息投影图',
      prompt: '将这个对象制作成等距视角的全息投影效果，科技感，透明材质',
      category: 'style',
      tags: ['等距', '全息', '科技'],
      example: '适用于物体图片'
    },
    {
      id: '18',
      title: '叠加滤镜材质',
      prompt: '为这张图片添加特殊材质效果，如金属、玻璃、木纹等质感',
      category: 'style',
      tags: ['材质', '滤镜', '质感'],
      example: '适用于任何图片'
    },
    {
      id: '19',
      title: '动漫雕像放入现实',
      prompt: '将这个动漫雕像合成到真实环境中，保持光影一致性',
      category: 'style',
      tags: ['雕像', '合成', '现实'],
      example: '适用于雕像图片'
    },
    {
      id: '20',
      title: '痛车制作',
      prompt: '将这个动漫角色设计成汽车彩绘，痛车风格，色彩鲜艳',
      category: 'style',
      tags: ['痛车', '彩绘', '汽车'],
      example: '适用于动漫角色'
    },

    // 创意编辑类
    {
      id: '21',
      title: '旧照片上色',
      prompt: '为这张黑白老照片添加自然真实的色彩，保持历史感和原有细节',
      category: 'edit',
      tags: ['上色', '修复', '历史'],
      example: '适用于黑白照片'
    },
    {
      id: '22',
      title: '自动修图',
      prompt: '自动修复这张照片的瑕疵，包括去除污点、调整曝光、增强细节',
      category: 'edit',
      tags: ['修图', '修复', '增强'],
      example: '适用于任何照片'
    },
    {
      id: '23',
      title: '图像外扩修复',
      prompt: '扩展这张图片的边界，智能填充周围区域，保持风格一致',
      category: 'edit',
      tags: ['外扩', '填充', '扩展'],
      example: '适用于需要扩展的图片'
    },
    {
      id: '24',
      title: '为图像添加水印',
      prompt: '在图片右下角添加透明度50%的水印文字，优雅字体',
      category: 'edit',
      tags: ['水印', '文字', '标识'],
      example: '适用于任何图片'
    },
    {
      id: '25',
      title: '红笔批注',
      prompt: '在这张图片上添加红笔批注和标记，教学或评论风格',
      category: 'edit',
      tags: ['批注', '标记', '教学'],
      example: '适用于文档或图片'
    },
    {
      id: '26',
      title: '提取信息并放置透明图层',
      prompt: '提取图片中的关键信息，制作成透明图层叠加显示',
      category: 'edit',
      tags: ['提取', '透明', '图层'],
      example: '适用于信息图片'
    },
    {
      id: '27',
      title: '光影控制',
      prompt: '调整这张图片的光影效果，增强立体感和氛围',
      category: 'edit',
      tags: ['光影', '立体', '氛围'],
      example: '适用于任何图片'
    },
    {
      id: '28',
      title: '重置相机参数',
      prompt: '调整这张照片的拍摄角度和透视效果，模拟不同相机参数',
      category: 'edit',
      tags: ['相机', '角度', '透视'],
      example: '适用于照片'
    },

    // 创意生成类
    {
      id: '29',
      title: '根据地图箭头生成地面视角',
      prompt: '根据地图上的箭头指示，生成对应的地面实景视角图片',
      category: 'creative',
      tags: ['地图', '视角', '实景'],
      example: '适用于地图图片'
    },
    {
      id: '30',
      title: '真实世界AR信息化',
      prompt: '在真实场景中添加AR信息标注，科技感界面，未来风格',
      category: 'creative',
      tags: ['AR', '信息', '科技'],
      example: '适用于现实场景'
    },
    {
      id: '31',
      title: '分离出3D建筑制作等距模型',
      prompt: '从图片中提取建筑物，制作成等距3D模型效果',
      category: 'creative',
      tags: ['建筑', '3D', '等距'],
      example: '适用于建筑图片'
    },
    {
      id: '32',
      title: '多参考图像生成',
      prompt: '结合多张参考图片的元素，生成全新的创意图像',
      category: 'creative',
      tags: ['多图', '融合', '创意'],
      example: '适用于多张图片'
    },
    {
      id: '33',
      title: '手绘图控制多角色姿态',
      prompt: '根据手绘草图控制多个角色的姿态和动作',
      category: 'creative',
      tags: ['手绘', '角色', '姿态'],
      example: '适用于草图'
    },
    {
      id: '34',
      title: '跨视角图像生成',
      prompt: '从不同视角重新生成这个场景或物体',
      category: 'creative',
      tags: ['视角', '场景', '重构'],
      example: '适用于任何图片'
    },
    {
      id: '35',
      title: '定制人物贴纸',
      prompt: '将这个人物制作成可爱的贴纸风格，卡通化处理',
      category: 'creative',
      tags: ['贴纸', '卡通', '可爱'],
      example: '适用于人物图片'
    },
    {
      id: '36',
      title: '生成角色设定',
      prompt: '为这个角色生成完整的设定图，包括正面、侧面、背面视图',
      category: 'creative',
      tags: ['角色', '设定', '多视图'],
      example: '适用于角色设计'
    },
    {
      id: '37',
      title: '色卡线稿上色',
      prompt: '根据提供的色卡为这张线稿图片上色',
      category: 'creative',
      tags: ['线稿', '上色', '色卡'],
      example: '适用于线稿图'
    },
    {
      id: '38',
      title: '线稿图生成图像',
      prompt: '将这张线稿转换为完整的彩色图像',
      category: 'creative',
      tags: ['线稿', '生成', '彩色'],
      example: '适用于线稿'
    },
    {
      id: '39',
      title: '插画绘画过程四格',
      prompt: '展示这幅插画的绘制过程，分为四个阶段',
      category: 'creative',
      tags: ['过程', '四格', '绘画'],
      example: '适用于插画'
    },
    {
      id: '40',
      title: '知识推理生成图像',
      prompt: '根据知识和逻辑推理生成相应的图像内容',
      category: 'creative',
      tags: ['知识', '推理', '逻辑'],
      example: '适用于概念图'
    },
    {
      id: '41',
      title: '爆炸的食物',
      prompt: '将这个食物制作成爆炸分解效果，展示内部结构',
      category: 'creative',
      tags: ['食物', '爆炸', '分解'],
      example: '适用于食物图片'
    },
    {
      id: '42',
      title: '制作漫画书',
      prompt: '将这些图片制作成漫画书页面，添加对话框和效果',
      category: 'creative',
      tags: ['漫画', '对话', '效果'],
      example: '适用于多张图片'
    },
    {
      id: '43',
      title: '动作人偶',
      prompt: '将这个角色制作成可动人偶的效果，关节明显',
      category: 'creative',
      tags: ['人偶', '关节', '可动'],
      example: '适用于角色图片'
    },
    {
      id: '44',
      title: '地图生成等距建筑',
      prompt: '根据地图信息生成对应的等距建筑群',
      category: 'creative',
      tags: ['地图', '建筑', '等距'],
      example: '适用于地图'
    },
    {
      id: '45',
      title: 'Google地图视角下的中土世界',
      prompt: '以Google地图的卫星视角展示中土世界的地理环境',
      category: 'creative',
      tags: ['地图', '中土', '卫星'],
      example: '创意生成'
    },
    {
      id: '46',
      title: '超多人物姿势生成',
      prompt: '为这个角色生成多种不同的姿势和动作',
      category: 'creative',
      tags: ['姿势', '多样', '动作'],
      example: '适用于角色'
    },
    {
      id: '47',
      title: '古老地图生成古代场景',
      prompt: '根据古老地图重现对应的古代场景',
      category: 'creative',
      tags: ['古代', '地图', '场景'],
      example: '适用于古地图'
    },
    {
      id: '48',
      title: '场景A6折叠卡',
      prompt: '将这个场景制作成A6尺寸的折叠卡片效果',
      category: 'creative',
      tags: ['折叠', '卡片', 'A6'],
      example: '适用于场景图'
    },
    {
      id: '49',
      title: '模型全息投影',
      prompt: '将这个3D模型制作成全息投影效果',
      category: 'creative',
      tags: ['全息', '投影', '3D'],
      example: '适用于3D模型'
    },
    {
      id: '50',
      title: '巨型人物脚手架',
      prompt: '在这个巨型人物周围添加建筑脚手架，施工现场效果',
      category: 'creative',
      tags: ['巨型', '脚手架', '施工'],
      example: '适用于大型雕像'
    },

    // 专业应用类
    {
      id: '51',
      title: '文章信息图',
      prompt: '将这篇文章的内容制作成信息图表，可视化展示',
      category: 'professional',
      tags: ['信息图', '可视化', '文章'],
      example: '适用于文本内容'
    },
    {
      id: '52',
      title: '模型标注讲解图',
      prompt: '为这个模型添加详细的标注和说明，教学风格',
      category: 'professional',
      tags: ['标注', '教学', '说明'],
      example: '适用于模型图片'
    },
    {
      id: '53',
      title: '硬件拆解图',
      prompt: '展示这个硬件设备的拆解过程和内部结构',
      category: 'professional',
      tags: ['硬件', '拆解', '结构'],
      example: '适用于电子设备'
    },
    {
      id: '54',
      title: '食物卡路里标注',
      prompt: '在这道菜的图片上添加营养信息标注，包括卡路里、蛋白质等',
      category: 'professional',
      tags: ['食物', '营养', '标注'],
      example: '适用于食物照片'
    },
    {
      id: '55',
      title: '根据食材做菜',
      prompt: '根据提供的食材，生成相应的菜品制作过程',
      category: 'professional',
      tags: ['食材', '菜品', '制作'],
      example: '适用于食材图片'
    },
    {
      id: '56',
      title: '数学题推理',
      prompt: '将这道数学题的解题过程可视化展示',
      category: 'professional',
      tags: ['数学', '推理', '解题'],
      example: '适用于数学题'
    },
    {
      id: '57',
      title: '平面图3D渲染',
      prompt: '将这个平面图转换为3D建筑渲染图，现代建筑风格',
      category: 'professional',
      tags: ['建筑', '3D', '渲染'],
      example: '适用于建筑平面图'
    },
    {
      id: '58',
      title: '遥感影像建筑物提取',
      prompt: '从遥感影像中提取和标注建筑物信息',
      category: 'professional',
      tags: ['遥感', '建筑', '提取'],
      example: '适用于卫星图像'
    },
    {
      id: '59',
      title: '产品包装生成',
      prompt: '为这个产品设计现代简约的包装，白色背景，专业摄影',
      category: 'professional',
      tags: ['包装', '产品', '设计'],
      example: '适用于产品图片'
    },
    {
      id: '60',
      title: '精致可爱的产品照片',
      prompt: '将这个产品拍摄成精致可爱的商业照片',
      category: 'professional',
      tags: ['产品', '商业', '摄影'],
      example: '适用于产品'
    },

    // 艺术创作类
    {
      id: '61',
      title: '定制大理石雕塑',
      prompt: '将这个形象制作成大理石雕塑效果，古典艺术风格',
      category: 'art',
      tags: ['雕塑', '大理石', '古典'],
      example: '适用于人物或形象'
    },
    {
      id: '62',
      title: '印刷插画生成',
      prompt: '将这张图片制作成印刷插画风格，复古色调',
      category: 'art',
      tags: ['插画', '印刷', '复古'],
      example: '适用于任何图片'
    },
    {
      id: '63',
      title: '时尚服装拼贴画',
      prompt: '将这些服装元素制作成时尚拼贴画',
      category: 'art',
      tags: ['时尚', '拼贴', '服装'],
      example: '适用于服装图片'
    },
    {
      id: '64',
      title: '漫画构图',
      prompt: '将这个场景重新构图为漫画风格的画面',
      category: 'art',
      tags: ['漫画', '构图', '画面'],
      example: '适用于场景图'
    },
    {
      id: '65',
      title: '材质球赋予材质',
      prompt: '为这个材质球赋予特定的材质效果，如金属、玻璃等',
      category: 'art',
      tags: ['材质', '球体', '效果'],
      example: '适用于3D球体'
    },
    {
      id: '66',
      title: '设计国际象棋',
      prompt: '设计一套独特的国际象棋棋子，创意造型',
      category: 'art',
      tags: ['象棋', '设计', '创意'],
      example: '创意设计'
    },
    {
      id: '67',
      title: '分割对照样式照片',
      prompt: '制作前后对比的分割照片，展示变化效果',
      category: 'art',
      tags: ['对比', '分割', '变化'],
      example: '适用于对比图'
    },
    {
      id: '68',
      title: '珠宝首饰设计',
      prompt: '设计精美的珠宝首饰，奢华质感，细节丰富',
      category: 'art',
      tags: ['珠宝', '首饰', '奢华'],
      example: '创意设计'
    },
    {
      id: '69',
      title: '周边设计',
      prompt: '为这个IP角色设计相关周边产品',
      category: 'art',
      tags: ['周边', 'IP', '产品'],
      example: '适用于角色IP'
    },
    {
      id: '70',
      title: '电影分镜',
      prompt: '将这个场景制作成电影分镜头效果',
      category: 'art',
      tags: ['电影', '分镜', '镜头'],
      example: '适用于场景'
    },
    {
      id: '71',
      title: '多视图结果生成',
      prompt: '为这个对象生成多个视角的展示图',
      category: 'art',
      tags: ['多视图', '视角', '展示'],
      example: '适用于物体'
    },
    {
      id: '72',
      title: '妆面分析',
      prompt: '分析这个妆容的特点和技巧，制作教学图',
      category: 'art',
      tags: ['妆容', '分析', '教学'],
      example: '适用于化妆照片'
    },
  ];

  const categories = [
    { id: 'all', name: '全部', emoji: '🌟' },
    { id: 'character', name: '人物角色', emoji: '👤' },
    { id: 'style', name: '风格转换', emoji: '🎨' },
    { id: 'edit', name: '创意编辑', emoji: '✂️' },
    { id: 'creative', name: '创意生成', emoji: '💡' },
    { id: 'professional', name: '专业应用', emoji: '🏢' },
    { id: 'art', name: '艺术创作', emoji: '🎭' },
  ];

  // 过滤提示词
  const filteredPrompts = promptTemplates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const handlePromptSelect = (template: PromptTemplate) => {
    onPromptSelect(template.prompt);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
        {/* 头部 */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">💡 创意提示词库</h2>
            <p className="text-gray-600 mt-1">72个精选模板，涵盖6大分类，激发无限创意</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* 搜索和分类 */}
        <div className="p-6 border-b bg-gray-50">
          {/* 搜索框 */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="搜索提示词、标签或描述..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
            />
          </div>

          {/* 分类标签 */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${selectedCategory === category.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }
                `}
              >
                {category.emoji} {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* 提示词列表 */}
        <div className="p-6 overflow-y-auto max-h-96">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPrompts.map(template => (
              <div
                key={template.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handlePromptSelect(template)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900">{template.title}</h3>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {categories.find(c => c.id === template.category)?.emoji}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                  {template.prompt}
                </p>
                
                {template.example && (
                  <p className="text-xs text-blue-600 mb-2">
                    💡 {template.example}
                  </p>
                )}
                
                <div className="flex flex-wrap gap-1">
                  {template.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {filteredPrompts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">🔍</div>
              <p>没有找到匹配的提示词</p>
              <p className="text-sm">尝试调整搜索条件或选择其他分类</p>
            </div>
          )}
        </div>

        {/* 底部统计 */}
        <div className="px-6 py-4 bg-gray-50 border-t">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>共 {promptTemplates.length} 个提示词模板</span>
            <span>显示 {filteredPrompts.length} 个结果</span>
          </div>
        </div>
      </div>
    </div>
  );
}