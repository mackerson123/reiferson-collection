"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { collections, getAllWorks } from "../data/collections";
import { Work } from "../lib/types";

interface GalleryViewProps {
  onImageClick: (index: number) => void;
  onWorksChange?: (works: Work[]) => void;
}

export default function GalleryView({
  onImageClick,
  onWorksChange,
}: GalleryViewProps) {
  const [activeFilter, setActiveFilter] = useState<string>(
    collections[0]?.id || ""
  );
  const [currentWorks, setCurrentWorks] = useState<Work[]>([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [currentCollection, setCurrentCollection] = useState(0);
  const [containerDimensions, setContainerDimensions] = useState({
    width: 0,
    height: 600,
  });
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isTabClickingRef = useRef(false);

  const getImagePosition = (index: number, availableHeight: number) => {
    const imageHeight = 130;
    const imageSpacing = 172;
    const topPadding = 40;
    const bottomPadding = 80; // Space for bottom collection info but allow images behind it

    // Calculate how many rows can fit, allowing images to go behind bottom title
    const maxRows =
      Math.floor((availableHeight - topPadding - imageHeight) / imageSpacing) +
      1;
    const actualRows = Math.max(1, maxRows);

    const row = index % actualRows;
    const col = Math.floor(index / actualRows);
    const baseX = col * 200;
    const baseY = row * imageSpacing + topPadding;
    return { x: baseX, y: baseY, actualRows };
  };

  const getImageSize = (index: number) => {
    return { width: 130, height: 130 };
  };

  useEffect(() => {
    const allWorks = getAllWorks();
    const targetWorkCount = allWorks.length;
    const extendedWorks: Work[] = [];
    while (extendedWorks.length < targetWorkCount) {
      extendedWorks.push(...allWorks);
    }
    const finalWorks = extendedWorks.slice(0, targetWorkCount);
    setCurrentWorks(finalWorks);
    onWorksChange?.(finalWorks);
    setScrollPosition(0);
    setCurrentCollection(0);
  }, [onWorksChange]);

  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const containerWidth = container.clientWidth;
    const totalWidth = container.scrollWidth;
    const singleSetWidth = totalWidth / 3;

    if (scrollLeft >= singleSetWidth * 2 - 100) {
      container.scrollLeft = scrollLeft - singleSetWidth;
    } else if (scrollLeft <= 100) {
      container.scrollLeft = singleSetWidth + scrollLeft;
    }

    const currentScrollLeft = container.scrollLeft;
    const viewportCenter = currentScrollLeft + containerWidth / 2;
    const normalizedViewportCenter =
      (viewportCenter - singleSetWidth) / singleSetWidth;
    setScrollPosition(Math.max(0, Math.min(1, normalizedViewportCenter)));

    const availableHeight = containerDimensions.height || 600;
    const { actualRows } = getImagePosition(0, availableHeight);
    const columnWidth = 200;
    // Center position within the middle set [0, singleSetWidth)
    let centerWithinSet = viewportCenter - singleSetWidth;
    // Normalize in case of any rounding drift
    centerWithinSet =
      ((centerWithinSet % singleSetWidth) + singleSetWidth) % singleSetWidth;
    const centerColumn = Math.floor(centerWithinSet / columnWidth);

    const totalWorks = currentWorks.length;
    const centerImageIndex = Math.max(
      0,
      Math.min(totalWorks - 1, centerColumn * actualRows)
    );

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
    if (visibleCollectionId && !isTabClickingRef.current) {
      setActiveFilter(visibleCollectionId);
    }
  }, [containerDimensions.height, currentWorks.length]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);

      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const newDimensions = {
            width: entry.contentRect.width,
            height: entry.contentRect.height,
          };
          setContainerDimensions(newDimensions);
        }
      });

      const rect = container.getBoundingClientRect();
      if (rect.height > 0) {
        setContainerDimensions({
          width: rect.width,
          height: rect.height,
        });
      }

      resizeObserver.observe(container);

      setTimeout(() => {
        handleFilterChange(collections[0]?.id || "");
      }, 100);

      return () => {
        container.removeEventListener("scroll", handleScroll);
        resizeObserver.disconnect();
      };
    }
  }, [handleScroll]);

  const handleFilterChange = (filter: string) => {
    isTabClickingRef.current = true;
    setActiveFilter(filter);
    const container = scrollContainerRef.current;
    if (!container) return;

    const availableHeight = containerDimensions.height || 600;
    const samplePosition = getImagePosition(0, availableHeight);
    const actualRows = samplePosition.actualRows;
    const columnsPerSet = Math.ceil((currentWorks.length || 1) / actualRows);
    const baseSetWidth = columnsPerSet * 200;

    let startIndex = 0;
    {
      let offset = 0;
      for (let i = 0; i < collections.length; i++) {
        if (collections[i].id === filter) break;
        offset += collections[i].works.length;
      }
      startIndex = offset;
    }

    const position = getImagePosition(startIndex, availableHeight);
    const leftPadding = 20;
    container.scrollLeft = Math.max(0, baseSetWidth + position.x - leftPadding);

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

      <main className="flex-1 relative" style={{ minHeight: "400px" }}>
        <div
          ref={scrollContainerRef}
          className="absolute inset-0 overflow-x-auto overflow-y-hidden scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div
            className="relative h-full"
            style={{
              width: (() => {
                const availableHeight = containerDimensions.height || 600;
                const samplePosition = getImagePosition(0, availableHeight);
                const actualRows = samplePosition.actualRows;
                const width =
                  Math.ceil(currentWorks.length / actualRows) * 200 * 3 + 800;
                return `${width}px`;
              })(),
              minHeight: `100%`,
            }}
          >
            {[...Array(3)].map((_, setIndex) =>
              currentWorks.map((work, index) => {
                const availableHeight = containerDimensions.height || 600;
                const position = getImagePosition(index, availableHeight);
                const size = getImageSize(index);
                const offsetX =
                  setIndex *
                  Math.ceil(currentWorks.length / position.actualRows) *
                  200;

                return (
                  <div
                    key={`${setIndex}-${work.id}`}
                    className="absolute cursor-pointer hover:scale-105 transition-transform duration-200"
                    style={{
                      left: `${position.x + offsetX}px`,
                      top: `${position.y}px`,
                      width: `${size.width}px`,
                      height: `${size.height}px`,
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
                        e.currentTarget.src =
                          "/vintage-baseball-photograph.png";
                      }}
                    />
                    <div className="absolute top-1 left-1 bg-black/70 text-white text-xs px-1 py-0.5 rounded">
                      {index + 1}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center px-4 py-2">
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
