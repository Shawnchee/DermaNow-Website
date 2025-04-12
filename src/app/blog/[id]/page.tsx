"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

// First, add the import for our new component
import { BlogContent } from "@/components/blog-content";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  coverImage: string;
  category: string;
  publishedAt: string;
  readingTime: number;
  author: {
    name: string;
    role: string;
  };
}

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sample blog posts data
  const blogPosts: BlogPost[] = [
    {
      id: "1",
      title: "How Blockchain Technology is Revolutionizing Charitable Giving",
      content: `
        <h2>The Challenge of Trust in Charitable Giving</h2>
        <p>For decades, the charity sector has faced a persistent challenge: how to build and maintain trust with donors. Stories of mismanaged funds, administrative inefficiencies, and even fraud have made many potential donors hesitant to give. According to a recent survey, 79% of donors express concerns about how their donations are actually used.</p>
        
        <p>Traditional charitable giving relies on multiple intermediaries between donors and beneficiaries. Each intermediary adds a layer of complexity, cost, and potential for error or misuse. Donors often have limited visibility into what happens after they make a contribution, relying on periodic reports that may lack detail or timeliness.</p>
        
        <h2>Enter Blockchain Technology</h2>
        <p>Blockchain technology offers a revolutionary solution to these longstanding challenges. At its core, blockchain is a distributed ledger technology that records transactions across multiple computers in a way that ensures the records cannot be altered retroactively. This creates an immutable, transparent history of all transactions.</p>
        
        <p>For charitable organizations, blockchain provides:</p>
        
        <ul>
          <li><strong>Transparency:</strong> Every donation can be tracked from the moment it's given to its final use, creating an unbroken chain of custody for funds.</li>
          <li><strong>Immutability:</strong> Once recorded, donation information cannot be altered or deleted, preventing fraud and ensuring accountability.</li>
          <li><strong>Efficiency:</strong> Smart contracts can automate fund distribution based on predefined conditions, reducing administrative overhead and delays.</li>
          <li><strong>Direct Giving:</strong> Peer-to-peer transactions enable donors to connect directly with beneficiaries, eliminating unnecessary intermediaries.</li>
        </ul>
        
        <h2>Real-World Applications</h2>
        <p>Several pioneering organizations are already leveraging blockchain to transform charitable giving:</p>
        
        <h3>1. Donation Tracking</h3>
        <p>The United Nations World Food Programme's "Building Blocks" initiative uses blockchain to transfer food vouchers to refugees in Jordan. The system has helped the WFP reduce payment costs by 98%, while providing greater security and privacy for beneficiaries.</p>
        
        <h3>2. Supply Chain Transparency</h3>
        <p>Organizations like Aid:Tech are using blockchain to track the delivery of humanitarian supplies, ensuring that aid reaches intended recipients and is not diverted or lost along the way.</p>
        
        <h3>3. Cryptocurrency Donations</h3>
        <p>Major charities including UNICEF, Save the Children, and the American Red Cross now accept cryptocurrency donations, opening up new funding streams and engaging tech-savvy donors.</p>
        
        <h3>4. Impact Verification</h3>
        <p>Platforms like Alice use blockchain to verify charitable outcomes before releasing donor funds, creating an incentive structure that rewards effective projects and encourages innovation.</p>
        
        <h2>The Future of Blockchain in Charity</h2>
        <p>As blockchain technology continues to mature, we can expect to see even more transform ative applications in the charitable sector:</p>
        
        <ul>
          <li><strong>Tokenized Impact:</strong> Charitable outcomes could be represented as tokens that donors can buy, sell, or trade, creating new markets for social good.</li>
          <li><strong>Decentralized Philanthropy:</strong> DAOs (Decentralized Autonomous Organizations) could enable community-led charitable initiatives with transparent governance and resource allocation.</li>
          <li><strong>Micro-donations:</strong> Blockchain's ability to process small transactions efficiently could make micro-philanthropy more viable, allowing more people to participate in giving.</li>
        </ul>
        
        <h2>Getting Started with Blockchain for Your Charity</h2>
        <p>If you're interested in exploring how blockchain can benefit your charitable organization, here are some steps to get started:</p>
        
        <ol>
          <li>Educate your team about blockchain fundamentals and potential applications</li>
          <li>Identify specific challenges in your operations that blockchain might address</li>
          <li>Start small with a pilot project, such as accepting cryptocurrency donations</li>
          <li>Partner with blockchain experts or platforms specializing in charitable applications</li>
          <li>Communicate transparently with donors about your blockchain initiatives</li>
        </ol>
        
        <p>By embracing blockchain technology, charitable organizations can build stronger trust with donors, operate more efficiently, and ultimately increase their impact on the causes they serve.</p>
      `,
      coverImage:
        "https://images.pexels.com/photos/730564/pexels-photo-730564.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      category: "Blockchain",
      publishedAt: "2023-11-15",
      readingTime: 8,
      author: {
        name: "Dr. Sarah Johnson",
        role: "Blockchain Specialist",
      },
    },
    {
      id: "2",
      title: "Smart Contracts: Automating Trust in Charitable Operations",
      content: `
        <h2>What Are Smart Contracts?</h2>
        <p>Smart contracts are self-executing contracts with the terms directly written into code. They automatically enforce and execute agreements when predetermined conditions are met, without the need for intermediaries.</p>
        
        <h2>Benefits for Charities</h2>
        <p>Smart contracts offer several key benefits for charitable organizations:</p>
        <ul>
          <li>Automated fund distribution based on verified conditions</li>
          <li>Reduced administrative overhead and costs</li>
          <li>Increased transparency for donors</li>
          <li>Elimination of potential human error or manipulation</li>
        </ul>
        
        <h2>Real-World Applications</h2>
        <p>Several charities are already implementing smart contracts to improve their operations:</p>
        <ol>
          <li>Conditional donations that release funds only when specific milestones are achieved</li>
          <li>Automated grant distributions to multiple beneficiaries</li>
          <li>Transparent tracking of fund allocation and usage</li>
        </ol>
        
        <h2>Implementation Challenges</h2>
        <p>While promising, smart contracts do present some challenges:</p>
        <ul>
          <li>Technical expertise requirements</li>
          <li>Initial setup costs</li>
          <li>Need for reliable data sources (oracles)</li>
        </ul>
        
        <h2>Getting Started</h2>
        <p>For charities interested in exploring smart contracts, consider these steps:</p>
        <ol>
          <li>Identify processes that could benefit from automation</li>
          <li>Consult with blockchain developers familiar with the nonprofit sector</li>
          <li>Start with a small pilot project</li>
          <li>Communicate the benefits to stakeholders</li>
        </ol>
      `,
      coverImage:
        "https://images.pexels.com/photos/5980738/pexels-photo-5980738.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      category: "Smart Contracts",
      publishedAt: "2023-10-28",
      readingTime: 10,
      author: {
        name: "Michael Chen",
        role: "Smart Contract Developer",
      },
    },
    {
      id: "3",
      title: "Cryptocurrency Donations: A Guide for Charities",
      content: `
        <h2>Why Accept Cryptocurrency Donations?</h2>
        <p>Cryptocurrency donations offer several advantages for charitable organizations:</p>
        <ul>
          <li>Access to a new donor demographic</li>
          <li>Potentially lower transaction fees for international donations</li>
          <li>Possibility of asset appreciation</li>
          <li>Enhanced transparency through blockchain</li>
        </ul>
        
        <h2>Setting Up Cryptocurrency Acceptance</h2>
        <p>To begin accepting cryptocurrency donations, charities need to:</p>
        <ol>
          <li>Create a secure wallet for receiving donations</li>
          <li>Choose between custodial and non-custodial solutions</li>
          <li>Implement donation buttons or widgets on their website</li>
          <li>Establish policies for holding or converting crypto assets</li>
        </ol>
        
        <h2>Tax Implications</h2>
        <p>Cryptocurrency donations have specific tax considerations:</p>
        <ul>
          <li>In many jurisdictions, crypto donations are treated as non-cash charitable contributions</li>
          <li>Donors may need to file additional tax forms</li>
          <li>Charities should provide appropriate documentation for donors</li>
          <li>Valuation methods must be consistent and documented</li>
        </ul>
        
        <h2>Popular Cryptocurrencies for Donations</h2>
        <p>While Bitcoin and Ethereum are most common, charities may consider accepting:</p>
        <ul>
          <li>Bitcoin (BTC)</li>
          <li>Ethereum (ETH)</li>
          <li>USD Coin (USDC) and other stablecoins</li>
          <li>Solana (SOL)</li>
          <li>Cardano (ADA)</li>
        </ul>
        
        <h2>Donor Recognition Strategies</h2>
        <p>Engaging cryptocurrency donors requires specialized approaches:</p>
        <ul>
          <li>NFT rewards for significant donations</li>
          <li>Blockchain-verified impact certificates</li>
          <li>Community building in Web3 spaces</li>
          <li>Transparent reporting on blockchain explorers</li>
        </ul>
      `,
      coverImage:
        "https://images.pexels.com/photos/271168/pexels-photo-271168.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      category: "Cryptocurrency",
      publishedAt: "2023-10-12",
      readingTime: 12,
      author: {
        name: "Emma Rodriguez",
        role: "Nonprofit Financial Advisor",
      },
    },
    {
      id: "4",
      title: "Tokenizing Impact: How NFTs are Changing Charitable Fundraising",
      content: "",
      coverImage:
        "https://images.pexels.com/photos/12188470/pexels-photo-12188470.jpeg?auto=compress&cs=tinysrgb&w=600",
      category: "NFTs",
      publishedAt: "2023-09-30",
      readingTime: 7,
      author: {
        name: "James Wilson",
        role: "Digital Art Curator",
      },
    },
    {
      id: "5",
      title: "Decentralized Autonomous Organizations (DAOs) for Social Good",
      content: "",
      coverImage:
        "https://images.pexels.com/photos/14902678/pexels-photo-14902678.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      category: "Web3",
      publishedAt: "2023-09-15",
      readingTime: 9,
      author: {
        name: "Dr. Aisha Patel",
        role: "Web3 Governance Expert",
      },
    },
    {
      id: "6",
      title: "Blockchain for Transparent Supply Chains in Humanitarian Aid",
      content: "",
      coverImage:
        "https://images.pexels.com/photos/6994944/pexels-photo-6994944.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      category: "Blockchain",
      publishedAt: "2023-08-22",
      readingTime: 11,
      author: {
        name: "Robert Kim",
        role: "Humanitarian Logistics Specialist",
      },
    },
    {
      id: "7",
      title: "Web3 Tools for Measuring and Verifying Charitable Impact",
      content: "",
      coverImage:
        "https://images.pexels.com/photos/6994833/pexels-photo-6994833.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      category: "Web3",
      publishedAt: "2023-08-05",
      readingTime: 8,
      author: {
        name: "Olivia Martinez",
        role: "Impact Measurement Consultant",
      },
    },
    {
      id: "8",
      title: "The Future of Charitable Giving: Web3 Philanthropy Trends",
      content: "",
      coverImage:
        "https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      category: "Web3",
      publishedAt: "2023-07-20",
      readingTime: 10,
      author: {
        name: "Daniel Thompson",
        role: "Philanthropy Futurist",
      },
    },
  ];

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Fetch post data
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      const postId = params.id as string;
      const foundPost = blogPosts.find((p) => p.id === postId);

      if (foundPost) {
        setPost(foundPost);
      } else {
        router.push("/blog");
      }

      setIsLoading(false);
    }, 300); // Simulate loading delay
  }, [params.id, router]);

  // Handle share functionality
  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4 animate-pulse" />
          <div className="h-16 bg-gray-200 rounded w-full mb-8 animate-pulse" />
          <div className="h-64 bg-gray-200 rounded w-full mb-8 animate-pulse" />
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Post not found</h1>
        <p className="mb-8">
          The article you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Link
              href="/blog"
              className="inline-flex items-center text-blue-100 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to all articles
            </Link>
            <Badge className="mb-4 bg-blue-700">{post.category}</Badge>
            <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
            <div className="flex items-center text-sm">
              <span>
                {post.author.name}, {post.author.role}
              </span>
              <span className="mx-2">•</span>
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(post.publishedAt)}
              </span>
              <span className="mx-2">•</span>
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {post.readingTime} min read
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <article className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="relative h-64 md:h-80">
            <Image
              src={post.coverImage || "/placeholder.svg"}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
          {/* Then find the section where we render the blog post content and replace it with: */}
          <div className="p-6 md:p-8">
            <BlogContent content={post.content} />

            <Separator className="my-8" />

            <div className="flex justify-between items-center">
              <Button variant="outline" size="sm" onClick={handleShare}>
                Share Article
              </Button>
              <Button asChild>
                <Link href="/blog">View All Articles</Link>
              </Button>
            </div>
          </div>
        </article>
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
