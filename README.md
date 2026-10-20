# radovar.com

The source of [radovar.com](https://radovar.com), the website of Radovar.

Radovar makes [Codevalanche](https://codevalanche.com), a Windows desktop app that runs Claude Code, Codex and local models in one place. Product information, downloads and the changelog live on codevalanche.com.

## Build

The site is built with Next.js and exported as static files.

```
npm ci
npm run dev        # local preview at http://localhost:3000
npm run build      # writes out/
```

`BASE_PATH` prefixes every link and asset when the site is served from a subpath. Leave it unset for the custom domain.

Every push to `main` is built and published to GitHub Pages by `.github/workflows/deploy.yml`. Changes reach `main` through reviewed pull requests.

## Structure

- `app/page.tsx` – home
- `app/{company,docs,security,privacy,terms,press,research}/` – content pages
- `app/_components/` – shared header, footer and page shell

## Contact

- Security reports: [security@radovar.com](mailto:security@radovar.com)
- Press: [press@radovar.com](mailto:press@radovar.com)
- Everything else: [info@radovar.com](mailto:info@radovar.com)
- X: [@radovarcom](https://x.com/radovarcom)
