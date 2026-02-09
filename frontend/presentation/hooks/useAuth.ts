'use client';

import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client/react';
import { LOGIN, REGISTER } from '@/infrastructure/graphql/mutations';
import { AuthService } from '@/infrastructure/services/auth-cookie.service';
import { useAppDispatch, useAppSelector } from '@/shared/store/hooks';
import { setCredentials, logout as logoutAction } from '@/shared/store';

export function useAuth() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, loading } = useAppSelector((state) => state.auth);

  const [loginMutation] = useMutation(LOGIN);
  const [registerMutation] = useMutation(REGISTER);

  const login = async (email: string, password: string) => {
    const { data } = await loginMutation({
      variables: { input: { email, password } },
    });

    if (data?.login) {
      AuthService.setTokens(data.login.accessToken, data.login.refreshToken);
      dispatch(setCredentials({
        user: data.login.user,
        accessToken: data.login.accessToken,
        refreshToken: data.login.refreshToken,
      }));
      return data.login;
    }
  };

  const register = async (input: { email: string; password: string; firstName: string; lastName: string }) => {
    const { data } = await registerMutation({
      variables: { input },
    });

    if (data?.register) {
      AuthService.setTokens(data.register.accessToken, data.register.refreshToken);
      dispatch(setCredentials({
        user: data.register.user,
        accessToken: data.register.accessToken,
        refreshToken: data.register.refreshToken,
      }));
      return data.register;
    }
  };

  const logout = () => {
    AuthService.clearTokens();
    dispatch(logoutAction());
    router.push('/login');
  };

  return { user, isAuthenticated, loading, login, register, logout };
}
