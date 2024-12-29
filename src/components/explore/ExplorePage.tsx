import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import CharacterCard from "../gallery/CharacterCard";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Companion, Tag, TagCategory } from "@/types/companions";
import { Search, X, Filter } from "lucide-react";
import Header from "../layout/Header";
import Footer from "../layout/Footer";

const ExplorePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [allCompanions, setAllCompanions] = useState<Companion[]>([]);
  const [categories, setCategories] = useState<TagCategory[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);

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
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Browse by Category</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => {
                const categoryTags = groupedTags[category.id] || [];
                if (categoryTags.length === 0) return null;

                return (
                  <div
                    key={category.id}
                    className="bg-white rounded-lg border p-4 space-y-3"
                  >
                    <h3 className="font-medium">{category.name}</h3>
                    <div className="flex flex-wrap gap-2">
                      {categoryTags.map((tag) => (
                        <Badge
                          key={tag.id}
                          variant={
                            selectedTags.includes(tag.id)
                              ? "default"
                              : "secondary"
                          }
                          className="cursor-pointer hover:bg-gray-100"
                          onClick={() => toggleTag(tag.id)}
                        >
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {selectedTags.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Active Filters</h2>
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
                      variant="default"
                      className="cursor-pointer"
                      onClick={() => toggleTag(tagId)}
                    >
                      {tag?.name}
                      <X className="w-3 h-3 ml-2" />
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}

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
