'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  LogOut,
  User,
  Route,
} from 'lucide-react';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Logo } from './logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';

type DashboardLayoutProps = {
  children: React.ReactNode;
  userType: 'driver' | 'passenger';
};

export function DashboardLayout({ children, userType }: DashboardLayoutProps) {
  const pathname = usePathname();
  const userInitial = userType === 'driver' ? 'D' : 'P';
  const userTypeCapitalized = userType.charAt(0).toUpperCase() + userType.slice(1);
  
  const navItems = [
    { href: `/${userType}`, label: 'Dashboard', icon: LayoutDashboard },
    { href: `/${userType}/my-rides`, label: 'My Rides', icon: Route },
    { href: `/${userType}/profile`, label: 'Profile', icon: User },
  ];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item, index) => (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                        <Link href="/">
                            <LogOut />
                            <span>Logout</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 w-full items-center justify-between border-b bg-card px-6">
            <SidebarTrigger />
            <div className="flex items-center gap-4">
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={`https://placehold.co/100x100.png`} data-ai-hint="person portrait" alt="User Avatar" />
                                <AvatarFallback>{userInitial}</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{userTypeCapitalized} Name</p>
                            <p className="text-xs leading-none text-muted-foreground">
                            {userType}@ridelink.com
                            </p>
                        </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href={`/${userType}/profile`}>
                                <User className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </Link>
                        </DropdownMenuItem>
                         <DropdownMenuItem asChild>
                            <Link href="/">
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Logout</span>
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
