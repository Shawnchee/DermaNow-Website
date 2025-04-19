"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  User,
  History,
  Bell,
  Heart,
  Edit,
  Wallet,
  Copy,
  ArrowUpRight,
  Save,
  Camera,
  X,
  Award,
  Sparkles,
  Gem,
  ChevronUp,
  Droplet,
  LibraryBig,
  Apple,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useWallet } from "@/context/wallet-context";
import WalletTransaction from "@/components/wallet-address-transaction";
import MockupWalletAddress from "@/components/mockupwalletaddress";
import CompletedMilestones from "@/components/completed-milestone";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const { walletAddress, ethBalance, refreshBalance } = useWallet();
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // User level data - in a real app, this would come from the backend
  const [userLevel, setUserLevel] = useState({
    level: 2,
    title: "Community Leader",
    progress: 87.5, // percentage to next level
    totalDonated: 1750, // in RM
    projectsSupported: 3,
    nextLevelRequirement: 2000, // in RM
  });

  // Mock data
  const [profile, setProfile] = useState({
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Charity Lane, Giving City, GC 12345",
    avatar: "/placeholder.svg?height=64&width=64",
  });

  // Form state for editing
  const [formData, setFormData] = useState({ ...profile });

  // Initialize loading state
  useEffect(() => {
    // Set a timeout to ensure the wallet context has time to initialize
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Calculate short wallet address
  const shortWalletAddress = walletAddress
    ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(
        walletAddress.length - 4
      )}`
    : "Not Connected";

  const impactProjects = [
    {
      name: "Education for Kids in Rural Areas",
      progress: 56,
      raised: "0.1508 ETH",
      goal: "0.27 ETH",
      contributors: 128,
      description: "Providing clean water to communities in need",
    },
  ];

  const donationHistory = [
    {
      id: "0x3bef...277c",
      date: "Apr 11, 2023",
      amount: "0.05 ETH",
      charity: "Clean Water Initiative",
      status: "confirmed",
      txHash:
        "0x3bef8b66bf4de675a4ecd9a526c30e51116c01e603dc459b65437295953f277c",
    },
    {
      id: "0x8765...4321",
      date: "Mar 15, 2023",
      amount: "0.025 ETH",
      charity: "Food Bank Network",
      status: "confirmed",
      txHash:
        "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    },
    {
      id: "0x9876...5432",
      date: "Feb 28, 2023",
      amount: "0.1 ETH",
      charity: "Education for All",
      status: "confirmed",
      txHash:
        "0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456",
    },
    {
      id: "0x5432...9876",
      date: "Jan 05, 2023",
      amount: "0.075 ETH",
      charity: "Wildlife Conservation",
      status: "confirmed",
      txHash:
        "0xdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abc",
    },
  ];

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      setProfile(formData);
      toast({
        title: "Profile Updated",
        description: "Your personal information has been updated successfully.",
      });
    } else {
      // Start editing - initialize form data with current profile
      setFormData({ ...profile });
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Address Copied",
      description: "Wallet address copied to clipboard",
    });
  };

  const handleDepositFunds = () => {
    toast({
      title: "Deposit Initiated",
      description: "Please complete the transaction in your wallet.",
    });
    // This would typically open a wallet connection or transaction dialog
  };

  const handleAvatarEdit = () => {
    setIsEditingAvatar(true);
  };

  const handleAvatarCancel = () => {
    setIsEditingAvatar(false);
  };

  const handleFileInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a URL for the selected image
      const imageUrl = URL.createObjectURL(file);

      // Update the profile with the new avatar
      setProfile({
        ...profile,
        avatar: imageUrl,
      });

      // Also update form data if we're in edit mode
      setFormData({
        ...formData,
        avatar: imageUrl,
      });

      // Close the avatar edit mode
      setIsEditingAvatar(false);

      toast({
        title: "Profile Picture Updated",
        description: "Your profile picture has been updated successfully.",
      });
    }
  };

  // Get level icon based on user level
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

  // Show loading state
  if (isLoading) {
    return (
      <div className="container max-w-5xl mx-auto py-8 px-4 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading profile...</h2>
          <p className="text-muted-foreground">
            Please wait while we load your profile information.
          </p>
        </div>
      </div>
    );
  }

  // For preview purposes, always show the profile content
  return (
    <div className="container max-w-7xl mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Avatar
              className="h-16 w-16 cursor-pointer"
              onClick={handleAvatarEdit}
            >
              <AvatarImage
                src={profile.avatar || "/placeholder.svg"}
                alt={profile.name}
              />
              <AvatarFallback className="bg-emerald-100 text-emerald-800 text-xl">
                {profile.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            {/* Edit overlay */}
            <div
              className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              onClick={handleAvatarEdit}
            >
              <Edit className="h-5 w-5 text-white" />
            </div>

            {/* Avatar edit modal */}
            {isEditingAvatar && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">
                      Update Profile Picture
                    </h3>
                    <button
                      onClick={handleAvatarCancel}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="flex flex-col items-center gap-4 mb-6">
                    <Avatar className="h-24 w-24">
                      <AvatarImage
                        src={profile.avatar || "/placeholder.svg"}
                        alt={profile.name}
                      />
                      <AvatarFallback className="bg-emerald-100 text-emerald-800 text-2xl">
                        {profile.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />

                    <Button
                      onClick={handleFileInputClick}
                      className="flex items-center gap-2"
                    >
                      <Camera className="h-4 w-4" /> Choose New Picture
                    </Button>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={handleAvatarCancel}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{profile.name}</h1>
            <p className="text-muted-foreground">Donor since January 2023</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 hover:bg-amber-50"
          >
            <Sparkles className="h-3 w-3 mr-1 fill-amber-500" /> Impact Level 2
          </Badge>
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 hover:bg-blue-50"
          >
            5 Projects Supported
          </Badge>
        </div>
      </div>

      {/* New: Donation Level Card */}
      <Card className="mb-8 border-green-100 bg-gradient-to-r from-green-50 to-blue-50">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100 px-2 py-1">
                  {getLevelIcon()} Level {userLevel.level}: {userLevel.title}
                </Badge>
                <Link href="/donation-levels">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs text-muted-foreground"
                  >
                    View All Levels
                  </Button>
                </Link>
              </div>

              <div className="space-y-1 w-full">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    RM{userLevel.totalDonated} / RM
                    {userLevel.nextLevelRequirement}
                  </span>
                  <span className="font-medium">{userLevel.progress}%</span>
                </div>
                <Progress value={userLevel.progress} className="h-2" />
                <p className="text-sm text-muted-foreground">
                  Donate RM
                  {userLevel.nextLevelRequirement - userLevel.totalDonated} more
                  to reach Level {userLevel.level + 1}
                </p>
              </div>
            </div>

            <Link href="/donation-levels">
              <Button className="bg-green-600 hover:bg-green-700 flex items-center gap-1 cursor-pointer">
                <ChevronUp className="h-4 w-4" /> Level Up
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Wallet and Deposit Section */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-full">
                <Wallet className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Connected Wallet
                </p>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{shortWalletAddress}</span>
                  {walletAddress && (
                    <button
                      onClick={() => copyToClipboard(walletAddress)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Copy className="h-4 w-4 cursor-pointer" />
                    </button>
                  )}
                </div>
              </div>
            </div>
            <Link href="/deposit"></Link>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleDepositFunds}
            >
              <ArrowUpRight className="mr-2 h-4 w-4" /> Deposit Funds
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="wallet" className="w-full">
        <TabsList className="flex space-x-4 mb-2">
          <TabsTrigger value="wallet" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" /> Wallet
          </TabsTrigger>
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <User className="h-4 w-4" /> Personal
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" /> History
          </TabsTrigger>
          <TabsTrigger value="impact" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" /> Impact
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Bell className="h-4 w-4" /> Preferences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="wallet">
          <Card className="py-8">
            <CardHeader>
              <CardTitle>Token Balance</CardTitle>
              <CardDescription>
                Your available ETH for donations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mt-2">
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">🔷</div>
                    <div>
                      <h3 className="font-medium"> ETH</h3>
                      <p className="text-sm text-muted-foreground">
                        {ethBalance
                          ? `RM${(Number.parseFloat(ethBalance) * 7000).toFixed(
                              2
                            )}`
                          : "RM3,150.00"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{ethBalance || "0.45"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center mt-4">
              <Button
                variant="outline"
                onClick={refreshBalance}
                className="w-full"
              >
                Refresh Balance
              </Button>
            </CardFooter>
          </Card>

          <Card className="mt-6 py-8">
            <CardHeader>
              <CardTitle>Impact Projects</CardTitle>
              <CardDescription>
                Projects you're currently supporting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {impactProjects.map((project, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{project.name}</h3>
                      <span className="text-sm font-medium">
                        {project.progress}%
                      </span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>
                        {project.raised.replace("ETH", " ETH")} raised of{" "}
                        {project.goal.replace("ETH", " ETH")}
                      </span>
                      <span>{project.contributors} contributors</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/charity/browse-projects">
                <Button
                  variant="outline"
                  className="w-full mt-4 cursor-pointer"
                >
                  Explore More Projects
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="mt-6 py-8">
            <CardHeader>
              <CardTitle>NFT Impact Certificates</CardTitle>
              <CardDescription className="mb-4">
                Proof of your contributions on the blockchain
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4 flex flex-col items-center text-center">
                  <div className="w-full aspect-square bg-gradient-to-br from-blue-100 to-emerald-100 rounded-lg mb-3 flex items-center justify-center hover:scale-105 transition-transform duration-200">
                    <img
                      src="waternft.jpg"
                      alt="Clean Water Supporter"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="font-medium">Clean Water Supporter</h3>
                  <p className="text-sm text-muted-foreground">
                    Issued Apr 2025
                  </p>
                </div>
                <div className="border rounded-lg p-4 flex flex-col items-center text-center">
                  <div className="w-full aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg mb-3 flex items-center justify-center hover:scale-105 transition-transform duration-200">
                    <img
                      src="edunft.jpg"
                      alt="Education Advocate"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="font-medium">Education Advocate</h3>
                  <p className="text-sm text-muted-foreground">
                    Issued Mar 2025
                  </p>
                </div>
                <div className="border rounded-lg p-4 flex flex-col items-center text-center">
                  <div className="w-full aspect-square bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg mb-3 flex items-center justify-center hover:scale-105 transition-transform duration-200">
                    <img
                      src="foodnft.jpg"
                      alt="Food Security Champion"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="font-medium">Food Security Champion</h3>
                  <p className="text-sm text-muted-foreground">
                    Issued Feb 2025
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="personal">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Manage your personal details for communications
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleEditToggle}
                className="flex items-center gap-1"
              >
                {isEditing ? (
                  <>
                    <Save className="h-4 w-4" /> Save Changes
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4" /> Edit
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium text-muted-foreground"
                  >
                    Full Name
                  </Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <div className="font-medium">{profile.name}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-muted-foreground"
                  >
                    Email Address
                  </Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <div className="font-medium">{profile.email}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="phone"
                    className="text-sm font-medium text-muted-foreground"
                  >
                    Phone Number
                  </Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <div className="font-medium">{profile.phone}</div>
                  )}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label
                    htmlFor="address"
                    className="text-sm font-medium text-muted-foreground"
                  >
                    Mailing Address
                  </Label>
                  {isEditing ? (
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <div className="font-medium">{profile.address}</div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/50 flex flex-col items-start">
              <p className="text-sm text-muted-foreground">
                Your personal information is used for donation confirmations and
                impact updates. We never share your information with third
                parties.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <WalletTransaction />
        </TabsContent>

        <TabsContent value="impact">
          <CompletedMilestones />
          <Card>
            <CardHeader>
              <CardTitle>Impact Summary</CardTitle>
              <CardDescription>
                See the difference your donations have made
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <h3 className="text-2xl font-bold text-blue-700">0.25 ETH</h3>
                  <p className="text-sm text-blue-600">Total Donated</p>
                </div>
                <div className="bg-emerald-50 p-4 rounded-lg text-center">
                  <h3 className="text-2xl font-bold text-emerald-700">5</h3>
                  <p className="text-sm text-emerald-600">Projects Supported</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg text-center">
                  <h3 className="text-2xl font-bold text-amber-700">4</h3>
                  <p className="text-sm text-amber-600">Donation Campaigns</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Impact Stories</CardTitle>
              <CardDescription>
                Real stories of how your donations are making a difference
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <LibraryBig className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">
                        Education for Kids in Rural Areas
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your contribution helped fund essential electrical and
                        plumbing materials for the site developer. Thanks to
                        your support, 50 children will soon have access to
                        electricity and clean water once the work is completed.
                        🌟
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="bg-purple-50 text-purple-700 hover:bg-purple-50"
                        >
                          Education
                        </Badge>
                        <Badge
                          variant="outline"
                          className="bg-purple-50 text-purple-700 hover:bg-purple-50"
                        >
                          Children
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Apple className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">
                        Nutrition for Academic Success
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your support helped provide nutritious breakfast meals
                        to children, ensuring they start their day with the
                        energy and focus they need to learn and grow. 🎉
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="bg-purple-50 text-purple-700 hover:bg-purple-50"
                        >
                          Education
                        </Badge>
                        <Badge
                          variant="outline"
                          className="bg-purple-50 text-purple-700 hover:bg-purple-50"
                        >
                          Children
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Impact Stories
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Communication Preferences</CardTitle>
              <CardDescription>
                Manage how and when we contact you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates about your donations
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Monthly Newsletter</Label>
                    <p className="text-sm text-muted-foreground">
                      Stay updated on our charity partners
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get text alerts about donation processing
                    </p>
                  </div>
                  <Switch />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Project Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Updates from projects you've supported
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/50 flex flex-col items-start">
              <p className="text-sm text-muted-foreground">
                You can change your communication preferences at any time. We
                respect your privacy and will never share your contact
                information.
              </p>
            </CardFooter>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Blockchain Settings</CardTitle>
              <CardDescription>
                Manage your blockchain preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Gas Price Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get alerts when gas prices are low
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">
                      Transaction Confirmations
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications when transactions are confirmed
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">NFT Certificate Minting</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically mint NFT certificates for donations
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
