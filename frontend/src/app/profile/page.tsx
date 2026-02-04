'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
        <p className="text-gray-500 dark:text-zinc-400 animate-pulse font-medium">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-black p-6">
        <p className="text-gray-600 dark:text-zinc-400 mb-4">Please sign in to view your profile.</p>
        <Link 
          href="/" 
          className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition-all"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-black flex flex-col items-center justify-start p-4 sm:p-6 pt-20 sm:pt-24">
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 shadow-2xl rounded-3xl p-6 sm:p-10 border border-gray-100 dark:border-zinc-800 transition-all animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center text-4xl font-black mb-6 shadow-inner ring-4 ring-white dark:ring-zinc-800 transition-transform hover:rotate-6">
            {session?.user?.name?.[0] || 'U'}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white text-center tracking-tight">
            {session?.user?.name || 'User'}
          </h1>
          
          <p className="text-gray-500 dark:text-zinc-400 text-center mt-2 font-medium">
            {session?.user?.email}
          </p>
          <div className="w-full h-px bg-gray-100 dark:bg-zinc-800 my-8"></div>
          <div className="w-full space-y-4">
            <Link
              href="/home"
              className="w-full flex items-center justify-center bg-indigo-600 text-white font-bold py-3.5 rounded-2xl hover:bg-indigo-700 transition-all active:scale-[0.98] shadow-lg shadow-indigo-200 dark:shadow-none"
            >
              Back to Chats
            </Link>

            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full bg-white dark:bg-zinc-800 text-gray-900 dark:text-white border border-gray-200 dark:border-zinc-700 font-bold py-3.5 rounded-2xl hover:bg-gray-50 dark:hover:bg-zinc-700 transition-all active:scale-[0.98] cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
      <p className="mt-8 text-sm text-gray-400 dark:text-zinc-600">
        QuickChat v1.0 • Fast & Secure
      </p>
    </main>
  );
}