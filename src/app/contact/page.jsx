// src/app/contact/page.jsx
"use client";

import { useState } from "react";
import {
    Mail,
    Phone,
    MapPin,
    Clock,
    Send,
    CheckCircle,
    MessageSquare,
    Loader2,
    AlertCircle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import toast from "react-hot-toast";

export default function ContactPage() {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        if (!formData.subject.trim()) newErrors.subject = "Subject is required";
        if (!formData.message.trim()) newErrors.message = "Message is required";

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            setLoading(true);

            const response = await fetch("/api/contact/message", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                setSubmitted(true);
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    subject: "",
                    message: "",
                });
                toast.success("Message sent successfully!");

                // Auto-hide success after 5 seconds
                setTimeout(() => {
                    setSubmitted(false);
                }, 5000);
            } else {
                toast.error(data.message || "Failed to send message");
            }
        } catch (error) {
            console.error("Contact form error:", error);
            toast.error("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            {/* Hero */}
            <section className="bg-[#1E2A3B] text-white">
                <div className="max-w-7xl mx-auto px-6 py-20 lg:py-24">
                    <div className="max-w-3xl">
                        <span className="inline-flex items-center gap-2 bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#F59E0B] px-4 py-2 rounded-full text-sm font-semibold">
                            <MessageSquare className="w-4 h-4" />
                            Contact PeerTools
                        </span>

                        <h1 className="text-4xl md:text-5xl font-bold mt-6">
                            We're here to{" "}
                            <span className="text-[#F59E0B]">help.</span>
                        </h1>

                        <p className="text-lg text-slate-300 mt-5 leading-8">
                            Have a question about renting a tool, listing your equipment,
                            payments, or your PeerTools account? Send us a message and our
                            team will get back to you.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Content */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-3 gap-10">
                        {/* Contact Information */}
                        <div className="lg:col-span-1">
                            <h2 className="text-2xl font-bold text-[#1E293B]">
                                Get in Touch
                            </h2>

                            <p className="text-gray-600 mt-3 leading-7">
                                Choose the most convenient way to reach the PeerTools team.
                            </p>

                            <div className="space-y-5 mt-8">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center flex-shrink-0">
                                        <Mail className="w-6 h-6 text-[#F59E0B]" />
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-[#1E293B]">Email</h3>
                                        <p className="text-gray-600 mt-1">
                                            ahmadhashim027@gmail.com
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center flex-shrink-0">
                                        <Phone className="w-6 h-6 text-[#F59E0B]" />
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-[#1E293B]">Phone</h3>
                                        <p className="text-gray-600 mt-1">
                                            +234 8061 621 467
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-6 h-6 text-[#F59E0B]" />
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-[#1E293B]">Location</h3>
                                        <p className="text-gray-600 mt-1">
                                            Nigeria
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center flex-shrink-0">
                                        <Clock className="w-6 h-6 text-[#F59E0B]" />
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-[#1E293B]">
                                            Support Hours
                                        </h3>
                                        <p className="text-gray-600 mt-1">
                                            Monday – Friday
                                        </p>
                                        <p className="text-gray-500 text-sm">
                                            8:00 AM – 5:00 PM
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white border border-gray-200 rounded-3xl p-7 md:p-10 shadow-sm">
                                <h2 className="text-2xl font-bold text-[#1E293B]">
                                    Send Us a Message
                                </h2>

                                <p className="text-gray-600 mt-2">
                                    Fill out the form below and we'll respond as soon as possible.
                                </p>

                                {submitted && (
                                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />

                                        <div>
                                            <p className="font-semibold text-green-800">
                                                Message sent successfully.
                                            </p>
                                            <p className="text-sm text-green-700 mt-1">
                                                Thank you for contacting PeerTools.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                                    <div className="grid md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-semibold text-[#1E293B] mb-2">
                                                Full Name <span className="text-red-500">*</span>
                                            </label>

                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="Enter your full name"
                                                required
                                                className={`w-full px-4 py-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent ${errors.name ? "border-red-500" : "border-gray-200"
                                                    }`}
                                            />
                                            {errors.name && (
                                                <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-[#1E293B] mb-2">
                                                Email Address <span className="text-red-500">*</span>
                                            </label>

                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="you@example.com"
                                                required
                                                className={`w-full px-4 py-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent ${errors.email ? "border-red-500" : "border-gray-200"
                                                    }`}
                                            />
                                            {errors.email && (
                                                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-[#1E293B] mb-2">
                                            Phone Number <span className="text-gray-400 text-xs">(Optional)</span>
                                        </label>

                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="+234..."
                                            className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-[#1E293B] mb-2">
                                            Subject <span className="text-red-500">*</span>
                                        </label>

                                        <select
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            className={`w-full px-4 py-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent bg-white ${errors.subject ? "border-red-500" : "border-gray-200"
                                                }`}
                                        >
                                            <option value="">Select a subject</option>
                                            <option value="rental">Tool Rental</option>
                                            <option value="listing">List My Tool</option>
                                            <option value="payment">Payment Issue</option>
                                            <option value="account">Account Support</option>
                                            <option value="technical">Technical Support</option>
                                            <option value="general">General Inquiry</option>
                                        </select>
                                        {errors.subject && (
                                            <p className="text-xs text-red-500 mt-1">{errors.subject}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-[#1E293B] mb-2">
                                            Message <span className="text-red-500">*</span>
                                        </label>

                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows={6}
                                            placeholder="Tell us how we can help..."
                                            required
                                            className={`w-full px-4 py-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent resize-none ${errors.message ? "border-red-500" : "border-gray-200"
                                                }`}
                                        />
                                        {errors.message && (
                                            <p className="text-xs text-red-500 mt-1">{errors.message}</p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-[#F59E0B] hover:bg-amber-500 text-[#0F172A] font-bold px-8 py-3.5 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5" />
                                                Send Message
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ/Support CTA */}
            <section className="bg-[#F8FAFC] py-16">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold text-[#1E293B]">
                        Need help with your account?
                    </h2>

                    <p className="text-gray-600 mt-3">
                        Our support team can assist with tool listings, rentals, payments,
                        account verification, and other PeerTools services.
                    </p>

                    <a
                        href="mailto:ahmadhashim027@gmail.com"
                        className="inline-flex items-center gap-2 mt-7 bg-[#1E293B] hover:bg-[#26364B] text-white font-bold px-7 py-3.5 rounded-xl transition"
                    >
                        <Mail className="w-5 h-5" />
                        Email Support
                    </a>
                </div>
            </section>
        </main>
    );
}