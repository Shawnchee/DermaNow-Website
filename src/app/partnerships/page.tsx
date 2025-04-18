"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Building, FileCheck, Shield, Users } from "lucide-react";

export default function PartnershipRegistration() {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would normally handle the form submission
    // For demo purposes, we'll just show a success message
    setFormSubmitted(true);
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-blue-800 sm:text-4xl mb-2">
          Institutional Partnership Program
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Join our network of Zakat and Waqf institutions to leverage blockchain technology
          for transparent, efficient, and Shariah-compliant fund management.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <Card className="bg-white shadow-md border-blue-100">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto bg-blue-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-blue-700" />
            </div>
            <CardTitle className="text-blue-800">Shariah Compliance</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-gray-600">
            <p>Our platform ensures strict adherence to Islamic financial principles, with built-in verification tools.</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md border-blue-100">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto bg-blue-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <FileCheck className="h-8 w-8 text-blue-700" />
            </div>
            <CardTitle className="text-blue-800">Complete Transparency</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-gray-600">
            <p>Blockchain verification offers immutable records of all transactions and disbursements.</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md border-blue-100">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto bg-blue-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-blue-700" />
            </div>
            <CardTitle className="text-blue-800">Efficient Administration</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-gray-600">
            <p>Reduce overhead with automated fund segregation, verification workflows, and milestone tracking.</p>
          </CardContent>
        </Card>
      </div>

      {!formSubmitted ? (
        <Card className="bg-white shadow-lg border-blue-100 max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-blue-800">Partner Registration</CardTitle>
            <CardDescription>
              Complete the form below to register your institution as a DermaNow partner.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="institution-name">Institution Name</Label>
                  <Input
                    id="institution-name"
                    placeholder="Enter the full legal name of your institution"
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="institution-type">Institution Type</Label>
                  <Select defaultValue="" required>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select institution type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="zakat">Zakat Collection Body</SelectItem>
                      <SelectItem value="waqf">Waqf Management Institution</SelectItem>
                      <SelectItem value="both">Both Zakat & Waqf</SelectItem>
                      <SelectItem value="other">Other Islamic Financial Institution</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contact-name">Contact Person</Label>
                    <Input
                      id="contact-name"
                      placeholder="Full name"
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact-position">Position/Title</Label>
                    <Input
                      id="contact-position"
                      placeholder="e.g. Director, Manager"
                      className="mt-1"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="contact@institution.org"
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+60 1234 5678"
                      className="mt-1"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="website">Institution Website</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://www.yourinstitution.org"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="registration">Registration Number</Label>
                  <Input
                    id="registration"
                    placeholder="Official registration ID with regulatory authorities"
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="about">About Your Institution</Label>
                  <Textarea
                    id="about"
                    placeholder="Tell us about your institution, its mission and scope of operations"
                    className="mt-1"
                    rows={4}
                    required
                  />
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox id="terms" className="mt-1" required />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I agree to the terms and conditions
                    </label>
                    <p className="text-sm text-gray-500">
                      By submitting this form, you agree to our partnership terms and privacy policy.
                    </p>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Submit Registration
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-white shadow-lg border-blue-100 max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-blue-800">Registration Submitted</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mx-auto bg-blue-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-6">
              <Building className="h-10 w-10 text-blue-700" />
            </div>
            <h3 className="text-xl font-medium text-blue-700 mb-4">Thank You for Your Interest!</h3>
            <p className="text-gray-600 mb-6">
              We have received your partnership registration. Our team will review your application 
              and contact you within 3-5 business days to discuss the next steps.
            </p>
            <Button 
              variant="outline"
              className="border-blue-600 text-blue-700 hover:bg-blue-50"
              onClick={() => setFormSubmitted(false)}
            >
              Back to Registration Form
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="mt-16 text-center">
        <p className="text-sm text-gray-500">
          For urgent inquiries, please contact us at{" "}
          <a href="mailto:partnerships@dermanow.org" className="text-blue-600 hover:underline">
            partnerships@dermanow.org
          </a>
        </p>
      </div>
    </div>
  );
}