'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Upload,
  BarChart3,
  LogOut,
  Briefcase,
  Brain
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Job Offers', href: '/offers', icon: Briefcase },
  { name: 'Upload CV', href: '/cv/upload', icon: Upload },
  { name: 'Results', href: '/results', icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="px-6 py-8 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Brain className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-sidebar-foreground">SMA</h1>
            <p className="text-xs text-sidebar-foreground/60">Recruitment AI</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="px-4 py-6 border-t border-sidebar-border space-y-4">
        <div className="px-4 py-3 bg-sidebar-accent/10 rounded-lg">
          <p className="text-xs text-sidebar-foreground/60">Logged in as</p>
          <p className="font-medium text-sidebar-foreground truncate">{user?.full_name}</p>
          <p className="text-xs text-sidebar-foreground/60 truncate">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
