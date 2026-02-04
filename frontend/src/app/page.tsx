'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AuthForm from '../components/auth/AuthForm';
import ToggleButton from '../components/auth/ToggleForm';

export default function AuthPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);

  useEffect(() => {
    if (session) router.push('/home');
  }, [session, router]);

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gray-50 dark:bg-black p-4 sm:p-6">
      <div className="w-full max-w-md text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight transition-all">
          {isRegister ? 'Join QuickChat' : 'Welcome Back'}
        </h1>
        <p className="mt-3 text-gray-600 dark:text-zinc-400 text-sm sm:text-base">
          {isRegister
            ? 'Create an account to start messaging'
            : 'Login to stay connected with your friends'}
        </p>
      </div>
      <AuthForm isRegister={isRegister} setIsRegister={setIsRegister} />
      
      <ToggleButton isRegister={isRegister} setIsRegister={setIsRegister} />
    </main>
  );
}