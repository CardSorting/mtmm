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
import { MessageCircle, Star, ThumbsUp, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface CharacterCardProps {
  name?: string;
  avatar?: string;
  description?: string;
  theme?: "professional" | "casual" | "fantasy";
  rating?: number;
  conversations?: number;
  likes?: number;
}

const CharacterCard = ({
  name = "AI Assistant",
  avatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=default",
  description = "A helpful AI companion ready to assist with various tasks and engage in meaningful conversations.",
  theme = "professional",
  rating = 4.5,
  conversations = 1234,
  likes = 567,
}: CharacterCardProps) => {
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
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-medium">{rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{conversations}</span>
            </div>
            <div className="flex items-center gap-1">
              <ThumbsUp className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{likes}</span>
            </div>
          </div>
          <Button className="w-full group" variant="outline">
            Chat Now
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default CharacterCard;
