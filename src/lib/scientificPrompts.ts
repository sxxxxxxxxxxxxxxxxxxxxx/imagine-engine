/**
 * 科研绘图提示词模板
 * 用于生成符合学术规范的科学示意图
 */

import { ScientificDrawingRequest, ScientificDiscipline } from '@/types/scientific';

/**
 * 学科特定的提示词模板
 */
export const SCIENTIFIC_DRAWING_PROMPTS: Record<ScientificDiscipline, Record<string, (params: any) => string>> = {
  biology: {
    cell: (components: string[]) => `
Create a professional scientific illustration of a eukaryotic cell.
Include these components: ${components.join(', ')}.
Style requirements:
- Clean line art with scientific accuracy
- All components clearly labeled
- White background
- Publication-ready quality (300 DPI equivalent)
- Use standard biological illustration conventions
- Clear, professional typography for labels
- Appropriate scale and proportions
- High resolution, crisp lines
`,
    
    molecule: (params: { moleculeType: string; atoms: string[]; bonds: string[] }) => {
      const { moleculeType, atoms, bonds } = params;
      return `
Draw a ${moleculeType} molecular structure diagram.
Show atoms: ${atoms.join(', ')}.
Show bonds: ${bonds.join(', ')}.
Style requirements:
- Standard chemical notation
- Clear atom labels
- Proper bond representation
- Professional scientific illustration
- White background
- High resolution
`;
    },
  },
  
  chemistry: {
    reaction: (params: { reactants: string[]; products: string[] }) => {
      const { reactants, products } = params;
      return `
Create a chemical reaction diagram.
Reactants: ${reactants.join(' + ')}.
Products: ${products.join(' + ')}.
Style requirements:
- Standard chemical equation format
- Clear arrow notation (→)
- Balanced equation
- Professional chemistry illustration
- Labeled components
- White background
- High resolution
`;
    },
    
    apparatus: (equipment: string[]) => `
Draw a laboratory apparatus diagram.
Equipment: ${equipment.join(', ')}.
Style requirements:
- Technical drawing style
- All parts clearly labeled
- Scientific accuracy
- Clean lines
- Professional laboratory illustration
- White background
- High resolution
`
  },
  
  physics: {
    circuit: (components: string[]) => `
Create an electrical circuit diagram.
Components: ${components.join(', ')}.
Style requirements:
- Standard circuit symbols (IEEE/ANSI)
- Clear connections
- Labeled components
- Professional engineering drawing
- White background
- High resolution
- Clean, precise lines
`,
    
    mechanics: (concept: string) => `
Draw a physics diagram showing: ${concept}.
Include:
- Force vectors (if applicable)
- Motion arrows
- Labeled axes
- Clear annotations
Style requirements:
- Professional scientific illustration
- Standard physics notation
- Clean, clear lines
- White background
- High resolution
`
  },
  
  engineering: {
    mechanical: (components: string[]) => `
Create a mechanical engineering diagram.
Components: ${components.join(', ')}.
Style requirements:
- Technical drawing style
- Standard engineering symbols
- Clear dimensions (if applicable)
- Professional engineering illustration
- White background
- High resolution
`,
    
    architecture: (elements: string[]) => `
Draw an architectural diagram.
Elements: ${elements.join(', ')}.
Style requirements:
- Technical drawing style
- Clear scale representation
- Standard architectural symbols
- Professional illustration
- White background
- High resolution
`
  },
  
  medicine: {
    anatomy: (parts: string[]) => `
Create a medical anatomy diagram.
Parts: ${parts.join(', ')}.
Style requirements:
- Professional medical illustration
- Accurate anatomical representation
- Clear labels
- Standard medical terminology
- Clean, clear lines
- White background
- High resolution
`,
    
    pathology: (condition: string) => `
Draw a pathology diagram showing: ${condition}.
Style requirements:
- Professional medical illustration
- Accurate pathological representation
- Clear annotations
- Standard medical terminology
- White background
- High resolution
`
  }
};

