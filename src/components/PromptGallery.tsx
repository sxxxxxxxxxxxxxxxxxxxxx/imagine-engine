'use client';

import { useState } from 'react';

interface PromptTemplate {
  id: number;
  category: string;
  title: string;
  prompt: string;
  description: string;
  inputRequired: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  exampleImage?: string;
}

// GitHub精选案例（100+个提示词模板）
const promptTemplates: PromptTemplate[] = [
  // 🎭 风格转换类（20个）
  {
    id: 1,
    category: '风格转换',
    title: '插画变手办',
    prompt: '将这张照片变成角色手办。在它后面放置一个印有角色图像的盒子，盒子上有一台电脑显示Blender建模过程。在盒子前面添加一个圆形塑料底座，角色手办站在上面。场景设置在室内',
    description: '将任意图片转换为精美的手办模型',
    inputRequired: true,
    difficulty: 'medium',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case1/output0.jpg'
  },
  {
    id: 2,
    category: '风格转换',
    title: '动漫转真人Coser',
    prompt: '生成一个女孩cosplay这张插画的照片，背景设置在Comiket。高度还原插画的姿势、服装和风格',
    description: '将动漫插画转换为真人Coser照片',
    inputRequired: true,
    difficulty: 'medium',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case11/output.jpg'
  },
  {
    id: 3,
    category: '风格转换',
    title: 'PIXAR风格3D头像',
    prompt: '生成一幅3D头像：对象为上传图像中的人物，面带灿烂笑容，背景干净白色，概念数字艺术风格，Pixar风格，高质量渲染，柔和光照，纹理光滑，色彩鲜明',
    description: 'Pixar风格的可爱3D头像',
    inputRequired: true,
    difficulty: 'medium',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case110/output.jpg'
  },
  {
    id: 4,
    category: '风格转换',
    title: '图片转乐高',
    prompt: '将照片中的人物转化为乐高小人包装盒的风格，以等距透视呈现。在包装盒上标注标题"LEGO"。展示基于照片中人物的乐高小人，配有配件',
    description: '将人物转换为乐高玩具包装',
    inputRequired: true,
    difficulty: 'medium',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case45/output.jpg'
  },
  {
    id: 5,
    category: '风格转换',
    title: '图片转高达模型',
    prompt: '将照片中的人物转化为高达模型套件包装盒的风格。展示高达风格机械人版本，伴随其必需品重新设计为未来派机械配件',
    description: '万物变高达',
    inputRequired: true,
    difficulty: 'medium',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case46/output.jpg'
  },
  {
    id: 6,
    category: '风格转换',
    title: '漫画风格转换',
    prompt: '将输入的图片处理为黑白漫画风格线稿',
    description: '转换为日式漫画风格',
    inputRequired: true,
    difficulty: 'medium',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case57/output.jpg'
  },
  {
    id: 7,
    category: '风格转换',
    title: '不同时代照片',
    prompt: '将角色的风格改为1970年代的经典风格，添加长卷发、长胡子，将背景改为标志性的加州夏季风景',
    description: '穿越时空的照片效果',
    inputRequired: true,
    difficulty: 'easy',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case5/output.jpg'
  },
  {
    id: 8,
    category: '风格转换',
    title: '定制人物贴纸',
    prompt: '帮我将角色变成白色轮廓贴纸。角色需要转换成网页插画风格，并添加一个俏皮的白色轮廓短语',
    description: '生成卡通贴纸效果',
    inputRequired: true,
    difficulty: 'easy',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case10/output.jpg'
  },
  {
    id: 9,
    category: '风格转换',
    title: 'Minecraft风格',
    prompt: '将场景转换为Minecraft像素风格',
    description: '我的世界风格转换',
    inputRequired: true,
    difficulty: 'medium',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case59/output.jpg'
  },
  {
    id: 10,
    category: '风格转换',
    title: '动作人偶',
    prompt: '将人物转换为动作人偶玩具效果',
    description: '生成可动人偶效果',
    inputRequired: true,
    difficulty: 'medium',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case32/output.jpg'
  },
  {
    id: 11,
    category: '风格转换',
    title: '时尚服装拼贴画',
    prompt: '生成时尚服装拼贴画效果',
    description: '时尚杂志风拼贴',
    inputRequired: true,
    difficulty: 'medium',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case52/output.jpg'
  },
  {
    id: 12,
    category: '风格转换',
    title: '更换多种发型',
    prompt: '以九宫格的方式生成这个人不同发型的头像',
    description: '一键生成多种发型对比',
    inputRequired: true,
    difficulty: 'easy',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case15/output.jpg'
  },
  {
    id: 13,
    category: '风格转换',
    title: '定制大理石雕塑',
    prompt: '一张超详细的图像中主体雕塑的写实图像，由闪亮的大理石制成。雕塑应展示光滑反光的大理石表面，强调其光泽和艺术工艺',
    description: '将照片转换为大理石雕塑',
    inputRequired: true,
    difficulty: 'medium',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case17/output.jpg'
  },
  {
    id: 14,
    category: '风格转换',
    title: '等距全息投影',
    prompt: '生成等距视角的全息投影效果',
    description: '未来科技全息显示',
    inputRequired: true,
    difficulty: 'hard',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case58/output.jpg'
  },
  {
    id: 15,
    category: '风格转换',
    title: '痛车制作',
    prompt: '将角色图案应用到车身上制作痛车效果',
    description: '二次元痛车设计',
    inputRequired: true,
    difficulty: 'medium',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case55/output.jpg'
  },

  // 🎨 创意编辑类（20个）
  {
    id: 16,
    category: '创意编辑',
    title: '自动修图',
    prompt: '这张照片很无聊很平淡。增强它！增加对比度，提升色彩，改善光线使其更丰富，你可以裁剪和删除影响构图的细节',
    description: 'AI自动增强照片效果',
    inputRequired: true,
    difficulty: 'easy',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case7/output.jpg'
  },
  {
    id: 17,
    category: '创意编辑',
    title: '旧照片上色',
    prompt: '为这张黑白照片上色，使其看起来像真实的彩色照片',
    description: '黑白照片自动上色',
    inputRequired: true,
    difficulty: 'easy',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case20/output.jpg'
  },
  {
    id: 18,
    category: '创意编辑',
    title: '色卡线稿上色',
    prompt: '准确使用色卡为线稿人物上色',
    description: '根据色卡精准上色',
    inputRequired: true,
    difficulty: 'medium',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case13/output.jpg'
  },
  {
    id: 19,
    category: '创意编辑',
    title: '人物换衣',
    prompt: '保持人物姿势和表情，更换服装',
    description: '精准换装效果',
    inputRequired: true,
    difficulty: 'medium',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case22/output.jpg'
  },
  {
    id: 20,
    category: '创意编辑',
    title: '人物姿势修改',
    prompt: '修改人物的姿势，保持面部和服装不变',
    description: '精准调整人物动作',
    inputRequired: true,
    difficulty: 'medium',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case25/output.jpg'
  },
  {
    id: 21,
    category: '创意编辑',
    title: '图像外扩修复',
    prompt: '智能扩展图像边缘，补全被裁切的内容',
    description: 'AI智能外扩图片',
    inputRequired: true,
    difficulty: 'medium',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case50/output.jpg'
  },
  {
    id: 22,
    category: '创意编辑',
    title: '为图像添加水印',
    prompt: '在图片上添加艺术水印',
    description: '自动添加精美水印',
    inputRequired: true,
    difficulty: 'easy',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case27/output.jpg'
  },
  {
    id: 23,
    category: '创意编辑',
    title: '移除物体',
    prompt: '精准移除图像中的特定物体',
    description: '智能物体移除',
    inputRequired: true,
    difficulty: 'medium',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case73/output.jpg'
  },
  {
    id: 24,
    category: '创意编辑',
    title: '红笔批注',
    prompt: '在文档上添加红笔批注和修改建议',
    description: '自动批改和标注',
    inputRequired: true,
    difficulty: 'medium',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case29/output.jpg'
  },
  {
    id: 25,
    category: '创意编辑',
    title: '线稿图生成',
    prompt: '根据线稿图生成完整的彩色图像',
    description: '线稿自动上色和细化',
    inputRequired: true,
    difficulty: 'medium',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case26/output.jpg'
  },
  {
    id: 26,
    category: '创意编辑',
    title: 'OOTD穿搭',
    prompt: '根据上传的服装图片，将人物的服装替换为该服装',
    description: '虚拟试衣效果',
    inputRequired: true,
    difficulty: 'medium',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case21/output.jpg'
  },
  {
    id: 27,
    category: '创意编辑',
    title: '虚拟试妆',
    prompt: '为人物添加虚拟妆容',
    description: 'AI试妆效果',
    inputRequired: true,
    difficulty: 'medium',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case36/output.jpg'
  },
  {
    id: 28,
    category: '创意编辑',
    title: '动漫雕像放入现实',
    prompt: '将动漫角色雕像融入真实场景',
    description: '虚实结合特效',
    inputRequired: true,
    difficulty: 'medium',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case54/output.jpg'
  },
  {
    id: 29,
    category: '创意编辑',
    title: '重置相机参数',
    prompt: '调整照片的相机参数和视角',
    description: '修改拍摄角度和参数',
    inputRequired: true,
    difficulty: 'medium',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case62/output.jpg'
  },
  {
    id: 30,
    category: '创意编辑',
    title: '自定义娃娃机',
    prompt: '设计角色主题娃娃机',
    description: 'IP主题娃娃机设计',
    inputRequired: true,
    difficulty: 'medium',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case103/output.jpg'
  },

  // 🚀 创意生成类（20个）
  {
    id: 31,
    category: '创意生成',
    title: '地图生成街景',
    prompt: '画出红色箭头看到的内容 / 从红色圆圈沿箭头方向画出真实世界的视角',
    description: '从地图视角生成真实街景',
    inputRequired: true,
    difficulty: 'hard',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case2/output.jpg'
  },
  {
    id: 32,
    category: '创意生成',
    title: '多参考图生成',
    prompt: '一个模特摆姿势靠在粉色宝马车上。她穿着以下物品，场景背景是浅灰色。绿色外星人是一个钥匙扣，挂在粉色手提包上',
    description: '多个参考对象融合创作',
    inputRequired: true,
    difficulty: 'hard',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case6/output.jpg'
  },
  {
    id: 33,
    category: '创意生成',
    title: '根据食材做菜',
    prompt: '用这些食材为我做一顿美味的午餐，放在盘子里，盘子的特写视图，移除其他盘子和食材',
    description: 'AI厨师根据食材创作菜品',
    inputRequired: true,
    difficulty: 'medium',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case18/output1.jpg'
  },
  {
    id: 34,
    category: '创意生成',
    title: '爆炸的食物',
    prompt: '生成食物爆炸分解的艺术效果',
    description: '食物爆炸分解视觉效果',
    inputRequired: false,
    difficulty: 'hard',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case30/output.jpg'
  },
  {
    id: 35,
    category: '创意生成',
    title: '地图生成等距建筑',
    prompt: '根据地图生成等距视角的建筑群',
    description: '平面地图转3D建筑',
    inputRequired: true,
    difficulty: 'hard',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case33/output.jpg'
  },
  {
    id: 36,
    category: '创意生成',
    title: '古老地图生成古代场景',
    prompt: '根据古老地图生成对应的古代真实场景',
    description: '历史场景还原',
    inputRequired: true,
    difficulty: 'hard',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case51/output.jpg'
  },
  {
    id: 37,
    category: '创意生成',
    title: '知识推理生成图像',
    prompt: '根据知识推理生成对应的图像',
    description: 'AI推理生成知识图',
    inputRequired: false,
    difficulty: 'hard',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case28/output.jpg'
  },
  {
    id: 38,
    category: '创意生成',
    title: '文字转象形图',
    prompt: '将说明文字转换为象形图',
    description: '文字象形化设计',
    inputRequired: true,
    difficulty: 'medium',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case106/output.jpg'
  },
  {
    id: 39,
    category: '创意生成',
    title: '创建星座图',
    prompt: '将角色转换为星座图效果',
    description: '星空艺术效果',
    inputRequired: true,
    difficulty: 'medium',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case96/output.jpg'
  },
  {
    id: 40,
    category: '创意生成',
    title: '数位板上的绘画',
    prompt: '超逼真的手绘板屏幕图像，真实的第一人称视角，一只手握着手绘板和手绘笔。手绘板屏幕上显示原始图像的未完成状态',
    description: '绘画过程可视化',
    inputRequired: true,
    difficulty: 'hard',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case107/output.jpg'
  },
  {
    id: 41,
    category: '创意生成',
    title: '创建Line表情包',
    prompt: '角色表、面部表情、喜悦、愤怒、悲伤、快乐',
    description: '表情包批量生成',
    inputRequired: true,
    difficulty: 'medium',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case108/output.jpg'
  },
  {
    id: 42,
    category: '创意生成',
    title: '自定义主题公园',
    prompt: '设计角色主题公园场景',
    description: 'IP主题公园设计',
    inputRequired: true,
    difficulty: 'hard',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case95/output.jpg'
  },
  {
    id: 43,
    category: '创意生成',
    title: '跨视角图像生成',
    prompt: '将照片转换为俯视角度并标记摄影师的位置',
    description: '地面视角转俯视视角',
    inputRequired: true,
    difficulty: 'hard',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case9/output.jpg'
  },
  {
    id: 44,
    category: '创意生成',
    title: '真实世界AR信息化',
    prompt: '你是一个基于位置的AR体验生成器。在这张图像中突出显示兴趣点并标注相关信息',
    description: 'AR增强现实信息标注',
    inputRequired: true,
    difficulty: 'medium',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case3/output.jpg'
  },
  {
    id: 45,
    category: '创意生成',
    title: '电影休息室',
    prompt: '设计电影主题休息室场景',
    description: '主题空间设计',
    inputRequired: true,
    difficulty: 'hard',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case92/output.jpg'
  },

  // 💼 专业应用类（20个）
  {
    id: 46,
    category: '专业应用',
    title: '生成角色设定',
    prompt: '为我生成人物的角色设定：比例设定（不同身高对比）、三视图（正面、侧面、背面）、表情设定、动作设定、服装设定',
    description: '完整的角色设计三视图',
    inputRequired: true,
    difficulty: 'hard',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case12/output.jpg'
  },
  {
    id: 47,
    category: '专业应用',
    title: '文章信息图',
    prompt: '为文章内容生成信息图。要求：1.提炼文章的关键信息 2.图中内容保持精简 3.加上丰富可爱的卡通人物和元素',
    description: '自动生成文章配图',
    inputRequired: true,
    difficulty: 'medium',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case14/output.jpg'
  },
  {
    id: 48,
    category: '专业应用',
    title: '数学题推理',
    prompt: '根据问题将问题的答案写在对应的位置上',
    description: 'AI解题并标注答案',
    inputRequired: true,
    difficulty: 'medium',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case19/output.jpg'
  },
  {
    id: 49,
    category: '专业应用',
    title: '制作证件照',
    prompt: '将普通照片转换为标准证件照',
    description: '一键生成证件照',
    inputRequired: true,
    difficulty: 'easy',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case63/output.jpg'
  },
  {
    id: 50,
    category: '专业应用',
    title: '平面图3D渲染',
    prompt: '将平面图转换为3D室内渲染效果',
    description: '户型图转3D效果图',
    inputRequired: true,
    difficulty: 'hard',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case61/output.jpg'
  },
  {
    id: 51,
    category: '专业应用',
    title: '电影分镜',
    prompt: '根据剧本描述生成电影分镜头',
    description: '电影分镜自动生成',
    inputRequired: true,
    difficulty: 'hard',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case24/output.jpg'
  },
  {
    id: 52,
    category: '专业应用',
    title: '制作漫画书',
    prompt: '将故事转换为漫画书页面',
    description: '自动生成漫画分镜',
    inputRequired: true,
    difficulty: 'hard',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case31/output.jpg'
  },
  {
    id: 53,
    category: '专业应用',
    title: '多视图结果生成',
    prompt: '生成物体的多个角度视图：正面、侧面、背面',
    description: '3D物体多视角展示',
    inputRequired: true,
    difficulty: 'hard',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case23/output.jpg'
  },
  {
    id: 54,
    category: '专业应用',
    title: '模型标注讲解',
    prompt: '绘制3D模型用于学术展示，进行标注讲解，适用于展示其原理和功能，非常逼真，高度还原',
    description: '3D模型专业标注',
    inputRequired: false,
    difficulty: 'hard',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case16/output.jpg'
  },
  {
    id: 55,
    category: '专业应用',
    title: '妆面分析',
    prompt: '分析妆容并标注化妆步骤和产品',
    description: '妆容分析和教学',
    inputRequired: true,
    difficulty: 'medium',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case37/output.jpg'
  },
  {
    id: 56,
    category: '专业应用',
    title: '提取信息并标注',
    prompt: '提取图像中的信息并以透明图层形式展示',
    description: '信息提取和可视化',
    inputRequired: true,
    difficulty: 'hard',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case49/output.jpg'
  },
  {
    id: 57,
    category: '专业应用',
    title: '珠宝首饰设计',
    prompt: '设计精美的珠宝首饰效果图',
    description: '珠宝设计可视化',
    inputRequired: true,
    difficulty: 'hard',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case67/output.jpg'
  },
  {
    id: 58,
    category: '专业应用',
    title: '周边设计',
    prompt: '设计角色周边产品效果图',
    description: 'IP周边产品设计',
    inputRequired: true,
    difficulty: 'medium',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case68/output.jpg'
  },
  {
    id: 59,
    category: '专业应用',
    title: '游戏角色UI界面',
    prompt: '使用原图中的角色创建一个RPG游戏角色状态界面。状态界面需包含角色参数、技能、图标等信息',
    description: 'RPG游戏UI设计',
    inputRequired: true,
    difficulty: 'hard',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case105/output.jpg'
  },
  {
    id: 60,
    category: '专业应用',
    title: '制作电影海报',
    prompt: '根据角色和场景制作电影海报',
    description: '专业海报设计',
    inputRequired: true,
    difficulty: 'hard',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case98/output.jpg'
  },

  // ✨ 特效合成类（15个）
  {
    id: 61,
    category: '特效合成',
    title: '硬件拆解图',
    prompt: '生成设备的爆炸拆解示意图',
    description: '专业拆解可视化',
    inputRequired: false,
    difficulty: 'hard',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case47/output.jpg'
  },
  {
    id: 62,
    category: '特效合成',
    title: '食物卡路里标注',
    prompt: '在食物图片上标注卡路里信息',
    description: 'AI营养分析',
    inputRequired: true,
    difficulty: 'medium',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case48/output.jpg'
  },
  {
    id: 63,
    category: '特效合成',
    title: '精致产品照',
    prompt: '生成精致可爱的产品照片',
    description: '产品摄影效果',
    inputRequired: false,
    difficulty: 'medium',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case53/output.jpg'
  },
  {
    id: 64,
    category: '特效合成',
    title: '玻璃瓶纪念品',
    prompt: '将场景装入玻璃瓶制作纪念品效果',
    description: '创意瓶中世界',
    inputRequired: true,
    difficulty: 'medium',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case88/output.jpg'
  },
  {
    id: 65,
    category: '特效合成',
    title: '微型商店',
    prompt: '生成精致的微型商店场景',
    description: '迷你场景设计',
    inputRequired: false,
    difficulty: 'medium',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case89/output.jpg'
  },
  {
    id: 66,
    category: '特效合成',
    title: '暗黑哥特塔罗牌',
    prompt: '设计暗黑哥特风格的塔罗牌',
    description: '神秘塔罗牌设计',
    inputRequired: true,
    difficulty: 'hard',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case86/output.jpg'
  },
  {
    id: 67,
    category: '特效合成',
    title: '黑白进化图',
    prompt: '生成事物的黑白进化演变图',
    description: '演化过程可视化',
    inputRequired: true,
    difficulty: 'medium',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case87/output.jpg'
  },
  {
    id: 68,
    category: '特效合成',
    title: '切割爆炸效果',
    prompt: '切割带有卡通爆炸效果的物体',
    description: '动感爆炸特效',
    inputRequired: true,
    difficulty: 'hard',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case93/output.jpg'
  },
  {
    id: 69,
    category: '特效合成',
    title: '将图像变透明',
    prompt: '将参考图像变为透明物体',
    description: '玻璃质感效果',
    inputRequired: true,
    difficulty: 'medium',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case100/output.jpg'
  },
  {
    id: 70,
    category: '特效合成',
    title: '鱼眼镜头视角',
    prompt: '生成鱼眼镜头视角图像',
    description: '鱼眼特效',
    inputRequired: true,
    difficulty: 'medium',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case101/output.jpg'
  },
  {
    id: 71,
    category: '特效合成',
    title: '图片生成微缩场景',
    prompt: '将图片转换为微缩模型场景',
    description: '微缩世界效果',
    inputRequired: true,
    difficulty: 'medium',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case75/output.jpg'
  },
  {
    id: 72,
    category: '特效合成',
    title: '恢复被吃的食物',
    prompt: '恢复被吃了部分的食物',
    description: 'AI复原技术',
    inputRequired: true,
    difficulty: 'medium',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case78/output.jpg'
  },
  {
    id: 73,
    category: '特效合成',
    title: '切割模型',
    prompt: '生成物体的切割剖面图',
    description: '剖面结构展示',
    inputRequired: true,
    difficulty: 'hard',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case80/output.jpg'
  },
  {
    id: 74,
    category: '特效合成',
    title: '部件提取',
    prompt: '提取并展示物体的各个部件',
    description: '零件分解图',
    inputRequired: true,
    difficulty: 'hard',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case72/output.jpg'
  },
  {
    id: 75,
    category: '特效合成',
    title: '现代美术展览空间',
    prompt: '设计现代美术展览空间',
    description: '展览空间设计',
    inputRequired: true,
    difficulty: 'hard',
    exampleImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case85/output.jpg'
  }
];

