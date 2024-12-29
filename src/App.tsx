import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/home";
import CompanionsPage from "./components/companions/CompanionsPage";
import AdminLayout from "./components/admin/AdminLayout";
import CompanionsAdmin from "./components/admin/CompanionsAdmin";
import ExplorePage from "./components/explore/ExplorePage";
import LoginPage from "./components/auth/LoginPage";
import { AuthProvider } from "./components/auth/AuthProvider";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import UserDashboard from "./components/user/UserDashboard";
import UserLayout from "./components/user/UserLayout";

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<p>Loading...</p>}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/companions" element={<CompanionsPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* User routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <UserLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<UserDashboard />} />
          </Route>

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<CompanionsAdmin />} />
            <Route path="companions" element={<CompanionsAdmin />} />
          </Route>
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
