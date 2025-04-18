"use client";

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { saveAs } from "file-saver";

// Mock data for user donation history
const mockTransactions = [
  {
    timeStamp: "1681872000",
    hash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    from: "0x483bF34b4444dB73FB0b1b5EBDB0253A4E8b714f",
    to: "0x1234567890abcdef1234567890abcdef12345678",
    value: "0.25",
    project_title: "Education for Kids in Rural Areas",
  },
  {
    timeStamp: "1681785600",
    hash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    from: "0x483bF34b4444dB73FB0b1b5EBDB0253A4E8b714f",
    to: "0xabcdef1234567890abcdef1234567890abcdef12",
    value: "0.5",
    project_title: "Nutrition for Academic Success",
  },
  {
    timeStamp: "1681699200",
    hash: "0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456",
    from: "0x483bF34b4444dB73FB0b1b5EBDB0253A4E8b714f",
    to: "0x7890abcdef1234567890abcdef1234567890abcd",
    value: "0.1",
    project_title: "Rebuilding Lives After Earthquakes",
  },
];

export default function MockupWalletAddress() {
  const walletAddress = "0x483bF34b4444dB73FB0b1b5EBDB0253A4E8b714f";

  // Function to truncate long addresses/hashes
  const truncateAddress = (address) => {
    if (!address) return "Contract Creation";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Function to format date
  const formatDate = (timestamp) => {
    return new Date(parseInt(timestamp) * 1000).toLocaleString();
  };

  // Function to convert ETH to MYR (mock conversion rate)
  const convertEthToMyr = (ethValue) => {
    const ethToMyrRate = 12500; // Mock conversion rate
    return (parseFloat(ethValue) * ethToMyrRate).toFixed(2);
  };

  // Function to export transactions as CSV
  const exportToCSV = () => {
    const csvContent = [
      ["Date", "Project Title", "Hash", "To", "Value (MYR)", "Value (ETH)"],
      ...mockTransactions.map((tx) => [
        formatDate(tx.timeStamp),
        tx.project_title,
        tx.hash,
        tx.to,
        convertEthToMyr(tx.value),
        parseFloat(tx.value).toFixed(6),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "transactions.csv");
  };

  return (
    <div className="flex flex-col items-center justify-start py-4">
      <Card className="w-full max-w-7xl bg-white/90 backdrop-blur-sm border">
        <CardHeader>
          <CardTitle className="text-2xl text-black">User Donation History</CardTitle>
          <CardDescription className="text-gray-600">
            Recent donations from the specified wallet address
          </CardDescription>
          <div className="mt-2 p-2 bg-blue-50 rounded-md">
            <code className="text-sm font-mono break-all text-blue-800">{walletAddress}</code>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-blue-200">
            <Table>
              <TableCaption className="text-blue-800 my-4">
                Donation history for the specified wallet address
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w text-blue-900">Date</TableHead>
                  <TableHead className="text-blue-900">Project Title</TableHead>
                  <TableHead className="text-blue-900">Hash</TableHead>
                  <TableHead className="text-blue-900">To</TableHead>
                  <TableHead className="text-right text-blue-900">Value (MYR)</TableHead>
                  <TableHead className="text-center text-blue-900">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTransactions.map((tx, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium text-blue-800">{formatDate(tx.timeStamp)}</TableCell>
                    <TableCell className="font-medium text-blue-800">{tx.project_title}</TableCell>
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
                            {truncateAddress(tx.to)}
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="font-mono text-xs">{tx.to || "Contract Creation"}</p>
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
        <div className="flex justify-end gap-4 p-4">
          <Button onClick={exportToCSV} className="bg-blue-600 text-white hover:bg-blue-700">
            Export to CSV
          </Button>
        </div>
      </Card>
    </div>
  );
}