interface PromptGalleryProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectPrompt: (prompt: string) => void;
}

export default function PromptGallery({ isVisible, onClose, onSelectPrompt }: PromptGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('全部');

  const categories = ['全部', '风格转换', '创意编辑', '创意生成', '专业应用', '特效合成'];
  const difficulties = ['全部', 'easy', 'medium', 'hard'];
  const difficultyLabels = { easy: '简单', medium: '中等', hard: '高级' };

  const filteredTemplates = promptTemplates.filter(template => {
    const matchesCategory = selectedCategory === '全部' || template.category === selectedCategory;
    const matchesSearch = 
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = selectedDifficulty === '全部' || template.difficulty === selectedDifficulty;
    return matchesCategory && matchesSearch && matchesDifficulty;
  });

  const handleSelectTemplate = (template: PromptTemplate) => {
    onSelectPrompt(template.prompt);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0, 0, 0, 0.75)' }} onClick={onClose}>
      <div 
        className="w-full max-w-6xl h-[85vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden"
        style={{ background: 'var(--bg-secondary)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-primary)' }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                🎨 提示词画廊
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                75+ 精选创意模板，来自 GitHub 14k⭐ 项目
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full hover:bg-red-500/10 flex items-center justify-center transition-colors"
              style={{ color: 'var(--text-secondary)' }}
            >
              <span className="text-2xl">×</span>
            </button>
          </div>

          {/* 搜索框 */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 搜索提示词..."
            className="input-glass w-full text-sm"
          />
        </div>

        {/* 筛选栏 */}
        <div className="px-6 py-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-xs font-semibold px-2 py-1" style={{ color: 'var(--text-secondary)' }}>分类:</span>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`text-xs px-3 py-1 rounded-full transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-primary text-white shadow-md'
                    : 'btn-secondary'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-semibold px-2 py-1" style={{ color: 'var(--text-secondary)' }}>难度:</span>
            {difficulties.map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`text-xs px-3 py-1 rounded-full transition-all ${
                  selectedDifficulty === diff
                    ? 'bg-gradient-primary text-white shadow-md'
                    : 'btn-secondary'
                }`}
              >
                {diff === '全部' ? '全部' : difficultyLabels[diff as keyof typeof difficultyLabels]}
              </button>
            ))}
          </div>
        </div>

        {/* 模板网格 */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="glass-card overflow-hidden cursor-pointer hover:shadow-xl transition-all group"
                onClick={() => handleSelectTemplate(template)}
              >
                {/* 示例图片 */}
                {template.exampleImage && (
                  <div className="relative w-full h-36 overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
                    <img
                      src={template.exampleImage}
                      alt={template.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {/* 信息区域 */}
                <div className="p-3">
                  {/* 标题行 */}
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-xs flex-1 truncate" title={template.title} style={{ color: 'var(--text-primary)' }}>
                      {template.title}
                    </h3>
                    {template.inputRequired && (
                      <span className="text-sm flex-shrink-0" title="需要上传图片">📷</span>
                    )}
                  </div>
                  
                  {/* 描述 */}
                  <p className="text-xs mb-2 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                    {template.description}
                  </p>
                  
                  {/* 底部标签 */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs px-2 py-0.5 rounded" style={{ 
                      background: 'var(--bg-tertiary)',
                      color: 'var(--text-secondary)' 
                    }}>
                      {template.category}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      template.difficulty === 'easy' ? 'bg-green-500/20 text-green-600' :
                      template.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-600' :
                      'bg-red-500/20 text-red-600'
                    }`}>
                      {difficultyLabels[template.difficulty]}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-20">
              <span className="text-5xl">🔍</span>
              <p className="mt-4" style={{ color: 'var(--text-secondary)' }}>
                没有找到匹配的提示词
              </p>
            </div>
          )}
        </div>

        {/* 底部统计 */}
        <div className="px-6 py-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
          <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
            共 {filteredTemplates.length} 个模板 · 点击卡片即可应用提示词
          </p>
        </div>
      </div>
    </div>
  );
}
