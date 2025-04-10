"use client";

import Image from "next/image";
import { ArrowRight, Clock, CheckCircle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import FeatureCarousel from "../features-carousel";

export default function GettingStartedSection() {
  const router = useRouter();

  const steps = [
    {
      icon: <Clock className="h-5 w-5 text-blue-600" />,
      title: "Quick Setup",
      description:
        "Create an account in less than 2 minutes with just your email",
    },
    {
      icon: <CheckCircle className="h-5 w-5 text-blue-600" />,
      title: "Choose a Cause",
      description:
        "Browse verified projects and select causes that matter to you",
    },
    {
      icon: <Shield className="h-5 w-5 text-blue-600" />,
      title: "Secure Donation",
      description: "Make a transparent, blockchain-verified contribution",
    },
  ];

  return (
    <>
      <section
        id="getting-started"
        className="bg-gradient-to-b from-white to-blue-50 py-20"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-block mb-4 px-4 py-1 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full text-white text-sm font-medium"
            >
              Simple & Secure
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold text-blue-900 mb-4"
            >
              Get started in minutes
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Create a culture of giving, enabling individuals and organizations
              to support causes that align with their values and make a positive
              impact on the world.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Steps */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start gap-4 bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-blue-100"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-blue-800 mb-1">
                      {step.title}
                    </h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-8"
              >
                <Button
                  onClick={() => router.push("/charity/browse-projects")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-lg text-lg h-auto group transition-all duration-300 hover:shadow-lg hover:shadow-blue-200"
                >
                  <span className="flex items-center gap-2">
                    Donate Now
                    <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Button>
              </motion.div>
            </motion.div>

            {/* Right side - Image with decorative elements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-100 rounded-full opacity-50" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-100 rounded-full opacity-50" />

              <div className="relative z-10 rounded-xl overflow-hidden shadow-xl border-4 border-white">
                <Image
                  src="https://placehold.co/728x408/png"
                  alt="Get started in minutes"
                  width={728}
                  height={408}
                  className="rounded-lg"
                />
              </div>

              {/* Floating badges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="absolute -bottom-4 -left-4 bg-white px-4 py-2 rounded-lg shadow-lg border border-blue-100 z-20"
              >
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    100% Secure
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="absolute -top-4 -right-4 bg-white px-4 py-2 rounded-lg shadow-lg border border-blue-100 z-20"
              >
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    Under 2 minutes
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <section>
        <FeatureCarousel />
      </section>
    </>
  );
}
