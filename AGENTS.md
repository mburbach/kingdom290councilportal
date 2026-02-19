# Repository Guidelines

## Project Structure & Module Organization
- `src/` holds the landing page (`index.html`), a `styles/` folder for Tailwind or vanilla CSS, and a `scripts/` folder for small TypeScript helpers that populate kingdom links.
- `public/` stores exported crest graphics, background textures, and any downloadable PDFs. Keep file names kebab-cased, e.g., `royal-banner.png`.
- Shared data (link targets, ROE copy) belongs in `config/` as JSON so content changes do not require layout edits. Mirror file names between `config/` and the components that consume them.
- Tests live in `tests/` and mirror the `src/` tree so every UI section (ROE, calculators, link lists) has a matching suite.

## Build, Test, and Development Commands
- `npm install` — install frontend dependencies (Vite, Tailwind, Vitest).
- `npm run dev` — start the hot-reload dev server at `http://localhost:5173` for rapid visual checks.
- `npm run build` — produce the static bundle in `dist/`; run before opening a pull request to catch type and lint errors.
- `npm run preview` — serve the built assets for a production-like smoke test.
- `npm test` — execute the Vitest suite headlessly; add `--runInBand` on CI runners with limited resources.

## Coding Style & Naming Conventions
- Use TypeScript modules and 2-space indentation; always enable `strict` mode in `tsconfig.json`.
- Prefer semantic class names (`kingdom-hero`, `council-panel`) and CSS custom properties for the royal palette. Keep text styles in `styles/typography.css`.
- Components export PascalCase (`RoyalHeader.tsx`), utilities use camelCase, and static JSON keys remain snake_case to match in-game identifiers.
- Run `npm run lint` (ESLint + Stylelint) before committing; fix warnings rather than silencing them.

## Testing Guidelines
- Snapshot only stable sections (hero banner, navigation). Dynamic lists should use assertion-based tests via Testing Library queries.
- Name files `FeatureName.spec.ts` and colocate mocks in `__mocks__` folders.
- Maintain 90% branch coverage; check with `npm run test -- --coverage` and fail the build if the threshold drops.

## Commit & Pull Request Guidelines
- Follow Conventional Commits (`feat: add loss calculator hero`, `fix: correct ROE placeholder`). Keep subject lines under 72 characters.
- Every PR needs: a concise summary, screenshots (mobile + desktop), linked issue numbers, and deployment notes (commands run, blockers).
- Rebase before submitting, ensure `dist/` matches the latest build, and request at least one review from another kingdom agent.
