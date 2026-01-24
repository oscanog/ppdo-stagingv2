// app/dashboard/project/[year]/components/hooks/usePrintPreviewActions.ts (NEW FILE)

import { useCallback } from 'react';
import { Page, HeaderFooter, CanvasElement } from '@/app/(extra)/canvas/_components/editor/types';

interface UsePrintPreviewActionsProps {
  currentPageIndex: number;
  header: HeaderFooter;
  footer: HeaderFooter;
  setPages: (updater: (prev: Page[]) => Page[]) => void;
  setHeader: (updater: (prev: HeaderFooter) => HeaderFooter) => void;
  setFooter: (updater: (prev: HeaderFooter) => HeaderFooter) => void;
  setSelectedElementId: (id: string | null) => void;
  setIsDirty: (dirty: boolean) => void;
}

export function usePrintPreviewActions({
  currentPageIndex,
  header,
  footer,
  setPages,
  setHeader,
  setFooter,
  setSelectedElementId,
  setIsDirty,
}: UsePrintPreviewActionsProps) {
  
  const updateElement = useCallback(
    (id: string, updates: Partial<CanvasElement>) => {
      const isInHeader = header.elements.some((el) => el.id === id);
      if (isInHeader) {
        setHeader((prev) => ({
          ...prev,
          elements: prev.elements.map((el) =>
            el.id === id ? ({ ...el, ...updates } as any) : el
          ),
        }));
        setIsDirty(true);
        return;
      }

      const isInFooter = footer.elements.some((el) => el.id === id);
      if (isInFooter) {
        setFooter((prev) => ({
          ...prev,
          elements: prev.elements.map((el) =>
            el.id === id ? ({ ...el, ...updates } as any) : el
          ),
        }));
        setIsDirty(true);
        return;
      }

      setPages((prev) =>
        prev.map((page, idx) =>
          idx === currentPageIndex
            ? {
                ...page,
                elements: page.elements.map((el) =>
                  el.id === id ? ({ ...el, ...updates } as any) : el
                ),
              }
            : page
        )
      );
      setIsDirty(true);
    },
    [currentPageIndex, header, footer, setPages, setHeader, setFooter, setIsDirty]
  );

  const deleteElement = useCallback(
    (id: string) => {
      const isInHeader = header.elements.some((el) => el.id === id);
      if (isInHeader) {
        setHeader((prev) => ({
          ...prev,
          elements: prev.elements.filter((el) => el.id !== id),
        }));
        setSelectedElementId(null);
        setIsDirty(true);
        return;
      }

      const isInFooter = footer.elements.some((el) => el.id === id);
      if (isInFooter) {
        setFooter((prev) => ({
          ...prev,
          elements: prev.elements.filter((el) => el.id !== id),
        }));
        setSelectedElementId(null);
        setIsDirty(true);
        return;
      }

      setPages((prev) =>
        prev.map((page, idx) =>
          idx === currentPageIndex
            ? { ...page, elements: page.elements.filter((el) => el.id !== id) }
            : page
        )
      );
      setSelectedElementId(null);
      setIsDirty(true);
    },
    [currentPageIndex, header, footer, setPages, setHeader, setFooter, setSelectedElementId, setIsDirty]
  );

  const changePageSize = useCallback(
    (size: 'A4' | 'Short' | 'Long') => {
      setPages((prev) => prev.map((page) => ({ ...page, size })));
      setIsDirty(true);
    },
    [setPages, setIsDirty]
  );

  const changeOrientation = useCallback(
    (orientation: 'portrait' | 'landscape') => {
      setPages((prev) => prev.map((page) => ({ ...page, orientation })));
      setIsDirty(true);
    },
    [setPages, setIsDirty]
  );

  const reorderElements = useCallback(
    (fromIndex: number, toIndex: number) => {
      setPages((prev) =>
        prev.map((page, idx) => {
          if (idx !== currentPageIndex) return page;
          const newElements = [...page.elements];
          const [movedElement] = newElements.splice(fromIndex, 1);
          newElements.splice(toIndex, 0, movedElement);
          return { ...page, elements: newElements };
        })
      );
      setIsDirty(true);
    },
    [currentPageIndex, setPages, setIsDirty]
  );

  const updateHeaderBackground = useCallback(
    (color: string) => {
      setHeader((prev) => ({ ...prev, backgroundColor: color }));
      setIsDirty(true);
    },
    [setHeader, setIsDirty]
  );

  const updateFooterBackground = useCallback(
    (color: string) => {
      setFooter((prev) => ({ ...prev, backgroundColor: color }));
      setIsDirty(true);
    },
    [setFooter, setIsDirty]
  );

  const updatePageBackground = useCallback(
    (color: string) => {
      setPages((prev) =>
        prev.map((p, i) => (i === currentPageIndex ? { ...p, backgroundColor: color } : p))
      );
      setIsDirty(true);
    },
    [currentPageIndex, setPages, setIsDirty]
  );

  return {
    updateElement,
    deleteElement,
    changePageSize,
    changeOrientation,
    reorderElements,
    updateHeaderBackground,
    updateFooterBackground,
    updatePageBackground,
  };
}