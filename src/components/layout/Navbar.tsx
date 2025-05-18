
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

export function Navbar() {
  return (
    <header className="w-full py-4 px-6 md:px-12 lg:px-24 border-b bg-background/90 backdrop-blur-md fixed top-0 z-50">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-md bg-gradient flex items-center justify-center">
            <span className="text-white font-bold text-sm">CV</span>
          </div>
          <span className="font-bold text-xl">CVBuilder</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
            Home
          </Link>
          <Link to="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
            Dashboard
          </Link>
          <Link to="#" className="text-sm font-medium transition-colors hover:text-primary">
            Templates
          </Link>
          <Link to="#" className="text-sm font-medium transition-colors hover:text-primary">
            Pricing
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Link to="/login">
            <Button variant="outline">Log in</Button>
          </Link>
          <Link to="/signup">
            <Button>Sign up</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
