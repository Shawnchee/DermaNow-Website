import HeroSection from "@/components/home/HeroSection";
import OurApproachSection from "@/components/home/our-approach-section";
import DonationFlowSection from "@/components/home/donation-flow-section";
import GettingStartedSection from "@/components/home/gettingStartedSection";

function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <OurApproachSection />
      <DonationFlowSection />
      <GettingStartedSection />
    </main>
  );
}

export default Home;
