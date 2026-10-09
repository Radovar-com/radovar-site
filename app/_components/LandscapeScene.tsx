"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const gardenPath = "M 1308 598 C 1337 606 1368 614 1409 623";

function GardenWalkers() {
  return (
    <svg className="landscape-scene__walkers" viewBox="0 0 1672 941" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {[{ duration: "44s", begin: "-15s", reverse: false }, { duration: "58s", begin: "-9s", reverse: true }].map((walker, index) => (
        <g key={index} opacity="0">
          <animateMotion path={walker.reverse ? "M 1409 625 C 1368 616 1337 608 1308 600" : gardenPath} dur={walker.duration} begin={walker.begin} repeatCount="indefinite" rotate="0" />
          <animate attributeName="opacity" values="0;0.85;0.85;0" keyTimes="0;0.08;0.92;1" dur={walker.duration} begin={walker.begin} repeatCount="indefinite" />
          <g>
            <animateTransform attributeName="transform" type="scale" values={"0.7;0.7"} dur={walker.duration} begin={walker.begin} repeatCount="indefinite" />
            <circle cx="0" cy="-11" r="1.55" fill="currentColor" />
            <path d="M -1.5 -9 L 1.5 -9 L 2 -4.2 L -1.5 -4.2 Z" fill="currentColor" />
            <g stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" fill="none">
              <path d="M 0 -4.5 L -2 0"><animateTransform attributeName="transform" type="rotate" values="-17 0 -4.5;17 0 -4.5;-17 0 -4.5" dur="1.6s" repeatCount="indefinite" /></path>
              <path d="M 0 -4.5 L 2 0"><animateTransform attributeName="transform" type="rotate" values="17 0 -4.5;-17 0 -4.5;17 0 -4.5" dur="1.6s" repeatCount="indefinite" /></path>
              <path d="M -1.3 -8 L -3 -4.5 M 1.3 -8 L 3 -5" />
            </g>
          </g>
        </g>
      ))}
    </svg>
  );
}

function SkyBirds() {
  const birds = [
    { path: "M -40 354 C 390 260 940 325 1715 280", duration: "34s", begin: "-13s", scale: 0.8, wing: "1.4s" },
    { path: "M -55 386 C 410 286 975 346 1730 311", duration: "34s", begin: "-12s", scale: 0.63, wing: "1.7s" },
    { path: "M 1720 225 C 1090 155 610 220 -45 265", duration: "47s", begin: "-31s", scale: 0.5, wing: "1.5s" },
  ];
  return (
    <svg className="landscape-scene__birds" viewBox="0 0 1672 941" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {birds.map((bird, index) => <g key={index} opacity="0"><animateMotion path={bird.path} dur={bird.duration} begin={bird.begin} repeatCount="indefinite" rotate="0" /><animate attributeName="opacity" values="0;0.55;0.55;0" keyTimes="0;0.08;0.92;1" dur={bird.duration} begin={bird.begin} repeatCount="indefinite" /><g transform={`scale(${bird.scale})`}><path d="M -9 -2 Q -4 -5 0 0 Q 4 -5 9 -2" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round"><animate attributeName="d" values="M -9 -2 Q -4 -5 0 0 Q 4 -5 9 -2;M -8 4 Q -3 2 0 0 Q 3 2 8 4;M -9 -2 Q -4 -5 0 0 Q 4 -5 9 -2" dur={bird.wing} repeatCount="indefinite" /></path></g></g>)}
    </svg>
  );
}

export function LandscapeScene({ variant, priority = false }: { variant: "hero" | "footer"; priority?: boolean }) {
  const scene = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [motionAllowed, setMotionAllowed] = useState(false);
  const playing = motionAllowed && visible;

  useEffect(() => {
    scene.current?.querySelectorAll<SVGSVGElement>("svg").forEach((svg) => {
      if (playing) svg.unpauseAnimations();
      else svg.pauseAnimations();
    });
  }, [playing]);

  useEffect(() => {
    const element = scene.current;
    if (!element) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setMotionAllowed(!media.matches && !document.hidden);
    syncPreference();
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.05 });
    observer.observe(element);
    media.addEventListener("change", syncPreference);
    document.addEventListener("visibilitychange", syncPreference);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", syncPreference);
      document.removeEventListener("visibilitychange", syncPreference);
    };
  }, []);

  return (
    <div ref={scene} className={`landscape-scene landscape-scene--${variant}`} data-playing={playing}>
      <div className="landscape-scene__art" aria-hidden="true">
        <Image src={`${process.env.BASE_PATH || ""}/media/radovar-atelier-pine-v3.webp`} alt="" fill sizes="100vw" priority={priority} />
        <GardenWalkers />
        <SkyBirds />
      </div>
      <div className="landscape-scene__mist landscape-scene__mist--distant" aria-hidden="true"><Image src={`${process.env.BASE_PATH || ""}/media/radovar-valley-mist-v1.webp`} alt="" fill sizes="100vw" /></div>
      <div className="landscape-scene__mist" aria-hidden="true"><Image src={`${process.env.BASE_PATH || ""}/media/radovar-valley-mist-v1.webp`} alt="" fill sizes="100vw" /></div>
      <div className="landscape-scene__veil" aria-hidden="true" />
    </div>
  );
}
