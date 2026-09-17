'use client';

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { ChevronLeft, ChevronRight } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(Flip);
}

interface VisibleCounts {
  base: number;
  sm?: number;
  md?: number;
  lg?: number;
}

// Mirrors Tailwind's sm(640)/md(768)/lg(1024) breakpoints so the carousel's
// slot count always matches whatever grid layout it's replacing.
function useResponsiveCount(counts: VisibleCounts) {
  const [count, setCount] = useState(counts.base);

  useEffect(() => {
    const mqLg = window.matchMedia('(min-width: 1024px)');
    const mqMd = window.matchMedia('(min-width: 768px)');
    const mqSm = window.matchMedia('(min-width: 640px)');

    const update = () => {
      if (mqLg.matches && counts.lg) setCount(counts.lg);
      else if (mqMd.matches && counts.md) setCount(counts.md);
      else if (mqSm.matches && counts.sm) setCount(counts.sm);
      else setCount(counts.base);
    };

    update();
    mqLg.addEventListener('change', update);
    mqMd.addEventListener('change', update);
    mqSm.addEventListener('change', update);
    return () => {
      mqLg.removeEventListener('change', update);
      mqMd.removeEventListener('change', update);
      mqSm.removeEventListener('change', update);
    };
  }, [counts.base, counts.sm, counts.md, counts.lg]);

  return count;
}

interface FlipCarouselProps<T> {
  items: T[];
  keyField: keyof T;
  renderItem: (item: T) => React.ReactNode;
  visibleCount?: VisibleCounts;
  /** Gap between slots in px — a number (not a Tailwind class) since slot
   *  width is computed from it via calc() to keep exactly `visibleCount`
   *  cards on screen at all times. */
  gap?: number;
  className?: string;
}

/**
 * "Caterpillar" carousel ported from a GSAP Flip codepen technique: instead
 * of translating a track, each step captures Flip.getState() of the visible
 * cards, swaps one item out for the next one in the source array, then lets
 * Flip.from() tween every card to its new slot — the outgoing card fades/
 * shrinks out (onLeave) while the incoming one fades/grows in (onEnter).
 */
