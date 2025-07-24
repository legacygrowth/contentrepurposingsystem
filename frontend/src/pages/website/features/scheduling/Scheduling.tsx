import Hero from '@/components/website/hero/Hero'
import ThreeColumnGrid from '@/components/website/threecolumngrid/ThreeColumnGrid'
import SplitSection from '@/components/website/splitSection/SplitSection'

const Scheduling = () => {
  return (
    <>
      <Hero
        title="Schedule posts across all social platforms effortlessly."
        description="Leverage the world's most reliable scheduler—plan up to 1,000 posts per minute on Facebook, Instagram, Twitter, and LinkedIn."
        btn_primary="Start Scheduling"
        btn_secondary="Learn More"
        image="/featureNav/content/scheduling/63d17e914a9eb652218eda1d_Screenshot_Calendar (3)-p-1600.png"
        btn={true}
      />
      <ThreeColumnGrid />
      <SplitSection
        imageSrc="/featureNav/content/scheduling/64425f0b27bb491c533f103b_Schedule for years upfront-p-2000.png"
        title="Plan and schedule your content years in advance with ease."
        description="Post or schedule content seamlessly to Facebook, Instagram, Twitter, and LinkedIn—all from one powerful dashboard. Track past and upcoming posts effortlessly with our intuitive calendar."
        reverse={true}
        btnText="Start Posting"
        btn={true}
      />
    </>
  )
}

export default Scheduling
