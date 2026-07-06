import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";
import { useWindowSize } from "usehooks-ts";
import LazyImageFullscreen from "./LazyImageFullscreen";
import { useCenteredImage } from "./hooks/useCenteredImage";

export const BASE_URL =
  "https://cdn.jsdelivr.net/gh/lukasz321/chasingchipmunks@v1/photos/";
const NUM_PHOTOS = 60;

const App = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [inTheMiddleSelector, setInTheMiddleSelector] =
    useState<string>("nonexistent");

  const { width } = useWindowSize();
  const numCols = width > 991 ? 3 : width > 575 ? 2 : 1;

  const inTheMiddle = useCenteredImage(inTheMiddleSelector, numCols > 1);

  useEffect(() => {
    setTimeout(() => setInTheMiddleSelector(".masonry-item"), 300);
  }, []);

  return (
    <div className="pb-5" style={{ width: "100vw" }}>
      <div className="masonry-wrapper">
        {Array.from({ length: numCols }).map((_, colIdx) => (
          <div className="masonry-column" key={colIdx}>
            {colIdx === 0 && (
              <div style={{ margin: "50px auto" }}>
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
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px",
                    padding: "12px 18px",
                    backgroundColor: "#ff0000",
                    color: "white",
                    textDecoration: "none",
                    textAlign: "center",
                    borderRadius: "8px",
                    transition: "opacity 0.2s ease",
                  }}
                >
                  <span style={{ fontSize: "30px", fontWeight: 600 }}>
                    ▶︎ YouTube
                  </span>
                  <span style={{ fontSize: "13px", fontWeight: 300 }}>
                    Golden State Roam{" "}
                    <span style={{ fontWeight: 500 }}>2025</span>
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
                      id={paddedIdx}
                      key={paddedIdx}
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
          onNext={() => setActiveIndex((prev) => (prev! + 1) % NUM_PHOTOS)}
          onPrev={() =>
            setActiveIndex((prev) => (prev! === 0 ? NUM_PHOTOS - 1 : prev! - 1))
          }
        />
      )}
    </div>
  );
};

export default App;
