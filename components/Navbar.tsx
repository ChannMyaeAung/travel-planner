"use client";
import { logout } from "@/lib/auth-actions";
import { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Globe, MapPin, User, LogOut, LogIn, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar({ session }: { session: Session | null }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-slate-200/80 shadow-sm animate-fade-in-down">
      <div className="container flex items-center justify-between px-6 mx-auto h-16 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2.5 group">
          <div className="p-2 rounded-xl transition-colors duration-200">
            <Image
              src="/logo.png"
              alt="logo"
              width={52}
              height={52}
              className=""
            />
          </div>
          <span className="text-lg font-bold text-slate-900">
            Travel Planner
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center space-x-1">
          {session ? (
            <>
              <Link href="/trips">
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                >
                  <MapPin size={16} />
                  <span>My Trips</span>
                </Button>
              </Link>
              <Link href="/globe">
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                >
                  <Globe size={16} />
                  <span>Globe</span>
                </Button>
              </Link>

              <div className="flex items-center space-x-3 ml-3 pl-3 border-l border-slate-200">
                <div className="flex items-center space-x-2">
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt="Profile"
                      width={30}
                      height={30}
                      className="rounded-full ring-2 ring-slate-200"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                      <User size={14} className="text-slate-500" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-slate-700 hidden lg:block">
                    {session.user?.name}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="flex items-center space-x-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors duration-200"
                >
                  <LogOut size={15} />
                  <span>Sign Out</span>
                </Button>
              </div>
            </>
          ) : (
            <Link href="/sign-in">
              <Button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition-all duration-200">
                <LogIn size={16} />
                <span>Sign In</span>
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-600"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 animate-fade-in-down">
          <div className="container mx-auto px-6 py-4 space-y-2">
            {session ? (
              <>
                <div className="flex items-center space-x-3 pb-3 mb-1 border-b border-slate-100">
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt="Profile"
                      width={36}
                      height={36}
                      className="rounded-full ring-2 ring-slate-200"
                    />
                  ) : (
                    <div className="w-9 h-9 bg-slate-200 rounded-full flex items-center justify-center">
                      <User size={16} className="text-slate-500" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-slate-900 text-sm">
                      {session.user?.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {session.user?.email}
                    </p>
                  </div>
                </div>
                <Link href="/trips" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-slate-700 hover:bg-slate-50"
                  >
                    <MapPin size={18} /> My Trips
                  </Button>
                </Link>
                <Link href="/globe" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-slate-700 hover:bg-slate-50"
                  >
                    <Globe size={18} /> Globe
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full justify-start gap-3 text-slate-500 hover:text-red-600 hover:bg-red-50"
                >
                  <LogOut size={18} /> Sign Out
                </Button>
              </>
            ) : (
              <Link href="/sign-in" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                  <LogIn size={18} /> Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
