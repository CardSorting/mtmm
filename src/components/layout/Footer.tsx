import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="hover:text-white">
                  Features
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white">
                  Showcase
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="hover:text-white">
                  Documentation
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white">
                  Guides
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="hover:text-white">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white">
                  Terms
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white">
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">© 2024 AI Companions. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white">
              Twitter
            </a>
            <a href="#" className="hover:text-white">
              LinkedIn
            </a>
            <a href="#" className="hover:text-white">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
