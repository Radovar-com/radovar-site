import "../research.css";

type Series = { name: string; tone: "wave" | "base" | "control" | "muted" };
type Row = { label: string; values: (number | null)[]; tone?: Series["tone"] };
type Marker = { value: number; label: string };

/* Plain HTML bars rather than an image, so the numbers stay readable text,
   follow the light/dark theme and reflow on a phone. Scale is 0–max %. */
export function BarChart({ title, caption, series, rows, markers = [], max = 100 }: {
  title: string;
  caption: string;
  series: Series[];
  rows: Row[];
  markers?: Marker[];
  max?: number;
}) {
  const at = (value: number) => `calc((100% - 3.6em) * ${Math.min(1, value / max)})`;
  return (
    <figure className="chart">
      <figcaption className="chart__title">{title}</figcaption>
      {series.length > 1 ? (
        <ul className="chart__legend" aria-hidden="true">
          {series.map(item => <li key={item.name}><span className={`chart__swatch chart__swatch--${item.tone}`} />{item.name}</li>)}
        </ul>
      ) : null}
      <div className="chart__rows">
        {rows.map(row => (
          <div className="chart__row" key={row.label}>
            <div className="chart__label">{row.label}</div>
            <div className="chart__bars">
              {row.values.map((value, index) => (
                <div className="chart__track" key={series[index].name}>
                  {markers.map(marker => <span key={marker.label} className="chart__marker" style={{ left: at(marker.value) }} aria-hidden="true" />)}
                  {value === null ? (
                    <span className="chart__value chart__value--none">{series.length > 1 ? `${series[index].name}: ` : ""}not run</span>
                  ) : (
                    <>
                      <span className={`chart__bar chart__bar--${row.tone ? (index ? `${row.tone}-soft` : row.tone) : series[index].tone}`} style={{ width: at(value) }} />
                      <span className="chart__value">
                        <span className="visually-hidden">{series.length > 1 ? `${series[index].name}: ` : ""}</span>
                        {value.toFixed(1)}%
                      </span>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="chart__note">
        {markers.map(marker => <span key={marker.label}><span className="chart__key" aria-hidden="true" />{marker.label}. </span>)}
        {caption}
      </p>
    </figure>
  );
}
