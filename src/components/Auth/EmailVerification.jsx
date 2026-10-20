// src/components/auth/EmailVerification.jsx
"use client";

import { useState, useEffect } from "react";
import { Mail, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";

export default function EmailVerification({ email, onVerified }) {
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [timer, setTimer] = useState(0);
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        try {
            const response = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
            });

            const data = await response.json();

            if (data.success) {
                setIsVerified(true);
                setMessage("✅ Email verified successfully!");
                // Call the onVerified callback after a short delay
                setTimeout(() => {
                    if (onVerified) onVerified();
                }, 1500);
            } else {
                setError(data.message || "Invalid OTP. Please try again.");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setResending(true);
        setError("");
        setMessage("");

        try {
            const response = await fetch("/api/auth/resend-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (data.success) {
                setMessage("📨 New OTP sent to your email!");
                setTimer(60); // 60 seconds cooldown
            } else {
                setError(data.message || "Failed to resend OTP.");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setResending(false);
        }
    };

    if (isVerified) {
        return (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-green-800">Email Verified!</h3>
                <p className="text-green-600 mt-1">Your email has been successfully verified.</p>
                <p className="text-sm text-green-600 mt-2">Redirecting to login...</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#F59E0B]/10 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-[#F59E0B]" />
                </div>
                <div>
                    <h3 className="font-bold text-[#1E293B]">Verify Your Email</h3>
                    <p className="text-sm text-gray-500">We sent a 6-digit OTP to {email}</p>
                </div>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}

            {message && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2 text-green-600 text-sm">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{message}</span>
                </div>
            )}

            <form onSubmit={handleVerify} className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-[#1E293B] mb-2">
                        Enter OTP
                    </label>
                    <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        placeholder="Enter 6-digit OTP"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent text-center text-2xl font-bold tracking-widest"
                        maxLength={6}
                        required
                        autoFocus
                    />
                    <p className="text-xs text-gray-400 mt-1 text-center">
                        Enter the 6-digit code sent to your email
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="w-full py-3 bg-[#F59E0B] text-[#0F172A] rounded-xl font-bold hover:bg-amber-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 border-2 border-[#0F172A] border-t-transparent rounded-full animate-spin"></div>
                            Verifying...
                        </div>
                    ) : (
                        "Verify Email"
                    )}
                </button>
            </form>

            <div className="mt-4 flex items-center justify-between">
                <button
                    onClick={handleResend}
                    disabled={resending || timer > 0}
                    className="text-sm text-[#F59E0B] hover:text-[#D97706] font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                    <RefreshCw className={`w-4 h-4 ${resending ? "animate-spin" : ""}`} />
                    {resending ? "Sending..." : timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
                </button>

                <button
                    onClick={() => {
                        if (onVerified) onVerified();
                    }}
                    className="text-sm text-gray-400 hover:text-gray-600"
                >
                    Skip for now
                </button>
            </div>
        </div>
    );
}
