"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"
import {
  ArrowRight,
  Clock,
  Coins,
  DollarSign,
  TrendingUp,
  ExternalLink,
  Loader2,
  Check,
  X,
  Info,
  Users,
  Gift,
  HeartHandshake,
  BarChart3,
  Sparkles,
} from "lucide-react"
import { toast } from "sonner"
import connectMetamask from "@/hooks/connectMetamask"
import { contractABI } from "@/lib/contract-abi"
import { formatEther, parseEther } from "ethers"

// Contract address from deployment
const CONTRACT_ADDRESS = "0xAA4Ae89A691b5D989E4c9edb12367a6351431303"

export default function StakingPage() {
  // Use the connectMetamask hook
  const { walletAddress, provider, signer, connectWallet } = connectMetamask()
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  const [loading, setLoading] = useState(true)
  const [stakeAmount, setStakeAmount] = useState("")
  const [stakeInfo, setStakeInfo] = useState<{
    amount: string
    startTime: number
    active: boolean
    estimatedReward: string
    duration: string
  }>({
    amount: "0",
    startTime: 0,
    active: false,
    estimatedReward: "0",
    duration: "0",
  })
  const [annualRate, setAnnualRate] = useState(3) // Default 3%
  const [ethToMyrRate, setEthToMyrRate] = useState(12500) // Default rate: 1 ETH = 12,500 MYR
  const [myrValues, setMyrValues] = useState({
    stakedAmount: 0,
    estimatedReward: 0,
    totalValue: 0,
  })

  // Demo mode state
  const [demoMode, setDemoMode] = useState(false)
  const [demoStartTime, setDemoStartTime] = useState<number | null>(null)
  const [demoMultiplier, setDemoMultiplier] = useState(31536000) // 1 year in seconds

  // Milestones for donation
  const [milestones, setMilestones] = useState<any[]>([])
  const [selectedMilestone, setSelectedMilestone] = useState<number | null>(null)
  const [donationAmount, setDonationAmount] = useState("")

  // Modal states
  const [modalOpen, setModalOpen] = useState(false)
  const [modalAction, setModalAction] = useState<"stake" | "unstake" | "donate">("stake")
  const [modalAmount, setModalAmount] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [transactionResult, setTransactionResult] = useState<{
    status: "success" | "error" | null
    message: string
    txHash?: string
  }>({ status: null, message: "" })

  // Stats
  const [totalStaked, setTotalStaked] = useState("0")
  const [totalStakers, setTotalStakers] = useState(0)
  const [totalRewardsDistributed, setTotalRewardsDistributed] = useState("0")

  // Reward history
  const [rewardHistory, setRewardHistory] = useState<
    {
      timestamp: number
      amount: string
    }[]
  >([])

  // Initialize contract when signer is available
  useEffect(() => {
    console.log("Contract address:", CONTRACT_ADDRESS)
    console.log("Signer and provider available:", signer, provider)
    const initialize = async () => {
      if (signer && provider) {
        try {
          const stakingContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer)
          setContract(stakingContract)
          // Initialize contract data
          initializeContractData(stakingContract)
          console.log("Contract data initialized")
          console.log("Contract initialized:", stakingContract.address)
        } catch (error) {
          console.error("Error initializing contract:", error)
          toast("Contract Error", {
            description: "Failed to initialize the staking contract.",
          })
        }
      }
    }
    // Add a small delay to ensure signer and provider are loaded
    const timeout = setTimeout(() => {
      initialize()
    }, 1000) // 1 second delay

    return () => clearTimeout(timeout) // Cleanup timeout on unmount
  }, [signer, provider])

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
  const initializeContractData = async (contractInstance: ethers.Contract) => {
    try {
      setLoading(true)

      // Get annual rate from contract
      try {
        const rate = await contractInstance.annualRate()
        setAnnualRate(Number(rate))
      } catch (error) {
        console.error("Error fetching annual rate:", error)
        // Keep default rate if there's an error
      }

      // Fetch stake info if wallet is connected
      if (walletAddress) {
        await fetchStakeInfo(contractInstance, walletAddress)
      }

      // Fetch milestones for donation
      await fetchMilestones(contractInstance)

      // Fetch general staking stats
      await fetchStakingStats(contractInstance)
      console.log("Staking stats fetched successfully")
      setLoading(false)
    } catch (error) {
      console.error("Error initializing contract data:", error)
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  // Fetch stake info for the connected account
  const fetchStakeInfo = async (contractInstance: ethers.Contract, userAccount: string) => {
    try {
      const userStakeInfo = await contractInstance.stakes(userAccount)

      const amount = formatEther(userStakeInfo.amount)
      const startTime = Number(userStakeInfo.startTime)
      const active = userStakeInfo.active

      let estimatedReward = "0"
      let duration = "0"

      if (active) {
        const currentTime = Math.floor(Date.now() / 1000)
        const stakeDuration = currentTime - startTime
        const durationInDays = stakeDuration / (60 * 60 * 24)

        // Calculate estimated reward based on contract formula
        const reward = (Number(amount) * annualRate * durationInDays) / (365 * 100)
        estimatedReward = reward.toFixed(6)
        duration = durationInDays.toFixed(2)
      }

      setStakeInfo({
        amount,
        startTime,
        active,
        estimatedReward,
        duration,
      })

      // Update MYR values
      updateMyrValues(Number(amount), Number(estimatedReward))
    } catch (error) {
      console.error("Error fetching stake info:", error)
      toast("Error", {
        description: "Failed to load staking information. Please try again.",
      })
    }
  }

  // Fetch milestones for donation
  const fetchMilestones = async (contractInstance: ethers.Contract) => {
    try {
      const milestoneCount = await contractInstance.milestoneCount()
      const milestonePromises = []

      for (let i = 0; i < milestoneCount; i++) {
        milestonePromises.push(contractInstance.getMilestone(i))
      }

      const milestoneData = await Promise.all(milestonePromises)
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
        }
      })

      setMilestones(formattedMilestones)
    } catch (error) {
      console.error("Error fetching milestones:", error)
    }
  }

  // Fetch staking stats
  const fetchStakingStats = async (contractInstance: ethers.Contract) => {
    try {
      // In a real implementation, you would fetch these from the contract
      // For this example, we'll use mock data
      setTotalStaked("125.75")
      setTotalStakers(42)
      setTotalRewardsDistributed("3.76")
    } catch (error) {
      console.error("Error fetching staking stats:", error)
    }
  }

  // Update MYR values
  const updateMyrValues = (stakedAmount: number, estimatedReward: number) => {
    const totalValue = stakedAmount + estimatedReward

    setMyrValues({
      stakedAmount: stakedAmount * ethToMyrRate,
      estimatedReward: estimatedReward * ethToMyrRate,
      totalValue: totalValue * ethToMyrRate,
    })
  }

  // Open modal for staking, unstaking, or donating
  const openModal = (action: "stake" | "unstake" | "donate") => {
    if (!walletAddress) {
      toast("Wallet Required", {
        description: "Please connect your wallet first.",
      })
      return
    }

    setModalAction(action)
    setModalAmount(action === "unstake" ? stakeInfo.amount : "")
    setTransactionResult({ status: null, message: "" })
    setModalOpen(true)
  }

  // Handle modal action (stake, unstake, or donate)
  const handleModalAction = async () => {
    if (modalAction === "stake") {
      await handleStake()
    } else if (modalAction === "unstake") {
      await handleUnstake()
    } else if (modalAction === "donate") {
      await handleDonation()
    }
  }

  // Handle staking
  const handleStake = async () => {
    if (!modalAmount || Number(modalAmount) <= 0) {
      setTransactionResult({
        status: "error",
        message: "Please enter a valid stake amount.",
      })
      return
    }

    if (!contract || !signer) {
      setTransactionResult({
        status: "error",
        message: "Wallet not connected. Please connect your wallet first.",
      })
      return
    }

    try {
      setIsProcessing(true)

      const tx = await contract.stake({
        value: parseEther(modalAmount),
      })

      const receipt = await tx.wait()

      // Refresh stake info
      if (walletAddress) {
        await fetchStakeInfo(contract, walletAddress)
      }
      await fetchStakingStats(contract)

      // If demo mode is enabled, set the demo start time
      if (demoMode) {
        setDemoStartTime(Math.floor(Date.now() / 1000))
      }

      setTransactionResult({
        status: "success",
        message: `Successfully staked ${modalAmount} ETH.`,
        txHash: receipt.hash,
      })
    } catch (error) {
      console.error("Staking error:", error)

      setTransactionResult({
        status: "error",
        message: (error as any)?.reason || "Transaction failed. Please try again.",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle unstaking
  const handleUnstake = async () => {
    if (!contract || !signer) {
      setTransactionResult({
        status: "error",
        message: "Wallet not connected. Please connect your wallet first.",
      })
      return
    }

    try {
      setIsProcessing(true)

      const tx = await contract.unstake()

      const receipt = await tx.wait()

      // Add to reward history
      const newRewardEntry = {
        timestamp: Math.floor(Date.now() / 1000),
        amount: stakeInfo.estimatedReward,
      }
      setRewardHistory([newRewardEntry, ...rewardHistory])

      // Reset demo start time
      setDemoStartTime(null)

      if (walletAddress) await fetchStakeInfo(contract, walletAddress)
      await fetchStakingStats(contract)

      setTransactionResult({
        status: "success",
        message: `Successfully unstaked ${stakeInfo.amount} ETH with a reward of ${stakeInfo.estimatedReward} ETH.`,
        txHash: receipt.hash,
      })
    } catch (error) {
      console.error("Unstaking error:", error)

      setTransactionResult({
        status: "error",
        message: (error as any)?.reason || "Transaction failed. Please try again.",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle donation to milestone
  const handleDonation = async () => {
    if (!donationAmount || Number(donationAmount) <= 0 || selectedMilestone === null) {
      setTransactionResult({
        status: "error",
        message: "Please enter a valid donation amount and select a milestone.",
      })
      return
    }

    if (Number(donationAmount) > Number(stakeInfo.estimatedReward)) {
      setTransactionResult({
        status: "error",
        message: "Donation amount cannot exceed your available rewards.",
      })
      return
    }

    if (!contract || !signer) {
      setTransactionResult({
        status: "error",
        message: "Wallet not connected. Please connect your wallet first.",
      })
      return
    }

    try {
      setIsProcessing(true)

      // In a real implementation, you would need a contract function to donate rewards
      // For this demo, we'll simulate unstaking and then donating
      const unstakeTx = await contract.unstake()
      await unstakeTx.wait()

      // Now donate to the milestone
      const donateTx = await contract.donateToMilestone(selectedMilestone, {
        value: parseEther(donationAmount),
      })

      const receipt = await donateTx.wait()

      // Refresh data
      if (walletAddress) await fetchStakeInfo(contract, walletAddress)
      await fetchMilestones(contract)
      await fetchStakingStats(contract)

      setTransactionResult({
        status: "success",
        message: `Successfully donated ${donationAmount} ETH to ${milestones[selectedMilestone].description}.`,
        txHash: receipt.hash,
      })
    } catch (error) {
      console.error("Donation error:", error)

      setTransactionResult({
        status: "error",
        message: (error as any)?.reason || "Transaction failed. Please try again.",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Toggle demo mode
  const toggleDemoMode = (enabled: boolean) => {
    setDemoMode(enabled)
    if (enabled && stakeInfo.active) {
      setDemoStartTime(Math.floor(Date.now() / 1000))
    } else {
      setDemoStartTime(null)
    }
  }

  // Update estimated rewards in demo mode
  useEffect(() => {
    if (!demoMode || !stakeInfo.active || !demoStartTime) return

    const interval = setInterval(() => {
      const currentTime = Math.floor(Date.now() / 1000)
      const demoElapsedTime = currentTime - demoStartTime

      // In demo mode, 1 second = 1 year for reward calculation
      const demoYears = demoElapsedTime / demoMultiplier

      // Calculate demo reward
      const demoReward = (Number(stakeInfo.amount) * annualRate * demoYears) / 100
      const newEstimatedReward = demoReward.toFixed(6)

      setStakeInfo({
        ...stakeInfo,
        estimatedReward: newEstimatedReward,
        duration: (demoYears * 365).toFixed(2), // Convert years to days
      })

      // Update MYR values
      updateMyrValues(Number(stakeInfo.amount), demoReward)
    }, 1000) // Update every second

    return () => clearInterval(interval)
  }, [demoMode, stakeInfo.active, demoStartTime, stakeInfo.amount, annualRate, demoMultiplier])

  // Update estimated rewards in normal mode
  useEffect(() => {
    if (demoMode || !stakeInfo.active) return

    const interval = setInterval(() => {
      if (stakeInfo.active) {
        const currentTime = Math.floor(Date.now() / 1000)
        const stakeDuration = currentTime - stakeInfo.startTime
        const durationInDays = stakeDuration / (60 * 60 * 24)

        // Calculate estimated reward based on contract formula
        const reward = (Number(stakeInfo.amount) * annualRate * durationInDays) / (365 * 100)
        const newEstimatedReward = reward.toFixed(6)

        setStakeInfo({
          ...stakeInfo,
          estimatedReward: newEstimatedReward,
          duration: durationInDays.toFixed(2),
        })

        // Update MYR values
        updateMyrValues(Number(stakeInfo.amount), reward)
      }
    }, 10000) // Update every 10 seconds in normal mode

    return () => clearInterval(interval)
  }, [demoMode, stakeInfo.active, stakeInfo.startTime, stakeInfo.amount, annualRate])

  return (
    <div className="min-h-screen pt-16 pb-8 px-6 bg-zinc-50 dark:bg-zinc-950">
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
            Earn While Supporting Charity
          </motion.div>

          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-800 to-blue-900 leading-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            Charity Staking Platform
          </motion.h1>

          <motion.p
            className="text-lg text-gray-600 max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            Stake your ETH to earn {annualRate}% annual rewards while supporting our charity platform. Your staked funds
            help provide liquidity for charity projects.
          </motion.p>

          {walletAddress ? (
            <motion.div
              className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-md border border-blue-100 inline-block"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-800 font-medium">
                  Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-6 rounded-lg text-lg h-auto group transition-all duration-300 hover:shadow-lg hover:shadow-blue-200"
                onClick={connectWallet}
              >
                <span className="flex items-center gap-2">
                  <Coins className="h-5 w-5" />
                  Connect Wallet to Stake
                </span>
              </Button>
            </motion.div>
          )}
        </motion.div>

        {/* Staking Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-white/90 backdrop-blur-sm border border-blue-100">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Coins className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Staked</p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-2xl font-bold">{totalStaked}</p>
                    <p className="text-sm text-gray-500">ETH</p>
                  </div>
                  <p className="text-xs text-gray-500">≈ {(Number(totalStaked) * ethToMyrRate).toLocaleString()} MYR</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border border-blue-100">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Stakers</p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-2xl font-bold">{totalStakers}</p>
                    <p className="text-sm text-gray-500">users</p>
                  </div>
                  <p className="text-xs text-gray-500">Active participants</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border border-blue-100">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Rewards</p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-2xl font-bold">{totalRewardsDistributed}</p>
                    <p className="text-sm text-gray-500">ETH</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    ≈ {(Number(totalRewardsDistributed) * ethToMyrRate).toLocaleString()} MYR
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Staking Dashboard */}
        <div className="max-w-5xl mx-auto mb-12">
          <Tabs defaultValue="staking" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="staking" className="text-sm">
                <Coins className="h-4 w-4 mr-2" />
                Staking Dashboard
              </TabsTrigger>
              <TabsTrigger value="rewards" className="text-sm">
                <Gift className="h-4 w-4 mr-2" />
                Rewards & Donations
              </TabsTrigger>
              <TabsTrigger value="analytics" className="text-sm">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </TabsTrigger>
            </TabsList>

            {/* Staking Dashboard Tab */}
            <TabsContent value="staking">
              <Card className="bg-white/90 backdrop-blur-sm border border-blue-100">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Coins className="h-6 w-6 text-blue-600 mr-2" />
                    Your Staking Dashboard
                  </CardTitle>
                  <CardDescription>Manage your staked ETH and rewards</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                    </div>
                  ) : !walletAddress ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <Coins className="h-8 w-8 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-medium text-gray-800 mb-2">Wallet Not Connected</h3>
                      <p className="text-gray-600 text-center max-w-md mb-6">
                        Connect your wallet to view your staking information and start earning rewards.
                      </p>
                      <Button className="bg-blue-600 hover:bg-blue-700" onClick={connectWallet}>
                        Connect Wallet
                      </Button>
                    </div>
                  ) : stakeInfo.active ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="text-xs text-gray-500">Staked Amount</div>
                          <div className="font-semibold flex items-center text-lg">
                            <DollarSign className="h-4 w-4 text-blue-600 mr-1" />
                            {stakeInfo.amount} ETH
                          </div>
                          <div className="text-xs text-gray-500">≈ {myrValues.stakedAmount.toLocaleString()} MYR</div>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="text-xs text-gray-500">Staking Duration</div>
                          <div className="font-semibold flex items-center text-lg">
                            <Clock className="h-4 w-4 text-blue-600 mr-1" />
                            {stakeInfo.duration} days {demoMode && "(Demo)"}
                          </div>
                          <div className="text-xs text-gray-500">
                            Started: {new Date(stakeInfo.startTime * 1000).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Current Rewards</h4>
                        <div className="flex items-center">
                          <Coins className="h-6 w-6 text-blue-600 mr-2" />
                          <span className="text-2xl font-bold text-blue-700">{stakeInfo.estimatedReward} ETH</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          ≈ {myrValues.estimatedReward.toLocaleString()} MYR
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Rewards are calculated based on {annualRate}% APR and your staking duration
                          {demoMode && " (accelerated in demo mode)"}
                        </p>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-xs text-gray-500">Total Value (Stake + Rewards)</div>
                        <div className="font-semibold flex items-center text-lg">
                          <DollarSign className="h-4 w-4 text-blue-600 mr-1" />
                          {(Number(stakeInfo.amount) + Number(stakeInfo.estimatedReward)).toFixed(6)} ETH
                        </div>
                        <div className="text-xs text-gray-500">≈ {myrValues.totalValue.toLocaleString()} MYR</div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => openModal("unstake")}>
                          <ArrowRight className="h-4 w-4 mr-2" />
                          Unstake ETH + Claim Rewards
                        </Button>
                        <Button
                          className="w-full bg-green-600 hover:bg-green-700"
                          onClick={() => openModal("donate")}
                          disabled={Number(stakeInfo.estimatedReward) <= 0}
                        >
                          <HeartHandshake className="h-4 w-4 mr-2" />
                          Donate Rewards to Charity
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Annual Reward Rate</h4>
                        <div className="flex items-center">
                          <TrendingUp className="h-6 w-6 text-blue-600 mr-2" />
                          <span className="text-2xl font-bold text-blue-700">{annualRate}%</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Stake your ETH to earn {annualRate}% annual rewards
                          {demoMode && " (accelerated in demo mode)"}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="stake-amount" className="block text-sm font-medium text-gray-700 mb-1">
                          Amount to Stake (ETH)
                        </label>
                        <Input
                          id="stake-amount"
                          type="number"
                          placeholder="0.0"
                          value={stakeAmount}
                          onChange={(e) => setStakeAmount(e.target.value)}
                          className="w-full"
                        />
                        {stakeAmount && (
                          <div className="text-sm text-gray-500">
                            ≈ {(Number(stakeAmount) * ethToMyrRate).toLocaleString()} MYR
                          </div>
                        )}
                      </div>

                      {stakeAmount && Number(stakeAmount) > 0 && (
                        <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                          <h4 className="font-medium flex items-center gap-1 text-blue-800">
                            <Info className="h-4 w-4" />
                            Estimated Annual Rewards
                          </h4>
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <div>
                              <p className="text-gray-500">Daily</p>
                              <p className="font-medium">
                                {((Number(stakeAmount) * annualRate) / 365 / 100).toFixed(6)} ETH
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500">Monthly</p>
                              <p className="font-medium">
                                {((Number(stakeAmount) * annualRate) / 12 / 100).toFixed(4)} ETH
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500">Annual</p>
                              <p className="font-medium">{((Number(stakeAmount) * annualRate) / 100).toFixed(4)} ETH</p>
                            </div>
                          </div>
                        </div>
                      )}

                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => openModal("stake")}
                        disabled={!stakeAmount || Number(stakeAmount) <= 0}
                      >
                        <Coins className="h-4 w-4 mr-2" />
                        Stake ETH
                      </Button>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  {stakeInfo.active && (
                    <div className="w-full text-center text-sm text-gray-500">
                      Rewards are continuously calculated and will be paid out when you unstake
                    </div>
                  )}
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Rewards & Donations Tab */}
            <TabsContent value="rewards">
              <Card className="bg-white/90 backdrop-blur-sm border border-blue-100">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Gift className="h-6 w-6 text-blue-600 mr-2" />
                    Rewards & Donations
                  </CardTitle>
                  <CardDescription>Track your rewards and donate to charity milestones</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                    </div>
                  ) : !walletAddress ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <Gift className="h-8 w-8 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-medium text-gray-800 mb-2">Wallet Not Connected</h3>
                      <p className="text-gray-600 text-center max-w-md mb-6">
                        Connect your wallet to view your rewards and make donations.
                      </p>
                      <Button className="bg-blue-600 hover:bg-blue-700" onClick={connectWallet}>
                        Connect Wallet
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Current Rewards */}
                      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Available Rewards</h4>
                        <div className="flex items-center">
                          <Coins className="h-6 w-6 text-blue-600 mr-2" />
                          <span className="text-2xl font-bold text-blue-700">
                            {stakeInfo.active ? stakeInfo.estimatedReward : "0.000000"} ETH
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          ≈ {stakeInfo.active ? myrValues.estimatedReward.toLocaleString() : "0"} MYR
                        </div>
                        {stakeInfo.active ? (
                          <p className="text-xs text-gray-500 mt-2">
                            You can donate your rewards to charity milestones without unstaking
                          </p>
                        ) : (
                          <p className="text-xs text-gray-500 mt-2">
                            Stake ETH to start earning rewards that you can donate
                          </p>
                        )}
                      </div>

                      {/* Reward History */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Reward History</h4>
                        {rewardHistory.length === 0 ? (
                          <div className="bg-gray-50 p-6 rounded-lg text-center">
                            <p className="text-gray-500">No reward history yet</p>
                            <p className="text-sm text-gray-400 mt-1">Your claimed rewards will appear here</p>
                          </div>
                        ) : (
                          <div className="rounded-md border">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    Date
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    Amount
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {rewardHistory.map((reward, index) => (
                                  <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {new Date(reward.timestamp * 1000).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                                      {reward.amount} ETH
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>

                      {/* Available Charity Milestones */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Available Charity Milestones</h4>
                        {milestones.length === 0 ? (
                          <div className="bg-gray-50 p-6 rounded-lg text-center">
                            <p className="text-gray-500">No charity milestones available</p>
                            <p className="text-sm text-gray-400 mt-1">
                              Check back later for available charity projects
                            </p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 gap-4">
                            {milestones
                              .filter((m) => !m.released)
                              .map((milestone) => (
                                <div
                                  key={milestone.id}
                                  className="border rounded-lg p-4 bg-white hover:bg-blue-50 transition-colors cursor-pointer"
                                  onClick={() => {
                                    if (stakeInfo.active && Number(stakeInfo.estimatedReward) > 0) {
                                      setSelectedMilestone(milestone.id)
                                      setDonationAmount(stakeInfo.estimatedReward)
                                      openModal("donate")
                                    }
                                  }}
                                >
                                  <div className="flex justify-between items-start mb-2">
                                    <h5 className="font-medium">{milestone.description}</h5>
                                    <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                      {milestone.released ? "Completed" : "Active"}
                                    </div>
                                  </div>
                                  <div className="mb-2">
                                    <div className="flex justify-between text-sm mb-1">
                                      <span>Progress</span>
                                      <span>{milestone.progress.toFixed(0)}%</span>
                                    </div>
                                    <Progress value={milestone.progress} className="h-2" />
                                  </div>
                                  <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                      <span className="text-gray-500">Target:</span>{" "}
                                      <span className="font-medium">{milestone.targetAmount} ETH</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">Raised:</span>{" "}
                                      <span className="font-medium">{milestone.currentAmount} ETH</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>

                      {/* Donate Button */}
                      {stakeInfo.active && Number(stakeInfo.estimatedReward) > 0 && (
                        <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => openModal("donate")}>
                          <HeartHandshake className="h-4 w-4 mr-2" />
                          Donate Rewards to Charity
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <Card className="bg-white/90 backdrop-blur-sm border border-blue-100">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-6 w-6 text-blue-600 mr-2" />
                    Staking Analytics
                  </CardTitle>
                  <CardDescription>Track your staking performance and rewards</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                    </div>
                  ) : !walletAddress ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <BarChart3 className="h-8 w-8 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-medium text-gray-800 mb-2">Wallet Not Connected</h3>
                      <p className="text-gray-600 text-center max-w-md mb-6">
                        Connect your wallet to view your staking analytics.
                      </p>
                      <Button className="bg-blue-600 hover:bg-blue-700" onClick={connectWallet}>
                        Connect Wallet
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Staking Summary */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="text-xs text-gray-500">Current APR</div>
                          <div className="font-semibold flex items-center text-lg">
                            <TrendingUp className="h-4 w-4 text-blue-600 mr-1" />
                            {annualRate}%
                          </div>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="text-xs text-gray-500">Staking Status</div>
                          <div className="font-semibold flex items-center text-lg">
                            {stakeInfo.active ? (
                              <>
                                <Check className="h-4 w-4 text-green-600 mr-1" />
                                Active
                              </>
                            ) : (
                              <>
                                <X className="h-4 w-4 text-red-600 mr-1" />
                                Inactive
                              </>
                            )}
                          </div>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="text-xs text-gray-500">Reward Rate</div>
                          <div className="font-semibold flex items-center text-lg">
                            <Coins className="h-4 w-4 text-blue-600 mr-1" />
                            {stakeInfo.active
                              ? ((Number(stakeInfo.estimatedReward) / Number(stakeInfo.duration)) * 365).toFixed(6)
                              : "0.000000"}{" "}
                            ETH/year
                          </div>
                        </div>
                      </div>

                      {/* Staking Performance */}
                      <div className="bg-white p-6 rounded-lg border">
                        <h4 className="text-sm font-medium text-gray-700 mb-4">Staking Performance</h4>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Initial Stake</span>
                              <span>{stakeInfo.amount} ETH</span>
                            </div>
                            <Progress value={100} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Current Rewards</span>
                              <span>
                                {stakeInfo.estimatedReward} ETH (
                                {stakeInfo.amount && Number(stakeInfo.amount) > 0
                                  ? ((Number(stakeInfo.estimatedReward) / Number(stakeInfo.amount)) * 100).toFixed(2)
                                  : "0.00"}
                                %)
                              </span>
                            </div>
                            <Progress
                              value={
                                stakeInfo.amount && Number(stakeInfo.amount) > 0
                                  ? (Number(stakeInfo.estimatedReward) / Number(stakeInfo.amount)) * 100
                                  : 0
                              }
                              className="h-2"
                            />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Total Value</span>
                              <span>
                                {(Number(stakeInfo.amount) + Number(stakeInfo.estimatedReward)).toFixed(6)} ETH
                              </span>
                            </div>
                            <Progress value={100} className="h-2 bg-gradient-to-r from-blue-500 to-green-500" />
                          </div>
                        </div>
                      </div>

                      {/* Projected Rewards */}
                      {stakeInfo.active && (
                        <div className="bg-white p-6 rounded-lg border">
                          <h4 className="text-sm font-medium text-gray-700 mb-4">Projected Rewards</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <div className="text-xs text-gray-500">1 Month</div>
                              <div className="font-semibold text-lg">
                                {((Number(stakeInfo.amount) * annualRate) / 12 / 100).toFixed(6)} ETH
                              </div>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <div className="text-xs text-gray-500">6 Months</div>
                              <div className="font-semibold text-lg">
                                {((Number(stakeInfo.amount) * annualRate) / 2 / 100).toFixed(6)} ETH
                              </div>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <div className="text-xs text-gray-500">1 Year</div>
                              <div className="font-semibold text-lg">
                                {((Number(stakeInfo.amount) * annualRate) / 100).toFixed(6)} ETH
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Contract Information */}
        <Card className="bg-white/90 backdrop-blur-sm border border-blue-100 max-w-5xl mx-auto mt-12">
          <CardHeader>
            <CardTitle className="text-xl font-medium">Contract Information</CardTitle>
            <CardDescription>Verify this staking contract on the blockchain</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Contract Address</span>
                <span className="font-mono text-xs truncate max-w-[180px]" title={CONTRACT_ADDRESS}>
                  {CONTRACT_ADDRESS.slice(0, 6)}...{CONTRACT_ADDRESS.slice(-4)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Annual Rate</span>
                <span className="text-xs">{annualRate}%</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Network</span>
                <span className="text-xs">Sepolia Testnet</span>
              </div>
            </div>

            <div className="rounded-md bg-zinc-100 p-3 dark:bg-zinc-800">
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5 text-zinc-500" />
                <div className="text-sm">
                  <div className="font-medium">Verified Contract</div>
                  <div className="text-zinc-500 dark:text-zinc-400">View source code and details</div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full cursor-pointer"
              onClick={() => window.open(`https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`, "_blank")}
            >
              View on Etherscan
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Staking/Unstaking/Donation Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {modalAction === "stake" ? "Stake ETH" : modalAction === "unstake" ? "Unstake ETH" : "Donate Rewards"}
            </DialogTitle>
            <DialogDescription>
              {modalAction === "stake"
                ? `Stake your ETH to earn ${annualRate}% annual rewards`
                : modalAction === "unstake"
                  ? "Unstake your ETH and claim your rewards"
                  : "Donate your staking rewards to charity"}
            </DialogDescription>
          </DialogHeader>

          {!isProcessing && transactionResult.status === null && (
            <>
              <div className="space-y-4 py-4">
                {modalAction === "stake" ? (
                  <div className="space-y-2">
                    <label
                      htmlFor="modal-amount"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Amount to Stake (ETH)
                    </label>
                    <Input
                      id="modal-amount"
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="0.00"
                      value={modalAmount}
                      onChange={(e) => setModalAmount(e.target.value)}
                      className="font-mono"
                    />
                    {modalAmount && (
                      <div className="text-sm text-zinc-500">
                        ≈ {(Number(modalAmount) * ethToMyrRate).toLocaleString()} MYR
                      </div>
                    )}
                  </div>
                ) : modalAction === "unstake" ? (
                  <div className="rounded-md bg-blue-50 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Staked Amount</span>
                      <div className="text-right">
                        <span className="font-mono text-sm">{stakeInfo.amount} ETH</span>
                        <div className="text-xs text-zinc-500">≈ {myrValues.stakedAmount.toLocaleString()} MYR</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Earned Rewards</span>
                      <div className="text-right">
                        <span className="font-mono text-sm">{stakeInfo.estimatedReward} ETH</span>
                        <div className="text-xs text-zinc-500">≈ {myrValues.estimatedReward.toLocaleString()} MYR</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-sm font-medium">Total to Receive</span>
                      <div className="text-right">
                        <span className="font-mono text-sm font-bold">
                          {(Number(stakeInfo.amount) + Number(stakeInfo.estimatedReward)).toFixed(6)} ETH
                        </span>
                        <div className="text-xs text-zinc-500">≈ {myrValues.totalValue.toLocaleString()} MYR</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="rounded-md bg-green-50 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Available Rewards</span>
                        <div className="text-right">
                          <span className="font-mono text-sm">{stakeInfo.estimatedReward} ETH</span>
                          <div className="text-xs text-zinc-500">
                            ≈ {myrValues.estimatedReward.toLocaleString()} MYR
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="milestone-select"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Select Charity Milestone
                      </label>
                      <select
                        id="milestone-select"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={selectedMilestone !== null ? selectedMilestone : ""}
                        onChange={(e) => setSelectedMilestone(Number(e.target.value))}
                      >
                        <option value="" disabled>
                          Select a milestone
                        </option>
                        {milestones
                          .filter((m) => !m.released)
                          .map((milestone) => (
                            <option key={milestone.id} value={milestone.id}>
                              {milestone.description} ({milestone.progress.toFixed(0)}% funded)
                            </option>
                          ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="donation-amount"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Donation Amount (ETH)
                      </label>
                      <Input
                        id="donation-amount"
                        type="number"
                        step="0.000001"
                        min="0.000001"
                        max={stakeInfo.estimatedReward}
                        placeholder="0.00"
                        value={donationAmount}
                        onChange={(e) => setDonationAmount(e.target.value)}
                        className="font-mono"
                      />
                      {donationAmount && (
                        <div className="text-sm text-zinc-500">
                          ≈ {(Number(donationAmount) * ethToMyrRate).toLocaleString()} MYR
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleModalAction}
                  className={`${
                    modalAction === "donate" ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                  disabled={
                    modalAction === "donate" &&
                    (selectedMilestone === null || !donationAmount || Number(donationAmount) <= 0)
                  }
                >
                  {modalAction === "stake" ? "Stake" : modalAction === "unstake" ? "Unstake & Claim" : "Donate"}
                </Button>
              </DialogFooter>
            </>
          )}

          {isProcessing && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
              <p className="text-center font-medium">Processing your request...</p>
              <p className="text-center text-sm text-muted-foreground mt-2">
                Please confirm the transaction in your wallet and wait for it to be processed.
              </p>
            </div>
          )}

          {!isProcessing && transactionResult.status === "success" && (
            <div className="py-6">
              <Alert className="bg-green-50 text-green-900 border-green-200 dark:bg-green-950 dark:text-green-100 dark:border-green-800">
                <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                <AlertTitle>Transaction Successful!</AlertTitle>
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
                <Button type="button" onClick={() => setModalOpen(false)} className="bg-blue-600 hover:bg-blue-700">
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
                  onClick={() => setTransactionResult({ status: null, message: "" })}
                >
                  Try Again
                </Button>
                <Button type="button" onClick={() => setModalOpen(false)} variant="destructive">
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
