import React, { useState } from "react";
import Image from "next/image";
import { Work } from "../lib/types";

interface ImageDetailViewProps {
  selectedImageIndex: number;
  currentWorks: Work[];
  onBack: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

const TabContent = ({
  children,
  isEmpty = false,
  emptyMessage,
}: {
  children: React.ReactNode;
  isEmpty?: boolean;
  emptyMessage?: string;
}) => {
  return (
    <div className="max-w-prose">
      {isEmpty && emptyMessage ? (
        <span className="text-body text-black/40 italic leading-8">
          {emptyMessage}
        </span>
      ) : (
        children
      )}
    </div>
  );
};

const TabText = ({ content }: { content: string }) => (
  <p className="text-body leading-8 text-black/90 font-light whitespace-pre-line">
    {content}
  </p>
);

const MetadataRow = ({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) => {
  if (!value) return null;
  return (
    <div className="flex items-baseline gap-6 py-3 border-b border-black/5 last:border-0">
      <dt className="w-24 shrink-0 text-body text-black/50">{label}</dt>
      <dd className="text-body text-black/90 font-light">{value}</dd>
    </div>
  );
};

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
    | "provenance"
    | "related objects"
    | "exhibition"
  >("narrative");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isZoomedIn, setIsZoomedIn] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const tabsContainerRef = React.useRef<HTMLDivElement>(null);

  const currentWork = currentWorks[selectedImageIndex];

