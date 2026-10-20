"use client";

import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] text-white">

      {/* Top Footer */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <Phone className="text-[#F59E0B]" size={18} />
              <div>
                <p className="text-sm text-white/60">Call Us</p>
                <p className="font-semibold">+234 806 162 1467</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="text-[#F59E0B]" size={18} />
              <div>
                <p className="text-sm text-white/60">Email</p>
                <p className="font-semibold">support@peertools.ng</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="text-[#F59E0B]" size={18} />
              <div>
                <p className="text-sm text-white/60">Address</p>
                <p className="font-semibold">Kaduna, Nigeria</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">

          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-[#F59E0B] flex items-center justify-center">
                <span className="text-3xl font-black text-[#0F172A]">PT</span>
              </div>
              <div>
                <h2 className="text-3xl font-black">PeerTools</h2>
                <span className="inline-block mt-2 bg-[#F59E0B] text-[#0F172A] px-4 py-1 rounded-md text-xs font-bold tracking-widest uppercase">
                  Share • Borrow • Build
                </span>
              </div>
            </Link>
            <p className="mt-6 text-white/70 leading-8 max-w-lg">
              PeerTools is a web-based peer-to-peer construction tools
              lending platform that enables individuals, artisans,
              contractors and businesses to borrow and lend tools
              securely within their communities.
            </p>
            <div className="flex gap-4 mt-8">
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#F59E0B] hover:text-[#0F172A] transition flex items-center justify-center"
              >
                <FaFacebookF size={18} />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#F59E0B] hover:text-[#0F172A] transition flex items-center justify-center"
              >
                <FaInstagram size={18} />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#F59E0B] hover:text-[#0F172A] transition flex items-center justify-center"
              >
                <FaXTwitter size={18} />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#F59E0B] hover:text-[#0F172A] transition flex items-center justify-center"
              >
                <FaLinkedinIn size={18} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6">Quick Links</h3>
            <div className="space-y-4">
              <Link href="/" className="block hover:text-[#F59E0B]">Home</Link>
              <Link href="/tools" className="block hover:text-[#F59E0B]">Browse Tools</Link>
              <Link href="/categories" className="block hover:text-[#F59E0B]">Categories</Link>
              <Link href="/about" className="block hover:text-[#F59E0B]">About</Link>
              <Link href="/contact" className="block hover:text-[#F59E0B]">Contact</Link>
            </div>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-lg font-bold mb-6">Account</h3>
            <div className="space-y-4">
              <Link href="/login" className="block hover:text-[#F59E0B]">Login</Link>
              <Link href="/register" className="block hover:text-[#F59E0B]">Register</Link>
              <Link href="/privacy" className="block hover:text-[#F59E0B]">Privacy Policy</Link>
              <Link href="/terms" className="block hover:text-[#F59E0B]">Terms & Conditions</Link>
            </div>
          </div>

          {/* Popular Categories - NEW */}
          <div>
            <h3 className="text-lg font-bold mb-6">Popular Categories</h3>
            <div className="space-y-4">
              <Link href="/categories/power-tools" className="block hover:text-[#F59E0B]">Power Tools</Link>
              <Link href="/categories/hand-tools" className="block hover:text-[#F59E0B]">Hand Tools</Link>
              <Link href="/categories/scaffolding" className="block hover:text-[#F59E0B]">Scaffolding</Link>
              <Link href="/categories/painting" className="block hover:text-[#F59E0B]">Painting Equipment</Link>
              <Link href="/categories/concrete" className="block hover:text-[#F59E0B]">Concrete Tools</Link>
              <Link href="/categories/safety" className="block hover:text-[#F59E0B]">Safety Equipment</Link>
              <Link href="/categories/electrical" className="block hover:text-[#F59E0B]">Electrical Tools</Link>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/60 text-sm">
            © {new Date().getFullYear()} PeerTools. All Rights Reserved.
          </p>
          <p className="text-white/60 text-sm">
            Designed & Developed for the Web-Based Peer-to-Peer Building &
            Construction Tools Lending System.
          </p>
        </div>
      </div>

    </footer>
  );
}