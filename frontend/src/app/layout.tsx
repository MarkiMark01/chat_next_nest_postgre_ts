import type { Metadata } from "next";
import { Toaster } from 'react-hot-toast';
import Providers from "../components/provider/Providers";
import Header from "../components/header/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "QuickChat",
  description: "Fast & Secure Messaging",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" className="h-full overflow-hidden">
      <body className="h-full bg-white dark:bg-black antialiased overflow-hidden">
        <Providers>
          <Toaster position="bottom-right" toastOptions={{
            style: { background: '#18181b', color: '#fff', borderRadius: '12px' }
          }} />
          <div className="flex flex-col h-screen w-full overflow-hidden">
            <div className="relative z-50 flex-shrink-0">
              <Header />
            </div>
            <main className="flex-1 min-h-0 relative overflow-hidden">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}