export function FlipCarousel<T>({
  items,
  keyField,
  renderItem,
  visibleCount = { base: 1, sm: 2, lg: 3 },
  gap = 24,
  className = ''
}: FlipCarouselProps<T>) {
  const count = useResponsiveCount(visibleCount);
  const total = items.length;
  const safeCount = Math.max(1, Math.min(count, total));

  const idOf = useCallback((item: T) => String(item[keyField]), [keyField]);

  const [pointer, setPointer] = useState(0);
  const [ghostId, setGhostId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef(new Map<string, HTMLElement>());
  const isAnimating = useRef(false);
  const pendingFlip = useRef<{ state: Flip.FlipState; forward: boolean; incomingId: string; outgoingId: string } | null>(null);

  useEffect(() => {
    setPointer((p) => (total ? p % total : 0));
  }, [total]);

  // GSAP mutates these nodes' inline styles directly (opacity/transform),
  // outside of React's render — mutations React's own reconciliation never
  // knows about and therefore never undoes. Next.js Fast Refresh preserves
  // existing DOM nodes across an edit, so any transition interrupted by a
  // code change (mid opacity/transform tween) can leave a card permanently
  // stuck invisible. Wiping those two props once on mount guarantees every
  // visible card always starts from a clean, fully-opaque baseline.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    gsap.set(container.querySelectorAll('[data-carousel-item]'), { clearProps: 'transform,opacity' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!total) return null;

  const visibleIds = Array.from({ length: safeCount }, (_, i) => idOf(items[(pointer + i) % total]));
  const canCycle = total > safeCount;

  const go = (forward: boolean) => {
    if (isAnimating.current || !canCycle) return;
    isAnimating.current = true;

    const currentEls = visibleIds.map((id) => nodeRefs.current.get(id)).filter(Boolean) as HTMLElement[];
    // Self-healing: force every currently-visible card back to its correct,
    // fully-settled baseline (no stray opacity/transform) right before
    // starting a new transition — belt-and-braces against any prior cycle
    // that somehow didn't clear itself, so a stuck card never survives past
    // the very next click.
    gsap.set(currentEls, { clearProps: 'transform,opacity' });
    const state = Flip.getState(currentEls);

    const outgoingIndex = forward ? pointer : (pointer + safeCount - 1 + total) % total;
    const incomingIndex = forward ? (pointer + safeCount) % total : (pointer - 1 + total) % total;
    const outgoingId = idOf(items[outgoingIndex]);
    const incomingId = idOf(items[incomingIndex]);

    pendingFlip.current = { state, forward, incomingId, outgoingId };
    setGhostId(outgoingId);
    setPointer((p) => (forward ? (p + 1) % total : (p - 1 + total) % total));
  };

  useLayoutEffect(() => {
    const pendingRequest = pendingFlip.current;
    if (!pendingRequest) return;
    pendingFlip.current = null;

    const { state, forward, incomingId, outgoingId } = pendingRequest;
    const container = containerRef.current;
    if (!container) {
      isAnimating.current = false;
      return;
    }

    const incomingEl = nodeRefs.current.get(incomingId);
    const outgoingEl = nodeRefs.current.get(outgoingId);
    if (incomingEl) gsap.set(incomingEl, { opacity: 0, scale: 0.85 });

    const targets = Array.from(container.querySelectorAll<HTMLElement>('[data-carousel-item]'));

    // `isAnimating` must not clear until every moving part of this
    // transition has actually finished — the Flip position timeline and
    // the separate enter/leave opacity tweens all run concurrently with
    // their own durations, so a single flag can't represent "done"; this
    // counter can. Safety net below guards against any of them stalling.
    let pendingCount = 1; // the Flip timeline itself
    let settled = false;
    const settleAll = () => {
      if (settled) return;
      settled = true;
      clearTimeout(safetyTimer);
      // Force every still-visible card to its correct final visual state
      // regardless of how each individual tween actually got on — this is
      // the one place that's allowed to be a source of truth. A slow
      // device/tab, a background-tab-throttled rAF, or any other reason a
      // tween didn't visually finish in time can no longer leave a card
      // permanently wrong: by the time a transition is considered settled,
      // reality is force-corrected to match.
      const stillVisible = Array.from(
        container.querySelectorAll<HTMLElement>('[data-carousel-item]')
      ).filter((el) => el !== outgoingEl);
      gsap.set(stillVisible, { clearProps: 'transform,opacity' });
      setGhostId(null);
      isAnimating.current = false;
    };
    const settleOne = () => {
      pendingCount -= 1;
      if (pendingCount === 0) settleAll();
    };
    // Safety net: if some sub-tween's onComplete is ever swallowed the
    // counter above would never reach 0 and the carousel would lock up
    // permanently on this card. Force a full settle well past every
    // tween's own duration (longest is 0.65s) so a stall can only ever
    // cost one click, never brick the carousel.
    const safetyTimer = setTimeout(settleAll, 1200);

    Flip.from(state, {
      targets,
      duration: 0.65,
      ease: 'power3.inOut',
      // Only the *leaving* card is pulled out of flow (matches the
      // reference technique) — staying/entering cards never leave normal
      // flex flow, so the row's height never collapses mid-transition and
      // nothing below the carousel jumps.
      absoluteOnLeave: true,
      onComplete: settleOne
      // Deliberately NOT using Flip's own onEnter/onLeave callbacks to
      // drive these tweens: Flip's internal "is this element entering or
      // leaving" classification occasionally misses one under rapid
      // clicking (a GSAP heuristic edge case), which silently skips the
      // callback — leaving that card stranded forever at the opacity:0
      // preset above, since nothing else would ever revisit it. We already
      // know exactly which ids are entering/leaving (computed in `go`
      // above), so driving them directly below is unconditional — it can
      // never depend on Flip guessing correctly.
    });

    if (incomingEl) {
      pendingCount += 1;
      gsap.to(incomingEl, {
        opacity: 1,
        scale: 1,
        duration: 0.55,
        ease: 'power2.out',
        transformOrigin: forward ? 'bottom right' : 'bottom left',
        onComplete: () => {
          gsap.set(incomingEl, { clearProps: 'transform,opacity' });
          settleOne();
        }
      });
    }

    if (outgoingEl) {
      pendingCount += 1;
      gsap.to(outgoingEl, {
        opacity: 0,
        scale: 0.85,
        duration: 0.4,
        ease: 'power2.in',
        transformOrigin: forward ? 'bottom left' : 'bottom right',
        onComplete: settleOne
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pointer]);

  const renderIds = ghostId && !visibleIds.includes(ghostId) ? [...visibleIds, ghostId] : visibleIds;
  const slotBasis = `calc((100% - ${gap * (safeCount - 1)}px) / ${safeCount})`;

  return (
    <div className={className}>
      <div ref={containerRef} className="relative flex overflow-hidden" style={{ gap }}>
        {renderIds.map((id) => {
          const item = items.find((it) => idOf(it) === id);
          if (!item) return null;
          const isHiddenGhost = id === ghostId && !visibleIds.includes(id);
          return (
            <div
              key={id}
              // Deliberately NOT `data-flip-id` — GSAP's Flip plugin reads/
              // writes that exact attribute itself for its own internal
              // element-identity tracking across getState()/from() calls.
              // Reusing it for our own querying overwrote Flip's bookkeeping
              // with our semantic ids, corrupting its element matching and
              // making it apply an "entering" card's treatment to the wrong
              // (already-settled) card on the next transition.
              data-carousel-item={id}
              ref={(el) => {
                if (el) nodeRefs.current.set(id, el);
                else nodeRefs.current.delete(id);
              }}
              style={{
                flex: `0 0 ${slotBasis}`,
                width: slotBasis,
                maxWidth: slotBasis,
                ...(isHiddenGhost ? { display: 'none' } : {})
              }}
            >
              {renderItem(item)}
            </div>
          );
        })}
      </div>

      {canCycle && (
        <div className="flex items-center justify-center gap-4 mt-8 sm:mt-10">
          <button
            type="button"
            onClick={() => go(false)}
            aria-label="Previous"
            className="w-11 h-11 rounded-full border border-[#E6DBC6] hover:border-[#cfa144] bg-white hover:bg-[#cfa144] text-[#1A1D20] hover:text-[#1A1D20] flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => go(true)}
            aria-label="Next"
            className="w-11 h-11 rounded-full border border-[#E6DBC6] hover:border-[#cfa144] bg-white hover:bg-[#cfa144] text-[#1A1D20] hover:text-[#1A1D20] flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
