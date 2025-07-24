import Hero from "@/components/website/hero/Hero";
import SplitSection from "@/components/website/splitSection/SplitSection";
import BentoGridComp from "@/components/website/bentoGrid/BentoGrid";

const Content = () => {
  return (
    <>
      <Hero
        title="Stunning content created in minutes!"
        description="Master graphic design and copywriting today! Create captivating images, videos, text, and hashtags in no time."
        btn_primary="Start Creating"
        btn_secondary="Learn More"
        image="/content/63e784a01eb4adb38ad0c238_63ca6200cf5374311c5a5c01_Content_2_1 (1)-p-1080.png"
        btn={true}
      />
      <Hero
        title="Drag & drop"
        description="Struggling with complex and costly design software? With Trounce, become a pro graphic designer and video editor effortlessly. Create stunning visuals in minutes using our vast library of templates, stock photos, videos, licensed music, animations, backgrounds, and text styles."
        btn={false}
        color={false}
      />
      <BentoGridComp />
      <SplitSection
        imageSrc="/featureNav/content/63761d63e7b1c605857334a4_Screenshot_1-2-p-1600.png"
        title="Text & captions"
        description="Just enter a simple description, and AI will generate multiple high-converting captions for you. Running an eCommerce store? Use our dedicated Product Announcements feature. Plus, get relevant and trending hashtags instantly!"
        reverse={true}
        btnText="Try Free"
        btn={true}
      />
    </>
  );
};

export default Content;
