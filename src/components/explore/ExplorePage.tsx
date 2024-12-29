import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import CharacterCard from "../gallery/CharacterCard";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Companion, Tag, TagCategory } from "@/types/companions";
import { Search, X, Filter, ChevronDown } from "lucide-react";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import { useAuth } from "@/lib/supabase-auth";

const ExplorePage: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [allCompanions, setAllCompanions] = useState<Companion[]>([]);
  const [categories, setCategories] = useState<TagCategory[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [showAllTags, setShowAllTags] = useState<Record<string, boolean>>({});

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

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  const toggleShowAllTags = (categoryId: string) => {
    setShowAllTags((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    );
  };

  const filteredCompanions = allCompanions.filter((companion) => {
    const matchesSearch = companion.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesTags =
      selectedTags.length === 0 ||
      companion.tags?.some((tag) => selectedTags.includes(tag.id));
    return matchesSearch && matchesTags;
  });

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

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Left sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search companions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Categories */}
              <div className="bg-white rounded-lg border p-4">
                <h3 className="font-semibold mb-4">Categories</h3>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4 pr-4">
                    {categories.map((category) => {
                      const categoryTags = groupedTags[category.id] || [];
                      if (categoryTags.length === 0) return null;

                      const isExpanded = expandedCategories.includes(
                        category.id,
                      );
                      const showAll = showAllTags[category.id];
                      const displayedTags = showAll
                        ? categoryTags
                        : categoryTags.slice(0, 5);

                      return (
                        <div key={category.id} className="space-y-2">
                          <Button
                            variant="ghost"
                            className="w-full justify-between font-medium"
                            onClick={() => toggleCategory(category.id)}
                          >
                            {category.name}
                            <ChevronDown
                              className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                            />
                          </Button>

                          {isExpanded && (
                            <div className="pl-2 space-y-1">
                              {displayedTags.map((tag) => (
                                <Button
                                  key={tag.id}
                                  variant={
                                    selectedTags.includes(tag.id)
                                      ? "default"
                                      : "ghost"
                                  }
                                  className="w-full justify-start text-sm"
                                  onClick={() => toggleTag(tag.id)}
                                >
                                  {tag.name}
                                </Button>
                              ))}
                              {categoryTags.length > 5 && (
                                <Button
                                  variant="ghost"
                                  className="w-full text-sm text-muted-foreground"
                                  onClick={() => toggleShowAllTags(category.id)}
                                >
                                  {showAll
                                    ? "Show less"
                                    : `Show ${categoryTags.length - 5} more`}
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>

              {/* Selected filters */}
              {selectedTags.length > 0 && (
                <div className="bg-white rounded-lg border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Selected Filters</h3>
                    <Button
                      variant="ghost"
                      size="sm"
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
                          className="cursor-pointer hover:bg-gray-200"
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

          {/* Main content */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompanions.map((companion) => (
                <CharacterCard
                  key={companion.id}
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
              ))}
            </div>

            {filteredCompanions.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600">
                  No companions found matching your criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ExplorePage;
