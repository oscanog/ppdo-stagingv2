# Performance Over Time Chart

> **URL Pattern:** `http://localhost:3000/dashboard/YYYY?fund=budget`  
> **Component:** `TimeSeriesChart`  
> **Location:** Top-right quadrant of the Analytics Dashboard  
> *Version: 1.0.0 | Last Updated: February 2026*

---

## Overview

The **Performance Over Time** chart is a time-series visualization component that displays trends in budget allocation and project creation over time. It supports both **monthly** and **quarterly** views, with the ability to switch between **Budget** and **Projects** metrics.

```
┌─────────────────────────────────────────────────────────────────┐
│                    Performance Over Time                          │
│              Track budget and project trends                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────┐ ┌─────────┐        ┌─────────┐ ┌─────────┐       │
│   │ Budget  │ │ Projects│        │ Monthly │ │Quarterly│       │
│   └─────────┘ └─────────┘        └─────────┘ └─────────┘       │
│                                                                 │
│    ₱400k ┤                                          ╭─╮        │
│    ₱300k ┤                              ╭─╮    ╭────╯  │        │
│    ₱200k ┤          ╭─╮    ╭────╮  ╭────╯  ╰────╯       │        │
│    ₱100k ┤  ╭──────╯  ╰────╯    ╰──╯                    │        │
│        ₱0 ┼──┬────┬────┬────┬────┬────┬────┬────┬────┬──       │
│           Jan  Feb  Mar  Apr  May  Jun  Jul  Aug  Sep  Oct     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Route & URL Structure

### URL Pattern
```
/dashboard/{year}?fund={fundType}

Examples:
- /dashboard/2025?fund=budget
- /dashboard/2025?fund=trust
- /dashboard/2025?fund=twenty-percent-df
```

### URL Parameters

| Parameter | Type | Description | Values |
|-----------|------|-------------|--------|
| `year` | Path | Fiscal year | Any 4-digit year (e.g., `2025`) |
| `fund` | Query | Fund type filter | `budget`, `trust`, `twenty-percent-df`, `education`, `health` |

### Filter Persistence
All filters including the selected view (monthly/quarterly) are persisted in the URL via `useDashboardFilters` hook, enabling:
- **Shareable URLs** - Share exact dashboard states
- **Browser navigation** - Back/forward button support
- **Bookmarkable views** - Save specific metric views

---

## Component Architecture

### File Structure

```
components/
├── analytics/
│   ├── TimeSeriesChart.tsx       # Main chart component
│   ├── DashboardContent.tsx      # Parent container
│   └── DashboardFilters.tsx      # Filter bar (affects data)
├── ppdo/dashboard/charts/
│   └── DashboardChartCard.tsx    # Card wrapper
└── hooks/
    └── useDashboardFilters.ts    # Filter state management

convex/
└── dashboard.ts                  # Backend aggregation
    ├── getDashboardAnalytics()   # Main query
    └── calculateTimeSeries()     # Time series calculation
```

### Component Hierarchy

```
AnalyticsPage (app/(private)/dashboard/[year]/page.tsx)
    └── DashboardContent
        └── TimeSeriesChart
            └── DashboardChartCard
                ├── Card Header (title: "Performance Over Time")
                ├── Tab Controls (Budget/Projects, Monthly/Quarterly)
                └── Recharts LineChart
                    ├── CartesianGrid
                    ├── XAxis (Month/Quarter labels)
                    ├── YAxis (Currency or Count)
                    ├── Tooltip
                    ├── Legend
                    └── Line (monotone)
```

---

## Frontend Implementation

### TimeSeriesChart Component

**Location:** `components/analytics/TimeSeriesChart.tsx`

```typescript
interface TimeSeriesChartProps {
    data: {
        monthly: Array<{
            month: number;        // 1-12
            projects: number;     // Project count
            budget: number;       // Budget amount (PHP)
            obligations: number;  // Obligated amount
            disbursements: number;// Disbursed amount
        }>;
        quarterly: Array<{
            quarter: number;      // 1-4
            projects: number;
            budget: number;
            obligations: number;
            disbursements: number;
        }>;
    };
}
```

### State Management

```typescript
// Component-level state
const [view, setView] = useState<"monthly" | "quarterly">("monthly");
const [metric, setMetric] = useState<"budget" | "projects">("budget");
```

### Chart Configuration

| Property | Value | Description |
|----------|-------|-------------|
| **Chart Type** | Line Chart | Monotone interpolation for smooth curves |
| **Height** | 300px | Fixed container height |
| **Colors** | Budget: `#3b82f6` (Blue), Projects: `#8b5cf6` (Purple) | Tailwind colors |
| **Animation** | Framer Motion | Fade + slide transitions on view change |
| **Dot Radius** | 4px | Visible data points |
| **Stroke Width** | 3px | Thick line for visibility |

### Y-Axis Formatting

```typescript
// Budget view: Currency in thousands
"₱100k"  // (value / 1000).toFixed(0) + 'k'

// Projects view: Raw count
"10"     // Direct count value
```

### Tooltip Formatting

