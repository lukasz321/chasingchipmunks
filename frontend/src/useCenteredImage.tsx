import { useEffect, useState } from "react";

export const useCenteredImage = (selector: string, disabled: boolean) => {
  const [activeSrc, setActiveSrc] = useState<string | null>("");

  useEffect(() => {
    if (disabled) {
      setActiveSrc(null);
      return;
    }

    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(selector),
    );
    if (!elements.length) return;

    const updateActiveIndex = () => {
      const viewportCenter = window.innerHeight / 2;
      let closestSrc: string | null = null;
      let closestDistance = Infinity;

      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const elementCenter = rect.top + rect.height / 2;
        const distance = Math.abs(elementCenter - viewportCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestSrc = el.id;
        }
      });

      if (closestSrc !== activeSrc) {
        setActiveSrc(closestSrc);
      }
    };

    updateActiveIndex();
    window.addEventListener("scroll", updateActiveIndex, { passive: true });
    window.addEventListener("resize", updateActiveIndex);

    return () => {
      window.removeEventListener("scroll", updateActiveIndex);
      window.removeEventListener("resize", updateActiveIndex);
    };
  }, [selector, disabled, activeSrc]);

  return activeSrc;
};
