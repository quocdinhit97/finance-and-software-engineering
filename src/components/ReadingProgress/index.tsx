import React, {useEffect, useRef, type ReactNode} from 'react';

/**
 * Thin bar under the navbar showing how much of the article has been read.
 * Decorative (aria-hidden): the same information is not needed by screen
 * reader users, who navigate by headings.
 */
export default function ReadingProgress(): ReactNode {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const article = document.querySelector<HTMLElement>('.theme-doc-markdown');
      if (!article || !bar.current) return;
      const rect = article.getBoundingClientRect();
      const total = rect.height - window.innerHeight * 0.6;
      const read = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 1;
      bar.current.style.transform = `scaleX(${read})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, {passive: true});
    window.addEventListener('resize', onScroll, {passive: true});
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <div className="reading-progress" aria-hidden="true">
      <div ref={bar} className="reading-progress__bar" />
    </div>
  );
}
