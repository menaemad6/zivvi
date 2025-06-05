
import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-background border-t border-border py-12 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">CV</span>
            </div>
            <span className="font-semibold text-xl text-foreground">CVBuilder</span>
          </div>
          <p className="text-muted-foreground">
            Build professional CVs that stand out and get you hired.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-4 text-foreground">Product</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/templates" className="text-muted-foreground hover:text-foreground transition-colors">
                Templates
              </Link>
            </li>
            <li>
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
            </li>
            <li>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4 text-foreground">Company</h3>
          <ul className="space-y-2">
            <li>
              <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
                About
              </a>
            </li>
            <li>
              <a href="#blog" className="text-muted-foreground hover:text-foreground transition-colors">
                Blog
              </a>
            </li>
            <li>
              <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} CVBuilder. All rights reserved.</p>
      </div>
    </footer>
  );
}
