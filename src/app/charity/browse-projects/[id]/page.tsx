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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion } from "framer-motion";
import { toast } from "sonner";
import connectMetamask from "@/hooks/connectMetamask";
import { contractABI } from "@/lib/contract-abi";
import { formatEther, parseEther } from "ethers";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  Vote,
  ExternalLink,
  Loader2,
  Check,
  X,
  Shield,
  Building,
  Lock,
  AlertTriangle,
  BadgeCheck,
  BookOpen,
  Leaf,
  Scale,
  MoonStar,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { CharityChat } from "@/components/charity-chatbot"


// Contract address from deployment
const CONTRACT_ADDRESS = "0x8765b67425A42dD7ba3e0f350542426Ed2551c02";

export default function CharityPage() {
  // Use the connectMetamask hook
  const { walletAddress, provider, signer, connectWallet } = connectMetamask();
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [account, setAccount] = useState<string>("");
  const [isCommittee, setIsCommittee] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [donationAmount, setDonationAmount] = useState<{
    [key: number]: string;
  }>({});
  const [totalRaised, setTotalRaised] = useState(0);
  const [targetAmount, setTargetAmount] = useState(10); // Default to 10 ETH
  const [transactions, setTransactions] = useState<any[]>([]);
  const [ethToMyrRate, setEthToMyrRate] = useState(12500); // Default rate: 1 ETH = 12,500 MYR
  const [myrValues, setMyrValues] = useState({
    totalRaised: 0,
    targetAmount: 0,
    remainingAmount: 0,
  })
  const [votingThreshold, setVotingThreshold] = useState(0)
  const [activeMilestoneId, setActiveMilestoneId] = useState<number>(-1)
  const [proofOfWorkModalOpen, setProofOfWorkModalOpen] = useState(false);
  const [selectedProofOfWork, setSelectedProofOfWork] = useState<any>(null);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<any>(null);
  const [modalDonationAmount, setModalDonationAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionResult, setTransactionResult] = useState<{
    status: "success" | "error" | null;
    message: string;
    txHash?: string;
  }>({ status: null, message: "" });

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
        setAccount(savedAddress);
      }
    }
  }, [walletAddress, connectWallet]);

  // Fetch all data from the contract
  const fetchContractData = async (contractInstance: ethers.Contract) => {
    try {
      setLoading(true);

      // Fetch voting threshold
      try {
        const threshold = await contractInstance.votingThreshold();
        setVotingThreshold(threshold);
      } catch (error) {
        console.error("Error fetching voting threshold:", error);
        setVotingThreshold(3); // Default threshold if error
      }

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
          voteCount: milestone.voteCount,
          progress:
            (Number.parseFloat(formatEther(milestone.currentAmount)) /
              Number.parseFloat(formatEther(milestone.targetAmount))) *
            100,
          // Add project title - in a real app, this would come from the contract
          projectTitle: "Placeholder Project",
          proofOfWork: {
            photos: [
              "https://images.pexels.com/photos/933624/pexels-photo-933624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
              "https://images.pexels.com/photos/933624/pexels-photo-933624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            ],
            videos: [
              "https://videos.pexels.com/video-files/6740283/6740283-uhd_2560_1440_30fps.mp4",
            ],
          },
        }
      })

      // Sort milestones by ID to ensure sequential order
      formattedMilestones.sort((a, b) => a.id - b.id);
      setMilestones(formattedMilestones);

      // Determine the active milestone (first unreleased milestone)
      const activeIndex = formattedMilestones.findIndex((m) => !m.released);
      setActiveMilestoneId(
        activeIndex !== -1 ? formattedMilestones[activeIndex].id : -1
      );

      // Calculate total target and raised amounts
      let totalTarget = 0;
      let totalRaised = 0;

      formattedMilestones.forEach((milestone) => {
        totalTarget += Number(milestone.targetAmount);
        totalRaised += Number(milestone.currentAmount);
      });

      setTargetAmount(totalTarget);
      setTotalRaised(totalRaised);

      // Fetch recent transactions
      await fetchTransactionHistory(contractInstance);

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

  // Fetch transaction history
  const fetchTransactionHistory = async (contractInstance: ethers.Contract) => {
    try {
      // For this example, we'll use Etherscan API in a real implementation
      // Here we'll create some mock transactions based on milestone data
      const mockTransactions = [];

      for (let i = 0; i < 5; i++) {
        mockTransactions.push({
          hash: `0x${Math.random()
            .toString(16)
            .substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
          from: `0x${Math.random()
            .toString(16)
            .substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
          value: (Math.random() * 2).toFixed(4),
          timestamp: new Date(
            Date.now() - Math.random() * 10000000
          ).toLocaleString(),
        });
      }

      setTransactions(mockTransactions);
    } catch (error) {
      console.error("Error fetching transaction history:", error);
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

  // Donate to a milestone
  const donateToMilestone = async (milestoneId: number) => {
    if (!contract || !signer) return;

    try {
      const amount = donationAmount[milestoneId];
      if (!amount || Number.parseFloat(amount) <= 0) {
        toast("Invalid Amount", {
          description: "Please enter a valid donation amount.",
        });
        return;
      }

      setIsProcessing(true);

      const tx = await contract.donateToMilestone(milestoneId, {
        value: parseEther(amount),
      });

      toast("Donation Processing", {
        description:
          "Your donation is being processed. Please wait for confirmation.",
      });

      const receipt = await tx.wait();

      toast("Donation Successful", {
        description: `Successfully donated ${amount} ETH to milestone: ${milestones[milestoneId].description}`,
      });

      // Reset donation amount and refresh data
      setDonationAmount({ ...donationAmount, [milestoneId]: "" });
      await fetchContractData(contract);

      setTransactionResult({
        status: "success",
        message: `Successfully donated ${amount} ETH to milestone: ${milestones[milestoneId].description}`,
        txHash: receipt.transactionHash,
      });
    } catch (error) {
      console.error("Donation error:", error);
      toast("Donation Failed", {
        description: "Failed to process your donation. Please try again.",
      });

      setTransactionResult({
        status: "error",
        message:
          (error as any).reason || "Transaction failed. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Vote to release funds for a milestone
  const voteToRelease = async (milestoneId: number) => {
    if (!contract || !signer || !isCommittee) return;

    try {
      setIsProcessing(true);

      const tx = await contract.voteToRelease(milestoneId);

      toast("Vote Processing", {
        description:
          "Your vote is being processed. Please wait for confirmation.",
      });

      const receipt = await tx.wait();

      toast("Vote Successful", {
        description: `Successfully voted to release funds for milestone: ${milestones[milestoneId].description}`,
      });

      await fetchContractData(contract);

      setTransactionResult({
        status: "success",
        message: `Successfully voted to release funds for milestone: ${milestones[milestoneId].description}`,
        txHash: receipt.transactionHash,
      });
    } catch (error) {
      console.error("Voting error:", error);
      toast("Vote Failed", {
        description: "Failed to process your vote. Please try again.",
      });

      setTransactionResult({
        status: "error",
        message:
          (error as any)?.reason || "Transaction failed. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Open donation modal
  const openDonationModal = (milestone: any) => {
    setSelectedMilestone(milestone);
    setModalDonationAmount("");
    setTransactionResult({ status: null, message: "" });
    setModalOpen(true);
  };

  // Handle modal donation
  const handleModalDonation = async () => {
    if (
      !selectedMilestone ||
      !modalDonationAmount ||
      Number(modalDonationAmount) <= 0
    ) {
      setTransactionResult({
        status: "error",
        message: "Please enter a valid donation amount.",
      });
      return;
    }

    if (!contract || !signer) {
      setTransactionResult({
        status: "error",
        message: "Wallet not connected. Please connect your wallet first.",
      });
      return;
    }

    try {
      setIsProcessing(true);

      const tx = await contract.donateToMilestone(selectedMilestone.id, {
        value: parseEther(modalDonationAmount),
      });

      const receipt = await tx.wait();

      // Reset donation amount and refresh data
      await fetchContractData(contract);

      setTransactionResult({
        status: "success",
        message: `Successfully donated ${modalDonationAmount} ETH to milestone: ${selectedMilestone.description}`,
        txHash: receipt.transactionHash,
      });
    } catch (error) {
      console.error("Donation error:", error);

      setTransactionResult({
        status: "error",
        message:
          (error as any)?.reason || "Transaction failed. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Connect on component mount if wallet is already connected
  useEffect(() => {
    if (window.ethereum) {
      connectWallet();
    }
  }, []);

  // Group milestones by project title
  const milestonesByProject = milestones.reduce((acc, milestone) => {
    if (!acc[milestone.projectTitle]) {
      acc[milestone.projectTitle] = [];
    }
    acc[milestone.projectTitle].push(milestone);
    return acc;
  }, {});

  return (
    <div className="min-h-screen pt-24 pb-8 px-6 bg-zinc-50 dark:bg-zinc-950">
      {/* Organization Banner */}
      <div className="container mx-auto px-6 pt-5">
        <div className="flex items-center flex-wrap gap-3 mb-4 p-4 rounded-lg border border-blue-400 dark:border-blue-700 bg-gradient-to-r from-blue-500 to-blue-600 shadow-sm">
          <div className="flex items-center">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm p-2 rounded-full mr-3">
              <Building className="h-5 w-5 text-blue-100" />
            </div>
            <div>
              <div className="text-xs text-blue-100 mb-0.5 font-medium">
                Organization
              </div>
              <span className="font-semibold text-white">
                Charity Milestone DAO
              </span>
            </div>
          </div>

          <a
            href="https://github.com/charity-milestone-dao"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center ml-auto px-3 py-1.5 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm text-white text-sm transition-colors duration-200"
          >
            <span className="text-blue-500">View GitHub</span>
            <ExternalLink className="h-3 w-3 ml-1.5 text-blue-500" />
          </a>
        </div>
      </div>

      {/* Shariah compliance badge */}
      <div className="container mx-auto px-6 pt-2">
        <div className="flex items-center flex-wrap gap-3 mb-4 p-4 rounded-lg border border-green-400 dark:border-green-700 bg-gradient-to-r from-green-500 to-green-600 shadow-sm">
          <div className="flex items-center">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm p-2 rounded-full mr-3">
              <MoonStar className="h-5 w-5 text-green-100" />
            </div>
            <div>
              <div className="text-xs text-green-100 mb-0.5 font-medium">
                Certification
              </div>
              <span className="font-semibold text-white">
                Shariah Compliant
              </span>
            </div>
          </div>

          <a
            href="#shariah-info"
            className="flex items-center ml-auto px-3 py-1.5 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm text-white text-sm transition-colors duration-200"
          >
            <span className="text-blue-500">Learn More</span>
            <BookOpen className="h-3 w-3 ml-1.5 text-blue-500" />
          </a>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <motion.div
          className="text-center max-w-4xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-block mb-4 px-4 py-1 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full text-white text-sm font-medium"
          >
            Blockchain-Powered Charity
          </motion.div>

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
          {/* 
          {!account && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <ConnectWallet onConnect={connectWallet} />
            </motion.div>
          )} */}

          {account && (
            <motion.div
              className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-md border border-blue-100 inline-block"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-800 font-medium">
                  Connected: {account.slice(0, 6)}...{account.slice(-4)}
                </span>
                {isCommittee && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    Committee Member
                  </span>
                )}
                {isOwner && (
                  <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                    Owner
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Campaign Progress Card */}
        <div className="mb-12">
          <Card className="bg-white/90 backdrop-blur-sm border border-blue-100 overflow-hidden">
            <div className="relative">
              <img
                src="/community.jpg"
                alt="Campaign Banner"
                className="h-[200px] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Badge className="bg-blue-600 rounded-full px-3 py-1 text-xs font-medium">
                      Active Campaign
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-black/30 text-white border-white/20 rounded-full px-3 py-1 text-xs font-medium"
                    >
                      Goal: {targetAmount * ethToMyrRate} MYR ({targetAmount.toFixed(2)} ETH)
                    </Badge>
                  </div>
                  <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
                    Community Support Initiative
                  </h1>
                  <p className="text-zinc-200 text-sm max-w-3xl">
                    A transparent, milestone-based charity project to support
                    community development initiatives.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-5 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center dark:bg-blue-900/30">
                    <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="font-medium text-zinc-900 dark:text-zinc-100">
                      Raised so far
                    </div>
                    <div className="text-sm text-zinc-500 dark:text-zinc-400">
                      {Math.min(
                        Math.round((totalRaised / targetAmount) * 100),
                        100
                      )}
                      % of goal
                    </div>
                  </div>
                </div>
                <div className="text-right">
                <div className="font-mono text-lg font-medium text-blue-700 dark:text-blue-400">
                    {myrValues.totalRaised.toLocaleString()} MYR
                  </div>
                  <div className="text-xs text-zinc-500">≈ {totalRaised.toFixed(4)} ETH</div>
                </div>
              </div>
              <Progress
                value={Math.min(
                  Math.round((totalRaised / targetAmount) * 100),
                  100
                )}
                className="h-2 mt-2 bg-zinc-100 dark:bg-zinc-800"
              />
            </div>
          </Card>
        </div>

        {/* Sequential Milestone Information */}
        <div className="mb-8">
          <Alert className="bg-blue-50 border-blue-200">
            <AlertTriangle className="h-5 w-5 text-blue-600" />
            <AlertTitle>Sequential Milestone Funding</AlertTitle>
            <AlertDescription>
              Milestones are funded sequentially. Only the active milestone can
              receive donations. Each milestone requires {votingThreshold}{" "}
              committee votes to be released before the next milestone becomes
              active.
            </AlertDescription>
          </Alert>
        </div>

        {/* Committee Voting Link for Committee Members */}
        {isCommittee && (
          <div className="mb-8">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Vote className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">
                        Committee Voting Panel
                      </h3>
                      <p className="text-sm text-gray-600">
                        As a committee member, you can vote on milestone
                        releases
                      </p>
                    </div>
                  </div>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => (window.location.href = "/committee-voting")}
                  >
                    Go to Voting Panel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
  <Dialog open={proofOfWorkModalOpen} onOpenChange={setProofOfWorkModalOpen}>
  <DialogContent className="sm:max-w-lg">
  <DialogHeader>
  <DialogTitle>Proof of Work</DialogTitle>
  <DialogDescription>
    Below is the submitted media proof for this milestone.
  </DialogDescription>
</DialogHeader>

<div className="space-y-4 mt-4">
  {selectedProofOfWork?.photos?.length > 0 && (
    <div>
      <h4 className="text-sm font-medium">Photos</h4>
      <div className="grid grid-cols-2 gap-4">
        {selectedProofOfWork.photos.map((photo: string, index: number) => (
          <img
            key={index}
            src={photo}
            alt={`Proof of Work Photo ${index + 1}`}
            className="rounded-lg shadow-md"
          />
        ))}
      </div>
    </div>
  )}

  {selectedProofOfWork?.videos?.length > 0 && (
    <div>
      <h4 className="text-sm font-medium">Videos</h4>
      <div className="space-y-2">
        {selectedProofOfWork.videos.map((video: string, index: number) => (
          <video
            key={index}
            controls
            src={video}
            className="w-full rounded-lg shadow-md"
          />
        ))}
      </div>
    </div>
  )}

  {!selectedProofOfWork && (
    <span className="text-sm text-gray-500">
      No proof of work available for this milestone.
    </span>
  )}
</div>

  </DialogContent>
</Dialog>

        {/* Milestones Section */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">
              Active Charity Milestones
            </h2>
            {isOwner && (
              <Button className="bg-blue-600 hover:bg-blue-700">
                <span className="flex items-center gap-2">
                  Create New Milestone
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Button>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : milestones.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-sm border border-blue-100">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
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
            // Display milestones grouped by project
            Object.entries(milestonesByProject as Record<string, any[]>).map(
              ([projectTitle, projectMilestones]) => (
                <div key={projectTitle} className="mb-12">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">
                    {projectTitle}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(projectMilestones as any[]).map((milestone, index) => (
                      <motion.div
                        key={milestone.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Card
                          className={`bg-white/90 backdrop-blur-sm border ${
                            activeMilestoneId === milestone.id
                              ? "border-green-300 ring-2 ring-green-300 ring-opacity-50"
                              : milestone.released
                              ? "border-gray-200"
                              : "border-blue-100"
                          } overflow-hidden h-full flex flex-col relative`}
                        >
                          {/* Sequential indicator */}
                          {activeMilestoneId === milestone.id && (
                            <div className="absolute top-0 right-0 left-0 bg-green-500 text-white text-xs font-medium text-center py-1">
                              ACTIVE MILESTONE
                            </div>
                          )}
                          {activeMilestoneId !== -1 &&
                            milestone.id > activeMilestoneId && (
                              <div className="absolute top-0 right-0 left-0 bg-gray-500 text-white text-xs font-medium text-center py-1">
                                LOCKED
                              </div>
                            )}

                        <CardHeader
                          className={`pb-2 ${activeMilestoneId !== -1 && activeMilestoneId === milestone.id ? "pt-8" : activeMilestoneId !== -1 && milestone.id > activeMilestoneId ? "pt-8 opacity-70" : ""}`}
                        >
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-xl">{milestone.description}</CardTitle>
                            {milestone.released ? (
                              <Badge className="bg-green-500">Completed</Badge>
                            ) : activeMilestoneId === milestone.id ? (
                              <Badge className="bg-blue-500">Active</Badge>
                            ) : milestone.id > activeMilestoneId ? (
                              <Badge variant="outline" className="bg-gray-100 text-gray-500 border-gray-300">
                                <Lock className="h-3 w-3 mr-1" />
                                Locked
                              </Badge>
                            ) : (
                              <Badge className="bg-yellow-500">Pending Release</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-1 mt-1 mb-2">
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
                            >
                              <BadgeCheck className="h-3 w-3" />
                              Shariah Compliant
                            </Badge>
                          </div>
                          <CardDescription className="space-y-2">
                                                        <div>
                                                          <span className="font-medium">Service Provider:</span> {milestone.serviceProviderName}
                                                        </div>
                                                        <div className="text-xs text-gray-500 font-mono">
                                                          Address: {milestone.serviceProvider.substring(0, 6)}...
                                                          {milestone.serviceProvider.substring(38)}
                                                        </div>
                                                        <Button variant="outline" size="sm" className="mt-2 text-xs cursor-pointer">
                                                          <Users className="h-3 w-3 mr-1" />
                                                          View Provider Profile
                                                        </Button>
                                                      </CardDescription>
                        </CardHeader>
                        <CardContent className={`flex-grow ${milestone.id > activeMilestoneId ? "opacity-70" : ""}`}>
                          <div className="mb-4">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span>{milestone.progress.toFixed(0)}%</span>
                            </div>
                            <Progress value={milestone.progress} className="h-2" />
                          </div>
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="bg-blue-50 p-3 rounded-lg">
                              <div className="text-xs text-gray-500">Target</div>
                              <div className="font-semibold flex items-center">
                                <DollarSign className="h-4 w-4 text-blue-600 mr-1" />
                                {(Number(milestone.targetAmount) * ethToMyrRate).toLocaleString()} MYR
                              </div>
                              <div className="text-xs text-gray-500">≈ {milestone.targetAmount} ETH</div>
                            </div>
                            <div className="bg-blue-50 p-3 rounded-lg">
                              <div className="text-xs text-gray-500">Raised</div>
                              <div className="font-semibold flex items-center">
                              <DollarSign className="h-4 w-4 text-blue-600 mr-1" />
                                {(Number(milestone.currentAmount) * ethToMyrRate).toLocaleString()} MYR
                              </div>
                              <div className="text-xs text-gray-500">≈ {milestone.currentAmount} ETH
                              </div>
                            </div>
                          </div>
                          <div className="bg-blue-50 p-3 rounded-lg mb-4">
                            <div className="text-xs text-gray-500">Committee Votes</div>
                            <div className="font-semibold flex items-center">
                              <Users className="h-4 w-4 text-blue-600 mr-1" />
                              {milestone.voteCount} of {votingThreshold} vote(s)
                            </div>
                            {milestone.voteCount > 0 && !milestone.released && (
                              <Progress
                              value={(Number(milestone.voteCount) / Number(votingThreshold)) * 100}
                              className="h-1 mt-2"
                            />
                            )}
                          </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-3 pt-0">
                          {!milestone.released && activeMilestoneId === milestone.id && (
                            <>
                              <Button
                                className="w-full bg-blue-600 hover:bg-blue-700"
                                onClick={() => openDonationModal(milestone)}
                                disabled={!account}
                              >
                                Donate to This Milestone
                              </Button>
                              <Button
                                      variant="outline"
                                      className="w-full border-green-600 text-green-700 hover:bg-green-50 cursor-pointer"
                                      onClick={() => {
                                        setSelectedProofOfWork(milestone.proofOfWork); // Set proof of work data
                                        setProofOfWorkModalOpen(true); // Open modal
                                      }}
                                    >
                                      <ExternalLink className="h-4 w-4 mr-2 " />
                                      View Proof of Work
                                    </Button>

                              {isCommittee && (
                                <Button
                                  variant="outline"
                                  className="w-full border-blue-600 text-blue-700 hover:bg-blue-50"
                                  onClick={() => voteToRelease(milestone.id)}
                                >
                                  <Vote className="h-4 w-4 mr-2" />
                                  Vote to Release
                                </Button>
                              )}
                            </>
                          )}
                          {!milestone.released &&
                            activeMilestoneId !== milestone.id &&
                            milestone.id < activeMilestoneId && (
                              <div className="flex items-center justify-center w-full p-2 bg-yellow-50 rounded-lg text-yellow-700">
                                <Clock className="h-4 w-4 mr-2" />
                                Waiting for Committee Votes ({milestone.voteCount}/{votingThreshold})
                              </div>
                            )}
                          {!milestone.released && activeMilestoneId !== -1 && milestone.id > activeMilestoneId && (
                            <div className="flex items-center justify-center w-full p-2 bg-gray-50 rounded-lg text-gray-500">
                              <Lock className="h-4 w-4 mr-2" />
                              Locked Until Previous Milestones Complete
                            </div>
                          )}
                          {milestone.released && (

                                    <div className="flex items-center justify-center w-full p-2 bg-green-50 rounded-lg text-green-700">
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Funds Released Successfully
                                    </div>
                                )}
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Transaction History */}
        <Card className="bg-white/90 backdrop-blur-sm border border-blue-100 mb-12">
          <CardHeader>
            <CardTitle className="text-xl font-medium">
              Recent Transactions
            </CardTitle>
            <CardDescription>
              Latest donations to charity milestones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Transaction
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      From
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Amount
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No transactions yet
                      </td>
                    </tr>
                  ) : (
                    transactions.map((tx, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <a
                            href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center hover:text-blue-600"
                          >
                            <span className="font-mono">{tx.hash}</span>
                            <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                          {tx.from}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                          <div className="font-mono font-medium">
                            {tx.value} ETH
                          </div>
                          <div className="text-xs text-gray-500">
                            ≈{" "}
                            {(Number(tx.value) * ethToMyrRate).toLocaleString()}{" "}
                            MYR
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                          {tx.timestamp}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Shariah Compliance Information */}
        <div id="shariah-info" className="mb-12">
          <Card className="bg-white/90 backdrop-blur-sm border border-green-100">
            <CardHeader>
              <CardTitle className="text-xl font-medium flex items-center">
                <MoonStar className="h-6 w-6 text-green-600 mr-2" />
                Shariah Compliance Information
              </CardTitle>
              <CardDescription>
                Understanding how our charity projects adhere to Islamic
                principles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-start mb-2">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <Scale className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-green-800">Riba-Free</h3>
                      <p className="text-sm text-green-700">
                        All projects are free from interest-based transactions
                        (riba) and comply with Islamic finance principles.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-start mb-2">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <BadgeCheck className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-green-800">
                        Certified Projects
                      </h3>
                      <p className="text-sm text-green-700">
                        All charity milestones are reviewed and certified by
                        qualified Shariah advisors.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-green-800 mb-2">
                  Donation Types
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-3 rounded-md border border-green-100">
                    <h4 className="font-medium text-green-700 flex items-center">
                      <Leaf className="h-4 w-4 mr-1" /> Sadaqah
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Voluntary charitable giving that can be directed to any of
                      our projects.
                    </p>
                  </div>

                  <div className="bg-white p-3 rounded-md border border-green-100">
                    <h4 className="font-medium text-green-700 flex items-center">
                      <Leaf className="h-4 w-4 mr-1" /> Zakat
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Obligatory alms that can be directed to eligible projects
                      marked with Zakat-eligible badge.
                    </p>
                  </div>

                  <div className="bg-white p-3 rounded-md border border-green-100">
                    <h4 className="font-medium text-green-700 flex items-center">
                      <Leaf className="h-4 w-4 mr-1" /> Waqf
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Endowment funds that provide sustainable support for
                      long-term community projects.
                    </p>
                  </div>
                </div>
              </div>

              <Alert className="bg-green-50 border-green-200">
                <BookOpen className="h-5 w-5 text-green-600" />
                <AlertTitle>Shariah Advisory Board</AlertTitle>
                <AlertDescription>
                  Our projects are regularly reviewed by a panel of qualified
                  Shariah scholars to ensure compliance with Islamic principles.
                  The board verifies that all funds are used in accordance with
                  Shariah guidelines and that projects avoid prohibited
                  activities.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>

        {/* Security and Verification Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Wallet Security Check */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-blue-100">
            <div className="flex items-start">
              <div className="bg-blue-50 p-3 rounded-full mr-4">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Wallet Security Check
                </h3>
                <p className="text-gray-600 mb-4">
                  Verify the security of service provider wallets before
                  donating to ensure your funds go to legitimate recipients.
                </p>
                <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                  Verify Wallet Security
                </Button>
              </div>
            </div>
          </div>

          {/* Committee Verification */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-blue-100">
            <div className="flex items-start">
              <div className="bg-blue-50 p-3 rounded-full mr-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Committee Members
                </h3>
                <p className="text-gray-600 mb-4">
                  Learn about our committee members who verify and approve
                  milestone completions for fund releases.
                </p>
                <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                  View Committee
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Donation Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Make a Donation</DialogTitle>
            <DialogDescription>
              {selectedMilestone &&
                `Support milestone: ${selectedMilestone.description}`}
            </DialogDescription>
          </DialogHeader>

          {!isProcessing && transactionResult.status === null && (
            <>
              <div className="space-y-4 py-4">
                {selectedMilestone && (
                  <div className="rounded-md bg-blue-50 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Target Amount</span>
                      <div className="text-right">
                        <span className="font-mono text-sm">
                          {selectedMilestone.targetAmount} ETH
                        </span>
                        <div className="text-xs text-zinc-500">
                          ≈{" "}
                          {(
                            Number(selectedMilestone.targetAmount) *
                            ethToMyrRate
                          ).toLocaleString()}{" "}
                          MYR
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        Current Amount
                      </span>
                      <div className="text-right">
                        <span className="font-mono text-sm">
                          {selectedMilestone.currentAmount} ETH
                        </span>
                        <div className="text-xs text-zinc-500">
                          ≈{" "}
                          {(
                            Number(selectedMilestone.currentAmount) *
                            ethToMyrRate
                          ).toLocaleString()}{" "}
                          MYR
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-sm font-medium">Needed</span>
                      <div className="text-right">
                        <span className="font-mono text-sm font-bold">
                          {(
                            Number(selectedMilestone.targetAmount) -
                            Number(selectedMilestone.currentAmount)
                          ).toFixed(4)}{" "}
                          ETH
                        </span>
                        <div className="text-xs text-zinc-500">
                          ≈{" "}
                          {(
                            (Number(selectedMilestone.targetAmount) -
                              Number(selectedMilestone.currentAmount)) *
                            ethToMyrRate
                          ).toLocaleString()}{" "}
                          MYR
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label
                    htmlFor="amount"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Donation Amount (ETH)
                  </label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    value={modalDonationAmount}
                    onChange={(e) => setModalDonationAmount(e.target.value)}
                    className="font-mono"
                  />
                  {modalDonationAmount && (
                    <div className="text-sm text-zinc-500">
                      ≈{" "}
                      {(
                        Number(modalDonationAmount) * ethToMyrRate
                      ).toLocaleString()}{" "}
                      MYR
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="donation-type"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Donation Type
                  </label>
                  <select
                    id="donation-type"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="sadaqah">Sadaqah (Voluntary Charity)</option>
                    <option value="zakat">Zakat (Obligatory Alms)</option>
                    <option value="waqf">Waqf (Endowment)</option>
                  </select>
                  <div className="text-xs text-gray-500 flex items-center mt-1">
                    <BadgeCheck className="h-3 w-3 text-green-600 mr-1" />
                    All donation types are Shariah compliant
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleModalDonation}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Donate
                </Button>
              </DialogFooter>
            </>
          )}

          {isProcessing && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
              <p className="text-center font-medium">
                Processing your donation...
              </p>
              <p className="text-center text-sm text-muted-foreground mt-2">
                Please confirm the transaction in your wallet and wait for it to
                be processed.
              </p>
            </div>
          )}

          {!isProcessing && transactionResult.status === "success" && (
            <div className="py-6">
              <Alert className="bg-green-50 text-green-900 border-green-200 dark:bg-green-950 dark:text-green-100 dark:border-green-800">
                <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                <AlertTitle>Donation Successful!</AlertTitle>
                <AlertDescription>
                  <p>{transactionResult.message}</p>
                  {transactionResult.txHash && (
                    <div className="mt-2">
                      <a
                        href={`https://sepolia.etherscan.io/tx/${transactionResult.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-green-700 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 text-sm font-medium"
                      >
                        View transaction
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
              <div className="mt-6 flex justify-end">
                <Button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Close
                </Button>
              </div>
            </div>
          )}

          {!isProcessing && transactionResult.status === "error" && (
            <div className="py-6">
              <Alert className="bg-red-50 text-red-900 border-red-200 dark:bg-red-950 dark:text-red-100 dark:border-red-800">
                <X className="h-5 w-5 text-red-600 dark:text-red-400" />
                <AlertTitle>Transaction Failed</AlertTitle>
                <AlertDescription>{transactionResult.message}</AlertDescription>
              </Alert>
              <div className="mt-6 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setTransactionResult({ status: null, message: "" })
                  }
                >
                  Try Again
                </Button>
                <Button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  variant="destructive"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <CharityChat />
    </div>
  );
}
