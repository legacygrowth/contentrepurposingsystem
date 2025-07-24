import Hero from '@/components/website/hero/Hero'
import SplitSection from '@/components/website/splitSection/SplitSection'
import ComparePlans from '@/components/website/comparePlans/ComparePlans'
import Common from '@/components/website/common/Common'

function Pricing() {
  return (
    <>
      <Hero
        title="Pricing"
        description="We offer plans for every business—whether you're a solopreneur or a marketing agency, we’ve got you covered."
        btn_primary="Annually"
        btn_secondary="Monthly"
        btn={true}
      />
     <Common/>


      <SplitSection
        imageSrc="/featureNav/content/pricing/60d0d51b62241f54d923edd8_toa-heftiba-4xe-yVFJCvw-unsplash-p-800.jpeg"
        title="Want more?"
        description="For large businesses with unique needs—customize your number of profiles and users. Visit our enterprise page below to book a call and explore tailored solutions."
        reverse={true}
        btnText="Talk to sales"
        btn={true}
      />
      <ComparePlans />
    </>
  )
}



export default Pricing
