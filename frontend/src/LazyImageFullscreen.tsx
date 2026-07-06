import React, { useEffect, useState, useRef } from "react";
import { BASE_URL } from "./App";

const LazyImageFullscreen = ({
  photoIdx,
  alt = "",
  onClose,
  onNext,
  onPrev,
}: {
  photoIdx: number;
  alt?: string;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) => {
  const [loaded, setLoaded] = useState(false);
  const startX = useRef<number | null>(null);

  // Disable background scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Escape key navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        setLoaded(false);
      }
      if (e.key === "ArrowRight") {
        onNext();
        setLoaded(false);
      }
      if (e.key === "ArrowLeft") {
        onPrev();
        setLoaded(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, onNext, onPrev]);

  // Swipe navigation
  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - startX.current;
    if (deltaX > 50) onPrev();
    else if (deltaX < -50) onNext();
    startX.current = null;
  };

  const paddedIdx = String(photoIdx + 1).padStart(3, "0");
  return (
    <div
      className="lazy-fullscreen-overlay"
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {!loaded && (
        <div
          style={{
            position: "fixed", // or "absolute" if your overlay is relative
            top: 10,
            right: 20,
            zIndex: 999999,
            padding: "8px 12px",
            borderRadius: 8,
            background: "rgba(30,30,30,0.7)",
            color: "white",
            pointerEvents: "none",
            fontSize: "0.8rem",
          }}
        >
          <div
            style={{
              width: "16px",
              height: "16px",
              border: "2px solid rgba(255,255,255,0.3)",
              borderTop: "2px solid white",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
        </div>
      )}
      <img
        key={`fullscreen-thumb-${paddedIdx}`}
        src={`${BASE_URL}/thumbs/${paddedIdx}.png`}
        alt={alt}
        className="lazy-fullscreen-img low-res"
        loading="eager"
      />
      <img
        key={`fullscreen-full-${paddedIdx}`}
        src={`${BASE_URL}/full/${paddedIdx}.jpg`}
        alt={alt}
        className={`lazy-fullscreen-img high-res ${loaded ? "loaded" : ""}`}
        onLoad={() => setLoaded(true)}
        loading="lazy"
      />
    </div>
  );
};

export default LazyImageFullscreen;
