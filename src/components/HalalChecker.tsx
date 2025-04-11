// src/components/HalalChecker.tsx

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
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function HalalChecker() {
  const description =
    "Helping hands is a charitable organisation to help build a school for students from the east coast who lost their schools and homes to the flood";
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
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Donation Halal Status</CardTitle>
          <CardDescription>
            Check if a charity event is Halal/Shariah compliant
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Check Compliance"
            )}
          </Button>
        </CardFooter>
      </Card>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading && (
        <Card className="mb-6">
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
        <Card
          className={response.isHalal ? "border-blue-500" : "border-red-500"}
        >
          <CardHeader>
            <CardTitle className="flex items-center">
              {response.isHalal ? (
                <>
                  <CheckCircle className="h-8 w-8 text-blue-500 mr-2" />
                  <span className="text-blue-700">Halal Compliant</span>
                </>
              ) : (
                <>
                  <XCircle className="h-8 w-8 text-red-500 mr-2" />
                  <span className="text-red-700">Not Halal Compliant</span>
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-3">Analysis Results:</h3>
            <ul className="space-y-2">
              {response.reasons.map((reason, i) => (
                <li key={i} className="flex items-start">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-200 text-gray-700 text-sm font-medium mr-3">
                    {i + 1}
                  </span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
