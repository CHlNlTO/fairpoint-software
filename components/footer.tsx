'use client';

import { ThemeSwitch } from '@/components/ui/theme-switch';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-black text-white py-16 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Fairpoint</h3>
            <p className="text-slate-400 dark:text-slate-300 mb-4">
              Smart accounting software specifically built for Filipino
              entrepreneurs and businesses.
            </p>
            <div className="text-slate-400 dark:text-slate-300 text-sm">
              <p>📞 +63 917 123 4567</p>
              <p>✉️ hello@fairpoint.com</p>
              <p>📍 Tanauan City, Batangas</p>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-slate-400 dark:text-slate-300">
              <li>
                <Link
                  href="#features"
                  className="hover:text-white transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="hover:text-white transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="#updates"
                  className="hover:text-white transition-colors"
                >
                  Updates
                </Link>
              </li>
              <li>
                <Link
                  href="#api"
                  className="hover:text-white transition-colors"
                >
                  API
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-slate-400 dark:text-slate-300">
              <li>
                <Link
                  href="#help"
                  className="hover:text-white transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="#contact"
                  className="hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="#bir"
                  className="hover:text-white transition-colors"
                >
                  BIR Updates
                </Link>
              </li>
              <li>
                <Link
                  href="#training"
                  className="hover:text-white transition-colors"
                >
                  Training
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-slate-400 dark:text-slate-300">
              <li>
                <Link
                  href="#about"
                  className="hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="#careers"
                  className="hover:text-white transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="#press"
                  className="hover:text-white transition-colors"
                >
                  Press
                </Link>
              </li>
              <li>
                <Link
                  href="#partners"
                  className="hover:text-white transition-colors"
                >
                  Partners
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 dark:border-slate-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 dark:text-slate-300 text-sm">
            © 2023 Fairpoint Accounting & Marketing. All rights reserved.
          </p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <p className="text-slate-400 dark:text-slate-300 text-sm">
              Powered by{' '}
              <a
                href="https://ckdigitals.com"
                target="_blank"
                className="font-bold hover:text-white transition-colors"
                rel="noreferrer"
              >
                CKDigitals
              </a>
            </p>
            <ThemeSwitch />
          </div>
        </div>
      </div>
    </footer>
  );
}
