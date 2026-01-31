// 3. hooks/usePermissions.ts
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function usePermissions() {
  const permissions = useQuery(api.permissions.getUserPermissions);
  
  const hasPermission = (permissionKey: string) => {
    return permissions?.includes(permissionKey) ?? false;
  };
  
  const hasAnyPermission = (permissionKeys: string[]) => {
    return permissionKeys.some(key => permissions?.includes(key));
  };
  
  const hasAllPermissions = (permissionKeys: string[]) => {
    return permissionKeys.every(key => permissions?.includes(key));
  };
  
  return {
    permissions: permissions ?? [],
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isLoading: permissions === undefined,
  };
}
