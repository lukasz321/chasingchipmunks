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
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
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

  const paddedIdx = String(photoIdx).padStart(3, "0");
  return (
    <div
      className="lazy-fullscreen-overlay"
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <img
        src={`${BASE_URL}/thumbs/${paddedIdx}.png`}
        alt={alt}
        className="lazy-fullscreen-img low-res"
      />
      <img
        src={`${BASE_URL}/full/${paddedIdx}.png`}
        alt={alt}
        className={`lazy-fullscreen-img high-res ${loaded ? "loaded" : ""}`}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
};

export default LazyImageFullscreen;
