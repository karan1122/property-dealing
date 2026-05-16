// src/components/ProtectedRoute.jsx
import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// ─── ProtectedRoute ───────────────────────────────────────────────────────────
// Wraps any route that requires authentication.
// If not authenticated → redirect to /auth/login (preserving intended URL).
// If allowedRoles provided → also checks user.role.
//
// Usage in router:
//   <Route element={<ProtectedRoute />}>
//     <Route path="/" element={<Dashboard />} />
//   </Route>
//
//   <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
//     <Route path="/admin" element={<AdminPanel />} />
//   </Route>
// ─────────────────────────────────────────────────────────────────────────────

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  // Still restoring session from refresh token cookie
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#F7F6F3]">
        <span className="w-8 h-8 border-2 border-gray-200 border-t-[#C8973A] rounded-full animate-spin" />
      </div>
    );
  }

  // Not logged in → go to login, remember where they wanted to go
  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Logged in but wrong role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // All good — render child routes
  return <Outlet />;
};

export default ProtectedRoute;
