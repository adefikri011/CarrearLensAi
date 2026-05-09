import React from "react";
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { NumbersSection } from "@/components/landing/NumbersSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white selection:bg-[#1D9E75]/10 selection:text-[#1D9E75]">
      {/* 1. Navbar */}
      <Navbar />

      {/* 2. Hero Section (Scroll-Driven / Scrollytelling) */}
      <HeroSection />

      {/* 3. Numbers Section */}
      <NumbersSection />

      {/* 4. How It Works Section (Horizontal Scrollytelling Feel) */}
      <HowItWorksSection />

      {/* 5. Features Section (Alternating) */}
      <FeaturesSection />

      {/* 6. Testimonials Section (Carousel) */}
      <TestimonialsSection />

      {/* 7. Pricing Section */}
      <PricingSection />

      {/* 8. Final CTA + Footer */}
      <CTASection />
      <Footer />

      {/* Global Scrollytelling Optimization & Fallbacks */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
        
        /* Smooth scrolling for anchor links */
        html {
          scroll-behavior: smooth;
        }

        /* Prevent layout shift during heavy animation */
        body {
          overflow-x: hidden;
          background: white;
        }

        /* Font fine-tuning for brand feel */
        h1, h2, h3, h4 {
          letter-spacing: -0.05em;
        }
      `}} />
    </main>
  );
}
