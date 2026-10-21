# Eatzy web agent guide

This is the five-app Next.js web repository. Deliver the user's requested change,
preserving existing product behavior and work in progress. Explain results in
Vietnamese unless the user chooses another language.

## Read only the context you need

- Start with `package.json`, the affected app's route and feature, then its shared
  API/types/UI dependencies. See `docs/agent/architecture.md` for the source map.
- `docs/agent/workflows.md` explains commands and example requests for the owner.
- For the React Native migration, read `docs/agent/native-parity.md`. The sibling
  `eatzy_mobile` is a separate product repository; do not import Next/DOM code into it.
- Skills live in `.agents/skills`: `eatzy-web-change`, `eatzy-web-debug`,
  `eatzy-web-review`. Select by the actual task; no fixed team size is required.

## Repository and runtime

- pnpm workspaces + Turborepo: `apps/*`, `packages/*`; use pnpm and its lockfile.
- `packageManager` pins pnpm 9.0.0. Use the Node version selected by the owner;
  check local tooling before installing or switching global runtimes.
- Next.js 14 App Router + React 18. Domain code lives under each app's `src/features`.
- Apps/ports: customer 3000, driver 3001, restaurant 3002, super-admin 3003, admin 3004.
- `pnpm dev` starts all apps; `pnpm --filter customer dev` starts one.
- Check existing listeners/sessions before starting another development server.
  Keep the owner's running servers and Docker stack available.

## Where changes belong

- Routes/layout composition: `apps/<role>/src/app`; feature hooks/components/API:
  `apps/<role>/src/features/<domain>`; reusable primitives: `packages/ui/src`.
- Shared transport/endpoints/mappers: `packages/api/src`; wire DTOs:
  `packages/types/src`. Inspect the caller before changing a response envelope.
- `packages/models` contains additional presentation models, not the complete
  authoritative backend schema. Numeric API IDs and string display IDs coexist.
- Reuse existing tokens in `packages/ui/src/tokens` and established role layouts.
  Keep loading, empty, failure, disabled and narrow-screen behavior in UI changes.
- Cart queries are backend-backed. The Zustand cart also carries active restaurant
  state; do not replace server cart semantics with its legacy local item array.
- Some routes/forms are demos or partial implementations. Trace submit handlers
  and API calls before describing a feature as integrated or copying it to mobile.

## Contracts that need care

- `packages/api/src/http.ts` uses `/api/proxy`; Next rewrites supply the gateway.
  Dev defaults to `http://127.0.0.1:8080`; `BACKEND_URL` can override it.
- `NEXT_PUBLIC_WS_URL` supplies the browser socket endpoint. Public env values are
  visible to clients and usually embedded at build time. Keep real secrets private.
- The Axios success interceptor returns the HTTP response body; that body still
  contains the backend `statusCode`/`data` envelope. Avoid double-unwrapping.
- Access tokens live in HTTP-client memory. Auth persistence saves user info only.
  Login clears React Query cache to avoid mixing accounts; preserve that behavior.
- Refresh is `GET /api/v1/auth/refresh` with credentials/cookies. Inspect backend
  cookie policy when changing login/refresh/logout, particularly for mobile.
- STOMP sends JWT in CONNECT headers, not query parameters. Preserve topic names,
  resubscription/cleanup and authenticated reconnect behavior.
- Browser geolocation/Mapbox, VNPAY redirects and service-worker behavior need
  real platform checks; a successful API health check does not verify these flows.
- Backend order states and transition permissions define behavior; role-specific
  display mappings must not silently change that contract.

## Validation and reporting

- Run `pnpm agent:check doctor` for prerequisites and `config` after config edits.
- Run `pnpm agent:check typecheck --app customer` and `lint --app customer` for the
  affected app. Omit `--app` to cover all five. Include affected shared packages
  when their public interfaces change. Commands must retain failing exit codes.
- `pnpm agent:check health` probes local endpoints with GET requests. It does not
  start services, sign in, submit orders, charge money or deploy anything.
- Existing `pnpm check-types` does not cover all apps. Next builds currently skip
  TypeScript/lint failures. A successful build alone is not a clean quality result.
- No established automated test suite was found during setup. Add focused tests
  when behavior merits them; do not fabricate coverage or change unrelated code
  to conceal existing diagnostics. Capture existing failures separately from new ones.
- For visible changes, inspect relevant browser states where tooling permits.
  Report what changed, checks actually run, failures and any unverified flow.

## Git and deployment

- Preserve unrelated edits, credentials, accounts and running sessions. Do not
  dump env files or copy embedded map credentials into examples or another repo.
- Local implementation does not imply permission to push, merge or deploy.
  GitHub Actions currently deploys four apps on pushes to main; admin is excluded.
- Use sibling backend/mobile sources for contract/reference work when available;
  edit them only when the user's task includes that change. Report cross-repo needs.
