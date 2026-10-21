---
name: eatzy-web-change
description: Implement Eatzy web features or UI changes across its Next.js role apps and shared packages, preserving existing API contracts and role behavior.
---

# Eatzy web change

Use root `AGENTS.md` and `docs/agent/architecture.md` for the affected domain.
Work from the user's requested outcome and role; avoid expanding a small UI change
into a repository migration.

## Locate the change

Trace route/layout → role feature component/hook → `packages/api` →
`packages/types`. Search consumers before changing shared UI or API exports.
Public auth pages can return null while `(public)/layout.tsx` renders their real
content; follow `*PageContent` and submit handlers. Reuse the domain's query keys,
mutation invalidations, mapper and existing tokens/components.

Keep wire DTOs separate from display models. API response bodies retain the
`statusCode`/`data` envelope after the HTTP interceptor unwraps AxiosResponse.
Inspect actual data rather than adding casts to satisfy an assumed shape.

## Preserve product behavior

- Keep loading/empty/error/disabled states and screen-size behavior relevant to
  the change. An animation must not conceal failure or block a valid action.
- The server cart is authoritative; Zustand also tracks activeRestaurantId.
- For auth, preserve memory token + cookie refresh and cache clearing on account
  switch. For realtime preserve JWT CONNECT headers, topic names and cleanup.
- Read backend transition rules before changing order actions/status filters.
  VNPAY success comes from server verification, not opening a URL successfully.
- Mark demo/partial flows honestly. See `docs/agent/native-parity.md` if copying
  customer registration/onboarding/profile/report behavior or preparing native work.

## Verify the result

Use `pnpm agent:check typecheck --app <role>` and `lint --app <role>` for the
affected app; cover other consumers when a shared interface changes. Use `config`
for config edits and `health` for local connectivity when servers already run.
Do not mask exit codes or rely on Next build's ignored TypeScript/lint errors.
Capture existing diagnostics separately if they prevent a clean result.

Inspect changed UI and its meaningful states in the browser where available.
Add a focused regression test when its value justifies it; this repo has no
established test suite to invoke by assumption. Report changes, actual validation
and any unverified behavior. Push/deploy remains a separate user action.
