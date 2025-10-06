// 创意画廊数据 - 来自 GitHub Awesome-Nano-Banana-images (14k⭐)
export interface GalleryCase {
  id: number;
  title: string;
  category: string;
  prompt: string;
  description: string;
  inputImage: string;
  outputImage: string;
  author: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const galleryCases: GalleryCase[] = [
  // 风格转换类（15个）
  {
    id: 1,
    title: '插画变手办',
    category: '风格转换',
    prompt: '将这张照片变成角色手办。在它后面放置一个印有角色图像的盒子，盒子上有一台电脑显示Blender建模过程。在盒子前面添加一个圆形塑料底座，角色手办站在上面。场景设置在室内',
    description: '将任意插画或照片转换为精美的手办模型，包含包装盒和建模过程展示',
    inputImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case1/input0.jpg',
    outputImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case1/output0.jpg',
    author: '@ZHO_ZHO_ZHO',
    difficulty: 'medium'
  },
  {
    id: 11,
    title: '动漫转真人Coser',
    category: '风格转换',
    prompt: '生成一个女孩cosplay这张插画的照片，背景设置在Comiket。高度还原插画的姿势、服装和风格',
    description: '将动漫插画转换为真人Coser照片',
    inputImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case11/input.jpg',
    outputImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case11/output.jpg',
    author: '@ZHO_ZHO_ZHO',
    difficulty: 'medium'
  },
  {
    id: 45,
    title: '图片转乐高',
    category: '风格转换',
    prompt: '将照片中的人物转化为乐高小人包装盒的风格，以等距透视呈现。展示基于照片中人物的乐高小人，配有配件',
    description: '将人物转换为乐高玩具包装',
    inputImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case45/input.jpg',
    outputImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case45/output.jpg',
    author: '@ZHO_ZHO_ZHO',
    difficulty: 'medium'
  },
  {
    id: 46,
    title: '图片转高达模型',
    category: '风格转换',
    prompt: '将照片中的人物转化为高达模型套件包装盒的风格。展示高达风格机械人版本',
    description: '万物变高达模型',
    inputImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case46/input.jpg',
    outputImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case46/output.jpg',
    author: '@ZHO_ZHO_ZHO',
    difficulty: 'medium'
  },
  {
    id: 110,
    title: 'PIXAR风格3D头像',
    category: '风格转换',
    prompt: '生成一幅 3D 头像：对象为上传图像中的人物，面带灿烂笑容，背景干净白色，Pixar 风格，高质量渲染',
    description: 'Pixar风格的可爱3D头像',
    inputImage: 'https://via.placeholder.com/400x400?text=Input',
    outputImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case110/output.jpg',
    author: '@NanoBanana_labs',
    difficulty: 'easy'
  },
  {
    id: 57,
    title: '漫画风格转换',
    category: '风格转换',
    prompt: '将输入的图片处理为黑白漫画风格线稿',
    description: '转换为日式漫画风格',
    inputImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case57/input.jpg',
    outputImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case57/output.jpg',
    author: '@nobisiro_2023',
    difficulty: 'easy'
  },
  {
    id: 5,
    title: '不同时代照片',
    category: '风格转换',
    prompt: '将角色的风格改为1970年代的经典风格，添加长卷发、长胡子，将背景改为标志性的加州夏季风景',
    description: '穿越时空，生成不同年代照片',
    inputImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case5/input.jpg',
    outputImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case5/output.jpg',
    author: '@AmirMushich',
    difficulty: 'medium'
  },
  
  // 创意编辑类（10个）
  {
    id: 7,
    title: '自动修图增强',
    category: '创意编辑',
    prompt: '这张照片很无聊很平淡。增强它！增加对比度，提升色彩，改善光线使其更丰富',
    description: '一键增强照片的对比度、色彩和光线',
    inputImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case7/input.jpg',
    outputImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case7/output.jpg',
    author: '@op7418',
    difficulty: 'easy'
  },
  {
    id: 13,
    title: '色卡线稿上色',
    category: '创意编辑',
    prompt: '准确使用图2色卡为图1人物上色',
    description: '使用指定色卡为线稿上色',
    inputImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case13/input.jpg',
    outputImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case13/output.jpg',
    author: '@ZHO_ZHO_ZHO',
    difficulty: 'medium'
  },
  {
    id: 20,
    title: '旧照片上色',
    category: '创意编辑',
    prompt: '修复并为这张照片上色',
    description: '老照片智能上色和修复',
    inputImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case20/input.jpg',
    outputImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case20/output.jpg',
    author: '@GeminiApp',
    difficulty: 'easy'
  },
  {
    id: 50,
    title: '图像外扩修复',
    category: '创意编辑',
    prompt: '将图像的棋盘格部分进行修复，恢复为完整图像',
    description: '修复图片缺失部分',
    inputImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case50/input.jpg',
    outputImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case50/output.jpg',
    author: '@bwabbage',
    difficulty: 'medium'
  },
  {
    id: 74,
    title: '图像高清修复',
    category: '创意编辑',
    prompt: '增强这张老图像的分辨率并添加适当的纹理细节，用现代动漫技术重新诠释它',
    description: '老图片高清化处理',
    inputImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case74/input.png',
    outputImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case74/output.png',
    author: '@op7418',
    difficulty: 'easy'
  },
  {
    id: 63,
    title: '制作证件照',
    category: '创意编辑',
    prompt: '截取图片人像头部，帮我做成2寸证件照，要求：1、蓝底 2、职业正装 3、正脸 4、微笑',
    description: '一键生成标准证件照',
    inputImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case63/input.jpg',
    outputImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case63/output.jpg',
    author: '@songguoxiansen',
    difficulty: 'easy'
  },
  
  // 创意生成类（20个）
  {
    id: 2,
    title: '地图生成地面视角',
    category: '创意生成',
    prompt: '画出红色箭头看到的内容。从红色圆圈沿箭头方向画出真实世界的视角',
    description: '从地图标注生成对应位置的真实街景照片',
    inputImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case2/input.jpg',
    outputImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case2/output.jpg',
    author: '@tokumin',
    difficulty: 'hard'
  },
  {
    id: 10,
    title: '定制人物贴纸',
    category: '创意生成',
    prompt: '帮我将角色变成白色轮廓贴纸。角色需要转换成网页插画风格',
    description: '将人物转换为贴纸风格',
    inputImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case10/input.jpg',
    outputImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case10/output.jpg',
    author: '@op7418',
    difficulty: 'medium'
  },
  {
    id: 12,
    title: '生成角色设定',
    category: '创意生成',
    prompt: '为我生成人物的角色设定：比例设定、三视图、表情设定、动作设定、服装设定',
    description: '一张图生成完整角色设定',
    inputImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case12/input.jpg',
    outputImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case12/output.jpg',
    author: '@ZHO_ZHO_ZHO',
    difficulty: 'hard'
  },
  {
    id: 15,
    title: '更换多种发型',
    category: '创意生成',
    prompt: '以九宫格的方式生成这个人不同发型的头像',
    description: '一次看到多种发型效果',
    inputImage: 'https://via.placeholder.com/400x400?text=Input',
    outputImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case15/output.jpg',
    author: '@balconychy',
    difficulty: 'medium'
  },
  {
    id: 30,
    title: '爆炸的食物',
    category: '创意生成',
    prompt: '在具有戏剧性的现代场景中拍摄该产品，伴随着爆炸性的向外动态排列',
    description: '产品爆炸效果广告',
    inputImage: 'https://via.placeholder.com/400x400?text=Product',
    outputImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case30/output.jpg',
    author: '@icreatelife',
    difficulty: 'medium'
  },
  {
    id: 31,
    title: '制作漫画书',
    category: '创意生成',
    prompt: '基于上传的图像，制作漫画书条幅，添加文字，写一个引人入胜的故事',
    description: '生成漫画风格故事',
    inputImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case31/input.jpg',
    outputImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case31/output.jpg',
    author: '@icreatelife',
    difficulty: 'hard'
  },
  {
    id: 35,
    title: '插画绘画过程四格',
    category: '创意生成',
    prompt: '为人物生成绘画过程四宫格，第一步：线稿，第二步平铺颜色，第三步：增加阴影，第四步：细化成型',
    description: '展示绘画创作过程',
    inputImage: 'https://via.placeholder.com/400x400?text=Character',
    outputImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case35/case.jpg',
    author: '@ZHO_ZHO_ZHO',
    difficulty: 'medium'
  },
  {
    id: 40,
    title: '超多人物姿势生成',
    category: '创意生成',
    prompt: '请为这幅插画创建一个姿势表，摆出各种姿势',
    description: '生成多种姿势参考',
    inputImage: 'https://via.placeholder.com/400x400?text=Character',
    outputImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case40/case.jpg',
    author: '@tapehead_Lab',
    difficulty: 'medium'
  },
  {
    id: 70,
    title: '巨型人物脚手架',
    category: '创意生成',
    prompt: '图片中人物的超写实3D渲染。巨型人物全身环绕着庞大的脚手架，脚手架上有建筑工人作业',
    description: '创造巨人效果场景',
    inputImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case70/input.png',
    outputImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case70/output.png',
    author: '@songguoxiansen',
    difficulty: 'hard'
  },
  {
    id: 77,
    title: '表情包生成',
    category: '创意生成',
    prompt: '用图2形象，参考图1的各种姿势生成多个表情包',
    description: '自定义人物表情包',
    inputImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case77/input.png',
    outputImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case77/output.png',
    author: '@vista8',
    difficulty: 'medium'
  },
  {
    id: 90,
    title: '成为Vtuber',
    category: '创意生成',
    prompt: '使用原图创建一个虚拟的Vtuber及其直播画面',
    description: 'Vtuber直播界面生成',
    inputImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case90/input.png',
    outputImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case90/output.png',
    author: '@AI_Kei75',
    difficulty: 'hard'
  },
  {
    id: 105,
    title: '游戏角色状态界面',
    category: '创意生成',
    prompt: '使用原图中的角色创建一个 RPG 游戏角色状态界面',
    description: 'RPG游戏界面设计',
    inputImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case105/input.jpg',
    outputImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case105/output.jpg',
    author: '@AI_Kei75',
    difficulty: 'hard'
  },
  
  // 专业应用类（10个）
  {
    id: 4,
    title: '建筑等距模型',
    category: '专业应用',
    prompt: '将图像制作成白天和等距视图（仅限建筑）',
    description: '将建筑照片转换为等距视角3D模型',
    inputImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case4/input.jpg',
    outputImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case4/output.jpg',
    author: '@Zieeett',
    difficulty: 'hard'
  },
  {
    id: 9,
    title: '跨视角图像生成',
    category: '专业应用',
    prompt: '将照片转换为俯视角度并标记摄影师的位置',
    description: '改变照片视角，从地面到俯视',
    inputImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case9/input.jpg',
    outputImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case9/output.jpg',
    author: '@op7418',
    difficulty: 'hard'
  },
  {
    id: 47,
    title: '硬件拆解图',
    category: '专业应用',
    prompt: '创建该物品的分解图，展示其所有配件和内部组件',
    description: '专业级拆解示意图',
    inputImage: 'https://via.placeholder.com/400x400?text=Device',
    outputImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case47/output.jpg',
    author: '@AIimagined',
    difficulty: 'hard'
  },
  {
    id: 59,
    title: 'Minecraft风格场景',
    category: '专业应用',
    prompt: '使用此位置将地标制作成游戏 Minecraft 的 HD-2D 风格的等距图像',
    description: 'Minecraft游戏风格',
    inputImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case59/input.jpg',
    outputImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case59/output.jpg',
    author: '@tetumemo',
    difficulty: 'medium'
  },
  {
    id: 61,
    title: '平面图3D渲染',
    category: '专业应用',
    prompt: '帮我把这个住宅平面图转换为房屋的等距照片级真实感 3D 渲染',
    description: '平面图转立体效果',
    inputImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case61/input.jpg',
    outputImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case61/output.jpg',
    author: '@op7418',
    difficulty: 'hard'
  },
  
  // 特效合成类（10个）
  {
    id: 6,
    title: '多参考图像生成',
    category: '特效合成',
    prompt: '融合多张参考图的元素，创造一个统一和谐的场景',
    description: '多张参考图融合生成复杂场景',
    inputImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case6/input.jpg',
    outputImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case6/output.jpg',
    author: '@MrDavids1',
    difficulty: 'hard'
  },
  {
    id: 8,
    title: '手绘控制多角色姿态',
    category: '特效合成',
    prompt: '让这两个角色使用手绘图的姿势进行战斗。添加适当的视觉背景',
    description: '使用手绘草图控制角色姿势和动作',
    inputImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case8/input.jpg',
    outputImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case8/output.jpg',
    author: '@op7418',
    difficulty: 'hard'
  },
  {
    id: 22,
    title: '人物换衣',
    category: '特效合成',
    prompt: '将输入图像中人物的服装替换为参考图像中显示的目标服装',
    description: '虚拟换装效果',
    inputImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case22/input.jpg',
    outputImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case22/output.jpg',
    author: '@skirano',
    difficulty: 'medium'
  },
  {
    id: 36,
    title: '虚拟试妆',
    category: '特效合成',
    prompt: '为图一人物化上图二的妆，保持图一的姿势',
    description: '虚拟化妆效果',
    inputImage: 'https://via.placeholder.com/400x400?text=Portrait',
    outputImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case36/case.jpg',
    author: '@ZHO_ZHO_ZHO',
    difficulty: 'medium'
  },
  {
    id: 42,
    title: '叠加滤镜材质',
    category: '特效合成',
    prompt: '为图一照片叠加上图二材质的效果（玻璃、金属等）',
    description: '添加创意材质效果',
    inputImage: 'https://via.placeholder.com/400x400?text=Photo',
    outputImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case42/case.jpg',
    author: '@ZHO_ZHO_ZHO',
    difficulty: 'medium'
  },
  {
    id: 44,
    title: '光影控制',
    category: '特效合成',
    prompt: '图一人物换成图二的光影效果，深色为暗',
    description: '专业级打光效果',
    inputImage: 'https://via.placeholder.com/400x400?text=Portrait',
    outputImage: 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case44/case.jpg',
    author: '@ZHO_ZHO_ZHO',
    difficulty: 'hard'
  }
];

