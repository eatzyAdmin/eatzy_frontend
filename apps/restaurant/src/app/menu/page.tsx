import React from 'react';
import HeroSection from '@/components/hero/HeroSection';
import MenuList from '@/components/menu/MenuList';
import AboutSection from '@/components/about/AboutSection';

export default function MenuPage() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <MenuList />
    </main>
  );
}
