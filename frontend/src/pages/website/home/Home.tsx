import TabsComp from "@/components/website/features/Features";

import ThreeDMarqueeComp from "@/components/website/integrations/Integrations";
import MarketingPrompt from "@/components/website/marketingPrompt/MarketingPrompt";
import { MarqueeComp } from "@/components/website/marquee/MarqueeComp";
import FeaturesSectionComp from "@/components/website/roiMarketing/ROIMarketing";
import Hero from "@/components/website/hero/Hero";

const Home = () => {
  return (
    <>
      <Hero
        title="Revolutionizing Social Media with AI"
        description="Boost, streamline, and expand your digital presence with AI-driven automation."
        btn_primary="Get Started Free"
        btn_secondary="Learn More"
        image={
          "/content/63e784a01eb4adb38ad0c238_63ca6200cf5374311c5a5c01_Content_2_1 (1)-p-1080.png"
        }
        btn={false}
      />
      <MarqueeComp />
      <TabsComp />
      <ThreeDMarqueeComp />
      <MarketingPrompt />
      <FeaturesSectionComp />
    </>
  );
};

export default Home;
