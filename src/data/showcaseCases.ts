/**
 * Showcase 案例数据
 * 参考：https://github.com/PicoTrex/Awesome-Nano-Banana-images
 * 
 * 持续更新中...
 */

// 导入 GPT-4o 提示词案例
import { gpt4oPromptsCases } from './gpt4oPromptsCases';

export interface ShowcaseCase {
  id: number;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  inputImages: string[];
  outputImage: string;
  prompt: string;
  promptEn: string;
  category: 'portrait' | 'landscape' | 'product' | 'art' | 'fusion' | 'edit';
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  author: string;
  modelUsed: string;
  requiresInput: boolean;
  featured: boolean;
}

const BASE_URL = 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images';

export const showcaseCases: ShowcaseCase[] = [
  // === 案例1-10：基于原README精确提取 ===
  {
    id: 1,
    title: '插画变手办',
    titleEn: 'Illustration to Figure',
    description: '将插画角色转换为3D手办模型展示',
    descriptionEn: 'Transform illustration character into 3D figure model',
    inputImages: [`${BASE_URL}/case1/input0.jpg`],
    outputImage: `${BASE_URL}/case1/output0.jpg`,
    prompt: '将这张照片变成角色手办。在它后面放置一个印有角色图像的盒子，盒子上有一台电脑显示Blender建模过程。在盒子前面添加一个圆形塑料底座，角色手办站在上面。如果可能的话，将场景设置在室内',
    promptEn: 'Turn this photo into a character figure. Place a box behind it with the character image printed on it, with a computer showing Blender modeling process. Add circular plastic base with figure standing on it. Set scene indoors if possible.',
    category: 'art',
    difficulty: 'medium',
    tags: ['手办', '3D建模', '角色一致性'],
    author: '@ZHO_ZHO_ZHO',
    modelUsed: 'Gemini 2.5 Flash',
    requiresInput: true,
    featured: true
  },
  {
    id: 2,
    title: '根据地图箭头生成地面视角',
    titleEn: 'Map Arrow to Ground View',
    description: '从地图箭头方向生成真实街景视角',
    descriptionEn: 'Generate real street view from map arrow direction',
    inputImages: [`${BASE_URL}/case2/input.jpg`],
    outputImage: `${BASE_URL}/case2/output.jpg`,
    prompt: '画出红色箭头看到的内容 / 从红色圆圈沿箭头方向画出真实世界的视角',
    promptEn: 'Draw what the red arrow sees / Paint real-world perspective from red circle along arrow direction',
    category: 'landscape',
    difficulty: 'medium',
    tags: ['地图', '视角转换', '街景'],
    author: '@tokumin',
    modelUsed: 'Gemini 2.5 Flash',
    requiresInput: true,
    featured: true
  },
  {
    id: 3,
    title: '真实世界的AR信息化',
    titleEn: 'AR Information Overlay',
    description: '在真实场景中添加AR信息标注',
    descriptionEn: 'Add AR information annotations to real scenes',
    inputImages: [],
    outputImage: `${BASE_URL}/case3/output.jpg`,
    prompt: '你是一个基于位置的AR体验生成器。在这张图像中突出显示[兴趣点]并标注相关信息',
    promptEn: 'You are a location-based AR experience generator. Highlight [POI] in this image and annotate relevant information',
    category: 'edit',
    difficulty: 'medium',
    tags: ['AR', '信息标注', '增强现实'],
    author: '@bilawalsidhu',
    modelUsed: 'Gemini 2.5 Flash',
    requiresInput: true,
    featured: false
  },
  {
    id: 4,
    title: '分离出3D建筑/制作等距模型',
    titleEn: 'Extract 3D Building / Isometric Model',
    description: '将建筑照片转换为等距视角3D模型',
    descriptionEn: 'Convert building photo to isometric 3D model',
    inputImages: [`${BASE_URL}/case4/input.jpg`],
    outputImage: `${BASE_URL}/case4/output.jpg`,
    prompt: '将图像制作成白天和等距视图[仅限建筑]',
    promptEn: 'Make image in daylight and isometric view [buildings only]',
    category: 'landscape',
    difficulty: 'hard',
    tags: ['等距', '3D', '建筑'],
    author: '@Zieeett',
    modelUsed: 'Gemini 2.5 Flash',
    requiresInput: true,
    featured: false
  },
  {
    id: 5,
    title: '不同时代自己的照片',
    titleEn: 'Different Era Photos',
    description: '将人物照片转换为不同时代的风格',
    descriptionEn: 'Transform portrait to different era styles',
    inputImages: [`${BASE_URL}/case5/input.jpg`],
    outputImage: `${BASE_URL}/case5/output.jpg`,
    prompt: '将角色的风格改为[1970]年代的经典[男性]风格。添加[长卷发]，[长胡子]，将背景改为标志性的[加州夏季风景]。不要改变角色的面部',
    promptEn: 'Change character style to classic [1970s] [male] style. Add [long curly hair], [long beard], change background to iconic [California summer landscape]. Do not change character face.',
    category: 'portrait',
    difficulty: 'medium',
    tags: ['时代风格', '年代', '复古'],
    author: '@AmirMushich',
    modelUsed: 'Gemini 2.5 Flash',
    requiresInput: true,
    featured: false
  },
  {
    id: 6,
    title: '多参考图像生成',
    titleEn: 'Multi-Reference Image Generation',
    description: '使用多个参考图合成复杂场景',
    descriptionEn: 'Use multiple references to compose complex scene',
    inputImages: [`${BASE_URL}/case6/input.jpg`],
    outputImage: `${BASE_URL}/case6/output.jpg`,
    prompt: '一个模特摆姿势靠在粉色宝马车上。她穿着以下物品，场景背景是浅灰色。绿色外星人是一个钥匙扣，挂在粉色手提包上。模特肩上还有一只粉色鹦鹉。旁边坐着一只戴着粉色项圈和金色耳机的哈巴狗',
    promptEn: 'Model posing against pink BMW. Wearing following items, light gray background. Green alien keychain on pink bag. Pink parrot on shoulder. Pug with pink collar and gold headphones sitting nearby.',
    category: 'fusion',
    difficulty: 'hard',
    tags: ['多图合成', '复杂场景', '创意'],
    author: '@MrDavids1',
    modelUsed: 'Gemini 2.5 Flash',
    requiresInput: true,
    featured: true
  },
  {
    id: 7,
    title: '自动修图',
    titleEn: 'Auto Enhancement',
    description: '智能增强照片对比度、色彩和光线',
    descriptionEn: 'Intelligently enhance contrast, color and lighting',
    inputImages: [`${BASE_URL}/case7/input.jpg`],
    outputImage: `${BASE_URL}/case7/output.jpg`,
    prompt: '这张照片很无聊很平淡。增强它！增加对比度，提升色彩，改善光线使其更丰富，你可以裁剪和删除影响构图的细节',
    promptEn: 'This photo is boring and flat. Enhance it! Increase contrast, boost colors, improve lighting to make it richer. You can crop and remove details affecting composition.',
    category: 'edit',
    difficulty: 'easy',
    tags: ['增强', '修图', '自动'],
    author: '@op7418',
    modelUsed: 'Gemini 2.5 Flash',
    requiresInput: true,
    featured: false
  },
  {
    id: 8,
    title: '手绘图控制多角色姿态',
    titleEn: 'Sketch-Controlled Multi-Character Pose',
    description: '用手绘草图控制多个角色的姿势',
    descriptionEn: 'Control multiple character poses with hand-drawn sketch',
    inputImages: [`${BASE_URL}/case8/input.jpg`],
    outputImage: `${BASE_URL}/case8/output.jpg`,
    prompt: '让这两个角色使用图3的姿势进行战斗。添加适当的视觉背景和场景互动，生成图像比例为16:9',
    promptEn: 'Make these two characters fight using pose from image 3. Add appropriate visual background and scene interaction, generate 16:9 ratio',
    category: 'art',
    difficulty: 'hard',
    tags: ['姿态控制', '多角色', '草图'],
    author: '@op7418',
    modelUsed: 'Gemini 2.5 Flash',
    requiresInput: true,
    featured: true
  },
  {
    id: 9,
    title: '跨视角图像生成',
    titleEn: 'Cross-View Image Generation',
    description: '从地面视角转换为俯视视角',
    descriptionEn: 'Convert from ground view to aerial view',
    inputImages: [`${BASE_URL}/case9/input.jpg`],
    outputImage: `${BASE_URL}/case9/output.jpg`,
    prompt: '将照片转换为俯视角度并标记摄影师的位置',
    promptEn: 'Convert photo to overhead view and mark photographer position',
    category: 'landscape',
    difficulty: 'hard',
    tags: ['视角转换', '俯视', '空间'],
    author: '@op7418',
    modelUsed: 'Gemini 2.5 Flash',
    requiresInput: true,
    featured: false
  },
  {
    id: 10,
    title: '定制人物贴纸',
    titleEn: 'Custom Character Stickers',
    description: '创建白色轮廓风格的人物贴纸',
    descriptionEn: 'Create white outline style character stickers',
    inputImages: [`${BASE_URL}/case10/input.jpg`],
    outputImage: `${BASE_URL}/case10/output.jpg`,
    prompt: '帮我将角色变成类似图2的白色轮廓贴纸。角色需要转换成网页插画风格，并添加一个描述图1的俏皮白色轮廓短语',
    promptEn: 'Help me turn character into white outline sticker similar to image 2. Convert to web illustration style and add playful white outline phrase describing image 1.',
    category: 'art',
    difficulty: 'medium',
    tags: ['贴纸', '轮廓', '插画'],
    author: '@op7418',
    modelUsed: 'Gemini 2.5 Flash',
    requiresInput: true,
    featured: true
  },
  // === 案例11-50：继续基于原README ===
  {id: 11, title: '动漫转真人Coser', titleEn: 'Anime to Real Cosplayer', description: '将动漫角色转换为真人cosplay照片', descriptionEn: 'Convert anime character to real cosplay photo', inputImages: [`${BASE_URL}/case11/input.jpg`], outputImage: `${BASE_URL}/case11/output.jpg`, prompt: '生成一个女孩cosplay这张插画的照片，背景设置在Comiket', promptEn: 'Generate photo of girl cosplaying this illustration, background set at Comiket', category: 'portrait', difficulty: 'hard', tags: ['cosplay', '动漫转真人', '角色一致性'], author: '@ZHO_ZHO_ZHO', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: true },
  {id: 12, title: '生成角色设定', titleEn: 'Character Design Sheet', description: '生成完整的角色设定图', descriptionEn: 'Generate complete character design sheet', inputImages: [`${BASE_URL}/case12/input.jpg`], outputImage: `${BASE_URL}/case12/output.jpg`, prompt: '为我生成人物的角色设定（Character Design）：比例设定（不同身高对比、头身比等）、三视图（正面、侧面、背面）、表情设定（Expression Sheet）、动作设定（Pose Sheet）、服装设定（Costume Design）', promptEn: 'Generate character design: proportions, three views (front/side/back), expression sheet, pose sheet, costume design', category: 'art', difficulty: 'hard', tags: ['角色设定', '三视图', '游戏设计'], author: '@ZHO_ZHO_ZHO', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: true },
  {id: 13, title: '色卡线稿上色', titleEn: 'Color Palette Coloring', description: '使用色卡为线稿准确上色', descriptionEn: 'Accurately color lineart using color palette', inputImages: [`${BASE_URL}/case13/input.jpg`], outputImage: `${BASE_URL}/case13/output.jpg`, prompt: '准确使用图2色卡为图1人物上色', promptEn: 'Accurately color figure 1 using color palette from figure 2', category: 'art', difficulty: 'medium', tags: ['上色', '色卡', '线稿'], author: '@ZHO_ZHO_ZHO', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: false },
  {id: 14, title: '文章信息图', titleEn: 'Article Infographic', description: '将文章内容转换为可视化信息图', descriptionEn: 'Convert article to visual infographic', inputImages: [], outputImage: `${BASE_URL}/case14/output.jpg`, prompt: '为文章内容生成信息图。要求：1.将内容翻译成英文，并提炼文章的关键信息 2.图中内容保持精简，只保留大标题 3.图中文字采用英文 4.加上丰富可爱的卡通人物和元素', promptEn: 'Generate infographic: translate to English, extract key info, keep concise, English text only, add cute cartoon characters', category: 'art', difficulty: 'medium', tags: ['信息图', '可视化', '文章'], author: '@黄建同学', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: false },
  {id: 15, title: '更换多种发型', titleEn: 'Multiple Hairstyles', description: '生成同一人物的9种不同发型', descriptionEn: 'Generate 9 different hairstyles for same person', inputImages: [`${BASE_URL}/case15/output.jpg`], outputImage: `${BASE_URL}/case15/output.jpg`, prompt: '以九宫格的方式生成这个人不同发型的头像', promptEn: 'Generate 3x3 grid of this person with different hairstyles', category: 'portrait', difficulty: 'easy', tags: ['发型', '九宫格', '变化'], author: '@balconychy', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: false },
  {id: 16, title: '模型标注讲解图', titleEn: 'Model Annotation Diagram', description: '3D模型标注解说图', descriptionEn: '3D model annotation explanation diagram', inputImages: [], outputImage: `${BASE_URL}/case16/output.jpg`, prompt: '绘制[3D人体器官模型展示示例心脏]用于学术展示，进行标注讲解，适用于展示其原理和[每个器官]的功能，非常逼真，高度还原，精细度非常细致的设计', promptEn: 'Draw [3D organ model] for academic display with annotations, showing principles and functions, highly realistic and detailed', category: 'art', difficulty: 'hard', tags: ['标注', '3D模型', '教学'], author: '@berryxia_ai', modelUsed: 'Gemini 2.5 Flash', requiresInput: false, featured: false },
  {id: 17, title: '定制大理石雕塑', titleEn: 'Custom Marble Sculpture', description: '将图片转换为大理石雕塑效果', descriptionEn: 'Convert image to marble sculpture effect', inputImages: [`${BASE_URL}/case17/output.jpg`], outputImage: `${BASE_URL}/case17/output.jpg`, prompt: '一张超详细的图像中主体雕塑的写实图像，由闪亮的大理石制成。雕塑应展示光滑反光的大理石表面，强调其光泽和艺术工艺。设计优雅，突出大理石的美丽和深度。图像中的光线应增强雕塑的轮廓和纹理，创造出视觉上令人惊叹和迷人的效果', promptEn: 'Hyper-detailed realistic marble sculpture image showing smooth reflective surface, emphasizing gloss and artistic craft', category: 'art', difficulty: 'medium', tags: ['雕塑', '大理石', '艺术'], author: '@umesh_ai', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: false },
  {id: 18, title: '根据食材做菜', titleEn: 'Cook from Ingredients', description: '根据食材图片生成成品菜肴', descriptionEn: 'Generate finished dish from ingredient images', inputImages: [`${BASE_URL}/case18/input1.jpg`], outputImage: `${BASE_URL}/case18/output1.jpg`, prompt: '用这些食材为我做一顿美味的午餐，放在盘子里，盘子的特写视图，移除其他盘子和食材', promptEn: 'Make delicious lunch with these ingredients, on plate, close-up view, remove other plates and ingredients', category: 'product', difficulty: 'medium', tags: ['美食', '创意', '食材'], author: '@Gdgtify', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: true },
  {id: 19, title: '数学题推理', titleEn: 'Math Problem Solving', description: 'AI解答数学题并标注答案', descriptionEn: 'AI solves math and annotates answers', inputImages: [`${BASE_URL}/case19/input.jpg`], outputImage: `${BASE_URL}/case19/output.jpg`, prompt: '根据问题将问题的答案写在对应的位置上', promptEn: 'Write answers in corresponding positions according to questions', category: 'edit', difficulty: 'medium', tags: ['数学', '推理', '标注'], author: '@Gorden Sun', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: false },
  {id: 20, title: '旧照片上色', titleEn: 'Colorize Old Photo', description: '为黑白老照片上色并修复', descriptionEn: 'Colorize and restore old B&W photos', inputImages: [`${BASE_URL}/case20/input.jpg`], outputImage: `${BASE_URL}/case20/output.jpg`, prompt: '修复并为这张照片上色', promptEn: 'Restore and colorize this photo', category: 'edit', difficulty: 'easy', tags: ['上色', '修复', '老照片'], author: '@GeminiApp', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: true },
  {id: 21, title: 'OOTD穿搭', titleEn: 'OOTD Outfit', description: '虚拟换装展示穿搭效果', descriptionEn: 'Virtual try-on showing outfit effect', inputImages: [`${BASE_URL}/case21/input.jpg`], outputImage: `${BASE_URL}/case21/output.jpg`, prompt: '选择图1中的人，让他们穿上图2中的所有服装和配饰。在户外拍摄一系列写实的OOTD风格照片，使用自然光线，时尚的街头风格，清晰的全身镜头。保持图1中人物的身份和姿势，但以连贯时尚的方式展示图2中的完整服装和配饰', promptEn: 'Select person from img1, dress them in all clothing and accessories from img2. Outdoor OOTD style photos, natural lighting, fashion street style, full body shots', category: 'portrait', difficulty: 'medium', tags: ['穿搭', 'OOTD', '时尚'], author: '@302.AI', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: false },
  {id: 22, title: '人物换衣', titleEn: 'Outfit Change', description: '替换人物服装保持其他不变', descriptionEn: 'Replace clothing while keeping everything else', inputImages: [`${BASE_URL}/case22/input.jpg`], outputImage: `${BASE_URL}/case22/output.jpg`, prompt: '将输入图像中人物的服装替换为参考图像中显示的目标服装。保持人物的姿势、面部表情、背景和整体真实感不变。让新服装看起来自然、合身，并与光线和阴影保持一致。不要改变人物的身份或环境——只改变衣服', promptEn: 'Replace clothing with target from reference. Keep pose, expression, background, realism unchanged. Make new clothes look natural, fitted, consistent with lighting', category: 'portrait', difficulty: 'medium', tags: ['换装', '服装', '虚拟试衣'], author: '@skirano', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: false },
  {id: 23, title: '多视图结果生成', titleEn: 'Multi-View Generation', description: '生成物体的6个视角（前后左右上下）', descriptionEn: 'Generate 6 views (front/back/left/right/top/bottom)', inputImages: [`${BASE_URL}/case23/input.jpg`], outputImage: `${BASE_URL}/case23/output.jpg`, prompt: '在白色背景上生成前、后、左、右、上、下视图。均匀分布。一致的主体。等距透视等效', promptEn: 'Generate front, back, left, right, top, bottom views on white background. Evenly distributed. Consistent subject. Isometric perspective equivalent', category: 'art', difficulty: 'hard', tags: ['多视图', '六视图', '3D'], author: '@Error_HTTP_404', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: true },
  {id: 24, title: '电影分镜', titleEn: 'Film Storyboard', description: '创建12格电影故事分镜', descriptionEn: 'Create 12-panel film storyboard', inputImages: [`${BASE_URL}/case24/input.jpg`], outputImage: `${BASE_URL}/case24/output.jpg`, prompt: '用这两个角色创作一个令人上瘾的12部分故事，包含12张图像，讲述经典的黑色电影侦探故事。故事关于他们寻找线索并最终发现的失落的宝藏。整个故事充满刺激，有情感的高潮和低谷，以精彩的转折和高潮结尾。不要在图像中包含任何文字或文本，纯粹通过图像本身讲述故事', promptEn: '12-part addictive story with 12 images, classic noir detective story about finding lost treasure. Emotional ups and downs, great twists. No text, tell through images only', category: 'art', difficulty: 'hard', tags: ['故事板', '电影', '叙事'], author: '@GeminiApp', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: true },
  {id: 25, title: '人物姿势修改', titleEn: 'Pose Modification', description: '修改人物视线方向和姿势', descriptionEn: 'Modify character gaze direction and pose', inputImages: [`${BASE_URL}/case25/input.jpg`], outputImage: `${BASE_URL}/case25/output.jpg`, prompt: '让图片中的人直视前方', promptEn: 'Make person in image look straight ahead', category: 'portrait', difficulty: 'easy', tags: ['姿势', '视线', '修改'], author: '@arrakis_ai', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: false },
  {id: 26, title: '线稿图生成图像', titleEn: 'Lineart to Image', description: '将线稿和参考图合成完整图像', descriptionEn: 'Compose lineart and reference into complete image', inputImages: [`${BASE_URL}/case26/input.jpg`], outputImage: `${BASE_URL}/case26/output.jpg`, prompt: '将图一人物换成图二姿势，专业摄影棚拍摄', promptEn: 'Replace figure 1 character with pose from figure 2, professional studio photography', category: 'art', difficulty: 'medium', tags: ['线稿', '姿势', '合成'], author: '@ZHO_ZHO_ZHO', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: false },
  {id: 27, title: '为图像添加水印', titleEn: 'Add Watermark', description: '在图片上反复覆盖文字水印', descriptionEn: 'Repeatedly overlay text watermark on image', inputImages: [`${BASE_URL}/case27/input.jpg`], outputImage: `${BASE_URL}/case27/output.jpg`, prompt: '在整个图片上反复覆盖"TRUMP"这个词', promptEn: 'Repeatedly overlay word "TRUMP" across entire image', category: 'edit', difficulty: 'easy', tags: ['水印', '文字', '覆盖'], author: '@AiMachete', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: false },
  {id: 28, title: '知识推理生成图像', titleEn: 'Knowledge Reasoning Image', description: '基于知识生成信息图表', descriptionEn: 'Generate infographic based on knowledge', inputImages: [], outputImage: `${BASE_URL}/case28/output.jpg`, prompt: '为我制作一张世界五座最高建筑的信息图 / 制作一张关于地球上最甜蜜事物的彩色信息图', promptEn: 'Make infographic of world\'s 5 tallest buildings / Make colorful infographic about sweetest things on Earth', category: 'art', difficulty: 'medium', tags: ['信息图', '知识', '可视化'], author: '@icreatelife', modelUsed: 'Gemini 2.5 Flash', requiresInput: false, featured: false },
  {id: 29, title: '红笔批注', titleEn: 'Red Pen Markup', description: 'AI分析图片并用红笔标注改进点', descriptionEn: 'AI analyzes image and marks improvements with red pen', inputImages: [`${BASE_URL}/case29/input.jpg`], outputImage: `${BASE_URL}/case29/output.jpg`, prompt: '分析这张图片。用红笔标出你可以改进的地方', promptEn: 'Analyze this image. Mark where you can improve with red pen', category: 'edit', difficulty: 'easy', tags: ['批注', '分析', '改进'], author: '@AiMachete', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: false },
  {id: 30, title: '爆炸的食物', titleEn: 'Exploding Food', description: '产品广告风格的食物爆炸效果', descriptionEn: 'Product ad style exploding food effect', inputImages: [`${BASE_URL}/case30/output.jpg`], outputImage: `${BASE_URL}/case30/output.jpg`, prompt: '在具有戏剧性的现代场景中拍摄该产品，并伴随着爆炸性的向外动态排列，主要成分新鲜和原始在产品周围飞舞，表明其新鲜度和营养价值。促销广告镜头，没有文字，强调产品，以关键品牌颜色作为背景', promptEn: 'Dramatic modern scene with product, explosive outward dynamic arrangement, fresh ingredients flying around showing freshness and nutrition. Promo ad shot, no text', category: 'product', difficulty: 'medium', tags: ['食物', '广告', '动态'], author: '@icreatelife', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: false },
  {id: 31, title: '制作漫画书', titleEn: 'Create Comic Book', description: '基于图片生成完整漫画故事', descriptionEn: 'Generate complete comic story from image', inputImages: [`${BASE_URL}/case31/input.jpg`], outputImage: `${BASE_URL}/case31/output.jpg`, prompt: '基于上传的图像，制作漫画书条幅，添加文字，写一个引人入胜的故事。我想要一本奇幻漫画书', promptEn: 'Based on uploaded image, create comic book strip, add text, write engaging story. I want fantasy comic book', category: 'art', difficulty: 'hard', tags: ['漫画', '故事', '叙事'], author: '@icreatelife', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: true },
  {id: 32, title: '动作人偶', titleEn: 'Action Figure', description: '创建主题动作人偶包装', descriptionEn: 'Create themed action figure packaging', inputImages: [`${BASE_URL}/case32/input.jpg`], outputImage: `${BASE_URL}/case32/output.jpg`, prompt: '制作一个写着["AI Evangelist - Kris"]的动作人偶，并包含[咖啡、乌龟、笔记本电脑、手机和耳机]', promptEn: 'Make action figure labeled "AI Evangelist - Kris" with coffee, turtle, laptop, phone and headphones', category: 'product', difficulty: 'medium', tags: ['手办', '动作人偶', '包装'], author: '@icreatelife', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: false },
  {id: 33, title: '地图生成等距建筑', titleEn: 'Map to Isometric Building', description: '将地图位置转换为等距游戏风格建筑', descriptionEn: 'Convert map location to isometric game-style building', inputImages: [`${BASE_URL}/case33/input.jpg`], outputImage: `${BASE_URL}/case33/output.jpg`, prompt: '以这个位置为地标，将其设为等距图像（仅建筑物），采用游戏主题公园的风格', promptEn: 'Take this location as landmark, make isometric image (buildings only), game theme park style', category: 'landscape', difficulty: 'hard', tags: ['等距', '地图', '游戏'], author: '@demishassabis', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: true },
  {id: 34, title: '参考图控制人物表情', titleEn: 'Reference-Controlled Expression', description: '使用参考图控制人物表情', descriptionEn: 'Control character expression using reference', inputImages: [`${BASE_URL}/case34/case.jpg`], outputImage: `${BASE_URL}/case34/case.jpg`, prompt: '图一人物参考/换成图二人物的表情', promptEn: 'Character reference from img1 / Replace with expression from img2', category: 'portrait', difficulty: 'medium', tags: ['表情', '控制', '参考图'], author: '@ZHO_ZHO_ZHO', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: false },
  {id: 35, title: '插画绘画过程四格', titleEn: 'Illustration Process 4 Steps', description: '展示插画从线稿到成品的4个步骤', descriptionEn: 'Show 4 steps from lineart to finished illustration', inputImages: [`${BASE_URL}/case35/case.jpg`], outputImage: `${BASE_URL}/case35/case.jpg`, prompt: '为人物生成绘画过程四宫格，第一步：线稿，第二步平铺颜色，第三步：增加阴影，第四步：细化成型。不要文字', promptEn: 'Generate 4-panel painting process: 1.lineart 2.flat colors 3.add shadows 4.refine. No text', category: 'art', difficulty: 'medium', tags: ['教程', '过程', '绘画'], author: '@ZHO_ZHO_ZHO', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: false },
  {id: 36, title: '虚拟试妆', titleEn: 'Virtual Makeup Try-On', description: '为人物换上参考图的妆容', descriptionEn: 'Apply reference makeup to person', inputImages: [`${BASE_URL}/case36/case.jpg`], outputImage: `${BASE_URL}/case36/case.jpg`, prompt: '为图一人物化上图二的妆，还保持图一的姿势', promptEn: 'Apply makeup from img2 to person in img1, keep original pose', category: 'portrait', difficulty: 'medium', tags: ['化妆', '试妆', '美妆'], author: '@ZHO_ZHO_ZHO', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: false },
  {id: 37, title: '妆面分析', titleEn: 'Makeup Analysis', description: '分析并标注妆容的改进点', descriptionEn: 'Analyze and mark makeup improvement points', inputImages: [`${BASE_URL}/case37/input.jpg`], outputImage: `${BASE_URL}/case37/output.jpg`, prompt: '分析这张图片。用红笔标出可以改进的地方', promptEn: 'Analyze this image. Use red pen to mark where improvements can be made', category: 'edit', difficulty: 'easy', tags: ['分析', '美妆', '标注'], author: '@ZHO_ZHO_ZHO', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: false },
  {id: 38, title: 'Google地图视角下的中土世界', titleEn: 'Middle-earth in Google Maps View', description: '用谷歌街景风格展示霍比特村', descriptionEn: 'Show Hobbiton in Google Street View style', inputImages: [], outputImage: `${BASE_URL}/case38/output.jpg`, prompt: '行车记录仪谷歌街景拍摄 | [霍比屯街道] | [霍比特人进行园艺和抽烟斗等日常活动] | [晴天]', promptEn: 'Dashcam Google Street View | [Hobbiton streets] | [Hobbits gardening and smoking pipes] | [Sunny day]', category: 'landscape', difficulty: 'medium', tags: ['街景', '奇幻', '谷歌地图'], author: '@TechHallo', modelUsed: 'Gemini 2.5 Flash', requiresInput: false, featured: true },
  {id: 39, title: '印刷插画生成', titleEn: 'Typography Illustration', description: '用文字字母组成创意插画', descriptionEn: 'Create illustration composed of text letters', inputImages: [], outputImage: `${BASE_URL}/case39/output.jpg`, prompt: '仅使用短语["riding a bike"]中的字母，创作一幅极简主义的黑白印刷插图，描绘骑自行车的场景。每个字母的形状和位置都应富有创意，以构成骑车人、自行车和动感。设计应简洁、极简，完全由修改后的["riding a bike"]字母组成，不添加任何额外的形状或线条', promptEn: 'Using only letters from phrase "riding a bike", create minimalist B&W print illustration depicting cycling scene. Letter shapes and positions should creatively form cyclist, bike and motion', category: 'art', difficulty: 'hard', tags: ['文字', '插画', '创意'], author: '@Umesh', modelUsed: 'Gemini 2.5 Flash', requiresInput: false, featured: false },
  {id: 40, title: '超多人物姿势生成', titleEn: 'Multiple Character Poses', description: '为角色生成丰富的姿势表', descriptionEn: 'Generate rich pose sheet for character', inputImages: [`${BASE_URL}/case40/case.jpg`], outputImage: `${BASE_URL}/case40/case.jpg`, prompt: '请为这幅插图创建一个姿势表，摆出各种姿势', promptEn: 'Create pose sheet for this illustration with various poses', category: 'art', difficulty: 'medium', tags: ['姿势表', '角色', '多样'], author: '@tapehead_Lab', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: false },
  {id: 41, title: '物品包装生成', titleEn: 'Product Packaging', description: '将图片贴在产品包装上展示', descriptionEn: 'Place image on product packaging for display', inputImages: [`${BASE_URL}/case41/case.jpg`], outputImage: `${BASE_URL}/case41/case.jpg`, prompt: '把图一贴在图二易拉罐上，并放在极简设计的布景中，专业摄影', promptEn: 'Paste img1 on can from img2, place in minimalist setting, professional photography', category: 'product', difficulty: 'medium', tags: ['包装', '产品', '摄影'], author: '@ZHO_ZHO_ZHO', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: false },
  {id: 42, title: '叠加滤镜/材质', titleEn: 'Overlay Filter/Material', description: '为照片叠加玻璃等材质效果', descriptionEn: 'Overlay glass and other material effects', inputImages: [`${BASE_URL}/case42/case.jpg`], outputImage: `${BASE_URL}/case42/case.jpg`, prompt: '为图一照片叠加上图二[玻璃]的效果', promptEn: 'Overlay [glass] effect from img2 onto photo in img1', category: 'edit', difficulty: 'easy', tags: ['滤镜', '材质', '玻璃'], author: '@ZHO_ZHO_ZHO', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: false },
  {id: 43, title: '控制人物脸型', titleEn: 'Control Face Shape', description: '按照参考图调整人物脸型', descriptionEn: 'Adjust face shape according to reference', inputImages: [`${BASE_URL}/case43/case.jpg`], outputImage: `${BASE_URL}/case43/case.jpg`, prompt: '图一人物按照图二的脸型设计为q版形象', promptEn: 'Design character from img1 as chibi version with face shape from img2', category: 'portrait', difficulty: 'medium', tags: ['脸型', 'Q版', '控制'], author: '@ZHO_ZHO_ZHO', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: false },
  {id: 44, title: '光影控制', titleEn: 'Lighting Control', description: '使用参考图控制光影效果', descriptionEn: 'Control lighting using reference', inputImages: [`${BASE_URL}/case44/case.jpg`], outputImage: `${BASE_URL}/case44/case.jpg`, prompt: '图一人物变成图二光影，深色为暗', promptEn: 'Transform img1 character to lighting from img2, dark areas as shadow', category: 'edit', difficulty: 'medium', tags: ['光影', '控制', '氛围'], author: '@ZHO_ZHO_ZHO', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: false },
  {id: 45, title: '乐高玩具小人', titleEn: 'LEGO Figure', description: '将人物转换为乐高小人包装', descriptionEn: 'Convert person to LEGO figure packaging', inputImages: [`${BASE_URL}/case45/input.jpg`], outputImage: `${BASE_URL}/case45/output.jpg`, prompt: '将照片中的人物转化为乐高小人包装盒的风格，以等距透视呈现。在包装盒上标注标题"ZHOGUE"。在盒内展示基于照片中人物的乐高小人，并配有他们必需的物品（如化妆品、包或其他物品）作为乐高配件。在盒子旁边，也展示实际乐高小人本身，未包装，以逼真且生动的方式渲染', promptEn: 'Transform photo character to LEGO figure packaging style, isometric perspective. Label "ZHOGUE" on box. Show LEGO figure with accessories, also display actual figure unpacked', category: 'product', difficulty: 'hard', tags: ['乐高', '玩具', '包装'], author: '@ZHO_ZHO_ZHO', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: true },
  {id: 46, title: '高达模型小人', titleEn: 'Gundam Model Kit', description: '将人物转换为高达风格模型套件', descriptionEn: 'Convert person to Gundam-style model kit', inputImages: [`${BASE_URL}/case46/input.jpg`], outputImage: `${BASE_URL}/case46/output.jpg`, prompt: '将照片中的人物转化为高达模型套件包装盒的风格。包装盒应类似真实的Gunpla盒子，包含技术插图、说明书风格细节和科幻字体。在盒子旁边，也展示实际的高达风格机械人本身', promptEn: 'Transform photo character to Gundam model kit packaging. Box should look like real Gunpla with technical illustrations, manual-style details. Show actual mecha figure beside box', category: 'product', difficulty: 'hard', tags: ['高达', 'Gundam', '模型'], author: '@ZHO_ZHO_ZHO', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: true },
  {id: 47, title: '硬件拆解图', titleEn: 'Hardware Exploded View', description: '数码相机硬件拆解展示图', descriptionEn: 'Digital camera hardware exploded view', inputImages: [], outputImage: `${BASE_URL}/case47/output.jpg`, prompt: '数码单反相机的分解图，展示了其所有配件和内部组件，例如镜头、滤镜、内部组件、镜头、传感器、螺丝、按钮、取景器、外壳和电路板。保留了数码单反相机的红色装饰', promptEn: 'DSLR camera exploded view showing all accessories and internal components: lens, filters, sensor, screws, buttons, viewfinder, shell, circuit board. Keep red accents', category: 'product', difficulty: 'hard', tags: ['拆解图', '硬件', '技术'], author: '@AIimagined', modelUsed: 'Gemini 2.5 Flash', requiresInput: false, featured: false },
  {id: 48, title: '食物卡路里标注', titleEn: 'Food Calorie Annotation', description: '智能标注食物的卡路里信息', descriptionEn: 'Intelligently annotate food calorie information', inputImages: [`${BASE_URL}/case48/output.jpg`], outputImage: `${BASE_URL}/case48/output.jpg`, prompt: '用食物名称、卡路里密度和近似卡路里来注释这顿饭', promptEn: 'Annotate this meal with food names, calorie density and approximate calories', category: 'edit', difficulty: 'easy', tags: ['食物', '卡路里', '标注'], author: '@icreatelife', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: false },
  {id: 49, title: '提取信息并放置透明图层', titleEn: 'Extract Object to Transparent', description: '提取对象并生成透明背景', descriptionEn: 'Extract object and generate transparent background', inputImages: [`${BASE_URL}/case49/input.jpg`], outputImage: `${BASE_URL}/case49/output.jpg`, prompt: '提取[武士]并放置透明背景', promptEn: 'Extract [samurai] and place on transparent background', category: 'edit', difficulty: 'easy', tags: ['提取', '透明', '抠图'], author: '@nglprz', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: false },
  {id: 50, title: '图像外扩修复', titleEn: 'Outpainting Restoration', description: '修复图片的棋盘格未知区域', descriptionEn: 'Restore checkerboard unknown areas', inputImages: [`${BASE_URL}/case50/input.jpg`], outputImage: `${BASE_URL}/case50/output.jpg`, prompt: '将图像的棋盘格部分进行修复，恢复为完整图像', promptEn: 'Restore checkerboard portions of image to complete image', category: 'edit', difficulty: 'medium', tags: ['修复', '外扩', '补全'], author: '@bwabbage', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: true },
  // === 案例51-110：基于原README精确添加 ===
  {id: 51, title: '古老地图生成古代场景', titleEn: 'Ancient Map to Scene', description: '将古代地图转换为彩色历史场景', descriptionEn: 'Convert ancient map to colorful historical scene', inputImages: [`${BASE_URL}/case51/input.jpg`], outputImage: `${BASE_URL}/case51/output.jpg`, prompt: '全彩照片。1660年的新阿姆斯特丹', promptEn: 'Full color photo. New Amsterdam in 1660', category: 'landscape', difficulty: 'hard', tags: ['历史', '地图', '场景重建'], author: '@levelsio', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: true },
  {id: 52, title: '时尚服装拼贴画', titleEn: 'Fashion Mood Board', description: '创建时尚情绪板拼贴画', descriptionEn: 'Create fashion mood board collage', inputImages: [`${BASE_URL}/case52/input.jpg`], outputImage: `${BASE_URL}/case52/output.jpg`, prompt: '时尚情绪板拼贴画。用模特所穿单品的剪纸图案围绕肖像画', promptEn: 'Fashion mood board. Surround portrait with cutout patterns of worn items', category: 'art', difficulty: 'medium', tags: ['时尚', '拼贴', '情绪板'], author: '@tetumemo', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: false },
  {id: 53, title: '精致可爱的产品照片', titleEn: 'Miniature Product Photo', description: '手持微型产品的广告照片', descriptionEn: 'Ad photo holding miniature product', inputImages: [], outputImage: `${BASE_URL}/case53/output.jpg`, prompt: '一张高分辨率广告照片，一位男士用拇指和食指精心握着一件逼真的微型产品', promptEn: 'High-res ad photo, man holding miniature product with thumb and forefinger', category: 'product', difficulty: 'medium', tags: ['产品', '微型', '创意'], author: '@azed_ai', modelUsed: 'Gemini 2.5 Flash', requiresInput: false, featured: false },
  {id: 54, title: '动漫雕像放入现实', titleEn: 'Anime Statue in Reality', description: '在真实城市中放置巨型动漫雕像', descriptionEn: 'Place giant anime statue in real city', inputImages: [`${BASE_URL}/case54/input.jpg`], outputImage: `${BASE_URL}/case54/output.jpg`, prompt: '一幅写实的摄影作品。这个人的巨型雕像被安放在东京市中心的广场上', promptEn: 'Realistic photography. Giant statue placed in Tokyo downtown plaza', category: 'landscape', difficulty: 'hard', tags: ['雕像', '场景融合', '巨大化'], author: '@riddi0908', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: true },
  {id: 55, title: '痛车制作', titleEn: 'Itasha Car', description: '制作动漫角色主题痛车', descriptionEn: 'Create anime character themed itasha', inputImages: [`${BASE_URL}/case55/input.jpg`], outputImage: `${BASE_URL}/case55/output.jpg`, prompt: '打造一张专业的跑车照片，以动漫风格的人物图案作为"痛车"的设计', promptEn: 'Professional sports car photo with anime-style character design as itasha', category: 'product', difficulty: 'hard', tags: ['痛车', '动漫', '汽车'], author: '@riddi0908', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: true },
  {id: 56, title: '漫画构图', titleEn: 'Comic Composition', description: '使用参考构图创建漫画场景', descriptionEn: 'Create comic scene using reference', inputImages: [`${BASE_URL}/case56/input.jpg`], outputImage: `${BASE_URL}/case56/output.jpg`, prompt: '使用人物和场景参考图', promptEn: 'Use character and scene reference', category: 'art', difficulty: 'medium', tags: ['漫画', '构图', '场景'], author: '@namaedousiyoka', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: false },
  {id: 57, title: '漫画风格转换', titleEn: 'Comic Style Conversion', description: '将图片转换为黑白漫画线稿', descriptionEn: 'Convert image to B&W comic lineart', inputImages: [`${BASE_URL}/case57/input.jpg`], outputImage: `${BASE_URL}/case57/output.jpg`, prompt: '将输入的图片处理为黑白漫画风格线稿', promptEn: 'Process as B&W comic style lineart', category: 'art', difficulty: 'easy', tags: ['漫画', '线稿', '黑白'], author: '@nobisiro_2023', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: false },
  {id: 58, title: '等距全息投影图', titleEn: 'Isometric Hologram', description: '将线稿转换为全息投影效果', descriptionEn: 'Convert lineart to holographic effect', inputImages: [`${BASE_URL}/case58/input.jpg`], outputImage: `${BASE_URL}/case58/output.jpg`, prompt: '根据上传的图像，仅用线框进行全息化', promptEn: 'Create hologram using wireframes only', category: 'art', difficulty: 'medium', tags: ['全息', '等距', '线框'], author: '@tetumemo', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: false },
  {id: 59, title: 'Minecraft风格场景', titleEn: 'Minecraft Style Scene', description: '地图转Minecraft等距风格', descriptionEn: 'Map to Minecraft isometric style', inputImages: [`${BASE_URL}/case59/input.jpg`], outputImage: `${BASE_URL}/case59/output.jpg`, prompt: '使用此位置将地标制作成Minecraft的HD-2D风格', promptEn: 'Create landmark in Minecraft HD-2D style', category: 'landscape', difficulty: 'hard', tags: ['Minecraft', '游戏', '等距'], author: '@tetumemo', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: true },
  {id: 60, title: '材质球赋予材质', titleEn: 'Material Ball to Object', description: '将材质球的材质应用到logo', descriptionEn: 'Apply material ball texture to logo', inputImages: [`${BASE_URL}/case60/case.jpg`], outputImage: `${BASE_URL}/case60/case.jpg`, prompt: '将图2的材质用在图1的logo上，3d立体呈现', promptEn: 'Apply material from img2 to logo, 3D presentation', category: 'art', difficulty: 'hard', tags: ['材质', '3D', '渲染'], author: '@ZHO_ZHO_ZHO', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: false },
  {id: 61, title: '平面图3D渲染', titleEn: 'Floor Plan to 3D', description: '将平面图转换为3D等距渲染', descriptionEn: 'Convert floor plan to 3D isometric render', inputImages: [`${BASE_URL}/case61/input.jpg`], outputImage: `${BASE_URL}/case61/output.jpg`, prompt: '把这个住宅平面图转换为房屋的等距照片级真实感3D渲染', promptEn: 'Convert floor plan to isometric photorealistic 3D render', category: 'landscape', difficulty: 'hard', tags: ['平面图', '3D', '建筑'], author: '@op7418', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: true },
  {id: 62, title: '重置相机参数', titleEn: 'Reset Camera Parameters', description: '使用指定相机参数重拍照片', descriptionEn: 'Re-shoot with specified camera parameters', inputImages: [`${BASE_URL}/case62/input.jpg`], outputImage: `${BASE_URL}/case62/output.jpg`, prompt: 'RAW-ISO[100]-[F28-1/200 24mm]设置', promptEn: 'RAW-ISO[100]-[F28-1/200 24mm] settings', category: 'edit', difficulty: 'medium', tags: ['相机', '参数', '摄影'], author: '@hckinz', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: false },
  {id: 63, title: '制作证件照', titleEn: 'ID Photo Creation', description: '制作标准证件照（蓝底、正装）', descriptionEn: 'Create standard ID photo', inputImages: [`${BASE_URL}/case63/input.jpg`], outputImage: `${BASE_URL}/case63/output.jpg`, prompt: '截取图片人像头部，帮我做成2寸证件照。蓝底、职业正装', promptEn: 'Extract head, make 2-inch ID photo. Blue bg, professional attire', category: 'portrait', difficulty: 'easy', tags: ['证件照', '标准照', '蓝底'], author: '@songguoxiansen', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: false },
  {id: 64, title: '场景A6折叠卡', titleEn: 'Scene A6 Folding Card', description: '创建3D折叠卡片场景', descriptionEn: 'Create 3D folding card scene', inputImages: [`${BASE_URL}/case64/input.jpg`], outputImage: `${BASE_URL}/case64/output.jpg`, prompt: '绘制一个A6折叠卡：打开时展示一个完整的3D球形小屋', promptEn: 'Draw A6 folding card showing 3D spherical cottage', category: 'art', difficulty: 'hard', tags: ['折叠卡', '3D', '创意'], author: '@Gdgtify', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: false },
  {id: 65, title: '设计国际象棋', titleEn: 'Chess Set Design', description: '设计受图片启发的3D打印棋子', descriptionEn: 'Design 3D printed chess pieces', inputImages: [`${BASE_URL}/case65/case.jpg`], outputImage: `${BASE_URL}/case65/case.jpg`, prompt: '绘制一个棋盘和受此图片启发的3D打印棋子', promptEn: 'Draw chessboard and 3D printed chess pieces inspired by this', category: 'product', difficulty: 'hard', tags: ['象棋', '3D打印', '设计'], author: '@Gdgtify', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: false },
  {id: 66, title: '分割对照样式照片', titleEn: 'Split Comparison Photo', description: '同一房间的时代对比', descriptionEn: 'Same room era comparison', inputImages: [`${BASE_URL}/case66/case.jpg`], outputImage: `${BASE_URL}/case66/case.jpg`, prompt: '一张卧室的照片，从中间分开，左边是2018年，右边是1964年', promptEn: 'Bedroom photo split, left 2018, right 1964', category: 'edit', difficulty: 'medium', tags: ['对比', '时代', '分割'], author: '@fofrAI', modelUsed: 'Gemini 2.5 Flash', requiresInput: false, featured: false },
  {id: 67, title: '珠宝首饰设计', titleEn: 'Jewelry Design Series', description: '将图片转换为5件首饰系列', descriptionEn: 'Convert to 5-piece jewelry series', inputImages: [`${BASE_URL}/case67/input.jpg`], outputImage: `${BASE_URL}/case67/output.jpg`, prompt: '将这张图像变成一条包含5件首饰的系列', promptEn: 'Transform into 5-piece jewelry collection', category: 'product', difficulty: 'medium', tags: ['珠宝', '首饰', '设计'], author: '@Gdgtify', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: false },
  {id: 68, title: '周边设计', titleEn: 'Merchandise Design', description: '用角色图像创建商品周边', descriptionEn: 'Create merchandise from character', inputImages: [`${BASE_URL}/case68/input.jpg`], outputImage: `${BASE_URL}/case68/output.jpg`, prompt: '用这个角色图像创建商品', promptEn: 'Create merchandise with this character', category: 'product', difficulty: 'easy', tags: ['周边', '商品', '角色'], author: '@0xFramer', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: false },
  {id: 69, title: '模型全息投影', titleEn: 'Model Hologram Projection', description: '创建全息投影仪展示效果', descriptionEn: 'Create holographic projector display', inputImages: [`${BASE_URL}/case69/output.png`], outputImage: `${BASE_URL}/case69/output.png`, prompt: '超逼真的产品照片。虚拟全息角色悬浮于圆形全息投影仪上方', promptEn: 'Hyper-realistic product photo. Virtual holographic character floating above projector', category: 'art', difficulty: 'hard', tags: ['全息', '投影', '科技'], author: '@UNIBRACITY', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: true },
  {id: 70, title: '巨型人物脚手架', titleEn: 'Giant Person Scaffolding', description: '巨型人物被脚手架包围建造中', descriptionEn: 'Giant person surrounded by scaffolding', inputImages: [`${BASE_URL}/case70/input.png`], outputImage: `${BASE_URL}/case70/output.png`, prompt: '图片中人物站着的超写实3D渲染图。巨型人物全身环绕着庞大的脚手架', promptEn: 'Hyper-realistic 3D render of person. Giant person surrounded by massive scaffolding', category: 'art', difficulty: 'hard', tags: ['巨大化', '脚手架', '创意'], author: '@songguoxiansen', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: true },
  {id: 71, title: '遥感影像建筑物提取', titleEn: 'Satellite Building Extraction', description: '从遥感图像中提取建筑物', descriptionEn: 'Extract buildings from satellite imagery', inputImages: [`${BASE_URL}/case71/input.png`], outputImage: `${BASE_URL}/case71/output.png`, prompt: '删除影像中除建筑以外的地方', promptEn: 'Delete everything except buildings', category: 'edit', difficulty: 'medium', tags: ['遥感', '提取', '建筑'], author: '@lehua555', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: false },
  {id: 72, title: '部件提取', titleEn: 'Component Extraction', description: '切割模型部件制作组件表', descriptionEn: 'Cut model parts to create component sheet', inputImages: [`${BASE_URL}/case72/input.png`], outputImage: `${BASE_URL}/case72/output.png`, prompt: '将各部件切割出来，制作成保留有全息图的模型表', promptEn: 'Cut out each component, create model sheet with holographic effects', category: 'art', difficulty: 'hard', tags: ['拆解', '组件', '模型'], author: '@tetumemo', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: false },
  {id: 73, title: '移除汉堡的配料', titleEn: 'Remove Burger Ingredients', description: '移除汉堡中所有配料只留面包', descriptionEn: 'Remove all ingredients leaving only buns', inputImages: [`${BASE_URL}/case73/input.jpg`], outputImage: `${BASE_URL}/case73/output.jpg`, prompt: '把汉堡里的所有配料都取出来，只留下上下两片面包', promptEn: 'Remove all burger ingredients, keep only top and bottom buns', category: 'edit', difficulty: 'medium', tags: ['移除', '食物', '创意'], author: '@bind_lux', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: false },
  {id: 74, title: '图像高清修复', titleEn: 'Image HD Restoration', description: '增强分辨率并重新诠释', descriptionEn: 'Enhance resolution and reinterpret', inputImages: [`${BASE_URL}/case74/input.png`], outputImage: `${BASE_URL}/case74/output.png`, prompt: '增强这张老图像的分辨率并添加适当的纹理细节', promptEn: 'Enhance resolution and add texture details', category: 'edit', difficulty: 'medium', tags: ['高清', '修复', '增强'], author: '@op7418', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: false },
  {id: 75, title: '图片生成微缩场景', titleEn: 'Miniature Scene Generation', description: '将图片转换为等距微缩视图', descriptionEn: 'Convert image to isometric miniature view', inputImages: [`${BASE_URL}/case75/input.png`], outputImage: `${BASE_URL}/case75/output.png`, prompt: '将图像转换为等距视图', promptEn: 'Convert image to isometric view', category: 'landscape', difficulty: 'medium', tags: ['微缩', '等距', 'Tilt-shift'], author: '@techhalla', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: false },
  {id: 76, title: '科普漫画', titleEn: 'Educational Comic', description: '生成教育用途的涂鸦风格漫画', descriptionEn: 'Generate doodle-style comics for education', inputImages: [], outputImage: `${BASE_URL}/case76/output.png`, prompt: '请帮我生成多张16:9的涂鸦风格图片，向中学生解释概念', promptEn: 'Generate 16:9 doodle-style images explaining concepts to middle schoolers', category: 'art', difficulty: 'medium', tags: ['教育', '漫画', '科普'], author: '@op7418', modelUsed: 'Gemini 2.5 Flash', requiresInput: false, featured: false },
  {id: 77, title: '自定义人物表情包', titleEn: 'Custom Character Stickers', description: '生成多个自定义表情包', descriptionEn: 'Generate multiple custom stickers', inputImages: [`${BASE_URL}/case77/input.png`], outputImage: `${BASE_URL}/case77/output.png`, prompt: '用图2形象，参图一的各种姿势生成表情包', promptEn: 'Use img2 character, reference img1 poses, generate stickers', category: 'portrait', difficulty: 'medium', tags: ['表情包', '贴纸', '自定义'], author: '@vista8', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: false },
  {id: 78, title: '恢复被吃的食物', titleEn: 'Restore Eaten Food', description: '将吃了一半的食物恢复完整', descriptionEn: 'Restore half-eaten food to complete', inputImages: [`${BASE_URL}/case78/input.png`], outputImage: `${BASE_URL}/case78/output.png`, prompt: '将这个吃了一半的食物恢复到吃之前的状态', promptEn: 'Restore this half-eaten food to pre-eating state', category: 'edit', difficulty: 'easy', tags: ['恢复', '食物', '创意'], author: '@googlejapan', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: false },
  {id: 79, title: '格斗游戏界面', titleEn: 'Fighting Game UI', description: '创建格斗游戏对战界面', descriptionEn: 'Create fighting game battle UI', inputImages: [`${BASE_URL}/case79/input.png`], outputImage: `${BASE_URL}/case79/output.png`, prompt: '创建一个中速动作场景，两个主体摆出武术格斗姿势', promptEn: 'Create medium-speed action scene, two subjects in martial arts fighting poses', category: 'art', difficulty: 'hard', tags: ['游戏UI', '格斗', '界面'], author: '@NanoBanana_labs', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: true },
  {id: 80, title: '切割模型', titleEn: 'Cut Model', description: '创建汽车剖面图展示内部结构', descriptionEn: 'Create car cutaway showing internal structure', inputImages: [`${BASE_URL}/case80/input.png`], outputImage: `${BASE_URL}/case80/output.png`, prompt: '创建这辆车的剖面图，一侧显示完整的外部结构，另一侧显示内部发动机', promptEn: 'Create cutaway, one side showing exterior, other showing internal engine', category: 'product', difficulty: 'hard', tags: ['剖面', '汽车', '技术图'], author: '@old_pgmrs_will', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: false },
  {id: 81, title: '海盗通缉书', titleEn: 'Pirate Wanted Poster', description: '制作海盗风格通缉令', descriptionEn: 'Create pirate-style wanted poster', inputImages: [`${BASE_URL}/case81/input.png`], outputImage: `${BASE_URL}/case81/output.png`, prompt: '在羊皮纸上重新绘制一张海盗通缉令', promptEn: 'Redraw pirate wanted poster on parchment', category: 'art', difficulty: 'medium', tags: ['海盗', '通缉令', '创意'], author: '@AI_Kei75', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: false },
  {id: 82, title: '周边展示货架', titleEn: 'Merchandise Display Shelf', description: '便利店风格的周边商品展示', descriptionEn: 'Convenience store style merchandise display', inputImages: [`${BASE_URL}/case82/input.png`], outputImage: `${BASE_URL}/case82/output.png`, prompt: '移除背景，制作成周边商品。地点：日本便利店货架', promptEn: 'Remove background, create merchandise. Location: Japan convenience store shelf', category: 'product', difficulty: 'hard', tags: ['周边', '展示', '商品'], author: '@tokyo_Valentine', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: false },
  {id: 83, title: '漫展展台', titleEn: 'Comic Market Booth', description: '漫画市集展台布置', descriptionEn: 'Comic market booth setup', inputImages: [`${BASE_URL}/case83/input.png`], outputImage: `${BASE_URL}/case83/output.png`, prompt: '擦除背景，将人物替换为Cosplayer和角色周边。地点：漫画市集', promptEn: 'Erase background, replace with Cosplayer and character merchandise. Comic market booth', category: 'product', difficulty: 'hard', tags: ['漫展', '展台', 'Cosplay'], author: '@tokyo_Valentine', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: false },
  {id: 84, title: '线稿转涂鸦画', titleEn: 'Lineart to Doodle', description: '将线稿转换为儿童涂鸦风格', descriptionEn: 'Convert lineart to children doodle style', inputImages: [`${BASE_URL}/case84/input.png`], outputImage: `${BASE_URL}/case84/output.png`, prompt: '我上传的图画书看起来就像是一个五岁小孩画的', promptEn: 'Make picture book look like drawn by 5-year-old', category: 'art', difficulty: 'easy', tags: ['涂鸦', '儿童画', '简化'], author: '@hAru_mAki_ch', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: false },
  {id: 85, title: '现代美术展览空间', titleEn: 'Art Exhibition Space', description: '创建前卫当代艺术展览空间', descriptionEn: 'Create avant-garde art exhibition space', inputImages: [`${BASE_URL}/case85/output.png`], outputImage: `${BASE_URL}/case85/output.png`, prompt: '一个前卫当代艺术展览空间。展厅将建筑、灯光融入到艺术作品', promptEn: 'Avant-garde art exhibition space. Hall integrates architecture, lighting into artwork', category: 'landscape', difficulty: 'hard', tags: ['展览', '艺术空间', '概念'], author: '@UNIBRACITY', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: true },
  {id: 86, title: '暗黑哥特塔罗牌', titleEn: 'Dark Gothic Tarot', description: '生成暗黑哥特风格塔罗牌', descriptionEn: 'Generate dark gothic style tarot', inputImages: [`${BASE_URL}/case86/output.png`], outputImage: `${BASE_URL}/case86/output.png`, prompt: '根据这张图片，生成一张暗黑哥特式塔罗牌', promptEn: 'Based on this image, generate dark gothic tarot card', category: 'art', difficulty: 'hard', tags: ['塔罗牌', '哥特', '神秘'], author: '@ImperfectEngel', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: false },
  {id: 87, title: '黑白进化图', titleEn: 'B&W Evolution Diagram', description: '创建从猿到人再到香蕉的进化图', descriptionEn: 'Create evolution from ape to human to banana', inputImages: [], outputImage: `${BASE_URL}/case87/output.png`, prompt: '生成进化的行进图，极简黑白风格', promptEn: 'Generate evolution march diagram, minimalist B&W style', category: 'art', difficulty: 'easy', tags: ['进化', '黑白', '幽默'], author: '@ZHO_ZHO_ZHO', modelUsed: 'Gemini 2.5 Flash', requiresInput: false, featured: false },
  {id: 88, title: '玻璃瓶纪念品', titleEn: 'Glass Bottle Souvenir', description: '在玻璃瓶中的微型人偶场景', descriptionEn: 'Miniature figure scene in glass bottle', inputImages: [`${BASE_URL}/case88/output.png`], outputImage: `${BASE_URL}/case88/output.png`, prompt: '1/7比例人偶。整个展示被封装在透明的纪念品玻璃瓶中', promptEn: '1/7 scale figure. Display encapsulated in transparent souvenir glass bottle', category: 'product', difficulty: 'hard', tags: ['微缩', '玻璃瓶', '手办'], author: '@NanoBanana_labs', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: false },
  {id: 89, title: '微型商店', titleEn: 'Miniature Store', description: '软陶材质的微型店铺模型', descriptionEn: 'Clay miniature store model', inputImages: [], outputImage: `${BASE_URL}/case89/output.png`, prompt: '品牌的微型立体模型店。手工软陶造型', promptEn: 'Brand miniature diorama store. Clay handmade', category: 'product', difficulty: 'medium', tags: ['微型', '软陶', '模型'], author: '@NanoBanana_labs', modelUsed: 'Gemini 2.5 Flash', requiresInput: false, featured: false },
  {id: 90, title: '成为Vtuber', titleEn: 'Become Vtuber', description: '创建虚拟主播直播画面', descriptionEn: 'Create virtual streamer live broadcast', inputImages: [`${BASE_URL}/case90/input.png`], outputImage: `${BASE_URL}/case90/output.png`, prompt: '使用原图创建一个虚拟Vtuber及其直播画面', promptEn: 'Create virtual Vtuber and streaming screen from original', category: 'art', difficulty: 'hard', tags: ['Vtuber', '直播', '虚拟主播'], author: '@AI_Kei75', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: true },
  {id: 91, title: '车站电影海报', titleEn: 'Station Movie Poster', description: '在地铁站展示的电影海报', descriptionEn: 'Movie poster displayed in subway station', inputImages: [`${BASE_URL}/case91/input.png`], outputImage: `${BASE_URL}/case91/output.png`, prompt: '使用原图制作电影海报。海报贴在日本车站地下通道', promptEn: 'Create movie poster. Poster in Japan station underground passage', category: 'art', difficulty: 'hard', tags: ['电影', '海报', '地铁'], author: '@AI_Kei75', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: false },
  {id: 92, title: '电影休息室', titleEn: 'Cinema Lobby', description: '电影院爆米花摊主题空间', descriptionEn: 'Cinema popcorn stand themed space', inputImages: [`${BASE_URL}/case92/input.jpg`], outputImage: `${BASE_URL}/case92/output.jpg`, prompt: '一个逼真的电影院休息区爆米花摊。角色扮演者置于中心', promptEn: 'Realistic cinema lobby popcorn stand. Cosplayer at center', category: 'product', difficulty: 'hard', tags: ['电影院', '主题空间', '周边'], author: '@tokyo_Valentine', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: false },
  {id: 93, title: '切割带卡通爆炸效果', titleEn: 'Cut with Cartoon Explosion', description: '物体从中间切开带卡通核爆效果', descriptionEn: 'Object cut in middle with cartoon nuclear explosion', inputImages: [`${BASE_URL}/case93/case.jpg`], outputImage: `${BASE_URL}/case93/case.jpg`, prompt: '将物体从中间干净利落地切开，两半之间是一个风格化的卡通核爆效果', promptEn: 'Cut object cleanly in middle, stylized cartoon nuclear explosion between halves', category: 'art', difficulty: 'hard', tags: ['切割', '爆炸', '卡通'], author: '@Arminn_Ai', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: true },
  {id: 94, title: '卡通人物主题火车', titleEn: 'Character Themed Train', description: '火车内部的角色主题布置', descriptionEn: 'Character-themed interior of train', inputImages: [`${BASE_URL}/case94/output.jpg`], outputImage: `${BASE_URL}/case94/output.jpg`, prompt: '逼真的东京列车内部。整个车厢布置了角色广告和周边', promptEn: 'Realistic Tokyo train interior. Entire car decorated with character ads', category: 'product', difficulty: 'hard', tags: ['火车', '主题', '广告'], author: '@tokyo_Valentine', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: false },
  {id: 95, title: '自定义主题公园', titleEn: 'Custom Theme Park', description: '基于角色创建主题公园', descriptionEn: 'Create theme park based on character', inputImages: [`${BASE_URL}/case95/input.jpg`], outputImage: `${BASE_URL}/case95/output.jpg`, prompt: '生成基于原图的逼真主题公园图像。白天，阳光明媚', promptEn: 'Generate realistic theme park based on original. Daytime, sunny', category: 'landscape', difficulty: 'hard', tags: ['主题公园', '场景', '游乐'], author: '@AI_Kei75', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: true },
  {id: 96, title: '创建星座图', titleEn: 'Create Constellation', description: '基于图片创建虚构星座', descriptionEn: 'Create fictional constellation from image', inputImages: [`${BASE_URL}/case96/input.jpg`], outputImage: `${BASE_URL}/case96/output.jpg`, prompt: '根据原图创建虚构星座的图像。星夜背景逼真', promptEn: 'Create fictional constellation from original. Realistic starry night', category: 'art', difficulty: 'medium', tags: ['星座', '创意', '天文'], author: '@AI_Kei75', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: false },
  {id: 97, title: '图片变手机壁纸', titleEn: 'Image to Phone Wallpaper', description: '转换为iPhone锁屏壁纸', descriptionEn: 'Convert to iPhone lock screen wallpaper', inputImages: [`${BASE_URL}/case97/case.jpg`], outputImage: `${BASE_URL}/case97/case.jpg`, prompt: '将图片转换为iPhone锁屏壁纸效果', promptEn: 'Convert to iPhone lock screen wallpaper', category: 'edit', difficulty: 'easy', tags: ['壁纸', 'iPhone', '锁屏'], author: '@ZHO_ZHO_ZHO', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: false },
  {id: 98, title: '制作电影海报', titleEn: 'Create Movie Poster', description: 'AI自动分析并生成电影海报', descriptionEn: 'AI auto-analyzes and generates movie poster', inputImages: [`${BASE_URL}/case98/output.jpg`], outputImage: `${BASE_URL}/case98/output.jpg`, prompt: '分析上传的照片，自动将照片归类到合适的电影类型并生成海报', promptEn: 'Analyze photo, auto-categorize to film genre and generate poster', category: 'art', difficulty: 'hard', tags: ['电影', '海报', 'AI分析'], author: '@aiehon_aya', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: false },
  {id: 99, title: '将X账户变成软盘', titleEn: 'X Account to Floppy Disk', description: '将社交媒体账户制作成复古软盘', descriptionEn: 'Make social media account into retro floppy disk', inputImages: [`${BASE_URL}/case99/output.jpg`], outputImage: `${BASE_URL}/case99/output.jpg`, prompt: '把我的X账户做成90年代软盘', promptEn: 'Make my X account into 90s floppy disk', category: 'art', difficulty: 'easy', tags: ['复古', '软盘', '创意'], author: '@icreatelife', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: false },
  {id: 100, title: '将参考图像变为透明物体', titleEn: 'Make Object Transparent', description: '使对象变成透明玻璃效果', descriptionEn: 'Make object transparent glass effect', inputImages: [`${BASE_URL}/case100/input.jpg`], outputImage: `${BASE_URL}/case100/output.jpg`, prompt: '使该对象透明', promptEn: 'Make this object transparent', category: 'edit', difficulty: 'easy', tags: ['透明', '玻璃', '特效'], author: '@icreatelife', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: false },
  {id: 101, title: '鱼眼镜头视角', titleEn: 'Fisheye Lens View', description: '窥视孔鱼眼镜头效果', descriptionEn: 'Peephole fisheye lens effect', inputImages: [`${BASE_URL}/case101/input.jpg`], outputImage: `${BASE_URL}/case101/output.jpg`, prompt: '超高细节动漫插画，采用鱼眼镜头窥视孔视角', promptEn: 'Ultra-detailed anime illustration, fisheye peephole view', category: 'art', difficulty: 'hard', tags: ['鱼眼', '窥视孔', '创意'], author: '@emakiscroll', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: false },
  {id: 102, title: '超级英雄室内设计', titleEn: 'Superhero Interior Design', description: '超级英雄主题的室内设计', descriptionEn: 'Superhero-themed interior design', inputImages: [], outputImage: `${BASE_URL}/case102/output.jpg`, prompt: '展示以超级英雄为灵感的现代客厅', promptEn: 'Show modern living room inspired by superhero', category: 'landscape', difficulty: 'hard', tags: ['室内设计', '超级英雄', '主题'], author: '@IqraSaifiii', modelUsed: 'Gemini 2.5 Flash', requiresInput: false, featured: false },
  {id: 103, title: '自定义娃娃机', titleEn: 'Custom Claw Machine', description: '角色主题的UFO抓娃娃机', descriptionEn: 'Character-themed UFO claw machine', inputImages: [`${BASE_URL}/case103/input.jpg`], outputImage: `${BASE_URL}/case103/output.jpg`, prompt: '生成该动物简化为动漫风格毛绒玩具，放置在UFO捞娃娃机中', promptEn: 'Generate animal simplified to anime plush toy in UFO claw machine', category: 'product', difficulty: 'medium', tags: ['娃娃机', '毛绒', '游戏'], author: '@googlejapan', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: false },
  {id: 104, title: '字体logo设计', titleEn: 'Typography Logo Design', description: '文字本身构成形状的logo', descriptionEn: 'Logo where text itself forms shape', inputImages: [], outputImage: `${BASE_URL}/case104/output.jpg`, prompt: '创建一个形状的文字插画，文字本身构成该形状', promptEn: 'Create text illustration in shape, text itself forming shape', category: 'art', difficulty: 'medium', tags: ['文字', 'logo', '创意'], author: '@aziz4ai', modelUsed: 'Gemini 2.5 Flash', requiresInput: false, featured: false },
  {id: 105, title: '游戏角色状态界面', titleEn: 'RPG Character Status UI', description: 'RPG游戏角色状态界面', descriptionEn: 'RPG game character status interface', inputImages: [`${BASE_URL}/case105/input.jpg`], outputImage: `${BASE_URL}/case105/output.jpg`, prompt: '使用原图中的角色创建一个RPG游戏角色状态界面', promptEn: 'Create RPG character status interface using character from original', category: 'art', difficulty: 'hard', tags: ['游戏UI', 'RPG', '状态界面'], author: '@AI_Kei75', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: true },
  {id: 106, title: '文字转象形图', titleEn: 'Text to Pictogram', description: '将文字说明转换为象形图', descriptionEn: 'Convert text description to pictogram', inputImages: [`${BASE_URL}/case106/input.jpg`], outputImage: `${BASE_URL}/case106/output.jpg`, prompt: '将此说明图转换为象形图', promptEn: 'Convert this description diagram to pictogram', category: 'art', difficulty: 'medium', tags: ['象形图', '可视化', '图形'], author: '@nobisiro_2023', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: false },
  {id: 107, title: '数位板上的绘画', titleEn: 'Digital Painting on Tablet', description: '展示数位板绘画过程', descriptionEn: 'Show digital tablet painting process', inputImages: [`${BASE_URL}/case107/input.jpg`], outputImage: `${BASE_URL}/case107/output.jpg`, prompt: '超逼真的手绘板屏幕图像，真实的第一人称视角', promptEn: 'Hyper-realistic drawing tablet screen, first-person view', category: 'art', difficulty: 'hard', tags: ['数位板', '绘画过程', '教程'], author: '@AI_Kei75', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: true },
  {id: 108, title: '创建Line印章图片', titleEn: 'Create LINE Stamps', description: '创建Line风格表情印章', descriptionEn: 'Create LINE-style emoji stamps', inputImages: [`${BASE_URL}/case108/input1.jpg`], outputImage: `${BASE_URL}/case108/output.jpg`, prompt: '角色表、面部表情、喜悦、愤怒、悲伤、快乐', promptEn: 'Character sheet, facial expressions, joy, anger, sadness, happiness', category: 'portrait', difficulty: 'medium', tags: ['表情包', 'LINE', '印章'], author: '@emakiscroll', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: false },
  {id: 109, title: '对童年的自己治疗', titleEn: 'Therapy with Childhood Self', description: '治疗室中成人与童年自己对话', descriptionEn: 'Adult dialoguing with childhood self', inputImages: [`${BASE_URL}/case109/output.jpg`], outputImage: `${BASE_URL}/case109/output.jpg`, prompt: '超逼真极简主义治疗室场景。同一人以两种年龄状态并排而坐', promptEn: 'Hyper-realistic minimalist therapy room. Same person in two age states sitting side by side', category: 'art', difficulty: 'hard', tags: ['治愈系', '心理', '创意'], author: '@samann_ai', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: true },
  {id: 110, title: 'PIXAR风格图片', titleEn: 'Pixar Style Avatar', description: '生成Pixar风格3D头像', descriptionEn: 'Generate Pixar-style 3D avatar', inputImages: [`${BASE_URL}/case110/output.jpg`], outputImage: `${BASE_URL}/case110/output.jpg`, prompt: '生成一幅3D头像。Pixar风格', promptEn: 'Generate 3D avatar. Pixar style', category: 'portrait', difficulty: 'medium', tags: ['Pixar', '3D头像', '卡通'], author: '@NanoBanana_labs', modelUsed: 'Gemini 2.5 Flash', requiresInput: true, featured: true },
  
  // === GPT-4o 图片提示词案例 (630个) ===
  // 导入自: https://github.com/songguoxs/gpt4o-image-prompts
  ...gpt4oPromptsCases,
];

// 分类翻译
export const categoryNames = {
  portrait: { zh: '人像', en: 'Portrait' },
  landscape: { zh: '风景', en: 'Landscape' },
  product: { zh: '产品', en: 'Product' },
  art: { zh: '艺术', en: 'Art' },
  fusion: { zh: '融合', en: 'Fusion' },
  edit: { zh: '编辑', en: 'Edit' },
};

// 难度翻译
export const difficultyNames = {
  easy: { zh: '简单', en: 'Easy', color: 'text-green-600' },
  medium: { zh: '中等', en: 'Medium', color: 'text-accent-600' },
  hard: { zh: '困难', en: 'Hard', color: 'text-red-600' },
};
