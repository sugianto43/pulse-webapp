# Pulse Web — Engineering Conventions

Monorepo: `backend/` (FastAPI, wraps `Pulse-CLI/` core logic), `frontend/` (Next.js App Router), `Pulse-CLI/` (vendored upstream, gitignored — separate repo/history, don't assume it's tracked here).

These conventions are mandatory for all code generated in this repo, not just the files that prompted this doc.

## Frontend structure — feature-based (bulletproof-react style)

```
frontend/src/
├── app/                    # routing ONLY — pages/layouts compose features, no business logic
│   ├── layout.tsx
│   ├── providers.tsx       # QueryClientProvider etc.
│   └── <route>/page.tsx
├── features/<domain>/      # one folder per domain (analyze, screener, trading-plan, ...)
│   ├── api.ts               # fetch functions for this domain's endpoints only
│   ├── types.ts              # types for this domain's API shapes
│   ├── hooks/                 # see "TanStack Query hooks" below
│   └── components/            # components used only by this domain
├── components/              # cross-feature shared components ONLY (e.g. SearchBox)
└── lib/
    └── api-client.ts        # shared apiFetch<T>() + ApiError — the only fetch primitive
```

HTTP client is **axios** (`lib/api-client.ts` wraps it), not native `fetch` — new feature `api.ts` files call `apiFetch<T>()`, never `axios`/`fetch` directly.

Code style is enforced by **Prettier** (`frontend/.prettierrc.json`, includes `prettier-plugin-tailwindcss` for class sorting) — run `npm run format` before committing, `npm run format:check` in CI. ESLint's stylistic rules are disabled via `eslint-config-prettier` so the two never disagree.

Rules:
- A component/hook/type used by exactly one feature lives inside that feature's folder. It moves to root `components/`/`lib/` only once a second feature needs it — don't pre-emptively share.
- `app/*/page.tsx` files stay thin: import from `features/`, compose, no fetch logic or business rules inline.
- Within a feature, use relative imports (`../types`, `../api`). Across features/shared code, use the `@/` absolute alias.

## TanStack Query — hooks, not inline calls

Every `useQuery`/`useMutation` call lives in a dedicated hook under `features/<domain>/hooks/`, never inline in a component. Two layers:

1. **Granular hooks** — one per query/mutation, named `use<Thing>Query` / `use<Thing>Mutation`. Own a query-key factory (exported `const xKeys = {...}`) so keys aren't hand-typed in multiple places.
2. **Composing hook** — one per page/feature (e.g. `useScreener`, `useTradingPlan`), wires the granular hooks together with local UI state (form inputs, derived error messages). Pages call only the composing hook.

Example (`features/screener/`): `useScreenPresetsQuery.ts` + `useScreenMutation.ts` (granular) → `useScreener.ts` (composing, used by `app/screen/page.tsx`).

Don't collapse these into one hook per feature — splitting query/mutation from page-state keeps each hook single-purpose and makes the query logic reusable if a second page ever needs the same data.

## Backend structure

```
backend/app/
├── main.py           # app wiring only: lifespan, CORS, router registration
├── settings.py       # env-var config, read once
├── cache.py          # generic bounded TTLCache
├── serializers.py    # generic response sanitizers (e.g. clean_nan_deep)
└── routers/<domain>.py   # one router per domain, thin — validate input, call Pulse-CLI core, serialize
```

Rules:
- Routers call into `Pulse-CLI/pulse/core/` for actual logic — never reimplement analysis/screening/planning logic in the FastAPI layer.
- New response fields with arithmetic derived from external data (yfinance/pandas) must pass through `clean_nan_deep` before returning — NaN has broken JSON serialization here before.
- Reusable cross-router utilities (cache, serialization, config) go in their own module, not duplicated per router.

## General bar (applies everywhere)

- SOLID/DRY: no god-files, no copy-pasted fetch/error-handling boilerplate, no component mixing state+fetching+presentation.
- No premature abstraction: don't create a shared module until a second consumer actually needs it.
- Validate at system boundaries (query params, external API responses); trust internal code otherwise.
- Every new endpoint/hook gets the same error-handling shape already established (`ApiError` + `detail` message from backend `HTTPException`) — don't invent a new pattern.
