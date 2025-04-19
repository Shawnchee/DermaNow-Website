"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import connectMetamask from "@/hooks/connectMetamask";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  const { walletAddress, connectWallet } = connectMetamask();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const disconnectWallet = () => {
    localStorage.removeItem("walletAddress");
    window.location.reload();
  };

  return (
    <div ref={navRef}>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled ? "bg-white shadow-lg" : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto py-3">
          <div className="flex items-center justify-between px-4 py-3 md:py-0 md:px-6">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative h-12 w-12 flex items-center justify-center rounded-full bg-white">
                <Image
                  src="/icons/Dermanow.svg"
                  alt="DermaNow Logo"
                  width={60}
                  height={60}
                  className="object-contain"
                />
              </div>
              <span
                className={cn(
                  "font-bold text-2xl tracking-wide",
                  scrolled ? "text-blue-700" : "text-white"
                )}
              >
                DermaNow
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              {/* Explore */}
              <div className="group relative">
                <span
                  className={cn(
                    "cursor-pointer text-sm font-medium flex items-center gap-1",
                    scrolled
                      ? "text-blue-700 hover:text-blue-900"
                      : "text-white hover:text-blue-200"
                  )}
                >
                  Explore
                  <ChevronDown
                    className={cn(
                      "h-4 w-4",
                      scrolled
                        ? "text-blue-700 group-hover:text-blue-900"
                        : "text-white group-hover:text-blue-200"
                    )}
                  />
                </span>
                <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition duration-200 z-50">
                  <Link
                    href="/why-us"
                    className="block px-4 py-2 text-gray-700 hover:text-blue-600"
                  >
                    Why Us
                  </Link>
                  <Link
                    href="/shariah"
                    className="block px-4 py-2 text-gray-700 hover:text-blue-600"
                  >
                    Shariah
                  </Link>
                </div>
              </div>

              {/* Charity */}
              <div className="group relative">
                <span
                  className={cn(
                    "cursor-pointer text-sm font-medium flex items-center gap-1",
                    scrolled
                      ? "text-blue-700 hover:text-blue-900"
                      : "text-white hover:text-blue-200"
                  )}
                >
                  Charity
                  <ChevronDown
                    className={cn(
                      "h-4 w-4",
                      scrolled
                        ? "text-blue-700 group-hover:text-blue-900"
                        : "text-white group-hover:text-blue-200"
                    )}
                  />
                </span>
                <div className="absolute left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition duration-200 z-50">
                  <Link
                    href="/charity/browse-projects"
                    className="block px-4 py-2 text-gray-700 hover:text-blue-600"
                  >
                    Browse Projects
                  </Link>
                  <Link
                    href="/charity/start-project"
                    className="block px-4 py-2 text-gray-700 hover:text-blue-600"
                  >
                    Start a Project
                  </Link>
                  <Link
                    href="/service-providers"
                    className="block px-4 py-2 text-gray-700 hover:text-blue-600"
                  >
                    Select Service Providers
                  </Link>
                </div>
              </div>

              {/* Funding */}
              <div className="group relative">
                <span
                  className={cn(
                    "cursor-pointer text-sm font-medium flex items-center gap-1",
                    scrolled
                      ? "text-blue-700 hover:text-blue-900"
                      : "text-white hover:text-blue-200"
                  )}
                >
                  Funding
                  <ChevronDown
                    className={cn(
                      "h-4 w-4",
                      scrolled
                        ? "text-blue-700 group-hover:text-blue-900"
                        : "text-white group-hover:text-blue-200"
                    )}
                  />
                </span>
                <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition duration-200 z-50">
                  <Link
                    href="/onramp"
                    className="block px-4 py-2 text-gray-700 hover:text-blue-600"
                  >
                    Deposit
                  </Link>
                  <Link
                    href="/defi"
                    className="block px-4 py-2 text-gray-700 hover:text-blue-600"
                  >
                    Shariah-Compliant Staking
                  </Link>
                </div>
              </div>
              {/* Resources & Partnerships */}
              <div className="group relative">
                <span
                  className={cn(
                    "cursor-pointer text-sm font-medium flex items-center gap-1",
                    scrolled
                      ? "text-blue-700 hover:text-blue-900"
                      : "text-white hover:text-blue-200"
                  )}
                >
                  Resources & Partnerships
                  <ChevronDown
                    className={cn(
                      "h-4 w-4",
                      scrolled
                        ? "text-blue-700 group-hover:text-blue-900"
                        : "text-white group-hover:text-blue-200"
                    )}
                  />
                </span>
                <div className="absolute left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition duration-200 z-50">
                  <Link
                    href="https://dermanow.gitbook.io/dermanow-docs"
                    className="block px-4 py-2 text-gray-700 hover:text-blue-600"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Documentation/Guide
                  </Link>
                  <Link
                    href="/partnerships"
                    className="block px-4 py-2 text-gray-700 hover:text-blue-600"
                  >
                    Partnership (Zakat/Waqf Institution)
                  </Link>
                  <Link
                    href="/blog"
                    className="block px-4 py-2 text-gray-700 hover:text-blue-600"
                  >
                    Charity Education Blog
                  </Link>
                </div>
              </div>
              {/* Profile */}
              <Link
                href="/profile"
                className={cn(
                  "text-sm font-medium",
                  scrolled
                    ? "text-blue-700 hover:text-blue-900"
                    : "text-white hover:text-blue-200"
                )}
              >
                Profile
              </Link>
            </div>

            {/* Wallet Section */}
            <div className="flex items-center space-x-4">
              {walletAddress ? (
                <>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                    disabled
                  >
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </button>
                  <button
                    onClick={disconnectWallet}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-400"
                  >
                    Disconnect
                  </button>
                </>
              ) : (
                <button
                  onClick={connectWallet}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-400"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>

        {!scrolled && (
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-700 to-blue-600"></div>
        )}
      </nav>

      <div className="h-[65px] md:h-[65px]"></div>
    </div>
  );
}
