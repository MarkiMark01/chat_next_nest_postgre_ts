'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Header() {
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-[100]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
        <Link href="/home" className="text-lg sm:text-xl font-bold text-indigo-600 hover:opacity-80 transition shrink-0">
          QuickChat
        </Link>
        <nav className="flex items-center gap-2 sm:gap-6">
          <Link href="/home" className="text-xs sm:text-sm md:text-base text-gray-600 hover:text-indigo-600 font-medium transition">
            Home
          </Link>
          
          <div className="h-4 w-px bg-gray-200 shrink-0"></div>
          <Link 
            href="/profile" 
            className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-1.5 bg-gray-50 text-gray-700 rounded-full hover:bg-indigo-50 hover:text-indigo-600 transition"
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold uppercase shrink-0">
              {session?.user?.name?.[0] || 'U'}
            </div>
            <span className="hidden xs:inline text-xs sm:text-sm font-semibold">Profile</span>
          </Link>

          <button 
            onClick={() => signOut({ callbackUrl: '/' })}
            className="text-[10px] sm:text-sm text-red-500 hover:text-red-600 font-medium cursor-pointer transition shrink-0"
          >
            Sign Out
          </button>
        </nav>
      </div>
    </header>
  );
}