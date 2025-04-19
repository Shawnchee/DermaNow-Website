"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractABI } from "@/lib/contract-abi";
import { toast } from "sonner";
import supabase from "@/utils/supabase/client"; // Ensure you have a Supabase client setup
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import connectMetamask from "@/hooks/connectMetamask";

export default function CompletedMilestones() {
  const [completedMilestones, setCompletedMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [contract, setContract] = useState(null);
  const { walletAddress, provider, signer, connectWallet } = connectMetamask()

  const CONTRACT_ADDRESS = "0x158160A8825Fd5282a6CF4e9AE16313160264F9D"; // Replace with your contract address

  // Initialize contract when signer and provider are available
  useEffect(() => {
    console.log("Contract address:", CONTRACT_ADDRESS);
    console.log("Signer and provider available:", signer, provider);

    const initialize = async () => {
      if (signer && provider) {
        try {
          const milestoneContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
          setContract(milestoneContract);

          // Initialize contract data
          await initializeContractData(milestoneContract);
          console.log("Contract data initialized");
          console.log("Contract initialized:", milestoneContract.address);
        } catch (error) {
          console.error("Error initializing contract:", error);
          toast("Contract Error", {
            description: "Failed to initialize the staking contract.",
          });
        }
      }
    };

    // Add a small delay to ensure signer and provider are loaded
    const timeout = setTimeout(() => {
      initialize();
    }, 1000); // 1 second delay

    return () => clearTimeout(timeout); // Cleanup timeout on unmount
  }, [signer, provider]);

    useEffect(() => {
      if (!walletAddress) {
        const savedAddress = localStorage.getItem("walletAddress")
        if (savedAddress) {
          console.log("Auto-connecting wallet...")
          connectWallet() // Trigger wallet connection
        }
      }
    }, [walletAddress, connectWallet])
  // Initialize contract data
  const initializeContractData = async (contractInstance) => {
    try {
      setLoading(true);

      // Fetch milestones for donation
      await fetchMilestones(contractInstance);

      console.log("Milestones fetched successfully");
      setLoading(false);
    } catch (error) {
      console.error("Error initializing contract data:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  // Fetch milestones
  const fetchMilestones = async (contractInstance) => {
    try {
      const milestoneCount = await contractInstance.milestoneCount();
      console.log("Total milestones:", milestoneCount);

      const milestones = [];
      for (let i = 0; i < milestoneCount; i++) {
        const milestone = await contractInstance.getMilestone(i);

        // Check if the milestone is completed (released)
        if (milestone[4]) {
          // Fetch project title from Supabase
          const { data: projectData, error: supabaseError } = await supabase
            .from("charity_projects") // Replace with your Supabase table name
            .select("title")
            .eq("smart_contract_address", CONTRACT_ADDRESS); // Match the serviceProvider or smart_contract_address

          if (supabaseError) {
            console.error("Error fetching project title from Supabase:", supabaseError);
            throw new Error("Failed to fetch project title.");
          }

          const projectTitle = projectData?.[0]?.title || "Unknown Project";

          milestones.push({
            project_title: projectTitle, // Use the fetched project title
            description: milestone[0],
            serviceProvider: milestone[1],
            targetAmount: ethers.formatEther(milestone[2]),
            currentAmount: ethers.formatEther(milestone[3]),
            voteCount: milestone[5],
          });
        }
      }

      setCompletedMilestones(milestones);
      console.log("Completed milestones:", milestones);
    } catch (error) {
      console.error("Error fetching milestones:", error);
      setError("Failed to fetch milestones. Please try again later.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <Card className="w-full max-w-7xl bg-white/90 backdrop-blur-sm border">
        <CardHeader>
          <CardTitle className="text-2xl text-black">Completed Milestones</CardTitle>
          <CardDescription className="text-gray-600">
            List of milestones that have been successfully completed that you've contributed to.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading completed milestones...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : completedMilestones.length === 0 ? (
            <p className="text-gray-500">No completed milestones found.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {completedMilestones.map((milestone, index) => (
                <Card key={index} className="border border-green-400 bg-green-50 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-blue-800">{milestone.project_title}</CardTitle>
                    <CardDescription className="text-blue-700">{milestone.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 pb-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Service Provider:</span>
                      <span className="font-mono text-xs text-blue-800 truncate max-w-48">{milestone.serviceProvider}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Target Amount:</span>
                      <span className="text-blue-800">{milestone.targetAmount} ETH</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Current Amount:</span>
                      <span className="text-blue-800">{milestone.currentAmount} ETH</span>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <div className="flex justify-between items-center w-full">
                      <span className="text-gray-600 text-sm">Votes:</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">{milestone.voteCount}</span>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}