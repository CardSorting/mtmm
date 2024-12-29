import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import CompanionsPage from "./components/companions/CompanionsPage";
import AdminLayout from "./components/admin/AdminLayout";
import CompanionsAdmin from "./components/admin/CompanionsAdmin";
import routes from "tempo-routes";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/companions" element={<CompanionsPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="companions" element={<CompanionsAdmin />} />
        </Route>
      </Routes>
      {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
    </Suspense>
  );
}

export default App;
