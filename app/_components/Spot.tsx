import type { ReactNode } from "react";

/* Line-drawn spot illustrations for cards. Decorative: always hidden from assistive technology. The part marked spot__m moves on hover (motion.css). */
export type SpotName = "summit" | "cloud" | "device" | "review" | "paths" | "parallel" | "shield" | "book" | "archive" | "news" | "compass" | "voice";

const art: Record<SpotName, ReactNode> = {
  summit: <>
    <circle cx="118" cy="40" r="12" className="spot__fill spot__m" />
    <path d="M6 120 L36 84 L50 96 L72 66 L96 92 L116 76 L154 120 Z" className="spot__fill" />
    <path d="M26 128 L72 50 L88 74 L100 62 L140 128 Z" className="spot__paper" />
    <path d="M72 50 L62 68 L70 64 L76 72 L82 64 L88 74 M100 62 L94 72 L100 70 L106 76" />
    <path d="M80 66 L68 126 M86 76 L78 126 M92 80 L88 126 M106 78 L104 126 M114 90 L114 126" className="spot__hair" />
    <path d="M12 136 C40 130 62 142 92 136 S134 130 150 136 M30 146 C54 142 74 150 98 146 S128 142 140 146" />
  </>,
  cloud: <>
    <g className="spot__m">
      <path d="M44 108 H118 C134 108 144 96 144 84 C144 70 132 60 118 62 C114 46 100 36 84 38 C68 40 58 52 56 64 C40 62 28 74 30 88 C32 100 40 108 44 108 Z" className="spot__paper" />
      <circle cx="66" cy="84" r="5" className="spot__ink" /><circle cx="88" cy="74" r="5" className="spot__ink" /><circle cx="110" cy="86" r="5" className="spot__ink" />
      <path d="M70 82 L84 76 M92 76 L106 84" />
    </g>
    <path d="M80 108 V134 M80 134 H58 M80 134 H102" />
  </>,
  device: <>
    <rect x="26" y="38" width="108" height="74" rx="6" className="spot__paper" />
    <path d="M18 124 H142 L134 112 H26 Z" className="spot__fill" />
    <rect x="62" y="58" width="36" height="34" rx="3" />
    <path d="M70 58 V50 M80 58 V50 M90 58 V50 M70 92 V100 M80 92 V100 M90 92 V100 M62 68 H54 M62 82 H54 M98 68 H106 M98 82 H106" />
    <circle cx="80" cy="75" r="6" className="spot__ink spot__m" />
  </>,
  review: <>
    <rect x="34" y="24" width="80" height="108" rx="5" className="spot__paper" />
    <path d="M48 46 H98 M48 60 H86" />
    <path d="M48 76 H100" className="spot__add" /><path d="M48 88 H92" className="spot__add" /><path d="M48 100 H78" className="spot__del" />
    <g className="spot__m">
      <circle cx="116" cy="114" r="22" className="spot__fill" />
      <path d="M105 114 L113 122 L128 106" className="spot__thick" />
    </g>
  </>,
  paths: <>
    <path d="M80 140 V96 C80 76 52 72 44 50 M80 96 C80 76 108 72 116 50" className="spot__thick" />
    <circle cx="44" cy="40" r="14" className="spot__paper" /><path d="M38 40 H50 M44 34 V46" />
    <g className="spot__m"><circle cx="116" cy="40" r="14" className="spot__fill" /><rect x="109" y="34" width="14" height="12" rx="2" /></g>
    <circle cx="80" cy="140" r="6" className="spot__ink" />
  </>,
  parallel: <>
    <rect x="22" y="34" width="116" height="24" rx="12" className="spot__paper" />
    <rect x="22" y="102" width="116" height="24" rx="12" className="spot__paper" />
    <circle cx="38" cy="46" r="5" className="spot__ink" /><circle cx="38" cy="114" r="5" className="spot__ink" />
    <path d="M52 46 H96 M52 114 H86" />
    <g className="spot__m"><rect x="22" y="68" width="116" height="24" rx="12" className="spot__fill" /><circle cx="38" cy="80" r="5" /><path d="M52 80 H110" /></g>
  </>,
  shield: <>
    <path d="M80 22 L130 40 V78 C130 110 108 130 80 140 C52 130 30 110 30 78 V40 Z" className="spot__paper" />
    <path d="M80 36 L116 50 V78 C116 102 100 118 80 126 Z" className="spot__fill" />
    <rect x="64" y="72" width="32" height="26" rx="3" className="spot__paper" />
    <path d="M70 72 V64 C70 52 90 52 90 64 V72" className="spot__m" />
    <circle cx="80" cy="84" r="3" className="spot__ink" />
  </>,
  book: <>
    <path d="M80 44 C64 34 40 32 22 36 V120 C40 116 64 118 80 128 Z" className="spot__paper" />
    <path d="M36 54 C48 52 60 54 68 58 M36 70 C48 68 60 70 68 74 M36 86 C48 84 60 86 68 90" />
    <g className="spot__m">
      <path d="M80 44 C96 34 120 32 138 36 V120 C120 116 96 118 80 128 Z" className="spot__fill" />
      <path d="M92 58 C100 54 112 52 124 54 M92 74 C100 70 112 68 124 70" />
    </g>
  </>,
  archive: <>
    <rect x="30" y="92" width="100" height="36" rx="4" className="spot__paper" />
    <rect x="42" y="24" width="76" height="36" rx="4" className="spot__paper" />
    <path d="M70 110 H90 M72 42 H88" className="spot__thick" />
    <g className="spot__m"><rect x="36" y="58" width="88" height="36" rx="4" className="spot__fill" /><path d="M74 76 H86" className="spot__thick" /></g>
  </>,
  news: <>
    <rect x="22" y="30" width="104" height="100" rx="5" className="spot__paper" />
    <path d="M126 54 H138 V120 C138 126 132 130 126 130" />
    <rect x="36" y="44" width="40" height="32" rx="2" className="spot__fill spot__m" />
    <path d="M86 46 H112 M86 58 H112 M86 70 H104 M36 90 H112 M36 102 H112 M36 114 H92" />
  </>,
  compass: <>
    <circle cx="80" cy="80" r="56" className="spot__paper" />
    <circle cx="80" cy="80" r="42" />
    <g className="spot__m">
      <path d="M80 40 L92 80 L80 120 L68 80 Z" className="spot__fill" />
      <path d="M80 40 L92 80 H68 Z" className="spot__ink" />
      <circle cx="80" cy="80" r="4" className="spot__paper" />
    </g>
  </>,
  voice: <>
    <path d="M26 40 H118 C124 40 128 44 128 50 V96 C128 102 124 106 118 106 H64 L42 124 V106 H36 C30 106 26 102 26 96 Z" className="spot__paper" />
    <path d="M60 74 L72 86 L98 60" className="spot__thick" />
    <circle cx="128" cy="40" r="14" className="spot__fill spot__m" />
  </>,
};

export function Spot({ name, tone = "sage" }: { name: SpotName; tone?: "sage" | "mist" | "sand" | "clay" | "ink" }) {
  return (
    <div className={`spot spot--${tone}`} data-spot={name} aria-hidden="true">
      <svg viewBox="0 0 160 160" focusable="false">{art[name]}</svg>
    </div>
  );
}
