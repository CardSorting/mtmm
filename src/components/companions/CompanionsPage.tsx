import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import CharacterCard from "../gallery/CharacterCard";
import {
  Search,
  SlidersHorizontal,
  Briefcase,
  Users,
  Wand2,
  Sparkles,
  Brain,
  Code,
  Palette,
  BookOpen,
  Microscope,
  Headphones,
  Heart,
  Globe,
  Star,
  Clock,
  Zap,
  DollarSign,
} from "lucide-react";
import Header from "../layout/Header";
import Footer from "../layout/Footer";

type Category = "all" | "professional" | "casual" | "fantasy";
type SortOption = "popular" | "newest" | "rating";

const categories: { value: Category; label: string }[] = [
  { value: "all", label: "All Companions" },
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "fantasy", label: "Fantasy" },
];

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest First" },
  { value: "rating", label: "Highest Rated" },
];

const categoryIcons = {
  professional: <Briefcase className="w-5 h-5" />,
  casual: <Users className="w-5 h-5" />,
  fantasy: <Wand2 className="w-5 h-5" />,
  all: <Sparkles className="w-5 h-5" />,
};

const companions = [
  {
    id: "1",
    name: "Business Strategist Pro",
    avatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=business&backgroundColor=b6e3f4",
    description:
      "Expert AI consultant specializing in business strategy, market analysis, and growth optimization.",
    theme: "professional" as const,
    rating: 4.8,
    conversations: 23456,
    likes: 8901,
    createdAt: "2024-01-15",
    featured: true,
  },
  {
    id: "2",
    name: "Creative Muse",
    avatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=creative&backgroundColor=ffdfba",
    description:
      "Your imaginative AI partner for creative projects, brainstorming, and artistic exploration.",
    theme: "casual" as const,
    rating: 4.9,
    conversations: 18234,
    likes: 7234,
    createdAt: "2024-01-20",
    featured: true,
  },
  {
    id: "3",
    name: "Tech Guru",
    avatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=tech&backgroundColor=baffc9",
    description:
      "Advanced AI companion for programming, technology consulting, and technical problem-solving.",
    theme: "professional" as const,
    rating: 4.7,
    conversations: 15678,
    likes: 6789,
    createdAt: "2024-02-01",
  },
  {
    id: "4",
    name: "Fantasy Guide",
    avatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=fantasy&backgroundColor=e6c3ff",
    description:
      "Your gateway to magical realms and epic adventures through AI-powered storytelling.",
    theme: "fantasy" as const,
    rating: 4.9,
    conversations: 12345,
    likes: 5678,
    createdAt: "2024-02-15",
  },
  {
    id: "5",
    name: "Wellness Coach",
    avatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=wellness&backgroundColor=c3ffc3",
    description:
      "Supportive AI companion for health, wellness, and personal development journeys.",
    theme: "casual" as const,
    rating: 4.6,
    conversations: 9876,
    likes: 4321,
    createdAt: "2024-02-20",
  },
  {
    id: "6",
    name: "Study Buddy",
    avatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=study&backgroundColor=ffd7d7",
    description:
      "Your dedicated AI learning companion for academic success and skill development.",
    theme: "professional" as const,
    rating: 4.8,
    conversations: 8765,
    likes: 3456,
    createdAt: "2024-03-01",
  },
];

const CompanionsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [priceFilter, setPriceFilter] = useState<string[]>([]);
  const [languageFilter, setLanguageFilter] = useState<string[]>([]);

  const filteredCompanions = companions
    .filter((companion) => {
      const matchesSearch = companion.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || companion.theme === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.likes - a.likes;
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "rating":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  const featuredCompanions = companions.filter((c) => c.featured);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-blue-50 to-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-4">Browse AI Companions</h1>
              <p className="text-lg text-gray-600 mb-8">
                Discover and connect with AI companions tailored to your needs
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="flex gap-8">
            {/* Sidebar Filters */}
            <div className="w-64 flex-shrink-0">
              <div className="sticky top-24 bg-white rounded-lg border p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Filters</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search companions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4" /> Categories
                  </h4>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <Button
                        key={category.value}
                        variant={
                          selectedCategory === category.value
                            ? "default"
                            : "ghost"
                        }
                        onClick={() => setSelectedCategory(category.value)}
                        className="w-full justify-start"
                        size="sm"
                      >
                        <div className="flex items-center gap-2">
                          {categoryIcons[category.value]}
                          {category.label}
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Star className="w-4 h-4" /> Sort By
                  </h4>
                  <div className="space-y-2">
                    {sortOptions.map((option) => (
                      <Button
                        key={option.value}
                        variant={sortBy === option.value ? "default" : "ghost"}
                        onClick={() => setSortBy(option.value)}
                        className="w-full justify-start"
                        size="sm"
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" /> Pricing
                  </h4>
                  <div className="space-y-2">
                    {["Free", "Premium", "Enterprise"].map((price) => (
                      <Button
                        key={price}
                        variant={
                          priceFilter.includes(price.toLowerCase())
                            ? "default"
                            : "ghost"
                        }
                        onClick={() => {
                          setPriceFilter((prev) =>
                            prev.includes(price.toLowerCase())
                              ? prev.filter((p) => p !== price.toLowerCase())
                              : [...prev, price.toLowerCase()],
                          );
                        }}
                        className="w-full justify-start"
                        size="sm"
                      >
                        {price}
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Globe className="w-4 h-4" /> Languages
                  </h4>
                  <ScrollArea className="h-[120px]">
                    <div className="space-y-2 pr-4">
                      {[
                        "English",
                        "Spanish",
                        "French",
                        "German",
                        "Italian",
                        "Chinese",
                        "Japanese",
                      ].map((lang) => (
                        <Button
                          key={lang}
                          variant={
                            languageFilter.includes(lang.toLowerCase())
                              ? "default"
                              : "ghost"
                          }
                          onClick={() => {
                            setLanguageFilter((prev) =>
                              prev.includes(lang.toLowerCase())
                                ? prev.filter((l) => l !== lang.toLowerCase())
                                : [...prev, lang.toLowerCase()],
                            );
                          }}
                          className="w-full justify-start"
                          size="sm"
                        >
                          {lang}
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <Tabs defaultValue="all" className="w-full">
                <div className="flex justify-between items-center mb-8">
                  <TabsList className="bg-blue-50">
                    <TabsTrigger value="all">All Companions</TabsTrigger>
                    <TabsTrigger value="featured">Featured</TabsTrigger>
                    <TabsTrigger value="new">New Arrivals</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="all">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCompanions.map((companion) => (
                      <CharacterCard
                        key={companion.id}
                        name={companion.name}
                        avatar={companion.avatar}
                        description={companion.description}
                        theme={companion.theme}
                        rating={companion.rating}
                        conversations={companion.conversations}
                        likes={companion.likes}
                      />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="featured">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredCompanions.map((companion) => (
                      <CharacterCard
                        key={companion.id}
                        name={companion.name}
                        avatar={companion.avatar}
                        description={companion.description}
                        theme={companion.theme}
                        rating={companion.rating}
                        conversations={companion.conversations}
                        likes={companion.likes}
                      />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="new">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {companions
                      .sort(
                        (a, b) =>
                          new Date(b.createdAt).getTime() -
                          new Date(a.createdAt).getTime(),
                      )
                      .slice(0, 4)
                      .map((companion) => (
                        <CharacterCard
                          key={companion.id}
                          name={companion.name}
                          avatar={companion.avatar}
                          description={companion.description}
                          theme={companion.theme}
                          rating={companion.rating}
                          conversations={companion.conversations}
                          likes={companion.likes}
                        />
                      ))}
                  </div>
                </TabsContent>
              </Tabs>

              {filteredCompanions.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600">
                    No companions found matching your criteria.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CompanionsPage;
