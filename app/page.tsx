"use client";

import { useState } from "react";
import Link from "next/link";
import GalleryView from "../components/gallery-view";
import ImageDetailView from "../components/image-detail-view";
import { Work } from "../lib/types";
import { trpc } from "../lib/trpc/client";

export default function HomePage() {
  const [currentView, setCurrentView] = useState<"work" | "image">("work");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [currentWorks, setCurrentWorks] = useState<Work[]>([]);

  trpc.settings.get.useQuery();

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setCurrentView("image");
  };

  const handleWorksChange = (works: Work[]) => {
    setCurrentWorks(works);
  };

  const handleBackToGallery = () => {
    setCurrentView("work");
    setSelectedImageIndex(null);
  };

  const handlePrevious = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    } else if (selectedImageIndex !== null) {
      setSelectedImageIndex(currentWorks.length - 1);
    }
  };

  const handleNext = () => {
    if (
      selectedImageIndex !== null &&
      selectedImageIndex < currentWorks.length - 1
    ) {
      setSelectedImageIndex(selectedImageIndex + 1);
    } else {
      setSelectedImageIndex(0);
    }
  };

  return (
    <div className="min-h-screen bg-[#F1EFE7] text-black font-sans flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#F1EFE7] flex justify-between items-center p-4">
        <Link href="/">
          <h1 className="text-[18px] md:text-subheading font-semibold tracking-[0.05em] gallery-link">
            The Reiferson Collection
          </h1>
        </Link>

        <div className="hidden md:flex gap-6">
          <button
            onClick={() => setCurrentView("work")}
            className={`text-nav tracking-[0.05em] font-medium gallery-link ${
              currentView === "work" ? "opacity-80" : "opacity-60"
            }`}
          >
            Work
          </button>
          <Link
            href="/about"
            className="text-nav tracking-[0.05em] font-medium opacity-60 gallery-link"
          >
            About
          </Link>
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
        <div className="fixed inset-0 z-[60] bg-[#F1EFE7] flex flex-col items-center justify-center">
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-4 right-4 text-black text-2xl z-10 gallery-link"
          >
            ×
          </button>
          <div className="space-y-6 text-center">
            <button
              onClick={() => {
                setCurrentView("work");
                setMobileMenuOpen(false);
              }}
              className="block text-subheading tracking-[0.05em] font-medium w-full gallery-link"
            >
              Work
            </button>
            <Link
              href="/about"
              className="block text-subheading tracking-[0.05em] font-medium w-full gallery-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
          </div>
        </div>
      )}

      {/* Main Content */}
      {currentView === "work" && (
        <GalleryView
          onImageClick={handleImageClick}
          onWorksChange={handleWorksChange}
        />
      )}

      {currentView === "image" && selectedImageIndex !== null && (
        <ImageDetailView
          selectedImageIndex={selectedImageIndex}
          currentWorks={currentWorks}
          onBack={handleBackToGallery}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      )}
    </div>
  );
}
