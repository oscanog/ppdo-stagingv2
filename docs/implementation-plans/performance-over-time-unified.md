# Implementation Plan: Unified Performance Over Time Chart

> **Objective:** Combine Budget, Projects, and Breakdown data into a unified "Performance Over Time" experience with rich hover interactions  
> **Scope:** Budget fund type only (Trust, SEF, SHF, 20% DF to follow)  
> **Priority:** High  
> **Estimated Effort:** 3-4 days  
> *Version: 1.0 | Created: February 2026*

---

## Executive Summary

Transform the current `TimeSeriesChart` from a simple single-metric line chart into a **comprehensive unified dashboard** that reveals the full relationship between:
- **Budget Items** (top-level allocations)
- **Projects** (initiatives under budget)
- **Breakdowns** (detailed project components)

### Current State vs. Proposed

```
CURRENT:
┌─────────────────────────────────────────┐
│ Performance Over Time                   │
├─────────────────────────────────────────┤
│ [Budget] [Projects]  [Monthly] [Qtr]   │
│                                         │
│      ╭──╮                               │
│     ╱    ╲    Simple line only         │
│ ───╯      ╰────                         │
│ Jan  Feb  Mar  Apr                      │
│                                         │
│ Tooltip: "₱100,000"                    │
└─────────────────────────────────────────┘

PROPOSED:
┌─────────────────────────────────────────┐
│ Performance Over Time                   │
├─────────────────────────────────────────┤
│ [Unified] [Budget] [Projects] [Breakdowns] [Monthly] [Qtr]
│                                         │
│      ╭──╮                               │
│  ───╱ ⚫ ╲──╮  ← Hover reveals rich     │
│     ╰──────╯    multi-layer tooltip    │
│ Jan  Feb  [Mar]  Apr                    │
│           ↑                             │
│  ┌────────┴────────────────────────┐   │
│  │  MARCH 2025 SUMMARY             │   │
│  ├─────────────────────────────────┤   │
│  │  📊 BUDGET                      │   │
│  │  • Allocated: ₱5,000,000       │   │
│  │  • Obligated: ₱3,200,000       │   │
│  │  • Utilized:  ₱2,100,000       │   │
│  │                                 │   │
│  │  📁 PROJECTS (12 total)         │   │
│  │  • Ongoing: 8                   │   │
│  │  • Completed: 3                 │   │
│  │  • Delayed: 1                   │   │
│  │                                 │   │
│  │  🔧 BREAKDOWNS (45 total)       │   │
│  │  • With Inspections: 32         │   │
│  │  • Pending: 13                  │   │
│  │                                 │   │
│  │  [View Details →]               │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

---

## Phase 1: UI/UX Design & Architecture

### 1.1 Tab Structure Redesign

#### New Tab Layout

```
┌────────────────────────────────────────────────────────────────┐
│ PRIMARY METRIC TABS          │  VIEW GRANULARITY               │
├──────────────────────────────┼─────────────────────────────────┤
│                              │                                 │
│  [👁 Unified]  [💰 Budget]   │   [📅 Monthly]  [📊 Quarterly]  │
│  [📁 Projects] [🔧Breakdowns]│                                 │
│                              │                                 │
└──────────────────────────────┴─────────────────────────────────┘
```

#### Tab Definitions

| Tab | Icon | Description | Data Shown |
|-----|------|-------------|------------|
| **Unified** | 👁 | All metrics overlaid | Budget line + Project count + Breakdown count |
| **Budget** | 💰 | Financial metrics only | Allocated, Obligated, Utilized (3 lines) |
| **Projects** | 📁 | Project lifecycle | Total, Ongoing, Completed, Delayed (4 lines) |
| **Breakdowns** | 🔧 | Breakdown status | Total, With Inspections, Pending (3 lines) |

### 1.2 Enhanced Tooltip Design

#### Hover State Specification

```typescript
interface RichTooltipData {
  // Time Period
  period: {
    label: string;           // "March 2025" or "Q1 2025"
    startDate: number;       // Timestamp
    endDate: number;         // Timestamp
  };
  
