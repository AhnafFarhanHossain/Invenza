"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Feature Card Component
const FeatureCard = ({ title, description, icon }: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) => (
  <div className="bg-white border border-gray-200 rounded-lg p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#ff8533] to-[#ff6b00] rounded-lg flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  </div>
);

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  return (
    <main className="min-h-screen w-full bg-gray-50 font-sans">
      {/* Header */}
      <header className="relative z-20 py-6 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <Image
                src={"/invenza-white.png"}
                alt="Invenza Logo"
                width={120}
                height={30}
                className="h-8"
              />
            </Link>
            <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
              <Link
                href="/auth/signin"
                className="text-gray-600 hover:text-[#ff6b00] transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="text-gray-600 hover:text-[#ff6b00] transition-colors"
              >
                Register
              </Link>
            </nav>
            {/* Mobile menu button */}
            <button className="md:hidden text-gray-600 z-30" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 z-40 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 25,
              mass: 0.8
            }}
            className="fixed top-0 right-0 h-full w-72 bg-white z-50 md:hidden shadow-xl"
          >
            <div className="flex flex-col h-full">
              {/* Menu Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <Link href="/" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
                  <Image
                    src={"/invenza-white.png"}
                    alt="Invenza Logo"
                    width={100}
                    height={25}
                    className="h-6"
                  />
                </Link>
                <button 
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Menu Content */}
              <div className="flex-1 overflow-y-auto">
                <nav className="p-6">
                  <div className="space-y-1">
                    <Link
                      href="/auth/signin"
                      className="flex items-center px-4 py-3 text-base font-light text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span>Sign In</span>
                    </Link>
                    <Link
                      href="/auth/register"
                      className="flex items-center px-4 py-3 text-base font-light text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span>Register</span>
                    </Link>
                  </div>
                </nav>
              </div>
              
              {/* Menu Footer */}
              <div className="p-6 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-xs font-light text-gray-500">
                    &copy; {new Date().getFullYear()} Invenza
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="relative z-10 py-20 md:py-28 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-24">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium tracking-tighter leading-tight text-gray-900 mb-6">
              Modern Inventory Management,
              <br />
              <span className="bg-gradient-to-r from-[#ff8533] to-[#ff6b00] bg-clip-text text-transparent">
                Redesigned.
              </span>
            </h1>

            <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-10">
              Invenza is a powerful, intuitive, and scalable inventory management solution designed for modern businesses.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="px-8 py-6 text-lg w-full sm:w-auto bg-gradient-to-r from-[#ff8533] to-[#ff6b00] text-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
              >
                <Link
                  href="/auth/register"
                  className="flex items-center gap-2"
                >
                  Get Started for Free
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg w-full sm:w-auto rounded-full"
              >
                <Link
                  href="/auth/signin"
                >
                  Request a Demo
                </Link>
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            <FeatureCard
              title="Real-time Analytics"
              description="Gain valuable insights into your inventory with our powerful, real-time analytics and reporting tools."
              icon={
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
            />
            <FeatureCard
              title="Live Tracking"
              description="Monitor every item in your inventory in real-time with instant updates and a comprehensive audit trail."
              icon={
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              }
            />
            <FeatureCard
              title="Enterprise-Grade Security"
              description="Your data is protected with bank-level encryption and advanced security protocols."
              icon={
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
            />
          </div>

          {/* Final CTA */}
          <div className="text-center bg-white rounded-lg border border-gray-200 p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ready to take control of your inventory?
            </h2>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              Sign up for a free trial today and experience the future of inventory management.
            </p>
            <Button
              size="lg"
              className="px-8 py-6 text-lg w-full sm:w-auto bg-gradient-to-r from-[#ff8533] to-[#ff6b00] text-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
            >
              <Link
                href="/auth/register"
                className="flex items-center gap-2"
              >
                Get Started for Free
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="py-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Invenza. All rights reserved.
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="https://x.com/AhnafPresents"
                className="text-gray-500 hover:text-[#ff6b00] transition-colors text-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter
              </Link>
              <Link
                href="https://www.linkedin.com/in/ahnaf-farhan-hossain-715893305/"
                className="text-gray-500 hover:text-[#ff6b00] transition-colors text-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </Link>
              <Link
                href={"https://github.com/AhnafFarhanHossain"}
                className="text-gray-500 hover:text-[#ff6b00] transition-colors text-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
