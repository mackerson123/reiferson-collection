import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Image from "next/image";
import { Work, Collection } from "../lib/types";
import { trpc } from "../lib/trpc/client";
import LoadingIntro from "./loading-intro";

interface GalleryViewProps {
  onImageClick: (index: number) => void;
  onWorksChange?: (works: Work[]) => void;
}

const LERP_FACTOR = 0.1;
const SETTLE_THRESHOLD = 0.5;
const MOMENTUM_MS = 160;
const MIN_INTRO_MS = 900;
const INTRO_FADE_MS = 500;
const BLUR_DATA_URL =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDAwUBAAAAAAAAAAAAAQIDAAQRBQYhEhMiMUFR/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAZEQACAwEAAAAAAAAAAAAAAAABAgADESH/2gAMAwEAAhEDEQA/AKOm7m1i2t4oIdPspEjQKrSGQsQBgE4I5NXP3d2of8+3/aNKVRa0XBJM0rZn/9k=";

interface Geometry {
  rows: number;
  colSpacing: number;
  rowSpacing: number;
  topPadding: number;
  leftPadding: number;
  buffer: number;
  totalWidth: number;
  worksCount: number;
  collectionIds: string[];
  collectionSizes: number[];
}

// Wraps an image's strip position around the loop so the strip pans forever.
// Falls back to plain translation when the strip is too narrow to wrap invisibly.
function computeX(
  baseX: number,
  offset: number,
  g: Geometry,
  containerWidth: number
) {
  if (g.totalWidth <= containerWidth + g.colSpacing) {
    return baseX - offset + g.leftPadding;
  }
  let x = (baseX - offset + g.buffer) % g.totalWidth;
  if (x < 0) x += g.totalWidth;
  return x - g.buffer + g.leftPadding;
}

