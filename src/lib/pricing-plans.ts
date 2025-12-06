/**
 * 定价方案配置
 * 核心策略：主推Basic版本（最受欢迎）
 */

export interface PricingPlan {
  id: string;
  name: { zh: string; en: string };
  price: { zh: string; en: string };
  period: { zh: string; en: string };
  quota: string;
  badge: { zh: string; en: string } | null;
  highlight: boolean;
  description: { zh: string; en: string };
  features: string[];
  cta: { zh: string; en: string };
  targetAudience: { zh: string; en: string };
  savings?: { zh: string; en: string };
  originalPrice?: { zh: string; en: string };
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: { zh: '免费版', en: 'Free' },
    price: { zh: '￥0', en: '$0' },
    period: { zh: '/月', en: '/month' },
    quota: '20张/月',
    badge: null,
    highlight: false,
    description: { zh: '体验AI创作', en: 'Try AI Creation' },
    features: [
      '20张免费额度',
      '基础AI模型',
      '去背景工具',
      '社区支持',
      '7天历史记录'
    ],
    cta: { zh: '免费开始', en: 'Start Free' },
    targetAudience: { zh: '尝鲜用户', en: 'Trial Users' }
  },
  {
    id: 'basic',
    name: { zh: '基础版', en: 'Basic' },
    price: { zh: '￥19.9', en: '$4.9' },
    period: { zh: '/月', en: '/month' },
    quota: '200张/月',
    badge: { zh: '🔥 最受欢迎', en: '🔥 Most Popular' },
    highlight: true,  // 主推！
    description: { zh: '适合个人创作者', en: 'For Personal Creators' },
    features: [
      '200张月度额度',
      '全部AI模型（含高清）',
      '全部工具（8+）',
      '证件照生成',
      '智能去背景',
      '优先邮件支持',
      '30天历史记录',
      '批量下载'
    ],
    cta: { zh: '立即订阅', en: 'Subscribe Now' },
    targetAudience: { zh: '个人用户、设计爱好者、自媒体创作者', en: 'Individuals, Design Enthusiasts & Content Creators' },
    savings: { zh: '比按次购买节省93%', en: 'Save 93% vs Pay-as-you-go' },
    originalPrice: { zh: '￥400', en: '$60' }  // 200张 × ￥2 = ￥400
  },
  {
    id: 'pro',
    name: { zh: '专业版', en: 'Pro' },
    price: { zh: '￥99', en: '$14.9' },
    period: { zh: '/月', en: '/month' },
    quota: '1000张/月',
    badge: null,
    highlight: false,  // 不主推
    description: { zh: '专业设计师之选', en: 'For Professional Designers' },
    features: [
      '1000张月度额度',
      '全部高级功能',
      'API访问权限',
      '团队协作（3人）',
      '优先技术支持',
      '无限历史记录',
      '商用授权'
    ],
    cta: { zh: '升级Pro', en: 'Upgrade to Pro' },
    targetAudience: { zh: '专业设计师、创意工作室', en: 'Professional Designers & Creative Studios' }
  },
  {
    id: 'enterprise',
    name: { zh: '企业版', en: 'Enterprise' },
    price: { zh: '联系咨询', en: 'Contact Us' },
    period: { zh: '', en: '' },
    quota: '定制额度',
    badge: null,
    highlight: false,
    description: { zh: '大型团队定制方案', en: 'Custom Solutions for Large Teams' },
    features: [
      '无限额度',
      '定制化模型',
      '私有化部署选项',
      '专属技术顾问',
      'SLA服务保障',
      '企业发票开具',
      '数据安全审计'
    ],
    cta: { zh: '联系销售', en: 'Contact Sales' },
    targetAudience: { zh: '企业客户、大型组织', en: 'Enterprise Clients & Organizations' }
  }
];

// 工具功能和定价关系
export const TOOL_PRICING = {
  'remove-bg': { minPlan: 'free', quota: 1 },        // 去背景：Free可用
  'id-photo': { minPlan: 'free', quota: 1 },
  'upscale': { minPlan: 'basic', quota: 2 },         // 放大：Basic及以上，消耗2张
  'style-transfer': { minPlan: 'basic', quota: 2 },  // 风格转换：Basic及以上
  'sketch-to-image': { minPlan: 'basic', quota: 1 }, // 素描转照片：Basic及以上
  'compress': { minPlan: 'free', quota: 0 },         // 压缩：Free可用，不消耗配额
  'enhance': { minPlan: 'basic', quota: 2 },         // 增强：Basic及以上
  'colorize': { minPlan: 'basic', quota: 2 }         // 上色：Basic及以上
};

// 获取用户可用工具
export function getAvailableTools(planType: string) {
  const planHierarchy = ['free', 'basic', 'pro', 'enterprise'];
  const userLevel = planHierarchy.indexOf(planType);

  return Object.entries(TOOL_PRICING).filter(([_, config]) => {
    const requiredLevel = planHierarchy.indexOf(config.minPlan);
    return userLevel >= requiredLevel;
  }).map(([name]) => name);
}

// 计算性价比
export function calculateSavings(planType: string) {
  const plan = PRICING_PLANS.find(p => p.id === planType);
  if (!plan || !plan.originalPrice) return null;

  const price = parseFloat(plan.price.zh.replace('￥', ''));
  const original = parseFloat(plan.originalPrice.zh.replace('￥', ''));
  const savingsPercent = Math.round((1 - price / original) * 100);

  return {
    amount: original - price,
    percent: savingsPercent
  };
}

