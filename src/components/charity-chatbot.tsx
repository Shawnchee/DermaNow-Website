"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
  ArrowLeft,
  Gift,
  Users,
  Calendar,
  Globe,
  Clock,
  ChevronUp,
  ChevronDown,
  ImageIcon,
  Smile,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { marked } from "marked";
import DOMPurify from "dompurify";

// Types for chat messages
type MessageType =
  | "text"
  | "donation-suggestion"
  | "donation-confirmation"
  | "donation-success";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  type: MessageType;
  timestamp: Date;
  donationOption?: DonationOption;
  selectedDonation?: DonationOption;
}

interface DonationOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  minAmount: number;
  image?: string;
  funding_percentage?: number;
  supporters?: number;
  amount?: number;
  categories?: string[];
}

// Map categories to icons
const CATEGORY_TO_ICON: Record<string, React.ReactNode> = {
  Education: <School className="h-5 w-5" />,
  "Food & Nutrition": <Utensils className="h-5 w-5" />,
  "Children & Youth": <Heart className="h-5 w-5" />,
  "Water & Sanitation": <Home className="h-5 w-5" />,
  "Community Development": <Home className="h-5 w-5" />,
  "Disaster Relief": <Heart className="h-5 w-5" />,
};

// Sample donation suggestions for quick access
const QUICK_DONATIONS: DonationOption[] = [
  {
    id: "quick1",
    name: "Education Fund",
    description: "Support education for underprivileged children",
    icon: <School className="h-5 w-5" />,
    minAmount: 10,
    categories: ["Education"],
    funding_percentage: 65,
    supporters: 1243,
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "quick2",
    name: "Food Relief",
    description: "Provide meals to families in need",
    icon: <Utensils className="h-5 w-5" />,
    minAmount: 5,
    categories: ["Food & Nutrition"],
    funding_percentage: 78,
    supporters: 2156,
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "quick3",
    name: "Medical Aid",
    description: "Support healthcare for vulnerable communities",
    icon: <Heart className="h-5 w-5" />,
    minAmount: 15,
    categories: ["Children & Youth"],
    funding_percentage: 42,
    supporters: 876,
    image: "/placeholder.svg?height=200&width=400",
  },
];

// API endpoints
const API_BASE_URL = "http://localhost:8000";
const CHAT_ENDPOINT = `${API_BASE_URL}/chatbot/chat`;

