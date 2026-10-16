import { SITE_URL } from "../_lib/site-metadata";

type Page = { title: string; description: string; path: string; parent?: { title: string; path: string } };

/* WebPage + BreadcrumbList for one route, tied to the site-wide Organization,
   WebSite and Codevalanche nodes declared once in the root layout. */
export function PageSchema({ title, description, path, parent }: Page) {
  const url = new URL(path, SITE_URL).href;
  const home = `${SITE_URL}/`;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: path === "/" ? "Radovar" : title,
        description,
        inLanguage: "en",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        publisher: { "@id": `${SITE_URL}/#organization` },
        ...(path === "/codevalanche/" ? { about: { "@id": `${SITE_URL}/#codevalanche` } } : {}),
        ...(path === "/" ? {} : { breadcrumb: { "@id": `${url}#breadcrumb` } }),
      },
      ...(path === "/"
        ? []
        : [
            {
              "@type": "BreadcrumbList",
              "@id": `${url}#breadcrumb`,
              itemListElement: [
                ...[{ name: "Radovar", item: home }, ...(parent ? [{ name: parent.title, item: new URL(parent.path, SITE_URL).href }] : []), { name: title, item: url }]
                  .map((crumb, index) => ({ "@type": "ListItem", position: index + 1, ...crumb })),
              ],
            },
          ]),
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />;
}
