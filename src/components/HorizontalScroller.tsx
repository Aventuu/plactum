"use client";

import { useRef, useState, type DragEvent, type MouseEvent, type PointerEvent, type ReactNode } from "react";

// overflow-x-auto scrolls natively with touch and trackpad swipe, but a plain
// mouse has no way to drag it — the scrollbar affordance is hidden on
// purpose (scrollbar-hide). This adds click-and-drag scrolling for mouse
// input while leaving touch to the native, already-working behavior.
//
// The cards inside are <Link>s, and links are natively draggable in
// browsers — without pointer capture + preventDefault, moving the cursor
// over one mid-drag hands the gesture to the browser's own "drag this
// link" behavior instead of our scroll handler, so the drag silently
// stops tracking. Capturing the pointer keeps every move/up event routed
// to this element regardless of what's under the cursor.
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
    e.preventDefault();
    el.setPointerCapture(e.pointerId);
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

  function endDrag(e: PointerEvent<HTMLDivElement>) {
    if (!drag.current.active) return;
    drag.current.active = false;
    setIsDragging(false);
    if (ref.current?.hasPointerCapture(e.pointerId)) {
      ref.current.releasePointerCapture(e.pointerId);
    }
  }

  function onClickCapture(e: MouseEvent<HTMLDivElement>) {
    // Suppress the Link navigation click that follows a drag gesture.
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  }

  function onDragStart(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  return (
    <div
      ref={ref}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onClickCapture={onClickCapture}
      onDragStart={onDragStart}
      className={`${className} ${isDragging ? "cursor-grabbing select-none" : "cursor-grab"}`}
    >
      {children}
    </div>
  );
}
