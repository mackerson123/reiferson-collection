"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Work, Collection } from "../lib/types";

interface GalleryViewProps {
  onImageClick: (index: number) => void;
  onWorksChange?: (works: Work[]) => void;
}

export default function GalleryView({
  onImageClick,
  onWorksChange,
}: GalleryViewProps) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("");
  const [currentWorks, setCurrentWorks] = useState<Work[]>([]);
  const [currentCollection, setCurrentCollection] = useState(0);
  const [containerHeight, setContainerHeight] = useState(600);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isTabClickingRef = useRef(false);

  const calculateRows = (height: number) => {
    const imageHeight = 130;
    const imageSpacing = 172;
    const topPadding = 40;
    return Math.max(
      1,
      Math.floor((height - topPadding - imageHeight) / imageSpacing) + 1
    );
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/collections");
        const data = await response.json();

        setCollections(data.collections);
        setActiveFilter(data.collections[0]?.id || "");

        const allWorks = data.collections.flatMap(
          (collection: Collection) => collection.works
        );
        setCurrentWorks(allWorks);
        setCurrentCollection(0);

        // Call onWorksChange only once during initialization
        if (onWorksChange) {
          onWorksChange(allWorks);
        }
      } catch (error) {
        console.error("Error loading collections:", error);
        // Fallback to original data if API fails
        try {
          const {
            collections: fallbackCollections,
            getAllWorks: fallbackGetAllWorks,
          } = await import("../data/collections");
          setCollections(fallbackCollections);
          setActiveFilter(fallbackCollections[0]?.id || "");

          const allWorks = fallbackGetAllWorks();
          setCurrentWorks(allWorks);
          setCurrentCollection(0);

          if (onWorksChange) {
            onWorksChange(allWorks);
          }
        } catch (fallbackError) {
          console.error("Fallback also failed:", fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []); // Empty dependency array - only run once on mount

  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || isTabClickingRef.current) return;

    const container = scrollContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const containerWidth = container.clientWidth;

    // Calculate which column is in the center of the viewport
    const viewportCenter = scrollLeft + containerWidth / 2;
    const adjustedCenter = viewportCenter - 32; // Account for left padding
    const centerColumn = Math.floor(adjustedCenter / 200);

    const rows = calculateRows(containerHeight);
    const centerImageIndex = Math.max(0, centerColumn * rows);

    // Find which collection this image belongs to
    let running = 0;
    let collectionIndex = 0;
    for (let i = 0; i < collections.length; i++) {
      const next = running + collections[i].works.length;
      if (centerImageIndex < next) {
        collectionIndex = i;
        break;
      }
      running = next;
    }

    setCurrentCollection(collectionIndex);
    const visibleCollectionId = collections[collectionIndex]?.id;
    if (visibleCollectionId) {
      setActiveFilter(visibleCollectionId);
    }
  }, [containerHeight]);

  useEffect(() => {
    const container = containerRef.current;
    const scrollContainer = scrollContainerRef.current;

    if (container) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setContainerHeight(entry.contentRect.height);
        }
      });

      const rect = container.getBoundingClientRect();
      if (rect.height > 0) {
        setContainerHeight(rect.height);
      }

      resizeObserver.observe(container);

      // Add scroll listener
      if (scrollContainer) {
        scrollContainer.addEventListener("scroll", handleScroll);
      }

      return () => {
        resizeObserver.disconnect();
        if (scrollContainer) {
          scrollContainer.removeEventListener("scroll", handleScroll);
        }
      };
    }
  }, [handleScroll]);

  const handleFilterChange = (filter: string) => {
    isTabClickingRef.current = true;
    setActiveFilter(filter);

    const container = scrollContainerRef.current;
    if (!container) return;

    let startIndex = 0;
    for (let i = 0; i < collections.length; i++) {
      if (collections[i].id === filter) break;
      startIndex += collections[i].works.length;
    }

    const rows = calculateRows(containerHeight);
    const col = Math.floor(startIndex / rows);
    const targetX = col * 200;

    container.scrollTo({
      left: targetX - 32,
      behavior: "smooth",
    });

    const clickedIndex = Math.max(
      0,
      collections.findIndex((c) => c.id === filter)
    );
    setCurrentCollection(clickedIndex);

    // Allow scroll updates again after scroll animation completes
    setTimeout(() => {
      isTabClickingRef.current = false;
    }, 300);
  };

  if (loading) {
    return (
      <div className="flex flex-col flex-1 min-h-0 items-center justify-center">
        <p>Loading collections...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="sticky top-0 z-40 bg-[#F1EFE7] border-b border-black/10 px-6 md:px-8">
        <div className="flex gap-4 md:gap-6 overflow-x-auto">
          {collections.map((collection) => (
            <button
              key={collection.id}
              onClick={() => handleFilterChange(collection.id)}
              className={`py-4 text-utility tracking-[0.05em] font-medium whitespace-nowrap relative transition-colors ${
                activeFilter === collection.id
                  ? "text-black"
                  : "text-black/60 hover:text-black/80"
              }`}
            >
              {collection.name} ({collection.works.length})
              {activeFilter === collection.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      <main
        ref={containerRef}
        className="flex-1 relative"
        style={{ minHeight: "400px" }}
      >
        <div
          ref={scrollContainerRef}
          className="absolute inset-0 overflow-x-auto overflow-y-hidden scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div
            className="relative h-full flex"
            style={{
              width: `${
                Math.ceil(
                  currentWorks.length / calculateRows(containerHeight)
                ) *
                  200 +
                52
              }px`,
              minHeight: "100%",
              paddingLeft: "32px",
              paddingRight: "20px",
            }}
          >
            {currentWorks.map((work, index) => {
              const rows = calculateRows(containerHeight);
              const row = index % rows;
              const col = Math.floor(index / rows);
              const x = col * 200 + 32; // Add 32px left padding
              const y = row * 172 + 40;

              return (
                <div
                  key={work.id}
                  className="absolute cursor-pointer hover:scale-105 transition-transform duration-200"
                  style={{
                    left: `${x}px`,
                    top: `${y}px`,
                    width: "130px",
                    height: "130px",
                  }}
                  onClick={() => onImageClick(index)}
                >
                  <img
                    src={
                      work.imageUrl ||
                      "/placeholder.svg?height=400&width=400&query=vintage baseball photograph"
                    }
                    alt={work.title}
                    className={`w-full h-full rounded-sm ${
                      index === 3 ? "object-contain" : "object-cover"
                    }`}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = "/vintage-baseball-photograph.png";
                    }}
                  />
                  <div className="absolute top-1 left-1 bg-black/70 text-white text-xs px-1 py-0.5 rounded">
                    {index + 1}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center px-4 py-2 z-10">
          <div className="text-content-title font-bold tracking-[0.02em]">
            {collections.find((c) => c.id === activeFilter)?.name ||
              "Collection"}
            <span className="text-lg font-normal">
              (
              {collections.find((c) => c.id === activeFilter)?.works.length ||
                0}
              )
            </span>
          </div>
          <div className="text-utility opacity-60 tracking-[0.05em]">
            /{collections.reduce((sum, c) => sum + c.works.length, 0)} photos
          </div>
        </div>
      </main>
    </div>
  );
}
