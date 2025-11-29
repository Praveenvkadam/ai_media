"use client";

import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Menu, X, Sun, Moon, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Authenticated, Unauthenticated } from "convex/react";
import { useStoreUser } from "../hooks/useStoreUserEffect";
import Image from "next/image";

const Navbar = () => {
  const { isLoading, isAuthenticated } = useStoreUser();
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showNotification, setShowNotification] = useState(null);
  const [prevAuthState, setPrevAuthState] = useState(null);

  // Track authentication state changes for notifications
  useEffect(() => {
    if (isAuthenticated !== prevAuthState) {
      if (isAuthenticated) {
        setShowNotification({
          type: 'success',
          message: 'Welcome back! You are now logged in.',
          icon: <CheckCircle className="w-5 h-5" />
        });
      } else if (prevAuthState !== null) {
        setShowNotification({
          type: 'info',
          message: 'You have been logged out. Visit again soon!',
          icon: <XCircle className="w-5 h-5" />
        });
      }
      setPrevAuthState(isAuthenticated);
    }
  }, [isAuthenticated, prevAuthState]);

  // Auto-hide notification after 3 seconds
  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  // Set component as mounted to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll to section
  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    setIsMenuOpen(false);
    
    if (pathname !== '/') {
      router.push(`/#${sectionId}`);
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    
    // Handle hash navigation on page load
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.substring(1);
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [pathname]);

  // Don't show navbar on auth pages
  if (pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up')) {
    return null;
  }

  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  if (!mounted) return null;

  if (isLoading) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg flex justify-center items-center py-2">
        <Loader2 className="w-5 h-5 mr-2 text-primary animate-spin" />
        <span className="text-sm font-medium">Loading...</span>
      </div>
    );
  }

  return (
    <>
      {/* Notification Toast */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-[60] px-6 py-3 rounded-xl shadow-lg flex items-center space-x-2 ${
              showNotification.type === 'success' 
                ? 'bg-emerald-500/90 text-white' 
                : 'bg-blue-500/90 text-white'
            }`}
          >
            <div className="flex items-center">
              {showNotification.icon}
              <span className="ml-2 font-medium">{showNotification.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header
        className={`fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-7xl z-50 transition-all duration-300 rounded-2xl ${
          isScrolled
            ? "bg-white/30 dark:bg-gray-900/40 backdrop-blur-md shadow-lg border border-white/20 dark:border-gray-700/20"
            : "bg-white/20 dark:bg-gray-900/30 backdrop-blur-sm shadow-md border border-white/10 dark:border-gray-700/10"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 flex-shrink-0">
              <div className="relative w-16 h-16 p-2 rounded-2xl bg-white/10 dark:bg-gray-800/30">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  fill
                  className="object-contain"
                  style={{
                    filter: theme === 'dark' ? 'brightness(0) invert(1)' : 'brightness(0) invert(0.2)'
                  }}
                />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                YourBrand
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center flex-1">
              {/* Centered Navigation Links - Only show when authenticated */}
              <div className="flex-1 flex justify-center">
                {pathname === "/" && isAuthenticated && (
                  <div className="flex space-x-4">
                    <button 
                      onClick={(e) => scrollToSection(e, 'features')}
                      className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left"
                    >
                      Features
                    </button>
                    <button 
                      onClick={(e) => scrollToSection(e, 'testimonials')}
                      className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left"
                    >
                      Testimonials
                    </button>
                  </div>
                )}
              </div>
              
              {/* Right-aligned User Controls */}
              <div className="flex items-center space-x-3">
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full bg-white/50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-all"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? (
                    <Sun className="w-5 h-5 text-yellow-400" />
                  ) : (
                    <Moon className="w-5 h-5 text-gray-700" />
                  )}
                </button>

                <Unauthenticated>
                  <SignInButton mode="modal">
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-blue-500/30">
                      Get Started
                    </button>
                  </SignUpButton>
                </Unauthenticated>
                <Authenticated>
  <Link 
    href="/dashboard" 
    className="w-full px-4 py-2.5 text-sm font-medium text-center text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-xl transition-colors"
  >
    Dashboard
  </Link>
  <div className="flex justify-center">
    <UserButton 
      afterSignOutUrl="/"
      appearance={{
        elements: {
          userButtonAvatarBox: "w-10 h-10 border-2 border-white/20 mx-auto",
          userButtonPopoverCard: "rounded-2xl shadow-xl",
          userButtonPopoverActionButton: "rounded-xl"
        }
      }}
    />
  </div>
</Authenticated>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center space-x-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-white/50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-all"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-700" />
                )}
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50 focus:outline-none"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-lg rounded-b-2xl border-t border-white/20 dark:border-gray-700/30">
            {pathname === "/" && isAuthenticated && (
              <div className="flex space-x-4">
                <button 
                  onClick={(e) => scrollToSection(e, 'features')}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left"
                >
                  Features
                </button>
                <button 
                  onClick={(e) => scrollToSection(e, 'testimonials')}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left"
                >
                  Testimonials
                </button>
              </div>
            )}
            
            <div className="pt-4 pb-2 border-t border-gray-200 dark:border-gray-700/50">
              <div className="flex flex-col space-y-3 px-2">
                <Unauthenticated>
                  <SignInButton mode="modal">
                    <button className="w-full px-4 py-2.5 text-sm font-medium text-center text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-xl transition-colors">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="w-full px-4 py-2.5 text-sm font-medium text-center text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all shadow-md">
                      Get Started
                    </button>
                  </SignUpButton>
                </Unauthenticated>
                <Authenticated>
                  <div className="flex justify-center">
                    <UserButton 
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          userButtonAvatarBox: "w-10 h-10 border-2 border-white/20 mx-auto",
                          userButtonPopoverCard: "rounded-2xl shadow-xl",
                          userButtonPopoverActionButton: "rounded-xl"
                        }
                      }}
                    />
                  </div>
                </Authenticated>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;