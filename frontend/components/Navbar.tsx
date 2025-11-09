// ========================================
// NAVBAR COMPONENT
// ========================================
// Navigation bar for authenticated pages

'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LayoutDashboard, FolderKanban, ListTodo, LogOut, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Get user initials for avatar
  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'U';

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/projects', label: 'Projects', icon: FolderKanban },
    { href: '/tasks', label: 'Tasks', icon: ListTodo },
  ];

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link 
          href="/dashboard" 
          className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent transition-opacity hover:opacity-80"
        >
          TaskFlow
        </Link>

        {/* Navigation Links */}
        <nav className="hidden gap-1 md:flex">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "group relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
                {isActive && (
                  <span className="absolute inset-x-0 -bottom-4 h-0.5 bg-gradient-to-r from-primary to-accent" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Menu */}
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-11 w-11 rounded-full ring-2 ring-primary/10 transition-all hover:ring-primary/30">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                  <p className="text-xs text-muted-foreground">Role: {user?.role}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard" className="flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-destructive focus:text-destructive">
                <LogOut className="h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
