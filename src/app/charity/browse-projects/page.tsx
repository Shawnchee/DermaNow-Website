"use client";

import type React from "react";
import { useEffect, useState, useCallback, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  X,
  ArrowRight,
  Users,
  Heart,
  Search,
  AlertCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import supabase from "@/utils/supabase/client";

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
  featured?: boolean;
  confidence?: number;
}

interface SearchResult {
  id: number;
  confidence: number;
}

const ProjectCard: React.FC<ProjectProps & { listView?: boolean }> = ({
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
  listView = false,
  confidence,
}) => (
  <div
    className={`bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 ${
      listView ? "flex flex-col md:flex-row w-full" : "h-full flex flex-col"
    }`}
  >
    <div className={`relative ${listView ? "md:w-1/3" : ""}`}>
      <img
        src={
          image || "/placeholder.svg?height=200&width=400&text=Project+Image"
        }
        alt={title}
        className={`${
          listView
            ? "w-full h-48 md:h-full object-cover"
            : "w-full h-48 object-cover"
        }`}
      />
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-2 bg-gradient-to-t from-black to-transparent pt-8">
        <div className="flex items-center space-x-2 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
          <Users className="h-4 w-4 text-white" />
          <span className="text-xs md:text-sm lg:text-base font-medium text-white">
            {supporters}
          </span>
        </div>
        <div className="flex items-center space-x-2 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
          <Heart className="h-4 w-4 text-white" />
          <span className="text-xs md:text-sm lg:text-base font-medium text-white">
            {amount.toLocaleString()} MYR
          </span>
        </div>
      </div>
      {/* {confidence !== undefined && (
        <div className="absolute top-2 right-2 z-10">
          <FireIcon confidence={confidence} />
        </div>
      )} */}
    </div>
    <div className={`p-4 ${listView ? "md:w-2/3" : "flex-1 flex flex-col"}`}>
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
        <div className="flex justify-between text-xs md:text-sm lg:text-base text-gray-500 mt-1">
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
      <div className="pl-2">
        <h3
          className={`font-semibold text-gray-800 mb-2 line-clamp-2 ${
            listView
              ? "text-base md:text-xl lg:text-2xl"
              : "text-base md:text-lg lg:text-xl"
          }`}
        >
          {title}
        </h3>
        <p
          className={`text-gray-600 line-clamp-3 mb-auto ${
            listView
              ? "text-sm md:text-lg lg:text-xl"
              : "text-sm md:text-base lg:text-lg"
          }`}
        >
          {description}
        </p>
      </div>
    </div>
  </div>
);

const FireIcon = ({ confidence }: { confidence: number }) => {
  // No icon for low confidence
  if (confidence < 0.35) return null;

  // Determine color based on confidence
  const color =
    confidence >= 0.4
      ? "text-red-500"
      : confidence < 0.4
      ? "text-yellow-500"
      : "text-green-500";

  return (
    <div className={`relative ${color}`}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0.8 }}
        animate={{
          scale: [0.8, 1, 0.9, 1.1, 0.9],
          opacity: [0.8, 1, 0.9, 1, 0.9],
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 1.5,
          ease: "easeInOut",
        }}
        className="absolute -top-1 -right-1"
      >
        <svg
          width="42"
          height="42"
          viewBox="0 0 12 20"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M8 16c3.314 0 6-2 6-5.5 0-1.5-.5-4-2.5-6 .25 1.5-1.25 2-1.25 2C11 4 9 .5 6 0c.357 2 .5 4-2 6-1.25 1-2 2.729-2 4.5C2 14 4.686 16 8 16m0-1c-1.657 0-3-1-3-2.75 0-.75.25-2 1.25-3C6.125 10 7 10.5 7 10.5c-.375-1.25.5-3.25 2-3.5-.179 1-.25 2 1 3 .625.5 1 1.364 1 2.25C11 14 9.657 15 8 15" />
        </svg>
      </motion.div>
    </div>
  );
};

