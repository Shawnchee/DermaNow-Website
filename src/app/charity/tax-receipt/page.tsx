"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Check, Download, ArrowLeft, Printer } from "lucide-react";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TaxReceiptPage() {
  const router = useRouter();
  const [donationDetails, setDonationDetails] = useState<any>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    identificationNumber: "",
    address: "",
    email: "",
    phoneNumber: "",
    donorType: "Individual",
  });
  const [receiptGenerated, setReceiptGenerated] = useState(false);
  const [receiptNumber, setReceiptNumber] = useState("");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Add global print styles to ensure only the receipt is printed
  useEffect(() => {
    // Create a style element
    const style = document.createElement("style");
    style.innerHTML = `
      @media print {
        body * {
          visibility: hidden;
        }
        #printable-receipt, #printable-receipt * {
          visibility: visible;
        }
        #printable-receipt {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
      }
    `;
    // Append the style element to the head
    document.head.appendChild(style);

    // Clean up function to remove the style element when component unmounts
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    try {
      // Retrieve donation details from localStorage
      const storedDetails = localStorage.getItem("donationDetails");
      console.log("Retrieved donation details:", storedDetails);

      if (storedDetails) {
        const parsedDetails = JSON.parse(storedDetails);
        console.log("Parsed donation details:", parsedDetails);
        setDonationDetails(parsedDetails);
      } else {
        console.warn("No donation details found in localStorage");
        // If no donation details, redirect back to charity page
        router.push("/charity/browse-projects/");
      }

      // Generate a unique receipt number
      const generateReceiptNumber = () => {
        const timestamp = new Date().getTime();
        const random = Math.floor(Math.random() * 1000);
        return `RCPT-${timestamp}-${random}`;
      };

      setReceiptNumber(generateReceiptNumber());
    } catch (error) {
      console.error("Error in tax receipt initialization:", error);
      // Show an error message to the user
      alert(
        "There was an error loading your donation details. Redirecting to home page."
      );
      router.push("/charity/browse-projects");
    }
  }, [router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Save form data to localStorage for persistence
    localStorage.setItem("receiptFormData", JSON.stringify(formData));

    setReceiptGenerated(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMMM dd, yyyy");
    } catch (error) {
      return format(new Date(), "MMMM dd, yyyy");
    }
  };

  if (!donationDetails) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Button
        variant="outline"
        className="mb-6 print:hidden"
        onClick={() => router.push("/charity/browse-projects/5")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Charity Page
      </Button>

      {!receiptGenerated ? (
        <Card className="print:hidden shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-900">
              Tax Relief Receipt Information
            </CardTitle>
            <CardDescription>
              Please provide your details below to generate a tax relief receipt
              for your donation.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-8">
              <Card className="bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-blue-800 text-lg">
                    Donation Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Transaction Hash</span>
                    <div className="font-mono text-gray-700 truncate">
                      {donationDetails.txHash}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Amount</span>
                    <div className="font-medium text-gray-700">
                      {donationDetails.amount} ETH
                      <span className="block text-xs text-gray-500">
                        ≈ {donationDetails.amountMYR.toLocaleString()} MYR
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Date</span>
                    <div className="text-gray-700">
                      {formatDate(donationDetails.date)}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Project</span>
                    <div className="text-gray-700">
                      {donationDetails.projectTitle}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-gray-500">Milestone</span>
                    <div className="text-gray-700">
                      {donationDetails.milestoneDescription ||
                        "General Donation"}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-blue-800 text-lg">
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      placeholder="Enter name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="donorType">Donor Type</Label>
                    <Select
                      value={formData.donorType}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, donorType: value }))
                      }
                    >
                      <SelectTrigger id="donorType">
                        <SelectValue placeholder="Select Donor Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Individual">Individual</SelectItem>
                        <SelectItem value="Corporate">Corporate</SelectItem>
                        <SelectItem value="Organisation">
                          Organisation
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="identificationNumber">
                        IC Number / SSM / Organization Registration
                      </Label>
                      <Input
                        id="identificationNumber"
                        name="identificationNumber"
                        placeholder="Enter identification number"
                        value={formData.identificationNumber}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        placeholder="Enter phone number"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter email address"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Full Address</Label>
                    <Textarea
                      id="address"
                      name="address"
                      placeholder="Enter full address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="min-h-[100px]"
                    />
                  </div>
                </CardContent>
              </Card>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 my-5"
              >
                Generate Tax Receipt
              </Button>
            </CardFooter>
          </form>
        </Card>
      ) : (
        <div className="space-y-6">
          <Alert className="bg-green-50 border-green-200 print:hidden">
            <Check className="h-5 w-5 text-green-600" />
            <AlertTitle>Receipt Generated Successfully</AlertTitle>
            <AlertDescription>
              Your tax relief receipt has been generated. You can print or
              download it for your records.
            </AlertDescription>
          </Alert>

          <Card
            className="shadow-none print:border-none"
            id="printable-receipt"
          >
            <CardContent className="pt-6">
              <div className="border-b pb-4 mb-6 print:border-b-black">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-blue-800">
                      DermaNow
                    </h2>
                    <p className="text-gray-600">123 KPS, Lingkungan Budi</p>
                    <p className="text-gray-600">contact@dermanow.org</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-blue-800">
                      Tax Relief Receipt
                    </div>
                    <div className="text-gray-600">
                      Receipt #: {receiptNumber}
                    </div>
                    <div className="text-gray-600">
                      Date: {formatDate(donationDetails.date)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Donor Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Name:</p>
                    <p className="font-medium">{formData.fullName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Donor Type:</p>
                    <p className="font-medium">{formData.donorType}</p>
                  </div>

                  <div>
                    <p className="text-gray-600">ID Number:</p>
                    <p className="font-medium">
                      {formData.identificationNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Email:</p>
                    <p className="font-medium">{formData.email}</p>
                  </div>

                  <div>
                    <p className="text-gray-600">Phone:</p>
                    <p className="font-medium">
                      {formData.phoneNumber || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Address:</p>
                    <p className="font-medium">{formData.address}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Donation Details
                </h3>
                <div className="border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Description
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Amount (ETH)
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Amount (MYR)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div>
                            <p className="font-medium">
                              {donationDetails.projectTitle}
                            </p>
                            <p className="text-gray-600">
                              {donationDetails.milestoneDescription ||
                                "General Donation"}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-mono">
                          {donationDetails.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          {donationDetails.amountMYR.toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <th
                          scope="row"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Total
                        </th>
                        <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900 text-right font-mono">
                          {donationDetails.amount}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                          {donationDetails.amountMYR.toLocaleString()}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Transaction Information
                </h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-gray-600 mb-1">Transaction Hash:</p>
                  <p className="font-mono text-sm break-all">
                    {donationDetails.txHash}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Donation Purpose
                </h3>
                <div className="bg-blue-50 p-4 rounded-md">
                  <p className="font-medium mb-1">
                    {donationDetails.projectTitle}
                  </p>
                  <p className="text-gray-600">
                    {donationDetails.milestoneDescription ||
                      "General charitable donation"}
                  </p>
                  <div className="mt-3 pt-3 border-t border-blue-100">
                    <p className="text-sm text-gray-600">
                      This donation is eligible for tax relief under Income Tax
                      Act provisions for charitable contributions.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6 mt-6 print:border-t-black">
                <div className="text-center">
                  <p className="text-gray-600 mb-2">
                    This receipt is issued for tax relief purposes.
                  </p>
                  <p className="text-gray-600">
                    DermaNow is a registered non-profit organization.
                  </p>
                  <p className="text-gray-600">
                    Registration Number: NPO-12345-BC
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center space-x-4 print:hidden">
            <Button
              onClick={handlePrint}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print Receipt
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
