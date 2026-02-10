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
  const { isAuthenticated, user, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Don't redirect while still loading auth state
    if (loading) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (requiredPermission && !hasPermission(user, requiredPermission)) {
      router.push('/');
    }
  }, [isAuthenticated, user, requiredPermission, router, loading]);

  // Show loading state while auth is being initialized
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;
  if (requiredPermission && !hasPermission(user, requiredPermission)) return null;

  return <>{children}</>;
}

function hasPermission(user: unknown, permission: string): boolean {
  if (!user || typeof user !== 'object') return false;
  
  const userObj = user as { roles?: string[] };
  
  // Check for admin:access permission
  if (permission === 'admin:access') {
    return userObj.roles?.includes('admin') || false;
  }
  
  return true;
}
