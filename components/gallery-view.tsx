import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Image from "next/image";
import { Work, Collection } from "../lib/types";
import { trpc } from "../lib/trpc/client";

interface GalleryViewProps {
  onImageClick: (index: number) => void;
  onWorksChange?: (works: Work[]) => void;
}

export default function GalleryView({
  onImageClick,
  onWorksChange,
}: GalleryViewProps) {
  const { data: collectionsData, isLoading } =
    trpc.collections.listPublished.useQuery();
  const [activeFilter, setActiveFilter] = useState<string>("");
  const [currentWorks, setCurrentWorks] = useState<Work[]>([]);
  const [containerHeight, setContainerHeight] = useState(600);
  const [isMobile, setIsMobile] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isTabClickingRef = useRef(false);
  const hasInitializedRef = useRef(false);

  const collections = collectionsData?.collections || [];

  // Calculate optimal layout that fills available height with minimal gap
  const calculateOptimalLayout = (height: number, mobile: boolean) => {
    const minSize = mobile ? 80 : 100;
    const maxSize = mobile ? 130 : 170;
    const minGap = mobile ? 12 : 20;
    const topPadding = mobile ? 16 : 32;
    const bottomPadding = mobile ? 16 : 32;

    const availableHeight = height - topPadding - bottomPadding;

    // Try different row counts, starting from most rows possible
    for (let rows = Math.floor(availableHeight / minSize); rows >= 1; rows--) {
      // Calculate image size needed to fill height with minimum gap
      // Formula: rows * size + (rows - 1) * gap = availableHeight
      // With minGap: size = (availableHeight - (rows - 1) * minGap) / rows
      const sizeWithMinGap = (availableHeight - (rows - 1) * minGap) / rows;

      if (sizeWithMinGap >= minSize && sizeWithMinGap <= maxSize) {
        // This works! Now distribute space evenly
        const imageSize = Math.floor(sizeWithMinGap);
        const totalImageHeight = rows * imageSize;
        const totalGapSpace = availableHeight - totalImageHeight;
        const gap = rows > 1 ? Math.floor(totalGapSpace / (rows - 1)) : minGap;
        const rowSpacing = imageSize + gap;
        // Use the same gap horizontally for consistent spacing
        const colSpacing = imageSize + gap;

        return {
          rows,
          imageSize,
          rowSpacing,
          topPadding,
          colSpacing,
        };
      }
    }

    // Fallback to single row with max size
    const fallbackSize = Math.min(maxSize, availableHeight);
    return {
      rows: 1,
      imageSize: fallbackSize,
      rowSpacing: 0,
      topPadding,
      colSpacing: fallbackSize + minGap,
    };
  };

  // Get current layout based on container height (memoized)
  const layout = useMemo(
    () => calculateOptimalLayout(containerHeight, isMobile),
    [containerHeight, isMobile]
  );

  // Legacy helpers for backward compatibility
  const calculateRows = (height: number) =>
    calculateOptimalLayout(height, false).rows;
  const calculateMobileRows = (height: number) =>
    calculateOptimalLayout(height, true).rows;

  useEffect(() => {
    if (collections.length > 0) {
      const allWorks = collections.flatMap(
        (collection: Collection) => collection.works
      );
      setCurrentWorks(allWorks);

      // Only set initial active filter once
      if (!hasInitializedRef.current) {
        setActiveFilter(collections[0]?.id || "");
        hasInitializedRef.current = true;
      }
    }
  }, [collections]);

  useEffect(() => {
    if (currentWorks.length > 0 && onWorksChange) {
      onWorksChange(currentWorks);
    }
  }, [currentWorks]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || isTabClickingRef.current) return;
    if (collections.length === 0 || currentWorks.length === 0) return;

    const container = scrollContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const containerWidth = container.clientWidth;

    // Use responsive calculations from layout
    const { rows, colSpacing } = layout;
    const leftPadding = isMobile ? 16 : 32;

    // Calculate which column is in the center of the viewport
    const viewportCenter = scrollLeft + containerWidth / 2;
    const adjustedCenter = viewportCenter - leftPadding;
    const centerColumn = Math.floor(adjustedCenter / colSpacing);

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

    const visibleCollectionId = collections[collectionIndex]?.id;
    if (visibleCollectionId && visibleCollectionId !== activeFilter) {
      setActiveFilter(visibleCollectionId);
    }
  }, [
    containerHeight,
    isMobile,
    collections,
    currentWorks,
    activeFilter,
    layout,
  ]);

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

    // Set the active filter immediately and keep it locked during animation
    setActiveFilter(filter);

    const container = scrollContainerRef.current;
    if (!container) {
      isTabClickingRef.current = false;
      return;
    }

    let startIndex = 0;
    for (let i = 0; i < collections.length; i++) {
      if (collections[i].id === filter) break;
      startIndex += collections[i].works.length;
    }

    // Use layout calculations
    const col = Math.floor(startIndex / layout.rows);
    const targetX = col * layout.colSpacing;
    const leftPadding = isMobile ? 16 : 32;

    container.scrollTo({
      left: targetX - leftPadding,
      behavior: "smooth",
    });

    // Allow scroll updates again after scroll animation completes
    // Use longer timeout on mobile to account for slower scroll animations
    setTimeout(
      () => {
        isTabClickingRef.current = false;
      },
      isMobile ? 500 : 300
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col flex-1 min-h-0 items-center justify-center">
        <p>Loading collections...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="bg-[#F1EFE7] border-b border-black/10">
        {/* Mobile: Centered tabs with horizontal overflow support */}
        <div className="sm:hidden">
          <div className="overflow-x-auto scrollbar-hide px-4 py-3">
            <div className="flex gap-8 items-center justify-center min-w-max">
              {collections.map((collection) => (
                <button
                  key={collection.id}
                  onClick={() => handleFilterChange(collection.id)}
                  className={`relative py-2 px-1 text-sm font-medium tracking-[0.05em] whitespace-nowrap gallery-tab ${
                    activeFilter === collection.id
                      ? "text-black"
                      : "text-black/50 hover:text-black/75"
                  }`}
                >
                  {collection.name}
                  {activeFilter === collection.id && (
                    <div className="absolute -bottom-3 left-0 right-0 h-0.5 bg-black rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop: Original horizontal scrolling layout */}
        <div className="hidden sm:block px-6 md:px-8">
          <div className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide">
            {collections.map((collection) => (
              <button
                key={collection.id}
                onClick={() => handleFilterChange(collection.id)}
                className={`py-4 text-utility tracking-[0.05em] font-medium whitespace-nowrap relative gallery-tab ${
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
                Math.ceil(currentWorks.length / layout.rows) *
                  layout.colSpacing +
                (isMobile ? 36 : 52)
              }px`,
              minHeight: "100%",
              paddingLeft: isMobile ? "16px" : "32px",
              paddingRight: "20px",
            }}
          >
            {currentWorks.map((work, index) => {
              const row = index % layout.rows;
              const col = Math.floor(index / layout.rows);

              const x = col * layout.colSpacing + (isMobile ? 16 : 32);
              const y = row * layout.rowSpacing + layout.topPadding;

              return (
                <div
                  key={work.id}
                  className="absolute gallery-image"
                  style={{
                    left: `${x}px`,
                    top: `${y}px`,
                    width: `${layout.imageSize}px`,
                    height: `${layout.imageSize}px`,
                  }}
                  onClick={() => onImageClick(index)}
                >
                  <Image
                    src={work.imageUrl || "/vintage-baseball-photograph.png"}
                    alt={work.title}
                    fill
                    sizes={`${layout.imageSize}px`}
                    className={`rounded-sm ${
                      index === 3 ? "object-contain" : "object-cover"
                    }`}
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDAwUBAAAAAAAAAAAAAQIDAAQRBQYhEhMiMUFR/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAZEQACAwEAAAAAAAAAAAAAAAABAgADESH/2gAMAwEAAhEDEQA/AKOm7m1i2t4oIdPspEjQKrSGQsQBgE4I5NXP3d2of8+3/aNKVRa0XBJM0rZn/9k="
                  />
                  <div
                    className={`absolute top-1 left-1 bg-black/70 text-white ${
                      isMobile ? "text-xs px-1 py-0.5" : "text-xs px-1 py-0.5"
                    } rounded`}
                  >
                    {index + 1}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Collection info footer - outside scroll area */}
      <div className="bg-[#F1EFE7] py-2 md:py-3 text-center">
        <div className="text-sm md:text-content-title font-bold tracking-[0.02em]">
          {collections.find((c) => c.id === activeFilter)?.name || "Collection"}
          <span className="text-sm md:text-lg font-normal">
            {" "}
            ({collections.find((c) => c.id === activeFilter)?.works.length || 0}
            )
          </span>
        </div>
        <div className="text-xs md:text-utility opacity-60 tracking-[0.05em]">
          /{collections.reduce((sum, c) => sum + c.works.length, 0)} photos
        </div>
      </div>
    </div>
  );
}
