'use client';

import { useAppSelector } from '@/shared/store/hooks';

export function usePermission(requiredPermission: string): boolean {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) return false;

  // For now, implement basic permission check
  // This can be extended when roles/permissions are added to the backend
  const userPermissions = getUserPermissions(user);
  return userPermissions.includes(requiredPermission);
}

function getUserPermissions(user: { id: string; email: string }): string[] {
  // Basic permissions - extend this when backend supports roles
  const basePermissions = ['event:view', 'reservation:create'];
  
  // Add more permissions based on user properties
  // This is a placeholder until backend implements roles
  return basePermissions;
}
