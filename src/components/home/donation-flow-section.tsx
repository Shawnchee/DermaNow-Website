"use client";

import type React from "react";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  Users,
  User,
  type LucideIcon,
  FilePlus2,
  Code,
  Zap,
  Banknote,
  DollarSign,
  HeartHandshake,
  Send,
  Network,
  ChevronRight,
} from "lucide-react";

// Define interfaces
interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  icon: React.ReactNode;
}

interface FlowStepProps {
  icon: LucideIcon;
  text: string;
  delay?: number;
  stepNumber: number;
}

interface FlowItem {
  id: number;
  icon: LucideIcon;
  text: string;
}

// Tab button with enhanced interactivity
const TabButton: React.FC<TabButtonProps> = ({
  active,
  onClick,
  children,
  icon,
}) => (
  <motion.button
    onClick={onClick}
    whileTap={{ scale: 0.95 }}
    className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-300 text-sm md:text-base ${
      active
        ? "bg-blue-600 text-white shadow-md font-medium"
        : "bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 border border-gray-200"
    }`}
  >
    <span className={`${active ? "text-white" : "text-blue-600"}`}>{icon}</span>
    {children}
  </motion.button>
);

// Flow step card
const FlowStep: React.FC<FlowStepProps> = ({
  icon: Icon,
  text,
  delay = 0,
  stepNumber,
}) => (
  <motion.div
    className="relative"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
  >
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-blue-100 p-6 h-full">
      <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
        {stepNumber}
      </div>
      <div className="flex flex-col items-center text-center gap-4 pt-4">
        <div className="bg-blue-100 p-4 rounded-full">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
        <p className="text-gray-700">{text}</p>
      </div>
    </div>
  </motion.div>
);

export default function DonationFlowSection() {
  const [activeTab, setActiveTab] = useState<"individuals" | "ngos">(
    "individuals"
  );

  const flowData: Record<"individuals" | "ngos", FlowItem[]> = {
    individuals: [
      {
        id: 1,
        icon: DollarSign,
        text: "The donor converts fiat currency into ETH.",
      },
      {
        id: 2,
        icon: Wallet,
        text: "ETH is deposited into the donor's smart wallet.",
      },
      {
        id: 3,
        icon: HeartHandshake,
        text: "The donor selects a donation project to support.",
      },
      {
        id: 4,
        icon: Send,
        text: "The donor initiates the donation by sending ETH to the project's smart contract.",
      },
      {
        id: 5,
        icon: Network,
        text: "The smart contract automatically distributes funds to the wallet addresses of verified executing organizations.",
      },
    ],
    ngos: [
      {
        id: 1,
        icon: FilePlus2,
        text: "NGOs set up a donation project by defining the goal, timeline, and structure.",
      },
      {
        id: 2,
        icon: Users,
        text: "Specify milestone proportions and assign wallet addresses to responsible organizations.",
      },
      {
        id: 3,
        icon: Code,
        text: "The smart contract is deployed with all conditions encoded, including fund distribution rules.",
      },
      {
        id: 4,
        icon: Zap,
        text: "Once milestones are achieved or the project reaches maturity, the contract is triggered.",
      },
      {
        id: 5,
        icon: Banknote,
        text: "Funds are automatically distributed to each party based on the agreed proportions including their share of marketing funds",
      },
    ],
  };

  return (
    <section className="w-full py-20 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-block mb-4 px-4 py-1 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full text-white text-sm font-medium"
          >
            How It Works
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
            Donation Flow
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our blockchain-powered platform ensures transparent and efficient
            donation processes for both individuals and organizations.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <motion.div
            className="flex gap-4 p-1.5 bg-gray-100 rounded-full"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <TabButton
              active={activeTab === "individuals"}
              onClick={() => setActiveTab("individuals")}
              icon={<User className="w-5 h-5" />}
            >
              For Individuals
            </TabButton>
            <TabButton
              active={activeTab === "ngos"}
              onClick={() => setActiveTab("ngos")}
              icon={<Users className="w-5 h-5" />}
            >
              For NGOs
            </TabButton>
          </motion.div>
        </div>

        {/* Flow diagram */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            {/* Flow path */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-blue-200 -translate-y-1/2 hidden md:block" />

            {/* Steps */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-6 relative z-10">
              {flowData[activeTab].map((item, index) => (
                <FlowStep
                  key={item.id}
                  icon={item.icon}
                  text={item.text}
                  delay={0.1 * (index + 1)}
                  stepNumber={index + 1}
                />
              ))}
            </div>

            {/* Arrows between steps (visible on mobile only) */}
            <div className="grid grid-cols-1 gap-2 mt-4 md:hidden">
              {[...Array(flowData[activeTab].length - 1)].map((_, index) => (
                <div key={index} className="flex justify-center">
                  <ChevronRight className="w-6 h-6 text-blue-400 animate-pulse" />
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Additional info */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <p className="text-blue-700 font-medium">
            Our smart contracts are audited and secured to ensure your donations
            reach their intended recipients.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
