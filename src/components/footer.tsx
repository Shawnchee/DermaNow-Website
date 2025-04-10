"use client";

import type React from "react";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  Mail,
  MapPin,
  Phone,
  ArrowRight,
  Heart,
  ChevronRight,
  Shield,
  Globe,
} from "lucide-react";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement newsletter subscription logic here
    alert(`Subscribed with email: ${email}`);
    setEmail("");
  };

  const quickLinks = [
    { name: "Getting Started", href: "/getting-started" },
    { name: "FAQ", href: "/faq" },
    { name: "Terms & Conditions", href: "/terms-and-conditions" },
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Blog", href: "/charity/blog" },
  ];

  const socialLinks = [
    { icon: <Facebook className="h-5 w-5" />, name: "Facebook", href: "#" },
    { icon: <Twitter className="h-5 w-5" />, name: "Twitter", href: "#" },
    { icon: <Instagram className="h-5 w-5" />, name: "Instagram", href: "#" },
    { icon: <Linkedin className="h-5 w-5" />, name: "LinkedIn", href: "#" },
    { icon: <Github className="h-5 w-5" />, name: "GitHub", href: "#" },
  ];

  return (
    <footer className="relative">
      {/* Wave decoration */}
      <div className="absolute top-0 left-0 right-0 h-16 overflow-hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          className="absolute bottom-0 w-full transform translate-y-1"
        >
          <path
            fill="#1e40af"
            fillOpacity="1"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>

      <div className="bg-gradient-to-br from-blue-800 to-blue-900 text-white pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top section with logo and newsletter */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16 pb-16 border-b border-blue-700/50">
            {/* Logo and about */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-6">
                <div className="relative h-12 w-12 overflow-hidden mr-3">
                  <div className="absolute inset-0 bg-blue-500 rounded-full"></div>
                  <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center">
                    <div className="text-blue-600 font-bold text-2xl">D</div>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-white">DermaNow</h2>
              </div>

              <p className="text-blue-100 text-base leading-relaxed mb-8 max-w-xl">
                DermaNow harnesses blockchain to make charity more transparent
                and efficient — ensuring your donations reach those who need
                them most.
              </p>

              <div className="flex flex-wrap gap-4">
                {socialLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link.href}
                    className="w-10 h-10 rounded-full bg-blue-700/50 hover:bg-blue-600 flex items-center justify-center transition-colors"
                    aria-label={link.name}
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-blue-700/30 rounded-xl p-6 backdrop-blur-sm border border-blue-600/20">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Mail className="mr-2 h-5 w-5 text-blue-300" /> Stay Updated
              </h3>
              <p className="text-blue-100 text-sm mb-4">
                Subscribe to our newsletter for the latest updates on projects,
                impact stories, and blockchain innovations.
              </p>
              <form onSubmit={handleSubscribe} className="space-y-3">
                <Input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-blue-800/50 border-blue-600/50 text-white placeholder:text-blue-300 focus-visible:ring-blue-400"
                />
                <Button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-400 text-white flex items-center justify-center gap-2 group"
                >
                  Subscribe
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </form>
            </div>
          </div>

          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-16">
            {/* Column 1: Our Mission */}
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <Heart className="mr-2 h-5 w-5 text-blue-300" /> Our Mission
              </h3>
              <p className="text-blue-100 text-sm leading-relaxed">
                To revolutionize how Malaysians
                give — using blockchain to ensure your contributions are
                transparent, traceable, and meaningful.
              </p>
              <div className="mt-4 flex items-center">
                <Shield className="h-5 w-5 text-blue-300 mr-2" />
                <span className="text-blue-100 text-sm">
                  Verified by Blockchain Technology
                </span>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-4">Help & Resources</h3>
              <ul className="space-y-2">
                {quickLinks.map((link, i) => (
                  <li key={i}>
                    <Link
                      href={link.href}
                      className="text-blue-100 hover:text-white transition-colors flex items-center text-sm group"
                    >
                      <ChevronRight className="mr-2 h-3 w-3 transition-transform group-hover:translate-x-1" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Contact */}
            <div>
              <h3 className="text-lg font-bold mb-4">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 text-blue-300 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-blue-100 text-sm">
                    UMHackathon, <br />
                    Silicon Valley Tech District, <br />
                    11700 Gelugor, Penang, Malaysia.
                  </span>
                </li>
                <li className="flex items-center">
                  <Phone className="h-5 w-5 text-blue-300 mr-2 flex-shrink-0" />
                  <span className="text-blue-100 text-sm">+60 - 12345678</span>
                </li>
                <li className="flex items-center">
                  <Mail className="h-5 w-5 text-blue-300 mr-2 flex-shrink-0" />
                  <a
                    href="mailto:info@DermaNow.com"
                    className="text-blue-100 hover:text-white transition-colors text-sm"
                  >
                    info@DermaNow.com
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Global Impact */}
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <Globe className="mr-2 h-5 w-5 text-blue-300" /> Global Impact
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-blue-100 text-sm">Projects Funded</span>
                  <span className="text-white font-bold">250+</span>
                </div>
                <div className="w-full bg-blue-700/50 rounded-full h-1.5">
                  <div className="bg-blue-400 h-1.5 rounded-full w-[85%]"></div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-blue-100 text-sm">
                    Countries Reached
                  </span>
                  <span className="text-white font-bold">42</span>
                </div>
                <div className="w-full bg-blue-700/50 rounded-full h-1.5">
                  <div className="bg-blue-400 h-1.5 rounded-full w-[65%]"></div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-blue-100 text-sm">Beneficiaries</span>
                  <span className="text-white font-bold">2M+</span>
                </div>
                <div className="w-full bg-blue-700/50 rounded-full h-1.5">
                  <div className="bg-blue-400 h-1.5 rounded-full w-[95%]"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="pt-8 border-t border-blue-700/50 flex flex-col md:flex-row justify-between items-center text-sm text-blue-200">
            <p>© {new Date().getFullYear()} DermaNow. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link
                href="/terms-and-conditions"
                className="hover:text-white transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/privacy-policy"
                className="hover:text-white transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/cookies"
                className="hover:text-white transition-colors"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
