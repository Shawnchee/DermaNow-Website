"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
        description:
          "The transaction has been successfully removed from the flagged list.",
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
    <Card className="border-blue-100 shadow-md">
      <CardHeader>
        <CardTitle className="text-xl text-blue-900">
          Flagged Transactions
        </CardTitle>
        <CardDescription>
          Review and manage flagged transactions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          {loading ? (
            <p>Loading flagged transactions...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : flaggedTransactions.length === 0 ? (
            <p className="text-gray-500">No flagged transactions found.</p>
          ) : (
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Hash
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    From
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    To
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Value
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Reason
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {flaggedTransactions.map((tx) => (
                  <tr
                    key={tx.hash}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">
                      {new Date(tx.created_at).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-blue-800">
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
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-blue-800">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="cursor-help underline decoration-dotted underline-offset-2">
                            {tx.from_address.slice(0, 10)}...
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="font-mono text-xs">
                              {tx.from_address}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-blue-800">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="cursor-help underline decoration-dotted underline-offset-2">
                            {tx.to_address.slice(0, 10)}...
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="font-mono text-xs">{tx.to_address}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </td>
                    <td className="py-3 px-4 text-right text-blue-800">
                      {parseFloat(tx.value).toFixed(6)} ETH
                    </td>
                    <td className="py-3 px-4 text-blue-800">
                      {tx.flag_reason}
                    </td>
                    <td className="py-3 px-4 flex flex-wrap gap-2">
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
                        onClick={() =>
                          banWalletAddress(tx.from_address, tx.hash)
                        }
                      >
                        Ban
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
