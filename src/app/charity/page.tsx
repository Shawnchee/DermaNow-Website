"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion } from "framer-motion";
import { toast } from "sonner";
import connectMetamask from "@/hooks/connectMetamask";
import { contractABI } from "@/lib/contract-abi";
import { formatEther, parseEther } from "ethers";

// Contract address from deployment
const CONTRACT_ADDRESS = "0xAA4Ae89A691b5D989E4c9edb12367a6351431303";

export default function CharityPage() {
  // Use the connectMetamask hook
  const { walletAddress, provider, signer, connectWallet } = connectMetamask();
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [totalRaised, setTotalRaised] = useState(0);
  const [targetAmount, setTargetAmount] = useState(10); // Default to 10 ETH
  const [ethToMyrRate, setEthToMyrRate] = useState(12500); // Default rate: 1 ETH = 12,500 MYR
  const [myrValues, setMyrValues] = useState({
    totalRaised: 0,
    targetAmount: 0,
    remainingAmount: 0,
  });

  // Initialize contract when signer is available
  useEffect(() => {
    const initialize = async () => {
      if (signer && provider) {
        try {
          const charityContract = new ethers.Contract(
            CONTRACT_ADDRESS,
            contractABI,
            signer
          );
          setContract(charityContract);
          console.log("Contract initialized:", charityContract.address);

          // Fetch contract data
          await fetchContractData(charityContract);
          console.log("Contract data initialized");
        } catch (error) {
          console.error("Error initializing contract:", error);
          toast("Contract Error", {
            description: "Failed to initialize the charity contract.",
          });
        }
      }
    };

    // Add a small delay to ensure signer and provider are loaded
    const timeout = setTimeout(() => {
      initialize();
    }, 500); // 500ms delay

    return () => clearTimeout(timeout); // Cleanup timeout on unmount
  }, [signer, provider]);

  // Auto-connect wallet if already connected
  useEffect(() => {
    if (!walletAddress) {
      const savedAddress = localStorage.getItem("walletAddress");
      if (savedAddress) {
        console.log("Auto-connecting wallet...");
        connectWallet(); // Trigger wallet connection
      }
    }
  }, [walletAddress, connectWallet]);

  // Fetch all data from the contract
  const fetchContractData = async (contractInstance: ethers.Contract) => {
    try {
      setLoading(true);

      // Fetch milestones
      const milestoneCount = await contractInstance.milestoneCount();
      const milestonePromises = [];

      for (let i = 0; i < milestoneCount; i++) {
        milestonePromises.push(contractInstance.getMilestone(i));
      }

      const milestoneData = await Promise.all(milestonePromises);
      const formattedMilestones = milestoneData.map((milestone, index) => {
        return {
          id: index,
          description: milestone.description,
          serviceProvider: milestone.serviceProvider,
          targetAmount: formatEther(milestone.targetAmount),
          currentAmount: formatEther(milestone.currentAmount),
          released: milestone.released,
          voteCount:
            typeof milestone.voteCount === "object" &&
            "toNumber" in milestone.voteCount
              ? milestone.voteCount.toNumber()
              : milestone.voteCount, // Handle both BigNumber and plain number
          progress:
            (Number.parseFloat(formatEther(milestone.currentAmount)) /
              Number.parseFloat(formatEther(milestone.targetAmount))) *
            100,
        };
      });

      setMilestones(formattedMilestones);

      // Calculate total target and raised amounts
      let totalTarget = 0;
      let totalRaised = 0;

      formattedMilestones.forEach((milestone) => {
        totalTarget += Number(milestone.targetAmount);
        totalRaised += Number(milestone.currentAmount);
      });

      setTargetAmount(totalTarget);
      setTotalRaised(totalRaised);

      // Update MYR values
      updateMyrValues(totalRaised, totalTarget);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching contract data:", error);
      toast("Error", {
        description: "Failed to load milestone data. Please try again.",
      });
      setLoading(false);
    }
  };

  // Update MYR values
  const updateMyrValues = (raised: number, target: number) => {
    const remainingAmount = Math.max(target - raised, 0);

    setMyrValues({
      totalRaised: raised * ethToMyrRate,
      targetAmount: target * ethToMyrRate,
      remainingAmount: remainingAmount * ethToMyrRate,
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-8 px-6 bg-zinc-50 dark:bg-zinc-950">
      <div className="container mx-auto px-6 pt-5">
        <div className="flex items-center flex-wrap gap-3 mb-4 p-4 rounded-lg border border-blue-400 dark:border-blue-700 bg-gradient-to-r from-blue-500 to-blue-600 shadow-sm">
          <div className="flex items-center">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm p-2 rounded-full mr-3">
              <span className="text-white font-bold">Charity DAO</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <motion.div
          className="text-center max-w-4xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-800 to-blue-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            Milestone-Based Charity Projects
          </motion.h1>

          <motion.p
            className="text-lg text-gray-600 max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            Support verified charity projects with transparent milestone
            tracking. Every donation is securely recorded on the blockchain.
          </motion.p>

          {!walletAddress && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Button
                onClick={connectWallet}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Connect Wallet
              </Button>
            </motion.div>
          )}

          {walletAddress && (
            <motion.div
              className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-md border border-blue-100 inline-block"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-800 font-medium">
                  Connected: {walletAddress.slice(0, 6)}...
                  {walletAddress.slice(-4)}
                </span>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Milestones Section */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">
              Active Charity Milestones
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : milestones.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-sm border border-blue-100">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <h3 className="text-xl font-medium text-gray-800 mb-2">
                  No Milestones Yet
                </h3>
                <p className="text-gray-600 text-center max-w-md">
                  There are currently no active charity milestones. Check back
                  later or contact the administrator.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {milestones.map((milestone) => (
                <Card
                  key={milestone.id}
                  className="bg-white/90 backdrop-blur-sm border border-blue-100"
                >
                  <CardHeader>
                    <CardTitle>{milestone.description}</CardTitle>
                    <CardDescription>
                      Service Provider: {milestone.serviceProvider.slice(0, 6)}
                      ...
                      {milestone.serviceProvider.slice(-4)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 space-y-1">
                      <p className="text-sm text-gray-600">
                        <strong>Target Amount:</strong> {milestone.targetAmount}{" "}
                        ETH
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Current Amount:</strong>{" "}
                        {milestone.currentAmount} ETH
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Votes:</strong> {milestone.voteCount}/3
                      </p>
                      <p
                        className={`text-sm font-medium ${
                          milestone.voteCount >= 3
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        <strong>Status:</strong>{" "}
                        {milestone.voteCount >= 3 ? "Approved" : "Not Approved"}
                      </p>
                    </div>
                    <Progress value={milestone.progress} className="h-2" />
                    <p className="text-xs text-gray-500 mt-2">
                      {milestone.progress.toFixed(2)}% funded
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
