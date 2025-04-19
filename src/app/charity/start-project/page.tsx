"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  Upload,
  Calendar,
  Flag,
  Building,
  FileText,
  ImageIcon,
  Plus,
  Trash2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import supabase from "@/utils/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Sparkles, Wand2 } from "lucide-react";

interface ServiceProvider {
  id: string;
  name: string;
  service_type: string;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  provider_id: string;
  estimated_completion_date: string;
}

const StartProjectPage = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(25);
  const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goal_amount: "",
    location: "",
    organization_name: "",
    coverImage: null as File | null,
    documents: [] as File[],
  });

  // Milestones state
  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      id: "1",
      title: "",
      description: "",
      provider_id: "",
      estimated_completion_date: "",
    },
  ]);

  const [showAIModal, setShowAIModal] = useState(false);
  const [aiInstruction, setAiInstruction] = useState("");
  const [generatingDescription, setGeneratingDescription] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<number | null>(
    null
  );

  // Fetch service providers from Supabase
  useEffect(() => {
    const fetchServiceProviders = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("service_providers")
          .select("*");
        if (error) {
          console.error("Error fetching service providers:", error);
          return;
        }
        if (data) {
          console.log("Service Providers:", data);
          setServiceProviders(data);
        }
      } catch (error) {
        console.error("Error fetching service providers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceProviders();
  }, []);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle cover image upload
  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, coverImage: e.target.files![0] }));
    }
  };

  // Handle document uploads
  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newDocuments = [...formData.documents];
      for (let i = 0; i < e.target.files.length; i++) {
        newDocuments.push(e.target.files[i]);
      }
      setFormData((prev) => ({ ...prev, documents: newDocuments }));
    }
  };

  // Remove a document
  const removeDocument = (index: number) => {
    const newDocuments = [...formData.documents];
    newDocuments.splice(index, 1);
    setFormData((prev) => ({ ...prev, documents: newDocuments }));
  };

  // Handle milestone changes
  const handleMilestoneChange = (
    index: number,
    field: keyof Milestone,
    value: string
  ) => {
    const updatedMilestones = [...milestones];
    updatedMilestones[index] = {
      ...updatedMilestones[index],
      [field]: value,
    };
    setMilestones(updatedMilestones);
  };

  // Add a new milestone
  const addMilestone = () => {
    setMilestones((prev) => [
      ...prev,
      {
        id: `${prev.length + 1}`,
        title: "",
        description: "",
        provider_id: "",
        estimated_completion_date: "",
      },
    ]);
  };

  // Remove a milestone
  const removeMilestone = (index: number) => {
    if (milestones.length > 1) {
      const updatedMilestones = [...milestones];
      updatedMilestones.splice(index, 1);
      setMilestones(updatedMilestones);
    }
  };

  // Navigate to next step
  const nextStep = () => {
    const nextStepNumber = currentStep + 1;
    setCurrentStep(nextStepNumber);
    setProgress(nextStepNumber * 25);
  };

  // Navigate to previous step
  const prevStep = () => {
    const prevStepNumber = currentStep - 1;
    setCurrentStep(prevStepNumber);
    setProgress(prevStepNumber * 25);
  };

  // Generate AI description
  const generateAIDescription = async () => {
    setGeneratingDescription(true);
    try {
      const response = await fetch(
        "http://localhost:8000/chatbot/generate-description",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: formData.title,
            user_instruction: aiInstruction,
            current_description: formData.description,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate description");
      }

      const data = await response.json();

      // Split the response by paragraphs to create multiple suggestions
      const paragraphs = data.generated_description
        .split("\n\n")
        .filter((p: string) => p.trim().length > 0);

      // If there are no clear paragraphs, use the whole text as one suggestion
      setAiSuggestions(
        paragraphs.length > 1 ? paragraphs : [data.generated_description]
      );
      setSelectedSuggestion(null);
    } catch (error) {
      console.error("Error generating description:", error);
      alert("Failed to generate description. Please try again.");
    } finally {
      setGeneratingDescription(false);
    }
  };

  // Apply the selected AI suggestion
  const applyAISuggestion = () => {
    if (selectedSuggestion !== null) {
      setFormData((prev) => ({
        ...prev,
        description: aiSuggestions[selectedSuggestion],
      }));
      setShowAIModal(false);
      setAiSuggestions([]);
      setAiInstruction("");
    }
  };

  // Submit the form
  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      // Upload the cover image
      let coverImageUrl = null;
      if (formData.coverImage) {
        const { data, error } = await supabase.storage
          .from("project-assets")
          .upload(
            `cover-images/${Date.now()}-${formData.coverImage.name}`,
            formData.coverImage
          );

        if (error) {
          throw new Error(`Error uploading cover image: ${error.message}`);
        }
        coverImageUrl = data?.path
          ? supabase.storage.from("project-assets").getPublicUrl(data.path).data
              .publicUrl
          : null;
      }

      // Upload the documents
      const documentUrls = [];
      for (const document of formData.documents) {
        const { data, error } = await supabase.storage
          .from("project-assets")
          .upload(`documents/${Date.now()}-${document.name}`, document);

        if (error) {
          throw new Error(`Error uploading document: ${error.message}`);
        }
        if (data?.path) {
          const publicUrl = supabase.storage
            .from("project-assets")
            .getPublicUrl(data.path).data.publicUrl;
          documentUrls.push(publicUrl);
        }
      }

      // Create the project record in the database
      const { data: projectData, error: projectError } = await supabase
        .from("charity_projects")
        .insert({
          title: formData.title,
          description: formData.description,
          goal_amount: Number.parseFloat(formData.goal_amount),
          location: formData.location,
          organization_name: formData.organization_name,
          image: coverImageUrl,
          document_urls: documentUrls,
          verified: false,
        })
        .select()
        .single();

      if (projectError) {
        throw new Error(`Error creating project: ${projectError.message}`);
      }

      // Create milestone records in the database
      const milestonePromises = milestones.map((milestone) =>
        supabase.from("milestones").insert({
          project_id: projectData.id,
          title: milestone.title,
          description: milestone.description,
          provider_id: milestone.provider_id,
          estimated_completion_date: milestone.estimated_completion_date,
        })
      );

      const milestoneResults = await Promise.all(milestonePromises);
      milestoneResults.forEach(({ error }) => {
        if (error) {
          throw new Error(`Error creating milestone: ${error.message}`);
        }
      });

      // Redirect to the browse projects page with success parameter
      router.push("/charity/browse-projects?success=true");
    } catch (error) {
      console.error("Error submitting project:", error);
      alert(`Submission failed: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Start a Project
        </h1>
        <p className="text-gray-600 mb-6">
          Create a new fundraising project and make a difference
        </p>

        <div className="w-full mb-8">
          <Progress value={progress} className="h-2 bg-blue-100" />
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span
              className={cn(
                currentStep >= 1 ? "text-blue-600 font-medium" : ""
              )}
            >
              Project Details
            </span>
            <span
              className={cn(
                currentStep >= 2 ? "text-blue-600 font-medium" : ""
              )}
            >
              Organization Info
            </span>
            <span
              className={cn(
                currentStep >= 3 ? "text-blue-600 font-medium" : ""
              )}
            >
              Milestones
            </span>
            <span
              className={cn(
                currentStep >= 4 ? "text-blue-600 font-medium" : ""
              )}
            >
              Review
            </span>
          </div>
        </div>
      </div>

      <Card className="border-blue-100 shadow-md">
        <CardContent className="pt-6">
          {/* Step 1: Project Details */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center text-blue-700">
                <FileText className="mr-2 h-5 w-5" />
                Project Details
              </h2>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="title" className="text-gray-700">
                    Project Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter a clear, descriptive title"
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-gray-700">
                    Project Description
                  </Label>
                  <div className="mt-1 relative">
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your project, its goals, and impact"
                      className="min-h-[150px]"
                      required
                    />
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-xs text-gray-500">
                        {formData.description.length > 0
                          ? `${formData.description.length} characters`
                          : "Need inspiration? Try our AI description generator"}
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        onClick={() => setShowAIModal(true)}
                      >
                        <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                        Generate with AI
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="goal_amount" className="text-gray-700">
                    Funding Goal (RM)
                  </Label>
                  <Input
                    id="goal_amount"
                    name="goal_amount"
                    type="number"
                    value={formData.goal_amount}
                    onChange={handleInputChange}
                    placeholder="Enter amount in MYR"
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="location" className="text-gray-700">
                    Project Location
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="City, State"
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="coverImage" className="text-gray-700">
                    Cover Image
                  </Label>
                  <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    {formData.coverImage ? (
                      <div className="space-y-2">
                        <div className="relative w-full h-40 bg-gray-100 rounded-md overflow-hidden">
                          <img
                            src={
                              URL.createObjectURL(formData.coverImage) ||
                              "/placeholder.svg" ||
                              "/placeholder.svg"
                            }
                            alt="Cover preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-sm text-gray-500">
                          {formData.coverImage.name}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              coverImage: null,
                            }))
                          }
                        >
                          Change Image
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex justify-center">
                          <ImageIcon className="h-10 w-10 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-500">
                          Drag and drop an image, or click to browse
                        </p>
                        <Input
                          id="coverImage"
                          type="file"
                          accept="image/*"
                          onChange={handleCoverImageChange}
                          className="hidden"
                        />
                        <Button
                          variant="outline"
                          onClick={() =>
                            document.getElementById("coverImage")?.click()
                          }
                        >
                          Select Image
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <Button
                  onClick={nextStep}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Next Step <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Organization Info */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center text-blue-700">
                <Building className="mr-2 h-5 w-5" />
                Organization Information
              </h2>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="organization_name" className="text-gray-700">
                    Organization Name
                  </Label>
                  <Input
                    id="organization_name"
                    name="organization_name"
                    value={formData.organization_name}
                    onChange={handleInputChange}
                    placeholder="Enter your organization's name"
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label className="text-gray-700 block mb-2">
                    Proof of Organization
                    <span className="text-sm text-gray-500 font-normal ml-2">
                      (Business documents, invoice, tax forms)
                    </span>
                  </Label>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <div className="space-y-4">
                      {formData.documents.length > 0 ? (
                        <div className="space-y-3">
                          {formData.documents.map((doc, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between bg-blue-50 p-3 rounded-md"
                            >
                              <div className="flex items-center">
                                <FileText className="h-5 w-5 text-blue-500 mr-2" />
                                <span className="text-sm truncate max-w-[200px]">
                                  {doc.name}
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeDocument(index)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex justify-center">
                          <Upload className="h-10 w-10 text-gray-400" />
                        </div>
                      )}

                      <p className="text-sm text-gray-500">
                        Upload documents to verify your organization
                      </p>

                      <Input
                        id="documents"
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={handleDocumentUpload}
                        className="hidden"
                      />

                      <Button
                        variant="outline"
                        onClick={() =>
                          document.getElementById("documents")?.click()
                        }
                      >
                        Upload Documents
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
                <Button
                  onClick={nextStep}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Next Step <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Milestones */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center text-blue-700">
                <Flag className="mr-2 h-5 w-5" />
                Project Milestones
              </h2>

              <p className="text-gray-600 mb-6">
                Define key milestones for your project and assign service
                providers
              </p>

              <div className="space-y-6">
                {milestones.map((milestone, index) => (
                  <div
                    key={milestone.id}
                    className="border border-gray-200 rounded-lg p-4 bg-white"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium text-gray-800">
                        Milestone {index + 1}
                      </h3>
                      {milestones.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMilestone(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label
                          htmlFor={`milestone-title-${index}`}
                          className="text-gray-700"
                        >
                          Milestone Title
                        </Label>
                        <Input
                          id={`milestone-title-${index}`}
                          value={milestone.title}
                          onChange={(e) =>
                            handleMilestoneChange(
                              index,
                              "title",
                              e.target.value
                            )
                          }
                          placeholder="e.g., Initial Construction Phase"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor={`milestone-desc-${index}`}
                          className="text-gray-700"
                        >
                          Description
                        </Label>
                        <Textarea
                          id={`milestone-desc-${index}`}
                          value={milestone.description}
                          onChange={(e) =>
                            handleMilestoneChange(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Describe what will be accomplished in this milestone"
                          className="mt-1"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label
                            htmlFor={`milestone-provider-${index}`}
                            className="text-gray-700"
                          >
                            Service Provider
                          </Label>
                          <Select
                            value={milestone.provider_id}
                            onValueChange={(value) =>
                              handleMilestoneChange(index, "provider_id", value)
                            }
                          >
                            <SelectTrigger
                              id={`milestone-provider-${index}`}
                              className="mt-1"
                            >
                              <SelectValue placeholder="Select a service provider" />
                            </SelectTrigger>
                            <SelectContent>
                              {serviceProviders.map((provider) => (
                                <SelectItem
                                  key={provider.id}
                                  value={provider.id}
                                >
                                  {provider.name} ({provider.service_type})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label
                            htmlFor={`milestone-date-${index}`}
                            className="text-gray-700"
                          >
                            Estimated Completion Date
                          </Label>
                          <div className="relative mt-1">
                            <Input
                              id={`milestone-date-${index}`}
                              type="date"
                              value={milestone.estimated_completion_date}
                              onChange={(e) =>
                                handleMilestoneChange(
                                  index,
                                  "estimated_completion_date",
                                  e.target.value
                                )
                              }
                              className="mt-1"
                            />
                            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  variant="outline"
                  className="w-full border-dashed border-blue-300 text-blue-600 hover:bg-blue-50"
                  onClick={addMilestone}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Another Milestone
                </Button>
              </div>

              <div className="mt-8 flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
                <Button
                  onClick={nextStep}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Next Step <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center text-blue-700">
                <Check className="mr-2 h-5 w-5" />
                Review Your Project
              </h2>

              <p className="text-gray-600 mb-6">
                Please review your project details before submitting
              </p>

              <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h3 className="font-medium text-gray-700">
                      Project Details
                    </h3>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Title</p>
                        <p className="font-medium">
                          {formData.title || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium">
                          {formData.location || "Not provided"}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Description</p>
                      <p className="text-gray-700">
                        {formData.description || "Not provided"}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Funding Goal</p>
                        <p className="font-medium">
                          ${formData.goal_amount || "0"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Organization</p>
                        <p className="font-medium">
                          {formData.organization_name || "Not provided"}
                        </p>
                      </div>
                    </div>

                    {formData.coverImage && (
                      <div>
                        <p className="text-sm text-gray-500 mb-2">
                          Cover Image
                        </p>
                        <div className="w-full h-40 bg-gray-100 rounded-md overflow-hidden">
                          <img
                            src={
                              URL.createObjectURL(formData.coverImage) ||
                              "/placeholder.svg" ||
                              "/placeholder.svg"
                            }
                            alt="Cover preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h3 className="font-medium text-gray-700">Documents</h3>
                  </div>
                  <div className="p-4">
                    {formData.documents.length > 0 ? (
                      <ul className="space-y-2">
                        {formData.documents.map((doc, index) => (
                          <li
                            key={index}
                            className="flex items-center text-gray-700"
                          >
                            <FileText className="h-4 w-4 text-blue-500 mr-2" />
                            <span className="text-sm">{doc.name}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 text-sm">
                        No documents uploaded
                      </p>
                    )}
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h3 className="font-medium text-gray-700">Milestones</h3>
                  </div>
                  <div className="p-4">
                    {milestones.some((m) => m.title) ? (
                      <div className="space-y-4">
                        {milestones.map(
                          (milestone, index) =>
                            milestone.title && (
                              <div
                                key={index}
                                className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                              >
                                <h4 className="font-medium text-gray-800">
                                  {milestone.title}
                                </h4>
                                <p className="text-sm text-gray-600 mt-1">
                                  {milestone.description}
                                </p>
                                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-sm">
                                  {milestone.provider_id && (
                                    <div className="flex items-center text-gray-600">
                                      <Building className="h-3.5 w-3.5 text-blue-500 mr-1" />
                                      {serviceProviders.find(
                                        (p) => p.id === milestone.provider_id
                                      )?.name || "Unknown provider"}
                                    </div>
                                  )}
                                  {milestone.estimated_completion_date && (
                                    <div className="flex items-center text-gray-600">
                                      <Calendar className="h-3.5 w-3.5 text-blue-500 mr-1" />
                                      {new Date(
                                        milestone.estimated_completion_date
                                      ).toLocaleDateString()}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">
                        No milestones defined
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>Submit Project</>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* AI Description Generator Modal */}
      <Dialog open={showAIModal} onOpenChange={setShowAIModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center text-blue-700">
              <Wand2 className="h-5 w-5 mr-2" />
              AI Description Generator
            </DialogTitle>
            <DialogDescription>
              Let AI help you craft the perfect project description
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-2">
            <div>
              <Label htmlFor="ai-instruction" className="text-gray-700">
                What would you like the AI to focus on?
              </Label>
              <Textarea
                id="ai-instruction"
                value={aiInstruction}
                onChange={(e) => setAiInstruction(e.target.value)}
                placeholder="E.g., 'Create a compelling description for a clean water project that emphasizes community impact' or 'Write a description for an educational initiative focusing on sustainability'"
                className="mt-1 min-h-[80px]"
              />
            </div>

            {aiSuggestions.length > 0 && (
              <div className="space-y-3">
                <Label className="text-gray-700">AI Suggestions</Label>
                <div className="max-h-[300px] overflow-y-auto space-y-3 pr-1">
                  {aiSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className={cn(
                        "p-3 border rounded-md cursor-pointer transition-all",
                        selectedSuggestion === index
                          ? "border-blue-400 bg-blue-50"
                          : "border-gray-200 hover:border-blue-200 hover:bg-blue-50/50"
                      )}
                      onClick={() => setSelectedSuggestion(index)}
                    >
                      <p className="text-sm text-gray-700 whitespace-pre-line">
                        {suggestion}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowAIModal(false);
                setAiSuggestions([]);
                setAiInstruction("");
              }}
            >
              Cancel
            </Button>

            {aiSuggestions.length > 0 ? (
              <Button
                type="button"
                className="bg-blue-600 hover:bg-blue-700"
                onClick={applyAISuggestion}
                disabled={selectedSuggestion === null}
              >
                Apply Selected
              </Button>
            ) : (
              <Button
                type="button"
                className="bg-blue-600 hover:bg-blue-700"
                onClick={generateAIDescription}
                disabled={generatingDescription}
              >
                {generatingDescription ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate
                  </>
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StartProjectPage;
