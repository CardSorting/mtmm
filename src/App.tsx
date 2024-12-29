import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/home";
import CompanionsPage from "./components/companions/CompanionsPage";
import AdminLayout from "./components/admin/AdminLayout";
import CompanionsAdmin from "./components/admin/CompanionsAdmin";
import LoginPage from "./components/auth/LoginPage";
import { AuthProvider } from "./components/auth/AuthProvider";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<p>Loading...</p>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/companions" element={<CompanionsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
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
