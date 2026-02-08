'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/shared/store/hooks';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
}

export function ProtectedRoute({ children, requiredPermission }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (requiredPermission && !hasPermission(user, requiredPermission)) {
      router.push('/');
    }
  }, [isAuthenticated, user, requiredPermission, router]);

  if (!isAuthenticated) return null;
  if (requiredPermission && !hasPermission(user, requiredPermission)) return null;

  return <>{children}</>;
}

function hasPermission(user: unknown, permission: string): boolean {
  // Placeholder - extend when backend supports roles
  return true;
}
