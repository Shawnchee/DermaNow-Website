"use client";

import { useState } from "react";
import openai from "@/utils/openai";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  CheckCircle,
  XCircle,
  Loader2,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Shield,
  MoonStar,
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function HalalChecker({ description }: { description: string }) {
  const [response, setResponse] = useState<{
    isHalal: boolean;
    reasons: string[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!description.trim()) {
      setError("Please enter an event description");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResponse(null);

    const promptInput = `
Determine if the following charity event is halal/Shariah compliant. 
Return the answer in the following JSON format:

{
  "isHalal": true | false,
  "reasons": [
    "Reason 1",
    "Reason 2",
    "Reason 3"
  ]
}

Event description: 
${description}`;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: promptInput }],
      });

      const raw = completion.choices[0].message.content || "";
      const jsonStart = raw.indexOf("{");
      const jsonEnd = raw.lastIndexOf("}") + 1;
      const jsonStr = raw.slice(jsonStart, jsonEnd);

      const parsed = JSON.parse(jsonStr);
      setResponse(parsed);
    } catch (err: any) {
      console.error("OpenAI error:", err);
      setError("Failed to parse OpenAI response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-3xl mx-auto py-8 px-4">
      <Card className="mb-8 overflow-hidden">
        <CardHeader className="relative">
          <div className="flex items-center space-x-2">
            <MoonStar className="h-6 w-6 text-blue-600" />
            <CardTitle className="text-lg font-semibold">
              Donation Halal Status
            </CardTitle>
          </div>
          <CardDescription>
            Verify the Halal status of this project
          </CardDescription>
        </CardHeader>
        <CardFooter className="relative">
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                Check Compliance
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading && (
        <Card className="mb-6 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-blue-300 via-emerald-300 to-blue-300 w-full animate-pulse" />
          <CardHeader>
            <div className="h-7 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </CardContent>
        </Card>
      )}

      {response && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="overflow-hidden">
            <div
              className={`h-2 w-full ${
                response.isHalal ? "bg-blue-500" : "bg-red-500"
              }`}
            />
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="flex items-center mb-2 sm:mb-0">
                  {response.isHalal ? (
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 10,
                      }}
                      className="flex items-center"
                    >
                      <CheckCircle className="h-8 w-8 text-blue-500 mr-2" />
                      <span className="text-xl text-black-700 font-bold">
                        Halal Compliant
                      </span>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 10,
                      }}
                      className="flex items-center"
                    >
                      <XCircle className="h-8 w-8 text-red-500 mr-2" />
                      <span className="text-red-700 font-bold">
                        Not Halal Compliant
                      </span>
                    </motion.div>
                  )}
                </CardTitle>
                <Badge
                  className={`${
                    response.isHalal
                      ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
                      : "bg-red-100 text-red-800 hover:bg-red-100"
                  } px-3 py-1 text-sm`}
                >
                  {response.isHalal ? "✓ Shariah Approved" : "✗ Not Approved"}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                <BookOpen className="h-5 w-5 text-gray-600 mr-2" />
                <h3 className="text-lg font-medium">Analysis Results</h3>
              </div>

              <div className="mb-6">
                <div className="flex justify-between text-sm mb-1">
                  <span>Compliance Level</span>
                  <span className="font-medium">
                    {response.isHalal ? "100% Compliant" : "Not Compliant"}
                  </span>
                </div>
                <Progress
                  value={response.isHalal ? 100 : 0}
                  className={`h-2 ${
                    response.isHalal ? "bg-gray-100" : "bg-gray-100"
                  }`}
                />
              </div>

              <div className="space-y-4">
                {response.reasons.map((reason, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                  >
                    <Card
                      className={`border ${
                        response.isHalal
                          ? "border-blue-200 bg-blue-50/50"
                          : "border-red-200 bg-red-50/50"
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start">
                          <div
                            className={`flex items-center justify-center h-6 w-6 rounded-full text-white text-sm font-medium mr-3 ${
                              response.isHalal ? "bg-blue-500" : "bg-red-500"
                            }`}
                          >
                            {i + 1}
                          </div>
                          <p className="text-gray-700">{reason}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>

            <CardFooter className="py-1">
              <p className="text-sm text-gray-600 italic">
                {response.isHalal
                  ? "This event appears to comply with Islamic principles and is suitable for Muslim participation."
                  : "This event may not fully comply with Islamic principles. Please review the concerns above."}
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
