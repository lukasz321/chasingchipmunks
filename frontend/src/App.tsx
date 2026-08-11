import { useState, useEffect, useMemo, useRef } from "react";
import "./App.scss";
import { useWindowSize } from "usehooks-ts";
import LazyImageFullscreen from "./LazyImageFullscreen";
import { useCenteredImage } from "./hooks/useCenteredImage";

export const BASE_URL =
  "https://cdn.jsdelivr.net/gh/lukasz321/chasingchipmunks@v2/photos/";
const NUM_PHOTOS = 60;

// How many thumbnails are allowed to be in-flight ahead of the last one that
// has finished. Small enough that photos load roughly top-to-bottom (so their
// height shifts push down not-yet-visible content instead of jumping the
// visible ones), large enough to keep the pipe busy on fast connections.
const LOAD_AHEAD = 4;

// A single grayscale thumbnail that fades in once it has loaded. `shouldLoad`
// gates when its request is actually kicked off so the grid loads in order.
const Thumb = ({
  src,
  alt,
  shouldLoad,
  onSettled,
}: {
  src: string;
  alt: string;
  shouldLoad: boolean;
  onSettled: () => void;
}) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <img
      style={{ minHeight: "200px" }}
      className={`thumb ${loaded ? "loaded" : ""}`}
      alt={alt}
      src={shouldLoad ? src : undefined}
      onLoad={() => {
        setLoaded(true);
        onSettled();
      }}
      onError={onSettled}
    />
  );
};

const heroLinkStyle = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  padding: "8px 14px",
  color: "white",
  textDecoration: "none",
  textAlign: "center",
  borderRadius: "6px",
  transition: "opacity 0.2s ease",
} as const;

const App = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [inTheMiddleSelector, setInTheMiddleSelector] =
    useState<string>("nonexistent");

  const { width } = useWindowSize();
  const numCols = width > 991 ? 3 : width > 575 ? 2 : 1;

  // Load thumbnails strictly in visual reading order (top-to-bottom). A photo's
  // reading position is `NUM_PHOTOS - 1 - rawIdx`, independent of column count.
  // `loadedCount` is the length of the uninterrupted run of positions that have
  // finished loading; a thumbnail only starts loading once its position is
  // within LOAD_AHEAD of that run. Both are monotonic, so once a thumbnail is
  // allowed to load it stays loaded across resizes.
  const [loadedCount, setLoadedCount] = useState(0);
  const loadedPositions = useRef<Set<number>>(new Set());
  const markLoaded = (pos: number) => {
    loadedPositions.current.add(pos);
    setLoadedCount((count) => {
      let next = count;
      while (loadedPositions.current.has(next)) next++;
      return next;
    });
  };

  // Photo indices in the exact order they are laid out on the page (down each
  // column, then the next column). Fullscreen navigation steps through this so
  // left/right follows the visual layout instead of jumping between columns.
  const photoOrder = useMemo(() => {
    const order: number[] = [];
    const rowsPerCol = Math.ceil(NUM_PHOTOS / numCols);
    for (let colIdx = 0; colIdx < numCols; colIdx++) {
      for (let photoIdx = 0; photoIdx < rowsPerCol; photoIdx++) {
        const rawIdx = NUM_PHOTOS - 1 - (photoIdx * numCols + colIdx);
        if (rawIdx < 0) continue;
        order.push(rawIdx);
      }
    }
    return order;
  }, [numCols]);

  const stepPhoto = (current: number, delta: number) => {
    const pos = photoOrder.indexOf(current);
    if (pos === -1) return current;
    const next = (pos + delta + photoOrder.length) % photoOrder.length;
    return photoOrder[next];
  };

  const inTheMiddle = useCenteredImage(inTheMiddleSelector, numCols > 1);

  useEffect(() => {
    setTimeout(() => setInTheMiddleSelector(".masonry-item"), 300);
  }, []);

  return (
    <div style={{ width: "100vw", paddingBottom: "3rem" }}>
      <div className="masonry-wrapper">
        {Array.from({ length: numCols }).map((_, colIdx) => (
          <div className="masonry-column" key={colIdx}>
            {colIdx === 0 && (
              <div
                style={{
                  margin: "50px auto",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <a
                    href="https://www.youtube.com/watch?v=pdzm3tMKQBI"
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = "0.9";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = "1";
                    }}
                    style={{ ...heroLinkStyle, backgroundColor: "#ff0000" }}
                  >
                    <span style={{ fontSize: "16px", lineHeight: 1 }}>▶︎</span>
                    <span style={{ fontSize: "14px", fontWeight: 600 }}>
                      Golden State Roam{" "}
                      <span style={{ fontWeight: 400 }}>2025</span>
                    </span>
                  </a>
                  <a
                    href="https://www.youtube.com/watch?v=Uu0us3beW-Q"
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = "0.9";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = "1";
                    }}
                    style={{ ...heroLinkStyle, backgroundColor: "#ff0000" }}
                  >
                    <span style={{ fontSize: "16px", lineHeight: 1 }}>▶︎</span>
                    <span style={{ fontSize: "14px", fontWeight: 600 }}>
                      High Sierra Trail{" "}
                      <span style={{ fontWeight: 400 }}>2026</span>
                    </span>
                  </a>
                </div>
                <a
                  href="https://powchase.chasingchipmunks.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "0.7";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                  style={{
                    color: "#1565c0",
                    textDecoration: "none",
                    fontSize: "15px",
                    fontWeight: 600,
                    fontFamily:
                      "'SF Mono', 'Fira Code', Menlo, Consolas, monospace",
                    transition: "opacity 0.2s ease",
                  }}
                >
                  powchase →
                </a>
              </div>
            )}
            {Array.from({ length: Math.ceil(NUM_PHOTOS / numCols) }).map(
              (_, photoIdx) => {
                const rawIdx = NUM_PHOTOS - 1 - (photoIdx * numCols + colIdx);
                if (rawIdx < 0) return null;
                const paddedIdx = String(rawIdx + 1).padStart(3, "0");

                // Visual reading position (top-to-bottom, left-to-right).
                const loadPos = NUM_PHOTOS - 1 - rawIdx;

                return (
                  <div
                    id={paddedIdx}
                    key={paddedIdx}
                    className={`masonry-item ${activeIndex !== null ? "blurred" : ""} ${
                      inTheMiddle === paddedIdx ? "in-the-middle" : ""
                    }`}
                    onClick={() => numCols > 1 && setActiveIndex(rawIdx)}
                    style={{ cursor: numCols > 1 ? "pointer" : "default" }}
                  >
                    <Thumb
                      alt={`Photo ${paddedIdx}`}
                      src={`${BASE_URL}/thumbs/${paddedIdx}.webp`}
                      shouldLoad={loadPos < loadedCount + LOAD_AHEAD}
                      onSettled={() => markLoaded(loadPos)}
                    />
                  </div>
                );
              },
            )}
          </div>
        ))}
      </div>

      {/* Fullscreen viewer */}
      {activeIndex !== null && numCols > 1 && (
        <LazyImageFullscreen
          photoIdx={activeIndex}
          alt={`Gallery ${activeIndex}`}
          onClose={() => setActiveIndex(null)}
          onNext={() => setActiveIndex((prev) => stepPhoto(prev!, 1))}
          onPrev={() => setActiveIndex((prev) => stepPhoto(prev!, -1))}
        />
      )}
    </div>
  );
};

export default App;
