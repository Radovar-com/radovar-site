# radovar.com

The Radovar company website. Next.js App Router, exported as a fully static
site and served by GitHub Pages.

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

## Structure

- `app/page.tsx` - home
- `app/{docs,security,privacy,terms,press,releases,changelog}/` - content pages
- `app/_components/` - shared header, footer, long-form page shell
- `app/globals.css` - the whole design system, in one file
