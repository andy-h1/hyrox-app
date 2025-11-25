import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { CtaSection } from '@/components/landing/CtaSection';

export default async function Home() {
  const session = await auth();

  if (session) {
    redirect('/dashboard');
  }

  // Unauthenticated users see landing page
  return (
    <>
      <LandingHeader />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CtaSection />
    </>
  );
}