  // Budget Summary
  budget: {
    allocated: number;
    obligated: number;
    utilized: number;
    obligationRate: number;  // %
    utilizationRate: number; // %
    items: Array<{
      id: string;
      name: string;
      allocated: number;
    }>;  // Top 5 items
  };
  
  // Projects Summary
  projects: {
    total: number;
    ongoing: number;
    completed: number;
    delayed: number;
    draft: number;
    list: Array<{
      id: string;
      name: string;
      status: string;
      office: string;
    }>;  // Recent 5 projects
  };
  
  // Breakdowns Summary
  breakdowns: {
    total: number;
    withInspections: number;
    pending: number;
    totalBudget: number;
  };
}
```

#### Tooltip UI Mockup

```
┌─────────────────────────────────────────────────────┐
│  📅 MARCH 2025                                      │
│  January 1 - January 31, 2025                       │
├─────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────┐   │
│  │ 💰 FINANCIAL SUMMARY                        │   │
│  ├─────────────────────────────────────────────┤   │
│  │                                             │   │
│  │  Total Allocated     ₱5,000,000            │   │
│  │  ├─ Obligated       ₱3,200,000 (64%)       │   │
│  │  └─ Utilized        ₱2,100,000 (42%)       │   │
│  │                                             │   │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━            │   │
│  │  ████████████████████░░░░░░░░░░  64% obl.  │   │
│  │  █████████████░░░░░░░░░░░░░░░░░  42% util. │   │
│  │                                             │   │
│  └─────────────────────────────────────────────┘   │
│                                                    │
│  ┌─────────────────────────────────────────────┐   │
│  │ 📁 PROJECTS (12 Total)                      │   │
│  ├─────────────────────────────────────────────┤   │
│  │                                             │   │
│  │  Status Breakdown:                          │   │
│  │  ● Ongoing    8  ████████████████████░░░░░ │   │
│  │  ● Completed  3  ███████░░░░░░░░░░░░░░░░░░░ │   │
│  │  ● Delayed    1  ██░░░░░░░░░░░░░░░░░░░░░░░░ │   │
│  │                                             │   │
│  │  Recent Projects:                           │   │
│  │  • Road Rehabilitation - Ongoing           │   │
│  │  • School Building #3 - Completed          │   │
│  │  • Health Center Upgrade - Delayed         │   │
│  │                                             │   │
│  └─────────────────────────────────────────────┘   │
│                                                    │
│  ┌─────────────────────────────────────────────┐   │
│  │ 🔧 BREAKDOWNS (45 Total)                    │   │
│  ├─────────────────────────────────────────────┤   │
│  │                                             │   │
│  │  With Inspections: 32 (71%)                │   │
│  │  Pending: 13 (29%)                         │   │
│  │                                             │   │
│  │  Total Breakdown Budget: ₱3,200,000        │   │
│  │                                             │   │
│  └─────────────────────────────────────────────┘   │
│                                                    │
│  ┌─────────────────────────────────────────────┐   │
│  │ [🔗 View Full Details]  [📊 Export Report]  │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

### 1.3 Interactive Elements

#### Click Actions

| Element | Action | Destination |
|---------|--------|-------------|
| Data point | Open detail drawer | Slide-out panel with full list |
| "View Full Details" | Navigate to filtered view | `/dashboard/project/2025?month=3` |
| Project name | Navigate to project | `/dashboard/project/2025/{id}` |
| Budget item | Navigate to particulars | `/dashboard/particulars?item={id}` |

---

## Phase 2: Data Architecture

### 2.1 Backend Query Enhancement

#### New Types (convex/dashboard.ts)

