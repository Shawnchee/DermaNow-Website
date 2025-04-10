"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { Send, X, MessageSquare, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import getCurrentUser from "@/hooks/getCurrentUser";
import { useUserData } from "@/hooks/fetchUserData";
import Markdown from "markdown-to-jsx";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);

  const currentUser = getCurrentUser();
  const [userId, setUserId] = useState("");
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentUser?.id) {
      setUserId(currentUser.id);
    }
  }, [currentUser]);

  const { data: userData, loading: userLoading } = useUserData(userId);

  const getPet = (path: string) => {
    const bucket = "virtual-pets";
    const folder = "pet-combined";
    return `https://jalcuslxbhoxepybolxw.supabase.co/storage/v1/object/public/${bucket}/${folder}/${path}`;
  };

  const petImage = userData?.pet_owned
    ? getPet(userData.pet_owned)
    : "placeholder";

  useEffect(() => {
    // Skip if no petImage or it's just the placeholder
    if (!petImage || petImage === "placeholder") {
      // For placeholder, we're not loading an image so set these states
      setImageLoaded(true);
      setImageError(false);
      return;
    }

    // Reset states at the start of loading
    setImageLoaded(false);
    setImageError(false);

    // Create a new image object to preload
    const img = new Image();

    // Set up event handlers before setting src
    img.onload = () => {
      console.log("Image loaded successfully:", petImage);
      setImageLoaded(true);
    };

    img.onerror = () => {
      console.log("Image failed to load:", petImage);
      setImageError(true);
      setImageLoaded(true); // Still mark as "loaded" to remove loader
    };

    // Start loading the image
    img.src = petImage;

    // Clean up
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [petImage]);
  // Scroll to bottom of messages when new message is added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim()) {
      handleSubmit(e);
    }
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true); // We set loaded to true to remove the loader
  };

  // Handle successful image load
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  console.log("Image Pet: " + petImage);
  console.log("Image Loaded: " + imageLoaded);
  console.log("Image Error: " + imageError);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full w-16 h-16 shadow-lg flex items-center justify-center overflow-hidden cursor-pointer bg-blue-600 hover:bg-blue-700 text-white"
        size="icon"
      >
        {/* Only show loader when actively loading (not for error states) */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <Loader2 className="h-6 w-6 text-white animate-spin" />
          </div>
        )}

        {/* Main image with fallback handling */}
        {petImage !== "placeholder" ? (
          <img
            src={petImage || "/placeholder.svg"}
            alt="Virtual Pet"
            className={`w-full h-full object-cover transition-all duration-300 ${
              imageLoaded && !imageError
                ? "opacity-100 scale-100"
                : "opacity-0 scale-95"
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        ) : (
          <Loader2 className="h-6 w-6 text-white animate-spin" />
        )}

        {/* Error fallback that displays when load fails */}
        {imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
            <MessageSquare className="h-6 w-6 text-blue-600" />
          </div>
        )}
      </Button>

      {/* Chat dialog */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center sm:items-end sm:justify-end sm:p-6">
          <Card className="w-full max-w-xl h-[calc(100vh-2rem)] sm:h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
            <CardHeader className="border-b p-2">
              <div className="flex flex-col items-center mb-2">
                <div className="relative w-32 h-32 mb-2">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-700/20 rounded-full -z-10 scale-110 animate-pulse" />
                  <div className="absolute inset-0 bg-blue-600/10 rounded-full blur-md -z-10" />
                  <div className="w-full h-full rounded-full overflow-hidden border-2 border-blue-500/20 shadow-lg relative">
                    {petImage !== "placeholder" ? (
                      <>
                        {/* Show loader until image loads */}
                        {!imageLoaded && (
                          <div className="absolute inset-0 flex items-center justify-center bg-muted/80">
                            <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
                          </div>
                        )}

                        {/* The actual image */}
                        <img
                          src={petImage || "/placeholder.svg"}
                          alt="Virtual Pet"
                          className={`w-full h-full object-cover transition-opacity duration-300 ${
                            imageLoaded ? "opacity-100" : "opacity-0"
                          }`}
                          onLoad={handleImageLoad}
                          onError={handleImageError}
                        />

                        {/* Fallback if image fails to load */}
                        {imageError && (
                          <div className="absolute inset-0 flex items-center justify-center bg-muted">
                            <MessageSquare className="h-10 w-10 text-blue-400" />
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <MessageSquare className="h-10 w-10 text-blue-400" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Name with better visibility */}
                <span className="text-lg font-medium text-blue-800">
                  Panda Virtual Pet Assistant
                </span>
              </div>

              {/* Close button */}
              <Button
                variant="default"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="absolute right-8 top-12 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <X className="h-3 w-3" />
              </Button>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center text-muted-foreground">
                  <p>
                    I'm your Panda Virtual Pet Assistant, <br />
                    how may I help you?
                  </p>
                </div>
              ) : (
                messages.map((message: any) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.role === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-blue-50 text-gray-800"
                      }`}
                    >
                      {message.role === "assistant" ? (
                        <Markdown
                          options={{
                            overrides: {
                              // Style code snippets
                              code: {
                                component: ({ children, ...props }) => (
                                  <code
                                    className="bg-white/80 rounded px-1 py-0.5 font-mono text-sm"
                                    {...props}
                                  >
                                    {children}
                                  </code>
                                ),
                              },
                              // Style code blocks
                              pre: {
                                component: ({ children, ...props }) => (
                                  <pre
                                    className="bg-white text-gray-800 p-2 rounded-md my-2 overflow-x-auto font-mono text-sm"
                                    {...props}
                                  >
                                    {children}
                                  </pre>
                                ),
                              },
                              // Style unordered lists
                              ul: {
                                component: ({ children, ...props }) => (
                                  <ul
                                    className="list-disc pl-5 my-2 space-y-1"
                                    {...props}
                                  >
                                    {children}
                                  </ul>
                                ),
                              },
                              // Style ordered lists
                              ol: {
                                component: ({ children, ...props }) => (
                                  <ol
                                    className="list-decimal pl-5 my-2 space-y-1"
                                    {...props}
                                  >
                                    {children}
                                  </ol>
                                ),
                              },
                              // Style links
                              a: {
                                component: ({ children, ...props }) => (
                                  <a
                                    className="text-blue-600 underline hover:text-blue-800"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    {...props}
                                  >
                                    {children}
                                  </a>
                                ),
                              },
                              // Style paragraphs
                              p: {
                                component: ({ children, ...props }) => (
                                  <p className="my-1" {...props}>
                                    {children}
                                  </p>
                                ),
                              },
                            },
                          }}
                        >
                          {message.content}
                        </Markdown>
                      ) : (
                        // User messages remain as plain text
                        <p>{message.content}</p>
                      )}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />

              {/* Loading indicator for when the AI is generating a response */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-blue-50 rounded-lg px-4 py-2 max-w-[80%] flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    <span className="text-sm text-blue-700">
                      🐼 Munching bamboo... 🐼
                    </span>
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter className="border-t p-4">
              <form onSubmit={onSubmit} className="flex w-full gap-2">
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Type your message..."
                  className="flex-1 border-blue-200 focus-visible:ring-blue-300"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() || isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
}
