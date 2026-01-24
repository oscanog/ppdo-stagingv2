// app/(extra)/canvas/page.tsx (ROBUST FIX - Completely rewritten flow)

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Editor from './_components/editor';
import TemplateCreator from './_components/TemplateCreator';
import { CanvasModeModal } from './_components/CanvasModeModal';
import { CloseConfirmationModal } from './_components/CloseConfirmationModal';
import { useTemplateStorage } from './_components/editor/hooks/useTemplateStorage';
import { CanvasTemplate } from './_components/editor/types/template';
import { safeLoadTemplate } from '@/lib/canvas-utils';

type CanvasMode = 'template' | 'editor' | null;

const CANVAS_MODE_KEY = 'canvas-preferred-mode';
const CANVAS_MODE_SELECTED_KEY = 'canvas-mode-has-been-selected';

export default function CanvasPage() {
  const router = useRouter();
  const { getTemplate } = useTemplateStorage();
  
  const [mode, setMode] = useState<CanvasMode>(null);
  const [showModeModal, setShowModeModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  
  // Template loading state
  const [templateToLoad, setTemplateToLoad] = useState<CanvasTemplate | null>(null);
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);

  useEffect(() => {
    const hasSelectedMode = localStorage.getItem(CANVAS_MODE_SELECTED_KEY);
    const savedMode = localStorage.getItem(CANVAS_MODE_KEY);
    
    if (hasSelectedMode === 'true' && (savedMode === 'template' || savedMode === 'editor')) {
      setMode(savedMode as CanvasMode);
    } else {
      setShowModeModal(true);
    }
    
    setIsHydrated(true);
  }, []);

  const handleModeSelect = (selectedMode: 'template' | 'editor') => {
    console.log('%c🎯 Mode selected:', 'font-weight: bold; color: #2196F3;', selectedMode);
    setMode(selectedMode);
    setTemplateToLoad(null); // Clear any template when selecting mode directly
    localStorage.setItem(CANVAS_MODE_KEY, selectedMode);
    localStorage.setItem(CANVAS_MODE_SELECTED_KEY, 'true');
    setShowModeModal(false);
  };

  const handleLoadTemplate = (templateId: string) => {
    console.log('%c🚀 LOAD TEMPLATE BUTTON CLICKED', 'font-weight: bold; font-size: 16px; color: #4FBA76; background: #000; padding: 4px 8px; border-radius: 4px;');
    console.log('%cTemplate ID: ' + templateId, 'font-weight: bold; color: #4FBA76;');
    
    setIsLoadingTemplate(true);
    setShowModeModal(false);
    
    // Load template data immediately
    setTimeout(() => {
      const template = getTemplate(templateId);
      console.log('%c📦 Retrieved template:', 'font-weight: bold; color: #2196F3;', template);
      
      if (template) {
        try {
          const normalized = safeLoadTemplate(template);
          console.log('%c✅ Template normalized:', 'font-weight: bold; color: #4CAF50;', normalized);
          console.log('%c  - Page background:', 'color: #4CAF50;', normalized.page.backgroundColor);
          
          // Set template data and mode
          setTemplateToLoad(normalized);
          setMode('template');
          
          localStorage.setItem(CANVAS_MODE_KEY, 'template');
          localStorage.setItem(CANVAS_MODE_SELECTED_KEY, 'true');
        } catch (error) {
          console.error('%c❌ Failed to normalize template:', 'font-weight: bold; color: #F44336;', error);
          setTemplateToLoad(null);
          setMode('template'); // Still go to template mode, just without data
        }
      } else {
        console.error('%c❌ Template not found!', 'font-weight: bold; color: #F44336;');
        setTemplateToLoad(null);
        setMode('template');
      }
      
      setIsLoadingTemplate(false);
    }, 500);
  };

  const handleBackToModeSelection = () => {
    setMode(null);
    setTemplateToLoad(null);
    setShowModeModal(true);
  };

  const handleCloseClick = () => {
    setShowCloseModal(true);
  };

  const handleSaveAndClose = () => {
    setShowCloseModal(false);
    router.push('/dashboard');
  };

  const handleDiscardAndClose = () => {
    localStorage.removeItem('canvas-editor-state');
    localStorage.removeItem('canvas-templates');
    localStorage.removeItem(CANVAS_MODE_KEY);
    localStorage.removeItem(CANVAS_MODE_SELECTED_KEY);
    
    setShowCloseModal(false);
    router.push('/dashboard');
  };

  const handleCancelClose = () => {
    setShowCloseModal(false);
  };

  const handleModeModalClose = () => {
    if (!mode) {
      setMode('editor');
      localStorage.setItem(CANVAS_MODE_KEY, 'editor');
      localStorage.setItem(CANVAS_MODE_SELECTED_KEY, 'true');
    }
    setShowModeModal(false);
  };

  // Loading screen
  if (!isHydrated) {
    return (
      <div className="h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-900">
        <div className="text-center">
          <div className="animate-pulse mb-4">
            <div className="w-16 h-16 bg-stone-200 dark:bg-stone-700 rounded-full mx-auto"></div>
          </div>
          <p className="text-stone-600 dark:text-stone-400">Loading canvas...</p>
        </div>
      </div>
    );
  }

  // Show loading screen while loading template
  if (isLoadingTemplate) {
    return (
      <div className="h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-900">
        <div className="text-center">
          <div className="mb-6">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 border-4 border-stone-200 dark:border-stone-700 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
              <div className="absolute inset-3 bg-blue-100 dark:bg-blue-900/30 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-10 h-10 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>
          <p className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">
            Loading Template
          </p>
          <p className="text-sm text-stone-600 dark:text-stone-400">
            Preparing your template...
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  // Template mode
  if (mode === 'template') {
    console.log('%c🎯 RENDERING TEMPLATE CREATOR', 'font-weight: bold; font-size: 14px; color: #9C27B0; background: #000; padding: 4px 8px; border-radius: 4px;');
    console.log('%cTemplate to pass:', 'font-weight: bold; color: #9C27B0;', templateToLoad);
    console.log('%cTemplate ID:', 'font-weight: bold; color: #9C27B0;', templateToLoad?.id);
    console.log('%cPage background:', 'font-weight: bold; color: #9C27B0;', templateToLoad?.page?.backgroundColor);
    
    return (
      <>
        <TemplateCreator 
          key={templateToLoad?.id || 'new-template'}
          onBack={handleBackToModeSelection}
          onClose={handleCloseClick}
          templateData={templateToLoad}
        />
        <CloseConfirmationModal
          isOpen={showCloseModal}
          onSave={handleSaveAndClose}
          onDiscard={handleDiscardAndClose}
          onCancel={handleCancelClose}
        />
      </>
    );
  }

  // Editor mode
  if (mode === 'editor') {
    console.log('%c🎯 RENDERING EDITOR', 'font-weight: bold; font-size: 14px; color: #FF5722; background: #000; padding: 4px 8px; border-radius: 4px;');
    return (
      <>
        <Editor onClose={handleCloseClick} />
        <CloseConfirmationModal
          isOpen={showCloseModal}
          onSave={handleSaveAndClose}
          onDiscard={handleDiscardAndClose}
          onCancel={handleCancelClose}
        />
      </>
    );
  }

  // Mode selection screen
  return (
    <>
      <div className="h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-900">
        <div className="text-center">
          <p className="text-stone-600 dark:text-stone-400 text-sm">
            Choose a mode to get started
          </p>
        </div>
      </div>

      <CanvasModeModal
        isOpen={showModeModal}
        onClose={handleModeModalClose}
        onSelectMode={handleModeSelect}
        onLoadTemplate={handleLoadTemplate}
      />
    </>
  );
}