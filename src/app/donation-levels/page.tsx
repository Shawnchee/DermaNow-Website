"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import {
  Award,
  BadgeCheck,
  Calendar,
  ChevronLeft,
  Gift,
  Heart,
  Lock,
  Shield,
  Star,
  CheckSquare,
  Info,
  Sparkles,
  Gem,
  Leaf,
  FileText,
  Coins,
  History,
  Trophy,
  Ticket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useWallet } from "@/context/wallet-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function DonationLevelsPage() {
  const { ethBalance } = useWallet();
  const [currentLevel] = useState(2); // This would be determined by user's donation history

  // Convert ETH balance to RM for display purposes
  const rmBalance = ethBalance
    ? (Number.parseFloat(ethBalance) * 7000).toFixed(2)
    : "0.00";

  const [userLevel, setUserLevel] = useState({
    level: 2,
    title: "Community Leader",
    progress: 87.5, // percentage to next level
    totalDonated: 1750, // in RM
    projectsSupported: 3,
    nextLevelRequirement: 2000, // in RM
    points: 1750, // 1 point per RM1 donated
    pointsHistory: [
      { date: "2023-12-15", amount: 500, project: "Education Fund" },
      { date: "2024-01-20", amount: 750, project: "Medical Relief" },
      { date: "2024-03-05", amount: 500, project: "Food Bank" },
    ],
  });

  const [isVoucherOpen, setIsVoucherOpen] = useState(false);
  const [availableVouchers, setAvailableVouchers] = useState([
    {
      id: 1,
      name: "Zus RM10 Voucher",
      points: 300,
      category: "f&b",
      image: "/images/voucher/zusv.jpg",
      description: "Redeemable at any Zus Malaysia outlet",
    },
    {
      id: 2,
      name: "Grab RM15 Ride",
      points: 500,
      category: "transportation",
      image: "/images/voucher/grabv.jpg",
      description: "Valid for Grab rides in Klang Valley",
    },
    {
      id: 3,
      name: "Lazada RM50 Voucher",
      points: 1500,
      category: "shopping",
      image: "/images/voucher/lazadav.jpg",
      description: "Applicable for minimum RM250 purchase",
    },
    {
      id: 4,
      name: "Shopee RM20 Voucher",
      points: 600,
      category: "shopping",
      image: "/images/voucher/shopeev.jpg",
      description: "Applicable for minimum RM130 purchase",
    },
    {
      id: 6,
      name: "KFC RM10 Voucher",
      points: 300,
      category: "f&b",
      image: "/images/voucher/kfcv.jpg",
      description: "Redeemable at any KFC Malaysia outlet",
    },
  ]);

  const [redeemedVouchers, setRedeemedVouchers] = useState([
    {
      id: 5,
      name: "RM5 Food Voucher",
      redeemedOn: "2024-02-10",
      expiresOn: "2024-04-10",
    },
  ]);

  const handleRedeemVoucher = (voucherId) => {
    const voucher = availableVouchers.find((v) => v.id === voucherId);
    if (voucher && userLevel.points >= voucher.points) {
      setUserLevel({
        ...userLevel,
        points: userLevel.points - voucher.points,
      });

      setAvailableVouchers(availableVouchers.filter((v) => v.id !== voucherId));
      setRedeemedVouchers([
        ...redeemedVouchers,
        {
          id: voucher.id,
          name: voucher.name,
          redeemedOn: new Date().toISOString().split("T")[0],
          expiresOn: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        },
      ]);

      alert(
        `Successfully redeemed ${voucher.name} for ${voucher.points} points!`
      );
    }
  };

  const getLevelIcon = () => {
    switch (userLevel.level) {
      case 1:
        return <Heart className="h-4 w-4 mr-1 text-green-600" />;
      case 2:
        return <Sparkles className="h-4 w-4 mr-1 text-amber-600" />;
      case 3:
        return <Gem className="h-4 w-4 mr-1 text-blue-600" />;
      default:
        return <Award className="h-4 w-4 mr-1" />;
    }
  };

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
  const scale = useTransform(smoothScrollY, [0, 0.5], [1, 0.8]);
  const opacity = useTransform(smoothScrollY, [0, 0.8], [1, 0.6]);

  return (
    <div
      className="container relative max-w-6xl mx-auto py-12 px-4 overflow-hidden"
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

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
        className="flex justify-center mb-6 relative"
        style={{ y: useTransform(smoothScrollY, [0, 1], [0, -30]) }}
      >
        <motion.img
          src="/steps.svg"
          alt="Steps Illustration"
          className="hidden md:block absolute right-0 top-10 w-66 h-auto"
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

      <motion.div
        className="mb-12 text-center"
        style={{ scale, opacity }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <motion.div
          className="flex justify-center mb-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Badge className="bg-blue-600 text-white px-4 py-1 text-sm">
            Shariah-Compliant Charity Platform
          </Badge>
        </motion.div>

        <motion.h1
          className="text-3xl md:text-4xl font-bold mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          style={{ y: useTransform(smoothScrollY, [0, 1], [0, -20]) }}
        >
          Donation Impact Levels
        </motion.h1>

        <motion.p
          className="text-lg text-muted-foreground max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          style={{ y: useTransform(smoothScrollY, [0, 1], [0, -10]) }}
        >
          Increase your impact and unlock exclusive benefits with our
          Shariah-compliant donation levels.
        </motion.p>
      </motion.div>

      <div className="mb-8">
        <Link href="/profile">
          <Button
            variant="ghost"
            className="flex items-center gap-2 cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" /> Back to Profile
          </Button>
        </Link>
      </div>

      <Card className="mb-8 border-blue-100 bg-gradient-to-r from-blue-50 to-emerald-50">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge className="bg-blue-100 text-blue-800 px-3 py-1 text-sm">
                  {getLevelIcon()} Level {userLevel.level}: {userLevel.title}
                </Badge>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Levels are based on total donations and number of
                        projects supported
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    RM{userLevel.totalDonated} / RM
                    {userLevel.nextLevelRequirement}
                  </span>
                  <span className="font-medium">{userLevel.progress}%</span>
                </div>
                <Progress value={userLevel.progress} className="h-2" />
                <p className="text-sm text-muted-foreground">
                  RM{userLevel.nextLevelRequirement - userLevel.totalDonated}{" "}
                  needed for Level {userLevel.level + 1}
                </p>
              </div>
            </div>

            <div className="space-y-4 border-l pl-6 md:pl-8">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Your Impact Summary</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-lg border">
                    <div className="text-sm text-muted-foreground">
                      Total Donated
                    </div>
                    <div className="text-xl font-bold mt-1">
                      RM{userLevel.totalDonated}
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border">
                    <div className="text-sm text-muted-foreground">
                      Projects Supported
                    </div>
                    <div className="text-xl font-bold mt-1">
                      {userLevel.projectsSupported}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center pt-4">
                <Link href="/charity/browse-projects">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Sparkles className="h-4 w-4 mr-2" /> Increase Your Impact
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6 mb-8 border border-purple-100">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold mb-1">Your Donation Points</h2>
            <p className="text-muted-foreground mb-2">
              Every RM1 donated equals 1 point
            </p>
            <div className="flex items-center gap-2">
              <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                <Coins className="h-4 w-4 mr-1" /> {userLevel.points} Points
                Available
              </Badge>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Use your points to redeem exclusive vouchers and rewards.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={isVoucherOpen} onOpenChange={setIsVoucherOpen}>
              <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700 cursor-pointer">
                  <Gift className="h-4 w-4 mr-2" /> Redeem Vouchers
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                  <DialogTitle>Redeem Your Points</DialogTitle>
                  <DialogDescription>
                    You have {userLevel.points} points available - Select a
                    category:
                  </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="f&b">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="f&b">Food & Beverage</TabsTrigger>
                    <TabsTrigger value="transportation">
                      Transportation
                    </TabsTrigger>
                    <TabsTrigger value="shopping">Shopping</TabsTrigger>
                    <TabsTrigger value="redeemed">Redeemed</TabsTrigger>
                  </TabsList>

                  <TabsContent value="f&b" className="mt-4">
                    <ScrollArea className="h-[400px] rounded-md border p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {availableVouchers
                          .filter((v) => v.category === "f&b")
                          .map((voucher) => (
                            <Card
                              key={voucher.id}
                              className={
                                userLevel.points >= voucher.points
                                  ? ""
                                  : "opacity-60"
                              }
                            >
                              <CardContent className="flex items-center gap-4 p-4">
                                <img
                                  src={voucher.image}
                                  alt={voucher.name}
                                  className="h-20 w-20 rounded-lg object-cover"
                                />
                                <div className="flex-1">
                                  <h3 className="font-semibold">
                                    {voucher.name}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    {voucher.description}
                                  </p>
                                  <div className="mt-2 flex items-center justify-between">
                                    <div className="flex items-center gap-1">
                                      <Coins className="h-4 w-4 text-amber-600" />
                                      <span className="font-medium">
                                        {voucher.points} points
                                      </span>
                                    </div>
                                    <Button
                                      size="sm"
                                      onClick={() =>
                                        handleRedeemVoucher(voucher.id)
                                      }
                                      disabled={
                                        userLevel.points < voucher.points
                                      }
                                    >
                                      Redeem
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="transportation" className="mt-4">
                    <ScrollArea className="h-[400px] rounded-md border p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {availableVouchers
                          .filter((v) => v.category === "transportation")
                          .map((voucher) => (
                            <Card
                              key={voucher.id}
                              className={
                                userLevel.points >= voucher.points
                                  ? ""
                                  : "opacity-60"
                              }
                            >
                              <CardContent className="flex items-center gap-4 p-4">
                                <img
                                  src={voucher.image}
                                  alt={voucher.name}
                                  className="h-20 w-20 rounded-lg object-cover"
                                />
                                <div className="flex-1">
                                  <h3 className="font-semibold">
                                    {voucher.name}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    {voucher.description}
                                  </p>
                                  <div className="mt-2 flex items-center justify-between">
                                    <div className="flex items-center gap-1">
                                      <Coins className="h-4 w-4 text-amber-600" />
                                      <span className="font-medium">
                                        {voucher.points} points
                                      </span>
                                    </div>
                                    <Button
                                      size="sm"
                                      onClick={() =>
                                        handleRedeemVoucher(voucher.id)
                                      }
                                      disabled={
                                        userLevel.points < voucher.points
                                      }
                                    >
                                      Redeem
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="shopping" className="mt-4">
                    <ScrollArea className="h-[400px] rounded-md border p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {availableVouchers
                          .filter((v) => v.category === "shopping")
                          .map((voucher) => (
                            <Card
                              key={voucher.id}
                              className={
                                userLevel.points >= voucher.points
                                  ? ""
                                  : "opacity-60"
                              }
                            >
                              <CardContent className="flex items-center gap-4 p-4">
                                <img
                                  src={voucher.image}
                                  alt={voucher.name}
                                  className="h-20 w-20 rounded-lg object-cover"
                                />
                                <div className="flex-1">
                                  <h3 className="font-semibold">
                                    {voucher.name}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    {voucher.description}
                                  </p>
                                  <div className="mt-2 flex items-center justify-between">
                                    <div className="flex items-center gap-1">
                                      <Coins className="h-4 w-4 text-amber-600" />
                                      <span className="font-medium">
                                        {voucher.points} points
                                      </span>
                                    </div>
                                    <Button
                                      size="sm"
                                      onClick={() =>
                                        handleRedeemVoucher(voucher.id)
                                      }
                                      disabled={
                                        userLevel.points < voucher.points
                                      }
                                    >
                                      Redeem
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="redeemed" className="mt-4">
                    <ScrollArea className="h-[400px] rounded-md border p-4">
                      {redeemedVouchers.length === 0 ? (
                        <div className="text-center text-muted-foreground py-8">
                          You haven't redeemed any vouchers yet
                        </div>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Voucher</TableHead>
                              <TableHead>Redeemed On</TableHead>
                              <TableHead>Expires On</TableHead>
                              <TableHead className="text-right">
                                Status
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {redeemedVouchers.map((voucher) => {
                              const isExpired =
                                new Date(voucher.expiresOn) < new Date();
                              return (
                                <TableRow key={voucher.id}>
                                  <TableCell className="font-medium">
                                    {voucher.name}
                                  </TableCell>
                                  <TableCell>{voucher.redeemedOn}</TableCell>
                                  <TableCell>{voucher.expiresOn}</TableCell>
                                  <TableCell className="text-right">
                                    <Badge
                                      variant={
                                        isExpired ? "destructive" : "default"
                                      }
                                      className={
                                        !isExpired
                                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                                          : ""
                                      }
                                    >
                                      {isExpired ? "Expired" : "Valid"}
                                    </Badge>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      )}
                    </ScrollArea>
                  </TabsContent>
                </Tabs>

                <DialogFooter className="mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsVoucherOpen(false)}
                  >
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <History className="h-4 w-4 mr-2" /> Points History
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Points History</DialogTitle>
                  <DialogDescription>
                    Track your donation points history and transactions.
                  </DialogDescription>
                </DialogHeader>

                <ScrollArea className="h-[400px] rounded-md border p-4 mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Project</TableHead>
                        <TableHead className="text-right">Points</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userLevel.pointsHistory.map((entry, index) => (
                        <TableRow key={index}>
                          <TableCell>{entry.date}</TableCell>
                          <TableCell>{entry.project}</TableCell>
                          <TableCell className="text-right">
                            +{entry.amount}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="mt-12 mb-6">
        <h2 className="text-2xl font-bold flex items-center">
          <Award className="h-5 w-5 mr-2 text-green-600" />
          Donation Levels Overview
        </h2>
        <p className="text-muted-foreground mt-2">
          Discover the benefits and requirements for each impact level
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card
          className={`relative overflow-hidden py-4 ${
            currentLevel >= 1 ? "border-green-500 shadow-md" : "opacity-90"
          }`}
        >
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
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Requirements
                </h3>
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
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Perks
                </h3>
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
                            Receive a unique NFT certificate recognizing your
                            contribution to Shariah-compliant charitable causes.
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
                            Receive a RM10 voucher for SC Malaysia's InvestSmart
                            platform to learn about Shariah-compliant
                            investments.
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
            <Button
              variant="outline"
              className="w-full"
              disabled={currentLevel < 1}
            >
              {currentLevel >= 1 ? "Completed" : "Locked"}
            </Button>
          </CardFooter>
        </Card>

        <Card
          className={`relative overflow-hidden py-4 ${
            currentLevel >= 2 ? "border-amber-500 shadow-md" : "opacity-80"
          }`}
        >
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
                  <Sparkles className="h-5 w-5 text-amber-600" /> Community
                  Leader
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
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Requirements
                </h3>
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
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Perks
                </h3>
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
                            Receive two exclusive NFTs that showcase your
                            commitment to multiple Shariah-compliant charitable
                            projects.
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
                            Enjoy a 20% discount on selected Takaful (Islamic
                            insurance) products from our partner providers.
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
                          <span>Monthly Free Workshop Access</span>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p className="max-w-xs">
                            Get access to various workshops including mental health, financial, meditation and many more. 
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
            <Button
              variant="outline"
              className="w-full"
              disabled={currentLevel < 2}
            >
              {currentLevel >= 2 ? "Current Level" : "Locked"}
            </Button>
          </CardFooter>
        </Card>

        <Card
          className={`relative overflow-hidden py-4 ${
            currentLevel >= 3 ? "border-blue-500 shadow-md" : "opacity-70"
          }`}
        >
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
                  currentLevel >= 3
                    ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                    : "bg-muted text-muted-foreground"
                }
              >
                {currentLevel >= 3 ? "Achieved" : "Locked"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Requirements
                </h3>
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
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Perks
                </h3>
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
                            Exclusive NFT that grants access to 
                            annual Islamic Finance Forum and networking events.
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
                            Receive a personalized report detailing the social
                            impact of your donations across all supported
                            projects.
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
                          <span>Free CTOS Score Report </span>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p className="max-w-xs">
                            Users can redeem a free comprehensive ctos score report (worth rm27.90) 
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
                            Enjoy all the benefits of Level 2, including Takaful
                            discounts and priority workshop access.
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
            <Button
              variant="outline"
              className="w-full"
              disabled={currentLevel < 3}
            >
              {currentLevel >= 3 ? "Current Level" : "Locked"}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-12 bg-blue-50 border border-blue-100 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" /> Shariah Compliance
          Statement
        </h3>
        <p className="text-muted-foreground">
          All donation levels and rewards are certified Shariah-compliant by our
          panel of Islamic finance experts. Our platform ensures that all
          charitable activities adhere to Islamic principles of transparency,
          ethical use of funds, and prohibition of riba (interest).
        </p>
      </div>
    </div>
  );
}
