/**
 * 科研绘图相关类型定义
 */

export type ScientificDiscipline = 
  | 'biology'      // 生物学
  | 'chemistry'    // 化学
  | 'physics'      // 物理学
  | 'engineering'  // 工程学
  | 'medicine';    // 医学

export type DrawingType = 
  | 'illustration'  // 示意图
  | 'flowchart'     // 流程图
  | 'structure'     // 结构图
  | 'diagram';      // 图表

export type DrawingStyle = 
  | 'clean'    // 简洁风格
  | 'detailed' // 详细风格
  | '3d';      // 3D风格

export interface ScientificDrawingRequest {
  description: string;
  discipline: ScientificDiscipline;
  drawingType?: DrawingType;
  style?: DrawingStyle;
  components?: string[];  // 可选组件列表
  size?: 'A4' | '16:9' | '1:1';
  templateId?: string;    // 如果使用模板
}

export interface ScientificTemplate {
  id: string;
  name: { zh: string; en: string };
  discipline: ScientificDiscipline;
  type: DrawingType;
  description: { zh: string; en: string };
  prompt: string;
  parameters: {
    components?: string[];
    style?: DrawingStyle[];
  };
  thumbnail?: string;
  category: string;
}

export interface ScientificDrawingResponse {
  imageUrl: string;
  metadata: {
    discipline: ScientificDiscipline;
    drawingType: DrawingType;
    style: DrawingStyle;
    resolution: string;
    format: string;
  };
}
