"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { auth } from "@/firebase/firebaseConfig";
import { onAuthStateChanged, signOut, User } from "firebase/auth";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [accountType, setAccountType] = useState<string>("organization");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const fetchAccountType = async () => {
        try {
          const response = await fetch(`/api/users/${user.uid}`);
          const userData = await response.json();
          if (userData && userData.accountType) {
            setAccountType(userData.accountType);
          }
        } catch (error) {
          console.error("Error fetching user account type:", error);
        }
      };

      fetchAccountType();
    }
  }, [user]);

  const getDashboardPath = () => {
    if (!user) return "/login";
    return accountType === "personal" ? "/dashboard/personal" : "/dashboard";
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass-effect py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
            E
          </div>
          <span className="text-xl font-bold tracking-tight">EventsHub</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/events"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Discover Events
          </Link>
          <Link
            href="/create"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Create Event
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Contact
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <Link href={getDashboardPath()}>
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
              <div className="relative group">
                <Button variant="outline" size="icon" className="rounded-full">
                  <span className="text-primary font-medium">
                    {user.email?.[0]?.toUpperCase() || ""}
                  </span>
                </Button>
                <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-black border rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  <button
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-muted"
                    onClick={() => signOut(auth)}
                  >
                    <LogOut className="h-4 w-4" /> Log out
                  </button>
                </div>
              </div>
              <ModeToggle />
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="gradient-bg button-glow">
                  Sign up
                </Button>
              </Link>
              <ModeToggle />
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4 md:hidden">
          <ModeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden glass-effect absolute top-full left-0 right-0 p-4 animate-fade-in-up">
          <nav className="flex flex-col gap-4">
            <Link
              href="/events"
              className="text-sm font-medium p-2 hover:bg-primary/10 rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Discover Events
            </Link>
            <Link
              href="/create"
              className="text-sm font-medium p-2 hover:bg-primary/10 rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Create Event
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium p-2 hover:bg-primary/10 rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium p-2 hover:bg-primary/10 rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="flex flex-col gap-2 pt-2 border-t">
              {user ? (
                <>
                  <Link
                    href={getDashboardPath()}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button variant="outline" className="w-full">
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setIsMenuOpen(false);
                      signOut(auth);
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" /> Log out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Log in
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full gradient-bg button-glow">
                      Sign up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
