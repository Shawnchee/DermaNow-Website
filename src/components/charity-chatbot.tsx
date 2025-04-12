"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  MessageCircle,
  Send,
  X,
  Heart,
  DollarSign,
  School,
  Home,
  Utensils,
  CheckCircle,
  ChevronRight,
  ArrowLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Types for our chat messages
type MessageType = "text" | "donation-options" | "donation-confirmation" | "donation-success"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  type: MessageType
  timestamp: Date
  donationOptions?: DonationOption[]
  selectedDonation?: DonationOption
}

interface DonationOption {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  minAmount: number
}

// Hardcoded donation options
const DONATION_OPTIONS: DonationOption[] = [
  {
    id: "kids-education",
    name: "Children's Education Fund",
    description: "Provide educational resources for underprivileged children",
    icon: <School className="h-5 w-5" />,
    minAmount: 10,
  },
  {
    id: "kids-shelter",
    name: "Safe Haven for Children",
    description: "Support housing and shelter for homeless children",
    icon: <Home className="h-5 w-5" />,
    minAmount: 15,
  },
  {
    id: "kids-meals",
    name: "Nutritious Meals Program",
    description: "Ensure children receive healthy, balanced meals",
    icon: <Utensils className="h-5 w-5" />,
    minAmount: 5,
  },
]

// Hardcoded responses based on user input
const HARDCODED_RESPONSES: Record<string, Partial<Message>> = {
  hello: {
    content: "Hello! How can I assist you today with your charitable giving?",
    type: "text",
  },
  hi: {
    content:
      "Hi there! I'm here to help you make a difference. What would you like to know about our charity programs?",
    type: "text",
  },
  help: {
    content:
      "I can help you donate to various causes, learn about our projects, or answer questions about how your donations are used. What would you like to do?",
    type: "text",
  },
  "i want to donate": {
    content:
      "That's wonderful! We have several causes you can support. What type of cause are you interested in? (e.g., education, healthcare, environment)",
    type: "text",
  },
  "i want to donate to a charity to help kids": {
    content: "Thank you for wanting to help children in need! Here are some children's charities you can donate to:",
    type: "donation-options",
    donationOptions: DONATION_OPTIONS,
  },
  "how do donations work": {
    content:
      "Your donations go directly to our verified charity partners. We use blockchain technology to ensure transparency, and you can track exactly how your funds are used through our milestone system.",
    type: "text",
  },
}

//input.includes("Donate") -? push modal

