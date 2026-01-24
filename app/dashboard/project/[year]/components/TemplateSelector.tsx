// app/dashboard/project/[year]/components/TemplateSelector.tsx (FIXED)

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, X, Trash2, Copy, ExternalLink } from 'lucide-react';
import { CanvasTemplate } from '@/app/(extra)/canvas/_components/editor/types/template';
import { useTemplateStorage } from '@/app/(extra)/canvas/_components/editor/hooks/useTemplateStorage';
import { toast } from 'sonner';

interface TemplateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: CanvasTemplate | null) => void;
}

export function TemplateSelector({ isOpen, onClose, onSelectTemplate }: TemplateSelectorProps) {
  const { templates, deleteTemplate, duplicateTemplate, refreshTemplates } = useTemplateStorage();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Refresh templates when modal opens
  React.useEffect(() => {
    if (isOpen) {
      console.log('🔄 Template Selector opened - refreshing templates');
      refreshTemplates();
    }
  }, [isOpen, refreshTemplates]);

  const handleApply = () => {
    const template = templates.find(t => t.id === selectedId);
    console.log('✅ Applying template:', template?.name || 'none');
    if (!template) {
      toast.error('Please select a template first');
      return;
    }
    onSelectTemplate(template);
    onClose();
  };

  const handleSkip = () => {
    console.log('⏭️ Skipping template selection - starting blank');
    // CRITICAL: Pass undefined (not null) to indicate "skip" vs "no template selected"
    onSelectTemplate(undefined as any);
    onClose();
  };

  const handleDelete = (templateId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      deleteTemplate(templateId);
      if (selectedId === templateId) {
        setSelectedId(null);
      }
      toast.success('Template deleted');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete template');
    }
  };

  const handleDuplicate = (templateId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      const duplicated = duplicateTemplate(templateId);
      toast.success(`Template duplicated: ${duplicated.name}`);
    } catch (error) {
      toast.error('Failed to duplicate template');
    }
  };

  const handleCreateNew = () => {
    window.open('/canvas', '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-stone-900 rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col mx-4">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-700 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
              Choose a Template
            </h2>
            <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
              Select a template to apply headers, footers, and styling to all pages
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Template Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <div
                key={template.id}
                onClick={() => setSelectedId(template.id)}
                onMouseEnter={() => setHoveredId(template.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`relative border-2 rounded-lg overflow-hidden transition-all cursor-pointer ${
                  selectedId === template.id
                    ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800'
                    : 'border-stone-200 dark:border-stone-700 hover:border-stone-400 dark:hover:border-stone-500'
                }`}
              >
                {/* Thumbnail */}
                <div className="aspect-[8.5/11] bg-stone-100 dark:bg-stone-800 relative">
                  {template.thumbnail ? (
                    <img 
                      src={template.thumbnail} 
                      alt={template.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-400 dark:text-stone-600">
                      <span className="text-sm">No Preview</span>
                    </div>
                  )}

                  {/* Action buttons on hover */}
                  {hoveredId === template.id && !template.isDefault && (
                    <div className="absolute top-2 right-2 flex gap-1">
                      <button
                        onClick={(e) => handleDuplicate(template.id, e)}
                        className="p-1.5 bg-white dark:bg-stone-800 rounded shadow-lg hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
                        title="Duplicate"
                      >
                        <Copy className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(template.id, e)}
                        className="p-1.5 bg-white dark:bg-stone-800 rounded shadow-lg hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Selected Indicator */}
                {selectedId === template.id && (
                  <div className="absolute top-2 left-2 bg-blue-500 text-white rounded-full p-1 shadow-lg">
                    <Check className="w-4 h-4" />
                  </div>
                )}

                {/* Default Badge */}
                {template.isDefault && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-green-500 text-white text-xs font-medium rounded">
                    Default
                  </div>
                )}

                {/* Template Info */}
                <div className="p-3 bg-white dark:bg-stone-800 border-t border-stone-200 dark:border-stone-700">
                  <h4 className="font-medium text-sm truncate text-stone-900 dark:text-stone-100">
                    {template.name}
                  </h4>
                  {template.description && (
                    <p className="text-xs text-stone-500 dark:text-stone-400 truncate mt-0.5">
                      {template.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2 text-xs text-stone-400 dark:text-stone-500">
                    <span>{template.page.size}</span>
                    <span>•</span>
                    <span className="capitalize">{template.page.orientation}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Create New Template Card */}
            <button
              onClick={handleCreateNew}
              className="relative border-2 border-dashed border-stone-300 dark:border-stone-600 rounded-lg overflow-hidden hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all"
            >
              <div className="aspect-[8.5/11] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-3">
                  <ExternalLink className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h4 className="font-medium text-sm text-stone-900 dark:text-stone-100 mb-1">
                  Create New Template
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Open canvas editor in new tab
                </p>
              </div>
            </button>
          </div>

          {templates.length === 0 && (
            <div className="text-center py-12">
              <p className="text-stone-500 dark:text-stone-400 mb-4">
                No templates available. Create one to get started!
              </p>
              <Button onClick={handleCreateNew}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Create Your First Template
              </Button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-stone-200 dark:border-stone-700 flex justify-between items-center bg-stone-50 dark:bg-stone-800/50">
          <Button 
            variant="ghost" 
            onClick={handleSkip}
            className="text-stone-600 dark:text-stone-400"
          >
            <X className="w-4 h-4 mr-2" />
            Skip - Start Blank
          </Button>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-stone-500 dark:text-stone-400">
              {selectedId ? templates.find(t => t.id === selectedId)?.name : 'No template selected'}
            </span>
            <Button 
              onClick={handleApply}
              disabled={!selectedId}
            >
              <Check className="w-4 h-4 mr-2" />
              Apply Template
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}