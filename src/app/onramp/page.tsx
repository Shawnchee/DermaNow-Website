"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { motion } from "framer-motion"
import { QRCode } from "react-qrcode-logo"
import { toast } from "sonner"
import {
  CreditCard,
  Wallet,
  DollarSign,
  ArrowRight,
  Copy,
  Check,
  Smartphone,
  RefreshCw,
  ExternalLink,
  Loader2,
  AlertCircle,
  Info,
} from "lucide-react"
import connectMetamask from "@/hooks/connectMetamask"
import dynamic from "next/dynamic";

export default function OnrampPage() {
  const { walletAddress, connectWallet } = connectMetamask()
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState("MYR")
  const [paymentMethod, setPaymentMethod] = useState("ewallet")
  const [ewalletType, setEwalletType] = useState("qr-payment")
  const [loading, setLoading] = useState(false)
  const [transactionStatus, setTransactionStatus] = useState<"pending" | "processing" | "completed" | "failed" | null>(
    null,
  )
  const [qrExpiry, setQrExpiry] = useState(300) // 5 minutes in seconds
  const [qrRefreshing, setQrRefreshing] = useState(false)
  const [copied, setCopied] = useState(false)
  const [transactionRef, setTransactionRef] = useState<string>(""); // State for transaction ID


  // Mock transaction reference
  useEffect(() => {
    if (!transactionRef) {
      const generatedRef =
        "DermaNow" +
        Math.floor(Math.random() * 1000000)
          .toString()
          .padStart(6, "0");
      setTransactionRef(generatedRef);
    }
  }, [transactionRef]);

  // Mock payment address
  const paymentAddress = "0x7F5aB38C2Eb6485dBcf5c59D23B97CA2E1fd6F89"

  // Mock exchange rate
  const exchangeRate = 12500 // 1 ETH = 12,500 MYR

  // Calculate ETH amount based on fiat amount
  const calculateEthAmount = (fiatAmount: string) => {
    if (!fiatAmount) return "0"
    return (Number(fiatAmount) / exchangeRate).toFixed(6)
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!amount || Number(amount) <= 0) {
      toast("Please enter a valid amount", {
        description: "Amount must be greater than 0",
      })
      return
    }

    if (!walletAddress) {
      toast("Wallet not connected", {
        description: "Please connect your wallet first",
      })
      return
    }

    setLoading(true)
    setTransactionStatus("pending")

    // Simulate API call to payment provider
    setTimeout(() => {
      setLoading(false)
      setTransactionStatus("processing")

      // Start QR expiry countdown
      startQrExpiryCountdown()

      // Simulate transaction completion after some time
      setTimeout(() => {
        setTransactionStatus("completed")
      }, 3000) // 15 seconds for demo
    }, 2000)
  }

  // Copy payment address to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(paymentAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Refresh QR code
  const refreshQrCode = () => {
    setQrRefreshing(true)

    // Simulate API call to refresh QR code
    setTimeout(() => {
      setQrRefreshing(false)
      setQrExpiry(300) // Reset expiry to 5 minutes

      toast("QR Code refreshed", {
        description: "New QR code is valid for 5 minutes",
      })
    }, 1500)
  }

  // Start QR expiry countdown
  const startQrExpiryCountdown = () => {
    const interval = setInterval(() => {
      setQrExpiry((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }

  // Format time remaining
  const formatTimeRemaining = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Reset transaction
  const resetTransaction = () => {
    setTransactionStatus(null)
    setQrExpiry(300)
  }
  return (
    <div className="min-h-screen pt-8 pb-8 px-6 bg-zinc-50 dark:bg-zinc-950">
      <div className="container mx-auto px-4 py-12">

      
        <motion.div
          className="text-center max-w-4xl mx-auto mb-4"
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
            Powered by MoonPay
          </motion.div>

          <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="flex justify-center mb-4"
            >
              <img
                src="/icons/deposit.svg"
                alt="DeFi Icon"
                className="h-48 w-h-48"
              />
            </motion.div>

          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-800 to-blue-900 leading-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            Buy ETH with Local Currency
          </motion.h1>

          <motion.p
            className="text-lg text-gray-600 max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            Easily purchase ETH with your local currency and e-wallet. Funds will be sent directly to your Sepolia
            testnet wallet.
          </motion.p>

          {walletAddress ? (
            <motion.div
              className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-md border border-green-100 inline-block"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-800 font-medium">
                  Destination: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
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
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-6 rounded-lg text-lg h-auto group transition-all duration-300 hover:shadow-lg hover:shadow-green-200"
                onClick={connectWallet}
              >
                <span className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Connect Wallet First
                </span>
              </Button>
            </motion.div>
          )}
        </motion.div>
        <div className="max-w-4xl mx-auto">
          {transactionStatus ? (
            <Card className="border-blue-200 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-6 w-6 text-green-600 mr-2" />
                  {transactionStatus === "completed" ? "Purchase Complete" : "Complete Your Purchase"}
                </CardTitle>
                <CardDescription>
                  {transactionStatus === "pending"
                    ? "Preparing your transaction..."
                    : transactionStatus === "processing"
                      ? "Scan the QR code to complete your payment"
                      : transactionStatus === "completed"
                        ? "Your ETH has been sent to your wallet"
                        : "There was an issue with your transaction"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {transactionStatus === "pending" && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-12 w-12 text-green-600 animate-spin mb-4" />
                    <p className="text-lg font-medium">Preparing your transaction...</p>
                    <p className="text-gray-500 mt-2">This will only take a moment</p>
                  </div>
                )}

                {transactionStatus === "processing" && (
                  <div className="space-y-6">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Amount</span>
                        <div className="text-right">
                          <span className="font-mono text-sm">
                            {amount} {currency}
                          </span>
                          <div className="text-xs text-zinc-500">≈ {calculateEthAmount(amount)} ETH</div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Payment Method</span>
                        <span className="text-sm capitalize">{ewalletType}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="text-sm font-medium">Transaction Reference</span>
                        <span className="font-mono text-sm">{transactionRef}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="relative">
                        {qrRefreshing ? (
                          <div className="w-64 h-64 flex items-center justify-center bg-gray-100 rounded-lg">
                            <Loader2 className="h-8 w-8 text-green-600 animate-spin" />
                          </div>
                        ) : (
                          <>
                            <QRCode
                              value={`ethereum:${paymentAddress}?amount=${calculateEthAmount(amount)}&ref=${transactionRef}`}
                              size={256}
                              quietZone={10}
                              logoImage="/placeholder.svg?height=50&width=50"
                              logoWidth={50}
                              logoHeight={50}
                              qrStyle="dots"
                              eyeRadius={5}
                              bgColor="#FFFFFF"
                              fgColor="#000000"
                            />
                            {qrExpiry <= 0 && (
                              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg">
                                <AlertCircle className="h-10 w-10 text-amber-500 mb-2" />
                                <p className="font-medium text-gray-800">QR Code Expired</p>
                                <Button variant="outline" className="mt-3" onClick={refreshQrCode}>
                                  <RefreshCw className="h-4 w-4 mr-2" />
                                  Refresh QR Code
                                </Button>
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {qrExpiry > 0 && (
                        <div className="mt-2 text-sm text-gray-500">
                          QR code expires in {formatTimeRemaining(qrExpiry)}
                        </div>
                      )}

                      <div className="mt-4 text-center">
                        <p className="text-sm font-medium mb-2">Or pay to this address:</p>
                        <div className="flex items-center justify-center gap-2 bg-gray-100 px-3 py-2 rounded-md">
                          <span className="font-mono text-sm truncate max-w-[200px]">{paymentAddress}</span>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={copyToClipboard}>
                            {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-amber-800">This is a demo for presentation purposes</p>
                          <p className="text-xs text-amber-700 mt-1">
                            In a real implementation, this would connect to MoonPay's API for actual purchases. For this
                            demo, we're simulating the purchase flow.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {transactionStatus === "completed" && (
                  <div className="space-y-6">
                    <div className="flex flex-col items-center justify-center py-6">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <Check className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-medium text-gray-800 mb-2">Transaction Complete!</h3>
                      <p className="text-gray-600 text-center max-w-md mb-2">
                        {calculateEthAmount(amount)} ETH has been sent to your wallet on Sepolia testnet
                      </p>
                      <div className="text-sm text-gray-500">Transaction ID: {transactionRef}</div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Amount Purchased</span>
                        <div className="text-right">
                          <span className="font-mono text-sm font-bold">{calculateEthAmount(amount)} ETH</span>
                          <div className="text-xs text-zinc-500">
                            ≈ {amount} {currency}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Destination Wallet</span>
                        <span className="font-mono text-sm">
                          {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Network</span>
                        <span className="text-sm">Sepolia Testnet</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <Button
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => window.open(`https://sepolia.etherscan.io/address/${walletAddress}`, "_blank")}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View on Etherscan
                      </Button>
                      <Button variant="outline" className="w-full" onClick={resetTransaction}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Make Another Purchase
                      </Button>
                    </div>
                  </div>
                )}

                {transactionStatus === "failed" && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                      <AlertCircle className="h-8 w-8 text-red-600" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-800 mb-2">Transaction Failed</h3>
                    <p className="text-gray-600 text-center max-w-md mb-6">
                      There was an issue processing your transaction. Please try again.
                    </p>
                    <Button variant="outline" onClick={resetTransaction}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Try Again
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="border-blue-200 py-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-6 w-6 text-green-600 mr-2" />
                  Buy ETH with Local Currency
                </CardTitle>
                <CardDescription>Purchase ETH using your preferred payment method</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <Tabs defaultValue="ewallet" className="w-full mb-6">
                    <TabsList className="grid w-full grid-cols-3 mb-4">
                      <TabsTrigger value="ewallet" onClick={() => setPaymentMethod("ewallet")}>
                        <Smartphone className="h-4 w-4 mr-2" />
                        E-Wallet
                      </TabsTrigger>
                      <TabsTrigger value="bank" onClick={() => setPaymentMethod("bank")}>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Bank Transfer
                      </TabsTrigger>
                      <TabsTrigger value="card" onClick={() => setPaymentMethod("card")}>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Credit Card
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="ewallet">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="ewallet-type">Select E-Wallet</Label>
                          <RadioGroup
                            value={ewalletType}
                            onValueChange={setEwalletType}
                            className="grid grid-cols-2 gap-2"
                          >
                            <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-gray-50">
                              <RadioGroupItem value="qr-payment" id="qr-payment" />
                              <Label htmlFor="qr-payment" className="cursor-pointer">
                                QR Payment
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-gray-50">
                              <RadioGroupItem value="boost" id="boost" />
                              <Label htmlFor="boost" className="cursor-pointer">
                                Touch 'n Go
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-gray-50">
                              <RadioGroupItem value="grabpay" id="grabpay" />
                              <Label htmlFor="grabpay" className="cursor-pointer">
                                GrabPay
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-gray-50">
                              <RadioGroupItem value="maybank" id="maybank" />
                              <Label htmlFor="maybank" className="cursor-pointer">
                                MAE
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="bank">
                      <div className="space-y-4">
                        <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                          <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-amber-800">Demo Mode</p>
                              <p className="text-xs text-amber-700 mt-1">
                                Bank transfer functionality is simulated for this demo. In a real implementation, this
                                would connect to MoonPay's API.
                              </p>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">
                          Bank transfer is available but all options will use the QR code flow for this demo.
                        </p>
                      </div>
                    </TabsContent>

                    <TabsContent value="card">
                      <div className="space-y-4">
                        <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                          <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-amber-800">Demo Mode</p>
                              <p className="text-xs text-amber-700 mt-1">
                                Credit card functionality is simulated for this demo. In a real implementation, this
                                would connect to MoonPay's API.
                              </p>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">
                          Credit card payment is available but all options will use the QR code flow for this demo.
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="amount">Amount</Label>
                        <Input
                          id="amount"
                          type="number"
                          placeholder="0.00"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="currency">Currency</Label>
                        <select
                          id="currency"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={currency}
                          onChange={(e) => setCurrency(e.target.value)}
                        >
                          <option value="MYR">MYR (Malaysian Ringgit)</option>
                          <option value="USD">USD (US Dollar)</option>
                          <option value="SGD">SGD (Singapore Dollar)</option>
                        </select>
                      </div>
                    </div>

                    {amount && Number(amount) > 0 && (
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">You will receive approximately:</span>
                          <div className="text-right">
                            <span className="font-mono text-lg font-bold">{calculateEthAmount(amount)} ETH</span>
                            <div className="text-xs text-zinc-500">on Sepolia Testnet</div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-blue-800">Hackathon Demo</p>
                          <p className="text-xs text-blue-700 mt-1">
                            This is a simulated onramp service for demonstration purposes. No actual transactions will
                            be processed. In a real implementation, this would integrate with MoonPay's API to process
                            real transactions.
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-700"
                      disabled={!amount || Number(amount) <= 0 || !walletAddress || loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <ArrowRight className="h-4 w-4 mr-2" />
                          Continue to Payment
                        </>
                      )}
                    </Button>
                      
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col items-start">
                <div className="text-sm text-gray-500 mb-2">Powered by MoonPay</div>
                <div className="text-xs text-gray-400">
                  ETH will be sent to your connected wallet on the Sepolia testnet
                </div>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>

  )
}
