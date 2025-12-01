"use client";

import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthLayout({ children }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up');

  return (
    <div className="min-h-screen relative">
      {/* Blurred background overlay */}
      <AnimatePresence>
        {isAuthPage && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/10 dark:bg-black/30 backdrop-blur-lg z-0"
          />
        )}
      </AnimatePresence>

      {/* Content */}
      <div className={`relative z-10 min-h-screen flex items-center justify-center p-4 ${
        isAuthPage ? 'backdrop-blur-sm' : ''
      }`}>
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}