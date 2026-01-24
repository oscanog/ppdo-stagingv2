// app/(extra)/canvas/_components/editor/hooks/useTemplateStorage.ts (FIXED - Add refresh function)

import { useState, useEffect, useCallback } from 'react';
import { CanvasTemplate } from '../types/template';

const STORAGE_KEY = 'canvas-templates';

export function useTemplateStorage() {
  const [templates, setTemplates] = useState<CanvasTemplate[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load templates from localStorage
  const loadTemplates = useCallback(() => {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log('%c📂 Loaded templates from storage:', 'font-weight: bold; color: #9C27B0;', parsed);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
    return [];
  }, []);

  // Refresh templates from storage
  const refreshTemplates = useCallback(() => {
    console.log('%c🔄 Refreshing templates from storage', 'font-weight: bold; color: #FF9800;');
    const fresh = loadTemplates();
    setTemplates(fresh);
    console.log('%c✅ Templates refreshed:', 'font-weight: bold; color: #4CAF50;', fresh.length, 'templates');
  }, [loadTemplates]);

  // Initial load
  useEffect(() => {
    const loaded = loadTemplates();
    setTemplates(loaded);
    setIsHydrated(true);
  }, [loadTemplates]);

  // Save templates to localStorage
  const saveTemplates = useCallback((newTemplates: CanvasTemplate[]) => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newTemplates));
      console.log('%c💾 Saved templates to storage:', 'font-weight: bold; color: #2196F3;', newTemplates.length, 'templates');
      setTemplates(newTemplates);
    } catch (error) {
      console.error('Failed to save templates:', error);
    }
  }, []);

  // Add a new template
  const addTemplate = useCallback((template: CanvasTemplate) => {
    console.log('%c➕ Adding template:', 'font-weight: bold; color: #4CAF50;', template.id);
    const updated = [...templates, template];
    saveTemplates(updated);
  }, [templates, saveTemplates]);

  // Update existing template
  const updateTemplate = useCallback((id: string, updates: Partial<CanvasTemplate>) => {
    console.log('%c✏️ Updating template:', 'font-weight: bold; color: #FF9800;', id);
    const updated = templates.map(t => 
      t.id === id ? { ...t, ...updates, updatedAt: Date.now() } : t
    );
    saveTemplates(updated);
  }, [templates, saveTemplates]);

  // Delete template
  const deleteTemplate = useCallback((id: string) => {
    console.log('%c🗑️ Deleting template:', 'font-weight: bold; color: #F44336;', id);
    const updated = templates.filter(t => t.id !== id);
    saveTemplates(updated);
  }, [templates, saveTemplates]);

  // Get single template
  const getTemplate = useCallback((id: string): CanvasTemplate | undefined => {
    // Always get fresh data from storage for reliability
    const fresh = loadTemplates();
    const template = fresh.find(t => t.id === id);
    console.log('%c🔍 Getting template:', 'font-weight: bold; color: #2196F3;', id, template ? '✅ Found' : '❌ Not found');
    return template;
  }, [loadTemplates]);

  // Duplicate template
  const duplicateTemplate = useCallback((id: string): CanvasTemplate => {
    console.log('%c📋 Duplicating template:', 'font-weight: bold; color: #9C27B0;', id);
    const original = templates.find(t => t.id === id);
    
    if (!original) {
      throw new Error('Template not found');
    }

    const duplicated: CanvasTemplate = {
      ...original,
      id: `template-${Date.now()}`,
      name: `${original.name} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isDefault: false,
    };

    const updated = [...templates, duplicated];
    saveTemplates(updated);
    
    return duplicated;
  }, [templates, saveTemplates]);

  return {
    templates,
    isHydrated,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    getTemplate,
    duplicateTemplate,
    refreshTemplates,
  };
}