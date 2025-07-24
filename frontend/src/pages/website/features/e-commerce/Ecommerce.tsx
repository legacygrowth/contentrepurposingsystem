import Hero from "@/components/website/hero/Hero";
import HowAIWorks from "@/components/website/aiwritescopy/HowAIWorks";
import SplitSection from "@/components/website/splitSection/SplitSection";

const Ecommerce = () => {
  // const stepsData = [
  //   {
  //     number: '1',
  //     title: 'Choose your Task',
  //     description:
  //       "Whether it's Ad Copy, Captions, Blogs, Emails, Website Content – we do it all. Select the task that is best for you.",
  //     color: 'text-orange-500',
  //   },
  //   {
  //     number: '2',
  //     title: 'Describe your copy',
  //     description:
  //       'Be as vague or specific as you like, The AI will adapt accordingly. You can also try describing the tone or target market for an Ad.',
  //     color: 'text-pink-500',
  //   },
  //   {
  //     number: '3',
  //     title: 'Generate text',
  //     description:
  //       'Sit back and watch the AI do the work for you in seconds. You can generate unlimited copy in 28 languages to find the right result for you.',
  //     color: 'text-purple-500',
  //   },
  // ]

  return (
    <>
      <Hero
        title="Turn Your E-commerce into a Social Powerhouse"
        description="Stop manually creating posts! Boost conversions by visually planning your eCommerce campaigns with ease."
        btn_primary="Start Creating"
        btn_secondary="Learn More"
        image="/featureNav/content/ecommerse/6454c54134861df889b19afe_Ecommerce-2-p-1600.png"
        btn={true}
      />
      <HowAIWorks />
      <SplitSection
        imageSrc="/featureNav/content/ecommerse/63fd70964c929069204c2de8_Ecommerce.png"
        title="Expertise & reliability."
        description="Our Upwork partnership connects you with top freelancers—experts ready to elevate your social media to the next level."
        reverse={true}
      />
      <SplitSection
        imageSrc="/featureNav/content/ecommerse/6454c4e0294e18ee9d8e6ba7_Maximise conversions.png"
        title="Expertise & reliability."
        description="Through our Upwork partnership, access expert freelancers ready to elevate your social media presence effortlessly."
        reverse={false}
      />
    </>
  );
};

export default Ecommerce;