```typescript
// Budget: Full PHP currency format
new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
}).format(value)  // "₱100,000.00"

// Projects: Plain number
value  // "10"
```

---

## Backend Implementation

### Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT                                   │
│  TimeSeriesChart → DashboardContent → useQuery()                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ WebSocket
┌─────────────────────────────────────────────────────────────────┐
│                      CONVEX BACKEND                              │
│                                                                 │
│  1. getDashboardAnalytics()                                     │
│     ├── Fetch projects & budget items (filtered by fundType)   │
│     ├── Apply filters (year, department, office, date range)   │
│     ├── calculateTimeSeries()                                  │
│     │   ├── Group by month (1-12)                              │
│     │   ├── Group by quarter (1-4)                             │
│     │   └── Aggregate metrics                                  │
│     └── Return { timeSeriesData: { monthly, quarterly } }      │
└─────────────────────────────────────────────────────────────────┘
```

### calculateTimeSeries Function

**Location:** `convex/dashboard.ts` (lines 926-968)

```typescript
function calculateTimeSeries(
    projects: NormalizedProject[], 
    budgetItems: NormalizedBudgetItem[], 
    filters: FilterCriteria
) {
    // Initialize series structure
    const series = {
        monthly: Array(12).fill(0).map((_, i) => ({
            month: i + 1,
            projects: 0,
            budget: 0,
            obligations: 0,
            disbursements: 0,
        })),
        quarterly: Array(4).fill(0).map((_, i) => ({
            quarter: i + 1,
            projects: 0,
            budget: 0,
            obligations: 0,
            disbursements: 0,
        })),
    };

    // Aggregate projects by creation date
    projects.forEach(p => {
        const date = new Date(p.createdAt);
        const month = date.getMonth();        // 0-11
        const quarter = Math.floor(month / 3); // 0-3

        series.monthly[month].projects++;
        series.quarterly[quarter].projects++;
    });

    // Aggregate budget items by creation date
    budgetItems.forEach(b => {
        const date = new Date(b.createdAt);
        const month = date.getMonth();
        const quarter = Math.floor(month / 3);

        series.monthly[month].budget += b.totalBudgetAllocated || 0;
        series.monthly[month].obligations += b.obligatedBudget || 0;
        series.monthly[month].disbursements += b.totalBudgetUtilized || 0;

        series.quarterly[quarter].budget += b.totalBudgetAllocated || 0;
        series.quarterly[quarter].obligations += b.obligatedBudget || 0;
        series.quarterly[quarter].disbursements += b.totalBudgetUtilized || 0;
    });

    return series;
}
```

### Supported Fund Types

| Fund Type | Database Table | Mapped Fields |
|-----------|----------------|---------------|
| `budget` (default) | `projects` + `budgetItems` | Standard schema |
| `trust` | `trustFunds` | `received` → `allocated`, `projectTitle` → `particulars` |
| `twenty-percent-df` | `twentyPercentDF` | `allocated` → `allocated`, `projectTitle` → `particulars` |
| `education` | `specialEducationFunds` | SEF-specific fields |
| `health` | `specialHealthFunds` | SHF-specific fields |

### Filter Arguments

The chart respects all dashboard filters:

```typescript
interface FilterArgs {
    fiscalYearId?: Id<"fiscalYears">;     // Target year
    departmentIds?: Id<"departments">[];  // Multi-select departments
    officeIds?: string[];                  // Multi-select offices
    dateRange?: { start: number; end: number };  // Timestamp range
    quarter?: number;                      // 1-4
    fundType?: "budget" | "trust" | "twenty-percent-df" | "education" | "health";
}
```

---

## Data Aggregation Logic

### Monthly Aggregation

```
Month Indexing:
┌─────────┬─────────┬─────────┬─────────┬─────┬─────────┐
│  Index  │    0    │    1    │    2    │ ... │   11    │
├─────────┼─────────┼─────────┼─────────┼─────┼─────────┤
│  Month  │   Jan   │   Feb   │   Mar   │ ... │   Dec   │
│  Value  │   1     │   2     │   3     │ ... │   12    │
└─────────┴─────────┴─────────┴─────────┴─────┴─────────┘
```

### Quarterly Aggregation

```
Quarter Mapping:
┌───────────┬─────────────────┬──────────────────┐
│  Quarter  │     Months      │     Indices      │
├───────────┼─────────────────┼──────────────────┤
│    Q1     │ Jan, Feb, Mar   │     0, 1, 2      │
│    Q2     │ Apr, May, Jun   │     3, 4, 5      │
│    Q3     │ Jul, Aug, Sep   │     6, 7, 8      │
│    Q4     │ Oct, Nov, Dec   │     9, 10, 11    │
└───────────┴─────────────────┴──────────────────┘

