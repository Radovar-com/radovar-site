/* A real Codevalanche screenshot, optionally on a contour-line stage, with a dark-theme twin and a closer crop for phones. */
import responsiveShotManifest from "../../public/media/codevalanche/responsive-shots.json";

const responsiveShots: Record<string, { width: number; height: number; candidates: { src: string; width: number }[] } | undefined> = responsiveShotManifest;

type AppShotProps = {
  src: string;
  alt: string;
  darkSrc?: string;
  mobileSrc?: string;
  mobileDarkSrc?: string;
  mobileSize?: [number, number];
  width?: number;
  height?: number;
  caption?: string;
  stage?: boolean;
  priority?: boolean;
  className?: string;
};

/* Contour lines, the same terrain as the footer landscape. */
export function Terrain() {
  return (
    <svg className="app-shot__terrain" viewBox="0 0 1200 520" preserveAspectRatio="none" aria-hidden="true">
      {Array.from({ length: 9 }, (_, i) => (
        <path key={i} d={`M0 ${150 + i * 42} C 180 ${90 + i * 40}, 300 ${230 + i * 34}, 520 ${150 + i * 38} S 860 ${60 + i * 46}, 1200 ${130 + i * 40}`} />
      ))}
    </svg>
  );
}

export function AppShot({ src, alt, darkSrc, mobileSrc, mobileDarkSrc, mobileSize, width = 2000, height = 1250, caption, stage = false, priority = false, className }: AppShotProps) {
  const base = process.env.BASE_PATH || "";
  const classes = ["app-shot", stage && "app-shot--stage", darkSrc && "app-shot--themed", className].filter(Boolean).join(" ");
  // Match the shell gutter and the existing stage/feature/explorer mobile insets.
  const mobileSizes = stage
    ? "calc(100vw - clamp(44px, 9vw, 152px) - clamp(28px, 8.4vw, 128px) - 2px)"
    : className?.split(/\s+/).includes("feature__visual")
      ? "calc(100vw - clamp(44px, 9vw, 152px) - clamp(52px, 8vw, 128px) - 2px)"
      : "(max-width: 360px) calc(100vw - 78px), calc(100vw - clamp(44px, 9vw, 152px) - clamp(52px, 7vw, 104px) - 2px)";
  const shot = (file: string, mobile: string | undefined, dark: boolean) => {
    const mobileFile = mobile || (responsiveShots[file] ? file : undefined);
    const crop = mobileFile ? responsiveShots[mobileFile] : undefined;
    const desktop = responsiveShots[file];
    const desktopSizes = stage ? "(max-width: 1440px) 82vw, 1180px"
      : className?.split(/\s+/).includes("feature__visual")
        ? "(max-width: 1100px) calc(100vw - clamp(44px, 9vw, 152px) - clamp(52px, 8vw, 128px) - 2px), (max-width: 1440px) 48vw, 680px"
        : "(max-width: 760px) 88vw, (max-width: 1440px) 48vw, 680px";
    return (
      <picture key={file}>
        {mobileFile ? <source media="(max-width: 760px)" srcSet={crop ? crop.candidates.map(candidate => `${base}${candidate.src} ${candidate.width}w`).join(", ") : `${base}${mobileFile}`} sizes={crop ? mobileSizes : undefined} width={crop?.width ?? mobileSize?.[0]} height={crop?.height ?? mobileSize?.[1]} /> : null}
        <img className={dark ? "app-shot__img app-shot__img--dark" : "app-shot__img"} src={`${base}${file}`} srcSet={desktop?.candidates.map(candidate => `${base}${candidate.src} ${candidate.width}w`).join(", ")} sizes={desktop ? desktopSizes : undefined} alt={alt} width={width} height={height} loading={priority && !dark ? "eager" : "lazy"} decoding="async" fetchPriority={priority && !dark ? "high" : undefined} />
      </picture>
    );
  };
  return (
    <figure className={classes}>
      {stage ? <Terrain /> : null}
      <div className="app-shot__window">
        {shot(src, mobileSrc, false)}
        {darkSrc ? shot(darkSrc, mobileDarkSrc, true) : null}
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
