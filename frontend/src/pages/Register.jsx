import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AUTH_ROUTE } from "../constants/routeConstants";
import { useFormik } from "formik";
import * as Yup from "yup";
import API  from "../api/axios";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Building2,
  CheckCircle2,
} from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [registered, setRegistered] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      contact: "",
      role: "buyer",
      password: "",
      confirmPassword: "",
    },

    validationSchema: Yup.object({
      name: Yup.string()
        .min(2, "Name must be at least 2 characters")
        .required("Full name is required"),
      email: Yup.string()
        .email("Enter a valid email address")
        .required("Email is required"),
      contact: Yup.string()
        .matches(/^[0-9]{10}$/, "Enter a valid 10-digit phone number")
        .required("Phone number is required"),
      role: Yup.string().required("Please select a role"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .matches(/[A-Z]/, "Include at least one uppercase letter")
        .matches(/[0-9]/, "Include at least one number")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords do not match")
        .required("Please confirm your password"),
    }),

    onSubmit: async (values, { setSubmitting }) => {
  try {
    const { confirmPassword, ...userData } = values;

    await API.post("/auth/register", userData);

    setRegistered(true);

    setTimeout(() => {
      navigate(AUTH_ROUTE.LOGIN);
    }, 2000);
  } catch (error) {
    formik.setFieldError(
      "email",
      error.response?.data?.message || "Registration failed"
    );
  } finally {
    setSubmitting(false);
  }
},
  });

  const getFieldClass = (field) => {
    const base =
      "w-full pl-10 pr-4 py-2.5 text-sm border rounded-lg outline-none transition-all duration-150 bg-white text-gray-800 placeholder-gray-400";
    if (formik.touched[field] && formik.errors[field])
      return `${base} border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100`;
    if (formik.touched[field] && !formik.errors[field])
      return `${base} border-green-400 focus:border-green-500 focus:ring-2 focus:ring-green-100`;
    return `${base} border-gray-200 focus:border-[#C8973A] focus:ring-2 focus:ring-[#C8973A]/10`;
  };

  const ErrorMsg = ({ field }) =>
    formik.touched[field] && formik.errors[field] ? (
      <p className="text-red-500 text-xs mt-1 ml-1 flex items-center gap-1">
        <span className="inline-block w-1 h-1 rounded-full bg-red-500 flex-shrink-0" />
        {formik.errors[field]}
      </p>
    ) : null;

  if (registered) {
    return (
      <div className="h-screen flex justify-center items-center bg-[#F7F6F3]">
        <div className="text-center">
          <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-1">
            Account Created!
          </h2>
          <p className="text-sm text-gray-500">Redirecting you to login…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#F7F6F3]">
      {/* Left Panel */}
      <div className="hidden lg:flex w-[44%] bg-[#1a1a1a] flex-col justify-between p-10 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute border border-white rounded-full"
              style={{
                width: `${120 + i * 80}px`,
                height: `${120 + i * 80}px`,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}
        </div>
{/* 
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-6 h-6 text-[#C8973A]" />
            <span className="text-white text-xl font-bold tracking-tight">
              nest<span className="text-[#C8973A]">.</span>find
            </span>
          </div>
          <p className="text-gray-500 text-sm">Premium Real Estate Platform</p>
        </div> */}

        <div className="relative z-10">
          <h2 className="text-white text-3xl font-bold leading-snug mb-4">
            Find your perfect <br />
            <span className="text-[#C8973A]">home today.</span>
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-8">
            Join thousands of buyers, sellers, and agents who trust NestFind
            for their real estate journey.
          </p>

          <div className="flex flex-col gap-4">
            {[
              { icon: "🏠", title: "12,400+ Listings", sub: "Verified across top cities" },
              { icon: "🤝", title: "Trusted Agents", sub: "98% satisfaction rate" },
              { icon: "🔒", title: "Secure & Private", sub: "Your data is safe with us" },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="text-white text-sm font-semibold">{item.title}</p>
                  <p className="text-gray-500 text-xs">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-gray-600 text-xs relative z-10">
          © 2025 NestFind. All rights reserved.
        </p>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex justify-center items-center p-6 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <Building2 className="w-5 h-5 text-[#C8973A]" />
            <span className="text-gray-900 text-lg font-bold">
              nest<span className="text-[#C8973A]">.</span>find
            </span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Create your account
          </h1>
          <p className="text-sm text-gray-500 mb-7">
            Already have an account?{" "}
            <Link
              to={AUTH_ROUTE.LOGIN}
              className="text-[#C8973A] font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>

          <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
            {/* Full Name */}
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={getFieldClass("name")}
                  type="text"
                  placeholder="John Doe"
                />
              </div>
              <ErrorMsg field="name" />
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={getFieldClass("email")}
                  type="email"
                  placeholder="john@example.com"
                />
              </div>
              <ErrorMsg field="email" />
            </div>

            {/* Phone & Role — side by side */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    name="contact"
                    value={formik.values.contact}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                      formik.setFieldValue("contact", val);
                    }}
                    onBlur={formik.handleBlur}
                    className={getFieldClass("contact")}
                    type="tel"
                    placeholder="9876543210"
                  />
                </div>
                <ErrorMsg field="contact" />
              </div>

              <div className="flex-1">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">
                  I am a
                </label>
                <select
                  name="role"
                  value={formik.values.role}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`${getFieldClass("role")} pl-4 cursor-pointer`}
                >
                  <option value="buyer">Buyer</option>
                  <option value="seller">Seller</option>
                  {/* <option value="agent">Agent</option>
                  <option value="investor">Investor</option> */}
                </select>
                <ErrorMsg field="role" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`${getFieldClass("password")} pr-10`}
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 6 chars, 1 uppercase, 1 number"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <ErrorMsg field="password" />

              {/* Password strength bar */}
              {formik.values.password && (
                <div className="mt-2 flex gap-1">
                  {[1, 2, 3, 4].map((level) => {
                    const p = formik.values.password;
                    const strength =
                      (p.length >= 6 ? 1 : 0) +
                      (/[A-Z]/.test(p) ? 1 : 0) +
                      (/[0-9]/.test(p) ? 1 : 0) +
                      (/[^A-Za-z0-9]/.test(p) ? 1 : 0);
                    const color =
                      strength <= 1
                        ? "bg-red-400"
                        : strength === 2
                        ? "bg-orange-400"
                        : strength === 3
                        ? "bg-yellow-400"
                        : "bg-green-500";
                    return (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-all ${
                          level <= strength ? color : "bg-gray-200"
                        }`}
                      />
                    );
                  })}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  name="confirmPassword"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`${getFieldClass("confirmPassword")} pr-10`}
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <ErrorMsg field="confirmPassword" />
            </div>

            {/* Terms */}
            <p className="text-xs text-gray-400 leading-relaxed">
              By creating an account, you agree to our{" "}
              <span className="text-[#C8973A] cursor-pointer hover:underline">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="text-[#C8973A] cursor-pointer hover:underline">
                Privacy Policy
              </span>
              .
            </p>

            {/* Submit */}
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full bg-[#1a1a1a] hover:bg-[#2d2d2d] text-white py-3 rounded-xl font-semibold text-sm transition-all duration-150 flex items-center justify-center gap-2 mt-1"
            >
              {formik.isSubmitting ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}