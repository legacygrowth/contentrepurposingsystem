import HelpCards from '@/components/website/helpCards/HelpCards'
import HelpHeader from '@/components/website/helpHeader/HelpHeader'

function HelpCenter() {
  return (
    <div className="container mx-auto mt-18">
      <HelpHeader />
      <HelpCards/>
    </div>
  )
}

export default HelpCenter
