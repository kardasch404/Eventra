'use client';

import { useAppSelector } from '@/shared/store/hooks';
import { usePermission } from '@/presentation/hooks/usePermission';

interface RoleGuardProps {
  children: React.ReactNode;
  requiredPermission: string;
  fallback?: React.ReactNode;
}

export function RoleGuard({ children, requiredPermission, fallback = null }: RoleGuardProps) {
  const hasPermission = usePermission(requiredPermission);

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
