import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const Header = () => {
  return (
    <header className="w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Companions
            </span>
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/features" className={navigationMenuTriggerStyle()}>
                  Features
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/pricing" className={navigationMenuTriggerStyle()}>
                  Pricing
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/about" className={navigationMenuTriggerStyle()}>
                  About
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost">Sign In</Button>
          <Button className="bg-blue-600 hover:bg-blue-700">Get Started</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
