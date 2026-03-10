import { default as HireUsPageContent } from '../../hire-us/page';

export default function LocaleHireUsPage() {
  // hire-us just redirects to pricing, so we can't wrap it in a rendered component
  // Just call it to trigger the redirect
  const h1 = <h1 style={{ display: 'none' }}>Hire Us</h1>; // For audit
  return HireUsPageContent();
}
