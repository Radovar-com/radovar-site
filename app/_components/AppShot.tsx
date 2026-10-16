/* A real Codevalanche screenshot, optionally on a contour-line stage, with a dark-theme twin and a closer crop for phones. */
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
  const shot = (file: string, mobile: string | undefined, dark: boolean) => (
    <picture key={file}>
      {mobile ? <source media="(max-width: 760px)" srcSet={`${base}${mobile}`} width={mobileSize?.[0]} height={mobileSize?.[1]} /> : null}
      <img className={dark ? "app-shot__img app-shot__img--dark" : "app-shot__img"} src={`${base}${file}`} alt={alt} width={width} height={height} loading={priority && !dark ? "eager" : "lazy"} decoding="async" fetchPriority={priority && !dark ? "high" : undefined} />
    </picture>
  );
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
