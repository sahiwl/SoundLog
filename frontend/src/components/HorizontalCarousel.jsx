import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * DaisyUI carousel (scroll-snap + overflow) with:
 * - trackpad / touch scroll (native)
 * - daisyUI btn-circle prev/next (JS scrollBy — anchor links only work for full-width slides)
 * - mouse drag on desktop (not in daisyUI; added here per maintainer guidance)
 */
const HorizontalCarousel = ({ children, className = "" }) => {
  const trackRef = useRef(null);
  const dragRef = useRef({
    active: false,
    moved: false,
    startX: 0,
    scrollLeft: 0,
  });

  const scrollByStep = (direction) => {
    const el = trackRef.current;
    if (!el) return;
    const step = Math.max(el.clientWidth * 0.75, 280);
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  const onPointerDown = (e) => {
    if (e.button !== 0) return;
    const el = trackRef.current;
    dragRef.current = {
      active: true,
      moved: false,
      startX: e.clientX,
      scrollLeft: el.scrollLeft,
    };
    el.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!dragRef.current.active) return;
    const el = trackRef.current;
    const dx = e.clientX - dragRef.current.startX;
    if (Math.abs(dx) > 4) dragRef.current.moved = true;
    el.scrollLeft = dragRef.current.scrollLeft - dx;
  };

  const endDrag = (e) => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    trackRef.current?.releasePointerCapture(e.pointerId);
  };

  const onClickCapture = (e) => {
    if (dragRef.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      dragRef.current.moved = false;
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        aria-label="Scroll left"
        onClick={() => scrollByStep(-1)}
        className="btn btn-circle btn-sm absolute left-1 top-[calc(50%-1.5rem)] -translate-y-1/2 z-10 bg-black/60 border-white/10 hover:bg-black/80 text-white shadow-lg"
      >
        <ChevronLeft size={18} />
      </button>

      <div
        ref={trackRef}
        className="carousel carousel-center w-full overflow-x-auto p-4 gap-6 space-x-6 rounded-box scroll-smooth cursor-grab active:cursor-grabbing select-none scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
      >
        {children}
      </div>

      <button
        type="button"
        aria-label="Scroll right"
        onClick={() => scrollByStep(1)}
        className="btn btn-circle btn-sm absolute right-1 top-[calc(50%-1.5rem)] -translate-y-1/2 z-10 bg-black/60 border-white/10 hover:bg-black/80 text-white shadow-lg"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default HorizontalCarousel;
