'use client';

import { useRef } from 'react';
import { signIn } from 'next-auth/react';
import Script from 'next/script';
import Image from 'next/image';

export default function GoogleButton() {
  const googleButtonRef = useRef<HTMLDivElement>(null);

  const initializeGoogle = () => {
    const google = (window as any).google;
    if (google && googleButtonRef.current) {
      google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        itp_support: true, 
        callback: async (response: any) => {
          await signIn('credentials', {
            token: response.credential,
            redirect: true,
            callbackUrl: '/home',
          });
        },
      });
      google.accounts.id.renderButton(googleButtonRef.current, {
        theme: 'outline',
        size: 'large',
      });
    }
  };

  const handleCustomButtonClick = () => {
    const actualBtn = googleButtonRef.current?.querySelector('div[role="button"]') as HTMLElement;
    if (actualBtn) {
      actualBtn.click();
    } else {
      console.error("Google SDK not loaded yet");
    }
  };

  return (
    <div className="w-full">
      <Script
        src="https://accounts.google.com/gsi/client"
        onLoad={initializeGoogle}
        strategy="afterInteractive"
      />
      <button
        type="button"
        onClick={handleCustomButtonClick}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-transparent text-gray-700 dark:text-zinc-300 font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all active:scale-[0.98] shadow-sm cursor-pointer"
      >
        <Image 
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
          alt="Google logo" 
          width={18} 
          height={18}
          priority 
        />
        Continue with Google
      </button>
      <div ref={googleButtonRef} className="hidden" aria-hidden="true" />
    </div>
  );
}