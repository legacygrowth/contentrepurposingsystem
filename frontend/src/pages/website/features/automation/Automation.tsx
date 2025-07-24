import Hero from "@/components/website/hero/Hero";
import SplitSection from "@/components/website/splitSection/SplitSection";

const Automation = () => {
  return (
    <>
      <Hero
        title="AI-Powered Social Media Automation"
        description="Save time by automating repetitive tasks with Trounce’s AI-powered social media automation. Enhance your strategy with RSS posting, action links, and more!"
        btn_primary="Try Now"
        btn_secondary="Learn More"
        image="/featureNav/content/automation/647db210aba6da4069c41650_RSS-p-1600.png"
        btn={true}
      />
      <SplitSection
        imageSrc="/featureNav/content/automation/647db221e31045668fee60a0_Hands off with RSS AI posting.png"
        title="Hands off with RSS AI posting"
        description="Revolutionize your social media with automated RSS posting! Our AI-powered technology creates optimized posts from your RSS feeds, including captions, images, and hashtags—maximizing impact while saving time and effort."
        reverse={true}
      />
      <SplitSection
        imageSrc="/featureNav/content/automation/647db2523756c9051f81b0c7_Bulk publishing with Action Links and AI.png"
        title="Bulk publishing with Action Links and AI"
        description="Plan ahead, automate with One-Click Post Triggers, and generate captions instantly with AI. Engage effortlessly, grow your audience, and let automation do the work for you!"
        reverse={false}
      />
    </>
  );
};

export default Automation;
