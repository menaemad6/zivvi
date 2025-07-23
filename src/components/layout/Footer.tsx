
import React from 'react';
import { Link } from 'react-router-dom';
import { LOGO_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-background via-blue-50 to-indigo-100 border-t border-border py-12 px-6 md:px-12 lg:px-24 shadow-inner">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 items-center">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg ring-2 ring-white/60">
              <span className="text-white font-extrabold text-lg tracking-tight drop-shadow-lg">Z</span>
            </div>
            <span className="font-extrabold text-2xl text-foreground tracking-tight bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 bg-clip-text text-transparent drop-shadow-lg">{LOGO_NAME}</span>
          </div>
          <p className="text-muted-foreground text-base max-w-xs">
            Build professional CVs that stand out and get you hired. Powered by AI, designed for you.
          </p>
          <div className="flex space-x-3 mt-2">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.59-2.47.7a4.3 4.3 0 0 0 1.88-2.37 8.59 8.59 0 0 1-2.72 1.04A4.28 4.28 0 0 0 16.11 4c-2.37 0-4.29 1.92-4.29 4.29 0 .34.04.67.11.99C7.69 9.13 4.07 7.38 1.64 4.7c-.37.64-.58 1.39-.58 2.19 0 1.51.77 2.84 1.95 3.62-.72-.02-1.4-.22-1.99-.55v.06c0 2.11 1.5 3.87 3.5 4.27-.36.1-.74.16-1.13.16-.28 0-.54-.03-.8-.08.54 1.68 2.12 2.9 3.99 2.93A8.6 8.6 0 0 1 2 19.54c-.32 0-.63-.02-.94-.06A12.13 12.13 0 0 0 8.29 21.5c7.55 0 11.68-6.26 11.68-11.68 0-.18-.01-.36-.02-.54A8.18 8.18 0 0 0 22.46 6z"/></svg></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-700 transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm15.5 11.28h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.88v1.36h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v5.59z"/></svg></a>
          </div>
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
        <p>&copy; {new Date().getFullYear()} {LOGO_NAME}. All rights reserved.</p>
      </div>
    </footer>
  );
}