const FeaturedProjectCard: React.FC<ProjectProps> = ({
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
  <div className="relative h-[400px] w-full rounded-xl overflow-hidden group">
    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10"></div>
    <img
      src={
        image || "/placeholder.svg?height=600&width=1200&text=Featured+Project"
      }
      alt={title}
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
    />
    <div className="absolute bottom-0 left-0 right-0 p-6 px-20 z-20 text-white">
      <div className="flex items-center mb-3">
        <div className="bg-blue-500 rounded-full p-1 mr-2">
          <Star className="h-4 w-4 text-white" fill="white" />
        </div>
        <span className="text-sm font-medium uppercase tracking-wider">
          Featured Project
        </span>
      </div>
      <h2 className="text-2xl md:text-3xl font-bold mb-2 drop-shadow-md">
        {title}
      </h2>
      <p className="text-white/80 mb-4 line-clamp-2 max-w-2xl drop-shadow-md">
        {description}
      </p>
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5" />
          <span className="font-medium">{supporters} Supporters</span>
        </div>
        <div className="flex items-center space-x-2">
          <Heart className="h-5 w-5" />
          <span className="font-medium">{amount.toLocaleString()} MYR</span>
        </div>
      </div>
      <div className="w-full bg-white/30 h-2 rounded-full mb-2 backdrop-blur-sm">
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
      <div className="flex justify-between text-xs text-white/90 mb-4">
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
  </div>
);

const FeaturedProjectsCarousel = ({
  projects,
}: {
  projects: ProjectProps[];
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const featuredProjects = projects.filter((project) => project.featured);

  const handlePrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? featuredProjects.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === featuredProjects.length - 1 ? 0 : prev + 1
    );
  };

  if (featuredProjects.length === 0) return null;

  return (
    <div className="relative mb-12 mt-6">
      <div className="overflow-hidden rounded-xl">
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link
                href={`/charity/browse-projects/${featuredProjects[currentIndex].id}`}
              >
                <FeaturedProjectCard {...featuredProjects[currentIndex]} />
              </Link>
            </motion.div>
          </AnimatePresence>
          <Button
            variant="secondary"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full h-10 w-10 shadow-lg z-30"
            onClick={handlePrevious}
          >
            <ChevronLeft className="h-6 w-6" />
            <span className="sr-only">Previous</span>
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full h-10 w-10 shadow-lg z-30"
            onClick={handleNext}
          >
            <ChevronRight className="h-6 w-6" />
            <span className="sr-only">Next</span>
          </Button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-30">
            {featuredProjects.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentIndex ? "bg-white" : "bg-white/50"
                }`}
                onClick={() => setCurrentIndex(index)}
              >
                <span className="sr-only">Slide {index + 1}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

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
              </ul>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" className="flex-1" onClick={onClose}>
                View All Projects
              </Button>
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700" asChild>
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

const PageContent = () => {
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
  const [categories, setCategories] = useState([]);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const initialProjectsRef = useRef<ProjectProps[]>([]);

  useEffect(() => {
    const success = searchParams.get("success");
    if (success === "true") {
      setShowSuccess(true);
    }

    const fetchProjects = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("charity_projects")
          .select("*")
          .eq("verified", true);

        if (error) {
          console.error("Failed to fetch projects:", error.message);
          return;
        }

        const projectsWithFeatured =
          data?.map((project, index) => ({
            ...project,
            featured: index % 5 === 0,
          })) || [];

        setProjects(projectsWithFeatured);
        setFilteredProjects(projectsWithFeatured);
        initialProjectsRef.current = projectsWithFeatured;
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("charity_category")
        .select("*");

      if (error) {
        console.error("Failed to fetch categories:", error.message);
      } else {
        setCategories(data ?? []);
      }
    };

    fetchProjects();
    fetchCategories();
  }, [searchParams]);

  const performSearch = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setIsSearching(false);
        setFilteredProjects(initialProjectsRef.current);
        setSearchLoading(false);
        return;
      }

      setIsSearching(true);
      setSearchLoading(true);
      setFilteredProjects([]); // Clear filteredProjects to prevent showing stale results

      try {
        const response = await fetch("http://localhost:8000/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        });

        if (!response.ok) throw new Error("Search failed");

        const results: SearchResult[] = await response.json();

        const projectMap = new Map(projects.map((p) => [p.id, p]));

        const sortedProjects = results
          .map((result) => {
            const project = projectMap.get(result.id);
            if (project) {
              return { ...project, confidence: result.confidence };
            }
            return undefined;
          })
          .filter(
            (p): p is ProjectProps & { confidence: number } => p !== undefined
          );

        setFilteredProjects(sortedProjects);
      } catch (error) {
        console.error("Search error:", error);
        setFilteredProjects([]); // Show no results on error
      } finally {
        setSearchLoading(false);
      }
    },
    [projects]
  );

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

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const displayedProjects = filteredProjects
    .filter((project) => {
      if (statusFilter === "completed") {
        return project.funding_complete && !project.in_progress;
      }
      if (statusFilter === "active") {
        return project.in_progress;
      }
      return true;
    })
    .filter((project) => {
      if (selectedCategories.length === 0) return true;
      return (
        project.category &&
        selectedCategories.every((cat) => project.category?.includes(cat))
      );
    })
    .sort((a, b) => {
      if (!searchQuery.trim()) {
        if (sortOption === "last-updated" || sortOption === "newest") {
          return b.id - a.id;
        }
        if (sortOption === "oldest") {
          return a.id - b.id;
        }
      }
      return 0;
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
      </div>
      <div className="w-full h-6 bg-gradient-to-r from-blue-100 to-white rounded-full mb-6"></div>
      {!isSearching && !loading && (
        <FeaturedProjectsCarousel projects={projects} />
      )}
      <div className="mt-6 mb-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-7 w-7" />
          <Input
            type="text"
            placeholder="Describe what you're looking for..."
            className="pl-14 bg-gray-50 border-gray-200 w-full py-7 placeholder:text-lg md:text-lg rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="flex justify-end mb-4">
        <div className="flex gap-4">
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
                      key={category.id}
                      onSelect={() => handleCategoryToggle(category.name)}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        checked={selectedCategories.includes(category.name)}
                        onCheckedChange={() =>
                          handleCategoryToggle(category.name)
                        }
                      />
                      <span>{category.name}</span>
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
      ) : searchQuery.trim() && searchLoading ? (
        <div className="flex justify-center items-center py-16">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Searching projects...</p>
          </div>
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
            {searchQuery.trim()
              ? "No projects match your search criteria. Try different keywords or browse all projects."
              : "Be the first to create a project and start making a difference today."}
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700" asChild>
            <Link href="/start-project">Start a Project</Link>
          </Button>
        </div>
      ) : (
        <div
          className={
            searchQuery.trim()
              ? "space-y-6"
              : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          }
        >
          {displayedProjects.map((project) => (
            <Link
              href={`/charity/browse-projects/${project.id}`}
              key={project.id}
              className={searchQuery.trim() ? "block w-full" : ""}
            >
              <ProjectCard
                {...project}
                listView={!!searchQuery.trim()}
                confidence={project.confidence}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const ProjectPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent />
    </Suspense>
  );
};

export default ProjectPage;
