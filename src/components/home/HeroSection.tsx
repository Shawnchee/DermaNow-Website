"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, TrendingUp, Shield } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Animated counter component
function AnimatedCounter({
  value,
  label,
  icon,
}: {
  value: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center bg-white rounded-xl shadow-lg p-4 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
    >
      <div className="absolute -right-6 -top-6 w-16 h-16 bg-blue-100 rounded-full opacity-50" />
      <div className="absolute -left-6 -bottom-6 w-12 h-12 bg-blue-100 rounded-full opacity-50" />

      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-2 text-blue-600">{icon}</div>
        <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
        <p className="text-sm text-gray-500 mt-1">{label}</p>
      </div>
    </motion.div>
  );
}

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {" "}
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/landing2.jpg"
          alt="Background"
          fill
          className="object-cover opacity-80"
          priority
        />
      </div>
      <div className="container mx-auto px-4 pt-12 relative z-10">
        {/* Main content - Horizontal layout with staggered sections */}
        <div className="flex flex-col space-y-16 md:space-y-24">
          {/* Top section - Title and intro */}
          <motion.div
            className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-md border border-blue-100 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-block mb-4 px-4 py-1 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full text-white text-sm font-medium"
              >
                Malaysia's First Blockchain Charity Platform
              </motion.div>

              <motion.h1
                className="leading-tight text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-800 to-blue-900"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.7 }}
              >
                The Future of Charity is Transparent
                <br className="block" />
                <span className="relative">
                  <span className="relative z-10">
                    ------------------------
                  </span>
                  <span className="absolute bottom-2 left-0 w-full h-3 bg-blue-200 opacity-90 z-0"></span>
                </span>
              </motion.h1>

              <motion.p
                className="text-lg text-gray-600 max-w-2xl mx-auto mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.7 }}
              >
                With DermaNow, every donation is securely recorded on the
                blockchain — giving you peace of mind and real-time impact
                tracking.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Link href="/charity/browse-projects" passHref>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-6 rounded-lg text-lg h-auto group transition-all duration-300 hover:shadow-lg hover:shadow-blue-200">
                    <span className="flex items-center gap-2">
                      Explore Projects
                      <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </Button>
                </Link>
                <Link href="/security/verify-organizations" passHref>
                  <Button
                    variant="outline"
                    className="border-blue-600 text-blue-700 hover:bg-blue-50 px-6 py-6 rounded-lg text-lg h-auto"
                  >
                    Learn How It Works
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Middle section - Features with icons */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.2 },
              },
            }}
          >
            <motion.div
              className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md border border-blue-100"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Blockchain Verified
              </h3>
              <p className="text-gray-600">
                Every transaction is recorded on the blockchain, ensuring
                complete transparency and accountability.
              </p>
            </motion.div>

            <motion.div
              className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md border border-blue-100"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Verified Local Causes
              </h3>
              <p className="text-gray-600">
                We thoroughly vet all Malaysian organizations to ensure your
                donations reach legitimate causes.
              </p>
            </motion.div>

            <motion.div
              className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md border border-blue-100"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Impact Tracking
              </h3>
              <p className="text-gray-600">
                Follow your donation's journey and see the real-world impact of
                your generosity in Malaysian communities.
              </p>
            </motion.div>
          </motion.div>

          {/* Bottom section - Stats and image */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Stats */}
            <motion.div
              className="grid grid-cols-2 gap-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.15 },
                },
              }}
            >
              <AnimatedCounter
                value="60+"
                label="Fundraises per year"
                icon={<TrendingUp className="h-6 w-6" />}
              />

              <AnimatedCounter
                value="RM 750M+"
                label="Raised per year"
                icon={<TrendingUp className="h-6 w-6" />}
              />

              <AnimatedCounter
                value="250,000+"
                label="Fundraisers per year"
                icon={<TrendingUp className="h-6 w-6" />}
              />

              <AnimatedCounter
                value="100%"
                label="Transparent tracking"
                icon={<Shield className="h-6 w-6" />}
              />
            </motion.div>

            {/* Image with overlay */}
            <motion.div
              className="relative rounded-2xl overflow-hidden shadow-2xl"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <Image
                src="/boxes.jpg"
                alt="Malaysian community support"
                width={600}
                height={500}
                className="object-cover w-full h-[400px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 via-transparent to-transparent"></div>

              <motion.div
                className="absolute bottom-0 left-0 right-0 p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-white"
                      >
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        "Every donation, no matter how small, has the power to
                        change lives in our Malaysian communities."
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        — DermaNow Community
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
      {/* Bottom wave decoration */}
      <div className="relative h-16">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          className="absolute bottom-0 w-full"
        >
          <path
            fill="#2563eb"
            fillOpacity="0.1"
            d="M0,128L48,144C96,160,192,192,288,186.7C384,181,480,139,576,138.7C672,139,768,181,864,181.3C960,181,1056,139,1152,133.3C1248,128,1344,160,1392,176L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </div>
  );
}
