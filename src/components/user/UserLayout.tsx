import React from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { MessageSquare, User, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";

const UserLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: User,
    },
    {
      name: "My Chats",
      href: "/dashboard/chats",
      icon: MessageSquare,
    },
  ];

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
      return;
    }
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r min-h-screen p-4">
          <div className="text-xl font-bold mb-8 px-4">User Dashboard</div>
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center px-4 py-2 text-sm font-medium rounded-md",
                    isActive
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5",
                      isActive
                        ? "text-gray-500"
                        : "text-gray-400 group-hover:text-gray-500",
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className={cn(
                "flex w-full items-center px-4 py-2 text-sm font-medium rounded-md",
                "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
              )}
            >
              <LogOut
                className={cn(
                  "mr-3 h-5 w-5",
                  "text-gray-400 group-hover:text-gray-500",
                )}
              />
              Sign Out
            </button>
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default UserLayout;
