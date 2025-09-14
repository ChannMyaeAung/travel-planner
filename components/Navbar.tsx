"use client";
import { login, logout } from "@/lib/auth-actions";
import { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Globe, MapPin, User, LogOut, LogIn, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar({ session }: { session: Session | null }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-lg">
      <div className="container flex items-center justify-between px-6 mx-auto h-16 lg:px-8">
        {/* Logo Section */}
        <Link href={"/"} className="flex items-center space-x-3 group">
          <div className="relative p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl group-hover:scale-105 transition-transform duration-200">
            <Image
              src={"/logo.png"}
              alt="logo"
              width={32}
              height={32}
              className="filter brightness-0 invert"
            />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Travel Planner
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          {session ? (
            <>
              <Link href={"/trips"}>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                >
                  <MapPin size={18} />
                  <span>My Trips</span>
                </Button>
              </Link>
              <Link href={"/globe"}>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50"
                >
                  <Globe size={18} />
                  <span>Globe</span>
                </Button>
              </Link>

              {/* User Profile Section */}
              <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt="Profile"
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <User size={16} className="text-white" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden lg:block">
                    {session.user?.name}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="flex items-center space-x-2 border-gray-300 hover:border-red-300 hover:text-red-600 hover:bg-red-50"
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </Button>
              </div>
            </>
          ) : (
            <Button
              onClick={login}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <LogIn size={18} />
              <span>Sign In</span>
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMobileMenu}
            className="p-2"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg border-t border-gray-200/50">
          <div className="container mx-auto px-6 py-4 space-y-3">
            {session ? (
              <>
                {/* User Info */}
                <div className="flex items-center space-x-3 pb-3 border-b border-gray-200">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt="Profile"
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    ) : (
                      <User size={20} className="text-white" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {session.user?.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {session.user?.email}
                    </p>
                  </div>
                </div>

                {/* Navigation Links */}
                <Link href={"/trips"} onClick={closeMobileMenu}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start flex items-center space-x-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  >
                    <MapPin size={20} />
                    <span>My Trips</span>
                  </Button>
                </Link>

                <Link href={"/globe"} onClick={closeMobileMenu}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start flex items-center space-x-3 text-gray-700 hover:text-purple-600 hover:bg-purple-50"
                  >
                    <Globe size={20} />
                    <span>Globe</span>
                  </Button>
                </Link>

                {/* Logout Button */}
                <Button
                  variant="outline"
                  onClick={() => {
                    logout();
                    closeMobileMenu();
                  }}
                  className="w-full justify-start flex items-center space-x-3 border-gray-300 hover:border-red-300 hover:text-red-600 hover:bg-red-50"
                >
                  <LogOut size={20} />
                  <span>Sign Out</span>
                </Button>
              </>
            ) : (
              <Button
                onClick={() => {
                  login();
                  closeMobileMenu();
                }}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
              >
                <LogIn size={20} />
                <span>Sign In</span>
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
