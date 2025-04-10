"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Heart, Shield, Lightbulb, BarChart3 } from "lucide-react"

export default function OurApproachSection() {
  const approaches = [
    {
      title: "Direct Giving",
      content: (
        <>
          We transfer your donation directly to the end beneficiary — meaning{" "}
          <span className="text-blue-600 font-medium">99%</span> of your money goes to those who need it most.
        </>
      ),
      icon: <Heart className="h-6 w-6 text-blue-600" />,
      delay: 0,
    },
    {
      title: "Transparency",
      content:
        "We revolutionize global giving by making it more transparent to address challenges facing the social sector such as corruption, lack of trust in nonprofits, high global transfer fees, inefficient processes and lack of accountability in donor spending.",
      icon: <Shield className="h-6 w-6 text-blue-600" />,
      delay: 0.1,
    },
    {
      title: "Transformative Tech",
      content: "We believe tech should serve people so we repurpose emerging tech as tools for social change.",
      icon: <Lightbulb className="h-6 w-6 text-blue-600" />,
      delay: 0.2,
    },
    {
      title: "Research",
      content:
        "To better understand and support Web 3 solutions, we invest in the innovation, research and development of it.",
      icon: <BarChart3 className="h-6 w-6 text-blue-600" />,
      delay: 0.3,
    },
  ]

  return (
    <section className="w-full py-20 bg-gradient-to-b from-blue-50 to-white">
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
            Our Methodology
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Our Approach to Transparent Giving</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We've built a platform that ensures your donations create maximum impact through blockchain technology and
            direct giving.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {approaches.map((approach, i) => (
            <motion.div
              key={i}
              className="relative overflow-hidden group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: approach.delay }}
            >
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-blue-100 p-8 h-full">
                <div className="absolute top-0 left-0 w-2 h-full bg-blue-600 transform -skew-x-12" />
                <div className="absolute -right-20 -bottom-20 w-40 h-40 bg-blue-50 rounded-full opacity-30" />

                <div className="flex items-start gap-5 relative z-10">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    {approach.icon}
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-blue-800">{approach.title}</h3>
                    <p className="text-gray-600">{approach.content}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link href="/charity/browse-projects" passHref>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-lg text-lg h-auto group transition-all duration-300 hover:shadow-lg hover:shadow-blue-200">
              <span className="flex items-center gap-2">
                Explore Our Projects
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
