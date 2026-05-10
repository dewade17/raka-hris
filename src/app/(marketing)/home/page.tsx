import { ContactSection } from './components_home/ContactSection';
import { FaqSection } from './components_home/FaqSection';
import { HeroSection } from './components_home/HeroSection';
import { MetricsSection } from './components_home/MetricsSection';
import { PlatformSection } from './components_home/PlatformSection';
import { ProductExperienceSection } from './components_home/ProductExperienceSection';
import { RoleBenefitsSection } from './components_home/RoleBenefitsSection';
import { SecuritySection } from './components_home/SecuritySection';
import { TestimonialsSection } from './components_home/TestimonialsSection';
import { WorkflowSection } from './components_home/WorkflowSection';

export default function MarketingHomePage() {
  return (
    <>
      <HeroSection />
      <MetricsSection />
      <PlatformSection />
      <ProductExperienceSection />
      <WorkflowSection />
      <RoleBenefitsSection />
      <SecuritySection />
      <TestimonialsSection />
      <ContactSection />
      <FaqSection />
    </>
  );
}
