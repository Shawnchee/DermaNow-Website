"use client";

import type React from "react";

import Image from "next/image";
import { useState } from "react";
import {
  ArrowRight,
  Wallet,
  CreditCard,
  BarChart3,
  HelpCircle,
  ExternalLink,
  Building,
  Users,
  FileCheck,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

export default function TutorialSection() {
  const [activeTab, setActiveTab] = useState("metamask");

  const tutorials = {
    metamask: {
      title: "Setting Up MetaMask",
      subtitle: "For Donors",
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
      subtitle: "For Donors",
      steps: [
        {
          title: "Choose a Project",
          description:
            "Browse our verified charity projects and select one that aligns with your values.",
          image: "/images/donate-projects.png",
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
      subtitle: "For Donors",
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
    start_project: {
      title: "Starting a Project",
      subtitle: "For Charities",
      steps: [
        {
          title: "Define Your Project",
          description:
            "Clearly outline your project's goals, target beneficiaries, timeline, and required funding amount.",
          image: "/images/charity-project.png",
        },
        {
          title: "Create a Charity Account",
          description:
            "Register your organization with valid credentials and submit necessary documents for verification.",
          image: "/images/charity-organization.png",
        },
        {
          title: "Set Project Milestones",
          description:
            "Break down your project into measurable milestones to show donors how their funds will be utilized.",
          image: "/images/charity-milestones.png",
        },
        {
          title: "Submit for Verification",
          description:
            "Our team will review your project to ensure it meets our standards before it's listed on the platform.",
          image: "/images/charity-submit.png",
        },
      ],
    },
    service_providers: {
      title: "Choosing Service Providers",
      subtitle: "For Charities",
      steps: [
        {
          title: "Browse Service Providers",
          description:
            "Explore our network of verified service providers categorized by specialty (construction, education, healthcare, etc.).",
          image: "/images/charity-service-providers.png",
        },
        {
          title: "Review Provider Profiles",
          description:
            "Examine provider portfolios, credentials, past projects, and ratings from other charitable organizations.",
          image: "/images/charity-profiles.png",
        },
        {
          title: "Connect and Collaborate",
          description:
            "Reach out to potential providers to discuss your project requirements, timeline, and budget constraints.",
          image: "/images/charity-contact.png",
        },
      ],
    },
  };

  return (
    <section
      id="tutorial-section"
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
            Platform Tutorials
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-blue-900 mb-4"
          >
            How to Use Our Platform
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Comprehensive guides for both donors and charitable organizations on
            how to make the most of our blockchain-powered platform.
          </motion.p>
        </div>

        <div className="mb-8 bg-white p-6 rounded-xl shadow-md border border-blue-100">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 flex justify-center">
              <div className="relative">
                <div className="absolute -z-10 rounded-full w-24 h-24 bg-blue-100 opacity-70 -top-4 -right-4" />
                <div className="bg-blue-50 p-4 rounded-full">
                  <div className="bg-blue-100 p-5 rounded-full">
                    <HelpCircle className="h-10 w-10 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-[2]">
              <h3 className="text-xl font-bold text-blue-800 mb-2">
                Are you a donor or a charity?
              </h3>
              <p className="text-gray-600 mb-4">
                We have different guides depending on how you'll be using our
                platform. Choose the appropriate section below.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  className={`${
                    activeTab === "metamask" ||
                    activeTab === "donate" ||
                    activeTab === "features"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                  }`}
                  onClick={() => setActiveTab("metamask")}
                >
                  <Users className="h-4 w-4 mr-2" /> I'm a Donor
                </Button>
                <Button
                  className={`${
                    activeTab === "start_project" ||
                    activeTab === "service_providers"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                  }`}
                  onClick={() => setActiveTab("start_project")}
                >
                  <Building className="h-4 w-4 mr-2" /> I'm a Charity
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Tabs
          defaultValue="metamask"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="flex justify-center mb-8">
            <TabsList
              className={`grid w-full max-w-3xl ${
                activeTab === "metamask" ||
                activeTab === "donate" ||
                activeTab === "features"
                  ? "grid-cols-3"
                  : "grid-cols-2"
              }`}
            >
              {(activeTab === "metamask" ||
                activeTab === "donate" ||
                activeTab === "features") && (
                <>
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
                </>
              )}

              {(activeTab === "start_project" ||
                activeTab === "service_providers") && (
                <>
                  <TabsTrigger
                    value="start_project"
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    <FileCheck className="h-4 w-4 mr-2" />
                    Start a Project
                  </TabsTrigger>
                  <TabsTrigger
                    value="service_providers"
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    Choose Service Providers
                  </TabsTrigger>
                </>
              )}
            </TabsList>
          </div>

          {Object.entries(tutorials).map(([key, tutorial]) => (
            <TabsContent key={key} value={key} className="mt-0">
              <div className="mb-8">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <h3 className="text-2xl font-bold text-blue-800 text-center">
                    {tutorial.title}
                  </h3>
                  <Badge>{tutorial.subtitle}</Badge>
                </div>
                <p className="text-center text-gray-600 mb-8">
                  {key === "metamask" &&
                    "Follow these steps to install and set up your MetaMask wallet."}
                  {key === "donate" &&
                    "Learn how to make secure, transparent donations using cryptocurrency."}
                  {key === "features" &&
                    "Discover all the features available to donors on our platform."}
                  {key === "start_project" &&
                    "Learn how to create and manage charitable projects on our platform."}
                  {key === "service_providers" &&
                    "Find out how to connect with verified service providers for your charitable projects."}
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
                            (window.location.href = "/browse-projects")
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

                      {key === "start_project" && index === 0 && (
                        <Button
                          variant="outline"
                          className="mt-2 border-blue-200 text-blue-600 hover:bg-blue-50"
                          onClick={() =>
                            (window.location.href = "/charity/start-project")
                          }
                        >
                          Start Project <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      )}

                      {key === "service_providers" && index === 0 && (
                        <Button
                          variant="outline"
                          className="mt-2 border-blue-200 text-blue-600 hover:bg-blue-50"
                          onClick={() =>
                            (window.location.href = "/service-providers")
                          }
                        >
                          View Service Providers{" "}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-12 text-center">
                {key === "metamask" ||
                key === "donate" ||
                key === "start_project" ? (
                  <Button
                    onClick={() =>
                      setActiveTab(
                        key === "metamask"
                          ? "donate"
                          : key === "donate"
                          ? "features"
                          : key === "start_project"
                          ? "service_providers"
                          : "metamask"
                      )
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-lg text-lg h-auto group transition-all duration-300 hover:shadow-lg hover:shadow-blue-200"
                  >
                    <span className="flex items-center gap-2">
                      {key === "metamask"
                        ? "Next: How to Donate"
                        : key === "donate"
                        ? "Next: Platform Features"
                        : "Next: Choose Service Providers"}
                      <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </Button>
                ) : (
                  <Button
                    onClick={() =>
                      (window.location.href =
                        key === "features"
                          ? "/charity/browse-projects"
                          : key === "service_providers"
                          ? "/charity/start-project"
                          : "/")
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-lg text-lg h-auto group transition-all duration-300 hover:shadow-lg hover:shadow-blue-200"
                  >
                    <span className="flex items-center gap-2">
                      {key === "features"
                        ? "Start Donating Now"
                        : key === "service_providers"
                        ? "Create Your Project"
                        : "Get Started"}
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
                If you need additional assistance with any aspect of our
                platform, our support team is here to help.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" className="border-blue-200">
                  View FAQ
                </Button>
                <Button variant="outline" className="border-blue-200">
                  Contact Support
                </Button>
                <Button variant="outline" className="border-blue-200">
                  Schedule Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Custom Badge component
const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-block px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
    {children}
  </span>
);
