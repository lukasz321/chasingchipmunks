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
