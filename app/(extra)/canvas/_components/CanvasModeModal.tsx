// app/(extra)/canvas/_components/CanvasModeModal.tsx (FIXED - Refresh templates on open)

'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileEdit, Layout, Info, Plus, Trash2, Clock, ChevronRight } from 'lucide-react';
import { useTemplateStorage } from './editor/hooks/useTemplateStorage';
import { CanvasTemplate } from './editor/types/template';

interface CanvasModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMode: (mode: 'template' | 'editor') => void;
  onLoadTemplate?: (templateId: string) => void;
}

export function CanvasModeModal({ 
  isOpen, 
  onClose, 
  onSelectMode,
  onLoadTemplate,
}: CanvasModeModalProps) {
  const { templates, deleteTemplate, refreshTemplates } = useTemplateStorage();
  const [activeTab, setActiveTab] = useState<'new' | 'templates'>('new');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  // CRITICAL FIX: Refresh templates whenever modal opens
  useEffect(() => {
    if (isOpen) {
      console.log('%c🔄 Modal opened - refreshing templates', 'font-weight: bold; color: #FF9800;');
      refreshTemplates();
      setSelectedTemplateId(null); // Reset selection when modal opens
    }
  }, [isOpen, refreshTemplates]);

  // Filter out default templates and show user-created ones
  const userTemplates = templates.filter(t => !t.isDefault);

  console.log('%c📋 MODAL STATE', 'font-weight: bold; color: #2196F3;');
  console.log('  - Total templates:', templates.length);
  console.log('  - User templates:', userTemplates.length);
  console.log('  - Template IDs:', userTemplates.map(t => t.id));

  const handleSelect = (mode: 'template' | 'editor') => {
    onSelectMode(mode);
  };

  const handleTemplateSelect = (template: CanvasTemplate) => {
    console.log('%c✅ Template selected:', 'font-weight: bold; color: #4CAF50;', template.id);
    setSelectedTemplateId(template.id);
  };

  const handleLoadTemplate = () => {
    if (selectedTemplateId && onLoadTemplate) {
      console.log('%c🚀 Loading template:', 'font-weight: bold; color: #4FBA76;', selectedTemplateId);
      onLoadTemplate(selectedTemplateId);
      onClose();
    }
  };

  const handleDeleteTemplate = (e: React.MouseEvent, templateId: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this template?')) {
      deleteTemplate(templateId);
      if (selectedTemplateId === templateId) {
        setSelectedTemplateId(null);
      }
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent 
        className="sm:max-w-[900px] max-h-[90vh] p-0"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>Choose Canvas Mode</DialogTitle>
          <DialogDescription>
            Select whether you want to create a reusable template or use the full multi-page editor.
          </DialogDescription>
        </DialogHeader>

        {/* Tabs */}
        <div className="border-b border-stone-200 dark:border-stone-700 px-6">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('new')}
              className={`pb-3 border-b-2 transition-colors text-sm font-medium ${
                activeTab === 'new'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Start New
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`pb-3 border-b-2 transition-colors text-sm font-medium ${
                activeTab === 'templates'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <Layout className="w-4 h-4 inline mr-2" />
              My Templates ({userTemplates.length})
            </button>
          </div>
        </div>
        
        <div className="px-6 pb-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Start New Tab */}
          {activeTab === 'new' && (
            <div className="pt-4">
              {/* Info Banner */}
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <p className="font-medium mb-1">What's the difference?</p>
                    <p className="text-blue-700 dark:text-blue-300">
                      <strong>Templates</strong> are reusable single-page designs (headers, footers, logos) that can be applied to multiple pages. 
                      <strong className="ml-1">Editor</strong> is for creating and editing multi-page documents from scratch.
                    </p>
                  </div>
                </div>
              </div>

              {/* Mode Selection Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Template Creation Mode */}
                <button
                  onClick={() => handleSelect('template')}
                  className="relative flex flex-col items-center p-6 border-2 border-stone-200 dark:border-stone-700 rounded-xl hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all group"
                >
                  <div className="w-16 h-16 mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Layout className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-2 text-stone-900 dark:text-stone-100">
                    Create Template
                  </h3>
                  
                  <p className="text-sm text-stone-600 dark:text-stone-400 text-center">
                    Design a reusable template with custom headers, footers, and background elements
                  </p>

                  <div className="mt-4 text-xs text-stone-500 dark:text-stone-500">
                    <ul className="space-y-1">
                      <li>✓ Single-page design</li>
                      <li>✓ Reusable across documents</li>
                      <li>✓ Headers & footers</li>
                    </ul>
                  </div>
                </button>

                {/* Full Editor Mode */}
                <button
                  onClick={() => handleSelect('editor')}
                  className="relative flex flex-col items-center p-6 border-2 border-stone-200 dark:border-stone-700 rounded-xl hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-950/20 transition-all group"
                >
                  <div className="w-16 h-16 mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileEdit className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-2 text-stone-900 dark:text-stone-100">
                    Use Full Editor
                  </h3>
                  
                  <p className="text-sm text-stone-600 dark:text-stone-400 text-center">
                    Multi-page canvas editor with complete design freedom and all features
                  </p>

                  <div className="mt-4 text-xs text-stone-500 dark:text-stone-500">
                    <ul className="space-y-1">
                      <li>✓ Multi-page documents</li>
                      <li>✓ Full editing tools</li>
                      <li>✓ Upload & layers</li>
                    </ul>
                  </div>
                </button>
              </div>

              {/* Footer Note */}
              <div className="mt-6 text-center text-xs text-stone-500 dark:text-stone-400">
                You can change modes anytime by returning to this page
              </div>

              {/* Skip Button */}
              <div className="mt-4 text-center">
                <button
                  onClick={onClose}
                  className="text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 underline"
                >
                  Skip and use default editor
                </button>
              </div>
            </div>
          )}

          {/* My Templates Tab */}
          {activeTab === 'templates' && (
            <div className="pt-4">
              {userTemplates.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
                    <Layout className="w-10 h-10 text-stone-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">
                    No templates yet
                  </h3>
                  <p className="text-sm text-stone-600 dark:text-stone-400 mb-6">
                    Create your first template to get started
                  </p>
                  <Button
                    onClick={() => handleSelect('template')}
                    className="gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Create Template
                  </Button>
                </div>
              ) : (
                <>
                  {/* Templates Grid - Horizontally Scrollable */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-stone-700 dark:text-stone-300">
                        Select a template to load
                      </h3>
                      <span className="text-xs text-stone-500">
                        {userTemplates.length} template{userTemplates.length !== 1 ? 's' : ''}
                      </span>
                    </div>

                    {/* Horizontal Scroll Container */}
                    <div className="relative">
                      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-stone-300 dark:scrollbar-thumb-stone-700 scrollbar-track-transparent">
                        {userTemplates.map((template) => (
                          <div
                            key={template.id}
                            className={`flex-shrink-0 w-64 snap-start ${
                              selectedTemplateId === template.id
                                ? 'ring-2 ring-blue-500 ring-offset-2 rounded-lg'
                                : ''
                            }`}
                          >
                            {/* Template Card */}
                            <div
                              onClick={() => handleTemplateSelect(template)}
                              className="relative aspect-[3/4] rounded-lg overflow-hidden border-2 border-stone-200 dark:border-stone-700 hover:border-blue-400 transition-all bg-white dark:bg-stone-800 cursor-pointer group"
                            >
                              {/* Template Thumbnail */}
                              {template.thumbnail ? (
                                <img
                                  src={template.thumbnail}
                                  alt={template.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
                                  <Layout className="w-16 h-16 text-blue-300 dark:text-blue-700" />
                                </div>
                              )}

                              {/* Hover Overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                  <p className="text-sm font-medium">Click to select</p>
                                </div>
                              </div>

                              {/* Delete Button */}
                              <button
                                onClick={(e) => handleDeleteTemplate(e, template.id)}
                                className="absolute top-2 right-2 p-2 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all shadow-lg z-10"
                                title="Delete template"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>

                              {/* Selected Indicator */}
                              {selectedTemplateId === template.id && (
                                <div className="absolute top-2 left-2 p-2 rounded-full bg-blue-500 text-white shadow-lg pointer-events-none">
                                  <ChevronRight className="w-4 h-4" />
                                </div>
                              )}
                            </div>

                            {/* Template Info */}
                            <div className="mt-3 text-left">
                              <h4 className="font-semibold text-sm text-stone-900 dark:text-stone-100 truncate">
                                {template.name}
                              </h4>
                              <div className="flex items-center gap-2 mt-1 text-xs text-stone-500 dark:text-stone-400">
                                <Clock className="w-3 h-3" />
                                <span>{formatDate(template.updatedAt)}</span>
                              </div>
                              {template.description && (
                                <p className="mt-1 text-xs text-stone-600 dark:text-stone-400 line-clamp-2">
                                  {template.description}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-stone-200 dark:border-stone-700">
                      <Button
                        variant="outline"
                        onClick={() => setActiveTab('new')}
                        className="gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Create New Template
                      </Button>
                      
                      <Button
                        onClick={handleLoadTemplate}
                        disabled={!selectedTemplateId}
                        className="gap-2 bg-green-600 hover:bg-green-700"
                      >
                        Load Template
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}