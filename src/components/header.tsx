"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import connectMetamask from "@/hooks/connectMetamask";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  const { walletAddress, connectWallet } = connectMetamask();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    // Set initial scroll state
    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div ref={navRef}>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled ? "bg-white shadow-lg" : "bg-transparent"
        )}
      >
        {/* Top accent bar */}

        {/* Main navbar content */}
        <div className="max-w-7xl mx-auto py-3">
          <div className="flex items-center justify-between px-4 py-3 md:py-0 md:px-6">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative h-10 w-10 overflow-hidden">
                <div className="absolute inset-0 bg-blue-600 rounded-full"></div>
                <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center">
                  <div className="text-blue-600 font-bold text-xl">D</div>
                </div>
              </div>
              <span
                className={cn(
                  "font-bold text-xl",
                  scrolled ? "text-blue-700" : "text-white"
                )}
              >
                DermaNow
              </span>
            </Link>

            <div>
              {walletAddress ? (
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                  disabled
                >
                  Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </button>
              ) : (
                <button
                  onClick={connectWallet}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-400"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Background overlay for transparent navbar */}
        {!scrolled && (
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-700 to-blue-600"></div>
        )}
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-[65px] md:h-[65px]"></div>
    </div>
  );
}