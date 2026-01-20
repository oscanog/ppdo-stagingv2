// services/export/printUtils.ts
// NEW FILE - CREATE THIS

/**
 * Print configuration interface
 */
export interface PrintConfig {
  title: string;
  subtitle?: string;
  showDate?: boolean;
  customStyles?: string;
  beforePrint?: () => void;
  afterPrint?: () => void;
}

/**
 * Triggers browser print dialog with custom configuration
 * 
 * @param config - Print configuration
 * 
 * @example
 * ```typescript
 * printDocument({
 *   title: "Budget Tracking Report",
 *   subtitle: "Generated on 2024-01-18",
 *   showDate: true,
 *   beforePrint: () => setLoading(true),
 *   afterPrint: () => setLoading(false),
 * });
 * ```
 */
export function printDocument(config?: PrintConfig): void {
  // Execute before print callback
  config?.beforePrint?.();

  // Add custom styles if provided
  if (config?.customStyles) {
    injectPrintStyles(config.customStyles);
  }

  // Trigger print
  window.print();

  // Execute after print callback
  // Note: This runs immediately after print() is called, not after printing is complete
  // Use window.matchMedia for true after-print detection
  config?.afterPrint?.();
}

/**
 * Injects custom styles for printing
 * 
 * @param styles - CSS string to inject
 */
function injectPrintStyles(styles: string): void {
  const styleId = "custom-print-styles";
  
  // Remove existing custom styles
  const existing = document.getElementById(styleId);
  if (existing) {
    existing.remove();
  }

  // Inject new styles
  const styleElement = document.createElement("style");
  styleElement.id = styleId;
  styleElement.textContent = `@media print { ${styles} }`;
  document.head.appendChild(styleElement);
}

/**
 * Formats data for print view
 * Removes interactive elements and formats for paper
 * 
 * @param title - Document title
 * @param subtitle - Optional subtitle
 * @returns HTML string for print
 */
export function formatForPrint(
  title: string,
  subtitle?: string
): string {
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return `
    <div class="print-header">
      <h2>${title}</h2>
      ${subtitle ? `<p>${subtitle}</p>` : ""}
      <p class="print-date">Generated on: ${date}</p>
    </div>
  `;
}

/**
 * Configures print event listeners
 * Useful for tracking when user prints/cancels
 * 
 * @param onBeforePrint - Callback before print
 * @param onAfterPrint - Callback after print
 * @returns Cleanup function
 */
export function setupPrintListeners(
  onBeforePrint?: () => void,
  onAfterPrint?: () => void
): () => void {
  const beforePrintHandler = () => {
    onBeforePrint?.();
  };

  const afterPrintHandler = () => {
    onAfterPrint?.();
  };

  window.addEventListener("beforeprint", beforePrintHandler);
  window.addEventListener("afterprint", afterPrintHandler);

  // Return cleanup function
  return () => {
    window.removeEventListener("beforeprint", beforePrintHandler);
    window.removeEventListener("afterprint", afterPrintHandler);
  };
}

/**
 * Creates print-optimized styles for tables
 * 
 * @returns CSS string for print styles
 */
export function getTablePrintStyles(): string {
  return `
    /* Hide interactive elements */
    .no-print {
      display: none !important;
    }

    /* Table styles */
    table {
      width: 100% !important;
      font-size: 10pt !important;
      border-collapse: collapse !important;
    }

    thead {
      display: table-header-group !important;
    }

    tbody tr {
      page-break-inside: avoid !important;
    }

    /* Ensure colors are visible */
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    /* Page margins */
    @page {
      margin: 1cm;
      size: landscape;
    }
  `;
}

/**
 * Budget-specific print configuration
 */
export function createBudgetPrintConfig(): PrintConfig {
  return {
    title: "Budget Tracking Report",
    showDate: true,
    customStyles: getTablePrintStyles(),
  };
}

/**
 * Project-specific print configuration
 */
export function createProjectPrintConfig(particular: string): PrintConfig {
  return {
    title: `Project Tracking: ${particular}`,
    showDate: true,
    customStyles: getTablePrintStyles(),
  };
}