"use client";

import type React from "react";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  X,
  ArrowRight,
  Calendar,
  Users,
  Heart,
  Search,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";

interface ProjectProps {
  id: number;
  title: string;
  description: string;
  image: string;
  funding_percentage?: number;
  funding_complete?: boolean;
  in_progress?: boolean;
  progress_percentage?: number;
  supporters: number;
  amount: number;
  category?: string[];
}

interface SearchResult {
  id: number;
  confidence: number;
}

// ProjectCard remains unchanged
const ProjectCard: React.FC<ProjectProps> = ({
  id,
  title,
  description,
  image,
  funding_percentage,
  funding_complete,
  in_progress,
  progress_percentage,
  supporters,
  amount,
}) => (
  <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
    <div className="relative">
      <img
        src={
          image || "/placeholder.svg?height=200&width=400&text=Project+Image"
        }
        alt={title}
        className="w-full h-48 object-cover"
      />
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-2 bg-gradient-to-t from-black/60 to-transparent text-white">
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4" />
          <span className="text-sm">{supporters}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Heart className="h-4 w-4" />
          <span className="text-sm">${amount.toLocaleString()}</span>
        </div>
      </div>
    </div>
    <div className="p-4">
      <div className="mb-2">
        <div className="bg-gray-200 h-2 rounded-full">
          <div
            className={`h-2 rounded-full ${
              in_progress
                ? "bg-yellow-500"
                : funding_complete
                ? "bg-green-500"
                : "bg-blue-500"
            }`}
            style={{
              width: `${
                in_progress ? progress_percentage || 0 : funding_percentage || 0
              }%`,
            }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>
            {funding_percentage === 100
              ? funding_complete
                ? "Complete"
                : "In Progress"
              : "Funding"}
          </span>
          <span>
            {in_progress ? `${progress_percentage}%` : `${funding_percentage}%`}
          </span>
        </div>
      </div>
      <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{title}</h3>
      <p className="text-sm text-gray-600 line-clamp-3">{description}</p>
    </div>
  </div>
);

// Updated SuccessDialog to show pending approval state
const SuccessDialog = ({ onClose }: { onClose: () => void }) => {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          {/* Updated header with pending status */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex items-center">
              <div className="bg-white rounded-full p-3 mr-4">
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
              <div>
                <h3 className="text-white text-xl font-bold">
                  Project Submitted!
                </h3>
                <p className="text-blue-100 text-sm">
                  Pending approval from our team
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <p className="text-gray-700 mb-4">
              Thank you for submitting your charity project! Our team will
              review your submission to ensure it meets our community
              guidelines. This typically takes 24-48 hours.
            </p>
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-blue-800 mb-3">What's next?</h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-1 mr-3 mt-0.5">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-sm text-blue-700">
                    You'll receive an email notification once your project is
                    approved
                  </span>
                </li>
                {/* <li className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-1 mr-3 mt-0.5">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-sm text-blue-700">
                    You can check your project status in your dashboard
                  </span>
                </li> */}
              </ul>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" className="flex-1" onClick={onClose}>
                View All Projects
              </Button>
              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                asChild
              >
                <Link href="/charity/start-project">
                  Create Another <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectProps[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ProjectProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortOption, setSortOption] = useState<string>("last-updated");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Define available categories
  const categories = [
    "Water & Sanitation",
    "Community Development",
    "Disaster Relief",
    "Food & Nutrition",
    "Education",
    "Children & Youth",
  ];

  // Fetch projects (initial load)
  useEffect(() => {
    const success = searchParams.get("success");
    if (success === "true") {
      setShowSuccess(true);
    }

    const fetchProjects = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockProjects: ProjectProps[] = [
        {
          id: 1,
          title: "Access to Clean Water in Rural Areas",
          description:
            "Providing clean and safe drinking water to underserved communities.",
          image:
            "https://images.pexels.com/photos/28101466/pexels-photo-28101466/free-photo-of-photo-of-children-drinking-water.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          funding_percentage: 44.5,
          supporters: 600,
          amount: 22250,
          category: ["Water & Sanitation", "Community Development"],
        },
        {
          id: 2,
          title: "Emergency Relief for Natural Disasters",
          description:
            "Delivering immediate aid to victims of natural disasters worldwide.",
          image:
            "https://images.pexels.com/photos/14000696/pexels-photo-14000696.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          funding_percentage: 100,
          funding_complete: true,
          supporters: 1000,
          amount: 167080,
          category: ["Disaster Relief"],
        },
        {
          id: 3,
          title: "Rebuilding Lives After Earthquakes",
          description:
            "Supporting earthquake survivors with shelter and essential supplies.",
          image:
            "https://images.pexels.com/photos/15861730/pexels-photo-15861730/free-photo-of-tents-in-a-refugee-camp.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          funding_percentage: 45.48,
          supporters: 5000,
          amount: 454900,
          category: ["Disaster Relief", "Community Development"],
        },
        {
          id: 4,
          title: "School Meals for Underprivileged Children",
          description:
            "Providing nutritious meals to children to support their education.",
          image:
            "https://images.pexels.com/photos/6995201/pexels-photo-6995201.jpeg",
          funding_percentage: 100,
          funding_complete: true,
          supporters: 1000,
          amount: 239090,
          category: ["Food & Nutrition", "Education", "Children & Youth"],
        },
        {
          id: 5,
          title: "Empowering Education Through Nutrition",
          description:
            "Ensuring children have access to meals to focus on their studies.",
          image:
            "https://images.pexels.com/photos/764681/pexels-photo-764681.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          funding_percentage: 100,
          in_progress: true,
          progress_percentage: 56.7,
          supporters: 492,
          amount: 88020,
          category: ["Food & Nutrition", "Education"],
        },
        {
          id: 6,
          title: "Building a Brighter Future for Students",
          description:
            "Providing meals to help students achieve their educational goals.",
          image:
            "https://images.pexels.com/photos/3401403/pexels-photo-3401403.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          funding_percentage: 100,
          funding_complete: true,
          supporters: 1000,
          amount: 123540,
          category: ["Food & Nutrition", "Education"],
        },
        {
          id: 7,
          title: "Supporting Education Through Meal Programs",
          description:
            "Helping children stay in school by providing daily meals.",
          image:
            "https://images.pexels.com/photos/8617558/pexels-photo-8617558.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          funding_percentage: 100,
          funding_complete: true,
          supporters: 1000,
          amount: 81080,
          category: ["Food & Nutrition", "Education", "Children & Youth"],
        },
        {
          id: 8,
          title: "Nutrition for Academic Success",
          description:
            "Providing meals to ensure children can focus on learning.",
          image:
            "https://images.pexels.com/photos/6590920/pexels-photo-6590920.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          funding_percentage: 100,
          funding_complete: true,
          supporters: 1000,
          amount: 92320,
          category: ["Food & Nutrition", "Education"],
        },
      ];
      setProjects(mockProjects);
      setFilteredProjects(mockProjects);
      setLoading(false);
    };

    fetchProjects();
  }, [searchParams]);

  // Debounced search function
  const performSearch = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setFilteredProjects(projects);
        return;
      }

      try {
        const response = await fetch("http://localhost:8000/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        });
        if (!response.ok) throw new Error("Search failed");
        const results: SearchResult[] = await response.json();

        // Create a map for quick lookup
        const projectMap = new Map(projects.map((p) => [p.id, p]));
        // Order projects based on search results
        const sortedProjects = results
          .map((result) => projectMap.get(result.id))
          .filter((p): p is ProjectProps => p !== undefined);

        // If no projects match, set to empty array
        setFilteredProjects(sortedProjects.length ? sortedProjects : []);
      } catch (error) {
        console.error("Search error:", error);
        setFilteredProjects(projects);
      }
    },
    [projects]
  );

  // Handle search query changes
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      performSearch(searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, performSearch]);

  const closeSuccessDialog = () => {
    setShowSuccess(false);
    router.replace("/charity/browse-projects");
  };

  // Handle category selection
  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Apply filters and sort
  const displayedProjects = filteredProjects
    .filter((project) => {
      // Status filter
      if (statusFilter === "completed") {
        return project.funding_complete && !project.in_progress;
      }
      if (statusFilter === "active") {
        return project.in_progress;
      }
      return true;
    })
    .filter((project) => {
      // Category filter
      if (selectedCategories.length === 0) return true;
      return (
        project.category &&
        selectedCategories.every((cat) => project.category?.includes(cat))
      );
    })
    .sort((a, b) => {
      // Only apply sorting if no search query is active
      if (!searchQuery.trim()) {
        if (sortOption === "last-updated" || sortOption === "newest") {
          return b.id - a.id;
        }
        if (sortOption === "oldest") {
          return a.id - b.id;
        }
      }
      return 0; // Preserve search result order
    });

  return (
    <div className="container mx-auto py-8 px-4">
      {showSuccess && <SuccessDialog onClose={closeSuccessDialog} />}

      <div className="text-center mb-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-blue-900">
          Browse Projects
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
          Find and contribute to meaningful causes that are changing lives
        </p>
        <div className="w-full h-6 bg-gradient-to-r from-blue-100 to-white rounded-full"></div>

        <div className="mt-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-7 w-7" />
            <Input
              type="text"
              placeholder="Describe what you're looking for..."
              className="pl-14 bg-gray-50 border-gray-200 w-full py-7 placeholder:text-lg md:text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <div className="flex gap-4">
          {/* Sort Option Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-40 justify-between font-medium"
              >
                <span>{sortOption === "all" ? "All" : "Sort by"}</span>
                <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40 p-0">
              <Command>
                <CommandGroup>
                  <CommandItem onSelect={() => setSortOption("last-updated")}>
                    Last Updated
                  </CommandItem>
                  <CommandItem onSelect={() => setSortOption("newest")}>
                    Newest
                  </CommandItem>
                  <CommandItem onSelect={() => setSortOption("oldest")}>
                    Oldest
                  </CommandItem>
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>

          {/* Status Filter Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-40 justify-between font-medium"
              >
                <span>{statusFilter === "all" ? "All" : statusFilter}</span>
                <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40 p-0">
              <Command>
                <CommandGroup>
                  <CommandItem onSelect={() => setStatusFilter("all")}>
                    All
                  </CommandItem>
                  <CommandItem onSelect={() => setStatusFilter("active")}>
                    In Progress
                  </CommandItem>
                  <CommandItem onSelect={() => setStatusFilter("completed")}>
                    Completed
                  </CommandItem>
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>

          {/* Multi-select Category Filter Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-40 justify-between font-medium"
              >
                {selectedCategories.length > 0
                  ? `${selectedCategories.length} selected`
                  : "Category"}
                <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-60 p-0">
              <Command>
                <CommandGroup>
                  {categories.map((category) => (
                    <CommandItem
                      key={category}
                      onSelect={() => handleCategoryToggle(category)}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => handleCategoryToggle(category)}
                      />
                      <span>{category}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="bg-white shadow-md rounded-lg overflow-hidden animate-pulse"
            >
              <div className="w-full h-48 bg-gray-200"></div>
              <div className="p-4">
                <div className="h-2 bg-gray-200 rounded-full w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded-full w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded-full w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : displayedProjects.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-blue-100 rounded-full p-4 inline-block mb-4">
            <Heart className="h-10 w-10 text-blue-500" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No projects found
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Be the first to create a project and start making a difference
            today.
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700" asChild>
            <Link href="/start-project">Start a Project</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedProjects.map((project) => (
            <Link href={`/charity/projects/${project.id}`} key={project.id}>
              <ProjectCard {...project} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
