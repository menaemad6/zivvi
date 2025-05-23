
import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-12 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-md bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">CV</span>
            </div>
            <span className="font-bold text-xl text-white">CVBuilder</span>
          </div>
          <p className="text-gray-400">
            Build professional CVs that stand out and get you hired.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-4 text-white">Product</h3>
          <ul className="space-y-2">
            <li>
              <Link to="#" className="text-gray-400 hover:text-white transition-colors">
                Templates
              </Link>
            </li>
            <li>
              <Link to="#" className="text-gray-400 hover:text-white transition-colors">
                Features
              </Link>
            </li>
            <li>
              <Link to="#" className="text-gray-400 hover:text-white transition-colors">
                Pricing
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4 text-white">Company</h3>
          <ul className="space-y-2">
            <li>
              <Link to="#" className="text-gray-400 hover:text-white transition-colors">
                About
              </Link>
            </li>
            <li>
              <Link to="#" className="text-gray-400 hover:text-white transition-colors">
                Blog
              </Link>
            </li>
            <li>
              <Link to="#" className="text-gray-400 hover:text-white transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
        <p>&copy; {new Date().getFullYear()} CVBuilder. All rights reserved.</p>
      </div>
    </footer>
  );
}
