"use client";

import { useState, useEffect } from "react";
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import supabase from "@/utils/supabase/client";
import { toast } from "sonner";

export default function FlaggedTransactions() {
  const [flaggedTransactions, setFlaggedTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch flagged transactions from Supabase
  async function fetchFlaggedTransactions() {
    try {
      const { data, error } = await supabase
        .from("flagged_transactions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      setFlaggedTransactions(data || []);
    } catch (err) {
      console.error("Error fetching flagged transactions:", err);
      setError("Failed to fetch flagged transactions. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  // Remove a transaction from the flagged list
  async function removeFromFlaggedList(hash) {
    try {
      const { error } = await supabase
        .from("flagged_transactions")
        .delete()
        .eq("hash", hash);

      if (error) {
        throw error;
      }

      // Refresh the list after removal
      setFlaggedTransactions((prev) =>
        prev.filter((transaction) => transaction.hash !== hash)
      );

      toast("Transaction removed from the flagged list successfully.", {
        description: "The transaction has been successfully removed from the flagged list.",
      });

    } catch (err) {
      console.error("Error removing from flagged list:", err);
      toast.error("Failed to remove the transaction from the flagged list.");

    }
  }

  // Ban a wallet address by adding it to the blacklisted table
  async function banWalletAddress(address, hash) {
    try {
      const { error } = await supabase
        .from("black_listed_address")
        .insert([{ address }]);

      if (error) {
        throw error;
      }

      await removeFromFlaggedList(hash);


      toast(`Wallet address ${address} has been banned successfully.`);
    } catch (err) {
      console.error("Error banning wallet address:", err);
      toast.error("Failed to ban the wallet address.");

    }
  }

  useEffect(() => {
    fetchFlaggedTransactions();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <Card className="w-full max-w-7xl bg-white/90 backdrop-blur-sm border">
        <CardHeader>
          <CardTitle className="text-2xl text-black">Flagged Transactions</CardTitle>
          <CardDescription className="text-gray-600">
            Review and manage flagged transactions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading flagged transactions...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : flaggedTransactions.length === 0 ? (
            <p className="text-gray-500">No flagged transactions found.</p>
          ) : (
            <div className="rounded-md border border-blue-200">
              <Table>
                <TableCaption className="text-blue-800 my-4">
                  List of flagged transactions
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-blue-900">Date</TableHead>
                    <TableHead className="text-blue-900">Hash</TableHead>
                    <TableHead className="text-blue-900">From</TableHead>
                    <TableHead className="text-blue-900">To</TableHead>
                    <TableHead className="text-right text-blue-900">Value</TableHead>
                    <TableHead className="text-blue-900">Reason</TableHead>
                    <TableHead className="text-center text-blue-900">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {flaggedTransactions.map((tx) => (
                    <TableRow key={tx.hash}>
                      <TableCell className="font-medium text-blue-800">
                        {new Date(tx.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-blue-800">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="cursor-help underline decoration-dotted underline-offset-2">
                              {tx.hash.slice(0, 10)}...
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="font-mono text-xs">{tx.hash}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-blue-800">
                        {tx.from_address}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-blue-800">
                        {tx.to_address}
                      </TableCell>
                      <TableCell className="text-right text-blue-800">
                        {parseFloat(tx.value).toFixed(6)} ETH
                      </TableCell>
                      <TableCell className="text-blue-800">{tx.flag_reason}</TableCell>
                      <TableCell className="flex space-x-2 justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-800 border-blue-200 cursor-pointer"
                          onClick={() => removeFromFlaggedList(tx.hash)}
                        >
                          Remove
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="text-white border-red-200 cursor-pointer"
                          onClick={() => banWalletAddress(tx.from_address, tx.hash)}
                        >
                          Ban
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}