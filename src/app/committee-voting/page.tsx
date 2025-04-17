"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  Vote,
  ExternalLink,
  Loader2,
  Check,
  X,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  Info,
} from "lucide-react"
import { toast } from "sonner"
import connectMetamask from "@/hooks/connectMetamask"
import { contractABI } from "@/lib/contract-abi"
import { formatEther } from "ethers"

// Contract address from deployment
const CONTRACT_ADDRESS = "0x3cd514BDC64330FF78Eff7c442987A8F5b7a6Aeb"

export default function CommitteeVotingPage() {
  // Use the connectMetamask hook
  const { walletAddress, provider, signer, connectWallet } = connectMetamask()
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  const [isCommittee, setIsCommittee] = useState(false)
  const [milestones, setMilestones] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [votingThreshold, setVotingThreshold] = useState(3)
  const [hasVoted, setHasVoted] = useState<{ [key: number]: boolean }>({})
  const [ethToMyrRate, setEthToMyrRate] = useState(12500) // Default rate: 1 ETH = 12,500 MYR


  // Modal states
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedMilestone, setSelectedMilestone] = useState<any>(null)
  const [voteType, setVoteType] = useState<"yes" | "no">("yes")
  const [isProcessing, setIsProcessing] = useState(false)
  const [transactionResult, setTransactionResult] = useState<{
    status: "success" | "error" | null
    message: string
    txHash?: string
  }>({ status: null, message: "" })

  // Initialize contract when signer is available
  useEffect(() => {
    const initialize = async () => {
      console.log("Contract address:", CONTRACT_ADDRESS)
      console.log("Signer and provider:", signer, provider)
      console.log("Wallet address:", walletAddress)
      if (signer && provider) {
        try {
          const votingContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer)
          setContract(votingContract)
          console.log("Contract initialized:", votingContract.address)

          // Check if user is committee member
          if (walletAddress) {
            const isCommitteeMember = await votingContract.committee(walletAddress)
            setIsCommittee(isCommitteeMember)
            console.log("Wallet address:", walletAddress)
            console.log("Committee address:", votingContract.committee(walletAddress))
            console.log("Is committee member:", isCommitteeMember)

            if (!isCommitteeMember) {
              toast("Access Denied", {
                description: "Only committee members can access this page.",
              })
            } else {
              toast("Wallet Connected", {
                description: `Connected as committee member: ${walletAddress.substring(0, 6)}...${walletAddress.substring(38)}`,
              })
              await fetchContractData(votingContract, walletAddress)
            }
          }
        } catch (error) {
          console.error("Error initializing contract:", error)
          toast("Contract Error", {
            description: "Failed to initialize the voting contract.",
          })
        }
      }
    }

    // Add a small delay to ensure signer and provider are loaded
    const timeout = setTimeout(() => {
      initialize()
    }, 1000) 

    return () => clearTimeout(timeout) // Cleanup timeout on unmount
  }, [signer, provider])

  // Auto-connect wallet if already connected
  useEffect(() => {
    if (!walletAddress) {
      const savedAddress = localStorage.getItem("walletAddress")
      if (savedAddress) {
        console.log("Auto-connecting wallet...")
        connectWallet() // Trigger wallet connection  
        console.log("Saved address:", savedAddress)
      }
    }
  }, [walletAddress, connectWallet])

  const fetchContractData = async (contractInstance: ethers.Contract, userAccount: string) => {
    try {
      setLoading(true)

      // Fetch voting threshold
      try {
        const threshold = await contractInstance.votingThreshold()
        setVotingThreshold(threshold)
      } catch (error) {
        console.error("Error fetching voting threshold:", error)
        setVotingThreshold(3) // Default threshold if error
      }

      // Fetch milestones
      const milestoneCount = await contractInstance.milestoneCount()
      const milestonePromises = []
      const votingStatusPromises = []

      for (let i = 0; i < milestoneCount; i++) {
        milestonePromises.push(contractInstance.getMilestone(i))
        votingStatusPromises.push(contractInstance.hasVoted(i, userAccount))
      }

      const milestoneData = await Promise.all(milestonePromises)
      const votingStatusData = await Promise.all(votingStatusPromises)

      // Update hasVoted state
      const votedStatus: { [key: number]: boolean } = {}
      votingStatusData.forEach((status, index) => {
        votedStatus[index] = status
      })
      setHasVoted(votedStatus)

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
          projectTitle: `Project ${Math.floor(index / 3) + 1}`,
        }
      })

      setMilestones(formattedMilestones)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching contract data:", error)
      toast("Error", {
        description: "Failed to load milestone data. Please try again.",
      })
      setLoading(false)
    }
  }

  


  // Fetch all data from the contract
  

  // Vote to release funds for a milestone
  const voteToRelease = async (milestoneId: number) => {
    if (!contract || !signer || !isCommittee) return

    try {
      setIsProcessing(true)

      const tx = await contract.voteToRelease(milestoneId)

      toast("Vote Processing", {
        description: "Your vote is being processed. Please wait for confirmation.",
      })

      const receipt = await tx.wait()

      toast("Vote Successful", {
        description: `Successfully voted to release funds for milestone: ${milestones[milestoneId].description}`,
      })

      // Update hasVoted state
      setHasVoted({
        ...hasVoted,
        [milestoneId]: true,
      })

      if (walletAddress) {
        await fetchContractData(contract, walletAddress)
      }

      setTransactionResult({
        status: "success",
        message: `Successfully voted to release funds for milestone: ${milestones[milestoneId].description}`,
        txHash: receipt.transactionHash,
      })
    } catch (error) {
      console.error("Voting error:", error)
      toast("Vote Failed", {
        description: "Failed to process your vote. Please try again.",
      })

      setTransactionResult({
        status: "error",
        message: (error as any).reason || "Transaction failed. Please try again.",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Open voting modal
  const openVotingModal = (milestone: any, vote: "yes" | "no") => {
    setSelectedMilestone(milestone)
    setVoteType(vote)
    setTransactionResult({ status: null, message: "" })
    setModalOpen(true)
  }

  // Handle modal vote
  const handleModalVote = async () => {
    if (!selectedMilestone) {
      return
    }

    if (!contract || !signer) {
      setTransactionResult({
        status: "error",
        message: "Wallet not connected. Please connect your wallet first.",
      })
      return
    }

    if (voteType === "yes") {
      await voteToRelease(selectedMilestone.id)
    } else {
      // In a real implementation, you would have a "no" vote function
      // For this demo, we'll just show a message
      setTransactionResult({
        status: "success",
        message: `Your "No" vote has been recorded. Note: The current contract only supports "Yes" votes.`,
      })

      setTimeout(() => {
        setModalOpen(false)
      }, 3000)
    }
  }

  // Group milestones by project title
  const unreleasedMilestones = milestones.filter((milestone) => !milestone.released)

  const fundedMilestones = milestones.filter(
    (milestone) => !milestone.released && Number(milestone.currentAmount) >= Number(milestone.targetAmount),
  )

  // Group all milestones under a single "Placeholder Project" title
  const milestonesByProject = {
    "Education for Kids in Rural Areas": fundedMilestones,
  }

  return (
    <div className="min-h-screen pt-16 pb-8 px-6 bg-zinc-50 dark:bg-zinc-950">
      <div className="container mx-auto px-6 pt-5">
        <div className="flex items-center flex-wrap gap-3 mb-4 p-4 rounded-lg border border-blue-400 dark:border-blue-700 bg-gradient-to-r from-blue-500 to-blue-600 shadow-sm">
          <div className="flex items-center">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm p-2 rounded-full mr-3">
              <Vote className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <div className="text-xs text-blue-100 mb-0.5 font-medium">Committee</div>
              <span className="font-semibold text-white">Milestone Voting Panel</span>
            </div>
          </div>

          <a
            href="/charity"
            className="flex items-center ml-auto px-3 py-1.5 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm text-white text-sm transition-colors duration-200"
          >
            <ArrowLeft className="h-3 w-3 mr-1.5 text-blue-500" />
            <span className="text-blue-500">Back to Charity Page</span>
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
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-800 to-blue-900 leading-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            Committee Voting Panel
          </motion.h1>

          <motion.p
            className="text-lg text-gray-600 max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            As a committee member, you can vote on milestone releases. Each milestone requires {votingThreshold} votes
            to be released.
          </motion.p>

          {!walletAddress && (
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
                  <Vote className="h-5 w-5" />
                  Connect Wallet to Vote
                </span>
              </Button>
            </motion.div>
          )}

          {walletAddress && !isCommittee && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Alert className="bg-red-50 border-red-200 max-w-lg mx-auto">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <AlertTitle>Access Denied</AlertTitle>
                <AlertDescription>
                  Only committee members can access this voting panel. Please connect with a committee wallet.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {walletAddress && isCommittee && (
            <motion.div
              className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-md border border-blue-100 inline-block"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-800 font-medium">
                  Connected as Committee Member: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </span>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Voting Instructions */}
        {isCommittee && (
          <div className="mb-12">
            <Card className="bg-blue-50 border-blue-200 py-4">
              <CardHeader>
                <CardTitle className="text-xl font-medium flex items-center">
                  <Vote className="h-6 w-6 text-blue-600 mr-2" />
                  Voting Instructions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    As a committee member, your vote is crucial for the transparent and secure release of funds to
                    charity milestones.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-blue-100">
                      <h3 className="font-medium text-blue-800 mb-2 flex items-center">
                        <ThumbsUp className="h-4 w-4 mr-2 text-green-600" />
                        Voting "Yes"
                      </h3>
                      <p className="text-sm text-gray-600">
                        A "Yes" vote indicates you approve the milestone and believe the funds should be released to the
                        service provider.
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-blue-100">
                      <h3 className="font-medium text-blue-800 mb-2 flex items-center">
                        <ThumbsDown className="h-4 w-4 mr-2 text-red-600" />
                        Voting "No"
                      </h3>
                      <p className="text-sm text-gray-600">
                        A "No" vote indicates you do not approve the milestone and believe the funds should not be
                        released.
                      </p>
                    </div>
                  </div>

                  <Alert className="bg-white border-blue-200">
                    <Info className="h-5 w-5 text-blue-600" />
                    <AlertTitle>Voting Threshold</AlertTitle>
                    <AlertDescription>
                      Each milestone requires {votingThreshold} "Yes" votes to be released. Once a milestone is
                      released, the next milestone becomes active for donations.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Milestones for Voting */}
        {isCommittee && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">Pending Milestones Awaiting Votes</h2>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <Tabs defaultValue={Object.keys(milestonesByProject)[0] || "no-projects"}>
                <TabsList className="mb-8">
                  {Object.keys(milestonesByProject).map((projectTitle) => (
                    <TabsTrigger key={projectTitle} value={projectTitle}>
                      {projectTitle}
                    </TabsTrigger>
                  ))}
                  {Object.keys(milestonesByProject).length === 0 && (
                    <TabsTrigger value="no-projects">No Projects</TabsTrigger>
                  )}
                </TabsList>

                {Object.keys(milestonesByProject).length === 0 && (
                  <TabsContent value="no-projects">
                    <Card className="bg-white/80 backdrop-blur-sm border border-blue-100">
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                          <Clock className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-800 mb-2">No Milestones Available</h3>
                        <p className="text-gray-600 text-center max-w-md">
                          There are currently no milestones available for voting. Check back later.
                        </p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                )}

                {Object.keys(milestonesByProject).length === 0 && (
                  <TabsContent value="no-projects">
                    <Card className="bg-white/80 backdrop-blur-sm border border-blue-100">
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                          <Clock className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-800 mb-2">No Milestones Available</h3>
                        <p className="text-gray-600 text-center max-w-md">
                          There are currently no milestones available for voting. Check back later.
                        </p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                )}

{Object.entries(milestonesByProject).map(([projectTitle, projectMilestones]: [string, any[]]) => (
                  <TabsContent key={projectTitle} value={projectTitle}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {(projectMilestones as any[]).map((milestone) => (
                        <Card
                          key={milestone.id}
                          className={`bg-white/90 backdrop-blur-sm ${
                            milestone.released
                              ? "border-gray-200"
                              : hasVoted[milestone.id]
                                ? "border-yellow-200"
                                : "border-blue-100"
                          } overflow-hidden h-full flex flex-col`}
                        >
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-xl">{milestone.description}</CardTitle>
                              {milestone.released ? (
                                <Badge className="bg-green-500">Completed</Badge>
                              ) : hasVoted[milestone.id] ? (
                                <Badge className="bg-yellow-500">Already Voted</Badge>
                              ) : (
                                <Badge className="bg-blue-500">Needs Vote</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-1 mt-1 mb-2">
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                {milestone.category}
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
                              <Button variant="outline" size="sm" className="mt-2 text-xs">
                                <Users className="h-3 w-3 mr-1" />
                                View Provider Profile
                              </Button>
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="flex-grow">
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
                                <div className="text-xs text-gray-500">≈ {milestone.currentAmount} ETH</div>
                              </div>
                            </div>
                            <div className="bg-blue-50 p-3 rounded-lg mb-4">
                              <div className="text-xs text-gray-500">Committee Votes</div>
                              <div className="font-semibold flex items-center">
                                <Users className="h-4 w-4 text-blue-600 mr-1" />
                                {milestone.voteCount} of {votingThreshold} vote(s)
                              </div>
                              <Progress
                                    value={(Number(milestone.voteCount) / Number(votingThreshold)) * 100}
                                    className="h-1 mt-2"
                                  />
                            </div>
                          </CardContent>
                          <CardFooter className="flex flex-col gap-3 pt-0">
                            {!milestone.released && !hasVoted[milestone.id] && (
                              <div className="grid grid-cols-2 gap-3 w-full">
                                <Button
                                  className="w-full bg-green-600 hover:bg-green-700"
                                  onClick={() => openVotingModal(milestone, "yes")}
                                >
                                  <ThumbsUp className="h-4 w-4 mr-2" />
                                  Vote Yes
                                </Button>
                                <Button
                                  className="w-full bg-red-600 hover:bg-red-700"
                                  onClick={() => openVotingModal(milestone, "no")}
                                >
                                  <ThumbsDown className="h-4 w-4 mr-2" />
                                  Vote No
                                </Button>
                              </div>
                            )}
                            {!milestone.released && hasVoted[milestone.id] && (
                              <div className="flex items-center justify-center w-full p-2 bg-yellow-50 rounded-lg text-yellow-700">
                                <CheckCircle className="h-4 w-4 mr-2" />
                                You have already voted on this milestone
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
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </div>
        )}
      </div>

      {/* Voting Confirmation Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Your Vote</DialogTitle>
            <DialogDescription>{selectedMilestone && `Milestone: ${selectedMilestone.description}`}</DialogDescription>
          </DialogHeader>

          {!isProcessing && transactionResult.status === null && (
            <>
              <div className="space-y-4 py-4">
                {selectedMilestone && (
                  <div className="rounded-md bg-blue-50 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Project</span>
                      <span className="font-medium">{selectedMilestone.projectTitle}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Current Votes</span>
                      <span className="font-medium">
                        {selectedMilestone.voteCount} of {votingThreshold}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Your Vote</span>
                      <span
                        className={`font-medium flex items-center ${voteType === "yes" ? "text-green-600" : "text-red-600"}`}
                      >
                        {voteType === "yes" ? (
                          <>
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            Yes
                          </>
                        ) : (
                          <>
                            <ThumbsDown className="h-4 w-4 mr-1" />
                            No
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                )}

                <Alert className="bg-yellow-50 border-yellow-200">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <AlertTitle>Important</AlertTitle>
                  <AlertDescription>
                    Your vote is permanent and cannot be changed once submitted. Please review your decision carefully.
                  </AlertDescription>
                </Alert>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleModalVote}
                  className={voteType === "yes" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
                >
                  Confirm Vote
                </Button>
              </DialogFooter>
            </>
          )}

          {isProcessing && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
              <p className="text-center font-medium">Processing your vote...</p>
              <p className="text-center text-sm text-muted-foreground mt-2">
                Please confirm the transaction in your wallet and wait for it to be processed.
              </p>
            </div>
          )}

          {!isProcessing && transactionResult.status === "success" && (
            <div className="py-6">
              <Alert className="bg-green-50 text-green-900 border-green-200 dark:bg-green-950 dark:text-green-100 dark:border-green-800">
                <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                <AlertTitle>Vote Successful!</AlertTitle>
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
                <AlertTitle>Vote Failed</AlertTitle>
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
