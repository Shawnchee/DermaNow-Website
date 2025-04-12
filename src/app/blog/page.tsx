"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  coverImage: string;
  publishedAt: string;
  readingTime: number;
  author: {
    name: string;
  };
}

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sample blog posts data
  const blogPosts = useMemo(
    () => [
      {
        id: "1",
        title: "How Blockchain Technology is Revolutionizing Charitable Giving",
        excerpt:
          "Discover how blockchain is transforming the charity sector by providing unprecedented transparency, reducing fraud, and enabling direct peer-to-peer donations.",
        coverImage:
          "https://images.pexels.com/photos/730564/pexels-photo-730564.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        category: "Blockchain",
        publishedAt: "2023-11-15",
        readingTime: 8,
        author: {
          name: "Dr. Sarah Johnson",
        },
      },
      {
        id: "2",
        title: "Smart Contracts: Automating Trust in Charitable Operations",
        excerpt:
          "Learn how smart contracts are helping charities automate fund distribution, ensure donor conditions are met, and reduce administrative overhead.",
        coverImage:
          "https://images.pexels.com/photos/5980738/pexels-photo-5980738.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        category: "Smart Contracts",
        publishedAt: "2023-10-28",
        readingTime: 10,
        author: {
          name: "Michael Chen",
        },
      },
      {
        id: "3",
        title: "Cryptocurrency Donations: A Guide for Charities",
        excerpt:
          "Everything your nonprofit needs to know about accepting cryptocurrency donations, from setting up a wallet to tax implications and donor recognition.",
        coverImage:
          "https://images.pexels.com/photos/271168/pexels-photo-271168.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        category: "Cryptocurrency",
        publishedAt: "2023-10-12",
        readingTime: 12,
        author: {
          name: "Emma Rodriguez",
        },
      },
      {
        id: "4",
        title:
          "Tokenizing Impact: How NFTs are Changing Charitable Fundraising",
        excerpt:
          "Explore how non-fungible tokens (NFTs) are creating new fundraising opportunities for charities through digital art, collectibles, and impact certificates.",
        coverImage:
          "https://images.pexels.com/photos/12188470/pexels-photo-12188470.jpeg?auto=compress&cs=tinysrgb&w=600",
        category: "NFTs",
        publishedAt: "2023-09-30",
        readingTime: 7,
        author: {
          name: "James Wilson",
        },
      },
      {
        id: "5",
        title: "Decentralized Autonomous Organizations (DAOs) for Social Good",
        excerpt:
          "How DAOs are enabling community-led charitable initiatives with transparent governance, collective decision-making, and efficient resource allocation.",
        coverImage:
          "https://images.pexels.com/photos/14902678/pexels-photo-14902678.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        category: "Web3",
        publishedAt: "2023-09-15",
        readingTime: 9,
        author: {
          name: "Dr. Aisha Patel",
        },
      },
      {
        id: "6",
        title: "Blockchain for Transparent Supply Chains in Humanitarian Aid",
        excerpt:
          "Case studies of how blockchain is being used to track humanitarian supplies from donor to recipient, ensuring aid reaches those who need it most.",
        coverImage:
          "https://images.pexels.com/photos/6994944/pexels-photo-6994944.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        category: "Blockchain",
        publishedAt: "2023-08-22",
        readingTime: 11,
        author: {
          name: "Robert Kim",
        },
      },
      {
        id: "7",
        title: "Web3 Tools for Measuring and Verifying Charitable Impact",
        excerpt:
          "How blockchain and Web3 technologies are enabling real-time impact tracking, verification, and reporting for greater donor confidence and engagement.",
        coverImage:
          "https://images.pexels.com/photos/6994833/pexels-photo-6994833.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        category: "Web3",
        publishedAt: "2023-08-05",
        readingTime: 8,
        author: {
          name: "Olivia Martinez",
        },
      },
      {
        id: "8",
        title: "The Future of Charitable Giving: Web3 Philanthropy Trends",
        excerpt:
          "Emerging trends in Web3 philanthropy, including quadratic funding, retroactive public goods funding, and impact-focused investment DAOs.",
        coverImage:
          "https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        category: "Web3",
        publishedAt: "2023-07-20",
        readingTime: 10,
        author: {
          name: "Daniel Thompson",
        },
      },
    ],
    []
  );

  // Filter posts based on search query
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      let filtered = [...blogPosts];

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (post) =>
            post.title.toLowerCase().includes(query) ||
            post.excerpt.toLowerCase().includes(query) ||
            post.category.toLowerCase().includes(query)
        );
      }

      setFilteredPosts(filtered);
      setIsLoading(false);
    }, 300); // Simulate loading delay
  }, [searchQuery, blogPosts]);

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4 text-center">
            Charity Education Blog
          </h1>
          <p className="text-xl text-center mb-8">
            Learn about blockchain and Web3 for charitable organizations
          </p>
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search articles..."
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-blue-100"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* Blog Posts */}
      <main className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8">All Articles</h2>

        {isLoading ? (
          // Loading state
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="h-48 bg-gray-200 animate-pulse" />
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          // Empty state
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No articles found
            </h3>
            <p className="text-gray-600 mb-6">
              We couldn't find any articles matching your search. Try different
              keywords.
            </p>
            <Button onClick={() => setSearchQuery("")}>Clear Search</Button>
          </div>
        ) : (
          // Articles grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Link href={`/blog/${post.id}`} key={post.id}>
                <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
                  <div className="relative h-48">
                    <Image
                      src={post.coverImage || "/placeholder.svg"}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-blue-600">{post.category}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{post.author.name}</span>
                      <div className="flex items-center gap-4">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(post.publishedAt).split(",")[0]}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {post.readingTime} min
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Simple Footer */}
      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">
            Learn more about how blockchain and Web3 can transform charitable
            giving.
          </p>
          <div className="mt-4">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Subscribe to Newsletter
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