```typescript
// Enhanced time series with full detail
interface TimeSeriesPoint {
  // Time identifier
  month?: number;        // 1-12 (for monthly view)
  quarter?: number;      // 1-4 (for quarterly view)
  label: string;         // "Jan" or "Q1"
  
  // Aggregated metrics
  metrics: {
    budget: {
      allocated: number;
      obligated: number;
      utilized: number;
    };
    projects: {
      total: number;
      ongoing: number;
      completed: number;
      delayed: number;
      draft: number;
    };
    breakdowns: {
      total: number;
      withInspections: number;
      pending: number;
      totalBudget: number;
    };
  };
  
  // Full detail data for tooltips (lazy loaded)
  details?: {
    budgetItems: Array<{
      _id: Id<"budgetItems">;
      particulars: string;
      allocated: number;
      obligated: number;
      utilized: number;
    }>;
    projects: Array<{
      _id: Id<"projects">;
      particulars: string;
      status: string;
      implementingOffice?: string;
      totalBudgetAllocated: number;
    }>;
    breakdowns: Array<{
      _id: Id<"govtProjectBreakdowns">;
      projectId: Id<"projects">;
      description: string;
      hasInspection: boolean;
    }>;
  };
}

interface EnhancedTimeSeriesData {
  monthly: TimeSeriesPoint[];
  quarterly: TimeSeriesPoint[];
}
```

#### Enhanced Calculation Function

```typescript
// convex/dashboard.ts

function calculateEnhancedTimeSeries(
  projects: NormalizedProject[],
  budgetItems: NormalizedBudgetItem[],
  breakdowns: NormalizedBreakdown[],
  filters: FilterCriteria
): EnhancedTimeSeriesData {
  
  // Initialize 12 months and 4 quarters with full structure
  const series: EnhancedTimeSeriesData = {
    monthly: Array(12).fill(0).map((_, i) => ({
      month: i + 1,
      label: new Date(2024, i).toLocaleString("default", { month: "short" }),
      metrics: {
        budget: { allocated: 0, obligated: 0, utilized: 0 },
        projects: { total: 0, ongoing: 0, completed: 0, delayed: 0, draft: 0 },
        breakdowns: { total: 0, withInspections: 0, pending: 0, totalBudget: 0 },
      },
      details: {
        budgetItems: [],
        projects: [],
        breakdowns: [],
      },
    })),
    quarterly: Array(4).fill(0).map((_, i) => ({
      quarter: i + 1,
      label: `Q${i + 1}`,
      metrics: {
        budget: { allocated: 0, obligated: 0, utilized: 0 },
        projects: { total: 0, ongoing: 0, completed: 0, delayed: 0, draft: 0 },
        breakdowns: { total: 0, withInspections: 0, pending: 0, totalBudget: 0 },
      },
      details: {
        budgetItems: [],
        projects: [],
        breakdowns: [],
      },
    })),
  };
  
  // Aggregate budget items
  budgetItems.forEach(item => {
    const date = new Date(item.createdAt);
    const month = date.getMonth();           // 0-11
    const quarter = Math.floor(month / 3);   // 0-3
    
    // Monthly aggregation
    const m = series.monthly[month];
    m.metrics.budget.allocated += item.totalBudgetAllocated || 0;
    m.metrics.budget.obligated += item.obligatedBudget || 0;
    m.metrics.budget.utilized += item.totalBudgetUtilized || 0;
    m.details.budgetItems.push({
      _id: item._id,
      particulars: item.particulars,
      allocated: item.totalBudgetAllocated || 0,
      obligated: item.obligatedBudget || 0,
      utilized: item.totalBudgetUtilized || 0,
    });
    
    // Quarterly aggregation
    const q = series.quarterly[quarter];
    q.metrics.budget.allocated += item.totalBudgetAllocated || 0;
    q.metrics.budget.obligated += item.obligatedBudget || 0;
    q.metrics.budget.utilized += item.totalBudgetUtilized || 0;
  });
  
  // Aggregate projects with status breakdown
  projects.forEach(project => {
    const date = new Date(project.createdAt);
    const month = date.getMonth();
    const quarter = Math.floor(month / 3);
    
    const status = project.status?.toLowerCase();
    
    // Monthly
    const m = series.monthly[month];
    m.metrics.projects.total++;
    if (status === 'ongoing') m.metrics.projects.ongoing++;
    if (status === 'completed') m.metrics.projects.completed++;
    if (status === 'delayed') m.metrics.projects.delayed++;
    if (status === 'draft') m.metrics.projects.draft++;
    m.details.projects.push({
      _id: project._id,
      particulars: project.particulars,
      status: project.status,
      implementingOffice: project.implementingOffice,
      totalBudgetAllocated: project.totalBudgetAllocated,
    });
    
    // Quarterly
    const q = series.quarterly[quarter];
    q.metrics.projects.total++;
    if (status === 'ongoing') q.metrics.projects.ongoing++;
    if (status === 'completed') q.metrics.projects.completed++;
    if (status === 'delayed') q.metrics.projects.delayed++;
    if (status === 'draft') q.metrics.projects.draft++;
  });
  
  // Aggregate breakdowns with inspection status
  breakdowns.forEach(breakdown => {
    const date = new Date(breakdown.createdAt);
    const month = date.getMonth();
    const quarter = Math.floor(month / 3);
    
    const hasInspection = breakdown.inspections && breakdown.inspections.length > 0;
    
    // Monthly
    const m = series.monthly[month];
    m.metrics.breakdowns.total++;
    if (hasInspection) m.metrics.breakdowns.withInspections++;
    else m.metrics.breakdowns.pending++;
    m.metrics.breakdowns.totalBudget += breakdown.allocatedBudget || 0;
    
    // Quarterly
    const q = series.quarterly[quarter];
    q.metrics.breakdowns.total++;
    if (hasInspection) q.metrics.breakdowns.withInspections++;
    else q.metrics.breakdowns.pending++;
    q.metrics.breakdowns.totalBudget += breakdown.allocatedBudget || 0;
  });
  
  return series;
}
```

