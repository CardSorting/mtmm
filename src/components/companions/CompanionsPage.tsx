import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import CharacterCard from "../gallery/CharacterCard";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Companion, Tag, TagCategory } from "@/types/companions";
import { useAuth } from "@/lib/supabase-auth";
import {
  Search,
  SlidersHorizontal,
  Briefcase,
  Users,
  Wand2,
  Sparkles,
  Star,
  Loader2,
  ChevronDown,
  X,
} from "lucide-react";
import Header from "../layout/Header";
import Footer from "../layout/Footer";

type Theme = "professional" | "casual" | "fantasy" | "all";
type SortOption = "popular" | "newest" | "rating";

const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
  {
    value: "all",
    label: "All Companions",
    icon: <Sparkles className="w-5 h-5" />,
  },
  {
    value: "professional",
    label: "Professional",
    icon: <Briefcase className="w-5 h-5" />,
  },
  { value: "casual", label: "Casual", icon: <Users className="w-5 h-5" /> },
  { value: "fantasy", label: "Fantasy", icon: <Wand2 className="w-5 h-5" /> },
];

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest First" },
  { value: "rating", label: "Highest Rated" },
];

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

const ITEMS_PER_PAGE = 9;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 12,
    },
  },
};

const newItemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 70,
      damping: 15,
    },
  },
};

