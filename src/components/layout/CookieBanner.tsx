// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/components/layout/CookieBanner.tsx
// GDPR & CCPA Compliant Cookie Consent Banner
// ═══════════════════════════════════════════════════════════════════════════

'use client';
import { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if user already accepted/declined cookies
    const consent = localStorage.getItem('codelith_cookie_consent');
    if (!consent) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => setShow(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('codelith_cookie_consent', 'accepted');
    setShow(false);

    // Initialize Google Analytics or AdSense if user accepted
    if (typeof window !== 'undefined') {
      // You can add Google Analytics initialization here
    }
  };

  const handleDecline = () => {
    localStorage.setItem('codelith_cookie_consent', 'declined');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-900/95 backdrop-blur-xl border-t border-zinc-800 p-4 z-[100] shadow-2xl animate-slide-up">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

          {/* Left Side - Icon + Message */}
          <div className="flex items-start gap-3 flex-1">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Cookie className="w-5 h-5 text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold mb-1">We Value Your Privacy</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                We use cookies to enhance your experience, serve personalized ads, and analyze traffic.
                By clicking "Accept", you consent to our use of cookies.{' '}
                <a
                  href="/privacy"
                  className="text-blue-400 hover:text-blue-300 underline transition-colors"
                >
                  Read Privacy Policy
                </a>
                {' '}or{' '}
                <a
                  href="/terms"
                  className="text-blue-400 hover:text-blue-300 underline transition-colors"
                >
                  Terms of Service
                </a>.
              </p>
            </div>
          </div>

          {/* Right Side - Action Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleDecline}
              className="flex-1 sm:flex-none px-4 py-2 text-sm text-zinc-400 hover:text-white
                       border border-zinc-700 hover:border-zinc-600 rounded-lg transition-all"
              aria-label="Decline cookies"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 sm:flex-none px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white
                       text-sm font-semibold rounded-lg transition-all shadow-lg
                       shadow-blue-500/20 hover:shadow-blue-500/40"
              aria-label="Accept cookies"
            >
              Accept All
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
