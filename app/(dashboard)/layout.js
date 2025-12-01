"use client";

import { UserButton } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Moon, 
  Sun, 
  Home, 
  FileText, 
  Settings, 
  Users, 
  LayoutDashboard, 
  PlusSquare,
  Menu, 
  X 
} from "lucide-react";

function Sidebar({ isCollapsed, toggleSidebar }) {
  const pathname = usePathname();
  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Create Post', href: '/dashboard/create-post', icon: PlusSquare },
    { name: 'My Posts', href: '/dashboard/my-posts', icon: FileText },
    { name: 'Follow', href: '/dashboard/follow', icon: Users },
  ];

  return (
    <div 
      className={`fixed top-0 left-0 h-full bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 z-10 transition-all duration-300 flex flex-col ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex-1 overflow-y-auto">
        <div className="h-14 flex items-center px-4 border-b border-slate-200 dark:border-slate-700">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </button>
          {!isCollapsed && (
            <h2 className="ml-2 text-lg font-semibold text-slate-800 dark:text-white">Menu</h2>
          )}
        </div>
        <nav className="p-2">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center p-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-600 dark:bg-slate-700 dark:text-blue-400"
                        : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${!isCollapsed ? "mr-3" : ""}`} />
                    {!isCollapsed && <span>{item.name}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <div className="p-2 border-t border-slate-200 dark:border-slate-700">
        <Link
          href="/dashboard/settings"
          className={`flex items-center p-2 rounded-lg transition-colors ${
            pathname === '/dashboard/settings'
              ? "bg-blue-50 text-blue-600 dark:bg-slate-700 dark:text-blue-400"
              : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
          }`}
        >
          <Settings className={`w-5 h-5 ${!isCollapsed ? "mr-3" : ""}`} />
          {!isCollapsed && <span>Settings</span>}
        </Link>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
      <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />

      <header 
        className={`fixed top-0 h-14 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 z-20 flex items-center transition-all duration-300 ${
          isSidebarCollapsed ? "left-16" : "left-64"
        } right-0`}
      >
        <div className="w-full max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between w-full">
            <Link 
              href="/" 
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <Home className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </Link>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                aria-label="Toggle theme"
              >
                {mounted && theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-600" />
                )}
              </button>
              
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    userButtonAvatarBox: 'w-8 h-8',
                  },
                }}
              />
            </div>
          </div>
        </div>
      </header>

        <main className={`flex-1 pt-16 transition-all duration-300 ${
        isSidebarCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        <div className="max-w-7xl mx-auto p-6 w-full">
          {children}
        </div>
      </main>
     
    </div>
  );
}