export function CharityChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content:
        "Welcome to DermaNow! How can I help you make a difference today?",
      sender: "bot",
      type: "text",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [donationAmount, setDonationAmount] = useState<number>(0);
  const [donationStep, setDonationStep] = useState<
    "select" | "amount" | "confirm" | "success"
  >("select");
  const [selectedDonation, setSelectedDonation] =
    useState<DonationOption | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickDonations, setShowQuickDonations] = useState(false);
  const [typingEffect, setTypingEffect] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Typing effect
  useEffect(() => {
    if (typingEffect) {
      const timer = setTimeout(() => {
        setTypingEffect(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [typingEffect]);

  // Fetch chat response
  const fetchChatResponse = async (message: string) => {
    try {
      setIsLoading(true);
      setTypingEffect(true);

      // Prepare history: only text messages, exclude welcome and donation flow
      const history = messages
        .filter(
          (msg) =>
            (msg.id !== "welcome" &&
              msg.type === "text" &&
              msg.sender !== "bot") ||
            msg.type === "donation-suggestion"
        )
        .map((msg) => ({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.content,
        }));

      const response = await fetch(CHAT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching chat response:", error);
      return {
        message: "Sorry, something went wrong. Please try again!",
        donation_intent: false,
        charities: null,
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sending message
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      type: "text",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    const response = await fetchChatResponse(inputValue);
    let messageType: MessageType = "text";
    let donationOption: DonationOption | undefined;

    // Check for donation intent
    if (
      response.donation_intent &&
      response.charities &&
      response.charities.length > 0
    ) {
      messageType = "donation-suggestion";
      const topCharity = response.charities[0];
      donationOption = {
        id: topCharity.id.toString(),
        name: topCharity.title,
        description: topCharity.description,
        icon: getIconForCategories(topCharity.category),
        minAmount: 0,
        image: topCharity.image || "/placeholder.svg?height=200&width=400",
        funding_percentage: topCharity.funding_percentage,
        supporters: topCharity.supporters,
        amount: topCharity.amount,
        categories: topCharity.category,
      };
    }

    const botMessage: Message = {
      id: Date.now().toString(),
      content: response.message,
      sender: "bot",
      type: messageType,
      timestamp: new Date(),
      donationOption,
    };

    setMessages((prev) => [...prev, botMessage]);

    if (messageType === "donation-suggestion") {
      setDonationStep("select");
      setSelectedDonation(null);
      setDonationAmount(0);
    }
  };

  // Get icon for categories
  const getIconForCategories = (categories: string[] = []): React.ReactNode => {
    for (const category of categories) {
      if (CATEGORY_TO_ICON[category]) {
        return CATEGORY_TO_ICON[category];
      }
    }
    return <Heart className="h-5 w-5" />;
  };

  // Handle selecting donation
  const handleSelectDonation = (option: DonationOption) => {
    setSelectedDonation(option);
    setDonationAmount(option.minAmount || 10);
    setDonationStep("amount");

    const selectionMessage: Message = {
      id: Date.now().toString(),
      content: `I'd like to donate to ${option.name}`,
      sender: "user",
      type: "text",
      timestamp: new Date(),
    };

    const responseMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: `Great choice! How much would you like to donate to ${option.name}?`,
      sender: "bot",
      type: "donation-confirmation",
      timestamp: new Date(),
      selectedDonation: option,
    };

    setMessages((prev) => [...prev, selectionMessage, responseMessage]);
  };

  // Handle confirming donation
  const handleConfirmDonation = () => {
    if (!selectedDonation) return;

    setDonationStep("success");

    const confirmMessage: Message = {
      id: Date.now().toString(),
      content: `I confirm my donation of ${donationAmount} MYR to ${selectedDonation.name}`,
      sender: "user",
      type: "text",
      timestamp: new Date(),
    };

    const thankYouMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: `Thank you for your generous donation of ${donationAmount} MYR to ${selectedDonation.name}! Your contribution will make a real difference.`,
      sender: "bot",
      type: "donation-success",
      timestamp: new Date(),
      selectedDonation: selectedDonation,
    };

    setMessages((prev) => [...prev, confirmMessage, thankYouMessage]);

    setTimeout(() => {
      setDonationStep("select");
      setSelectedDonation(null);
      setDonationAmount(0);
    }, 10000);
  };

  // Handle back in donation flow
  const handleDonationBack = () => {
    if (donationStep === "amount") {
      setDonationStep("select");
      setSelectedDonation(null);
    } else if (donationStep === "confirm") {
      setDonationStep("amount");
    }
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleSendMessage();
    }
  };

  // Handle quick donation selection
  const handleQuickDonation = (option: DonationOption) => {
    handleSelectDonation(option);
    setShowQuickDonations(false);
  };

  // Toggle expanded view
  const toggleExpandedView = () => {
    setIsExpanded(!isExpanded);
  };

  // Render Markdown content safely
  const renderMessageContent = (content: string) => {
    const markdown = marked(content, {
      breaks: true, // Convert \n to <br>
      gfm: true, // Support GitHub-flavored Markdown
    }) as string;
    const sanitized = DOMPurify.sanitize(markdown);
    return (
      <div
        className="text-sm"
        dangerouslySetInnerHTML={{ __html: sanitized }}
      />
    );
  };

  // Predefined donation amounts
  const predefinedAmounts = [10, 25, 50, 100];

  return (
    <>
      {/* Chat toggle button with pulse effect */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative">
          {!isOpen && (
            <motion.div
              className="absolute inset-0 rounded-full bg-blue-500 opacity-70"
              initial={{ scale: 1 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          )}
          <Button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "h-15 w-15 rounded-full shadow-xl",
              isOpen
                ? "bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-"
            )}
          >
            {isOpen ? (
              <X className="h-8 w-8" />
            ) : (
              <motion.div
                animate={{ rotate: [0, 10, 0, -10, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <MessageCircle className="h-8 w-8" />
              </motion.div>
            )}
          </Button>
        </div>
      </motion.div>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={cn(
              "fixed z-50",
              isExpanded
                ? "top-30 right-6 bottom-24 md:left-auto md:w-125"
                : "bottom-24 right-6 w-100 top-125"
            )}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="shadow-2xl border-blue-100 h-full flex flex-col overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-700 to-blue-600 text-white rounded-t-lg py-4 relative">
                <div className="flex items-center">
                  <div className="relative">
                    <Avatar className="h-14 w-14 mr-6 bg-white justify-center items-center">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{
                          duration: 1.5,
                          repeat: Number.POSITIVE_INFINITY,
                        }}
                      >
                        <Heart className="h-8 w-8 text-purple-600" />
                      </motion.div>
                    </Avatar>
                    <div className="absolute bottom-0 left-10 h-4 w-4 rounded-full bg-green-400 border-2 border-white"></div>
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl font-bold">
                      DermaNow Assistant
                    </CardTitle>
                    <CardDescription className="text-blue-100 text-sm">
                      <span className="text-green-300 font-semibold">
                        Online
                      </span>{" "}
                      | Typically replies instantly
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                    onClick={toggleExpandedView}
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5" />
                    ) : (
                      <ChevronUp className="h-5 w-5" />
                    )}
                  </Button>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full -z-10"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-tr-full -z-10"></div>
              </CardHeader>

              <CardContent className="p-0 flex-1 flex flex-col overflow-hidden">
                {/* Quick donation suggestions */}
                <AnimatePresence>
                  {showQuickDonations && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="bg-gradient-to-r from-blue-50 to-purple-50 overflow-hidden"
                    >
                      <div className="p-3 space-y-2">
                        <div className="flex justify-between items-center">
                          <h3 className="text-sm font-medium text-gray-700">
                            Popular Causes
                          </h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowQuickDonations(false)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          {QUICK_DONATIONS.map((donation) => (
                            <motion.div
                              key={donation.id}
                              whileHover={{ scale: 1.02 }}
                              className="bg-white rounded-lg p-3 shadow-sm border border-blue-100 cursor-pointer"
                              onClick={() => handleQuickDonation(donation)}
                            >
                              <div className="flex items-center mb-2">
                                <div className="bg-blue-100 p-2 rounded-full mr-2">
                                  {donation.icon}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900 text-sm">
                                    {donation.name}
                                  </p>
                                </div>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                                  style={{
                                    width: `${donation.funding_percentage}%`,
                                  }}
                                ></div>
                              </div>
                              <div className="flex justify-between mt-1 text-xs text-gray-500">
                                <span>
                                  {donation.funding_percentage}% funded
                                </span>
                                <span>{donation.supporters} supporters</span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Chat messages */}
                <div
                  ref={chatContainerRef}
                  className="flex-1 overflow-y-auto p-4 bg-white"
                  style={{
                    height: isExpanded ? "calc(100vh - 220px)" : "450px",
                  }}
                >
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={cn(
                        "mb-4",
                        message.sender === "user"
                          ? "ml-auto max-w-[85%]"
                          : "mr-auto max-w-[85%]"
                      )}
                    >
                      <div
                        className={cn(
                          "rounded-2xl p-4 shadow-sm",
                          message.sender === "user"
                            ? "bg-gradient-to-r from-blue-700 to-blue-600 text-white"
                            : "bg-gray-100 border border-gray-200"
                        )}
                      >
                        {message.type === "text" ||
                        message.type === "donation-suggestion"
                          ? renderMessageContent(message.content)
                          : message.type === "donation-confirmation" ||
                            message.type === "donation-success"
                          ? renderMessageContent(message.content)
                          : null}

                        {/* Donation suggestion (single card) */}
                        {message.type === "donation-suggestion" &&
                          message.donationOption && (
                            <motion.div
                              className="mt-4"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3, duration: 0.3 }}
                            >
                              <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-md">
                                {message.donationOption.image && (
                                  <div className="relative rounded-lg overflow-hidden mb-3">
                                    <img
                                      src={
                                        message.donationOption.image ||
                                        "/placeholder.svg"
                                      }
                                      alt={message.donationOption.name}
                                      className="w-full h-48 object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                                      <div className="p-3 text-white">
                                        <Badge className="bg-blue-500 mb-1">
                                          Featured Cause
                                        </Badge>
                                        <h3 className="text-lg font-bold">
                                          {message.donationOption.name}
                                        </h3>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                <div className="flex items-start mb-3">
                                  <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-3 rounded-full mr-3">
                                    {message.donationOption.icon}
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900">
                                      {message.donationOption.name}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                      {message.donationOption.description}
                                    </p>
                                  </div>
                                </div>

                                {message.donationOption.categories && (
                                  <div className="flex flex-wrap gap-1 mb-3">
                                    {message.donationOption.categories.map(
                                      (category, idx) => (
                                        <Badge
                                          key={idx}
                                          variant="outline"
                                          className="bg-blue-50 text-blue-700 border-blue-200"
                                        >
                                          {category}
                                        </Badge>
                                      )
                                    )}
                                  </div>
                                )}

                                {message.donationOption.funding_percentage && (
                                  <div className="mb-3">
                                    <div className="flex justify-between text-sm mb-1">
                                      <span className="font-medium">
                                        Funding Progress
                                      </span>
                                      <span className="text-blue-600 font-bold">
                                        {
                                          message.donationOption
                                            .funding_percentage
                                        }
                                        %
                                      </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                      <div
                                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full"
                                        style={{
                                          width: `${message.donationOption.funding_percentage}%`,
                                        }}
                                      ></div>
                                    </div>
                                    <div className="flex justify-between mt-1 text-xs text-gray-500">
                                      <span className="flex items-center">
                                        <Users className="h-3 w-3 mr-1" />
                                        {message.donationOption.supporters}{" "}
                                        supporters
                                      </span>
                                      <span className="flex items-center">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        Ends in 14 days
                                      </span>
                                    </div>
                                  </div>
                                )}

                                <Button
                                  className="w-full bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 rounded-lg shadow-md transition-all duration-200 transform hover:scale-[1.02]"
                                  onClick={() =>
                                    handleSelectDonation(
                                      message.donationOption!
                                    )
                                  }
                                >
                                  <Gift className="h-5 w-5 mr-2" />
                                  Donate Now
                                </Button>
                              </div>
                            </motion.div>
                          )}

                        {/* Donation confirmation */}
                        {message.type === "donation-confirmation" &&
                          message.selectedDonation && (
                            <motion.div
                              className="mt-4 space-y-4"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3, duration: 0.3 }}
                            >
                              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-200 shadow-md">
                                {message.selectedDonation.image && (
                                  <div className="relative rounded-lg overflow-hidden mb-3">
                                    <img
                                      src={
                                        message.selectedDonation.image ||
                                        "/placeholder.svg"
                                      }
                                      alt={message.selectedDonation.name}
                                      className="w-full h-40 object-cover"
                                    />
                                    <div className="absolute top-2 right-2">
                                      <Badge className="bg-blue-500">
                                        Selected Cause
                                      </Badge>
                                    </div>
                                  </div>
                                )}
                                <div className="flex items-center mb-4">
                                  <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-3 rounded-full mr-3">
                                    {message.selectedDonation.icon}
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900">
                                      {message.selectedDonation.name}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                      {message.selectedDonation.description}
                                    </p>
                                  </div>
                                </div>

                                <div className="space-y-4">
                                  <div>
                                    <label className="text-sm font-medium text-gray-700 block mb-2">
                                      Donation Amount (MYR)
                                    </label>
                                    <div className="flex items-center mb-3">
                                      <div className="bg-white p-2 rounded-l-lg border border-r-0 border-gray-300">
                                        <DollarSign className="h-5 w-5 text-gray-500" />
                                      </div>
                                      <Input
                                        type="number"
                                        value={donationAmount}
                                        onChange={(e) =>
                                          setDonationAmount(
                                            Number(e.target.value)
                                          )
                                        }
                                        min={message.selectedDonation.minAmount}
                                        className="bg-white rounded-l-none border-l-0"
                                      />
                                    </div>

                                    <div className="grid grid-cols-4 gap-2 mb-3">
                                      {predefinedAmounts.map((amount) => (
                                        <Button
                                          key={amount}
                                          variant={
                                            donationAmount === amount
                                              ? "default"
                                              : "outline"
                                          }
                                          className={cn(
                                            "text-sm h-10",
                                            donationAmount === amount
                                              ? "bg-gradient-to-r from-blue-600 to-purple-600"
                                              : "hover:bg-blue-50"
                                          )}
                                          onClick={() =>
                                            setDonationAmount(amount)
                                          }
                                        >
                                          {amount} MYR
                                        </Button>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-sm flex-1"
                                      onClick={handleDonationBack}
                                    >
                                      <ArrowLeft className="h-4 w-4 mr-1" />
                                      Back
                                    </Button>
                                    <Button
                                      size="sm"
                                      className="text-sm flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                      onClick={handleConfirmDonation}
                                      disabled={
                                        donationAmount <
                                        message.selectedDonation.minAmount
                                      }
                                    >
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      Confirm Donation
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}

                        {/* Donation success */}
                        {message.type === "donation-success" && (
                          <motion.div
                            className="mt-4"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                          >
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200 shadow-md">
                              <div className="flex justify-center mb-3">
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: [0, 1.2, 1] }}
                                  transition={{ duration: 0.5 }}
                                  className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-full text-white"
                                >
                                  <CheckCircle className="h-8 w-8" />
                                </motion.div>
                              </div>
                              <h3 className="text-center text-lg font-bold text-green-800 mb-2">
                                Donation Successful!
                              </h3>
                              <p className="text-center text-sm text-gray-600 mb-3">
                                Thank you for your generosity. Your contribution
                                will make a real difference.
                              </p>
                              <div className="bg-white p-3 rounded-lg border border-green-100 mb-3">
                                <div className="flex justify-between mb-2">
                                  <span className="text-sm text-gray-500">
                                    Amount:
                                  </span>
                                  <span className="text-sm font-bold text-gray-900">
                                    {donationAmount} MYR
                                  </span>
                                </div>
                                <div className="flex justify-between mb-2">
                                  <span className="text-sm text-gray-500">
                                    Recipient:
                                  </span>
                                  <span className="text-sm font-bold text-gray-900">
                                    {message.selectedDonation?.name}
                                  </span>
                                </div>
                                <div className="flex justify-between mb-2">
                                  <span className="text-sm text-gray-500">
                                    Transaction ID:
                                  </span>
                                  <span className="text-sm font-mono text-gray-900">
                                    U1CDLX6U
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-500">
                                    Date:
                                  </span>
                                  <span className="text-sm text-gray-900">
                                    {new Date().toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              <div className="flex justify-center gap-2">
                                <Badge
                                  variant="outline"
                                  className="bg-green-100 text-green-800 border-green-200"
                                >
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Tax Deductible
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className="bg-blue-100 text-blue-800 border-blue-200"
                                >
                                  <Globe className="h-3 w-3 mr-1" />
                                  Impact Verified
                                </Badge>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>

                      {/* Timestamp */}
                      <div
                        className={cn(
                          "text-xs text-gray-500 mt-1",
                          message.sender === "user" ? "text-right" : "text-left"
                        )}
                      >
                        <span className="flex items-center gap-1 inline-block">
                          {message.sender === "user" ? (
                            <>
                              {message.timestamp.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                              <CheckCircle className="h-3 w-3 text-blue-500" />
                            </>
                          ) : (
                            <>
                              <Clock className="h-3 w-3" />
                              {message.timestamp.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </>
                          )}
                        </span>
                      </div>
                    </motion.div>
                  ))}

                  {/* Typing indicator */}
                  {typingEffect && (
                    <div className="mr-auto max-w-[85%] mb-4">
                      <div className="bg-gray-100 border border-gray-200 rounded-2xl p-4 shadow-sm">
                        <div className="flex space-x-2">
                          <motion.div
                            className="h-2 w-2 bg-gray-400 rounded-full"
                            animate={{ y: [0, -5, 0] }}
                            transition={{
                              duration: 0.5,
                              repeat: Number.POSITIVE_INFINITY,
                              repeatType: "loop",
                            }}
                          />
                          <motion.div
                            className="h-2 w-2 bg-gray-400 rounded-full"
                            animate={{ y: [0, -5, 0] }}
                            transition={{
                              duration: 0.5,
                              delay: 0.2,
                              repeat: Number.POSITIVE_INFINITY,
                              repeatType: "loop",
                            }}
                          />
                          <motion.div
                            className="h-2 w-2 bg-gray-400 rounded-full"
                            animate={{ y: [0, -5, 0] }}
                            transition={{
                              duration: 0.5,
                              delay: 0.4,
                              repeat: Number.POSITIVE_INFINITY,
                              repeatType: "loop",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {isLoading && !typingEffect && (
                    <div className="text-center text-gray-500 text-sm py-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                        }}
                        className="inline-block mr-2"
                      >
                        <svg className="h-4 w-4" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      </motion.div>
                      Processing your request...
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>

              <CardFooter className="p-4 border-t bg-white">
                <div className="w-full space-y-3">
                  {!showQuickDonations && (
                    <div className="flex justify-between">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-gray-500 hover:text-blue-600"
                        onClick={() => setShowQuickDonations(true)}
                      >
                        <Gift className="h-4 w-4 mr-1" />
                        Quick Donate
                      </Button>

                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-gray-500 hover:text-blue-600 h-8 w-8 p-0"
                        >
                          <ImageIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-gray-500 hover:text-blue-600 h-8 w-8 p-0"
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        >
                          <Smile className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="flex w-full items-center space-x-2">
                    <Input
                      placeholder="Type your message..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyPress}
                      className="flex-1 bg-gray-100 border-gray-200 focus:bg-white"
                      disabled={isLoading}
                    />
                    <Button
                      type="submit"
                      size="icon"
                      className="bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 rounded-full h-12 w-12"
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isLoading}
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>

                  {isExpanded && (
                    <div className="text-center text-xs text-gray-400">
                      Powered by DermaNow AI • Your data is secure and private
                    </div>
                  )}
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
