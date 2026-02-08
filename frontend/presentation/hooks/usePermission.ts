'use client';

import { useAppSelector } from '@/shared/store/hooks';

export function usePermission(requiredPermission: string): boolean {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) return false;

  const userPermissions = getUserPermissions(user);
  return userPermissions.includes(requiredPermission);
}

export function getUserPermissions(user: { id: string; email: string }): string[] {
  const basePermissions = ['event:view', 'reservation:create'];
  return basePermissions;
}
