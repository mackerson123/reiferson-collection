"use client";

import { useState } from "react";
import { Work } from "../lib/types";

interface ImageDetailViewProps {
  selectedImageIndex: number;
  currentWorks: Work[];
  onBack: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

export default function ImageDetailView({
  selectedImageIndex,
  currentWorks,
  onBack,
  onPrevious,
  onNext,
}: ImageDetailViewProps) {
  const [activeTab, setActiveTab] = useState<
    | "narrative"
    | "description"
    | "details"
    | "provenance"
    | "related objects"
    | "exhibition"
  >("narrative");

  return (
    <main className="flex-1 bg-[#F1EFE7] min-h-0 relative">
      {/* Top Navigation Bar */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-[#F1EFE7]/95 backdrop-blur-sm border-b border-black/10">
        <div className="flex justify-between items-center px-4 md:px-8 py-3 md:py-4">
          <button
            onClick={onBack}
            className="text-xs md:text-utility tracking-[0.05em] font-medium hover:opacity-60 transition-opacity"
          >
            ← <span className="hidden sm:inline">Back to gallery</span>
            <span className="sm:hidden">Back</span>
          </button>

          <div className="flex items-center gap-2 md:gap-6">
            <span className="text-xs md:text-utility opacity-60">
              {selectedImageIndex + 1} of {currentWorks.length}
            </span>
            <div className="flex gap-1 md:gap-3">
              <button
                onClick={onPrevious}
                className="text-xs md:text-utility tracking-[0.05em] font-medium hover:opacity-60 transition-opacity px-2 md:px-3 py-1 border border-black/20 rounded hover:border-black/40"
              >
                <span className="hidden md:inline">← Previous</span>
                <span className="md:hidden">←</span>
              </button>
              <button
                onClick={onNext}
                className="text-xs md:text-utility tracking-[0.05em] font-medium hover:opacity-60 transition-opacity px-2 md:px-3 py-1 border border-black/20 rounded hover:border-black/40"
              >
                <span className="hidden md:inline">Next →</span>
                <span className="md:hidden">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="h-full flex flex-col md:flex-row pt-12 md:pt-16">
        {/* Image Section */}
        <div className="w-full md:w-3/5 flex items-center justify-center p-4 md:p-8">
          <div className="max-w-full max-h-full flex items-center justify-center">
            <img
              src={
                currentWorks[selectedImageIndex]?.imageUrl ||
                "/placeholder.svg?height=400&width=400&query=vintage baseball photograph"
              }
              alt={
                currentWorks[selectedImageIndex]?.title ||
                `Work ${selectedImageIndex + 1}`
              }
              className="max-w-full max-h-[40vh] md:max-h-[75vh] object-contain shadow-lg"
            />
          </div>
        </div>

        {/* Information Panel */}
        <div className="w-full md:w-2/5 border-t md:border-t-0 md:border-l border-black/10 bg-[#F1EFE7] flex flex-col">
          {/* Scrollable Tab Navigation */}
          <div className="border-b border-black/10 px-4 md:px-6 bg-[#F1EFE7]">
            <div
              className="overflow-x-auto scrollbar-hide"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <div className="flex gap-3 md:gap-6 min-w-max">
                {(
                  [
                    "narrative",
                    "description",
                    "details",
                    "provenance",
                    "related objects",
                    "exhibition",
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-3 md:py-4 text-xs md:text-sm font-medium tracking-[0.05em] capitalize transition-colors whitespace-nowrap relative ${
                      activeTab === tab
                        ? "text-black"
                        : "text-black/60 hover:text-black/80"
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6">
            {activeTab === "narrative" && (
              <div className="text-content-copy leading-relaxed space-y-4">
                <p>
                  {currentWorks[selectedImageIndex]?.narrative ||
                    `Narrative content for "${
                      currentWorks[selectedImageIndex]?.title || "this work"
                    }" would appear here.`}
                </p>
              </div>
            )}

            {activeTab === "description" && (
              <div className="text-content-copy leading-relaxed space-y-4">
                <h3 className="font-semibold">
                  {currentWorks[selectedImageIndex]?.title}
                </h3>
                {currentWorks[selectedImageIndex]?.artist && (
                  <p>
                    <strong>Artist:</strong>{" "}
                    {currentWorks[selectedImageIndex]?.artist}
                  </p>
                )}
                {currentWorks[selectedImageIndex]?.date && (
                  <p>
                    <strong>Date:</strong>{" "}
                    {currentWorks[selectedImageIndex]?.date}
                  </p>
                )}
                {currentWorks[selectedImageIndex]?.medium && (
                  <p>
                    <strong>Medium:</strong>{" "}
                    {currentWorks[selectedImageIndex]?.medium}
                  </p>
                )}
                {currentWorks[selectedImageIndex]?.dimensions && (
                  <p>
                    <strong>Dimensions:</strong>{" "}
                    {currentWorks[selectedImageIndex]?.dimensions}
                  </p>
                )}
                <p>
                  {currentWorks[selectedImageIndex]?.description ||
                    "Technical description would appear here."}
                </p>
              </div>
            )}

            {activeTab === "details" && (
              <div className="text-content-copy leading-relaxed space-y-4">
                <p>
                  Detailed technical information and analysis content would
                  appear here for image {selectedImageIndex + 1}.
                </p>
                <p>
                  Physical dimensions, materials, condition reports, and other
                  technical specifications would be documented here.
                </p>
              </div>
            )}

            {activeTab === "provenance" && (
              <div className="text-content-copy leading-relaxed space-y-4">
                <p>
                  {currentWorks[selectedImageIndex]?.provenance ||
                    "Provenance information would appear here."}
                </p>
              </div>
            )}

            {activeTab === "related objects" && (
              <div className="text-content-copy leading-relaxed space-y-4">
                <p>Related objects and context would appear here.</p>
                <p>
                  Connections to other items in the collection, related
                  photographs, documents, or artifacts would be highlighted.
                </p>
              </div>
            )}

            {activeTab === "exhibition" && (
              <div className="text-content-copy leading-relaxed space-y-4">
                <p>
                  {currentWorks[selectedImageIndex]?.exhibition ||
                    "Exhibition history would appear here."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