Quarter Index: Math.floor(monthIndex / 3)
```

### Metrics Tracked

| Metric | Source Field | Aggregation | Description |
|--------|--------------|-------------|-------------|
| **projects** | `createdAt` timestamp | Count | Number of projects created |
| **budget** | `totalBudgetAllocated` | Sum | Total budget allocated |
| **obligations** | `obligatedBudget` | Sum | Total obligated budget |
| **disbursements** | `totalBudgetUtilized` | Sum | Total utilized/disbursed |

---

## User Interactions

### Tab Controls

```
┌─────────┐ ┌─────────┐        ┌─────────┐ ┌─────────┐
│ Budget  │ │ Projects│        │ Monthly │ │Quarterly│
└─────────┘ └─────────┘        └─────────┘ └─────────┘

- Budget: Shows budget, obligations, disbursements
- Projects: Shows project creation count
- Monthly: 12 data points (Jan-Dec)
- Quarterly: 4 data points (Q1-Q4)
```

### Animation Behavior

| Action | Animation | Duration |
|--------|-----------|----------|
| Switch metric | Fade + slide X | 300ms |
| Switch view | Fade + slide X | 300ms |
| Initial load | Staggered fade in | 100ms delay |

### Tooltip Interaction

```
Hover on data point:
┌──────────────────────────────────────┐
│  Jan                                 │
│  ● Budget: ₱1,234,567.00            │
└──────────────────────────────────────┘
```

---

## Integration with Dashboard

### DashboardContent Layout

```typescript
// DashboardContent.tsx
<motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {/* Top-left: Budget Overview */}
    <EnhancedBudgetChart data={chartData.budgetOverview} />
    
    {/* Top-right: Performance Over Time */}
    <TimeSeriesChart data={timeSeriesData} />
</motion.div>
```

### Data Flow from Parent

```typescript
// Parent fetches data via Convex
const analytics = useQuery(api.dashboard.getDashboardAnalytics, queryArgs);

// Destructure time series data
const { timeSeriesData } = analytics;

// Pass to component
<TimeSeriesChart data={timeSeriesData} />
```

---

## Performance Considerations

### Optimization Strategies

1. **Server-side aggregation** - All calculations happen in Convex
2. **Memoized data** - Convex caches query results
3. **Efficient re-renders** - Minimal state in component
4. **Lazy loading** - Data loads via Suspense boundary

### Bundle Impact

| Dependency | Size | Purpose |
|------------|------|---------|
| `recharts` | ~150KB | Line chart rendering |
| `framer-motion` | ~40KB | Animations |

### Loading State

```
While data loads:
┌─────────────────────────────────────────┐
│         Performance Over Time           │
├─────────────────────────────────────────┤
│                                         │
│         [Skeleton/Spinner]              │
│                                         │
└─────────────────────────────────────────┘
```

---

## Customization Guide

### Adding New Metrics

To add a new metric (e.g., "inspections"):

1. **Update Backend** (`convex/dashboard.ts`):
```typescript
// In calculateTimeSeries()
series.monthly[month].inspections += b.inspectionCount || 0;
series.quarterly[quarter].inspections += b.inspectionCount || 0;
```

2. **Update Frontend** (`TimeSeriesChart.tsx`):
```typescript
const [metric, setMetric] = useState<"budget" | "projects" | "inspections">("budget");

// Add tab
<TabsTrigger value="inspections">Inspections</TabsTrigger>

// Add color
const getMetricColor = (m: string) => {
    switch (m) {
        case "inspections": return "#f59e0b"; // Amber
        // ...
    }
};
```

### Styling Customization

| Property | Default | Location |
|----------|---------|----------|
| Line color | `#3b82f6` | `getMetricColor()` function |
| Dot size | 4px | `dot={{ r: 4 }}` |
| Stroke width | 3px | `strokeWidth={3}` |
| Height | 300px | `height: [300px]` |

---

## Testing

### Test Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Empty data | Show empty chart (all zeros) |
| Single data point | Line with single dot |
| Switch to quarterly | Smooth animation, 4 points |
| Switch to projects | Y-axis changes to count |
| Hover on point | Tooltip with formatted value |
| Filter applied | Chart updates with filtered data |

### Manual Testing Steps

1. Navigate to `/dashboard/2025?fund=budget`
2. Verify chart loads with monthly view
3. Click "Projects" tab → should show project counts
4. Click "Quarterly" tab → should show 4 data points
5. Apply department filter → chart should update
6. Change year → chart should reload with new data

---

## Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Chart not rendering | Missing data prop | Check `timeSeriesData` from API |
| Flat line (all zeros) | No data for filters | Check filter criteria |
| Wrong currency format | Intl API issue | Verify "en-PH" locale |
| Animation stuck | State conflict | Refresh page |

### Debug Logging

```typescript
// Add to DashboardContent for debugging
console.log("Time Series Data:", analytics?.timeSeriesData);
```

---

## Related Documentation

- [Data Flow & Convex](./08-data-flow.md) - Understanding Convex queries
- [Module: Funds](./06-module-funds.md) - Fund type system
- [Development Guide](./10-development-guide.md) - Coding standards
- [Recharts Documentation](https://recharts.org/) - Chart library docs

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Feb 2026 | Initial documentation |

---

*Document maintained by: Frontend React Specialist, Backend Convex Architect, Data Business Logic Engineer, Product Documentation Lead*  
*Part of: PPDO Next.js + Convex Project*