  const checkScrollability = React.useCallback(() => {
    const container = tabsContainerRef.current;
    if (!container) return;
    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 1
    );
  }, []);

  React.useEffect(() => {
    checkScrollability();
    window.addEventListener("resize", checkScrollability);
    return () => window.removeEventListener("resize", checkScrollability);
  }, [checkScrollability]);

  const scrollTabs = (direction: "left" | "right") => {
    const container = tabsContainerRef.current;
    if (!container) return;

    const maxScroll = container.scrollWidth - container.clientWidth;
    const currentScroll = container.scrollLeft;

    let targetScroll: number;
    if (direction === "left") {
      targetScroll = Math.max(0, currentScroll - container.clientWidth);
    } else {
      targetScroll = Math.min(maxScroll, currentScroll + container.clientWidth);
    }

    container.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    });
    setTimeout(() => {
      checkScrollability();
    }, 300);
  };

  return (
    <main className="flex-1 bg-[#F1EFE7] min-h-0 relative">
      {/* Top Navigation Bar */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-[#F1EFE7]/95 backdrop-blur-sm border-b border-black/10">
        <div className="flex justify-between items-center px-4 md:px-8 h-[52px] md:h-[56px]">
          <button
            onClick={onBack}
            className="text-small md:text-nav tracking-[0.05em] font-medium gallery-link"
          >
            ← <span className="hidden sm:inline">Back to gallery</span>
            <span className="sm:hidden">Back</span>
          </button>

          <div className="flex items-center gap-2 md:gap-6">
            <span className="text-small md:text-nav opacity-60">
              {selectedImageIndex + 1} of {currentWorks.length}
            </span>
            <div className="flex gap-1 md:gap-3">
              <button
                onClick={onPrevious}
                className="text-xs md:text-utility tracking-[0.05em] font-medium px-2 md:px-3 py-1 border border-black/20 rounded gallery-nav-btn"
              >
                <span className="hidden md:inline">← Previous</span>
                <span className="md:hidden">←</span>
              </button>
              <button
                onClick={onNext}
                className="text-xs md:text-utility tracking-[0.05em] font-medium px-2 md:px-3 py-1 border border-black/20 rounded gallery-nav-btn"
              >
                <span className="hidden md:inline">Next →</span>
                <span className="md:hidden">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="h-full flex flex-col md:flex-row pt-[52px] md:pt-[56px]">
        {/* Image Section */}
        <div className="w-full md:w-3/5 flex items-center justify-center p-4 md:p-8">
          <button
            onClick={() => setIsFullscreen(true)}
            className="relative w-full h-[40vh] md:h-[75vh] cursor-zoom-in group"
            aria-label="View fullscreen"
          >
            <Image
              src={currentWork?.imageUrl || "/vintage-baseball-photograph.png"}
              alt={currentWork?.title || `Work ${selectedImageIndex + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-contain transition-transform duration-300 group-hover:scale-[1.02]"
              priority
              quality={85}
            />
          </button>
        </div>

        {/* Information Panel */}
        <div className="w-full md:w-2/5 border-t md:border-t-0 md:border-l border-black/10 bg-[#F1EFE7] flex flex-col">
          {/* Title - Always Visible */}
          <div className="px-4 md:px-8 pt-4 md:pt-6 pb-2">
            <h2 className="text-heading font-serif text-black/90">
              {currentWork?.title || "Untitled"}
            </h2>
            {currentWork?.artist && (
              <p className="text-small text-black/60 mt-1">
                {currentWork.artist}
              </p>
            )}
          </div>

          {/* Scrollable Tab Navigation */}
          <div className="border-b border-black/10 px-4 md:px-8 bg-[#F1EFE7] relative">
            <button
              onClick={() => scrollTabs("left")}
              className={`absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-[#F1EFE7] via-[#F1EFE7]/90 to-transparent z-10 flex items-center justify-start pl-2 cursor-pointer transition-opacity duration-300 ${
                canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              aria-label="Scroll tabs left"
            >
              <span className="text-black/50 text-nav hover:text-black/80 transition-colors">
                ←
              </span>
            </button>
            <div
              ref={tabsContainerRef}
              className="overflow-x-auto scrollbar-hide"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              onScroll={checkScrollability}
            >
              <div className="flex gap-6 md:gap-8 min-w-max">
                {(
                  [
                    "narrative",
                    "description",
                    "provenance",
                    "related objects",
                    "exhibition",
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-3 md:py-4 text-small md:text-nav font-medium tracking-[0.02em] capitalize relative transition-all duration-300 cursor-pointer ${
                      activeTab === tab
                        ? "text-black opacity-100"
                        : "text-black/50 hover:text-black/80 hover:opacity-100"
                    }`}
                  >
                    {tab}
                    <span
                      className={`absolute bottom-0 left-0 right-0 h-[2px] bg-black transition-all duration-300 ${
                        activeTab === tab
                          ? "w-full opacity-100"
                          : "w-0 opacity-0"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => scrollTabs("right")}
              className={`absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-[#F1EFE7] via-[#F1EFE7]/90 to-transparent z-10 flex items-center justify-end pr-2 cursor-pointer transition-opacity duration-300 ${
                canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              aria-label="Scroll tabs right"
            >
              <span className="text-black/50 text-nav hover:text-black/80 transition-colors">
                →
              </span>
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 md:py-8 bg-[#F1EFE7]">
            {activeTab === "narrative" && (
              <TabContent
                isEmpty={!currentWork?.narrative}
                emptyMessage="No narrative available for this work."
              >
                {currentWork?.narrative && (
                  <TabText content={currentWork.narrative} />
                )}
              </TabContent>
            )}

            {activeTab === "description" && (
              <TabContent>
                <div className="space-y-6">
                  {currentWork?.description && (
                    <TabText content={currentWork.description} />
                  )}

                  <dl className="space-y-0">
                    <MetadataRow label="Date" value={currentWork?.date} />
                    <MetadataRow label="Medium" value={currentWork?.medium} />
                    <MetadataRow
                      label="Dimensions"
                      value={currentWork?.dimensions}
                    />
                  </dl>
                </div>
              </TabContent>
            )}

            {activeTab === "provenance" && (
              <TabContent
                isEmpty={!currentWork?.provenance}
                emptyMessage="No provenance records available."
              >
                {currentWork?.provenance && (
                  <TabText content={currentWork.provenance} />
                )}
              </TabContent>
            )}

            {activeTab === "related objects" && (
              <TabContent
                isEmpty={!currentWork?.relatedObjects?.length}
                emptyMessage="No related objects linked."
              >
                {currentWork?.relatedObjects?.length && (
                  <ul className="grid grid-cols-2 gap-4">
                    {currentWork.relatedObjects.map((relatedId, idx) => (
                      <li
                        key={idx}
                        className="p-4 border border-black/10 rounded-sm text-body"
                      >
                        {relatedId}
                      </li>
                    ))}
                  </ul>
                )}
              </TabContent>
            )}

            {activeTab === "exhibition" && (
              <TabContent
                isEmpty={!currentWork?.exhibition}
                emptyMessage="No exhibition history available."
              >
                {currentWork?.exhibition && (
                  <TabText content={currentWork.exhibition} />
                )}
              </TabContent>
            )}
          </div>
        </div>
      </div>
      {/* Fullscreen Image Overlay */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center overflow-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsFullscreen(false);
              setIsZoomedIn(false);
            }
          }}
        >
          <button
            onClick={() => {
              setIsFullscreen(false);
              setIsZoomedIn(false);
            }}
            className="absolute top-4 right-4 md:top-8 md:right-8 text-white/80 hover:text-white transition-colors z-20 cursor-pointer"
            aria-label="Close fullscreen"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <div
            className={`relative transition-all duration-300 ${
              isZoomedIn
                ? "w-[150vw] h-[150vh] cursor-zoom-out"
                : "w-[90vw] h-[90vh] cursor-zoom-in"
            }`}
            onClick={() => setIsZoomedIn(!isZoomedIn)}
          >
            <Image
              src={currentWork?.imageUrl || "/vintage-baseball-photograph.png"}
              alt={currentWork?.title || `Work ${selectedImageIndex + 1}`}
              fill
              sizes={isZoomedIn ? "150vw" : "90vw"}
              className="object-contain"
              quality={100}
            />
          </div>
        </div>
      )}
    </main>
  );
}
