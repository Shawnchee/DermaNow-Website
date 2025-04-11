"use client";

import Image from "next/image";
import { useState } from "react";
import {
  ArrowRight,
  Wallet,
  CreditCard,
  BarChart3,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

export default function DonorTutorialSection() {
  const [activeTab, setActiveTab] = useState("metamask");

  const tutorials = {
    metamask: {
      title: "Setting Up MetaMask",
      steps: [
        {
          title: "Install MetaMask Extension",
          description:
            "Visit metamask.io and add the extension to your browser (Chrome, Firefox, Brave, or Edge).",
          image: "/images/metamask-download.png",
        },
        {
          title: "Create a Wallet",
          description:
            "Click 'Create a Wallet', set a strong password, and securely store your recovery phrase.",
          image: "/images/metamask-create-wallet.png",
        },
        {
          title: "Connect to Ethereum Network",
          description:
            "MetaMask connects to Ethereum Mainnet by default. You're now ready to make donations!",
          image: "/images/metamask-connect.png",
        },
      ],
    },
    donate: {
      title: "Making a Donation",
      steps: [
        {
          title: "Choose a Project",
          description:
            "Browse our verified charity projects and select one that aligns with your values.",
          image: "/placeholder.svg?height=250&width=400&text=Choose+Project",
        },
        {
          title: "Connect Your Wallet",
          description:
            "Click 'Connect Wallet' on the project page and select MetaMask from the options.",
          image: "/placeholder.svg?height=250&width=400&text=Connect+Wallet",
        },
        {
          title: "Confirm Transaction",
          description:
            "Enter your donation amount, review the details, and confirm the transaction in MetaMask.",
          image:
            "/placeholder.svg?height=250&width=400&text=Confirm+Transaction",
        },
        {
          title: "Track Your Impact",
          description:
            "After donating, you'll receive a confirmation and can track how your funds are being used.",
          image: "/placeholder.svg?height=250&width=400&text=Track+Impact",
        },
      ],
    },
    features: {
      title: "Platform Features",
      steps: [
        {
          title: "Donation Dashboard",
          description:
            "View all your donations, impact metrics, and tax receipts in one convenient dashboard.",
          image:
            "/placeholder.svg?height=250&width=400&text=Donation+Dashboard",
        },
        {
          title: "Project Updates",
          description:
            "Receive real-time updates from projects you've supported with photos and progress reports.",
          image: "/placeholder.svg?height=250&width=400&text=Project+Updates",
        },
        {
          title: "Recurring Donations",
          description:
            "Set up automatic monthly donations to consistently support your favorite causes.",
          image:
            "/placeholder.svg?height=250&width=400&text=Recurring+Donations",
        },
        {
          title: "Impact Certificates",
          description:
            "Download blockchain-verified certificates showing your contribution to global causes.",
          image:
            "/placeholder.svg?height=250&width=400&text=Impact+Certificates",
        },
      ],
    },
  };

  return (
    <section
      id="donor-tutorial"
      className="bg-gradient-to-b from-white to-blue-50 py-20"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-block mb-4 px-4 py-1 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full text-white text-sm font-medium"
          >
            Donor Guide
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-blue-900 mb-4"
          >
            How to Donate with Crypto
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Follow our step-by-step guide to set up your crypto wallet, make
            secure donations, and track your impact on the blockchain.
          </motion.p>
        </div>

        <Tabs
          defaultValue="metamask"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger
                value="metamask"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <Wallet className="h-4 w-4 mr-2" />
                MetaMask Setup
              </TabsTrigger>
              <TabsTrigger
                value="donate"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                How to Donate
              </TabsTrigger>
              <TabsTrigger
                value="features"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Features
              </TabsTrigger>
            </TabsList>
          </div>

          {Object.entries(tutorials).map(([key, tutorial]) => (
            <TabsContent key={key} value={key} className="mt-0">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-blue-800 text-center mb-2">
                  {tutorial.title}
                </h3>
                <p className="text-center text-gray-600 mb-8">
                  {key === "metamask" &&
                    "Follow these steps to install and set up your MetaMask wallet."}
                  {key === "donate" &&
                    "Learn how to make secure, transparent donations using cryptocurrency."}
                  {key === "features" &&
                    "Discover all the features available to donors on our platform."}
                </p>
              </div>

              <div className="space-y-16">
                {tutorial.steps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`flex flex-col ${
                      index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                    } gap-8 items-center`}
                  >
                    <div className="lg:w-1/2">
                      <div className="relative">
                        <div
                          className={`absolute -z-10 rounded-full w-16 h-16 bg-blue-100 opacity-70 ${
                            index % 2 === 0
                              ? "-top-4 -left-4"
                              : "-top-4 -right-4"
                          }`}
                        />
                        <div
                          className={`absolute -z-10 rounded-full w-24 h-24 bg-blue-100 opacity-50 ${
                            index % 2 === 0
                              ? "-bottom-4 -right-4"
                              : "-bottom-4 -left-4"
                          }`}
                        />
                        <div className="relative rounded-xl overflow-hidden border-4 border-white shadow-lg">
                          <Image
                            src={step.image || "/placeholder.svg"}
                            alt={step.title}
                            width={1200}
                            height={750}
                            className="w-full object-cover"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="lg:w-1/2">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-bold">
                            {index + 1}
                          </span>
                        </div>
                        <h4 className="text-xl font-bold text-blue-800">
                          {step.title}
                        </h4>
                      </div>
                      <p className="text-gray-600 mb-4">{step.description}</p>

                      {key === "metamask" && index === 0 && (
                        <a
                          href="https://metamask.io/download/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Download MetaMask{" "}
                          <ExternalLink className="ml-1 h-4 w-4" />
                        </a>
                      )}

                      {key === "donate" && index === 0 && (
                        <Button
                          variant="outline"
                          className="mt-2 border-blue-200 text-blue-600 hover:bg-blue-50"
                          onClick={() =>
                            (window.location.href = "/charity/browse-projects")
                          }
                        >
                          Browse Projects{" "}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      )}

                      {key === "features" && index === 0 && (
                        <Button
                          variant="outline"
                          className="mt-2 border-blue-200 text-blue-600 hover:bg-blue-50"
                          onClick={() => (window.location.href = "/dashboard")}
                        >
                          View Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-12 text-center">
                {key !== "features" ? (
                  <Button
                    onClick={() =>
                      setActiveTab(key === "metamask" ? "donate" : "features")
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-lg text-lg h-auto group transition-all duration-300 hover:shadow-lg hover:shadow-blue-200"
                  >
                    <span className="flex items-center gap-2">
                      {key === "metamask"
                        ? "Next: How to Donate"
                        : "Next: Platform Features"}
                      <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </Button>
                ) : (
                  <Button
                    onClick={() => (window.location.href = "/browse-projects")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-lg text-lg h-auto group transition-all duration-300 hover:shadow-lg hover:shadow-blue-200"
                  >
                    <span className="flex items-center gap-2">
                      Start Donating Now
                      <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </Button>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-16 bg-white p-6 rounded-xl shadow-md border border-blue-100">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <HelpCircle className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-blue-800 mb-1">
                Need Help?
              </h3>
              <p className="text-gray-600 mb-4">
                If you're having trouble setting up MetaMask or making a
                donation, our support team is here to help.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" className="border-blue-200">
                  View FAQ
                </Button>
                <Button variant="outline" className="border-blue-200">
                  Contact Support
                </Button>
                <a
                  href="https://metamask.zendesk.com/hc/en-us"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  MetaMask Support <ExternalLink className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
