import { useEffect, useRef, useState } from 'react';

export function useReveal() {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isObserving, setIsObserving] = useState(false);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return undefined;
    }

    const element = ref.current;
    if (!element) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });

    setIsObserving(true);
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return { ref, isVisible, isObserving };
}