export function CharityChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Welcome to Charity Milestone DAO! How can I help you today?",
      sender: "bot",
      type: "text",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [donationAmount, setDonationAmount] = useState<number>(0)
  const [donationStep, setDonationStep] = useState<"select" | "amount" | "confirm" | "success">("select")
  const [selectedDonation, setSelectedDonation] = useState<DonationOption | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Handle sending a message
  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      type: "text",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    // Process response
    setTimeout(() => {
      const lowerCaseInput = inputValue.toLowerCase()

      // Check for exact matches first
      let response = HARDCODED_RESPONSES[lowerCaseInput]

      // If no exact match, check for partial matches
      if (!response) {
        for (const [key, value] of Object.entries(HARDCODED_RESPONSES)) {
          if (lowerCaseInput.includes(key)) {
            response = value
            break
          }
        }
      }

      // Default response if no match found
      if (!response) {
        response = {
          content:
            "I'm not sure I understand. Could you try rephrasing that? If you'd like to donate, you can say 'I want to donate'.",
          type: "text",
        }
      }

      const botMessage: Message = {
        id: Date.now().toString(),
        content: response.content || "",
        sender: "bot",
        type: (response.type as MessageType) || "text",
        timestamp: new Date(),
        donationOptions: response.donationOptions,
      }

      setMessages((prev) => [...prev, botMessage])

      // Reset donation flow if starting a new donation
      if (response.type === "donation-options") {
        setDonationStep("select")
        setSelectedDonation(null)
        setDonationAmount(0)
      }
    }, 500)

    setInputValue("")
  }

  // Handle selecting a donation option
  const handleSelectDonation = (option: DonationOption) => {
    setSelectedDonation(option)
    setDonationAmount(option.minAmount)
    setDonationStep("amount")

    // Add a message showing the selected option
    const selectionMessage: Message = {
      id: Date.now().toString(),
      content: `I'd like to donate to ${option.name}`,
      sender: "user",
      type: "text",
      timestamp: new Date(),
    }

    const responseMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: `Great choice! How much would you like to donate to ${option.name}? (Minimum: $${option.minAmount})`,
      sender: "bot",
      type: "donation-confirmation",
      timestamp: new Date(),
      selectedDonation: option,
    }

    setMessages((prev) => [...prev, selectionMessage, responseMessage])
  }

  // Handle confirming a donation
  const handleConfirmDonation = () => {
    if (!selectedDonation) return

    setDonationStep("success")

    // Add confirmation messages
    const confirmMessage: Message = {
      id: Date.now().toString(),
      content: `I confirm my donation of $${donationAmount} to ${selectedDonation.name}`,
      sender: "user",
      type: "text",
      timestamp: new Date(),
    }

    const thankYouMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: `Thank you for your generous donation of $${donationAmount} to ${selectedDonation.name}! Your contribution will make a real difference in children's lives.`,
      sender: "bot",
      type: "donation-success",
      timestamp: new Date(),
      selectedDonation: selectedDonation,
    }

    setMessages((prev) => [...prev, confirmMessage, thankYouMessage])

    // Reset donation flow after success
    setTimeout(() => {
      setDonationStep("select")
      setSelectedDonation(null)
      setDonationAmount(0)
    }, 1000)
  }

  // Handle back button in donation flow
  const handleDonationBack = () => {
    if (donationStep === "amount") {
      setDonationStep("select")
      setSelectedDonation(null)
    } else if (donationStep === "confirm") {
      setDonationStep("amount")
    }
  }

  // Handle key press (Enter to send)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Chat toggle button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "h-14 w-14 rounded-full shadow-lg",
            isOpen ? "bg-red-500 hover:bg-red-600" : "bg-blue-600 hover:bg-blue-700",
          )}
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </Button>
      </motion.div>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 w-[350px] md:w-[400px]"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="shadow-xl border-blue-100">
              <CardHeader className="bg-blue-600 text-white rounded-t-lg pb-3">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2 bg-white">
                    <Heart className="h-4 w-4 text-blue-600" />
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">Charity Assistant</CardTitle>
                    <CardDescription className="text-blue-100 text-xs">
                      Online | Typically replies instantly
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <div className="h-[350px] overflow-y-auto p-4 bg-gray-50">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn("mb-4 max-w-[80%]", message.sender === "user" ? "ml-auto" : "mr-auto")}
                    >
                      {/* Regular text message */}
                      <div
                        className={cn(
                          "rounded-lg p-3",
                          message.sender === "user" ? "bg-blue-600 text-white" : "bg-white border border-gray-200",
                        )}
                      >
                        <p className="text-sm">{message.content}</p>

                        {/* Donation options */}
                        {message.type === "donation-options" && message.donationOptions && (
                          <div className="mt-3 space-y-2">
                            {message.donationOptions.map((option) => (
                              <Button
                                key={option.id}
                                variant="outline"
                                className="w-full justify-start bg-white hover:bg-blue-50 border-blue-200"
                                onClick={() => handleSelectDonation(option)}
                              >
                                <div className="flex items-center">
                                  <div className="bg-blue-100 p-2 rounded-full mr-2">{option.icon}</div>
                                  <div className="text-left">
                                    <p className="font-medium text-gray-900">{option.name}</p>
                                    <p className="text-xs text-gray-500">{option.description}</p>
                                  </div>
                                  <ChevronRight className="h-4 w-4 ml-auto text-gray-400" />
                                </div>
                              </Button>
                            ))}
                          </div>
                        )}

                        {/* Donation confirmation */}
                        {message.type === "donation-confirmation" && message.selectedDonation && (
                          <div className="mt-3 space-y-3">
                            <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                              <div className="flex items-center mb-2">
                                <div className="bg-blue-100 p-2 rounded-full mr-2">{message.selectedDonation.icon}</div>
                                <div>
                                  <p className="font-medium text-gray-900">{message.selectedDonation.name}</p>
                                  <p className="text-xs text-gray-500">{message.selectedDonation.description}</p>
                                </div>
                              </div>

                              <div className="space-y-3">
                                <div>
                                  <label className="text-xs font-medium text-gray-700 block mb-1">
                                    Donation Amount (USD)
                                  </label>
                                  <div className="flex items-center">
                                    <DollarSign className="h-4 w-4 text-gray-500 mr-1" />
                                    <Input
                                      type="number"
                                      value={donationAmount}
                                      onChange={(e) => setDonationAmount(Number(e.target.value))}
                                      min={message.selectedDonation.minAmount}
                                      className="bg-white"
                                    />
                                  </div>
                                </div>

                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm" className="text-xs" onClick={handleDonationBack}>
                                    <ArrowLeft className="h-3 w-3 mr-1" />
                                    Back
                                  </Button>
                                  <Button
                                    size="sm"
                                    className="text-xs flex-1"
                                    onClick={handleConfirmDonation}
                                    disabled={donationAmount < message.selectedDonation.minAmount}
                                  >
                                    Confirm Donation
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Donation success */}
                        {message.type === "donation-success" && (
                          <div className="mt-3 bg-green-50 p-3 rounded-md border border-green-100">
                            <div className="flex items-center text-green-800">
                              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                              <p className="text-sm font-medium">Donation Successful!</p>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">
                              Transaction ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}
                            </p>
                            <div className="mt-2">
                              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                                Tax Deductible
                              </Badge>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Message timestamp */}
                      <div
                        className={cn(
                          "text-xs text-gray-500 mt-1",
                          message.sender === "user" ? "text-right" : "text-left",
                        )}
                      >
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>

              <CardFooter className="p-3 border-t">
                <div className="flex w-full items-center space-x-2">
                  <Input
                    placeholder="Type your message..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" onClick={handleSendMessage} disabled={!inputValue.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
