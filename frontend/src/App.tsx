import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import GraphPage from "./pages/GraphPage";
import NotFound from "./pages/NotFound";
import DeveloperGuide from "./pages/DeveloperGuide";
import UserGuide from "./pages/UserGuide";

import ProtectedRoute from "./components/layout/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/developers" element={<DeveloperGuide />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/graph"
        element={
          <ProtectedRoute>
            <GraphPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/guide"
        element={
          <ProtectedRoute>
            <UserGuide />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