### 2.2 Data Fetching Strategy

#### Optimizations

| Strategy | Implementation | Benefit |
|----------|----------------|---------|
| **Lazy Detail Loading** | Details only fetched on hover | Reduces initial payload by ~60% |
| **Pagination** | Limit details to top 5 per category | Prevents tooltip overflow |
| **Caching** | Convex query caching | Instant revisits to same period |
| **Pre-aggregation** | Calculate on server | Minimizes client processing |

---

## Phase 3: Frontend Implementation

### 3.1 Component Architecture

```
EnhancedTimeSeriesChart
├── TabsHeader
│   ├── MetricTabs: [Unified] [Budget] [Projects] [Breakdowns]
│   └── ViewTabs: [Monthly] [Quarterly]
├── ChartArea
│   ├── ResponsiveContainer (Recharts)
│   │   ├── LineChart
│   │   │   ├── CartesianGrid
│   │   │   ├── XAxis
│   │   │   ├── YAxis (dual: left=currency, right=count)
│   │   │   ├── Tooltip → RichTooltipComponent
│   │   │   ├── Legend
│   │   │   └── Lines (1-4 lines based on tab)
│   │   └── Brush (range selector)
│   └── ChartOverlay (loading states)
└── DetailDrawer (slide-out panel)
    ├── PeriodHeader
    ├── BudgetSection
    ├── ProjectsSection
    └── BreakdownsSection
```

### 3.2 Component Specification

#### EnhancedTimeSeriesChart