function calculateOptimalLayout(height: number, mobile: boolean) {
  const minSize = mobile ? 80 : 100;
  const maxSize = mobile ? 130 : 170;
  const minGap = mobile ? 12 : 20;
  const topPadding = mobile ? 16 : 32;
  const bottomPadding = mobile ? 16 : 32;

  const availableHeight = height - topPadding - bottomPadding;

  for (let rows = Math.floor(availableHeight / minSize); rows >= 1; rows--) {
    const sizeWithMinGap = (availableHeight - (rows - 1) * minGap) / rows;

    if (sizeWithMinGap >= minSize && sizeWithMinGap <= maxSize) {
      const imageSize = Math.floor(sizeWithMinGap);
      const totalImageHeight = rows * imageSize;
      const totalGapSpace = availableHeight - totalImageHeight;
      const gap = rows > 1 ? Math.floor(totalGapSpace / (rows - 1)) : minGap;
      const rowSpacing = imageSize + gap;
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

  const fallbackSize = Math.min(maxSize, availableHeight);
  return {
    rows: 1,
    imageSize: fallbackSize,
    rowSpacing: 0,
    topPadding,
    colSpacing: fallbackSize + minGap,
  };
}

export default function GalleryView({
  onImageClick,
  onWorksChange,
}: GalleryViewProps) {
  const { data: collectionsData, isLoading } =
    trpc.collections.listPublished.useQuery();
  const [introExiting, setIntroExiting] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const introStartRef = useRef(0);
  const [activeFilter, setActiveFilter] = useState<string>("");
  const [currentWorks, setCurrentWorks] = useState<Work[]>([]);
  const [containerHeight, setContainerHeight] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const hasInitializedRef = useRef(false);

  const offsetRef = useRef({ current: 0, target: 0 });
  const rafRef = useRef<number | null>(null);
  const imageElsRef = useRef(new Map<number, HTMLDivElement>());
  const containerWidthRef = useRef(0);
  const geometryRef = useRef<Geometry | null>(null);
  const activeFilterRef = useRef("");
  const tabAnimatingRef = useRef(false);
  const draggedRef = useRef(false);
  const dragRef = useRef({
    active: false,
    lastX: 0,
    lastT: 0,
    velocity: 0,
    moved: 0,
  });

  const collections = collectionsData?.collections || [];

  const layout = useMemo(
    () => calculateOptimalLayout(containerHeight, isMobile),
    [containerHeight, isMobile]
  );

  const workCollectionIds = useMemo(
    () =>
      collections.flatMap((collection: Collection) =>
        collection.works.map(() => collection.id)
      ),
    [collections]
  );

  const leftPadding = isMobile ? 16 : 32;
  const cols = Math.max(1, Math.ceil(currentWorks.length / layout.rows));
  const geometry: Geometry = {
    rows: layout.rows,
    colSpacing: layout.colSpacing,
    rowSpacing: layout.rowSpacing,
    topPadding: layout.topPadding,
    leftPadding,
    buffer: layout.colSpacing + leftPadding,
    totalWidth: cols * layout.colSpacing,
    worksCount: currentWorks.length,
    collectionIds: collections.map((c: Collection) => c.id),
    collectionSizes: collections.map((c: Collection) => c.works.length),
  };
  geometryRef.current = geometry;
  activeFilterRef.current = activeFilter;

  useEffect(() => {
    if (collections.length > 0) {
      const allWorks = collections.flatMap(
        (collection: Collection) => collection.works
      );
      setCurrentWorks(allWorks);

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

  const applyPositions = useCallback(() => {
    const g = geometryRef.current;
    if (!g) return;
    const offset = offsetRef.current.current;
    const containerWidth = containerWidthRef.current;
    imageElsRef.current.forEach((el, index) => {
      const col = Math.floor(index / g.rows);
      const row = index % g.rows;
      const x = computeX(col * g.colSpacing, offset, g, containerWidth);
      const y = row * g.rowSpacing + g.topPadding;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });
  }, []);

  const syncActiveCollection = useCallback(() => {
    if (tabAnimatingRef.current) return;
    const g = geometryRef.current;
    if (!g || g.worksCount === 0 || g.collectionIds.length === 0) return;

    let center =
      offsetRef.current.current + containerWidthRef.current / 2 - g.leftPadding;
    center = ((center % g.totalWidth) + g.totalWidth) % g.totalWidth;
    const centerColumn = Math.floor(center / g.colSpacing);
    const centerIndex = Math.min(
      Math.max(0, centerColumn * g.rows),
      g.worksCount - 1
    );

    let running = 0;
    let visibleId = g.collectionIds[g.collectionIds.length - 1];
    for (let i = 0; i < g.collectionSizes.length; i++) {
      running += g.collectionSizes[i];
      if (centerIndex < running) {
        visibleId = g.collectionIds[i];
        break;
      }
    }

    if (visibleId && visibleId !== activeFilterRef.current) {
      setActiveFilter(visibleId);
    }
  }, []);

  const clampTarget = useCallback(() => {
    const g = geometryRef.current;
    if (!g) return;
    const containerWidth = containerWidthRef.current;
    if (g.totalWidth > containerWidth + g.colSpacing) return;
    const max = Math.max(0, g.totalWidth + g.leftPadding * 2 - containerWidth);
    const o = offsetRef.current;
    o.target = Math.min(Math.max(o.target, 0), max);
  }, []);

  const animate = useCallback(() => {
    const o = offsetRef.current;
    const diff = o.target - o.current;
    if (Math.abs(diff) < SETTLE_THRESHOLD && !dragRef.current.active) {
      o.current = o.target;
      applyPositions();
      tabAnimatingRef.current = false;
      syncActiveCollection();
      rafRef.current = null;
      return;
    }
    o.current += diff * LERP_FACTOR;
    applyPositions();
    syncActiveCollection();
    rafRef.current = requestAnimationFrame(animate);
  }, [applyPositions, syncActiveCollection]);

  const startAnimation = useCallback(() => {
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(animate);
    }
  }, [animate]);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const panBy = useCallback(
    (delta: number) => {
      tabAnimatingRef.current = false;
      offsetRef.current.target += delta;
      clampTarget();
      startAnimation();
    },
    [clampTarget, startAnimation]
  );

  const ready = !isLoading && containerHeight > 0;

  useEffect(() => {
    introStartRef.current = Date.now();
  }, []);

  useEffect(() => {
    if (!ready || introExiting) return;
    const elapsed = Date.now() - introStartRef.current;
    const timer = setTimeout(
      () => setIntroExiting(true),
      Math.max(0, MIN_INTRO_MS - elapsed)
    );
    return () => clearTimeout(timer);
  }, [ready, introExiting]);

  useEffect(() => {
    if (!introExiting) return;
    const timer = setTimeout(() => setIntroDone(true), INTRO_FADE_MS);
    return () => clearTimeout(timer);
  }, [introExiting]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerHeight(entry.contentRect.height);
        containerWidthRef.current = entry.contentRect.width;
      }
    });

    const rect = container.getBoundingClientRect();
    if (rect.height > 0) {
      setContainerHeight(rect.height);
      containerWidthRef.current = rect.width;
    }

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [ready]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta =
        Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      panBy(delta);
    };

    viewport.addEventListener("wheel", onWheel, { passive: false });
    return () => viewport.removeEventListener("wheel", onWheel);
  }, [ready, panBy]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const g = geometryRef.current;
      if (!g) return;
      if (e.key === "ArrowLeft") {
        panBy(-g.colSpacing * 2);
      } else if (e.key === "ArrowRight") {
        panBy(g.colSpacing * 2);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [panBy]);

  useEffect(() => {
    applyPositions();
    clampTarget();
  }, [layout, currentWorks.length, applyPositions, clampTarget]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!e.isPrimary) return;
    dragRef.current = {
      active: true,
      lastX: e.clientX,
      lastT: performance.now(),
      velocity: 0,
      moved: 0,
    };
    draggedRef.current = false;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag.active) return;
    const now = performance.now();
    const dx = e.clientX - drag.lastX;
    const dt = Math.max(1, now - drag.lastT);
    drag.velocity = 0.7 * drag.velocity + 0.3 * (dx / dt);
    drag.lastX = e.clientX;
    drag.lastT = now;
    drag.moved += Math.abs(dx);
    if (drag.moved > 5) {
      draggedRef.current = true;
    }
    panBy(-dx);
  };

  const handlePointerEnd = () => {
    const drag = dragRef.current;
    if (!drag.active) return;
    drag.active = false;
    panBy(-drag.velocity * MOMENTUM_MS);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);

    const g = geometryRef.current;
    if (!g || g.worksCount === 0) return;

    let startIndex = 0;
    for (let i = 0; i < collections.length; i++) {
      if (collections[i].id === filter) break;
      startIndex += collections[i].works.length;
    }

    const baseX = Math.floor(startIndex / g.rows) * g.colSpacing;
    const o = offsetRef.current;
    const wrapEnabled = g.totalWidth > containerWidthRef.current + g.colSpacing;

    if (wrapEnabled) {
      let delta =
        (((baseX - o.target) % g.totalWidth) + g.totalWidth) % g.totalWidth;
      if (delta > g.totalWidth / 2) delta -= g.totalWidth;
      o.target += delta;
    } else {
      o.target = baseX;
      clampTarget();
    }

    tabAnimatingRef.current = true;
    startAnimation();
  };

  return (
    <div className="relative flex flex-col flex-1 min-h-0">
      <div className="bg-[#F1EFE7] border-b border-black/10">
        {/* Mobile: tabs with horizontal overflow support */}
        <div className="sm:hidden px-4 h-[52px]">
          <div className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide items-center h-full">
            {collections.map((collection) => (
              <button
                key={collection.id}
                onClick={() => handleFilterChange(collection.id)}
                className={`text-nav tracking-[0.05em] font-medium whitespace-nowrap relative gallery-tab cursor-pointer h-full flex items-center ${
                  activeFilter === collection.id
                    ? "text-black"
                    : "text-black/50 hover:text-black/75"
                }`}
              >
                {collection.name}
                {activeFilter === collection.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop: Original horizontal scrolling layout */}
        <div className="hidden sm:block px-4 md:px-8">
          <div className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide items-center h-[52px] md:h-[56px]">
            {collections.map((collection) => (
              <button
                key={collection.id}
                onClick={() => handleFilterChange(collection.id)}
                className={`text-nav tracking-[0.05em] font-medium whitespace-nowrap relative gallery-tab cursor-pointer h-full flex items-center ${
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

      <main ref={containerRef} className="flex-1 relative min-h-0">
        <div
          ref={viewportRef}
          className="absolute inset-0 overflow-hidden select-none cursor-grab active:cursor-grabbing"
          style={{ touchAction: "none" }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
        >
          {currentWorks.map((work, index) => {
            const row = index % layout.rows;
            const col = Math.floor(index / layout.rows);
            const x = computeX(
              col * layout.colSpacing,
              offsetRef.current.current,
              geometry,
              containerWidthRef.current
            );
            const y = row * layout.rowSpacing + layout.topPadding;
            const isActive = workCollectionIds[index] === activeFilter;

            return (
              <div
                key={work.id}
                ref={(el) => {
                  if (el) {
                    imageElsRef.current.set(index, el);
                  } else {
                    imageElsRef.current.delete(index);
                  }
                }}
                className={`absolute left-0 top-0 will-change-transform transition-opacity duration-700 ${
                  isActive ? "opacity-100" : "opacity-35"
                }`}
                style={{
                  transform: `translate3d(${x}px, ${y}px, 0)`,
                  width: `${layout.imageSize}px`,
                  height: `${layout.imageSize}px`,
                }}
              >
                <div
                  className="relative w-full h-full gallery-image"
                  onClick={() => {
                    if (!draggedRef.current) {
                      onImageClick(index);
                    }
                  }}
                >
                  <Image
                    src={work.imageUrl || "/vintage-baseball-photograph.png"}
                    alt={work.title}
                    fill
                    sizes={`${layout.imageSize}px`}
                    className="rounded-sm object-cover"
                    loading={index < layout.rows * 8 ? "eager" : "lazy"}
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                    draggable={false}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Collection info footer - always visible */}
      <div className="bg-[#F1EFE7] py-3 md:py-4 text-center flex-shrink-0">
        <div className="text-xl md:text-3xl font-bold tracking-[0.02em]">
          {collections.find((c) => c.id === activeFilter)?.name || "Collection"}
          <span className="text-base md:text-xl font-normal">
            {" "}
            ({collections.find((c) => c.id === activeFilter)?.works.length || 0}
            )
          </span>
        </div>
        <div className="text-small md:text-nav opacity-60 tracking-[0.05em]">
          /{collections.reduce((sum, c) => sum + c.works.length, 0)} photos
        </div>
      </div>

      {!introDone && <LoadingIntro exiting={introExiting} />}
    </div>
  );
}
