import HeroSection from "@/components/hero/HeroSection";
import AboutSection from "@/components/about/AboutSection";
import MenuList from "@/components/menu/MenuList";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <AboutSection />
      <MenuList />
    </main>
  );
}
