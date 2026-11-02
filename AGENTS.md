# janesterlis.com

Jan Esterlis's vintage-guitar site, rebuilt with Astro and deployed to Cloudflare Pages. Tooling follows `~/projects/typescript-template`: mise for tool versions, pnpm, Vite+ (`vp`) for lint and unit tests, [oxfmt-next-line](https://www.npmjs.com/package/oxfmt-next-line) for formatting, and `just` recipes.

## Commands

- `just dev` starts the Astro dev server.
- `just format` formats with oxfmt-next-line. `just check` lints and type-checks. `just typecheck` runs `astro check`.
- `just test` runs Vitest unit tests in `tests/unit/`.
- `just test-e2e` builds, previews, and runs Playwright tests in `tests/e2e/` on desktop and mobile viewports.
- `just verify` runs everything.

## Formatting

Formatting uses [oxfmt-next-line](https://www.npmjs.com/package/oxfmt-next-line), a fork of oxfmt that puts opening braces on their own line. mise installs it, and it reads `.oxfmtrc.json`. Run `just format` or `oxfmt-next-line`, not `vp fmt`: Vite+'s bundled oxfmt does not support next-line braces, so `vite.config.ts` has no `fmt` block and sets `check.fmt: false`, which makes `vp check` lint and type-check without formatting. The pre-commit `oxfmt` hook enforces formatting in CI.

## Content

All site content lives in `src/content/` as Markdown or YAML, validated by the schemas in `src/content.config.ts`. Images live in `src/assets/` and are referenced by relative path from frontmatter. Audio lives in `public/audio/`.

Jan edits content through Sveltia CMS at `/admin` (`public/admin/config.yml`); keep its fields in sync with `src/content.config.ts` (`tests/unit/cms-config.test.ts` enforces this for existing entries). To add content by hand, add a file to the matching collection. See `docs/adding-content.md`. YouTube videos load from the channel feed at build time (`src/lib/youtube.ts`); `.github/workflows/refresh-videos.yml` checks hourly and triggers a Cloudflare Pages deploy hook when a new upload is missing from the live site.

## Astro

Consult the [Astro docs](https://docs.astro.build) before working on routing, content collections, or images. Astro reads `astro.config.mjs`; `vite.config.ts` only configures Vite+ lint and tasks.