```typescript
// components/analytics/EnhancedTimeSeriesChart.tsx

interface EnhancedTimeSeriesChartProps {
  data: EnhancedTimeSeriesData;
  year: number;
  filters: DashboardFilters;
}

type MetricTab = 'unified' | 'budget' | 'projects' | 'breakdowns';
type ViewTab = 'monthly' | 'quarterly';

export function EnhancedTimeSeriesChart({ 
  data, 
  year, 
  filters 
}: EnhancedTimeSeriesChartProps) {
  const [activeMetric, setActiveMetric] = useState<MetricTab>('unified');
  const [activeView, setActiveView] = useState<ViewTab>('monthly');
  const [selectedPeriod, setSelectedPeriod] = useState<TimeSeriesPoint | null>(null);
  
  // Chart configuration based on active metric
  const chartConfig = useMemo(() => {
    switch (activeMetric) {
      case 'unified':
        return {
          lines: [
            { key: 'budget.allocated', name: 'Budget', color: '#3b82f6', yAxisId: 'left' },
            { key: 'projects.total', name: 'Projects', color: '#8b5cf6', yAxisId: 'right' },
            { key: 'breakdowns.total', name: 'Breakdowns', color: '#f59e0b', yAxisId: 'right' },
          ],
        };
      case 'budget':
        return {
          lines: [
            { key: 'budget.allocated', name: 'Allocated', color: '#3b82f6' },
            { key: 'budget.obligated', name: 'Obligated', color: '#8b5cf6' },
            { key: 'budget.utilized', name: 'Utilized', color: '#10b981' },
          ],
        };
      case 'projects':
        return {
          lines: [
            { key: 'projects.ongoing', name: 'Ongoing', color: '#3b82f6' },
            { key: 'projects.completed', name: 'Completed', color: '#10b981' },
            { key: 'projects.delayed', name: 'Delayed', color: '#ef4444' },
            { key: 'projects.draft', name: 'Draft', color: '#6b7280' },
          ],
        };
      case 'breakdowns':
        return {
          lines: [
            { key: 'breakdowns.withInspections', name: 'With Inspections', color: '#10b981' },
            { key: 'breakdowns.pending', name: 'Pending', color: '#f59e0b' },
          ],
        };
    }
  }, [activeMetric]);
  
  return (
    <DashboardChartCard
      title="Performance Over Time"
      subtitle="Track budget, projects, and breakdowns"
    >
      <TabsHeader
        activeMetric={activeMetric}
        onMetricChange={setActiveMetric}
        activeView={activeView}
        onViewChange={setActiveView}
      />
      
      <ChartArea
        data={data[activeView]}
        config={chartConfig}
        onPointClick={setSelectedPeriod}
        renderTooltip={(point) => <RichTooltip data={point} />}
      />
      
      <DetailDrawer
        open={!!selectedPeriod}
        onClose={() => setSelectedPeriod(null)}
        data={selectedPeriod}
        year={year}
      />
    </DashboardChartCard>
  );
}
```

#### RichTooltip Component

```typescript
// components/analytics/RichTooltip.tsx

interface RichTooltipProps {
  data: TimeSeriesPoint;
  activeMetric: MetricTab;
}

export function RichTooltip({ data, activeMetric }: RichTooltipProps) {
  const { metrics, label, details } = data;
  
  return (
    <div className="w-[400px] max-h-[600px] overflow-auto">
      {/* Header */}
      <div className="border-b pb-3 mb-3">
        <h3 className="text-lg font-bold">{label} {year}</h3>
        <p className="text-sm text-muted-foreground">
          Click for full details
        </p>
      </div>
      
      {/* Financial Summary */}
      <TooltipSection 
        title="💰 Financial Summary" 
        icon={Wallet}
        highlight={activeMetric === 'budget'}
      >
        <div className="space-y-2">
          <MetricRow 
            label="Allocated" 
            value={metrics.budget.allocated}
            format="currency"
          />
          <MetricRow 
            label="Obligated" 
            value={metrics.budget.obligated}
            format="currency"
            subValue={`${(metrics.budget.obligated / metrics.budget.allocated * 100).toFixed(1)}%`}
            progress={metrics.budget.obligated / metrics.budget.allocated}
          />
          <MetricRow 
            label="Utilized" 
            value={metrics.budget.utilized}
            format="currency"
            subValue={`${(metrics.budget.utilized / metrics.budget.allocated * 100).toFixed(1)}%`}
            progress={metrics.budget.utilized / metrics.budget.allocated}
            progressColor="green"
          />
        </div>
      </TooltipSection>
      
      {/* Projects Summary */}
      <TooltipSection 
        title={`📁 Projects (${metrics.projects.total})`}
        icon={Folder}
        highlight={activeMetric === 'projects'}
      >
        <div className="space-y-2">
          <StatusBar 
            label="Ongoing" 
            count={metrics.projects.ongoing}
            total={metrics.projects.total}
            color="blue"
          />
          <StatusBar 
            label="Completed" 
            count={metrics.projects.completed}
            total={metrics.projects.total}
            color="green"
          />
          <StatusBar 
            label="Delayed" 
            count={metrics.projects.delayed}
            total={metrics.projects.total}
            color="red"
          />
        </div>
        
        {/* Recent Projects List */}
        {details.projects.length > 0 && (
          <div className="mt-3 pt-3 border-t">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Recent Projects
            </p>
            <div className="space-y-1">
              {details.projects.slice(0, 3).map(project => (
                <ProjectListItem key={project._id} project={project} />
              ))}
            </div>
          </div>
        )}
      </TooltipSection>
      
      {/* Breakdowns Summary */}
      <TooltipSection 
        title={`🔧 Breakdowns (${metrics.breakdowns.total})`}
        icon={Wrench}
        highlight={activeMetric === 'breakdowns'}
      >
        <div className="grid grid-cols-2 gap-2">
          <StatCard
            label="With Inspections"
            value={metrics.breakdowns.withInspections}
            icon={CheckCircle}
            color="green"
          />
          <StatCard
            label="Pending"
            value={metrics.breakdowns.pending}
            icon={Clock}
            color="amber"
          />
        </div>
      </TooltipSection>
      
      {/* Actions */}
      <div className="flex gap-2 mt-4 pt-3 border-t">
        <Button size="sm" variant="outline" className="flex-1">
          <ExternalLink className="w-4 h-4 mr-1" />
          View Details
        </Button>
        <Button size="sm" variant="outline" className="flex-1">
          <Download className="w-4 h-4 mr-1" />
          Export
        </Button>
      </div>
    </div>
  );
}
```

