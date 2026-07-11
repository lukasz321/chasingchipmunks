import { useState, useEffect, useMemo } from "react";
import "./App.scss";
import { useWindowSize } from "usehooks-ts";
import LazyImageFullscreen from "./LazyImageFullscreen";
import { useCenteredImage } from "./hooks/useCenteredImage";

export const BASE_URL =
  "https://cdn.jsdelivr.net/gh/lukasz321/chasingchipmunks@v1/photos/";
const NUM_PHOTOS = 60;

const heroLinkStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  padding: "12px 18px",
  color: "white",
  textDecoration: "none",
  textAlign: "center",
  borderRadius: "8px",
  transition: "opacity 0.2s ease",
} as const;

const App = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [inTheMiddleSelector, setInTheMiddleSelector] =
    useState<string>("nonexistent");

  const { width } = useWindowSize();
  const numCols = width > 991 ? 3 : width > 575 ? 2 : 1;

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
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: "16px",
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
                  <span style={{ fontSize: "30px", fontWeight: 600 }}>
                    ▶︎ YouTube
                  </span>
                  <span style={{ fontSize: "13px", fontWeight: 300 }}>
                    Golden State Roam{" "}
                    <span style={{ fontWeight: 500 }}>2025</span>
                  </span>
                </a>
                <a
                  href="https://powchase.chasingchipmunks.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "0.9";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                  style={{ ...heroLinkStyle, backgroundColor: "#1565c0" }}
                >
                  <span
                    style={{
                      fontSize: "26px",
                      fontWeight: 600,
                      fontFamily:
                        "'SF Mono', 'Fira Code', Menlo, Consolas, monospace",
                    }}
                  >
                    powchase
                  </span>
                </a>
              </div>
            )}
            {Array.from({ length: Math.ceil(NUM_PHOTOS / numCols) }).map(
              (_, photoIdx) => {
                const rawIdx = NUM_PHOTOS - 1 - (photoIdx * numCols + colIdx);
                if (rawIdx < 0) return null;
                const paddedIdx = String(rawIdx + 1).padStart(3, "0");

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
                    <img
                      style={{ minHeight: "200px" }}
                      className="thumb loaded"
                      alt={`Photo ${paddedIdx}`}
                      src={`${BASE_URL}/thumbs/${paddedIdx}.png`}
                      loading="lazy"
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
