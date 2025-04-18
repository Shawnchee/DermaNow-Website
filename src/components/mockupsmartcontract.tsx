"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Mock data for donation history
const mockTransactions = [
  {
    timeStamp: "1681872000",
    hash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    from: "0xabcdef1234567890abcdef1234567890abcdef12",
    value: "0.02",
  },
  {
    timeStamp: "1681785600",
    hash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    from: "0x1234567890abcdef1234567890abcdef12345678",
    value: "0.01",
  },
  {
    timeStamp: "1681699200",
    hash: "0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456",
    from: "0x7890abcdef1234567890abcdef1234567890abcd",
    value: "0.1",
  },
];

export default function MockupSmartContractTransaction() {
  const contractAddress = "0x483bF34b4444dB73FB0b1b5EBDB0253A4E8b714f";
  const ETH_TO_MYR_RATE = 12500; // Mock conversion rate

  // Function to truncate long addresses/hashes
  const truncateAddress = (address) => {
    if (!address) return "Contract Creation";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Function to format date
  const formatDate = (timestamp) => {
    return new Date(parseInt(timestamp) * 1000).toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Function to convert ETH to MYR
  const convertEthToMyr = (ethValue) => {
    return (parseFloat(ethValue) * ETH_TO_MYR_RATE).toFixed(2);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <Card className="w-full max-w-9xl bg-white/90 backdrop-blur-sm border">
        <CardHeader>
          <CardTitle className="text-2xl text-black">Donation History</CardTitle>
          <CardDescription className="text-gray-600">
            Showing the 10 most recent donations to the smart contract
          </CardDescription>
          <div className="mt-2 p-2 bg-blue-50 rounded-md">
            <code className="text-sm font-mono break-all text-blue-800">{contractAddress}</code>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-blue-200">
            <Table>
              <TableCaption className="text-blue-800 my-8">
                Donation history for the specified smart contract address
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-blue-900">Date</TableHead>
                  <TableHead className="text-blue-900">Hash</TableHead>
                  <TableHead className="text-blue-900">From</TableHead>
                  <TableHead className="text-right text-blue-900">Value (MYR)</TableHead>
                  <TableHead className="text-center text-blue-900">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTransactions.map((tx, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium text-blue-800">{formatDate(tx.timeStamp)}</TableCell>
                    <TableCell className="font-mono text-xs text-blue-800">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="cursor-help underline decoration-dotted underline-offset-2">
                            {truncateAddress(tx.hash)}
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="font-mono text-xs">{tx.hash}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-blue-800">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="cursor-help underline decoration-dotted underline-offset-2">
                            {truncateAddress(tx.from)}
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="font-mono text-xs">{tx.from}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="text-right flex flex-col">
                      <span className="font-bold text-md text-blue-900">
                        {convertEthToMyr(tx.value)} MYR
                      </span>
                      <span className="text-xs text-gray-500">
                        ≈ {parseFloat(tx.value).toFixed(6)} ETH
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <a
                        href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" size="sm" className="cursor-pointer text-blue-800 border-blue-200">
                          <ExternalLink className="h-4 w-4 mr-1 text-blue-800" />
                          View
                        </Button>
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}