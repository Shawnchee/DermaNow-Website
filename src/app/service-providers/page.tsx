"use client";

import type React from "react";
import { Suspense } from "react";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Filter,
  Briefcase,
  Wallet,
  Twitter,
  Instagram,
  Linkedin,
  Facebook,
  Star,
  MapPin,
  ExternalLink,
  ChevronDown,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import supabase from "@/utils/supabase/client";

interface ServiceProvider {
  id: string;
  name: string;
  logo: string;
  service_type: string;
  description: string;
  location: string;
  wallet_address: string;
  rating: number;
  verified: boolean;
  provider_portfolio: Portfolio[];
  provider_social_media: SocialMedia;
  contact_email: string;
  website: string;
  projects_completed: number;
}

interface Portfolio {
  id: string;
  title: string;
  description: string;
  image: string;
  url?: string;
}

interface SocialMedia {
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  facebook?: string;
}

const ServiceProvidersContent = () => {
  const searchParams = useSearchParams();
  const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>(
    []
  );
  const [filteredProviders, setFilteredProviders] = useState<ServiceProvider[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [serviceTypes, setServiceTypes] = useState<string[]>([]);
  const [selectedProvider, setSelectedProvider] =
    useState<ServiceProvider | null>(null);

  useEffect(() => {
    const initialType = searchParams.get("type") || "all";
    setSelectedType(initialType);

    const fetchServiceProviders = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from("service_providers")
          .select(`
              *,
              provider_portfolio (
                id,
                title,
                description,
                image
              ),
              provider_social_media (
                twitter,
                linkedin,
                instagram
              )
            `);

        if (error) {
          console.error("Error fetching service providers:", error);
          return;
        }
        setServiceProviders(data);

        // Extract unique service types from fetched data
        const types = Array.from(
          new Set(data.map((provider) => provider.service_type))
        );
        setServiceTypes(types);

        // Apply filtering based on initial query param
        if (initialType !== "all") {
          setFilteredProviders(
            data.filter((provider) => provider.service_type === initialType)
          );
        } else {
          setFilteredProviders(data);
        }
      } catch (err) {
        console.error("Unexpected error fetching service providers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceProviders();
  }, [searchParams]);

  // Filter providers based on search query and selected type
  useEffect(() => {
    let filtered = [...serviceProviders];

    // Filter by type
    if (selectedType !== "all") {
      filtered = filtered.filter(
        (provider) => provider.service_type === selectedType
      );
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (provider) =>
          provider.name.toLowerCase().includes(query) ||
          provider.description.toLowerCase().includes(query) ||
          provider.service_type.toLowerCase().includes(query) ||
          provider.location.toLowerCase().includes(query)
      );
    }

    setFilteredProviders(filtered);
  }, [selectedType, searchQuery, serviceProviders]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle service type selection
  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
  };

  // Truncate wallet address for display
  const truncateWalletAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  // Render social media links
  const renderSocialLinks = (social: SocialMedia) => {
    if (!social) return null;
    return (
      <div className="flex space-x-2">
        {social.twitter && (
          <a
            href={`https://twitter.com/${social.twitter}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-blue-500"
          >
            <Twitter className="h-4 w-4" />
          </a>
        )}
        {social.instagram && (
          <a
            href={`https://instagram.com/${social.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-pink-500"
          >
            <Instagram className="h-4 w-4" />
          </a>
        )}
        {social.linkedin && (
          <a
            href={`https://linkedin.com/company/${social.linkedin}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-blue-700"
          >
            <Linkedin className="h-4 w-4" />
          </a>
        )}
        {social.facebook && (
          <a
            href={`https://facebook.com/${social.facebook}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-blue-600"
          >
            <Facebook className="h-4 w-4" />
          </a>
        )}
      </div>
    );
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="container mx-auto py-8 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-blue-900">
            Service Providers
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Connect with verified service providers who specialize in various
            aspects of charity and community development projects.
          </p>
          <div className="w-full h-6 bg-gradient-to-r from-blue-100 to-white rounded-full mt-6"></div>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search service providers..."
                className="pl-10 bg-white border-gray-200"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-sm text-gray-500 whitespace-nowrap">
                Filter by:
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    {selectedType === "all" ? "All Categories" : selectedType}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem
                    className={
                      selectedType === "all" ? "bg-blue-50 text-blue-600" : ""
                    }
                    onClick={() => handleTypeSelect("all")}
                  >
                    All Categories
                  </DropdownMenuItem>
                  {serviceTypes.map((type) => (
                    <DropdownMenuItem
                      key={type}
                      className={
                        selectedType === type ? "bg-blue-50 text-blue-600" : ""
                      }
                      onClick={() => handleTypeSelect(type)}
                    >
                      {type}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge
              variant={selectedType === "all" ? "default" : "outline"}
              className={`cursor-pointer ${
                selectedType === "all"
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "hover:bg-blue-50"
              }`}
              onClick={() => handleTypeSelect("all")}
            >
              All
            </Badge>
            {serviceTypes.map((type) => (
              <Badge
                key={type}
                variant={selectedType === type ? "default" : "outline"}
                className={`cursor-pointer ${
                  selectedType === type
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "hover:bg-blue-50"
                }`}
                onClick={() => handleTypeSelect(type)}
              >
                {type}
              </Badge>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">
            Showing{" "}
            <span className="font-medium">{filteredProviders.length}</span>{" "}
            service providers
            {selectedType !== "all" && (
              <>
                {" "}
                in <span className="font-medium">{selectedType}</span>
              </>
            )}
          </p>

          {selectedType !== "all" && (
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700"
              onClick={() => handleTypeSelect("all")}
            >
              <X className="h-4 w-4 mr-1" /> Clear filter
            </Button>
          )}
        </div>

        {/* Service Providers Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-md" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <Skeleton className="h-3 w-full mb-2" />
                  <Skeleton className="h-3 w-full mb-2" />
                  <Skeleton className="h-3 w-2/3" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-9 w-full rounded-md" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : filteredProviders.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No service providers found
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              We couldn't find any service providers matching your criteria. Try
              adjusting your filters or search terms.
            </p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setSelectedType("all");
              }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProviders.map((provider) => (
              <Card
                key={provider.id}
                className="overflow-hidden hover:shadow-md transition-shadow flex flex-col"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-md overflow-hidden bg-blue-100 flex-shrink-0">
                      <img
                        src={provider.logo || "/placeholder.svg"}
                        alt={`${provider.name} logo`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {provider.name}
                        {provider.verified && (
                          <Badge
                            variant="outline"
                            className="ml-1 bg-blue-50 text-blue-600 border-blue-200"
                          >
                            Verified
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <Briefcase className="h-3 w-3" />
                        {provider.service_type}
                        <span className="mx-1">•</span>
                        <MapPin className="h-3 w-3" />
                        {provider.location}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-2 flex-grow">
                  <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                    {provider.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="h-4 w-4 fill-amber-500" />
                      <span className="font-medium">{provider.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <Briefcase className="h-4 w-4" />
                      <span>{provider.projects_completed} projects</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-gray-500 text-xs">
                      <Wallet className="h-3 w-3" />
                      <span className="font-mono">
                        {truncateWalletAddress(provider.wallet_address)}
                      </span>
                    </div>
                    <div>{renderSocialLinks(provider.social_media)}</div>
                  </div>
                </CardContent>
                <CardFooter className="pt-2 mt-auto">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => setSelectedProvider(provider)}
                      >
                        View Portfolio
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      {selectedProvider &&
                        selectedProvider.id === provider.id && (
                          <>
                            <DialogHeader>
                              <div className="flex items-center gap-4">
                                <div className="h-16 w-16 rounded-md overflow-hidden bg-blue-100">
                                  <img
                                    src={
                                      selectedProvider.logo ||
                                      "/placeholder.svg"
                                    }
                                    alt={`${selectedProvider.name} logo`}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div>
                                  <DialogTitle className="text-2xl flex items-center gap-2">
                                    {selectedProvider.name}
                                    {selectedProvider.verified && (
                                      <Badge className="ml-1 bg-blue-50 text-blue-600 border-blue-200">
                                        Verified
                                      </Badge>
                                    )}
                                  </DialogTitle>
                                  <DialogDescription className="flex items-center gap-2 mt-1">
                                    <span className="flex items-center gap-1">
                                      <Briefcase className="h-4 w-4" />
                                      {selectedProvider.service_type}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <MapPin className="h-4 w-4" />
                                      {selectedProvider.location}
                                    </span>
                                    <span className="flex items-center gap-1 text-amber-500">
                                      <Star className="h-4 w-4 fill-amber-500" />
                                      <span className="font-medium">
                                        {selectedProvider.rating}
                                      </span>
                                    </span>
                                  </DialogDescription>
                                </div>
                              </div>
                            </DialogHeader>

                            <Tabs defaultValue="portfolio" className="mt-6">
                              <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="portfolio">
                                  Portfolio
                                </TabsTrigger>
                                <TabsTrigger value="about">About</TabsTrigger>
                                <TabsTrigger value="contact">
                                  Contact
                                </TabsTrigger>
                              </TabsList>
                              <TabsContent value="portfolio" className="mt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {selectedProvider.provider_portfolio.map(
                                    (item) => (
                                      <Card
                                        key={item.id}
                                        className="overflow-hidden"
                                      >
                                        <div className="h-24 w-full overflow-hidden">
                                          <img
                                            src={
                                              item.image || "/placeholder.svg"
                                            }
                                            alt={item.title}
                                            className="h-full w-full object-cover"
                                          />
                                        </div>
                                        <CardHeader className="pb-2">
                                          <CardTitle className="text-lg">
                                            {item.title}
                                          </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <p className="text-sm text-gray-600">
                                            {item.description}
                                          </p>
                                        </CardContent>
                                        {item.url && (
                                          <CardFooter className="pt-0">
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              asChild
                                            >
                                              <Link
                                                href={item.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                              >
                                                View Project{" "}
                                                <ExternalLink className="ml-2 h-3 w-3" />
                                              </Link>
                                            </Button>
                                          </CardFooter>
                                        )}
                                      </Card>
                                    )
                                  )}
                                </div>
                              </TabsContent>
                              <TabsContent value="about" className="mt-4">
                                <Card>
                                  <CardHeader>
                                    <CardTitle>
                                      About {selectedProvider.name}
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-4">
                                    <p>{selectedProvider.description}</p>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <h4 className="font-medium text-gray-700 mb-1">
                                          Projects Completed
                                        </h4>
                                        <p className="text-2xl font-bold text-blue-600">
                                          {selectedProvider.projects_completed}
                                        </p>
                                      </div>
                                      <div>
                                        <h4 className="font-medium text-gray-700 mb-1">
                                          Service Type
                                        </h4>
                                        <p>{selectedProvider.service_type}</p>
                                      </div>
                                      <div>
                                        <h4 className="font-medium text-gray-700 mb-1">
                                          Location
                                        </h4>
                                        <p>{selectedProvider.location}</p>
                                      </div>
                                      <div>
                                        <h4 className="font-medium text-gray-700 mb-1">
                                          Rating
                                        </h4>
                                        <div className="flex items-center gap-1">
                                          <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                                          <span className="font-medium">
                                            {selectedProvider.rating}
                                          </span>
                                          <span className="text-gray-500 text-sm">
                                            /5
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </TabsContent>
                              <TabsContent value="contact" className="mt-4">
                                <Card>
                                  <CardHeader>
                                    <CardTitle>Contact Information</CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div>
                                        <h4 className="font-medium text-gray-700 mb-1">
                                          Email
                                        </h4>
                                        <p className="flex items-center gap-2">
                                          <a
                                            href={`mailto:${selectedProvider.contact_email}`}
                                            className="text-blue-600 hover:underline"
                                          >
                                            {selectedProvider.contact_email}
                                          </a>
                                        </p>
                                      </div>
                                      <div>
                                        <h4 className="font-medium text-gray-700 mb-1">
                                          Website
                                        </h4>
                                        <p className="flex items-center gap-2">
                                          <a
                                            href={selectedProvider.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline flex items-center"
                                          >
                                            {selectedProvider.website.replace(
                                              /^https?:\/\//,
                                              ""
                                            )}
                                            <ExternalLink className="ml-1 h-3 w-3" />
                                          </a>
                                        </p>
                                      </div>
                                      <div>
                                        <h4 className="font-medium text-gray-700 mb-1">
                                          Wallet Address
                                        </h4>
                                        <p className="font-mono text-sm break-all">
                                          {selectedProvider.wallet_address}
                                        </p>
                                      </div>
                                      <div>
                                        <h4 className="font-medium text-gray-700 mb-1">
                                          Social Media
                                        </h4>
                                        <div className="flex gap-3 mt-2">
                                          {selectedProvider
                                            .provider_social_media.twitter && (
                                            <a
                                              href={`https://twitter.com/${selectedProvider.provider_social_media.twitter}`}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-gray-600 hover:text-blue-500"
                                            >
                                              <Twitter className="h-5 w-5" />
                                            </a>
                                          )}
                                          {selectedProvider
                                            .provider_social_media
                                            .instagram && (
                                            <a
                                              href={`https://instagram.com/${selectedProvider.provider_social_media.instagram}`}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-gray-600 hover:text-pink-500"
                                            >
                                              <Instagram className="h-5 w-5" />
                                            </a>
                                          )}
                                          {selectedProvider
                                            .provider_social_media.linkedin && (
                                            <a
                                              href={`https://linkedin.com/company/${selectedProvider.provider_social_media.linkedin}`}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-gray-600 hover:text-blue-700"
                                            >
                                              <Linkedin className="h-5 w-5" />
                                            </a>
                                          )}
                                          {selectedProvider
                                            .provider_social_media.facebook && (
                                            <a
                                              href={`https://facebook.com/${selectedProvider.provider_social_media.facebook}`}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-gray-600 hover:text-blue-600"
                                            >
                                              <Facebook className="h-5 w-5" />
                                            </a>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="pt-4">
                                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                        Contact for Project
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              </TabsContent>
                            </Tabs>
                          </>
                        )}
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Suspense>
  );
};

const ServiceProvidersPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ServiceProvidersContent />
    </Suspense>
  );
};

export default ServiceProvidersPage;
