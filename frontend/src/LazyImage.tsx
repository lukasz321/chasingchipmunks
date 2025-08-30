import React, { useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "yet-another-react-lightbox/styles.css";
import "./App.scss";
import { useIntersectionObserver } from "./hooks";
import { Placeholder } from "react-bootstrap";

export const LazyImage = ({
  src,
  alt,
  idx,
}: {
  src: string;
  alt: string;
  idx: number;
}) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const [elementRef, visible] = useIntersectionObserver({});

  const DEBUG = false;

  return (
    <div
      className="thumb-wrapper position-relative"
      style={{
        minHeight: visible ? "100%" : "500px",
        border: DEBUG ? "1px solid #f0f" : undefined,
      }}
      ref={elementRef as React.RefObject<HTMLDivElement>}
    >
      {DEBUG && (
        <span
          style={{
            color: "#f0f",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 10,
            fontSize: 12,
            backgroundColor: "rgba(0,0,0,0.3)",
            padding: "2px 4px",
            borderBottomRightRadius: 4,
          }}
        >
          {idx}
        </span>
      )}
      {!loaded && (
        <Placeholder
          animation="wave"
          className="w-100 h-100"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(6px)",
          }}
        />
      )}

      {visible && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className={`thumb ${loaded ? "loaded" : ""}`}
          onLoad={() => setLoaded(true)}
          loading="lazy"
        />
      )}
    </div>
  );
};

export default LazyImage;
