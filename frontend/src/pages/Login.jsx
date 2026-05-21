import { useState, useContext } from "react";
import {
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

import { useFormik } from "formik";
import * as Yup from "yup";

import { AUTH_ROUTE } from "../constants/routeConstants";

import API from "../api/axios";

import { AuthContext } from "../context/AuthContext";

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Building2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const Login = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const { setUser } =
    useContext(AuthContext);

  const [showPassword, setShowPassword] =
    useState(false);

  const [loginSuccess, setLoginSuccess] =
    useState(false);

  const [generalError, setGeneralError] =
    useState("");

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: Yup.object({
      email: Yup.string()
        .email(
          "Enter a valid email address"
        )
        .required(
          "Email is required"
        ),

      password: Yup.string().required(
        "Password is required"
      ),
    }),

    onSubmit: async (
      values,
      { setSubmitting }
    ) => {
      try {
        setGeneralError("");

        const res = await API.post(
          "/auth/login",
          values
        );

        window.__accessToken =
          res.data.accessToken;

   setUser(res.data.user, res.data.accessToken);

        setLoginSuccess(true);

        setTimeout(() => {
          if (
            res.data.user.role ===
            "admin"
          ) {
            navigate(
              "/dashboard"
            );
          } else if (
            res.data.user.role ===
            "seller"
          ) {
            navigate(
              "/seller/dashboard"
            );
          }
          else if (res.data.user.role === "agent") {
            navigate("/agent/dashboard");
          }
          else {
            navigate(
              location.state?.from
                ?.pathname || "/",
              { replace: true }
            );
          }
        }, 1500);
      } catch (error) {
        setGeneralError(
          error.response?.data
            ?.message ||
            "Login failed"
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  const getFieldClass = (
    field
  ) => {
    const base =
      "w-full pl-10 pr-4 py-2.5 text-sm border rounded-lg outline-none transition-all duration-150 bg-white text-gray-800 placeholder-gray-400";

    if (
      formik.touched[field] &&
      formik.errors[field]
    )
      return `${base} border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100`;

    if (
      formik.touched[field] &&
      !formik.errors[field]
    )
      return `${base} border-green-400 focus:border-green-500 focus:ring-2 focus:ring-green-100`;

    return `${base} border-gray-200 focus:border-[#C8973A] focus:ring-2 focus:ring-[#C8973A]/10`;
  };

  const ErrorMsg = ({
    field,
  }) =>
    formik.touched[field] &&
    formik.errors[field] ? (
      <p className="text-red-500 text-xs mt-1 ml-1 flex items-center gap-1">
        <span className="inline-block w-1 h-1 rounded-full bg-red-500 flex-shrink-0" />

        {formik.errors[field]}
      </p>
    ) : null;

  if (loginSuccess) {
    return (
      <div className="h-screen flex justify-center items-center bg-[#F7F6F3]">
        <div className="text-center">
          <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto mb-4" />

          <h2 className="text-xl font-bold text-gray-800 mb-1">
            Welcome back!
          </h2>

          <p className="text-sm text-gray-500">
            Taking you to your
            dashboard…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#F7F6F3]">
      {/* Left Panel */}

      <div className="hidden lg:flex w-[44%] bg-[#1a1a1a] flex-col justify-between p-10 relative overflow-hidden">
        {/* Background circles */}

        <div className="absolute inset-0 opacity-5">
          {[...Array(8)].map(
            (_, i) => (
              <div
                key={i}
                className="absolute border border-white rounded-full"
                style={{
                  width: `${
                    120 + i * 80
                  }px`,
                  height: `${
                    120 + i * 80
                  }px`,
                  top: "50%",
                  left: "50%",
                  transform:
                    "translate(-50%, -50%)",
                }}
              />
            )
          )}
        </div>

        <div className="relative z-10">
          <h2 className="text-white text-3xl font-bold leading-snug mb-4">
            Welcome <br />

            <span className="text-[#C8973A]">
              back.
            </span>
          </h2>

          <p className="text-gray-400 text-sm leading-relaxed mb-8">
            Sign in to access your
            saved properties,
            track enquiries, and
            continue your real
            estate journey.
          </p>

          <div className="flex flex-col gap-4">
            {[
              {
                icon: "🏠",
                title:
                  "Your saved listings",
                sub: "Pick up where you left off",
              },
              {
                icon: "📅",
                title:
                  "Scheduled visits",
                sub: "View and manage bookings",
              },
              {
                icon: "💬",
                title:
                  "Agent messages",
                sub: "Stay in touch with agents",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-center gap-3"
              >
                <span className="text-2xl">
                  {item.icon}
                </span>

                <div>
                  <p className="text-white text-sm font-semibold">
                    {item.title}
                  </p>

                  <p className="text-gray-500 text-xs">
                    {item.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-gray-600 text-xs relative z-10">
          © 2025 NestFind. All
          rights reserved.
        </p>
      </div>

      {/* Right Panel */}

      <div className="flex-1 flex justify-center items-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}

          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <Building2 className="w-5 h-5 text-[#C8973A]" />

            <span className="text-gray-900 text-lg font-bold">
              nest
              <span className="text-[#C8973A]">
                .
              </span>
              find
            </span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Sign in to your
            account
          </h1>

          <p className="text-sm text-gray-500 mb-7">
            Don't have an
            account?{" "}
            <Link
              to={
                AUTH_ROUTE.REGISTER
              }
              className="text-[#C8973A] font-semibold hover:underline"
            >
              Create one
            </Link>
          </p>

          {/* Error */}

          {generalError && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />

              {generalError}
            </div>
          )}

          <form
            onSubmit={
              formik.handleSubmit
            }
            className="flex flex-col gap-4"
          >
            {/* Email */}

            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                <input
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  onChange={
                    formik.handleChange
                  }
                  onBlur={
                    formik.handleBlur
                  }
                  value={
                    formik.values
                      .email
                  }
                  className={getFieldClass(
                    "email"
                  )}
                />
              </div>

              <ErrorMsg field="email" />
            </div>

            {/* Password */}

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Password
                </label>

                <span className="text-xs text-[#C8973A] cursor-pointer hover:underline">
                  Forgot password?
                </span>
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder="Enter your password"
                  onChange={
                    formik.handleChange
                  }
                  onBlur={
                    formik.handleBlur
                  }
                  value={
                    formik.values
                      .password
                  }
                  className={`${getFieldClass(
                    "password"
                  )} pr-10`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              <ErrorMsg field="password" />
            </div>

            {/* Remember */}

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded border-gray-300 accent-[#1a1a1a] cursor-pointer"
              />

              <label
                htmlFor="remember"
                className="text-sm text-gray-500 cursor-pointer select-none"
              >
                Remember me for 30
                days
              </label>
            </div>

            {/* Submit */}

            <button
              type="submit"
              disabled={
                formik.isSubmitting
              }
              className="w-full bg-[#1a1a1a] hover:bg-[#2d2d2d] disabled:opacity-60 text-white py-3 rounded-xl font-semibold text-sm transition-all duration-150 flex items-center justify-center gap-2 mt-1"
            >
              {formik.isSubmitting ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;