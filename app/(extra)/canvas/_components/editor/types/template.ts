// app/(extra)/canvas/_components/editor/types/template.ts (UPDATED)

import { HeaderFooter, CanvasElement } from '../types';

/**
 * Canvas template for reusable page designs
 * Templates are single-page designs with header, footer, and background elements
 */
export interface CanvasTemplate {
  id: string;
  name: string;
  description?: string; // Made optional, no longer used in UI
  thumbnail: string; // base64 preview image
  createdAt: number;
  updatedAt: number;
  createdBy?: string; // For future role-based access
  
  // Template structure (single page only)
  header: HeaderFooter;
  footer: HeaderFooter;
  page: {
    size: 'A4' | 'Short' | 'Long';
    orientation: 'portrait' | 'landscape';
    backgroundColor?: string;
    elements: CanvasElement[]; // Background images, logos, watermarks
  };
  
  // Metadata
  category?: 'business' | 'invoice' | 'report' | 'custom';
  isDefault?: boolean;
  tags?: string[];
}

/**
 * Template manager state
 */
export interface TemplateManagerState {
  templates: CanvasTemplate[];
  selectedTemplateId: string | null;
}

/**
 * Template creation mode
 */
export type TemplateMode = 'create' | 'edit' | 'view';