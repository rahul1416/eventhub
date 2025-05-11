"use client";

import type React from "react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Calendar,
  CheckSquare,
  Home,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  Settings,
  Users,
  Video,
  Ticket,
  CalendarDays,
  BookmarkIcon,
  UserCog,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { useEffect, useState } from "react";
import { auth } from "@/firebase/firebaseConfig";
import { onAuthStateChanged, signOut, User } from "firebase/auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [accountType, setAccountType] = useState<string>("organization"); // Default to organization
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        // Fetch the user's account type from your database
        try {
          const response = await fetch(`/api/users/${firebaseUser.uid}`);
          const userData = await response.json();

          const userAccountType = userData?.accountType || "organization";
          setAccountType(userAccountType);

          // If user is on the wrong dashboard, redirect them
          const isOnPersonalPath = pathname.includes("/personal");

          if (
            userAccountType === "personal" &&
            !isOnPersonalPath &&
            pathname === "/dashboard"
          ) {
            router.push("/dashboard/personal");
          } else if (userAccountType === "organization" && isOnPersonalPath) {
            router.push("/dashboard");
          }
        } catch (error) {
          setAccountType("organization");
        }

        setLoading(false);
      } else {
        setLoading(false);
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [pathname, router]);

  // Menu items for organizational accounts
  const organizationMenuItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "My Events",
      href: "/dashboard/events",
      icon: Calendar,
    },
    {
      title: "Create Event",
      href: "/dashboard/create",
      icon: PlusCircle,
    },
    {
      title: "Check-In",
      href: "/dashboard/check-in",
      icon: CheckSquare,
    },
    {
      title: "Broadcasts",
      href: "/dashboard/broadcasts",
      icon: Video,
    },
    {
      title: "Attendees",
      href: "/dashboard/attendees",
      icon: Users,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ];

  // Menu items for personal accounts
  const personalMenuItems = [
    {
      title: "Upcoming Events",
      href: "/dashboard/personal",
      icon: CalendarDays,
    },
    {
      title: "My Tickets",
      href: "/dashboard/personal/tickets",
      icon: Ticket,
    },
    {
      title: "Saved Events",
      href: "/dashboard/personal/saved",
      icon: BookmarkIcon,
    },
    {
      title: "Manage Account",
      href: "/dashboard/my-account",
      icon: UserCog,
    },
  ];

  // Select the appropriate menu items based on account type
  const menuItems =
    accountType === "personal" ? personalMenuItems : organizationMenuItems;

  // Add logout handler
  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader className="flex flex-col gap-2 p-4">
            <div className="flex items-center gap-2 font-bold text-xl">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                E
              </div>
              EventsHub
            </div>
            {accountType === "personal" && (
              <div className="text-xs text-muted-foreground">
                Personal Account
              </div>
            )}
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span>Log out</span>
              </Button>
              <ModeToggle />
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 overflow-auto">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <div className="ml-auto flex items-center gap-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  <span>Back to Home</span>
                </Link>
              </Button>
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-medium">
                  {user?.email?.[0]?.toUpperCase() || ""}
                </span>
              </div>
            </div>
          </header>
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