const CompanionsPage: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [allCompanions, setAllCompanions] = useState<Companion[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<Theme>("all");
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [displayedItems, setDisplayedItems] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);
  const [newItemsStartIndex, setNewItemsStartIndex] = useState(0);
  const [initialLoading, setInitialLoading] = useState(true);
  const [categories, setCategories] = useState<TagCategory[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const fetchData = async () => {
    try {
      // Fetch companions with user interactions
      const { data: companionsData, error: companionsError } = await supabase
        .from("companions")
        .select(
          `
          *,
          companions_tags!inner(tag_id),
          tags!inner(id, name, category_id, category:tag_categories(*)),
          user_companion_interactions!left (liked, disliked, starred)
        `,
        )
        .order("created_at", { ascending: false });

      if (companionsError) throw companionsError;

      // Transform the data to include user interactions
      const transformedCompanions = companionsData?.map((companion) => ({
        ...companion,
        user_interaction: companion.user_companion_interactions?.[0] || {
          liked: false,
          disliked: false,
          starred: false,
        },
      }));

      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("tag_categories")
        .select("*")
        .order("name");

      if (categoriesError) throw categoriesError;

      // Fetch tags
      const { data: tagsData, error: tagsError } = await supabase
        .from("tags")
        .select("*, category:tag_categories(*)")
        .order("name");

      if (tagsError) throw tagsError;

      setAllCompanions(transformedCompanions || []);
      setCategories(categoriesData || []);
      setTags(tagsData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const groupedTags = tags.reduce(
    (acc, tag) => {
      const categoryId = tag.category_id;
      if (!acc[categoryId]) {
        acc[categoryId] = [];
      }
      acc[categoryId].push(tag);
      return acc;
    },
    {} as Record<string, Tag[]>,
  );

  const filteredCompanions = allCompanions
    .filter((companion) => {
      const matchesSearch = companion.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesTheme =
        selectedTheme === "all" || companion.theme === selectedTheme;
      const matchesTags =
        selectedTags.length === 0 ||
        companion.tags?.some((tag) => selectedTags.includes(tag.id));
      return matchesSearch && matchesTheme && matchesTags;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.likes_count - a.likes_count;
        case "newest":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "rating":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  const featuredCompanions = allCompanions.filter((c) => c.featured);
  const visibleCompanions = filteredCompanions.slice(0, displayedItems);

  useEffect(() => {
    setDisplayedItems(ITEMS_PER_PAGE);
    setNewItemsStartIndex(0);
  }, [searchQuery, selectedTheme, sortBy, selectedTags]);

  const handleShowMore = () => {
    setIsLoading(true);
    setNewItemsStartIndex(displayedItems);
    setTimeout(() => {
      setDisplayedItems((prev) =>
        Math.min(prev + ITEMS_PER_PAGE, filteredCompanions.length),
      );
      setIsLoading(false);
    }, 800);
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    );
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
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
            {/* Left Sidebar */}
            <div className="w-64 flex-shrink-0">
              <div className="sticky top-24 bg-white rounded-lg border p-6 space-y-6">
                {/* Search Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Search</h3>
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

                <Separator />

                {/* Themes Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Themes</h3>
                  <div className="space-y-1">
                    {themes.map((theme) => (
                      <Button
                        key={theme.value}
                        variant={
                          selectedTheme === theme.value ? "default" : "ghost"
                        }
                        onClick={() => setSelectedTheme(theme.value)}
                        className="w-full justify-start"
                        size="sm"
                      >
                        <div className="flex items-center gap-2">
                          {theme.icon}
                          {theme.label}
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Sort Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Sort By</h3>
                  <div className="space-y-1">
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

                <div className="flex gap-8">
                  <div className="flex-1">
                    <TabsContent value="all">
                      <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
                      >
                        <AnimatePresence>
                          {visibleCompanions.map((companion, index) => (
                            <motion.div
                              key={companion.id}
                              variants={
                                index >= newItemsStartIndex
                                  ? newItemVariants
                                  : itemVariants
                              }
                              initial="hidden"
                              animate="visible"
                              style={{
                                zIndex: visibleCompanions.length - index,
                              }}
                              className={`hover:scale-105 transition-transform duration-200 ${index >= newItemsStartIndex ? "relative" : ""}`}
                            >
                              <CharacterCard
                                id={companion.id}
                                name={companion.name}
                                avatar={companion.avatar}
                                description={companion.description}
                                companion_link={companion.companion_link}
                                theme={companion.theme}
                                rating={companion.rating}
                                conversations={companion.conversations}
                                likes_count={companion.likes_count}
                                dislikes_count={companion.dislikes_count}
                                stars_count={companion.stars_count}
                                user_interaction={companion.user_interaction}
                                onInteractionUpdate={fetchData}
                              />
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </motion.div>

                      {visibleCompanions.length < filteredCompanions.length && (
                        <motion.div
                          className="flex justify-center items-center py-12"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <Button
                            size="lg"
                            onClick={handleShowMore}
                            disabled={isLoading}
                            className="min-w-[200px] bg-blue-600 hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
                          >
                            {isLoading ? (
                              <div className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Loading more companions...</span>
                              </div>
                            ) : (
                              "Show More Companions"
                            )}
                          </Button>
                        </motion.div>
                      )}
                    </TabsContent>

                    <TabsContent value="featured">
                      <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
                      >
                        {featuredCompanions.map((companion, index) => (
                          <motion.div
                            key={companion.id}
                            variants={itemVariants}
                            style={{
                              zIndex: featuredCompanions.length - index,
                            }}
                            className="hover:scale-105 transition-transform duration-200"
                          >
                            <CharacterCard
                              id={companion.id}
                              name={companion.name}
                              avatar={companion.avatar}
                              description={companion.description}
                              companion_link={companion.companion_link}
                              theme={companion.theme}
                              rating={companion.rating}
                              conversations={companion.conversations}
                              likes_count={companion.likes_count}
                              dislikes_count={companion.dislikes_count}
                              stars_count={companion.stars_count}
                              user_interaction={companion.user_interaction}
                              onInteractionUpdate={fetchData}
                            />
                          </motion.div>
                        ))}
                      </motion.div>
                    </TabsContent>

                    <TabsContent value="new">
                      <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
                      >
                        {allCompanions
                          .sort(
                            (a, b) =>
                              new Date(b.created_at).getTime() -
                              new Date(a.created_at).getTime(),
                          )
                          .slice(0, 6)
                          .map((companion, index) => (
                            <motion.div
                              key={companion.id}
                              variants={itemVariants}
                              style={{
                                zIndex: 6 - index,
                              }}
                              className="hover:scale-105 transition-transform duration-200"
                            >
                              <CharacterCard
                                id={companion.id}
                                name={companion.name}
                                avatar={companion.avatar}
                                description={companion.description}
                                companion_link={companion.companion_link}
                                theme={companion.theme}
                                rating={companion.rating}
                                conversations={companion.conversations}
                                likes_count={companion.likes_count}
                                dislikes_count={companion.dislikes_count}
                                stars_count={companion.stars_count}
                                user_interaction={companion.user_interaction}
                                onInteractionUpdate={fetchData}
                              />
                            </motion.div>
                          ))}
                      </motion.div>
                    </TabsContent>
                  </div>

                  {/* Right Sidebar */}
                  <div className="w-64 flex-shrink-0">
                    <div className="sticky top-24 bg-white rounded-lg border p-6 space-y-6">
                      {/* Categories & Tags Section */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">
                          Filter by Category
                        </h3>
                        <ScrollArea className="h-[400px] pr-4">
                          <div className="space-y-4">
                            {categories.map((category) => {
                              const categoryTags =
                                groupedTags[category.id] || [];
                              if (categoryTags.length === 0) return null;

                              const selectedCount = categoryTags.filter((tag) =>
                                selectedTags.includes(tag.id),
                              ).length;

                              return (
                                <div
                                  key={category.id}
                                  className="bg-gray-50 rounded-lg p-3"
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-sm">
                                      {category.name}
                                    </span>
                                    {selectedCount > 0 && (
                                      <Badge
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        {selectedCount}
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="space-y-1">
                                    {categoryTags.map((tag) => (
                                      <Button
                                        key={tag.id}
                                        variant={
                                          selectedTags.includes(tag.id)
                                            ? "default"
                                            : "ghost"
                                        }
                                        onClick={() => toggleTag(tag.id)}
                                        className="w-full justify-start text-xs font-normal h-8"
                                        size="sm"
                                      >
                                        {tag.name}
                                      </Button>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </ScrollArea>
                      </div>

                      {selectedTags.length > 0 && (
                        <div className="border-t pt-6">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium">
                              Selected Filters
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 text-xs"
                              onClick={() => setSelectedTags([])}
                            >
                              Clear all
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {selectedTags.map((tagId) => {
                              const tag = tags.find((t) => t.id === tagId);
                              return (
                                <Badge
                                  key={tagId}
                                  variant="secondary"
                                  className="cursor-pointer hover:bg-gray-200 text-xs"
                                  onClick={() => toggleTag(tagId)}
                                >
                                  {tag?.name}
                                  <X className="w-3 h-3 ml-1" />
                                </Badge>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
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
