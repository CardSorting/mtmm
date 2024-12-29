import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Users, Sparkles, Briefcase, Wand2, Filter, LogIn } from "lucide-react";
import { useAuth } from "@/lib/supabase-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase";

const companionsLinks = [
  {
    title: "Professional",
    href: "/companions?category=professional",
    description: "AI companions for business and professional development",
    icon: <Briefcase className="w-5 h-5" />,
  },
  {
    title: "Casual",
    href: "/companions?category=casual",
    description: "Friendly AI companions for everyday conversations",
    icon: <Users className="w-5 h-5" />,
  },
  {
    title: "Fantasy",
    href: "/companions?category=fantasy",
    description: "Imaginative AI companions for creative adventures",
    icon: <Wand2 className="w-5 h-5" />,
  },
  {
    title: "Explore All",
    href: "/explore",
    description: "Browse all companions by categories and interests",
    icon: <Filter className="w-5 h-5" />,
  },
];

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

const Header = () => {
  const location = useLocation();
  const { user } = useAuth();
  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-blue-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Matrix Mingle
            </span>
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={cn(
                    "bg-transparent",
                    (isActive("/companions") || isActive("/explore")) &&
                      "text-blue-600",
                  )}
                >
                  Browse
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {companionsLinks.map((item) => (
                      <li key={item.title} className="row-span-3">
                        <Link
                          to={item.href}
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        >
                          <div className="mb-2 mt-4 text-blue-600">
                            {item.icon}
                          </div>
                          <div className="mb-2 text-lg font-medium">
                            {item.title}
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            {item.description}
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user.user_metadata?.avatar_url}
                        alt={user.email}
                      />
                      <AvatarFallback>
                        {user.email?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem className="flex-col items-start">
                    <div className="text-sm font-medium">{user.email}</div>
                    <div className="text-xs text-gray-500">Administrator</div>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/admin/companions">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                className="text-gray-700"
                onClick={() => (window.location.href = "/login")}
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign in
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Get Started
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
