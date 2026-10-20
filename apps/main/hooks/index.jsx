import { useState, useEffect, useRef } from "react";

export function useInView(options = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const optionsRef = useRef(options);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -30px 0px",
        ...optionsRef.current,
      },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return [ref, visible];
}

export function useScrolled(threshold = 50) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > threshold);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, [threshold]);
  return scrolled;
}
