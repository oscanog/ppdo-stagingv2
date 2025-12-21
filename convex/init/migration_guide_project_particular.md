# Project Particulars Migration Guide

## Overview

This guide explains how to migrate from hardcoded project particulars to a managed **Project Particulars** system.

**Key Changes:**
- ✅ Projects now use codes from the `projectParticulars` table
- ✅ Budget Items continue to use codes from the `budgetParticulars` table
- ✅ These two systems are **completely separate** and independent
- ✅ Usage tracking automatically updates when projects are created/deleted
- ✅ Validation prevents using inactive or non-existent particulars

---

## Step 1: Update Your Schema

Make sure your `convex/schema.ts` includes the new `projectParticularTables`:

```typescript
// convex/schema.ts
import { projectParticularTables } from "./schema/projectParticulars";

export default defineSchema({
  // ... other tables
  ...projectParticularTables, // 🆕 Add this
});
```

---

## Step 2: Run Initial Setup

After deploying the schema changes, initialize the default project particulars:

```bash
# In your Convex dashboard or via API
# Call: convex/init/seedProjectParticulars.ts -> initializeDefaultParticulars()
```

This will create 20 default project particulars including:
- CONST_ROADS: Construction of Roads
- REPAIR_ROADS: Repair of Roads
- CONST_BRIDGE: Construction of Bridges
- WATER_SYSTEM: Water System Development
- And 16 more...

---

## Step 3: Migrate Existing Project Data (If Needed)

If you have existing projects with free-text particulars, you'll need to:

### Option A: Map to Existing Codes

Create a mutation to map old particulars to new codes:

```typescript
// convex/migrations/migrateProjectParticulars.ts
import { mutation } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const migrateToNewParticulars = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user || user.role !== "super_admin") {
      throw new Error("Only super_admin can run migrations");
    }

    // Define your mapping
    const mapping: Record<string, string> = {
      "Construction of Roads": "CONST_ROADS",
      "Road Construction": "CONST_ROADS",
      "Repair of Roads": "REPAIR_ROADS",
      "Bridge Construction": "CONST_BRIDGE",
      // Add all your mappings here
    };

    const projects = await ctx.db.query("projects").collect();
    let updated = 0;
    let failed: string[] = [];

    for (const project of projects) {
      const newCode = mapping[project.particulars];
      
      if (newCode) {
        await ctx.db.patch(project._id, {
          particulars: newCode,
          updatedAt: Date.now(),
        });
        updated++;
      } else {
        failed.push(project.particulars);
      }
    }

    // Recalculate usage counts after migration
    await ctx.runMutation(internal.projectParticulars.recalculateUsageCountsInternal, {});

    return {
      success: true,
      updated,
      failed: Array.from(new Set(failed)),
    };
  },
});
```

### Option B: Create Custom Particulars

If your projects use particulars not in the defaults, add them first:

```typescript
// Use the create mutation from projectParticulars.ts
await ctx.runMutation(api.projectParticulars.create, {
  code: "CUSTOM_PROJECT",
  fullName: "Custom Project Type",
  description: "Your custom project description",
  category: "Custom Category",
  colorCode: "#FF5733",
});
```

---

## Step 4: Update Frontend Code

### Before (Old Way)
```typescript
// Projects used free-text particulars
<input 
  type="text" 
  value={particulars}
  onChange={(e) => setParticulars(e.target.value)}
/>
```

### After (New Way)
```typescript
// Projects now use dropdown with projectParticulars
const projectParticulars = useQuery(api.projectParticulars.list, {
  includeInactive: false
});

<select 
  value={particulars}
  onChange={(e) => setParticulars(e.target.value)}
>
  {projectParticulars?.map(p => (
    <option key={p._id} value={p.code}>
      {p.fullName}
    </option>
  ))}
</select>
```

---

## Step 5: Verify Everything Works

### Test Checklist:

1. ✅ **Create Project**: Try creating a new project with a valid particular code
2. ✅ **Update Project**: Try changing a project's particular
3. ✅ **Usage Counts**: Check that usage counts update correctly
4. ✅ **Validation**: Try using an inactive particular (should fail)
5. ✅ **Validation**: Try using a non-existent particular (should fail)
6. ✅ **Trash System**: Soft-delete a project and verify usage count decreases
7. ✅ **Restore**: Restore a project and verify usage count increases
8. ✅ **Hard Delete**: Permanently delete a project and verify usage count decreases

---

## Key Differences: Budget vs Project Particulars

| Feature | Budget Particulars | Project Particulars |
|---------|-------------------|---------------------|
| **Table** | `budgetParticulars` | `projectParticulars` |
| **Used By** | Budget Items | Projects |
| **Examples** | GAD, LDRRMP, LCCAP | CONST_ROADS, REPAIR_BRIDGE |
| **Usage Field** | `usageCount` (budget items)<br/>`projectUsageCount` (projects) | `usageCount` (projects only) |
| **API Endpoint** | `api.budgetParticulars.*` | `api.projectParticulars.*` |
| **Seed File** | `seedBudgetParticulars.ts` | `seedProjectParticulars.ts` |

**IMPORTANT:** These two systems are completely independent. Budget Particulars track usage across BOTH budget items AND projects, while Project Particulars only track project usage.

---

## Troubleshooting

### Error: "Project particular does not exist"
**Solution:** Run the seed script to create default particulars, or manually create the particular you need.

### Error: "Cannot deactivate - currently in use"
**Solution:** You can't deactivate a particular that's being used by projects. Update those projects first.

### Error: "Only super_admin can initialize"
**Solution:** Make sure you're logged in as a super_admin user before running seed scripts.

### Usage counts are incorrect
**Solution:** Run the recalculate usage counts mutation:
```typescript
await ctx.runMutation(api.projectParticulars.recalculateUsageCounts, {});
```

---

## Best Practices

1. **Use Descriptive Codes**: Make codes self-explanatory (e.g., `CONST_ROADS` not `CR`)
2. **Categorize Wisely**: Use categories to group related particulars
3. **Set Display Order**: Control the order in dropdowns with `displayOrder`
4. **Use Colors**: Assign meaningful colors for visual identification
5. **Document Well**: Use the `description` and `notes` fields
6. **Regular Audits**: Periodically check usage counts and inactive particulars

---

## Support

If you encounter issues:
1. Check the Convex dashboard for error logs
2. Verify your schema deployed correctly
3. Ensure seed scripts ran successfully
4. Check that internal mutations are properly configured

---

## Summary

✅ Project Particulars and Budget Particulars are now **completely separate**  
✅ Projects can only use codes from `projectParticulars`  
✅ Budget Items can only use codes from `budgetParticulars`  
✅ Usage tracking is automatic and accurate  
✅ Validation prevents data integrity issues  
✅ Migration path is clear and straightforward  

This architecture ensures data consistency, makes management easier, and prevents confusion between budget and project categories.
