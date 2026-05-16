import { useContext } from "react";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import {
  AUTH_ROUTE,
  ADMIN_ROUTE,
  USER_ROUTE,
} from "./constants/routeConstants";

import { AuthContext } from "./context/AuthContext";

/* ================= AUTH PAGES ================= */

import Login from "./pages/Login";
import Register from "./pages/Register";

/* ================= USER PAGES ================= */

import Home from "./pages/user/Homepage";
import AboutUs from "./pages/user/AboutUs";
import PropertyList from "./pages/user/PropertyList";
import Property from "./pages/user/Property";
import Contact from "./pages/user/Contact";

/* ================= ADMIN ================= */

import AdminLayout from "./layouts/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";

/* ================= SELLER ================= */

import SellerDashboard from "./pages/seller/SellerDashboard";
import AddProperty from "./pages/seller/AddProperty";
import EditProperty from "./pages/seller/EditProperty";
import SellerInquiries from "./pages/seller/SellerInquiries";

/* ================= SHARED ================= */

import Profile from "./components/users/Profile";

/* ================= ROUTE GUARDS ================= */

import ProtectedRoute from "./routes/ProtectedRoute";
import GuestRoute from "./routes/GuestRoute";
import RoleRoute from "./routes/RoleRoute";

const App = () => {
  const { user, loading } =
    useContext(AuthContext);

  /* Loading Screen */

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#F7F6F3]">
        <span className="w-8 h-8 border-2 border-gray-200 border-t-[#C8973A] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Routes>
      {/* ================= GUEST ROUTES ================= */}

      <Route
        element={
          <GuestRoute user={user} />
        }
      >
        <Route
          path={AUTH_ROUTE.LOGIN}
          element={<Login />}
        />

        <Route
          path={AUTH_ROUTE.REGISTER}
          element={<Register />}
        />
      </Route>

      {/* ================= PUBLIC ROUTES ================= */}

      <Route
        path={USER_ROUTE.HOME}
        element={<Home />}
      />

      <Route
        path={USER_ROUTE.ABOUT}
        element={<AboutUs />}
      />

      <Route
        path={
          USER_ROUTE.PROPERTY_LIST
        }
        element={<PropertyList />}
      />

      <Route
        path={USER_ROUTE.PROPERTY}
        element={<Property />}
      />

      <Route
        path={
          USER_ROUTE.CONTACT_US
        }
        element={<Contact />}
      />

      {/* ================= PROTECTED USER ROUTES ================= */}

      <Route
        element={
          <ProtectedRoute
            user={user}
          />
        }
      >
        <Route
          path={USER_ROUTE.PROFILE}
          element={<Profile />}
        />
      </Route>

      {/* ================= ADMIN ROUTES ================= */}

      <Route
        element={
          <ProtectedRoute
            user={user}
          />
        }
      >
        <Route
          element={
            <RoleRoute
              user={user}
              allowedRoles={[
                "admin",
              ]}
            />
          }
        >
          <Route
            element={<AdminLayout />}
          >
            <Route
              path={
                ADMIN_ROUTE.DASHBOARD
              }
              element={<Dashboard />}
            />
          </Route>
        </Route>
      </Route>

      {/* ================= SELLER ROUTES ================= */}

      <Route
        element={
          <ProtectedRoute
            user={user}
          />
        }
      >
        <Route
          element={
            <RoleRoute
              user={user}
              allowedRoles={[
                "seller",
              ]}
            />
          }
        >
          <Route
            path="/seller/dashboard"
            element={
              <SellerDashboard />
            }
          />

          <Route
            path="/seller/properties"
            element={
              <SellerDashboard />
            }
          />

          <Route
            path="/seller/add-property"
            element={
              <AddProperty />
            }
          />

          <Route
            path="/seller/edit-property/:id"
            element={
              <EditProperty />
            }
          />

          <Route
            path="/seller/inquiries"
            element={
              <SellerInquiries />
            }
          />
        </Route>
      </Route>

      {/* ================= UNAUTHORIZED ================= */}

      <Route
        path="/unauthorized"
        element={
          <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
            You are not authorized
            to view this page.
          </div>
        }
      />

      {/* ================= 404 ================= */}

      <Route
        path="*"
        element={
          <Navigate
            to={USER_ROUTE.HOME}
            replace
          />
        }
      />
    </Routes>
  );
};

export default App;