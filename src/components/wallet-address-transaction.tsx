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
import { Button } from "@/components/ui/button";
import { ExternalLink, Loader2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import supabase from "@/utils/supabase/client";
import { EthereumLivePrice } from "@/utils/ethLivePrice";

export default function WalletTransaction() {
  const walletAddress = "0x483bF34b4444dB73FB0b1b5EBDB0253A4E8b714f";
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ethToMyr, setEthToMyr] = useState(12500);

  async function fetchEthToMyrRate() {
    try {
      const ethPriceInMyr = await EthereumLivePrice();
      setEthToMyr(ethPriceInMyr);
    } catch (error) {
      console.error("Error fetching ETH to MYR rate:", error);
      setEthToMyr(12500);
    }
  }

  async function fetchTransactions(walletAddress) {
    try {
      const url = `/api/transactions?address=${walletAddress}`;
      const response = await fetch(url);
      const data = await response.json();
      console.log("Fetched transactions:", data);

      if (data.status === "1") {
        const sentTransactions = data.result.filter(
          (tx) => tx.from.toLowerCase() === walletAddress.toLowerCase()
        );

        const { data: walletData, error: walletError } = await supabase
          .from("charity_projects")
          .select("smart_contract_address, title");

        if (walletError) {
          console.error("Error fetching data from Supabase:", walletError);
          setError("Failed to fetch project titles. Please try again later.");
          return;
        }

        const filteredTransactions = sentTransactions
          .filter((tx) => parseFloat(tx.value) > 0)
          .filter((tx) =>
            walletData.some(
              (item) =>
                item.smart_contract_address?.toLowerCase() ===
                tx.to?.toLowerCase()
            )
          );

        const transactionsWithTitles = filteredTransactions.map((tx) => {
          const project = walletData.find(
            (item) =>
              item.smart_contract_address?.toLowerCase() ===
              tx.to?.toLowerCase()
          );

          return {
            ...tx,
            project_title: project ? project.title : "Unknown Project",
          };
        });

        setTransactions(transactionsWithTitles);
      } else {
        setError(
          data.message ||
            "No transactions found for the specified wallet address."
        );
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Failed to fetch transactions. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEthToMyrRate();
    fetchTransactions(walletAddress);
  }, []);

  const truncateAddress = (address) => {
    if (!address) return "Contract Creation";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (timestamp) => {
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toISOString().replace("T", " ").split(".")[0]; // Format as "YYYY-MM-DD HH:MM:SS"
  };

  const convertEthToMyr = (ethValue) => {
    return (parseFloat(ethValue) * ethToMyr).toFixed(2);
  };

  // Function to export transactions as CSV
  const exportToCSV = () => {
    const csvRows = [
      ["Date", "Project Title", "Hash", "To", "Value (MYR)", "Value (ETH)"], // Header row
      ...transactions.map((tx) => [
        formatDate(tx.timeStamp),
        tx.project_title,
        tx.hash,
        tx.to || "Contract Creation",
        convertEthToMyr(formatEther(tx.value)),
        parseFloat(formatEther(tx.value)).toFixed(6),
      ]),
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      csvRows.map((row) => row.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center justify-start py-4">
      <Card className="w-full max-w-7xl bg-white/90 backdrop-blur-sm border">
        <CardHeader>
          <CardTitle className="text-2xl text-black">
            User Donation History
          </CardTitle>
          <CardDescription className="text-gray-600">
            Recent donations from the specified wallet address
          </CardDescription>
          <div className="mt-2 p-2 bg-blue-50 rounded-md">
            <code className="text-sm font-mono break-all text-blue-800">
              {walletAddress}
            </code>
          </div>
          <div className="flex justify-center mt-4">
            <Button
              onClick={exportToCSV}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Export to CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                <p className="text-blue-800">Loading transaction history...</p>
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
                <TableCaption className="text-blue-800 my-4">
                  Donation history for the specified wallet address
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w text-blue-900">Date</TableHead>
                    <TableHead className="text-blue-900">
                      Project Title
                    </TableHead>
                    <TableHead className="text-blue-900">Hash</TableHead>
                    <TableHead className="text-blue-900">To</TableHead>
                    <TableHead className="text-right text-blue-900">
                      Value (MYR)
                    </TableHead>
                    <TableHead className="text-center text-blue-900">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center text-gray-500"
                      >
                        No SENT transactions found for this wallet
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((tx, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium text-blue-800">
                          {formatDate(tx.timeStamp)}
                        </TableCell>
                        <TableCell className="font-medium text-blue-800">
                          {tx.project_title}
                        </TableCell>
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
                                <p className="font-mono text-xs">
                                  {tx.to || "Contract Creation"}
                                </p>
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
                            <Button
                              variant="outline"
                              size="sm"
                              className="cursor-pointer text-blue-800 border-blue-200"
                            >
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