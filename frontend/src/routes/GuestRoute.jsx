// src/routes/GuestRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { USER_ROUTE } from "../constants/routeConstants";

// ─────────────────────────────────────────────────────────────────────────────
// GuestRoute
// Blocks access to login / register when the user is already authenticated.
// Logged-in users visiting /login or /register are sent straight to home.
//
// Usage:
//   <Route element={<GuestRoute user={user} />}>
//     <Route path="/auth/login"    element={<Login />} />
//     <Route path="/auth/register" element={<Register />} />
//   </Route>
// ─────────────────────────────────────────────────────────────────────────────
const GuestRoute = ({ user }) => {
  if (user) {
    return <Navigate to={USER_ROUTE.HOME} replace />;
  }

  return <Outlet />;
};

export default GuestRoute;
