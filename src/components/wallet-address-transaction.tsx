"use client";

import { useState, useEffect } from "react";
import { formatEther } from "ethers";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";

export default function WalletTransaction() {
  const ETHERSCAN_API_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY || "";
  const walletAddress = "0x483bF34b4444dB73FB0b1b5EBDB0253A4E8b714f";
  
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchTransactions(walletAddress) {
    try {
      // Etherscan API endpoint for Sepolia testnet
      const baseUrl = "https://api-sepolia.etherscan.io/api";
      
      const url = `${baseUrl}?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&page=1&offset=5&sort=desc&apikey=${ETHERSCAN_API_KEY}`;

      const response = await fetch(url);
      const data = await response.json();
      console.log("Fetched transactions:", data);
      
      if (data.status === "1") {
        setTransactions(data.result);
      } else {
        setError(data.message || "No transactions found for the specified wallet address.");
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Failed to fetch transactions. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTransactions(walletAddress);
  }, []);

  // Function to truncate long addresses/hashes
  const truncateAddress = (address) => {
    if (!address) return "Contract Creation";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Function to format date
  const formatDate = (timestamp) => {
    return new Date(parseInt(timestamp) * 1000).toLocaleString();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-6xl">
        <CardHeader>
          <CardTitle className="text-2xl">Wallet Transaction History</CardTitle>
          <CardDescription>
            Showing the 5 most recent transactions for the wallet
          </CardDescription>
          <div className="mt-2 p-2 bg-gray-100 rounded-md">
            <code className="text-sm font-mono break-all">{walletAddress}</code>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <p>Loading transaction history...</p>
              </div>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex space-x-4">
                  <Skeleton className="h-12 w-full" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
              {error}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableCaption>
                  Transaction history for the specified wallet address
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Hash</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead className="text-right">Value (ETH)</TableHead>
                    <TableHead className="text-center w-[100px]">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground">
                        No transactions found for this wallet
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((tx, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{formatDate(tx.timeStamp)}</TableCell>
                        <TableCell>
                          <Badge variant={tx.from.toLowerCase() === walletAddress.toLowerCase() ? "destructive" : "secondary"}>
                            {tx.from.toLowerCase() === walletAddress.toLowerCase() ? "Sent" : "Received"}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs">
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
                        <TableCell className="font-mono text-xs">
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
                        <TableCell className="font-mono text-xs">
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
                        <TableCell className="text-right">
                          {parseFloat(formatEther(tx.value)).toFixed(6)}
                        </TableCell>
                        <TableCell className="text-center">
                          <a 
                            href={`https://sepolia.etherscan.io/tx/${tx.hash}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <Button variant="outline" size="sm" className="cursor-pointer">
                              <ExternalLink className="h-4 w-4 mr-1 " />
                              View
                            </Button>
                          </a>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}