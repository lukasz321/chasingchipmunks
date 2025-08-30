import { useState, useMemo, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";
import { useQuery } from "@tanstack/react-query";
import { fetchPhotos } from "./api";
import { useWindowSize } from "usehooks-ts";
import LazyImage from "./LazyImage";
import LazyImageFullscreen from "./LazyImageFullscreen";
import { Spinner } from "react-bootstrap";
import { useCenteredImage } from "./useCenteredImage";

interface Photo {
  src: string; // full resolution
  thumb: string; // thumbnail
  index?: number;
}

const numPhotos = 48

const App = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [inTheMiddleSelector, setInTheMiddleSelector] =
    useState<string>("nonexistent");

  const { width } = useWindowSize();
  const numCols = width > 991 ? 3 : width > 575 ? 2 : 1;

  const inTheMiddle = useCenteredImage(inTheMiddleSelector, numCols > 1);

  return (
    <div className="pb-5" style={{ width: "100vw" }}>
      <div className="masonry-wrapper">
        {Array.from({length: 3}).map((column, colIdx) => (
          <div className="masonry-column" key={colIdx}>
            {Array.from({length: numPhotos/3}).map((photo, photoIdx) => (
              <div
                id={`${colIdx}-${photoIdx}`}
                key={`${colIdx}-${photoIdx}`}
                className={`masonry-item ${activeIndex !== null ? "blurred" : ""} ${inTheMiddle === photo.src ? "in-the-middle" : ""}`}
                onClick={() => numCols > 1 && setActiveIndex((colIdx+1)*(photoIdx+1))}
                style={{ cursor: numCols > 1 ? "pointer" : "default" }}
              >
                <img
                  src={`https://cdn.jsdelivr.net/gh/lukasz321/chasingchipmunks@trunk/photos/thumbs/0${(photoIdx+1)*(colIdx+1)}.png`}
                  className={`thumb ${true ? "loaded" : ""}`}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Fullscreen viewer */}
      {/* {activeIndex !== null && numCols > 1 && (
        <LazyImageFullscreen
          thumb={flatPhotos[activeIndex].thumb}
          full={flatPhotos[activeIndex].src}
          alt={`Gallery ${activeIndex}`}
          onClose={() => setActiveIndex(null)}
          onNext={() =>
            setActiveIndex((prev) => (prev! + 1) % flatPhotos.length)
          }
          onPrev={() =>
            setActiveIndex((prev) =>
              prev! === 0 ? flatPhotos.length - 1 : prev! - 1,
            )
          }
        />
      )} */}
    </div>
  );
};

export default App;
