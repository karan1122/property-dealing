// src/routes/RoleRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { USER_ROUTE } from "../constants/routeConstants";

// ─────────────────────────────────────────────────────────────────────────────
// RoleRoute
// Used AFTER ProtectedRoute (user is already confirmed logged-in).
// Checks that user.role is in the allowedRoles array.
// Wrong role → redirect to home (or an /unauthorized page if you prefer).
//
// Usage:
//   <Route element={<ProtectedRoute user={user} />}>
//     <Route element={<RoleRoute user={user} allowedRoles={["admin"]} />}>
//       <Route path="/admin/dashboard" element={<Dashboard />} />
//     </Route>
//   </Route>
// ─────────────────────────────────────────────────────────────────────────────
const RoleRoute = ({ user, allowedRoles = [] }) => {
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={USER_ROUTE.HOME} replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
