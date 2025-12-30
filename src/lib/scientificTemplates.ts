/**
 * 科研绘图模板库
 * Phase 1: 30个核心模板（扩展版）
 */

import { ScientificTemplate } from '@/types/scientific';

export const SCIENTIFIC_TEMPLATES: ScientificTemplate[] = [
  // ========== 生物学模板 ==========
  {
    id: 'bio-cell-eukaryotic',
    name: { zh: '真核细胞结构', en: 'Eukaryotic Cell Structure' },
    discipline: 'biology',
    type: 'illustration',
    description: { 
      zh: '包含细胞核、线粒体、内质网等主要细胞器', 
      en: 'Includes nucleus, mitochondria, ER, and other organelles' 
    },
    prompt: `[SCIENTIFIC ILLUSTRATION - EUKARYOTIC CELL STRUCTURE]

Create a professional, publication-ready scientific illustration of a eukaryotic cell structure.

REQUIRED COMPONENTS:
- Nucleus (with nuclear envelope, nucleolus, chromatin)
- Mitochondria (with cristae clearly visible)
- Endoplasmic reticulum (rough ER with ribosomes, smooth ER)
- Golgi apparatus (cisternae structure)
- Ribosomes (free and bound)
- Cell membrane (phospholipid bilayer structure)
- Cytoplasm (with appropriate cellular environment)

ACADEMIC STANDARDS:
- Follow Campbell Biology illustration conventions
- Accurate structural representation
- Clear, professional labeling
- Pure white background (#FFFFFF)
- 300 DPI minimum resolution
- Publication-ready quality for academic journals

STYLE:
- Clean line art with appropriate line weights
- High contrast for clarity
- Standard biological illustration style
- Clear hierarchical relationships between organelles`,
    parameters: {
      components: ['细胞核', '线粒体', '内质网', '高尔基体', '核糖体', '细胞膜'],
      style: ['clean', 'detailed']
    },
    category: 'cell-biology'
  },
  
  {
    id: 'bio-dna-structure',
    name: { zh: 'DNA双螺旋结构', en: 'DNA Double Helix' },
    discipline: 'biology',
    type: 'structure',
    description: { 
      zh: 'DNA双螺旋结构示意图', 
      en: 'DNA double helix structure diagram' 
    },
    prompt: `[SCIENTIFIC ILLUSTRATION - DNA DOUBLE HELIX STRUCTURE]

Create a professional, publication-ready DNA double helix structure diagram.

STRUCTURAL ELEMENTS:
- Two antiparallel DNA strands
- Base pairs: Adenine-Thymine (A-T), Guanine-Cytosine (G-C)
- Sugar-phosphate backbone (deoxyribose and phosphate groups)
- Hydrogen bonds between base pairs (dashed lines)
- Major and minor grooves
- Helical twist (10.5 base pairs per turn)

ACADEMIC STANDARDS:
- Follow standard biochemistry/molecular biology conventions
- Accurate molecular structure representation
- Clear base pair labeling (A, T, G, C)
- Standard color coding (if applicable)
- Pure white background (#FFFFFF)
- 300 DPI minimum resolution
- Publication-ready quality

STYLE:
- Professional molecular structure illustration
- Clear, precise line work
- Accurate proportions and angles
- Standard biochemistry notation`,
    parameters: {
      components: ['双链', '碱基对', '糖-磷酸骨架'],
      style: ['clean', '3d']
    },
    category: 'molecular-biology'
  },
  
  {
    id: 'bio-protein-structure',
    name: { zh: '蛋白质结构', en: 'Protein Structure' },
    discipline: 'biology',
    type: 'structure',
    description: { 
      zh: '蛋白质三级结构示意图', 
      en: 'Protein tertiary structure diagram' 
    },
    prompt: `Create a protein structure diagram showing tertiary structure.
Include: alpha helices, beta sheets, loops, side chains.
Style: Professional scientific illustration, 3D representation, clear labels, white background.`,
    parameters: {
      components: ['α螺旋', 'β折叠', '侧链'],
      style: ['3d', 'detailed']
    },
    category: 'molecular-biology'
  },
  
  // ========== 化学模板 ==========
  {
    id: 'chem-molecular-structure',
    name: { zh: '分子结构式', en: 'Molecular Structure' },
    discipline: 'chemistry',
    type: 'structure',
    description: { 
      zh: '标准分子结构式', 
      en: 'Standard molecular structure formula' 
    },
    prompt: `Draw a molecular structure diagram.
Show: atoms, bonds, chemical notation.
Style: Standard chemical notation, clear labels, professional illustration, white background, high resolution.`,
    parameters: {
      components: ['原子', '化学键'],
      style: ['clean', 'detailed']
    },
    category: 'organic-chemistry'
  },
  
  {
    id: 'chem-reaction-equation',
    name: { zh: '化学反应方程式', en: 'Chemical Reaction Equation' },
    discipline: 'chemistry',
    type: 'diagram',
    description: { 
      zh: '标准化学反应方程式', 
      en: 'Standard chemical reaction equation' 
    },
    prompt: `Create a chemical reaction diagram.
Show: reactants, products, reaction arrow, balanced equation.
Style: Standard chemical equation format, clear arrow notation, professional chemistry illustration, white background.`,
    parameters: {
      components: ['反应物', '产物', '反应箭头'],
      style: ['clean']
    },
    category: 'reaction-chemistry'
  },
  
  {
    id: 'chem-lab-apparatus',
    name: { zh: '实验装置图', en: 'Laboratory Apparatus' },
    discipline: 'chemistry',
    type: 'diagram',
    description: { 
      zh: '实验室装置示意图', 
      en: 'Laboratory apparatus diagram' 
    },
    prompt: `Draw a laboratory apparatus diagram.
Include: beakers, flasks, condensers, heating equipment.
Style: Technical drawing style, all parts clearly labeled, scientific accuracy, clean lines, white background.`,
    parameters: {
      components: ['烧杯', '烧瓶', '冷凝管', '加热设备'],
      style: ['clean', 'detailed']
    },
    category: 'laboratory'
  },
  
  // ========== 物理学模板 ==========
  {
    id: 'phy-circuit-diagram',
    name: { zh: '电路图', en: 'Circuit Diagram' },
    discipline: 'physics',
    type: 'diagram',
    description: { 
      zh: '标准电路图', 
      en: 'Standard electrical circuit diagram' 
    },
    prompt: `Create an electrical circuit diagram.
Use standard circuit symbols (IEEE/ANSI).
Include: power source, resistors, connections.
Style: Professional engineering drawing, clear labels, white background, high resolution.`,
    parameters: {
      components: ['电源', '电阻', '连接线'],
      style: ['clean']
    },
    category: 'electronics'
  },
  
  {
    id: 'phy-mechanics-diagram',
    name: { zh: '力学示意图', en: 'Mechanics Diagram' },
    discipline: 'physics',
    type: 'illustration',
    description: { 
      zh: '力学原理示意图', 
      en: 'Mechanics principle diagram' 
    },
    prompt: `Draw a physics mechanics diagram.
Include: force vectors, motion arrows, labeled axes, clear annotations.
Style: Professional scientific illustration, standard physics notation, clean lines, white background.`,
    parameters: {
      components: ['力向量', '运动箭头', '坐标轴'],
      style: ['clean', 'detailed']
    },
    category: 'mechanics'
  },
  
  // ========== 医学模板 ==========
  {
    id: 'med-anatomy-diagram',
    name: { zh: '人体解剖图', en: 'Human Anatomy Diagram' },
    discipline: 'medicine',
    type: 'illustration',
    description: { 
      zh: '人体器官结构示意图', 
      en: 'Human organ structure diagram' 
    },
    prompt: `Create a medical anatomy diagram.
Show: organ structure, clear labels, standard medical terminology.
Style: Professional medical illustration, accurate anatomical representation, clean lines, white background, high resolution.`,
    parameters: {
      components: ['器官', '血管', '神经'],
      style: ['clean', 'detailed']
    },
    category: 'anatomy'
  },
  
  // ========== 工程学模板 ==========
  {
    id: 'eng-mechanical-diagram',
    name: { zh: '机械结构图', en: 'Mechanical Structure' },
    discipline: 'engineering',
    type: 'diagram',
    description: { 
      zh: '机械工程结构示意图', 
      en: 'Mechanical engineering structure diagram' 
    },
    prompt: `Create a mechanical engineering diagram.
Show: mechanical components, connections, standard engineering symbols.
Style: Technical drawing style, clear dimensions, professional engineering illustration, white background.`,
    parameters: {
      components: ['机械部件', '连接', '尺寸标注'],
      style: ['clean', 'detailed']
    },
    category: 'mechanical-engineering'
  },

  // ========== 生物学扩展模板 ==========
  {
    id: 'bio-prokaryotic-cell',
    name: { zh: '原核细胞结构', en: 'Prokaryotic Cell Structure' },
    discipline: 'biology',
    type: 'illustration',
    description: { zh: '原核细胞结构示意图', en: 'Prokaryotic cell structure diagram' },
    prompt: `Create a professional scientific illustration of a prokaryotic cell.
Include: cell wall, cell membrane, cytoplasm, ribosomes, nucleoid region, flagella (if applicable).
Style: Clean line art, labeled components, white background, publication-ready quality.`,
    parameters: {
      components: ['细胞壁', '细胞膜', '细胞质', '核糖体', '拟核'],
      style: ['clean', 'detailed']
    },
    category: 'cell-biology'
  },
  
  {
    id: 'bio-mitosis-process',
    name: { zh: '细胞分裂过程', en: 'Mitosis Process' },
    discipline: 'biology',
    type: 'flowchart',
    description: { zh: '细胞有丝分裂过程示意图', en: 'Mitosis process diagram' },
    prompt: `Create a scientific diagram showing the mitosis process.
Include: interphase, prophase, metaphase, anaphase, telophase stages.
Style: Professional biological illustration, clear stage labels, white background.`,
    parameters: {
      components: ['间期', '前期', '中期', '后期', '末期'],
      style: ['clean', 'detailed']
    },
    category: 'cell-biology'
  },
  
  {
    id: 'bio-photosynthesis',
    name: { zh: '光合作用示意图', en: 'Photosynthesis Diagram' },
    discipline: 'biology',
    type: 'diagram',
    description: { zh: '植物光合作用过程', en: 'Plant photosynthesis process' },
    prompt: `Create a photosynthesis diagram.
Show: light energy, CO2, H2O, glucose, O2, chloroplast structure.
Style: Professional biological illustration, clear arrows and labels, white background.`,
    parameters: {
      components: ['光能', 'CO2', 'H2O', '葡萄糖', 'O2', '叶绿体'],
      style: ['clean', 'detailed']
    },
    category: 'plant-biology'
  },
  
  {
    id: 'bio-neuron-structure',
    name: { zh: '神经元结构', en: 'Neuron Structure' },
    discipline: 'biology',
    type: 'illustration',
    description: { zh: '神经元细胞结构示意图', en: 'Neuron cell structure diagram' },
    prompt: `Create a neuron structure diagram.
Include: cell body, dendrites, axon, myelin sheath, synapse.
Style: Professional neuroscience illustration, clear labels, white background.`,
    parameters: {
      components: ['细胞体', '树突', '轴突', '髓鞘', '突触'],
      style: ['clean', 'detailed']
    },
    category: 'neuroscience'
  },
  
  {
    id: 'bio-enzyme-mechanism',
    name: { zh: '酶作用机制', en: 'Enzyme Mechanism' },
    discipline: 'biology',
    type: 'diagram',
    description: { zh: '酶催化反应机制图', en: 'Enzyme catalytic mechanism diagram' },
    prompt: `Create an enzyme mechanism diagram.
Show: enzyme, substrate, active site, product, reaction pathway.
Style: Professional biochemistry illustration, clear reaction arrows, white background.`,
    parameters: {
      components: ['酶', '底物', '活性位点', '产物'],
      style: ['clean', 'detailed']
    },
    category: 'biochemistry'
  },

  // ========== 化学扩展模板 ==========
  {
    id: 'chem-periodic-table-element',
    name: { zh: '元素周期表', en: 'Periodic Table Element' },
    discipline: 'chemistry',
    type: 'diagram',
    description: { zh: '元素周期表示意图', en: 'Periodic table element diagram' },
    prompt: `Create a periodic table element diagram.
Show: element symbol, atomic number, atomic mass, electron configuration.
Style: Standard chemistry notation, clear labels, white background.`,
    parameters: {
      components: ['元素符号', '原子序数', '原子量', '电子排布'],
      style: ['clean']
    },
    category: 'general-chemistry'
  },
  
  {
    id: 'chem-organic-reaction-mechanism',
    name: { zh: '有机反应机理', en: 'Organic Reaction Mechanism' },
    discipline: 'chemistry',
    type: 'diagram',
    description: { zh: '有机化学反应机理图', en: 'Organic reaction mechanism diagram' },
    prompt: `Create an organic reaction mechanism diagram.
Show: reaction steps, electron movement (curved arrows), intermediates, products.
Style: Standard organic chemistry notation, clear mechanism arrows, white background.`,
    parameters: {
      components: ['反应步骤', '电子转移', '中间体', '产物'],
      style: ['clean', 'detailed']
    },
    category: 'organic-chemistry'
  },
  
  {
    id: 'chem-crystal-structure',
    name: { zh: '晶体结构', en: 'Crystal Structure' },
    discipline: 'chemistry',
    type: 'structure',
    description: { zh: '晶体结构示意图', en: 'Crystal structure diagram' },
    prompt: `Create a crystal structure diagram.
Show: unit cell, lattice points, crystal symmetry, atomic arrangement.
Style: Professional crystallography illustration, 3D representation, clear labels, white background.`,
    parameters: {
      components: ['晶胞', '晶格点', '对称性', '原子排列'],
      style: ['3d', 'detailed']
    },
    category: 'crystallography'
  },
  
  {
    id: 'chem-chromatography-setup',
    name: { zh: '色谱实验装置', en: 'Chromatography Setup' },
    discipline: 'chemistry',
    type: 'diagram',
    description: { zh: '色谱分析实验装置图', en: 'Chromatography experiment setup' },
    prompt: `Draw a chromatography setup diagram.
Include: column, mobile phase, stationary phase, detector, sample injection.
Style: Technical drawing style, labeled components, white background.`,
    parameters: {
      components: ['色谱柱', '流动相', '固定相', '检测器'],
      style: ['clean', 'detailed']
    },
    category: 'analytical-chemistry'
  },
  
  {
    id: 'chem-electrochemical-cell',
    name: { zh: '电化学电池', en: 'Electrochemical Cell' },
    discipline: 'chemistry',
    type: 'diagram',
    description: { zh: '电化学电池结构图', en: 'Electrochemical cell structure' },
    prompt: `Create an electrochemical cell diagram.
Show: anode, cathode, electrolyte, salt bridge, electron flow, ion movement.
Style: Standard electrochemistry notation, clear labels, white background.`,
    parameters: {
      components: ['阳极', '阴极', '电解质', '盐桥', '电子流'],
      style: ['clean', 'detailed']
    },
    category: 'electrochemistry'
  },

  // ========== 物理学扩展模板 ==========
  {
    id: 'phy-optics-diagram',
    name: { zh: '光学原理图', en: 'Optics Diagram' },
    discipline: 'physics',
    type: 'diagram',
    description: { zh: '光的反射折射示意图', en: 'Light reflection and refraction diagram' },
    prompt: `Create an optics diagram showing light reflection and refraction.
Include: incident ray, reflected ray, refracted ray, normal line, angles.
Style: Standard physics notation, clear ray paths, white background.`,
    parameters: {
      components: ['入射光线', '反射光线', '折射光线', '法线', '角度'],
      style: ['clean', 'detailed']
    },
    category: 'optics'
  },
  
  {
    id: 'phy-electromagnetic-field',
    name: { zh: '电磁场示意图', en: 'Electromagnetic Field' },
    discipline: 'physics',
    type: 'diagram',
    description: { zh: '电磁场分布示意图', en: 'Electromagnetic field distribution' },
    prompt: `Create an electromagnetic field diagram.
Show: electric field lines, magnetic field lines, field direction, charge distribution.
Style: Standard physics field line notation, clear visualization, white background.`,
    parameters: {
      components: ['电场线', '磁场线', '场方向', '电荷分布'],
      style: ['clean', 'detailed']
    },
    category: 'electromagnetism'
  },
  
  {
    id: 'phy-thermodynamics-cycle',
    name: { zh: '热力学循环', en: 'Thermodynamics Cycle' },
    discipline: 'physics',
    type: 'diagram',
    description: { zh: '热力学循环过程图', en: 'Thermodynamics cycle process' },
    prompt: `Create a thermodynamics cycle diagram (e.g., Carnot cycle).
Show: pressure-volume or temperature-entropy diagram, cycle stages, work done.
Style: Standard thermodynamics notation, clear cycle path, white background.`,
    parameters: {
      components: ['等温过程', '绝热过程', '等压过程', '等容过程'],
      style: ['clean', 'detailed']
    },
    category: 'thermodynamics'
  },
  
  {
    id: 'phy-quantum-energy-levels',
    name: { zh: '量子能级图', en: 'Quantum Energy Levels' },
    discipline: 'physics',
    type: 'diagram',
    description: { zh: '原子能级和跃迁图', en: 'Atomic energy levels and transitions' },
    prompt: `Create a quantum energy level diagram.
Show: energy levels, electron transitions, photon emission/absorption, energy values.
Style: Standard quantum physics notation, clear energy scale, white background.`,
    parameters: {
      components: ['能级', '电子跃迁', '光子发射', '能量值'],
      style: ['clean', 'detailed']
    },
    category: 'quantum-physics'
  },

  // ========== 工程学扩展模板 ==========
  {
    id: 'eng-architecture-plan',
    name: { zh: '建筑平面图', en: 'Architecture Plan' },
    discipline: 'engineering',
    type: 'diagram',
    description: { zh: '建筑平面示意图', en: 'Architectural floor plan' },
    prompt: `Create an architectural floor plan diagram.
Show: rooms, walls, doors, windows, dimensions, scale.
Style: Standard architectural drawing, clear labels, white background.`,
    parameters: {
      components: ['房间', '墙体', '门窗', '尺寸标注'],
      style: ['clean', 'detailed']
    },
    category: 'architecture'
  },
  
  {
    id: 'eng-flowchart-process',
    name: { zh: '工艺流程流程图', en: 'Process Flowchart' },
    discipline: 'engineering',
    type: 'flowchart',
    description: { zh: '工艺流程流程图', en: 'Industrial process flowchart' },
    prompt: `Create a process flowchart diagram.
Show: process steps, decision points, flow direction, input/output.
Style: Standard flowchart symbols, clear connections, white background.`,
    parameters: {
      components: ['流程步骤', '决策点', '流向', '输入输出'],
      style: ['clean']
    },
    category: 'process-engineering'
  },
  
  {
    id: 'eng-structural-diagram',
    name: { zh: '结构受力图', en: 'Structural Load Diagram' },
    discipline: 'engineering',
    type: 'diagram',
    description: { zh: '结构受力分析图', en: 'Structural load analysis diagram' },
    prompt: `Create a structural load diagram.
Show: structural elements, load forces, support points, stress distribution.
Style: Standard engineering drawing, clear force vectors, white background.`,
    parameters: {
      components: ['结构单元', '载荷', '支撑点', '应力分布'],
      style: ['clean', 'detailed']
    },
    category: 'structural-engineering'
  },
  
  {
    id: 'eng-control-system',
    name: { zh: '控制系统框图', en: 'Control System Block' },
    discipline: 'engineering',
    type: 'diagram',
    description: { zh: '自动控制系统框图', en: 'Automatic control system block diagram' },
    prompt: `Create a control system block diagram.
Show: input, controller, plant, feedback, output, signal flow.
Style: Standard control engineering notation, clear block connections, white background.`,
    parameters: {
      components: ['输入', '控制器', '被控对象', '反馈', '输出'],
      style: ['clean']
    },
    category: 'control-engineering'
  },

  // ========== 医学扩展模板 ==========
  {
    id: 'med-cardiovascular-system',
    name: { zh: '心血管系统', en: 'Cardiovascular System' },
    discipline: 'medicine',
    type: 'illustration',
    description: { zh: '心血管系统结构图', en: 'Cardiovascular system structure' },
    prompt: `Create a cardiovascular system diagram.
Show: heart, arteries, veins, blood flow direction, major vessels.
Style: Professional medical illustration, accurate anatomy, clear labels, white background.`,
    parameters: {
      components: ['心脏', '动脉', '静脉', '血流方向'],
      style: ['clean', 'detailed']
    },
    category: 'cardiology'
  },
  
  {
    id: 'med-respiratory-system',
    name: { zh: '呼吸系统', en: 'Respiratory System' },
    discipline: 'medicine',
    type: 'illustration',
    description: { zh: '呼吸系统结构图', en: 'Respiratory system structure' },
    prompt: `Create a respiratory system diagram.
Show: nasal cavity, pharynx, larynx, trachea, bronchi, lungs, alveoli.
Style: Professional medical illustration, accurate anatomy, clear labels, white background.`,
    parameters: {
      components: ['鼻腔', '咽', '喉', '气管', '支气管', '肺', '肺泡'],
      style: ['clean', 'detailed']
    },
    category: 'pulmonology'
  },
  
  {
    id: 'med-nervous-system',
    name: { zh: '神经系统', en: 'Nervous System' },
    discipline: 'medicine',
    type: 'illustration',
    description: { zh: '神经系统结构图', en: 'Nervous system structure' },
    prompt: `Create a nervous system diagram.
Show: brain, spinal cord, peripheral nerves, major nerve pathways.
Style: Professional medical illustration, accurate neuroanatomy, clear labels, white background.`,
    parameters: {
      components: ['大脑', '脊髓', '周围神经', '神经通路'],
      style: ['clean', 'detailed']
    },
    category: 'neurology'
  },
  
  {
    id: 'med-cell-cycle-cancer',
    name: { zh: '细胞周期与癌症', en: 'Cell Cycle and Cancer' },
    discipline: 'medicine',
    type: 'diagram',
    description: { zh: '细胞周期与癌症关系图', en: 'Cell cycle and cancer relationship' },
    prompt: `Create a diagram showing cell cycle and cancer.
Show: normal cell cycle phases, cancer cell abnormalities, checkpoints, mutations.
Style: Professional medical illustration, clear comparison, white background.`,
    parameters: {
      components: ['正常细胞周期', '癌细胞异常', '检查点', '突变'],
      style: ['clean', 'detailed']
    },
    category: 'oncology'
  },
  
  {
    id: 'med-immune-response',
    name: { zh: '免疫反应过程', en: 'Immune Response Process' },
    discipline: 'medicine',
    type: 'flowchart',
    description: { zh: '免疫系统反应流程图', en: 'Immune system response flowchart' },
    prompt: `Create an immune response flowchart.
Show: pathogen entry, immune cell activation, antibody production, immune memory.
Style: Professional medical illustration, clear process flow, white background.`,
    parameters: {
      components: ['病原体入侵', '免疫细胞激活', '抗体产生', '免疫记忆'],
      style: ['clean', 'detailed']
    },
    category: 'immunology'
  }
];

/**
 * 根据学科获取模板
 */
export function getTemplatesByDiscipline(discipline: string): ScientificTemplate[] {
  return SCIENTIFIC_TEMPLATES.filter(t => t.discipline === discipline);
}

/**
 * 根据ID获取模板
 */
export function getTemplateById(id: string): ScientificTemplate | undefined {
  return SCIENTIFIC_TEMPLATES.find(t => t.id === id);
}
