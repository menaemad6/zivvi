
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { user, signOut, isLoading } = useAuth();

  return (
    <header className="w-full py-4 px-6 md:px-12 lg:px-24 border-b border-gray-800 bg-gray-900/80 backdrop-blur-md fixed top-0 z-50">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-md bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">CV</span>
          </div>
          <span className="font-bold text-xl text-white">CVBuilder</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-sm font-medium transition-colors hover:text-blue-400 text-gray-300">
            Home
          </Link>
          {user && (
            <Link to="/dashboard" className="text-sm font-medium transition-colors hover:text-blue-400 text-gray-300">
              Dashboard
            </Link>
          )}
          <Link to="#" className="text-sm font-medium transition-colors hover:text-blue-400 text-gray-300">
            Templates
          </Link>
          <Link to="#" className="text-sm font-medium transition-colors hover:text-blue-400 text-gray-300">
            Pricing
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          {isLoading ? (
            <div className="w-8 h-8 rounded-full animate-pulse bg-gray-600"></div>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600">
                    <span className="text-white font-semibold">
                      {user.email ? user.email.charAt(0).toUpperCase() : "U"}
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="w-full cursor-pointer">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="w-full cursor-pointer">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={signOut}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                  Log in
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Sign up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
