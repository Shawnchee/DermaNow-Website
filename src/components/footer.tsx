import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Twitter, Instagram, Linkedin, Send } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Newsletter */}
          <div className="md:col-span-1">
          <Link href="/" className="flex items-center mb-6">
                <div className="relative h-10 w-10 flex items-center justify-center rounded-full">
                  <Image
                    src="/icons/Dermanow.svg"
                    alt="DermaNow Logo"
                    width={50}
                    height={50}
                    className="object-contain"
                  />
                </div>
                <span className="text-blue-600 font-bold text-xl tracking-wide ml-2">
                  DermaNow
                </span>
              </Link>
            <p className="text-sm text-gray-600 mb-4">
              Subscribe to receive our latest news and updates.
            </p>
            <div className="flex">
              <Input
                type="email"
                placeholder="Email address"
                className="rounded-r-none border-r-0 bg-gray-50"
              />
              <Button className="rounded-l-none bg-blue-600 hover:bg-blue-700 text-white">
                Subscribe
              </Button>
            </div>
          </div>

          {/* Sitemap */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Sitemap</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Mission
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Commitments
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Approach
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Impact
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-blue-600"
                >
                  NFT for Good
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Information</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-600 hover:text-blue-600">
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Who We Are
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Contact Us</h3>
            <div className="mb-4">
              <p className="text-xs text-gray-500">General Inquiry</p>
              <a
                href="mailto:info@dermanow.charity"
                className="text-sm text-gray-600 hover:text-blue-600"
              >
                info@dermanow.charity
              </a>
            </div>
            <div className="mb-6">
              <p className="text-xs text-gray-500">Media Inquiry</p>
              <a
                href="mailto:media@dermanow.charity"
                className="text-sm text-gray-600 hover:text-blue-600"
              >
                media@dermanow.charity
              </a>
            </div>

            <h3 className="font-medium text-gray-900 mb-3">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-500">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-500">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-700">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400">
                <Send className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">
            Copyright © {new Date().getFullYear()} DermaNow All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
