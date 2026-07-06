"use client";

import { useState } from "react";
import Link from "next/link";
import { trpc } from "../../lib/trpc/client";

export default function AboutPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: settings, isLoading } = trpc.settings.get.useQuery();

  return (
    <div className="min-h-screen bg-[#F1EFE7] text-black font-sans flex flex-col">
      <nav className="flex-shrink-0 bg-[#F1EFE7] flex justify-between items-center px-4 py-4 md:px-8">
        <Link href="/">
          <h1 className="text-[18px] md:text-subheading font-semibold tracking-[0.05em] gallery-link">
            The Reiferson Collection
          </h1>
        </Link>

        <div className="hidden md:flex gap-6">
          <Link
            href="/"
            className="text-nav tracking-[0.05em] font-medium opacity-60 gallery-link"
          >
            Work
          </Link>
          <span className="text-nav tracking-[0.05em] font-medium opacity-80">
            About
          </span>
        </div>

        <button
          onClick={() => setMobileMenuOpen(true)}
          className="md:hidden text-nav tracking-[0.05em] font-medium gallery-link"
        >
          Menu
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-[#F1EFE7] flex flex-col">
          <div className="flex-shrink-0 flex justify-between items-center px-4 py-4 md:px-8">
            <span className="text-[18px] font-semibold tracking-[0.05em]">
              The Reiferson Collection
            </span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-nav tracking-[0.05em] font-medium gallery-link"
            >
              Close
            </button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center">
            <Link
              href="/"
              className="block text-subheading tracking-[0.05em] font-medium w-full gallery-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Work
            </Link>
            <span className="block text-subheading tracking-[0.05em] font-medium opacity-80 w-full">
              About
            </span>
          </div>
        </div>
      )}

      <main className="flex-1 px-4 md:px-32 lg:px-40 max-w-4xl mx-auto py-8">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-navigation tracking-[0.05em] opacity-60">
              Loading...
            </p>
          </div>
        ) : (
          <div className="space-y-8 md:space-y-12">
            <h1 className="text-heading font-semibold tracking-[0.05em]">
              {settings?.aboutTitle || "The Reiferson Collection"}
            </h1>
            <div className="space-y-6 leading-relaxed text-body">
              {settings?.aboutContent.split("\n\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
              <Link
                href="/"
                className="text-small md:text-small tracking-[0.05em] font-medium gallery-link"
              >
                ← <span className="hidden sm:inline">Back to collection</span>
                <span className="sm:hidden">Back</span>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
