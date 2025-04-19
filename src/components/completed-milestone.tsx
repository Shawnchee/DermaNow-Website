"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractABI } from "@/lib/contract-abi";
import connectMetamask from "@/hooks/connectMetamask";
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

export default function CompletedMilestones() {
  const { walletAddress, provider, signer, connectWallet } = connectMetamask();
  const [completedMilestones, setCompletedMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const CONTRACT_ADDRESS = "0xYourContractAddress"; // Replace with your contract address

  async function fetchCompletedMilestonesForUser(userAddress) {
    try {
      setLoading(true);

      if (!provider || !signer) {
        throw new Error("Ethereum provider or signer is not available.");
      }

      // Connect to the contract
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

      // Get the total number of milestones
      const milestoneCount = await contract.milestoneCount();

      const milestones = [];
      for (let i = 0; i < milestoneCount; i++) {
        const milestone = await contract.getMilestone(i);

        // Check if the milestone is completed (released)
        if (milestone[4]) {
          // Get the list of donors for the milestone
          const donors = await contract.getDonors(i);

          // Check if the user is in the list of donors
          if (donors.includes(userAddress)) {
            milestones.push({
              id: i,
              description: milestone[0],
              serviceProvider: milestone[1],
              targetAmount: ethers.formatEther(milestone[2]),
              currentAmount: ethers.formatEther(milestone[3]),
              voteCount: milestone[5],
            });
          }
        }
      }

      setCompletedMilestones(milestones);
    } catch (err) {
      console.error("Error fetching completed milestones:", err);
      setError("Failed to fetch completed milestones. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        if (!walletAddress) {
          await connectWallet(); // Connect wallet if not already connected
        }

        if (!walletAddress) {
          throw new Error("Wallet address is not available.");
        }

        // Fetch completed milestones for the user
        await fetchCompletedMilestonesForUser(walletAddress);
      } catch (err) {
        console.error("Error fetching user address or milestones:", err);
        setError("Failed to connect to wallet or fetch milestones. Please try again.");
        setLoading(false);
      }
    }

    fetchData();
  }, [walletAddress, provider, signer]);

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <Card className="w-full max-w-7xl bg-white/90 backdrop-blur-sm border">
        <CardHeader>
          <CardTitle className="text-2xl text-black">Your Completed Milestones</CardTitle>
          <CardDescription className="text-gray-600">
            List of milestones you have donated to that have been successfully completed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading your completed milestones...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : completedMilestones.length === 0 ? (
            <p className="text-gray-500">You have no completed milestones.</p>
          ) : (
            <div className="rounded-md border border-blue-200">
              <Table>
                <TableCaption className="text-blue-800 my-4">
                  List of completed milestones you donated to
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-blue-900">ID</TableHead>
                    <TableHead className="text-blue-900">Description</TableHead>
                    <TableHead className="text-blue-900">Service Provider</TableHead>
                    <TableHead className="text-right text-blue-900">Target Amount (ETH)</TableHead>
                    <TableHead className="text-right text-blue-900">Current Amount (ETH)</TableHead>
                    <TableHead className="text-center text-blue-900">Votes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completedMilestones.map((milestone) => (
                    <TableRow key={milestone.id}>
                      <TableCell className="font-medium text-blue-800">{milestone.id}</TableCell>
                      <TableCell className="text-blue-800">{milestone.description}</TableCell>
                      <TableCell className="font-mono text-xs text-blue-800">
                        {milestone.serviceProvider}
                      </TableCell>
                      <TableCell className="text-right text-blue-800">
                        {milestone.targetAmount}
                      </TableCell>
                      <TableCell className="text-right text-blue-800">
                        {milestone.currentAmount}
                      </TableCell>
                      <TableCell className="text-center text-blue-800">
                        {milestone.voteCount}
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