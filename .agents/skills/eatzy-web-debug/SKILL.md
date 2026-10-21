---
name: eatzy-web-debug
description: Diagnose and fix reproducible Eatzy web failures involving Next.js UI, API proxy, sessions, order state, sockets, maps or local Docker connectivity.
---

# Eatzy web debug

Read `AGENTS.md` and the relevant route/feature. Establish the role, URL, trigger,
expected result and observed failure from current evidence. Keep active servers,
accounts and unrelated work available. Collect only the logs needed; redact
tokens, cookies, passwords and personal data.

## Follow the failing path

- UI failure: trace event handler → hook/mutation → API response → derived view
  state. Check real vs demo code before diagnosing a missing backend side effect.
- Connectivity: `pnpm agent:check config`/`health`, then gateway health, then app
  `/api/proxy/actuator/health`. Read app rewrite and effective BACKEND_URL without
  printing env values. Restart only the affected server when config needs reload.
- Stale UI: check service worker/cache as well as the running port/process and
  build; avoid clearing all owner data as a first diagnostic step.
- Auth: HTTP memory token → credential cookie refresh → backend auth policy →
  account query/store/redirect. Verify reload/logout/account switching and 401
  concurrency; failed queued refresh requests must settle rather than hang.
- Socket: REST health alone is insufficient. Check WS URL, JWT CONNECT header,
  communication-service destination, subscribe lifecycle and reconnect/token
  renewal. Driver orders also poll every 5s; establish which channel failed.
- Map/location: distinguish denied/unavailable GPS, provider response, coordinate
  order, browser secure-context restrictions and map SDK rendering. Do not send
  invented coordinates or copy an embedded credential into a new config.
- Order/payment: compare wire DTO/status transition with backend and UI mapper;
  inspect `checkout/hooks/useCreateOrder.ts` for actual VNPAY redirect behavior.
  Empty `features/payment/hooks/usePay.ts` files are not the payment implementation.

## Make the smallest supported fix

Explain the evidence linking the cause to the symptom, fix that path and retest
the same trigger. Include nearby cases when the cause affects them, such as
switching accounts after a cache/session change. Do not change production URLs,
disable validation or reset databases to make a symptom disappear.

Use scoped `pnpm agent:check typecheck --app <role>`/`lint --app <role>` and
relevant browser/API evidence. Distinguish existing diagnostics, a successful
health response and a complete end-to-end verification. If a device/account or
backend capability is missing, state that concrete limit and the next useful check.
