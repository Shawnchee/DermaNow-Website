"use client";

import { useState, useEffect } from "react";
import { ethers, formatEther } from "ethers";
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

export default function SmartContractTransaction() {
  const ETHERSCAN_API_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY || "";
  const contractAddress = "0x3cd514BDC64330FF78Eff7c442987A8F5b7a6Aeb";
  const ETH_TO_MYR_RATE = 12500;

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchTransactions(contractAddress) {
    try {
      // Etherscan API endpoint for Sepolia testnet
      const baseUrl = "https://api-sepolia.etherscan.io/api";

      const url = `${baseUrl}?module=account&action=txlist&address=${contractAddress}&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=${ETHERSCAN_API_KEY}`;

      const response = await fetch(url);
      const data = await response.json();
      console.log("Fetched transactions:", data);

      if (data.status === "1") {
        // Filter transactions to only include those where the contract is the recipient
        const receivedTransactions = data.result.filter(
          (tx) => tx.to.toLowerCase() === contractAddress.toLowerCase()
        );
        setTransactions(receivedTransactions);
      } else {
        setError(data.message || "No transactions found for the specified contract address.");
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Failed to fetch transactions. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTransactions(contractAddress);
  }, [contractAddress]);

  // Function to truncate long addresses/hashes
  const truncateAddress = (address) => {
    if (!address) return "Contract Creation";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Function to format date
  const formatDate = (timestamp) => {
    return new Date(parseInt(timestamp) * 1000).toLocaleString();
  };

  const convertEthToMyr = (ethValue) => {
    return (parseFloat(ethValue) * ETH_TO_MYR_RATE).toFixed(2);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Card className="w-full max-w-9xl bg-white/90 backdrop-blur-sm border ">
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
          {loading ? (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                <p className="text-blue-800">Loading donation history...</p>
              </div>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex space-x-4">
                  <Skeleton className="h-12 w-full bg-blue-100" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
              {error}
            </div>
          ) : (
            <div className="rounded-md border border-blue-200">
              <Table>
                <TableCaption className="text-blue-800 my-8">
                  Donation history for the specified smart contract address
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className=" text-blue-900">Date</TableHead>
                    <TableHead className="text-blue-900">Hash</TableHead>
                    <TableHead className="text-blue-900">From</TableHead>
                    <TableHead className="text-right text-blue-900">Value (MYR)</TableHead>
                    <TableHead className="text-center  text-blue-900">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-gray-500">
                        No donations found for this contract
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((tx, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium text-blue-800 px">{formatDate(tx.timeStamp)}</TableCell>
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
                            {convertEthToMyr(formatEther(tx.value))} MYR
                          </span>
                          <span className="text-xs text-gray-500">
                            ≈ {parseFloat(formatEther(tx.value)).toFixed(6)} ETH
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