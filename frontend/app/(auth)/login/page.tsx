'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@apollo/client';
import Link from 'next/link';
import { LOGIN } from '@/infrastructure/graphql/mutations';
import { AuthService } from '@/infrastructure/services/auth-cookie.service';
import { useAppDispatch } from '@/shared/store/hooks';
import { setCredentials } from '@/shared/store';
import { loginSchema, LoginInput } from '@/shared/utils/validation';
import { Input, Button, Card, CardBody } from '@/presentation/components/ui';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [error, setError] = useState('');
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const [login, { loading }] = useMutation(LOGIN);

  const onSubmit = async (data: LoginInput) => {
    try {
      setError('');
      const { data: result } = await login({
        variables: { input: data },
      });

      if (result?.login) {
        AuthService.setTokens(result.login.accessToken, result.login.refreshToken);
        dispatch(setCredentials({
          user: result.login.user,
          accessToken: result.login.accessToken,
          refreshToken: result.login.refreshToken,
        }));
        router.push('/events');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardBody>
          <h1 className="text-3xl font-bold text-center mb-6">Login</h1>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email"
              type="email"
              {...register('email')}
              error={errors.email?.message}
            />
            
            <Input
              label="Password"
              type="password"
              {...register('password')}
              error={errors.password?.message}
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <p className="text-center mt-4 text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/register" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
