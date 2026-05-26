import { useState, useEffect } from 'react';

export default function useDarkBg(ref) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    let ticking = false;
    const checkBg = () => {
      if (!ref.current) return;
      
      const rect = ref.current.getBoundingClientRect();
      // If element is hidden (display: none), width/height are 0
      if (rect.width === 0 || rect.height === 0) return;
      
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      
      const originalPointerEvents = ref.current.style.pointerEvents;
      ref.current.style.pointerEvents = 'none';
      const el = document.elementFromPoint(x, y);
      ref.current.style.pointerEvents = originalPointerEvents;
      
      if (el) {
        // Fast path for known dark sections
        if (el.closest('#hero') || el.closest('.product-hero') || el.closest('.products-section') || el.closest('footer')) {
          setIsDark(true);
          return;
        }
        
        // Compute background color hierarchy
        let currentEl = el;
        let foundDark = false;
        while (currentEl && currentEl !== document.documentElement) {
          const style = window.getComputedStyle(currentEl);
          const bgColor = style.backgroundColor;
          if (bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
            const match = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
            if (match) {
              const r = parseInt(match[1]);
              const g = parseInt(match[2]);
              const b = parseInt(match[3]);
              // Relative luminance
              const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
              foundDark = luminance < 0.5;
            }
            break;
          }
          currentEl = currentEl.parentElement;
        }
        setIsDark(foundDark);
      }
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          checkBg();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    
    // Check initially
    setTimeout(checkBg, 100);
    
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [ref]);

  return isDark;
}
