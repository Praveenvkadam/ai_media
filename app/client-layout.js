'use client';

import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { ThemeProvider } from "../components/theme-provider";
import { dark } from "@clerk/themes";
import Navbar from "../components/Navbar";
import Footer from "@/components/Footer";
import { usePathname } from 'next/navigation';

const publicRoutes = ['/sign-in', '/sign-up'];

function ClientLayout({ children }) {
  const pathname = usePathname();
  const showNavbarAndFooter = pathname && !pathname.startsWith('/dashboard') && !publicRoutes.includes(pathname);

  return (
    <>
      {showNavbarAndFooter && <Navbar />}
      <main className={`${showNavbarAndFooter ? 'pt-20' : ''} px-4 sm:px-6 max-w-7xl mx-auto w-full`}>
        {children}
      </main>
      {showNavbarAndFooter && <Footer />}
    </>
  );
}

export default function RootLayoutClient({ children }) {
  return (
    <ClerkProvider appearance={{ theme: dark }}>
      <ConvexClientProvider>
        <ThemeProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </ThemeProvider>
      </ConvexClientProvider>
    </ClerkProvider>
  );
}