"use client"

import { useState } from "react"
import Link from "next/link"
import {Award, BadgeCheck, Calendar, ChevronLeft, Gift, Heart, Lock, Shield, Star, CheckSquare, Info, Sparkles, Gem, Leaf, FileText,} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useWallet } from "@/context/wallet-context"

export default function DonationLevelsPage() {
  const { ethBalance } = useWallet()
  const [currentLevel] = useState(2) // This would be determined by user's donation history

  // Convert ETH balance to RM for display purposes
  const rmBalance = ethBalance ? (Number.parseFloat(ethBalance) * 7000).toFixed(2) : "0.00"

  const [userLevel, setUserLevel] = useState({
      level: 2,
      title: "Community Leader",
      progress: 87.5, // percentage to next level
      totalDonated: 1750, // in RM
      projectsSupported: 3,
      nextLevelRequirement: 2000, // in RM
    })

  // Get level icon based on user level
  const getLevelIcon = () => {
    switch (userLevel.level) {
      case 1:
        return <Heart className="h-4 w-4 mr-1 text-green-600" />
      case 2:
        return <Sparkles className="h-4 w-4 mr-1 text-amber-600" />
      case 3:
        return <Gem className="h-4 w-4 mr-1 text-blue-600" />
      default:
        return <Award className="h-4 w-4 mr-1" />
    }
  }
    
  return (
    <div className="container relative max-w-6xl mx-auto py-12 px-4">
      {/* Image on the right (only visible on md+ screens) */}
        <img
          src="/steps.svg"
          alt="Steps Illustration"
          className="hidden md:block absolute right-0 top-10 w-66 h-auto"
        />
    
      {/* Header with Securities Commission Malaysia partnership */}
      <div className="mb-12 text-center">
        <div className="flex justify-center mb-4">
          <Badge className="bg-blue-600 text-white px-4 py-1 text-sm">
            Shariah-Compliant Charity Platform
          </Badge>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Donation Impact Levels</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Increase your impact and unlock exclusive benefits with our Shariah-compliant donation levels, in partnership
          with Securities Commission Malaysia.
        </p>
        <div className="flex items-center justify-center mt-4 text-sm text-muted-foreground">
          Verified by Securities Commission Malaysia
        </div>
      </div>
    
      {/* Back to profile button */}
      <div className="mb-8">
        <Link href="/profile">
          <Button variant="ghost" className="flex items-center gap-2 cursor-pointer">
            <ChevronLeft className="h-4 w-4" /> Back to Profile
          </Button>
        </Link>
      </div>  

      {/* Reused: Donation Level Progress Only */}
      <Card className="mb-8 border-green-100 bg-gradient-to-r from-green-50 to-blue-50">
        <CardContent className="p-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100 px-2 py-1">
                {getLevelIcon()} Level {userLevel.level}: {userLevel.title}
              </Badge>
            </div>

            <div className="space-y-1 w-full">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  RM{userLevel.totalDonated} / RM{userLevel.nextLevelRequirement}
                </span>
                <span className="font-medium">{userLevel.progress}%</span>
              </div>
              <Progress value={userLevel.progress} className="h-2" />
              <p className="text-sm text-muted-foreground">
                Donate RM{userLevel.nextLevelRequirement - userLevel.totalDonated} more to reach Level{" "}
                {userLevel.level + 1}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current status */}
      <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-lg p-6 mb-12 border border-blue-100">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold mb-1">Your Current Impact</h2>
            <p className="text-muted-foreground mb-2">You've donated approximately RM1750 through DermaNow</p>
            <div className="flex items-center gap-2">
              <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                Level {currentLevel} Community Leader
              </Badge>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Your level is determined by your total donations and number of projects supported.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/charity/browse-projects">
              <Button className="bg-blue-600 hover:bg-blue-700 cursor-pointer">
                Donate to Level Up
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Level cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Level 1 */}
        <Card className={`relative overflow-hidden ${currentLevel >= 1 ? "border-green-500 shadow-md" : "opacity-90"}`}>
          {currentLevel === 1 && (
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-600"></div>
          )}
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Leaf className="h-5 w-5 text-green-600" /> Basic Contributor
                </CardTitle>
                <CardDescription>Level 1</CardDescription>
              </div>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                {currentLevel >= 1 ? "Achieved" : "Locked"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Requirements</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 flex-shrink-0 mt-0.5 text-green-600">
                      <CheckSquare className="h-5 w-5" />
                    </div>
                    <span>RM50 to 1 project</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Perks</h3>
                <ul className="space-y-3">
                  <li>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="flex items-start gap-2 w-full text-left">
                          <div className="h-5 w-5 flex-shrink-0 mt-0.5 text-green-600">
                            <BadgeCheck className="h-5 w-5" />
                          </div>
                          <span>Participation NFT</span>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p className="max-w-xs">
                            Receive a unique NFT certificate recognizing your contribution to Shariah-compliant
                            charitable causes.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </li>
                  <li>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="flex items-start gap-2 w-full text-left">
                          <div className="h-5 w-5 flex-shrink-0 mt-0.5 text-green-600">
                            <Gift className="h-5 w-5" />
                          </div>
                          <span>RM10 InvestSmart Voucher</span>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p className="max-w-xs">
                            Receive a RM10 voucher for SC Malaysia's InvestSmart platform to learn about
                            Shariah-compliant investments.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" disabled={currentLevel < 1}>
              {currentLevel >= 1 ? "Completed" : "Locked"}
            </Button>
          </CardFooter>
        </Card>

        {/* Level 2 */}
        <Card className={`relative overflow-hidden ${currentLevel >= 2 ? "border-amber-500 shadow-md" : "opacity-80"}`}>
          {currentLevel === 2 && (
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-amber-600"></div>
          )}
          {currentLevel < 2 && (
            <div className="absolute top-2 right-2">
              <Lock className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Sparkles className="h-5 w-5 text-amber-600" /> Community Leader
                </CardTitle>
                <CardDescription>Level 2</CardDescription>
              </div>
              <Badge
                className={
                  currentLevel >= 2
                    ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                    : "bg-muted text-muted-foreground"
                }
              >
                {currentLevel >= 2 ? "Achieved" : "Locked"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Requirements</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 flex-shrink-0 mt-0.5 text-amber-600">
                      <CheckSquare className="h-5 w-5" />
                    </div>
                    <span>RM800 total</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 flex-shrink-0 mt-0.5 text-amber-600">
                      <CheckSquare className="h-5 w-5" />
                    </div>
                    <span>3 projects</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Perks</h3>
                <ul className="space-y-3">
                  <li>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="flex items-start gap-2 w-full text-left">
                          <div className="h-5 w-5 flex-shrink-0 mt-0.5 text-amber-600">
                            <Award className="h-5 w-5" />
                          </div>
                          <span>2 Impact NFTs</span>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p className="max-w-xs">
                            Receive two exclusive NFTs that showcase your commitment to multiple Shariah-compliant
                            charitable projects.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </li>
                  <li>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="flex items-start gap-2 w-full text-left">
                          <div className="h-5 w-5 flex-shrink-0 mt-0.5 text-amber-600">
                            <Shield className="h-5 w-5" />
                          </div>
                          <span>20% Takaful Islamic Insurance Discount</span>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p className="max-w-xs">
                            Enjoy a 20% discount on selected Takaful (Islamic insurance) products from our partner
                            providers.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </li>
                  <li>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="flex items-start gap-2 w-full text-left">
                          <div className="h-5 w-5 flex-shrink-0 mt-0.5 text-amber-600">
                            <Calendar className="h-5 w-5" />
                          </div>
                          <span>Priority SCM's Workshop Access</span>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p className="max-w-xs">
                            Get priority access to SC Malaysia's financial literacy workshops and Shariah investment
                            seminars.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" disabled={currentLevel < 2}>
              {currentLevel >= 2 ? "Current Level" : "Locked"}
            </Button>
          </CardFooter>
        </Card>

        {/* Level 3 */}
        <Card className={`relative overflow-hidden ${currentLevel >= 3 ? "border-blue-500 shadow-md" : "opacity-70"}`}>
          {currentLevel === 3 && (
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-purple-600"></div>
          )}
          {currentLevel < 3 && (
            <div className="absolute top-2 right-2">
              <Lock className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Gem className="h-5 w-5 text-blue-600" /> Philanthropic Leader
                </CardTitle>
                <CardDescription>Level 3</CardDescription>
              </div>
              <Badge
                className={
                  currentLevel >= 3 ? "bg-blue-100 text-blue-800 hover:bg-blue-100" : "bg-muted text-muted-foreground"
                }
              >
                {currentLevel >= 3 ? "Achieved" : "Locked"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Requirements</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 flex-shrink-0 mt-0.5 text-blue-600">
                      <CheckSquare className="h-5 w-5" />
                    </div>
                    <span>RM2000 total</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 flex-shrink-0 mt-0.5 text-blue-600">
                      <CheckSquare className="h-5 w-5" />
                    </div>
                    <span>5 projects</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Perks</h3>
                <ul className="space-y-3">
                  <li>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="flex items-start gap-2 w-full text-left">
                          <div className="h-5 w-5 flex-shrink-0 mt-0.5 text-blue-600">
                            <Star className="h-5 w-5" />
                          </div>
                          <span>Finance Forum & Event Pass NFTs</span>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p className="max-w-xs">
                            Exclusive NFT that grants access to SC Malaysia's annual Islamic Finance Forum and
                            networking events.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </li>
                  <li>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="flex items-start gap-2 w-full text-left">
                          <div className="h-5 w-5 flex-shrink-0 mt-0.5 text-blue-600">
                            <FileText className="h-5 w-5" />
                          </div>
                          <span>Personalized Impact Report</span>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p className="max-w-xs">
                            Receive a personalized report detailing the social impact of your donations across all
                            supported projects.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </li>
                  <li>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="flex items-start gap-2 w-full text-left">
                          <div className="h-5 w-5 flex-shrink-0 mt-0.5 text-blue-600">
                            <FileText className="h-5 w-5" />
                          </div>
                          <span>1:1 Consultation with SC Experts</span>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p className="max-w-xs">
                          30-minute virtual session with SC’s Islamic finance advisors or ESG specialists to help users 
                          align personal finances with Shariah principle
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </li>
                  <li>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="flex items-start gap-2 w-full text-left">
                          <div className="h-5 w-5 flex-shrink-0 mt-0.5 text-blue-600">
                            <CheckSquare className="h-5 w-5" />
                          </div>
                          <span>All Level 2 Perks</span>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p className="max-w-xs">
                            Enjoy all the benefits of Level 2, including Takaful discounts and priority workshop access.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" disabled={currentLevel < 3}>
              {currentLevel >= 3 ? "Current Level" : "Locked"}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Shariah compliance notice */}
      <div className="mt-12 bg-blue-50 border border-blue-100 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" /> Shariah Compliance Statement
        </h3>
        <p className="text-muted-foreground">
          All donation levels and rewards are certified Shariah-compliant by our panel of Islamic finance experts. Our
          platform ensures that all charitable activities adhere to Islamic principles of transparency, ethical use of
          funds, and prohibition of riba (interest).
        </p>
      </div>
    </div>
  )
}
