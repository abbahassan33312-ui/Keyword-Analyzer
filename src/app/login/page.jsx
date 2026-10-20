// src/app/login/page.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, ArrowLeft, AlertCircle } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        remember: false,
    });
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    remember: formData.remember,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Check if verification is required
                if (data.requiresVerification) {
                    router.push(
                        `/verify-email?email=${encodeURIComponent(data.email)}`
                    );
                    setLoading(false);
                    return;
                }

                setError(data.message || "Invalid credentials. Please try again.");
                setLoading(false);
                return;
            }

            // Login successful - redirect based on user role
            if (data.success && data.data.redirect) {
                router.push(data.data.redirect);
            } else {
                setError("Login successful but redirect URL not found.");
                setLoading(false);
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("An error occurred. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#334155] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-[#F59E0B]/5 rounded-full blur-3xl -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2"></div>

            <div className="w-full max-w-md relative z-10">
                {/* Back to Home */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-white/70 hover:text-white transition mb-6 text-sm font-medium"
                >
                    <ArrowLeft size={16} />
                    Back to Home
                </Link>

                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
                    {/* Logo */}
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 rounded-xl bg-[#F59E0B] flex items-center justify-center">
                            <span className="text-2xl font-black text-[#0F172A]">PT</span>
                        </div>
                    </div>

                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-black text-[#1E293B]">Welcome Back</h2>
                        <p className="text-gray-500 mt-2 text-sm">Sign in to continue to PeerTools</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-start gap-2">
                            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-semibold text-[#1E293B] mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }
                                    className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent text-sm"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-semibold text-[#1E293B] mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({ ...formData, password: e.target.value })
                                    }
                                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent text-sm"
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Forgot Password */}
                        <div className="flex items-center justify-between">
                            <Link
                                href="/forgot-password"
                                className="text-sm text-[#F59E0B] hover:text-[#D97706] font-semibold"
                            >
                                Forgot Password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-[#F59E0B] text-[#0F172A] rounded-xl font-bold hover:bg-amber-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-[#0F172A] border-t-transparent rounded-full animate-spin"></div>
                                    Signing in...
                                </div>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    {/* Sign Up Link */}
                    <p className="mt-6 text-center text-sm text-gray-600">
                        Don't have an account?{" "}
                        <Link
                            href="/register"
                            className="text-[#F59E0B] hover:text-[#D97706] font-semibold"
                        >
                            Create one now
                        </Link>
                    </p>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500">or</span>
                        </div>
                    </div>
                </div>

                {/* Footer Note */}
                <p className="text-center text-white/50 text-xs mt-6">
                    © {new Date().getFullYear()} PeerTools. All rights reserved.
                </p>
            </div>
        </div>
    );
}
