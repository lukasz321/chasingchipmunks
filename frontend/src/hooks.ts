import { useEffect, useRef, useState } from "react";

export const useIntersectionObserver = ({
  root = null,
  rootMargin = "100px",
  threshold = 0,
}: {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number;
}) => {
  const [visible, setVisible] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (visible) return; // No need to observe if already visible

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !visible) {
          setVisible(true);
          observer.disconnect(); // Stop observing after it becomes visible
        }
      },
      {
        root,
        rootMargin,
        threshold,
      },
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [root, rootMargin, threshold, visible]);

  return [elementRef, visible];
};
