'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@apollo/client/react';
import Link from 'next/link';
import { REGISTER } from '@/infrastructure/graphql/mutations';
import { AuthService } from '@/infrastructure/services/auth-cookie.service';
import { useAppDispatch } from '@/shared/store/hooks';
import { setCredentials } from '@/shared/store';
import { registerSchema, RegisterInput } from '@/shared/utils/validation';
import { Input, Button, Card, CardBody } from '@/presentation/components/ui';

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [error, setError] = useState('');
  
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const [registerMutation, { loading }] = useMutation(REGISTER);

  const onSubmit = async (data: RegisterInput) => {
    try {
      setError('');
      const { data: result } = await registerMutation({
        variables: { input: data },
      });

      if (result?.register) {
        // Registration successful - redirect to login page
        router.push('/login?registered=true');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardBody>
          <h1 className="text-3xl font-bold text-center mb-6">Sign Up</h1>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="First Name"
              {...register('firstName')}
              error={errors.firstName?.message}
            />
            
            <Input
              label="Last Name"
              {...register('lastName')}
              error={errors.lastName?.message}
            />
            
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
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>

          <p className="text-center mt-4 text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