### 3.3 Styling Specifications

#### Color System

```typescript
// Unified theme colors
const COLORS = {
  budget: {
    allocated: '#3b82f6',   // Blue 500
    obligated: '#8b5cf6',   // Violet 500
    utilized: '#10b981',    // Emerald 500
  },
  projects: {
    ongoing: '#3b82f6',     // Blue 500
    completed: '#10b981',   // Emerald 500
    delayed: '#ef4444',     // Red 500
    draft: '#6b7280',       // Gray 500
  },
  breakdowns: {
    withInspections: '#10b981',  // Emerald 500
    pending: '#f59e0b',          // Amber 500
  },
};
```

#### Animation Specs

| Animation | Duration | Easing | Trigger |
|-----------|----------|--------|---------|
| Tab switch | 300ms | ease-in-out | Click |
| Tooltip appear | 150ms | ease-out | Hover |
| Tooltip content stagger | 50ms each | ease-out | Tooltip open |
| Line transition | 400ms | cubic-bezier(0.4, 0, 0.2, 1) | Tab change |
| Drawer slide | 300ms | ease-out | Point click |

---

## Phase 4: Detail Drawer Implementation

### 4.1 Slide-out Panel Design

```typescript
// components/analytics/PeriodDetailDrawer.tsx

interface PeriodDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  data: TimeSeriesPoint;
  year: number;
}

export function PeriodDetailDrawer({ 
  open, 
  onClose, 
  data, 
  year 
}: PeriodDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'budget' | 'projects' | 'breakdowns'>('overview');
  
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-[600px] sm:max-w-[600px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {data.label} {year} Details
          </SheetTitle>
          <SheetDescription>
            Complete breakdown of all activity
          </SheetDescription>
        </SheetHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="budget">Budget</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="breakdowns">Breakdowns</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <OverviewTab data={data} />
          </TabsContent>
          
          <TabsContent value="budget">
            <BudgetDetailTab items={data.details.budgetItems} />
          </TabsContent>
          
          <TabsContent value="projects">
            <ProjectsDetailTab projects={data.details.projects} />
          </TabsContent>
          
          <TabsContent value="breakdowns">
            <BreakdownsDetailTab breakdowns={data.details.breakdowns} />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
```

### 4.2 Budget Detail Tab

```
┌─────────────────────────────────────────┐
│ BUDGET ITEMS (24 items)                 │
├─────────────────────────────────────────┤
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 🔍 Search budget items...          │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 📋 Road Rehabilitation Program     │ │
│ │    ₱1,500,000 allocated            │ │
│ │    ├─ Obligated: ₱1,200,000 (80%)  │ │
│ │    └─ Utilized: ₱800,000 (53%)     │ │
│ │    [View] [Edit]                   │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 📋 School Building Fund             │ │
│ │    ₱2,000,000 allocated            │ │
│ │    ├─ Obligated: ₱1,500,000 (75%)  │ │
│ │    └─ Utilized: ₱1,000,000 (50%)   │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [Load More...]                          │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 📊 Summary                          │ │
│ │ Total: ₱5,000,000                   │ │
│ │ Avg Utilization: 58%                │ │
│ └─────────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

---

## Phase 5: Integration & Testing

### 5.1 Migration Strategy

```
Day 1: Backend Changes
├── Add new types to convex/dashboard.ts
├── Implement calculateEnhancedTimeSeries()
├── Update getDashboardAnalytics to use new function
└── Deploy Convex changes

