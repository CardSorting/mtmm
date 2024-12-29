import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import CharacterCard from "./CharacterCard";
import { Companion } from "@/types/companions";
import { Loader2 } from "lucide-react";

interface CharacterGridProps {
  selectedTheme?: "professional" | "casual" | "fantasy" | "all";
}

const CharacterGrid = ({ selectedTheme = "all" }: CharacterGridProps) => {
  const [characters, setCharacters] = useState<Companion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        let query = supabase.from("companions").select("*");

        if (selectedTheme !== "all") {
          query = query.eq("theme", selectedTheme);
        }

        const { data, error } = await query;
        if (error) throw error;
        setCharacters(data || []);
      } catch (error) {
        console.error("Error fetching characters:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharacters();
  }, [selectedTheme]);

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
          name={character.name}
          avatar={character.avatar}
          description={character.description}
          theme={character.theme}
          rating={character.rating}
          conversations={character.conversations}
          likes={character.likes}
        />
      ))}
    </div>
  );
};

export default CharacterGrid;
