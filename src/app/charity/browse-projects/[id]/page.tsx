"use client";

import { useState, useEffect, useRef } from "react";
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
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
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
  Building,
  Lock,
  AlertTriangle,
  BadgeCheck,
  BookOpen,
  Leaf,
  MoonStar,
  Receipt,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import HalalChecker from "@/components/HalalChecker";
import Description from "@/components/description-component";
import CampaignProgressCard from "@/components/campaign-process-card";
import supabase from "@/utils/supabase/client";
import { useParams } from "next/navigation";
import SmartContractTransaction from "@/components/smart-contract-transaction";
import { EthereumLivePrice } from "@/utils/ethLivePrice";

export default function CharityPage() {
  const params = useParams();
  const id = params.id;
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
  const [targetAmount, setTargetAmount] = useState(10);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [ethToMyrRate, setEthToMyrRate] = useState(7200);
  const [rateLoading, setRateLoading] = useState(true);
  const [myrValues, setMyrValues] = useState({
    totalRaised: 0,
    targetAmount: 0,
    remainingAmount: 0,
  });
  const [votingThreshold, setVotingThreshold] = useState(0);
  const [activeMilestoneId, setActiveMilestoneId] = useState<number>(-1);
  const [proofOfWorkModalOpen, setProofOfWorkModalOpen] = useState(false);
  const [selectedProofOfWork, setSelectedProofOfWork] = useState<any>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<any>(null);
  const [modalDonationAmount, setModalDonationAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionResult, setTransactionResult] = useState<{
    status: "success" | "error" | null;
    message: string;
    txHash?: string;
    amount?: string;
  }>({ status: null, message: "" });

  const milestonesRef = useRef<HTMLDivElement>(null);

  const [projectTitle, setProjectTitle] = useState<string>("");
  const [projectDescription, setProjectDescription] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([""]);
  const [contractAddress, setContractAddress] = useState<string>("");
  const [overview, setOverview] = useState<string[]>([]);
  const [objectives, setObjectives] = useState<string[]>([]);
  const [impact, setImpact] = useState<
    { icon: string; title: string; subtitle: string }[]
  >([]);
  const [timeline, setTimeline] = useState<
    { step: number; color: string; title: string; desc: string }[]
  >([]);

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const smoothScrollY = useSpring(scrollYProgress, {
    damping: 50,
    stiffness: 400,
  });
  const y1 = useTransform(smoothScrollY, [0, 1], [0, -100]);
  const y2 = useTransform(smoothScrollY, [0, 1], [0, -200]);
  const y3 = useTransform(smoothScrollY, [0, 1], [0, -50]);
  const scale = useTransform(smoothScrollY, [0, 0.5], [1, 0.5]);
  const opacity = useTransform(smoothScrollY, [0, 0.8], [1, 0.6]);

  const convertEthToMyr = (ethAmount) => {
    return Number(ethAmount) * ethToMyrRate;
  };

  useEffect(() => {
    if (id) {
      const fetchProjectDetails = async () => {
        try {
          const { data, error } = await supabase
            .from("charity_projects")
            .select("*")
            .eq("id", id)
            .single();
          if (error) {
            console.error("Error fetching project details:", error);
            setProjectTitle("Unknown Project");
          } else {
            console.log("Successful fetching project details:", data);
            setProjectTitle(data?.title || "Unknown Project");
            setProjectDescription(data?.description || "");
            setImage(data?.image || "/charity.jpg");
            setCategories(data?.category || [""]);
            setContractAddress(data?.smart_contract_address || "");
            setOverview(data?.overview || []);
            setObjectives(data?.objective || []);
            setImpact(data?.impact_stats || []);
            setTimeline(data?.timeline || []);
          }
          console.log("Smart Contract Address:", data?.smart_contract_address);
        } catch (err) {
          console.error("Error fetching project details:", err);
          setProjectTitle("Unknown Project");
        }
      };

      fetchProjectDetails();
    }
  }, [id]);

  async function fetchEthToMyrRate() {
    try {
      setRateLoading(true);
      const ethPriceInMyr = await EthereumLivePrice();
      setEthToMyrRate(ethPriceInMyr);
      console.log("Current ETH to MYR rate:", ethPriceInMyr);

      if (totalRaised && targetAmount) {
        updateMyrValues(totalRaised, targetAmount);
      }
    } catch (error) {
      console.error("Error fetching ETH to MYR rate:", error);
    } finally {
      setRateLoading(false);
    }
  }

  const updateMyrValues = (raised, target) => {
    const remainingAmount = Math.max(target - raised, 0);

    setMyrValues({
      totalRaised: convertEthToMyr(raised),
      targetAmount: convertEthToMyr(target),
      remainingAmount: convertEthToMyr(remainingAmount),
    });
  };

  useEffect(() => {
    fetchEthToMyrRate();
    const intervalId = setInterval(fetchEthToMyrRate, 300000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const initialize = async () => {
      if (signer && provider && contractAddress) {
        try {
          const charityContract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
          );
          setContract(charityContract);
          console.log("Contract initialized:", charityContract.address);

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

    const timeout = setTimeout(() => {
      initialize();
    }, 500);

    return () => clearTimeout(timeout);
  }, [signer, provider, contractAddress]);

  useEffect(() => {
    if (!walletAddress) {
      const savedAddress = localStorage.getItem("walletAddress");
      if (savedAddress) {
        console.log("Auto-connecting wallet...");
        setAccount(savedAddress);
      }
    }
  }, [walletAddress, connectWallet]);

  const fetchContractData = async (contractInstance: ethers.Contract) => {
    try {
      setLoading(true);

      try {
        const threshold = await contractInstance.votingThreshold();
        setVotingThreshold(threshold);
      } catch (error) {
        console.error("Error fetching voting threshold:", error);
        setVotingThreshold(2);
      }

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
          projectTitle: projectTitle,
          image: image,
          proofOfWork: {
            photos: [
              "https://images.pexels.com/photos/5802822/pexels-photo-5802822.jpeg?auto=compress&cs=tinysrgb&w=600",
              "https://images.pexels.com/photos/27269603/pexels-photo-27269603/free-photo-of-a-small-drone-laying-on-the-ground.jpeg?auto=compress&cs=tinysrgb&w=600",
            ],
            videos: [
              "https://videos.pexels.com/video-files/20731378/20731378-sd_640_360_30fps.mp4",
            ],
          },
        };
      });

      formattedMilestones.sort((a, b) => a.id - b.id);
      setMilestones(formattedMilestones);

      const activeIndex = formattedMilestones.findIndex((m) => !m.released);
      setActiveMilestoneId(
        activeIndex !== -1 ? formattedMilestones[activeIndex].id : -1
      );

      let totalTarget = 0;
      let totalRaised = 0;

      formattedMilestones.forEach((milestone) => {
        totalTarget += Number(milestone.targetAmount);
        totalRaised += Number(milestone.currentAmount);
      });

      setTargetAmount(totalTarget);
      setTotalRaised(totalRaised);

      updateMyrValues(totalRaised, totalTarget);

      await fetchTransactionHistory(contractInstance);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching contract data:", error);
      toast("Error", {
        description: "Failed to load milestone data. Please try again.",
      });
      setLoading(false);
    }
  };

  const fetchTransactionHistory = async (contractInstance: ethers.Contract) => {
    try {
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

      setDonationAmount({ ...donationAmount, [milestoneId]: "" });
      await fetchContractData(contract);

      setTransactionResult({
        status: "success",
        message: `Successfully donated ${amount} ETH to milestone: ${milestones[milestoneId].description}`,
        txHash: receipt.transactionHash,
        amount: amount,
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

  const openDonationModal = (milestone: any) => {
    setSelectedMilestone(milestone);
    setModalDonationAmount("");
    setTransactionResult({ status: null, message: "" });
    setModalOpen(true);
  };

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

      await fetchContractData(contract);

      setTransactionResult({
        status: "success",
        message: `Successfully donated ${modalDonationAmount} ETH to milestone: ${selectedMilestone.description}`,
        txHash: receipt.transactionHash,
        amount: modalDonationAmount,
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

  const navigateToTaxReceipt = () => {
    try {
      const mockTransaction = {
        txHash: `0x${Math.random().toString(16).substring(2, 42)}`,
        amount: modalDonationAmount || "1.0",
      };

      const txData = {
        txHash: transactionResult.txHash || mockTransaction.txHash,
        amount: transactionResult.amount || mockTransaction.amount,
        amountMYR: convertEthToMyr(
          transactionResult.amount || mockTransaction.amount
        ),
        date: new Date().toISOString(),
        milestoneDescription:
          selectedMilestone?.description || "General Donation",
        projectTitle:
          selectedMilestone?.projectTitle ||
          "Education for Kids in Rural Areas",
      };

      console.log("Storing donation data:", txData);
      localStorage.setItem("donationDetails", JSON.stringify(txData));

      setModalOpen(false);

      window.location.href = "/charity/tax-receipt";
    } catch (error) {
      console.error("Error navigating to tax receipt:", error);
      toast("Navigation Error", {
        description:
          "Failed to navigate to tax receipt page. Please try again.",
      });
    }
  };

  const scrollToMilestones = () => {
    milestonesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (window.ethereum) {
      connectWallet();
    }
  }, []);

  const milestonesByProject = milestones.reduce((acc, milestone) => {
    if (!acc[milestone.projectTitle]) {
      acc[milestone.projectTitle] = [];
    }
    acc[milestone.projectTitle].push(milestone);
    return acc;
  }, {});

  return (
    <div
      className="min-h-screen pt-8 pb-8 px-6 bg-zinc-50 dark:bg-zinc-950 overflow-hidden relative"
      ref={containerRef}
    >
      <motion.div
        className="absolute top-20 left-[10%] w-64 h-64 bg-blue-300/10 rounded-full blur-3xl -z-10"
        style={{ y: y1 }}
      />
      <motion.div
        className="absolute top-40 right-[15%] w-96 h-96 bg-green-300/10 rounded-full blur-3xl -z-10"
        style={{ y: y2 }}
      />
      <motion.div
        className="absolute bottom-20 left-[25%] w-80 h-80 bg-purple-300/10 rounded-full blur-3xl -z-10"
        style={{ y: y3 }}
      />

      <div className="container mx-auto px-4 py-12 relative z-10">
        <motion.div
          className="text-center max-w-4xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{ scale, opacity }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-block mb-4 px-4 py-1 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full text-white text-sm font-medium"
          >
            Blockchain-Powered Charity
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="flex justify-center mb-6 relative"
            style={{ y: useTransform(smoothScrollY, [0, 1], [0, -30]) }}
          >
            <motion.img
              src="/icons/milestonebased.svg"
              alt="Milestone Icon"
              className="h-56 w-h-56 relative z-10"
              whileHover={{
                y: -5,
                scale: 1.03,
                transition: { duration: 0.2, type: "spring", stiffness: 300 },
              }}
              animate={{
                y: [0, -10, 0],
                transition: {
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut",
                },
              }}
            />
            <motion.div
              className="absolute top-1/2 w-40 h-40 bg-blue-400/20 rounded-full blur-xl -z-10"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.7, 0.5],
                transition: {
                  repeat: Infinity,
                  duration: 4,
                  ease: "easeInOut",
                },
              }}
            />
          </motion.div>

          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-800 to-blue-900 leading-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            style={{ y: useTransform(smoothScrollY, [0, 1], [0, -20]) }}
          >
            Milestone-Based Charity Projects
          </motion.h1>

          <motion.p
            className="text-lg text-gray-600 max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            style={{ y: useTransform(smoothScrollY, [0, 1], [0, -10]) }}
          >
            Support verified charity projects with transparent milestone
            tracking. Every donation is securely recorded on the blockchain.
          </motion.p>

          {account && (
            <motion.div
              className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-md border border-blue-100 inline-block"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              whileHover={{
                y: -5,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div className="flex items-center gap-2">
                <motion.div
                  className="h-3 w-3 bg-green-500 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    transition: { repeat: Infinity, duration: 2 },
                  }}
                ></motion.div>
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

        <CampaignProgressCard
          totalRaised={totalRaised}
          targetAmount={targetAmount}
          ethToMyrRate={ethToMyrRate}
          myrValues={myrValues}
          projectTitle={projectTitle}
          projectDescription={projectDescription}
          projectImage={image}
          loading={loading}
          categories={categories}
        />

        <Description
          title={projectTitle}
          description={projectDescription}
          overview={overview}
          objectives={objectives}
          impactStats={impact}
          timeline={timeline}
        />

        <HalalChecker description={overview.join(". ")} />

        <div className="my-8 ">
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
        <Dialog
          open={proofOfWorkModalOpen}
          onOpenChange={setProofOfWorkModalOpen}
        >
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
                    {selectedProofOfWork.photos.map(
                      (photo: string, index: number) => (
                        <img
                          key={index}
                          src={photo || "/placeholder.svg"}
                          alt={`Proof of Work Photo ${index + 1}`}
                          className="rounded-lg shadow-md"
                        />
                      )
                    )}
                  </div>
                </div>
              )}

              {selectedProofOfWork?.videos?.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium">Videos</h4>
                  <div className="space-y-2">
                    {selectedProofOfWork.videos.map(
                      (video: string, index: number) => (
                        <video
                          key={index}
                          controls
                          src={video}
                          className="w-full rounded-lg shadow-md"
                        />
                      )
                    )}
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

        <div className="mb-16" ref={milestonesRef}>
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
                          } overflow-hidden h-full flex flex-col relative p-2`}
                        >
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
                            className={`pb-2 ${
                              activeMilestoneId !== -1 &&
                              activeMilestoneId === milestone.id
                                ? "pt-8"
                                : activeMilestoneId !== -1 &&
                                  milestone.id > activeMilestoneId
                                ? "pt-8 opacity-70"
                                : ""
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-xl">
                                {milestone.description}
                              </CardTitle>
                              {milestone.released ? (
                                <Badge className="bg-green-500">
                                  Completed
                                </Badge>
                              ) : activeMilestoneId === milestone.id ? (
                                <Badge className="bg-blue-500">Active</Badge>
                              ) : milestone.id > activeMilestoneId ? (
                                <Badge
                                  variant="outline"
                                  className="bg-gray-100 text-gray-500 border-gray-300"
                                >
                                  <Lock className="h-3 w-3 mr-1" />
                                  Locked
                                </Badge>
                              ) : (
                                <Badge className="bg-yellow-500">
                                  Pending Release
                                </Badge>
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
                                <span className="font-medium">
                                  Service Provider:
                                </span>{" "}
                              </div>
                              <div className="text-xs text-gray-500 font-mono">
                                Address:{" "}
                                {milestone.serviceProvider.substring(0, 6)}...
                                {milestone.serviceProvider.substring(38)}
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-2 text-xs cursor-pointer"
                              >
                                <Users className="h-3 w-3 mr-1" />
                                View Provider Profile
                              </Button>
                            </CardDescription>
                          </CardHeader>
                          <CardContent
                            className={`flex-grow ${
                              milestone.id > activeMilestoneId
                                ? "opacity-70"
                                : ""
                            }`}
                          >
                            <div className="mb-4">
                              <div className="flex justify-between text-sm mb-1">
                                <span>Progress</span>
                                <span>{milestone.progress.toFixed(0)}%</span>
                              </div>
                              <Progress
                                value={milestone.progress}
                                className="h-2"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div className="bg-blue-50 p-3 rounded-lg">
                                <div className="text-xs text-gray-500">
                                  Target
                                </div>
                                <div className="font-semibold flex items-center">
                                  <DollarSign className="h-4 w-4 text-blue-600 mr-1" />
                                  {(
                                    Number(milestone.targetAmount) *
                                    ethToMyrRate
                                  ).toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}{" "}
                                  MYR
                                </div>
                                <div className="text-xs text-gray-500">
                                  ≈ {Number(milestone.targetAmount).toFixed(2)}{" "}
                                  ETH
                                </div>
                              </div>
                              <div className="bg-blue-50 p-3 rounded-lg">
                                <div className="text-xs text-gray-500">
                                  Raised
                                </div>
                                <div className="font-semibold flex items-center">
                                  <DollarSign className="h-4 w-4 text-blue-600 mr-1" />
                                  {(
                                    Number(milestone.currentAmount) *
                                    ethToMyrRate
                                  ).toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}{" "}
                                  MYR
                                </div>
                                <div className="text-xs text-gray-500">
                                  ≈ {Number(milestone.currentAmount).toFixed(2)}{" "}
                                  ETH
                                </div>
                              </div>
                            </div>
                            <div className="bg-blue-50 p-3 rounded-lg mb-4">
                              <div className="text-xs text-gray-500">
                                Committee Votes
                              </div>
                              <div className="font-semibold flex items-center">
                                <Users className="h-4 w-4 text-blue-600 mr-1" />
                                {milestone.voteCount} of {votingThreshold}{" "}
                                vote(s)
                              </div>
                              {milestone.voteCount > 0 &&
                                !milestone.released && (
                                  <Progress
                                    value={
                                      (Number(milestone.voteCount) /
                                        Number(votingThreshold)) *
                                      100
                                    }
                                    className="h-1 mt-2"
                                  />
                                )}
                            </div>
                          </CardContent>
                          <CardFooter className="flex flex-col gap-3 pt-0">
                            {!milestone.released &&
                              activeMilestoneId === milestone.id && (
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
                                      setSelectedProofOfWork(
                                        milestone.proofOfWork
                                      );
                                      setProofOfWorkModalOpen(true);
                                    }}
                                  >
                                    <ExternalLink className="h-4 w-4 mr-2 " />
                                    View Proof of Work
                                  </Button>

                                  {isCommittee && (
                                    <Button
                                      variant="outline"
                                      className="w-full border-blue-600 text-blue-700 hover:bg-blue-50"
                                      onClick={() =>
                                        voteToRelease(milestone.id)
                                      }
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
                                  Waiting for Committee Votes (
                                  {milestone.voteCount}/{votingThreshold})
                                </div>
                              )}
                            {!milestone.released &&
                              activeMilestoneId !== -1 &&
                              milestone.id > activeMilestoneId && (
                                <div className="flex items-center justify-center w-full p-2 bg-gray-50 rounded-lg text-gray-500">
                                  <Lock className="h-4 w-4 mr-2" />
                                  Locked Until Previous Milestones Complete
                                </div>
                              )}
                            {milestone.released && (
                              <>
                                <div className="flex items-center justify-center w-full p-2 bg-green-50 rounded-lg text-green-700">
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Funds Released Successfully
                                </div>
                                <Button
                                  variant="outline"
                                  className="w-full border-green-600 text-green-700 hover:bg-green-50 cursor-pointer"
                                  onClick={() => {
                                    setSelectedProofOfWork(
                                      milestone.proofOfWork
                                    );
                                    setProofOfWorkModalOpen(true);
                                  }}
                                >
                                  <ExternalLink className="h-4 w-4 mr-2 " />
                                  View Proof of Work
                                </Button>
                              </>
                            )}
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )
            )
          )}
        </div>

        {contractAddress ? (
          <SmartContractTransaction smart_contract_address={contractAddress} />
        ) : (
          <div className="mb-12">
            <Card className="bg-white/80 backdrop-blur-sm border border-blue-100">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">
                  No Transaction History Yet
                </h3>
                <p className="text-gray-600 text-center max-w-md">
                  There are currently no transaction history available. Check
                  back later or contact the administrator.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="bg-blue-50 border-green-900 p-4 rounded-lg mt-4">
          <h3 className="font-medium text-blue-800 mb-2">Donation Types</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-3 rounded-md border border-blue-100">
              <h4 className="font-medium text-blue-700 flex items-center">
                <Leaf className="h-4 w-4 mr-1 text-blue-700" /> Sadaqah
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                Voluntary charitable giving that can be directed to any of our
                projects.
              </p>
            </div>

            <div className="bg-white p-3 rounded-md border border-green-100">
              <h4 className="font-medium text-blue-700 flex items-center">
                <Leaf className="h-4 w-4 mr-1 text-blue-700" /> Zakat
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                Obligatory alms that can be directed to eligible projects marked
                with Zakat-eligible badge.
              </p>
            </div>

            <div className="bg-white p-3 rounded-md border border-green-100">
              <h4 className="font-medium text-blue-700 flex items-center">
                <Leaf className="h-4 w-4 mr-1 text-blue-700" /> Waqf
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                Endowment funds that provide sustainable support for long-term
                community projects.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 mt-12">
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

        <div className="bg-white rounded-lg shadow-md p-6 border border-blue-100">
          <div className="flex items-start">
            <div className="bg-green-50 p-3 rounded-full mr-4">
              <Vote className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Apply to be a DAO Committee Member
              </h3>
              <p className="text-gray-600 mb-4">
                Help ensure transparency and accountability by joining our DAO
                committee. As a committee member, you'll vote on milestone
                completions and fund releases.
              </p>
              <div className="space-y-4">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Requirements:</span> Active
                  wallet with at least 0.1 ETH in transactions, commitment to
                  review project milestones, and adherence to our ethical
                  guidelines.
                </p>
                <Alert className="bg-blue-50 border-blue-200">
                  <BadgeCheck className="h-5 w-5 text-blue-600" />
                  <AlertTitle>Community Governance</AlertTitle>
                  <AlertDescription>
                    Committee members participate in decentralized governance
                    through transparent voting on the blockchain.
                  </AlertDescription>
                </Alert>
                <Button className="bg-green-500 hover:bg-green-600 text-white">
                  Apply Now
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 pt-2 mt-4">
          <div className="flex items-center flex-wrap gap-3 mb-4 p-4 rounded-lg border border-green-400 dark:border-green-700 bg-gradient-to-r from-green-500 to-green-600 shadow-sm">
            <div className="flex items-center">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm p-2 rounded-full mr-3">
                <MoonStar className="h-5 w-5 text-green-500" />
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
      </div>

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
                          {Number(selectedMilestone.targetAmount).toFixed(2)}{" "}
                          ETH
                        </span>
                        <div className="text-xs text-zinc-500">
                          ≈{" "}
                          {(
                            Number(selectedMilestone.targetAmount) *
                            ethToMyrRate
                          ).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}{" "}
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
                          {Number(selectedMilestone.currentAmount).toFixed(2)}{" "}
                          ETH
                        </span>
                        <div className="text-xs text-zinc-500">
                          ≈{" "}
                          {(
                            Number(selectedMilestone.currentAmount) *
                            ethToMyrRate
                          ).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}{" "}
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
              <div className="mt-6 flex flex-col gap-4">
                <Button
                  type="button"
                  onClick={navigateToTaxReceipt}
                  className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2 py-6 text-lg"
                >
                  <Receipt className="h-5 w-5" />
                  Generate Tax Relief Receipt
                </Button>
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
    </div>
  );
}
