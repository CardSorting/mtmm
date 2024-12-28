import React from "react";
import CharacterCard from "./CharacterCard";

interface Character {
  id: string;
  name: string;
  avatar: string;
  description: string;
  theme: "professional" | "casual" | "fantasy";
  rating: number;
  conversations: number;
  likes: number;
}

interface CharacterGridProps {
  characters?: Character[];
  selectedTheme?: "professional" | "casual" | "fantasy" | "all";
}

const CharacterGrid = ({
  characters = [
    {
      id: "1",
      name: "Business Advisor",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=business",
      description:
        "Professional AI assistant specializing in business strategy and management consulting.",
      theme: "professional",
      rating: 4.8,
      conversations: 2345,
      likes: 890,
    },
    {
      id: "2",
      name: "Creative Companion",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=creative",
      description:
        "Your friendly AI partner for brainstorming and creative projects.",
      theme: "casual",
      rating: 4.6,
      conversations: 1567,
      likes: 723,
    },
    {
      id: "3",
      name: "Mystic Guide",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mystic",
      description:
        "Embark on magical adventures with this fantasy-themed AI companion.",
      theme: "fantasy",
      rating: 4.9,
      conversations: 3456,
      likes: 1234,
    },
    {
      id: "4",
      name: "Tech Mentor",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=tech",
      description:
        "Expert AI guide for all your technology and programming needs.",
      theme: "professional",
      rating: 4.7,
      conversations: 4321,
      likes: 987,
    },
    {
      id: "5",
      name: "Fitness Coach",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=fitness",
      description:
        "Your personal AI trainer for workout plans and healthy lifestyle tips.",
      theme: "professional",
      rating: 4.5,
      conversations: 1890,
      likes: 645,
    },
    {
      id: "6",
      name: "Travel Buddy",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=travel",
      description:
        "Casual travel companion to help plan adventures and discover new places.",
      theme: "casual",
      rating: 4.7,
      conversations: 2156,
      likes: 892,
    },
    {
      id: "7",
      name: "Dragon Keeper",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dragon",
      description:
        "A mystical companion versed in dragon lore and magical creatures.",
      theme: "fantasy",
      rating: 4.8,
      conversations: 1678,
      likes: 743,
    },
    {
      id: "8",
      name: "Study Partner",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=study",
      description:
        "Your dedicated AI study buddy for academic success and learning.",
      theme: "casual",
      rating: 4.6,
      conversations: 3245,
      likes: 1123,
    },
  ],
  selectedTheme = "all",
}: CharacterGridProps) => {
  const filteredCharacters =
    selectedTheme === "all"
      ? characters
      : characters.filter((character) => character.theme === selectedTheme);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
      {filteredCharacters.map((character) => (
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
