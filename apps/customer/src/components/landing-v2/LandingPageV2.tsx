"use client";

import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

// Hooks
import { useScrollAnimation, useSectionVisibility, usePageAnimation } from "./hooks";

// Core components
import { ScrollIndicator, PageLoadAnimation } from "./core";
import { useLoading } from "@repo/ui";
import BackgroundTransition from "@/features/home/components/BackgroundTransition";
import { getCategoryBackgroundImage } from "@/features/home/data/mockRestaurants";

// Navigation
import { Navbar } from "./navigation";

// Sections
import { HeroSection, FeaturesSection, CategoriesSection, BenefitsSection, CTASection } from "./sections";

// Animations
import { DeliveryScooter, SteamEffect } from "./animations";

export default function LandingPageV2() {
  const router = useRouter();
  const { show, hide } = useLoading();

  // Refs for sections
  const homeRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const categoriesRef = useRef<HTMLElement>(null);
  const benefitsRef = useRef<HTMLElement>(null);

  // Custom hooks
  const { scrollState, scrollToTop, scrollToSection, setScrollState } = useScrollAnimation();
  const { visibility, checkVisibility } = useSectionVisibility();
  const animationState = usePageAnimation();

  // Handle scroll events for section visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentPosition = window.scrollY;
      
      // Update scroll state
      setScrollState((prev) => ({
        ...prev,
        position: currentPosition,
        showScrollTop: currentPosition > 500,
      }));

      // Check section visibility
      if (featuresRef.current) {
        checkVisibility(featuresRef, "features");
      }
      if (categoriesRef.current) {
        checkVisibility(categoriesRef, "categories");
      }
      if (benefitsRef.current) {
        checkVisibility(benefitsRef, "benefits");
      }

      // Determine active section
      const navHeight = 70;
      const featuresTop = (featuresRef.current?.getBoundingClientRect().top || 0) + window.scrollY - navHeight;
      const categoriesTop = (categoriesRef.current?.getBoundingClientRect().top || 0) + window.scrollY - navHeight;
      const benefitsTop = (benefitsRef.current?.getBoundingClientRect().top || 0) + window.scrollY - navHeight;

      let activeSection = "home";
      if (currentPosition > benefitsTop - 100) {
        activeSection = "benefits";
      } else if (currentPosition > categoriesTop - 100) {
        activeSection = "categories";
      } else if (currentPosition > featuresTop - 100) {
        activeSection = "features";
      }

      setScrollState((prev) => ({ ...prev, activeSection }));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [checkVisibility, setScrollState]);

  // Delivery scooter animation based on scroll
  const scooterBaseY = 0;
  const scooterFlyDistance = scrollState.position * 0.5;
  const scooterOpacity = Math.max(0, 1 - scrollState.position / 500);
  const scooterRotation = Math.min(15, scrollState.position * 0.03);

  // Steam effect animation
  const steamBaseScale = 1;
  const steamScrollScale = scrollState.position / 120;
  const steamScale = Math.min(5, steamBaseScale + steamScrollScale);
  const steamOpacity = Math.max(0, 1 - scrollState.position / 400);
  const steamFlyDistance = scrollState.position * 0.15;

  // Navigation handlers
  const navigateToLogin = () => {
    show("Đang chuyển hướng đến trang đăng nhập");
    setTimeout(() => {
      router.push("/login");
      hide();
    }, 5000);
  };

  const scrollToHome = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToFeatures = () => {
    if (featuresRef.current) scrollToSection(featuresRef);
  };

  const scrollToCategories = () => {
    if (categoriesRef.current) scrollToSection(categoriesRef);
  };

  const scrollToBenefits = () => {
    if (benefitsRef.current) scrollToSection(benefitsRef);
  };

  return (
    <div className="relative pt-20 w-full min-h-screen overflow-x-hidden">
      {/* Loading Overlay moved to global provider */}

      {/* Page Load Animation */}
      <PageLoadAnimation pageLoaded={animationState.pageLoaded} />

      <BackgroundTransition imageUrl={getCategoryBackgroundImage("desserts")} categoryName="" />

      {/* Scroll to Top Button */}
      <ScrollIndicator visible={scrollState.showScrollTop} onClick={scrollToTop} />

      {/* Navigation */}
      <Navbar
        animationComplete={animationState.animationComplete}
        activeSection={scrollState.activeSection}
        onHome={scrollToHome}
        onFeatures={scrollToFeatures}
        onCategories={scrollToCategories}
        onBenefits={scrollToBenefits}
        onLogin={navigateToLogin}
      />

      {/* Hero Section */}
      <section ref={homeRef}>
        <HeroSection
          animationComplete={animationState.animationComplete}
          onGetStarted={navigateToLogin}
          onExplore={scrollToFeatures}
        />
      </section>

      {/* Delivery Scooter Animation */}
      <div
        className="fixed bottom-0 left-1/2 w-32 h-32 z-10 transition-all duration-300 ease-out md:bottom-[-20px]"
        style={{
          opacity: scooterOpacity,
          transform: `translateX(-50%) translateY(${scooterBaseY - scooterFlyDistance}px) rotate(${scooterRotation}deg)`,
          display: scrollState.position > 800 ? "none" : "block",
        }}
      >
        <DeliveryScooter />
      </div>

      {/* Steam Effect Animation */}
      <div
        className="fixed bottom-[-20px] left-1/2 w-32 h-40 z-0 transition-all duration-300 ease-out md:bottom-[-40px]"
        style={{
          transform: `translateX(-50%) translateY(${steamFlyDistance}px) scale(${steamScale})`,
          opacity: steamOpacity,
          display: scrollState.position > 700 ? "none" : "block",
        }}
      >
        <SteamEffect />
      </div>

      {/* Features Section */}
      <section ref={featuresRef}>
        <FeaturesSection visible={visibility.features} onExplore={navigateToLogin} />
      </section>

      {/* Categories Section */}
      <section ref={categoriesRef}>
        <CategoriesSection visible={visibility.categories} />
      </section>

      {/* Benefits Section */}
      <section ref={benefitsRef}>
        <BenefitsSection visible={visibility.benefits} onGetStarted={navigateToLogin} />
      </section>

      {/* CTA Section */}
      <CTASection visible={visibility.benefits} onGetStarted={navigateToLogin} />
    </div>
  );
}

