'use client';

import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export const Header = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          SMA Matching
        </Link>

        {user ? (
          <nav className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="hover:opacity-80 transition">
                Dashboard
              </Link>
              <Link href="/upload-cv" className="hover:opacity-80 transition">
                Upload CV
              </Link>
              <span className="text-sm">{user.email}</span>
            </div>
            <Button
              onClick={handleLogout}
              variant="secondary"
              size="sm"
            >
              Logout
            </Button>
          </nav>
        ) : (
          <nav className="flex gap-4">
            <Link href="/login">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">
                Register
              </Button>
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};