/**
 * 生成完整的科研绘图提示词
 */
export function generateScientificPrompt(
  request: ScientificDrawingRequest,
  hasReferenceImage?: boolean,
  styleStrength?: number
): string {
  const { 
    description, 
    discipline, 
    drawingType = 'illustration', 
    style = 'clean',
    components = []
  } = request;
  
  // 如果有参考图，使用图生图模式的提示词
  if (hasReferenceImage) {
    const strength = styleStrength || 70;
    let prompt = `[REFERENCE IMAGE STYLE TRANSFER MODE]

I am providing a reference scientific illustration. Your task: Generate a NEW scientific illustration with SIMILAR STYLE but DIFFERENT CONTENT.

REFERENCE IMAGE ANALYSIS:
- Study the reference image's visual style
- Extract: line style, color scheme, layout, labeling style, illustration conventions
- Maintain: professional quality, academic standards, publication-ready format

NEW CONTENT REQUIREMENTS:
Discipline: ${discipline}
Description: ${description}
`;
    
    if (components && components.length > 0) {
      prompt += `Include these components: ${components.join(', ')}.\n`;
    }
    
    prompt += `
STYLE TRANSFER RULES (CRITICAL):
1. Visual Style Analysis:
   - Extract line style (thickness, type: solid/dashed/dotted)
   - Extract color scheme (palette, saturation, contrast)
   - Extract layout conventions (composition, spacing, alignment)
   - Extract labeling style (font, size, positioning)
   - Extract illustration conventions (arrow styles, symbols, notation)

2. Content Application:
   - Apply the NEW content: "${description}"
   - Maintain scientific accuracy for the new subject matter
   - Preserve visual style elements from reference (${strength}% strength)
   - Ensure new content fits naturally in the reference style

3. Quality Standards:
   - Maintain publication-ready quality (300 DPI minimum)
   - Pure white background (#FFFFFF)
   - Clear, professional labels and annotations
   - Follow standard ${discipline} illustration conventions
   - High resolution, crisp lines, no artifacts

4. Style Strength Control:
   - ${strength >= 70 ? 'HIGH (70-90%)' : strength >= 50 ? 'MEDIUM (50-70%)' : 'LOW (30-50%)'} strength: ${strength}%
   - ${strength >= 70 ? 'Closely match reference style: colors, line style, layout, labeling conventions' : strength >= 50 ? 'Moderately follow reference style: use as strong inspiration' : 'Use reference as light inspiration: maintain your own style'}
   - Always prioritize scientific accuracy over style matching
   - Ensure the new illustration is publication-ready regardless of style strength

5. Academic Compliance:
   - Must meet academic journal publication standards
   - Scientifically accurate representation
   - Professional quality suitable for Nature, Science, Cell, etc.
   - Ready for direct use in research papers and presentations
`;
    
    return prompt.trim();
  }
  
  // 基础提示词（纯文生图）- 优化版，更专业
  let prompt = `[SCIENTIFIC ILLUSTRATION GENERATION - ACADEMIC PUBLICATION STANDARD]

Create a professional, publication-ready scientific ${drawingType} illustration for academic journals.

SUBJECT MATTER:
Discipline: ${discipline}
Content Description: ${description}`;
  
  if (components && components.length > 0) {
    prompt += `\nRequired Components: ${components.join(', ')}`;
  }
  
  // 学科特定的专业要求
  const disciplineSpecific = {
    biology: `- Use standard biological illustration conventions (e.g., Campbell Biology style)
- Accurate anatomical/structural representation
- Proper scientific nomenclature and labeling
- Clear hierarchical relationships between components`,
    chemistry: `- Follow IUPAC chemical notation standards
- Accurate molecular structures and bond representations
- Clear reaction mechanisms with proper arrow notation
- Standard laboratory equipment representation`,
    physics: `- Use standard physics notation (SI units, vector notation)
- Accurate force diagrams and field representations
- Clear mathematical relationships visualization
- Standard physics diagram conventions`,
    engineering: `- Technical drawing standards (ISO/ANSI)
- Accurate scale and dimension representation
- Clear mechanical/structural relationships
- Professional engineering illustration style`,
    medicine: `- Medical illustration standards (Netter's Anatomy style)
- Accurate anatomical representation
- Standard medical terminology
- Clear pathological/physiological relationships`
  };
  
  prompt += `\n\nDISCIPLINE-SPECIFIC REQUIREMENTS:
${disciplineSpecific[discipline] || disciplineSpecific.biology}`;
  
  // 风格要求（更详细）
  prompt += `\n\nVISUAL STYLE REQUIREMENTS:`;
  
  switch (style) {
    case 'clean':
      prompt += `
- Minimalist, clean line art style
- Clear, uncluttered composition
- High contrast for clarity
- Simple color palette (if any)
- Focus on essential elements only`;
      break;
    case 'detailed':
      prompt += `
- Comprehensive, detailed illustration
- All relevant components clearly visible
- Rich visual information
- Appropriate level of detail for publication
- Complete representation of subject matter`;
      break;
    case '3d':
      prompt += `
- 3D rendered style with proper depth and perspective
- Realistic lighting and shadows
- Spatial relationships clearly shown
- Professional 3D visualization quality`;
      break;
  }
  
  // 学术规范要求（强化）
  prompt += `\n\nACADEMIC PUBLICATION STANDARDS (CRITICAL):
1. Publication Quality: 300 DPI minimum resolution, suitable for print
2. Background: Pure white (#FFFFFF), no gradients or patterns
3. Labeling: Clear, professional typography, standard font sizes
4. Accuracy: Scientifically accurate, factually correct representation
5. Clarity: High contrast, clear lines, no visual artifacts
6. Conventions: Follow standard ${discipline} illustration conventions
7. Composition: Professional layout, balanced composition
8. Color: Use color only when scientifically meaningful (avoid decorative colors)
9. Scale: Appropriate scale representation with scale bars if needed
10. Annotations: Clear, concise annotations following academic standards

OUTPUT REQUIREMENTS:
- Format: High-resolution PNG or equivalent
- Resolution: 300 DPI equivalent (minimum 2400x1800 pixels for A4)
- Color Space: sRGB or CMYK (print-ready)
- File Quality: Lossless compression, no artifacts
- Ready for: Direct use in academic papers, presentations, textbooks`;
  
  return prompt.trim();
}

