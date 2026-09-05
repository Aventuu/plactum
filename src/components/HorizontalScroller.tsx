"use client";

import { useRef, useState, type MouseEvent, type PointerEvent, type ReactNode } from "react";

// overflow-x-auto scrolls natively with touch and trackpad swipe, but a plain
// mouse has no way to drag it — the scrollbar affordance is hidden on
// purpose (scrollbar-hide). This adds click-and-drag scrolling for mouse
// input while leaving touch to the native, already-working behavior.
export default function HorizontalScroller({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false });
  const [isDragging, setIsDragging] = useState(false);

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "touch") return;
    const el = ref.current;
    if (!el) return;
    drag.current = { active: true, startX: e.clientX, scrollLeft: el.scrollLeft, moved: false };
    setIsDragging(true);
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el || !drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    el.scrollLeft = drag.current.scrollLeft - dx;
  }

  function endDrag() {
    drag.current.active = false;
    setIsDragging(false);
  }

  function onClickCapture(e: MouseEvent<HTMLDivElement>) {
    // Suppress the Link navigation click that follows a drag gesture.
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  }

  return (
    <div
      ref={ref}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
      onClickCapture={onClickCapture}
      className={`${className} ${isDragging ? "cursor-grabbing select-none" : "cursor-grab"}`}
    >
      {children}
    </div>
  );
}
