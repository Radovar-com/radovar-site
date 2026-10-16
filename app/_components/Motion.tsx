"use client";

import { usePathname } from "next/navigation";
import { useEffect, type CSSProperties } from "react";

/* Elements that rise into place the first time they scroll into view. */
const revealTargets = [
  ".band__head", ".statement", ".statement-follow", ".company-actions", ".feature > *", ".how-heading", ".product-explorer",
  ".cards > *", ".closing", ".timeline > li", ".principles > article", ".contacts > a", ".intro-story li", ".runtime-choice > *",
  ".reader-questions", ".facts > *", ".news-list > a",
].join(", ");

/* Panels whose contour lines drift slowly while they are on screen. */
const loopTargets = ".intro-story, .app-shot--stage";

/*
 * One observer for the whole page. It only marks elements as in view; CSS does the motion.
 * Nothing moves for reduced motion, and looping motion pauses as soon as it leaves the screen.
 */
export function MotionObserver() {
  const pathname = usePathname();
  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches || !("IntersectionObserver" in window)) return;
    const fold = window.innerHeight;
    const elements: HTMLElement[] = [];
    document.querySelectorAll<HTMLElement>(loopTargets).forEach((element) => { element.dataset.motion = "loop"; });
    document.querySelectorAll<HTMLElement>(revealTargets).forEach((element) => {
      if (element.closest(".introduction") && !element.closest(".intro-story")) return;
      if (!element.dataset.motion) element.dataset.motion = "reveal";
      const siblings = element.parentElement ? [...element.parentElement.children].filter((child) => child.matches(revealTargets)) : [];
      element.style.setProperty("--motion-i", String(Math.min(Math.max(siblings.indexOf(element), 0), 5)));
      if (element.getBoundingClientRect().top < fold * 0.92) element.setAttribute("data-inview", "");
    });
    document.querySelectorAll<HTMLElement>("[data-motion]").forEach((element) => elements.push(element));
    root.classList.add("motion");
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const element = entry.target as HTMLElement;
        const kind = element.dataset.motion;
        if (kind === "loop") { element.toggleAttribute("data-inview", entry.isIntersecting); continue; }
        if (entry.isIntersecting && entry.intersectionRatio >= (kind === "flight" ? 0.35 : 0)) {
          element.setAttribute("data-inview", "");
          observer.unobserve(element);
        }
      }
    }, { rootMargin: "0px 0px -8% 0px", threshold: [0, 0.35] });
    elements.forEach((element) => { if (element.dataset.motion === "loop" || !element.hasAttribute("data-inview")) observer.observe(element); });
    const stop = () => {
      if (!media.matches) return;
      observer.disconnect();
      root.classList.remove("motion");
    };
    media.addEventListener("change", stop);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", stop);
    };
  }, [pathname]);
  return null;
}

const flock = [
  { y: "30%", size: 1, duration: 12, delay: 0.4, wing: 0.95 },
  { y: "38%", size: 0.76, duration: 13.5, delay: 0.9, wing: 1.1 },
  { y: "24%", size: 0.6, duration: 15, delay: 1.6, wing: 1.25 },
];

/* A few birds from the footer landscape crossing the empty side of a section once, the first time it comes into view. */
export function Flight({ tone = "ink", lane = "side" }: { tone?: "ink" | "light"; lane?: "side" | "hero" }) {
  return (
    <div className={`flight flight--${tone} flight--${lane}`} data-motion="flight" aria-hidden="true">
      {flock.map((bird, index) => (
        <svg key={index} className="flight__bird" viewBox="0 0 24 16" focusable="false" style={{ "--y": bird.y, "--size": bird.size, "--duration": `${bird.duration}s`, "--delay": `${bird.delay}s`, "--wing": `${bird.wing}s`, "--flaps": Math.round(bird.duration / bird.wing) } as CSSProperties}>
          <path className="flight__wing flight__wing--left" d="M3 6 Q8 3 12 8" />
          <path className="flight__wing flight__wing--right" d="M12 8 Q16 3 21 6" />
        </svg>
      ))}
    </div>
  );
}
