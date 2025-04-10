"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useAnimation, useMotionValue } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Link as LinkIcon,
  Gift,
  FileText,
  CheckCircle,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const features = [
  {
    title: "Create & Connect Your Wallet",
    description:
      "Set up a MetaMask wallet, secure your keys, and connect it to DermaNow to start donating securely.",
    icon: <LinkIcon className="h-6 w-6 text-white" />,
    color: "bg-blue-600",
  },
  {
    title: "Making Your First Donation",
    description:
      "Follow a step-by-step guide on selecting a cause, donating in ETH, and tracking your contributions on the blockchain.",
    icon: <Gift className="h-6 w-6 text-white" />,
    color: "bg-blue-700",
  },
  {
    title: "Understanding Smart Contracts",
    description:
      "Learn how DermaNow's milestone-based smart contracts ensure that funds are released only when goals are met.",
    icon: <FileText className="h-6 w-6 text-white" />,
    color: "bg-blue-600",
  },
  {
    title: "Verifying Charity Legitimacy",
    description:
      "Discover how AI-powered verification and wallet analysis help ensure your donations go to trustworthy charities.",
    icon: <CheckCircle className="h-6 w-6 text-white" />,
    color: "bg-blue-700",
  },
  {
    title: "Earning & Using Donation Rewards",
    description:
      "Find out how to earn donation coins and use them to customize virtual pets, engage in community events, and more!",
    icon: <Trophy className="h-6 w-6 text-white" />,
    color: "bg-blue-600",
  },
];

export default function FeatureCarousel() {
  const [width, setWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const carousel = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const controls = useAnimation();

  useEffect(() => {
    const updateWidth = () => {
      if (carousel.current) {
        setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const handleDragEnd = () => {
    const currentX = x.get();
    if (currentX > 0) {
      controls.start({
        x: 0,
        transition: { type: "spring", stiffness: 300, damping: 30 },
      });
    } else if (currentX < -width) {
      controls.start({
        x: -width,
        transition: { type: "spring", stiffness: 300, damping: 30 },
      });
    }

    // Update active index based on scroll position
    if (carousel.current) {
      const cardWidth = carousel.current.scrollWidth / features.length;
      const newIndex = Math.min(
        features.length - 1,
        Math.max(0, Math.round(Math.abs(currentX) / cardWidth))
      );
      setActiveIndex(newIndex);
    }
  };

  const scrollToIndex = (index: number) => {
    if (carousel.current) {
      const cardWidth = carousel.current.scrollWidth / features.length;
      const newX = -index * cardWidth;
      controls.start({
        x: newX,
        transition: { type: "spring", stiffness: 300, damping: 30 },
      });
      setActiveIndex(index);
    }
  };

  const nextSlide = () => {
    const newIndex = Math.min(features.length - 1, activeIndex + 1);
    scrollToIndex(newIndex);
  };

  const prevSlide = () => {
    const newIndex = Math.max(0, activeIndex - 1);
    scrollToIndex(newIndex);
  };

  return (
    <div className="py-20 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <motion.div
            className="mb-6 md:mb-0"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-block mb-2 px-4 py-1 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full text-white text-sm font-medium"
            >
              Learn & Grow
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900">
              Useful Guides
            </h2>
          </motion.div>

          <motion.div
            className="flex space-x-2"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              disabled={activeIndex === 0}
              className="rounded-full border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-50"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Previous slide</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              disabled={activeIndex === features.length - 1}
              className="rounded-full border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-50"
            >
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">Next slide</span>
            </Button>
          </motion.div>
        </div>

        <motion.div
          ref={carousel}
          className="overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.div
            drag="x"
            dragConstraints={{ right: 0, left: -width }}
            whileTap={{ cursor: "grabbing" }}
            animate={controls}
            style={{ x }}
            onDragEnd={handleDragEnd}
            className="flex gap-6 cursor-grab"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="min-w-[300px] md:min-w-[350px] bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-blue-100 group"
                whileHover={{ y: -5 }}
              >
                <div className={`h-2 ${feature.color}`} />
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div
                      className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mr-4`}
                    >
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-blue-900">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-6">{feature.description}</p>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-500">
                      Guide {index + 1}/{features.length}
                    </span>
                    <Link
                      href="/"
                      className="text-blue-600 hover:text-blue-800 font-medium flex items-center group-hover:underline"
                    >
                      Learn more
                      <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Pagination dots */}
        <div className="flex justify-center mt-8 space-x-2">
          {features.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                activeIndex === i
                  ? "bg-blue-600 w-6"
                  : "bg-blue-200 hover:bg-blue-300"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
