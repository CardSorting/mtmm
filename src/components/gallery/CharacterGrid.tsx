import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import CharacterCard from "./CharacterCard";
import { Companion } from "@/types/companions";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/supabase-auth";

interface CharacterGridProps {
  selectedTheme?: "professional" | "casual" | "fantasy" | "all";
}

const CharacterGrid = ({ selectedTheme = "all" }: CharacterGridProps) => {
  const { user } = useAuth();
  const [characters, setCharacters] = useState<Companion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCharacters = async () => {
    try {
      let query = supabase.from("companions").select(`
          *,
          user_companion_interactions!left (liked, disliked, starred)
        `);

      if (selectedTheme !== "all") {
        query = query.eq("theme", selectedTheme);
      }

      const { data, error } = await query;
      if (error) throw error;

      const transformedData = data.map((companion) => ({
        ...companion,
        user_interaction: companion.user_companion_interactions?.[0] || {
          liked: false,
          disliked: false,
          starred: false,
        },
      }));

      setCharacters(transformedData || []);
    } catch (error) {
      console.error("Error fetching characters:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacters();
  }, [selectedTheme, user]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (characters.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12">
        No companions found for this theme.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
      {characters.map((character) => (
        <CharacterCard
          key={character.id}
          id={character.id}
          name={character.name}
          avatar={character.avatar}
          description={character.description}
          theme={character.theme}
          rating={character.rating}
          conversations={character.conversations}
          likes_count={character.likes_count}
          dislikes_count={character.dislikes_count}
          stars_count={character.stars_count}
          user_interaction={character.user_interaction}
          onInteractionUpdate={fetchCharacters}
          companion_link={character.companion_link}
        />
      ))}
    </div>
  );
};

export default CharacterGrid;
