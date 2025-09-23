import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-[#f0f4f0] relative overflow-hidden">
      {/* Header */}
      <header className="absolute top-0 left-0 w-full z-20 py-8 px-6 lg:px-12">
        <div className="flex items-center justify-between">
          <Image
            src={"/invenza-white.png"}
            alt="Invenza Logo"
            width={120}
            height={30}
          />
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/auth/signin"
              className="text-black font-light hover:text-[#ff6b00] transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="text-black font-light hover:text-[#ff6b00] transition-colors"
            >
              Register
            </Link>
          </nav>
        </div>
      </header>

      <div className="relative z-10 pt-24 pb-16 px-6 lg:px-12 lg:pt-32">
        <div className="max-w-8xl mx-auto">
          {/* Main Content - Left Side */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">
            {/* Left Content - Headlines */}
            <div className="lg:col-span-8 space-y-16">
              {/* Primary Headlines */}
              <div className="space-y-8">
                <h1 className="text-4xl md:text-5xl lg:text-8xl font-mono font-extralight !tracking-tight leading-[1.1] text-black">
                  Smart Inventory Management Made Simple
                </h1>
              </div>

              {/* Contact Info */}
              <div className="space-y-4 font-mono">
                <div className="space-y-2">
                  <div className="text-sm font-light text-gray-600 uppercase tracking-wider">
                    Est. 2025
                  </div>
                  <div className="text-sm font-light text-gray-600">
                    ahnaffarhanhossain@gmail.com
                  </div>
                </div>

                {/* Social Links */}
                <div className="space-y-2">
                  <div className="text-sm font-light text-gray-600">
                    <Link
                      className="hover:text-[#ff6b00] cursor-pointer transition-colors"
                      href="https://x.com/AhnafPresents"
                    >
                      Twitter ↗
                    </Link>
                  </div>
                  <div className="text-sm font-light text-gray-600">
                    <Link
                      href="https://www.linkedin.com/in/ahnaf-farhan-hossain-715893305/"
                      className="hover:text-[#ff6b00] cursor-pointer transition-colors"
                    >
                      LinkedIn ↗
                    </Link>
                  </div>
                  <div className="text-sm font-light text-gray-600">
                    <Link
                      href={"https://github.com/AhnafFarhanHossain"}
                      className="hover:text-[#ff6b00] cursor-pointer transition-colors"
                    >
                      GitHub ↗
                    </Link>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-8">
                <Button
                  size="lg"
                  className="px-12 py-6 text-xl w-full sm:w-auto"
                >
                  <Link
                    href="/auth/register"
                    className="flex items-center gap-3"
                  >
                    Get Started Free
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Content - Features Showcase */}
            <div className="lg:col-span-4 lg:justify-self-end">
              <div className="bg-white/90 backdrop-blur-sm rounded-none border border-gray-200 p-10 shadow-lg">
                <div className="space-y-10">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-mono font-light text-black mb-4">
                      Core Features
                    </h2>
                    <p className="text-gray-600 font-light text-sm">
                      Everything you need for modern inventory management
                    </p>
                  </div>

                  <div className="space-y-8">
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-[#cc4400] to-[#ff6b00] rounded-none mx-auto flex items-center justify-center">
                        <svg
                          className="w-10 h-10 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-mono font-light text-black mb-3">
                          Real-time Tracking
                        </h3>
                        <p className="text-gray-600 font-light leading-relaxed text-sm">
                          Live inventory monitoring with instant updates and
                          comprehensive audit trails
                        </p>
                      </div>
                    </div>

                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-[#ff6b00] to-[#ff8533] rounded-none mx-auto flex items-center justify-center">
                        <svg
                          className="w-10 h-10 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-mono font-light text-black mb-3">
                          Advanced Analytics
                        </h3>
                        <p className="text-gray-600 font-light leading-relaxed text-sm">
                          Comprehensive insights to optimize inventory strategy
                          and reduce operational costs
                        </p>
                      </div>
                    </div>

                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-[#ff8533] to-[#ffb366] rounded-none mx-auto flex items-center justify-center">
                        <svg
                          className="w-10 h-10 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-mono font-light text-black mb-3">
                          Enterprise Security
                        </h3>
                        <p className="text-gray-600 font-light leading-relaxed text-sm">
                          Bank-level security with 99.9% uptime guarantee and
                          comprehensive data protection
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
