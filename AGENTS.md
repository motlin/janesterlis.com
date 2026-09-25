# janesterlis.com

Jan Esterlis's vintage-guitar site, rebuilt with Astro and deployed to Cloudflare Pages. Tooling follows `~/projects/typescript-template`: mise for tool versions, pnpm, Vite+ (`vp`) for format, lint, and unit tests, and `just` recipes.

## Commands

- `just dev` starts the Astro dev server.
- `just check` formats, lints, and type-checks. `just typecheck` runs `astro check`.
- `just test` runs Vitest unit tests in `tests/unit/`.
- `just test-e2e` builds, previews, and runs Playwright tests in `tests/e2e/` on desktop and mobile viewports.
- `just verify` runs everything.

## Content

All site content lives in `src/content/` as Markdown or YAML, validated by the schemas in `src/content.config.ts`. Images live in `src/assets/` and are referenced by relative path from frontmatter. Audio lives in `public/audio/`.

To add content, add a file to the matching collection. See `docs/adding-content.md`. YouTube videos load from the channel feed at build time (`src/lib/youtube.ts`); `.github/workflows/refresh-videos.yml` rebuilds daily.

## Astro

Consult the [Astro docs](https://docs.astro.build) before working on routing, content collections, or images. Astro reads `astro.config.mjs`; `vite.config.ts` only configures Vite+ fmt, lint, and tasks.