Day 2: Frontend Core
├── Create EnhancedTimeSeriesChart component
├── Implement RichTooltip
├── Add tab navigation
└── Test data flow

Day 3: Detail Features
├── Build PeriodDetailDrawer
├── Implement all detail tabs
├── Add click interactions
└── Polish animations

Day 4: Testing & Polish
├── Integration testing
├── Performance optimization
├── Edge case handling
└── Documentation update
```

### 5.2 Testing Checklist

#### Unit Tests
- [ ] Tab switching logic
- [ ] Data transformation (backend)
- [ ] Tooltip rendering with all metric types
- [ ] Currency/number formatting

#### Integration Tests
- [ ] Hover reveals tooltip within 150ms
- [ ] Click opens drawer with correct data
- [ ] Tab changes update chart lines
- [ ] Filters affect displayed data

#### E2E Tests
- [ ] Full user flow: Hover → View details → Navigate
- [ ] Export functionality (if implemented)
- [ ] Mobile responsiveness

#### Performance Tests
- [ ] Initial load < 2s
- [ ] Tooltip appear < 150ms
- [ ] Tab switch animation smooth (60fps)
- [ ] Memory usage stable over time

### 5.3 Rollback Plan

If issues occur:
1. Feature flag to disable enhanced tooltips
2. Fallback to simple tooltip
3. Revert to original TimeSeriesChart if needed

---

## Phase 6: Future Enhancements (Post-MVP)

### 6.1 Planned for Other Fund Types

| Fund Type | Specific Data | Unique Metrics |
|-----------|---------------|----------------|
| **Trust Funds** | Trust fund agreements | Agreement status, fund releases |
| **Special Ed Funds** | School recipients | School count, student beneficiaries |
| **Special Health Funds** | Health facilities | Patient count, facility types |
| **20% DF** | Barangay recipients | Barangay coverage, project types |

### 6.2 Advanced Features

- **Comparative Mode:** Compare two periods side-by-side
- **Trend Analysis:** Automatic trend line and forecasting
- **Anomaly Detection:** Highlight unusual spikes/drops
- **Export:** PDF/Excel export of period summaries
- **Share:** Generate shareable links to specific period views

---

## Appendix: File Changes Summary

### New Files
```
components/analytics/
├── EnhancedTimeSeriesChart.tsx      # Main enhanced component
├── RichTooltip.tsx                   # Rich tooltip component
├── PeriodDetailDrawer.tsx            # Slide-out detail panel
├── tabs/
│   ├── BudgetDetailTab.tsx
│   ├── ProjectsDetailTab.tsx
│   └── BreakdownsDetailTab.tsx
└── shared/
    ├── TooltipSection.tsx
    ├── MetricRow.tsx
    ├── StatusBar.tsx
    └── StatCard.tsx
```

### Modified Files
```
convex/dashboard.ts                   # Add calculateEnhancedTimeSeries
components/analytics/
├── DashboardContent.tsx              # Use EnhancedTimeSeriesChart
└── TimeSeriesChart.tsx               # Mark as deprecated
hooks/useDashboardFilters.ts          # Add period selection filter (optional)
```

### Dependencies
```json
{
  "recharts": "^2.x",        // Already installed
  "framer-motion": "^11.x",  // Already installed
  "date-fns": "^3.x"         // For date formatting (optional)
}
```

---

## Success Metrics

| Metric | Current | Target | Measurement |
|--------|---------|--------|-------------|
| Time to insight | 3 clicks + page load | 1 hover | User testing |
| Data visibility | 1 metric at a time | 3 unified | Feature count |
| User satisfaction | N/A | > 4.5/5 | Survey |
| Performance | Simple tooltip | < 150ms tooltip | Lighthouse |

---

*Plan created by: Frontend React Specialist, Backend Convex Architect, Data Business Logic Engineer, UI/UX Designer, Product Documentation Lead*  
*Part of: PPDO Next.js + Convex Project*
