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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ExplorePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [allCompanions, setAllCompanions] = useState<Companion[]>([]);
  const [categories, setCategories] = useState<TagCategory[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [showAllTags, setShowAllTags] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch companions
        const { data: companionsData, error: companionsError } = await supabase
          .from("companions")
          .select(
            `
            *,
            companions_tags!inner(tag_id),
            tags!inner(id, name, category_id, category:tag_categories(*))
          `,
          )
          .order("created_at", { ascending: false });

        if (companionsError) throw companionsError;

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

        setAllCompanions(companionsData || []);
        setCategories(categoriesData || []);
        setTags(tagsData || []);

        // Set first category as expanded by default
        if (categoriesData && categoriesData.length > 0) {
          setExpandedCategories([categoriesData[0].id]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchData();
  }, []);

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

  const filteredCompanions = allCompanions.filter((companion) => {
    const matchesSearch = companion.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesTags =
      selectedTags.length === 0 ||
      companion.tags?.some((tag) => selectedTags.includes(tag.id));
    return matchesSearch && matchesTags;
  });

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    );
  };

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

  const MAX_VISIBLE_TAGS = 8;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <div className="bg-gradient-to-b from-blue-50 to-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-4">Explore AI Companions</h1>
              <p className="text-lg text-gray-600 mb-8">
                Discover companions by categories and interests
              </p>
              <div className="max-w-xl mx-auto relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search companions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-lg"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {/* Categories Section */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Filter className="w-5 h-5" />
              <h2 className="text-2xl font-semibold">Browse by Category</h2>
            </div>
            <div className="space-y-6">
              {categories.map((category) => {
                const categoryTags = groupedTags[category.id] || [];
                if (categoryTags.length === 0) return null;

                const isExpanded = expandedCategories.includes(category.id);
                const showAll = showAllTags[category.id];
                const visibleTags = showAll
                  ? categoryTags
                  : categoryTags.slice(0, MAX_VISIBLE_TAGS);
                const hasMoreTags = categoryTags.length > MAX_VISIBLE_TAGS;

                const selectedCount = categoryTags.filter((tag) =>
                  selectedTags.includes(tag.id),
                ).length;

                return (
                  <div
                    key={category.id}
                    className="bg-white rounded-xl border shadow-sm overflow-hidden"
                  >
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-medium">{category.name}</h3>
                        {selectedCount > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {selectedCount} selected
                          </Badge>
                        )}
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      />
                    </button>

                    {isExpanded && (
                      <div className="p-4 bg-gray-50 border-t">
                        <div className="flex flex-wrap gap-2">
                          {visibleTags.map((tag) => (
                            <Badge
                              key={tag.id}
                              variant={
                                selectedTags.includes(tag.id)
                                  ? "default"
                                  : "secondary"
                              }
                              className="cursor-pointer hover:bg-gray-100 text-sm py-1 px-3"
                              onClick={() => toggleTag(tag.id)}
                            >
                              {tag.name}
                            </Badge>
                          ))}
                        </div>
                        {hasMoreTags && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleShowAllTags(category.id)}
                            className="mt-3 text-sm font-normal"
                          >
                            {showAll
                              ? "Show less"
                              : `Show ${categoryTags.length - MAX_VISIBLE_TAGS} more tags`}
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Filters */}
          {selectedTags.length > 0 && (
            <div className="mb-8 bg-white rounded-xl border p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Active Filters</span>
                  <Badge variant="secondary" className="text-xs">
                    {selectedTags.length}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTags([])}
                  className="text-sm font-normal h-8"
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
                      variant="default"
                      className="cursor-pointer group pr-2"
                      onClick={() => toggleTag(tagId)}
                    >
                      {tag?.name}
                      <X className="w-3 h-3 ml-1 opacity-50 group-hover:opacity-100" />
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredCompanions.map((companion) => (
              <motion.div
                key={companion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CharacterCard
                  name={companion.name}
                  avatar={companion.avatar}
                  description={companion.description}
                  companion_link={companion.companion_link}
                  theme={companion.theme}
                  rating={companion.rating}
                  conversations={companion.conversations}
                  likes={companion.likes}
                />
              </motion.div>
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
      </main>
      <Footer />
    </div>
  );
};

export default ExplorePage;
