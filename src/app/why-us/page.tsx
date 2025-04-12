"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";
import { ArrowRight, Shield, Heart, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

import "swiper/css";
import "swiper/css/pagination";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

interface AnimatedCounterProps {
  target: number;
  label: string;
  suffix?: string;
  icon: React.ReactNode;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  target,
  label,
  suffix = "",
  icon,
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const duration = 2000;

    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));

      if (progress < 1) {
        window.requestAnimationFrame(animateCount);
      }
    };

    window.requestAnimationFrame(animateCount);
  }, [target]);

  return (
    <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-md p-6 relative overflow-hidden">
      <div className="absolute -right-6 -top-6 w-16 h-16 bg-blue-100 rounded-full opacity-50" />
      <div className="absolute -left-6 -bottom-6 w-12 h-12 bg-blue-100 rounded-full opacity-50" />

      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-3 text-blue-600">{icon}</div>
        <div className="text-3xl font-bold text-gray-800 mb-1">
          {count.toLocaleString()}
          {suffix}
        </div>
        <div className="text-gray-500 text-sm">{label}</div>
      </div>
    </div>
  );
};

interface FeatureCardProps {
  title: string;
  children: React.ReactNode;
  index: number;
  icon: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  children,
  index,
  icon,
}) => (
  <motion.div
    variants={fadeIn}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.3 }}
    custom={index}
    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
  >
    <div className="p-6">
      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-blue-800">{title}</h3>
      <div className="text-gray-600">{children}</div>
    </div>
  </motion.div>
);

const testimonials = [
  {
    quote:
      "Students completing the course will learn about the key disruptive technologies powering Web3, how to apply the innovation in business and what implication the technologies will have on work, economy and society.",
    author:
      "Shawn Chee Bye, Professor of University of Western Australia Business School's Blockchain Program",
    image:
      "https://images.pexels.com/photos/12064/pexels-photo-12064.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    quote:
      "This platform has allowed us to reach donors globally with full transparency. The blockchain impact reporting is game-changing.",
    author: "Papa John, Founder of PapaJohn",
    image:
      "https://images.pexels.com/photos/17323801/pexels-photo-17323801/free-photo-of-network-rack.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    quote: "I Just love keyboards",
    author: "Yuan Zhen, Tech for Good Initiative",
    image:
      "https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=800&h=750&dpr=2",
  },
];

export default function WhyUsPage() {
  const metrics = [
    {
      value: 2085823,
      label: "Total Beneficiaries",
      suffix: "",
      icon: <Users className="h-6 w-6" />,
    },
    {
      value: 9815,
      label: "Amount Donations",
      suffix: "",
      icon: <Heart className="h-6 w-6" />,
    },
    {
      value: 100,
      label: "Ethereum Donations Raised",
      suffix: " ETH",
      icon: <TrendingUp className="h-6 w-6" />,
    },
  ];

  const features = [
    {
      title: "Connecting Hearts & Resources",
      content:
        "DermaNow bridges the gap between donors and charities through blockchain technology. We enable direct, transparent funding that eliminates middlemen and ensures 100% of your donation reaches those in need.",
      icon: <Heart className="h-6 w-6 text-blue-600" />,
    },
    {
      title: "Our Mission",
      content:
        "DermaNow was founded with a simple mission: to create a transparent, efficient, and impactful way for donors to connect with causes they care about. By leveraging blockchain technology, we've built a platform that ensures every donation makes the maximum impact.",
      icon: <Shield className="h-6 w-6 text-blue-600" />,
    },
    {
      title: "Building Community",
      content:
        "We're more than a donation platform—we're cultivating an ecosystem of change-makers. DermaNow connects like-minded donors with causes they're passionate about while enabling charities to share their stories authentically.",
      icon: <Users className="h-6 w-6 text-blue-600" />,
    },
    {
      title: "Success Stories",
      content:
        "Since our launch, we've facilitated over 9,800 donations that have directly impacted more than 2 million beneficiaries worldwide. From funding clean water projects in rural communities to supporting education initiatives in underserved areas, our platform has enabled meaningful change.",
      icon: <TrendingUp className="h-6 w-6 text-blue-600" />,
    },
    {
      title: "Transparency Report",
      content:
        "Our commitment to transparency extends to our own operations. Each quarter, we publish a comprehensive report detailing platform performance, donation flows, and impact metrics.",
      icon: <Shield className="h-6 w-6 text-blue-600" />,
    },
  ];

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto py-16 px-4"
      >
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-block mb-4 px-4 py-1 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full text-white text-sm font-medium"
          >
            Why Choose DermaNow
          </motion.div>
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-6 text-blue-900"
          >
            Transparent Giving for a Better World
          </motion.h1>
          <motion.p
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-600 max-w-3xl mx-auto mb-8"
          >
            DermaNow leverages blockchain technology to create a transparent,
            efficient, and impactful donation experience. Every transaction is
            verified and traceable, ensuring your generosity reaches those who
            need it most.
          </motion.p>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {metrics.map((metric, index) => (
              <AnimatedCounter
                key={index}
                target={metric.value}
                label={metric.label}
                suffix={metric.suffix}
                icon={metric.icon}
              />
            ))}
          </div>
        </motion.div>

        {/* Features Section */}
        <div className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-blue-900 mb-4">
              Our Approach
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We've built DermaNow on principles of transparency, efficiency,
              and community impact. Here's how we're different:
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <FeatureCard
                key={idx}
                title={feature.title}
                index={idx}
                icon={feature.icon}
              >
                <p>{feature.content}</p>
              </FeatureCard>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 md:p-12 text-center text-white mb-24"
        >
          <h2 className="text-3xl font-bold mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of donors who are creating real impact through
            transparent giving. Every donation is tracked, verified, and makes a
            difference.
          </p>
          <Button
            size="lg"
            className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-6 rounded-lg text-lg h-auto group transition-all duration-300 hover:shadow-lg"
          >
            <span className="flex items-center gap-2">
              Join Our Movement
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Button>
        </motion.div>

        {/* Testimonials Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">
              What People Say
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear from our community of donors, beneficiaries, and partners
              about their experience with DermaNow.
            </p>
          </div>

          <Card className="shadow-xl border-0 overflow-hidden">
            <CardContent className="p-0">
              <Swiper
                modules={[Pagination, Autoplay]}
                slidesPerView={1}
                pagination={{ clickable: true }}
                autoplay={{ delay: 6000 }}
                loop
                className="rounded-xl overflow-hidden"
              >
                {testimonials.map((testimonial, idx) => (
                  <SwiperSlide key={idx}>
                    <div className="flex flex-col lg:flex-row">
                      <div className="lg:w-1/2 relative min-h-[300px] lg:min-h-[400px]">
                        <Image
                          src={testimonial.image || "/placeholder.svg"}
                          alt={testimonial.author}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 to-transparent lg:bg-gradient-to-t" />
                      </div>
                      <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center bg-white">
                        <div className="text-blue-500 text-4xl mb-6">❝</div>
                        <p className="text-xl font-medium text-gray-800 mb-6 leading-relaxed">
                          {testimonial.quote}
                        </p>
                        <p className="text-sm text-blue-700 font-semibold">
                          – {testimonial.author}
                        </p>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
