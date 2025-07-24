import { RouteObject } from 'react-router-dom'
import WebSiteLayout from '@/layout/WebsiteLayout'
import Home from '@/pages/website/home/Home'
import Pricing from '@/pages/website/pricing/Pricing'
import AIAssist from '@/pages/website/features/AIassist/AIAssist'
import Automation from '@/pages/website/features/automation/Automation'
import Ecommerce from '@/pages/website/features/e-commerce/Ecommerce'
import Professionals from '@/pages/website/features/professionals/Professionals'
import API from '@/pages/website/features/API/API'
import CopyWriting from '@/pages/website/features/copyWriting/CopyWriting'
import Content from '@/pages/website/features/content/Content'
import Scheduling from '@/pages/website/features/scheduling/Scheduling'
import Integrations from '@/pages/website/integrations/Integrations'
import GetPaid from '@/pages/website/getpaid/GetPaid'
import HelpCenter from '@/pages/website/helpCenter/HelpCenter'
import Contact from '@/pages/website/contact/Contact'
import TermsOfServices from '@/components/website/termsOfServices/TermsOfServices'
import PrivacyPolicy from '@/components/website/privacyPolicy/PrivacyPolicy'
import Varifiedtoken from '@/pages/website/blankpage/Varifiedtoken'
const websiteRoutes: RouteObject[] = [
  {
    path: '/',
    element: <WebSiteLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'content', element: <Content /> },
      { path: 'scheduling', element: <Scheduling /> },
      { path: 'copywriting', element: <CopyWriting /> },
      { path: 'ai-assist', element: <AIAssist /> },
      { path: 'automation', element: <Automation /> },
      { path: 'e-commerce', element: <Ecommerce /> },
      { path: 'professionals', element: <Professionals /> },
      { path: 'api', element: <API /> },
      { path: 'pricing', element: <Pricing /> },
      { path: 'integrations', element: <Integrations /> },
      { path: 'getpaid', element: <GetPaid /> },
      { path: 'helpcenter', element: <HelpCenter /> },
      { path: 'contact', element: <Contact /> },
      { path: 'terms-of-services', element: <TermsOfServices /> },
      { path: 'privacy-policy', element: <PrivacyPolicy /> },
      { path: 'varified-token', element: <Varifiedtoken/> },
    ],
  },
]

export default websiteRoutes