/**
 * 生成变体提示词（用于抽卡模式）
 */
export function generateVariantPrompt(
  basePrompt: string,
  variantIndex: number
): string {
  const variants = [
    {
      composition: 'alternative composition with different element arrangement',
      perspective: 'slightly different viewing angle or perspective',
      layout: 'varied spatial layout while maintaining logical relationships',
      emphasis: 'different visual emphasis on key components'
    },
    {
      composition: 'alternative composition with reorganized elements',
      perspective: 'different perspective showing alternative view',
      layout: 'modified layout with varied spacing and positioning',
      emphasis: 'shifted visual focus to highlight different aspects'
    },
    {
      composition: 'varied composition with unique element arrangement',
      perspective: 'alternative viewing angle or orientation',
      layout: 'different spatial organization maintaining clarity',
      emphasis: 'alternative visual hierarchy and emphasis'
    },
    {
      composition: 'distinct composition with creative element placement',
      perspective: 'unique perspective or viewing angle',
      layout: 'innovative layout while preserving scientific accuracy',
      emphasis: 'different visual emphasis and component relationships'
    }
  ];
  
  const variant = variants[variantIndex % variants.length];
  return `${basePrompt}

VARIATION REQUIREMENTS (Variant ${variantIndex + 1}):
- Create an alternative version with ${variant.composition}
- Use ${variant.perspective}
- Apply ${variant.layout}
- Implement ${variant.emphasis}

CRITICAL: Maintain the same scientific accuracy, academic standards, and publication quality as the base prompt. The variation should be visually distinct but equally suitable for academic publication.`;
}
