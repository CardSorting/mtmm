import React, { useState } from "react";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import HeroSection from "./hero/HeroSection";
import FeaturesSection from "./sections/FeaturesSection";
import TestimonialsSection from "./sections/TestimonialsSection";
import PricingSection from "./sections/PricingSection";
import NewsletterSection from "./sections/NewsletterSection";
import ThemeToggleBar from "./gallery/ThemeToggleBar";
import CharacterGrid from "./gallery/CharacterGrid";

type Theme = "professional" | "casual" | "fantasy" | "all";

const Home = () => {
  const [selectedTheme, setSelectedTheme] = useState<Theme>("all");

  const handleThemeChange = (theme: string) => {
    setSelectedTheme(theme as Theme);
  };

  const handleCtaClick = () => {
    console.log("Create companion clicked");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <HeroSection onCtaClick={handleCtaClick} />
        <FeaturesSection />
        <div className="bg-white py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">
              Explore Our AI Companions
            </h2>
            <ThemeToggleBar
              onThemeChange={handleThemeChange}
              activeTheme={selectedTheme}
            />
            <CharacterGrid selectedTheme={selectedTheme} />
          </div>
        </div>
        <TestimonialsSection />
        <PricingSection />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
