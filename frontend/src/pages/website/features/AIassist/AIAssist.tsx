import Hero from '@/components/website/hero/Hero'
import SplitSection from '@/components/website/splitSection/SplitSection'

const AIAssist = () => {
  return (
    <>
      <Hero
        title="Revolutionizing Social Media with AI"
        description="Boost your content game with AI-powered social media management—craft high-converting copy and stunning visuals effortlessly."
        btn_primary="Try Now"
        btn_secondary="Learn More"
        image="/featureNav/content/ai-assist/64ad200a0ac6c9030b22bc99_AI Assist-min-p-1600.png"
        btn={true}
      />
      <SplitSection
        imageSrc="/featureNav/content/ai-assist/643fbe9ea242051d32fc24c9_Try the AI Assistant (4)-p-1080.png"
        title="Your social media assistant"
        description="!Supercharge your social media growth with the AI Assistant. Effortlessly generate ideas, repurpose content, and maximize engagement. Unlock your brand’s full potential with AI today!"
        reverse={true}
      />
      <SplitSection
        imageSrc="/featureNav/content/ai-assist/6451629250bb3ff6e02b7d1d_Illustrate with AI images.png"
        title="Your social media assistant"
        description="Amplify your social media engagement and growth with the AI Assistant. Effortlessly generate ideas, repurpose content, and maximize your brand’s impact. Unlock the power of AI today!"
        reverse={false}
      />
      <SplitSection
        imageSrc="/featureNav/content/ai-assist/6419c305f2a3fe8515c4c497_Captions.png"
        title="AI captions and hashtags"
        description="Effortlessly craft compelling captions and relevant hashtags with AI-powered technology built into the post editor. Focus on your message while AI handles the rest, saving you time and effort."
        reverse={true}
      />
      <SplitSection
        imageSrc="/featureNav/content/ai-assist/63fd703c75fed050d619a933_Copywriter translation.png"
        title="Copy for any marketing activity"
        description="Create engaging captions and trending hashtags effortlessly with AI-powered tools integrated into the post editor. Save time and focus on what truly matters—your message."
        reverse={false}
        btnText="Find out more"
        btn={true}
      />
    </>
  )
}

export default AIAssist
