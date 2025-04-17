import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Coins, ShieldCheck, Globe, TrendingUp, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";

const ShariahCompliantProtocols = () => {
  const [expandedId, setExpandedId] = useState(null);

  const protocols = [
    {
      id: 1,
      name: "Firoza Finance",
      description:
        "Firoza Finance offers Shariah-compliant investment pools based on Mudarabah contracts, providing halal returns from real-world businesses. This aligns well with your model of staking ETH and directing profits to charitable projects.",
      icon: <Coins className="h-6 w-6 text-blue-600" />,
      url: "https://firoza.finance/",
      image: "https://cdn.prod.website-files.com/66eade0c3f9fa1dbb50d76c2/67334382dcae4bfb18e5f987_1920x726_1(2).png",
      imageAlt: "Firoza Finance platform interface",
      features: [
        "Mudarabah-based investment pools",
        "Halal returns from real-world assets",
        "Transparent profit-sharing mechanism",
        "Community governance participation"
      ]
    },
    {
      id: 2,
      name: "Goldsand by InshAllah Network",
      description:
        "Goldsand is a halal Ethereum staking protocol that filters out impermissible transactions, ensuring that staking rewards are generated in compliance with Shariah principles.",
      icon: <ShieldCheck className="h-6 w-6 text-blue-600" />,
      url: "https://goldsand.fi/",
      image: "https://pbs.twimg.com/media/Gbno338WwAATqHn.jpg",
      imageAlt: "Goldsand staking protocol interface",
      features: [
        "Halal Ethereum staking solution",
        "Transaction filtering technology",
        "Shariah compliance certification",
        "No Riba (interest) involvement"
      ]
    },
    {
      id: 3,
      name: "HAQQ Network",
      description:
        "HAQQ is a Shariah-compliant blockchain ecosystem compatible with Ethereum. It supports smart contracts and uses Islamic Coin (ISLM) for staking and governance. Notably, 10% of new ISLM tokens are directed to Islamic charities, aligning with your goal of channeling staking rewards to charitable projects.",
      icon: <Globe className="h-6 w-6 text-blue-600" />,
      url: "https://www.haqq.network/",
      image: "https://i0.wp.com/www.halaltimes.com/wp-content/uploads/2024/05/Haqq.jpg?fit=1200%2C675&ssl=1",
      imageAlt: "HAQQ Network blockchain ecosystem",
      features: [
        "Ethereum-compatible blockchain",
        "Islamic Coin (ISLM) for staking",
        "10% of new tokens to charity",
        "Dedicated Shariah governance board"
      ]
    },
    {
      id: 4,
      name: "Luno Malaysia",
      description:
        "Luno offers Shariah-compliant Ethereum staking certified by Amanie Advisors. This service is regulated and available in Malaysia, providing a local and compliant option for ETH staking.",
      icon: <TrendingUp className="h-6 w-6 text-blue-600" />,
      url: "https://www.luno.com/en/my",
      image: "https://www.utusan.com.my/wp-content/uploads/2024/01/Luno-Launches-Staking-in-Malaysia.jpg",
      imageAlt: "Luno Malaysia staking platform",
      features: [
        "Regulated staking platform",
        "Certified by Amanie Advisors",
        "Malaysia-based operation",
        "User-friendly mobile interface"
      ]
    },
  ];

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
          Shariah-Compliant DeFi Protocols
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Explore trusted Shariah-compliant DeFi protocols that align with Islamic finance principles and support ethical investments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {protocols.map((protocol) => (
          <Card 
            key={protocol.id} 
            className="bg-white/90 backdrop-blur-sm border border-blue-100 hover:shadow-lg transition-all duration-300 hover:border-blue-300 overflow-hidden"
          >
            <div className="overflow-hidden h-48">
              <img 
                src={protocol.image} 
                alt={protocol.imageAlt} 
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
              />
            </div>
            
            <CardHeader className="flex flex-row items-center gap-4 cursor-pointer" onClick={() => toggleExpand(protocol.id)}>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center transition-transform duration-300 hover:scale-110">
                {protocol.icon}
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg font-semibold text-blue-900">{protocol.name}</CardTitle>
              </div>
              <div className="transition-transform duration-300">
                {expandedId === protocol.id ? 
                  <ChevronUp className="h-5 w-5 text-blue-600" /> : 
                  <ChevronDown className="h-5 w-5 text-blue-600" />
                }
              </div>
            </CardHeader>
            
            <CardContent>
              <CardDescription className="text-sm text-gray-600 mb-2">{protocol.description}</CardDescription>
              
              <div 
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  expandedId === protocol.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="mt-4 pt-4 border-t border-blue-100">
                  <h4 className="font-medium text-blue-800 mb-2">Key Features:</h4>
                  <ul className="space-y-1">
                    {protocol.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <ShieldCheck className="h-3 w-3 text-blue-600" />
                        </div>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="pt-0">
              <a 
                href={protocol.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                Visit Website <ExternalLink className="h-4 w-4" />
              </a>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ShariahCompliantProtocols;