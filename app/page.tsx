"use client";

import { useState } from "react";
import Link from "next/link";
import GalleryView from "../components/gallery-view";
import ImageDetailView from "../components/image-detail-view";
import { Work } from "../lib/types";

// Mock data for now - this should come from a data file or API
const collections = [
  {
    id: "color-line",
    name: "The color line",
    count: 35,
    images: [
      "/vintage-catcher-photograph-1.jpg",
      "/vintage-syracuse-stars-1887.jpg",
      "/vintage-wheeling-team-photograph.jpg",
      "/weldy-walker-discrimination-appeal-1887.jpeg",
      // ... more images
    ],
  },
  // ... other collections
];

export default function HomePage() {
  const [currentView, setCurrentView] = useState<"work" | "image">("work");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [currentWorks, setCurrentWorks] = useState<Work[]>([]);

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
      <nav className="sticky top-0 z-50 bg-[#F1EFE7] flex justify-between items-center p-6 md:p-8">
        <h1
          className="text-site-name font-semibold tracking-[0.05em]"
          style={{ fontSize: "1.2em" }}
        >
          The Reiferson Collection
        </h1>

        <div className="hidden md:flex gap-6">
          <button
            onClick={() => setCurrentView("work")}
            className={`text-navigation tracking-[0.05em] font-medium hover:opacity-60 ${
              currentView === "work" ? "opacity-80" : "opacity-60"
            }`}
          >
            Work
          </button>
          <Link
            href="/about"
            className="text-navigation tracking-[0.05em] font-medium hover:opacity-60 opacity-60"
          >
            About
          </Link>
        </div>

        <button
          onClick={() => setMobileMenuOpen(true)}
          className="md:hidden text-navigation tracking-[0.05em] font-medium"
        >
          Menu
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-60 bg-[#F1EFE7] flex flex-col items-center justify-center">
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-8 right-8 text-black text-2xl hover:opacity-60 z-10"
          >
            ×
          </button>
          <div className="space-y-6">
            <button
              onClick={() => {
                setCurrentView("work");
                setMobileMenuOpen(false);
              }}
              className="block text-content-subtitle tracking-[0.05em] font-medium hover:opacity-60"
            >
              Work
            </button>
            <Link
              href="/about"
              className="block text-content-subtitle tracking-[0.05em] font-medium hover:opacity-60"
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
