import type { CSSProperties } from "react";
import { radovarBrandPaths as paths, radovarCompactTransforms, radovarArcMorph } from "./radovar-brand-paths";

const letters = [
  { glyph: "a", retreat: -70 },
  { glyph: "d", retreat: -256 },
  { glyph: "o", retreat: -414 },
  { glyph: "v", retreat: -589 },
  { glyph: "a2", retreat: -774 },
  { glyph: "r2", retreat: -962 },
] as const;

/** Original letterforms. The signature arc becomes the compact R's finishing stroke. */
export function RadovarBrand() {
  return (
    <svg className="header-brand__art" viewBox="0 0 1184 230" width="1184" height="230" fill="currentColor" aria-hidden="true" focusable="false">
      <path className="header-brand__arc" d={paths.arc} style={{
        "--compact-transform": radovarCompactTransforms.arc,
        "--arc-expanded": `path("${radovarArcMorph.expanded}")`,
        "--arc-compact": `path("${radovarArcMorph.compact}")`,
      } as CSSProperties} />
      <path className="header-brand__arc-fallback" d={radovarArcMorph.compact} />
      {letters.map(({ glyph, retreat }, index) => (
        <path key={glyph} className="header-brand__letter" fillRule="evenodd" clipRule="evenodd" d={paths[glyph]} style={{
          "--retreat": `${retreat}px`,
          "--collapse-delay": `${(letters.length - index - 1) * 14}ms`,
          "--reveal-delay": `${index * 14}ms`,
        } as CSSProperties} />
      ))}
      <path className="header-brand__initial" fillRule="evenodd" clipRule="evenodd" d={paths.r} style={{ "--compact-transform": radovarCompactTransforms.initial } as CSSProperties} />
    </svg>
  );
}
