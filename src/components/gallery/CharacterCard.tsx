import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Star,
  ThumbsUp,
  ThumbsDown,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/supabase-auth";
import { toast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CharacterCardProps {
  id: string;
  name?: string;
  avatar?: string;
  description?: string;
  companion_link?: string;
  theme?: "professional" | "casual" | "fantasy";
  rating?: number;
  conversations?: number;
  likes_count?: number;
  dislikes_count?: number;
  stars_count?: number;
  user_interaction?: {
    liked: boolean;
    disliked: boolean;
    starred: boolean;
  };
  onInteractionUpdate?: () => void;
}

const CharacterCard = ({
  id,
  name = "AI Assistant",
  avatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=default",
  description = "A helpful AI companion ready to assist with various tasks and engage in meaningful conversations.",
  companion_link = "#",
  theme = "professional",
  rating = 4.5,
  conversations = 0,
  likes_count = 0,
  dislikes_count = 0,
  stars_count = 0,
  user_interaction = { liked: false, disliked: false, starred: false },
  onInteractionUpdate,
}: CharacterCardProps) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);
  const [interaction, setInteraction] = React.useState(user_interaction);
  const [counts, setCounts] = React.useState({
    likes: likes_count,
    dislikes: dislikes_count,
    stars: stars_count,
  });

  const themeStyles = {
    professional: "bg-slate-50 hover:bg-slate-100 border-blue-100",
    casual: "bg-orange-50 hover:bg-orange-100 border-orange-100",
    fantasy: "bg-purple-50 hover:bg-purple-100 border-purple-100",
  };

  const themeBadgeStyles = {
    professional: "bg-blue-100 text-blue-800",
    casual: "bg-orange-100 text-orange-800",
    fantasy: "bg-purple-100 text-purple-800",
  };

  const handleInteraction = async (type: "like" | "dislike" | "star") => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to interact with companions",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const newInteraction = { ...interaction };

      // Toggle the interaction
      if (type === "like") {
        newInteraction.liked = !newInteraction.liked;
        if (newInteraction.liked) newInteraction.disliked = false;
      } else if (type === "dislike") {
        newInteraction.disliked = !newInteraction.disliked;
        if (newInteraction.disliked) newInteraction.liked = false;
      } else {
        newInteraction.starred = !newInteraction.starred;
      }

      const { error } = await supabase
        .from("user_companion_interactions")
        .upsert({
          user_id: user.id,
          companion_id: id,
          liked: newInteraction.liked,
          disliked: newInteraction.disliked,
          starred: newInteraction.starred,
        });

      if (error) throw error;

      // Update local state
      setInteraction(newInteraction);
      setCounts((prev) => ({
        ...prev,
        likes: prev.likes + (newInteraction.liked ? 1 : -1),
        dislikes: prev.dislikes + (newInteraction.disliked ? 1 : -1),
        stars: prev.stars + (newInteraction.starred ? 1 : -1),
      }));

      onInteractionUpdate?.();
    } catch (error) {
      console.error("Error updating interaction:", error);
      toast({
        title: "Error",
        description: "Failed to update interaction",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
      <Card
        className={`w-[280px] h-[360px] transition-all duration-300 border-2 ${themeStyles[theme]}`}
      >
        <CardHeader className="text-center">
          <Avatar className="w-24 h-24 mx-auto ring-2 ring-offset-2 ring-slate-100">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <CardTitle className="mt-4">{name}</CardTitle>
          <Badge variant="secondary" className={themeBadgeStyles[theme]}>
            {theme.charAt(0).toUpperCase() + theme.slice(1)}
          </Badge>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-center line-clamp-3">
            {description}
          </CardDescription>
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <div className="flex justify-between w-full">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-0"
                    disabled={isLoading}
                    onClick={() => handleInteraction("star")}
                  >
                    <div className="flex items-center gap-1">
                      <Star
                        className={`w-4 h-4 ${interaction.starred ? "text-yellow-500 fill-yellow-500" : "text-gray-500"}`}
                      />
                      <span className="text-sm font-medium">
                        {counts.stars}
                      </span>
                    </div>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Star this companion</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-0"
                    disabled={isLoading}
                    onClick={() => handleInteraction("like")}
                  >
                    <div className="flex items-center gap-1">
                      <ThumbsUp
                        className={`w-4 h-4 ${interaction.liked ? "text-green-500 fill-green-500" : "text-gray-500"}`}
                      />
                      <span className="text-sm">{counts.likes}</span>
                    </div>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Like this companion</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-0"
                    disabled={isLoading}
                    onClick={() => handleInteraction("dislike")}
                  >
                    <div className="flex items-center gap-1">
                      <ThumbsDown
                        className={`w-4 h-4 ${interaction.disliked ? "text-red-500 fill-red-500" : "text-gray-500"}`}
                      />
                      <span className="text-sm">{counts.dislikes}</span>
                    </div>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Dislike this companion</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Button
            className="w-full group"
            variant="outline"
            onClick={() => window.open(companion_link, "_blank")}
            disabled={!companion_link || companion_link === "#"}
          >
            Chat Now
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default CharacterCard;
