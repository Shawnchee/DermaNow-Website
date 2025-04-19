"use client";

import { motion } from "framer-motion";
import { Coins, Church as Mosque, Gift, HeartHandshake, PlayCircle } from "lucide-react";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose,
  } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface FlowStepProps {
  icon: React.ElementType;
  text: string;
  delay?: number;
  stepNumber: number;
}

// Flow step card
const FlowStep: React.FC<FlowStepProps> = ({ icon: Icon, text, delay = 0, stepNumber }) => (
  <motion.div
    className="relative"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
  >
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-blue-100 p-6 h-full ">
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

export default function StakingFlowSection() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const flowData = [
    {
      id: 1,
      icon: Coins,
      text: "Stake your Ethereum in our Shariah-compliant staking pool to earn halal rewards.",
    },
    {
      id: 2,
      icon: Mosque,
      text: "Your Ethereum will be used for halal investments in platforms like Firoza Finance, Luno, Goldensands, and HAQQ.",
    },
    {
      id: 3,
      icon: Gift,
      text: "Accumulate halal rewards over time. You can choose to leave your rewards in the pool or unstake them when needed.",
    },
    {
      id: 4,
      icon: HeartHandshake,
      text: "Once unstaked, rewards can only be used for charitable purposes such as Zakat, Sadaqah, or Waqf pools.",
    },
  ];

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
            Shariah-Compliant Staking
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">How It Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our Shariah-compliant staking platform ensures ethical investments and transparent rewards for all users.
          </p>
        </motion.div>

        {/* Flow diagram */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          {/* Flow path */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-blue-200 -translate-y-1/2 hidden md:block" />

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6 relative z-10">
            {flowData.map((item, index) => (
              <FlowStep
                key={item.id}
                icon={item.icon}
                text={item.text}
                delay={0.1 * (index + 1)}
                stepNumber={index + 1}
              />
            ))}
          </div>
        </motion.div>

        {/* Additional info */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <p className="text-blue-700 font-medium">
            Our staking platform is designed to ensure ethical investments and transparent rewards for all users.
          </p>
        <Button 
            onClick={() => setIsVideoOpen(true)}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-2 flex items-center gap-2 mx-auto cursor-pointer"
          >
            <PlayCircle className="h-5 w-5" />
            View Tutorial
          </Button>
        </motion.div>
      </div>
      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-black">
          <DialogHeader className="p-4 bg-blue-600 text-white">
            <DialogTitle>Staking Tutorial</DialogTitle>
            <DialogDescription className="text-blue-100">
              Watch this video to learn more about our Shariah-compliant staking process
            </DialogDescription>
          </DialogHeader>
          <div className="aspect-video w-full">
            {/* TODO: Replace with tutor video */}
            <iframe
              src="https://www.youtube.com/embed/aTzTacu3_d4?si=DWB9QFbt5hZ1c6NQ" 
              title="Staking Tutorial"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
          <div className="p-4 bg-gray-900 flex justify-end">
            <DialogClose asChild>
              <Button variant="ghost" className="bg-white hover:bg-gray-200 text-gray-900">
                Close Tutorial
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}