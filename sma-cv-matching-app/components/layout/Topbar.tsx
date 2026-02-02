'use client';

import { useAuth } from '@/context/AuthContext';

interface TopbarProps {
  title: string;
}

export function Topbar({ title }: TopbarProps) {
  const { user } = useAuth();

  return (
    <div className="fixed top-0 left-64 right-0 h-16 bg-background border-b border-border flex items-center justify-between px-8 z-40">
      <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-foreground">{user?.name}</p>
          <p className="text-xs text-muted-foreground">{user?.role}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
      </div>
    </div>
  );
}
