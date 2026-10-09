# radovar.com

The Radovar company website. Next.js App Router, exported as a fully static
site and served by GitHub Pages. Codevalanche is Radovar’s principal product;
its product website is [codevalanche.com](https://codevalanche.com).

## Local development

```
npm install
npm run dev
```

## Build

```
npm run build      # writes out/
```

`BASE_PATH` prefixes every link and asset when the site is served from a
subpath. Leave it unset for the custom domain; set it to `/radovar-site` when
serving from the GitHub Pages project URL. In CI it is read from the repository
variable of the same name.

## Deployment

Every push to `main` triggers `.github/workflows/deploy.yml`, which builds the
static export and publishes it to GitHub Pages. There is no manual deploy step.

## Local review

Run `npm run dev` and open [localhost:3000](http://localhost:3000). Review the
home page and content pages at desktop and mobile widths, switch between light
and dark themes, and check navigation and product links. The release and changelog
pages preserve selected early-access history; current product information lives
on Codevalanche’s website.

Before shipping a change, run `npm run typecheck` and `npm run build` to check
the source and static export.

## Structure

- `app/page.tsx` - home
- `app/{docs,security,privacy,terms,press,releases,changelog}/` - content pages
- `app/_components/` - shared header, footer, long-form page shell
- `app/globals.css` - shared styles, theme tokens, and content-page layouts
- `app/home.css` - home-page layout and product presentation
- `app/landscape.css` - pine-green palette and shared illustrated scenery
- `app/content.css` - reading layouts and details for supporting pages
