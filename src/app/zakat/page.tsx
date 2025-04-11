"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  DollarSign,
  Coins,
  Scale,
  Briefcase,
  MinusCircle,
  Calculator,
  Info,
  AlertCircle,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function ZakatCalculator() {
  const [goldPrice, setGoldPrice] = useState<number | null>(null);
  const [silverPrice, setSilverPrice] = useState<number | null>(null);
  const [inputs, setInputs] = useState({
    cash: 0,
    gold: 0,
    silver: 0,
    business: 0,
    debts: 0,
  });
  const [result, setResult] = useState<null | {
    zakatable: number;
    zakatDue: number;
    eligible: boolean;
    nisab: number;
  }>(null);

  const [showPriceCards, setShowPriceCards] = useState(false);
  const [showInputs, setShowInputs] = useState(false);
  const [showTabs, setShowTabs] = useState(false);

  useEffect(() => {
    fetchPrices();

    // Progressive reveal timeline with longer delays
    const timer1 = setTimeout(() => setShowPriceCards(true), 400);
    const timer2 = setTimeout(() => setShowTabs(true), 800);
    const timer3 = setTimeout(() => setShowInputs(true), 1200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const fetchPrices = async () => {
    try {
      const goldPerGram = 438; // Replace with API call for live price
      const silverPerGram = 4.4; // Replace with API call for live price
      setGoldPrice(goldPerGram);
      setSilverPrice(silverPerGram);
    } catch (err) {
      console.error("Failed to fetch metal prices", err);
    }
  };

  const handleChange = (field: string, value: number) => {
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const calculateZakat = () => {
    if (!goldPrice || !silverPrice) return;

    const nisab = silverPrice * 612.36; // Nisab based on 85g of gold

    const goldValue = inputs.gold * goldPrice;
    const silverValue = inputs.silver * silverPrice;

    const totalAssets = inputs.cash + goldValue + silverValue + inputs.business;

    const netAssets = totalAssets - inputs.debts;

    const eligible = netAssets >= nisab;
    const zakatDue = eligible ? netAssets * 0.025 : 0;

    setResult({
      zakatable: netAssets,
      zakatDue,
      eligible,
      nisab,
    });
  };

  const allInputsFilled =
    inputs.cash > 0 &&
    inputs.gold > 0 &&
    inputs.silver > 0 &&
    inputs.business > 0;

  return (
    <div className="container mx-auto pt-24 pb-8 p-6 min-h-screen">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Zakat Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {goldPrice && silverPrice ? (
            <>
              {showPriceCards && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.1,
                      ease: "easeOut",
                    }}
                  >
                    <Card className="bg-amber-50 border-amber-200">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Coins className="h-5 w-5 text-amber-600" />
                            <span className="font-medium">Gold Price</span>
                          </div>
                          <Badge
                            variant="outline"
                            className="bg-amber-100 text-amber-800 border-amber-200"
                          >
                            Per Gram
                          </Badge>
                        </div>
                        <p className="text-2xl font-bold mt-2 text-amber-700">
                          RM {goldPrice.toFixed(2)}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.2,
                      ease: "easeOut",
                    }}
                  >
                    <Card className="bg-slate-50 border-slate-200">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Coins className="h-5 w-5 text-slate-600" />
                            <span className="font-medium">Silver Price</span>
                          </div>
                          <Badge
                            variant="outline"
                            className="bg-slate-100 text-slate-800 border-slate-200"
                          >
                            Per Gram
                          </Badge>
                        </div>
                        <p className="text-2xl font-bold mt-2 text-slate-700">
                          RM {silverPrice.toFixed(2)}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.3,
                      ease: "easeOut",
                    }}
                  >
                    <Card className="bg-emerald-50 border-emerald-200">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Scale className="h-5 w-5 text-emerald-600" />
                            <span className="font-medium">Nisab Threshold</span>
                          </div>
                          <Badge
                            variant="outline"
                            className="bg-emerald-100 text-emerald-800 border-emerald-200"
                          >
                            85g Gold
                          </Badge>
                        </div>
                        <p className="text-2xl font-bold mt-2 text-emerald-700">
                          RM {(goldPrice * 85).toFixed(2)}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              )}

              {showTabs && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                >
                  <Tabs defaultValue="assets" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="assets">Assets</TabsTrigger>
                      <TabsTrigger value="info">Zakat Information</TabsTrigger>
                    </TabsList>

                    <TabsContent value="assets" className="space-y-6 pt-4">
                      {showInputs && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{
                            duration: 0.5,
                            ease: "easeInOut",
                          }}
                          className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        >
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <label className="flex items-center gap-2 font-medium">
                                <DollarSign className="h-4 w-4 text-green-600" />
                                Cash (RM):
                              </label>
                              <Input
                                type="number"
                                onChange={(e) =>
                                  handleChange(
                                    "cash",
                                    Number.parseFloat(e.target.value || "0")
                                  )
                                }
                                className="border-green-200 focus-visible:ring-green-500"
                                placeholder="Enter cash amount"
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="flex items-center gap-2 font-medium">
                                <Coins className="h-4 w-4 text-amber-600" />
                                Gold (in grams):
                              </label>
                              <Input
                                type="number"
                                onChange={(e) =>
                                  handleChange(
                                    "gold",
                                    Number.parseFloat(e.target.value || "0")
                                  )
                                }
                                className="border-amber-200 focus-visible:ring-amber-500"
                                placeholder="Enter gold weight"
                              />
                              {inputs.gold > 0 && (
                                <p className="text-xs text-amber-600">
                                  Value: RM{" "}
                                  {(inputs.gold * (goldPrice || 0)).toFixed(2)}
                                </p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <label className="flex items-center gap-2 font-medium">
                                <Coins className="h-4 w-4 text-slate-600" />
                                Silver (in grams):
                              </label>
                              <Input
                                type="number"
                                onChange={(e) =>
                                  handleChange(
                                    "silver",
                                    Number.parseFloat(e.target.value || "0")
                                  )
                                }
                                className="border-slate-200 focus-visible:ring-slate-500"
                                placeholder="Enter silver weight"
                              />
                              {inputs.silver > 0 && (
                                <p className="text-xs text-slate-600">
                                  Value: RM{" "}
                                  {(inputs.silver * (silverPrice || 0)).toFixed(
                                    2
                                  )}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="space-y-2">
                              <label className="flex items-center gap-2 font-medium">
                                <Briefcase className="h-4 w-4 text-blue-600" />
                                Business Assets (RM):
                              </label>
                              <Input
                                type="number"
                                onChange={(e) =>
                                  handleChange(
                                    "business",
                                    Number.parseFloat(e.target.value || "0")
                                  )
                                }
                                className="border-blue-200 focus-visible:ring-blue-500"
                                placeholder="Enter business assets value"
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="flex items-center gap-2 font-medium">
                                <MinusCircle className="h-4 w-4 text-red-600" />
                                Debts (RM):
                              </label>
                              <Input
                                type="number"
                                onChange={(e) =>
                                  handleChange(
                                    "debts",
                                    Number.parseFloat(e.target.value || "0")
                                  )
                                }
                                className="border-red-200 focus-visible:ring-red-500"
                                placeholder="Enter debts amount"
                              />
                            </div>

                            <Alert className="bg-blue-50 border-blue-200 mt-4">
                              <Info className="h-4 w-4 text-blue-600" />
                              <AlertDescription className="text-blue-700 text-sm">
                                Enter all assets you've owned for a full lunar
                                year (Hawl)
                              </AlertDescription>
                            </Alert>
                          </div>
                        </motion.div>
                      )}

                      {showInputs && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: 0.2,
                            duration: 0.5,
                            ease: "easeOut",
                          }}
                        >
                          <Button
                            onClick={calculateZakat}
                            disabled={!allInputsFilled}
                            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            size="lg"
                          >
                            <Calculator className="mr-2 h-5 w-5" /> Calculate
                            Zakat
                          </Button>
                        </motion.div>
                      )}
                    </TabsContent>

                    <TabsContent value="info" className="space-y-4 pt-4">
                      <Card>
                        <CardContent className="pt-6 space-y-4">
                          <div>
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                              <Info className="h-5 w-5 text-blue-600" /> What is
                              Zakat?
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              Zakat is one of the five pillars of Islam. It is a
                              form of obligatory charity that has the potential
                              to ease the suffering of millions.
                            </p>
                          </div>

                          <Separator />

                          <div>
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                              <Scale className="h-5 w-5 text-blue-600" /> Nisab
                              Threshold
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              Nisab is the minimum amount a Muslim must have
                              before they are obligated to pay Zakat. It is
                              equivalent to 85 grams of gold or 595 grams of
                              silver.
                            </p>
                          </div>

                          <Separator />

                          <div>
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                              <Calculator className="h-5 w-5 text-blue-600" />{" "}
                              Zakat Rate
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              The standard rate for Zakat is 2.5% of your
                              eligible wealth that has been in your possession
                              for one lunar year.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </motion.div>
              )}

              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    ease: "easeOut",
                  }}
                >
                  <Card className="mt-8 overflow-hidden">
                    <CardHeader>
                      <CardTitle className="text-xl">
                        Your Zakat Results
                      </CardTitle>
                      <CardDescription>
                        Based on your current assets and liabilities
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Net Zakatable Assets:</span>
                            <span className="font-semibold flex justify-center">
                              RM {result.zakatable.toFixed(2)}
                            </span>
                          </div>
                          <Progress
                            value={
                              (result.zakatable / (result.nisab * 2)) * 100
                            }
                            max={100}
                            className="h-2 bg-slate-200"
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Nisab: RM {result.nisab.toFixed(2)}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Card
                            className={
                              result.eligible
                                ? "border-emerald-300 bg-emerald-50"
                                : "border-amber-300 bg-amber-50"
                            }
                          >
                            <CardContent className="pt-6">
                              <h3 className="text-lg font-semibold mb-2">
                                Zakat Status
                              </h3>
                              {result.eligible ? (
                                <div className="flex items-center gap-2 text-emerald-700">
                                  <Badge className="bg-emerald-200 text-emerald-800 hover:bg-emerald-200">
                                    Zakat is Wajib
                                  </Badge>
                                  <span className="text-sm">
                                    Your wealth exceeds Nisab
                                  </span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 text-amber-700">
                                  <Badge className="bg-amber-200 text-amber-800 hover:bg-amber-200">
                                    Zakat not Wajib
                                  </Badge>
                                  <span className="text-sm">
                                    Below Nisab threshold
                                  </span>
                                </div>
                              )}
                            </CardContent>
                          </Card>

                          <Card className="border-emerald-300 bg-emerald-50">
                            <CardContent className="pt-6">
                              <h3 className="text-lg font-semibold mb-2">
                                Zakat Due (2.5%)
                              </h3>
                              <p className="text-3xl font-bold text-emerald-700">
                                RM {result.zakatDue.toFixed(2)}
                              </p>
                            </CardContent>
                          </Card>
                        </div>

                        <Alert
                          className={
                            result.eligible
                              ? "bg-emerald-50 border-emerald-200"
                              : "bg-amber-50 border-amber-200"
                          }
                        >
                          <AlertCircle
                            className={
                              result.eligible
                                ? "h-4 w-4 text-emerald-600"
                                : "h-4 w-4 text-amber-600"
                            }
                          />
                          <AlertDescription
                            className={
                              result.eligible
                                ? "text-emerald-700 text-sm"
                                : "text-amber-700 text-sm"
                            }
                          >
                            {result.eligible
                              ? "💡 Tip: You may want to set a yearly Zakat reminder or automate future calculations."
                              : "💡 Tip: You're currently below the Nisab threshold. Keep tracking your assets over time."}
                          </AlertDescription>
                        </Alert>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center p-12"
            >
              <div className="text-center">
                <Loader2 className="animate-spin h-8 w-8 mx-auto text-emerald-600 mb-4" />
                <p className="text-gray-500">Loading gold & silver prices...</p>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
