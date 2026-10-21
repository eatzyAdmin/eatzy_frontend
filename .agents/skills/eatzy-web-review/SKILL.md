---
name: eatzy-web-review
description: Review Eatzy web diffs for actionable regressions in role behavior, shared UI, API contracts, sessions, orders, realtime or deployment configuration.
---

# Eatzy web review

Review the requested working-tree/commit/PR scope. Read root `AGENTS.md`, the diff
and enough callers to assess behavior. Keep review separate from edits unless
the user also requested fixes. Prioritize demonstrable defects over preferences.

## Review by impact

- Identify affected role apps and consumers of changed shared exports.
- Match request/response/envelope/pagination against `packages/types`, API mapper
  and backend evidence when available. Watch numeric API ID vs display string ID.
- Check account isolation, memory access token, cookie refresh failures, logout,
  query cache invalidation and redirects. Route groups do not enforce permissions.
- Verify order actions preserve backend status/ownership/transition rules; display
  groupings in driver/restaurant must not authorize an invalid action.
- Check cleanup, duplicate subscriptions, token renewal and reconnection for
  STOMP; verify browser GPS availability and teardown for location changes.
- Treat browser payment return as untrusted until backend confirms status. Do not
  accept simulated registration/OTP/KYC/report behavior as production integration.
- UI findings need a concrete state/viewport/input that becomes broken or unusable.
  Read existing tokens/components before reporting stylistic inconsistency.
- Config changes can alter server selection and deployment: BACKEND_URL is the
  Next proxy target; NEXT_PUBLIC_WS_URL is client/build-time; Actions deploys four
  apps on push main and excludes admin. Follow changed Docker/workflow behavior.

## Use verification honestly

Run relevant `pnpm agent:check` modes when useful and allowed by task scope.
Typecheck/lint commands must retain failures. Existing Next builds skip both,
and root legacy check-types is not app coverage. Compare a separate baseline if
needed; never use that baseline to declare a broken check passed.

Present findings ordered by severity, with file/line, triggering condition,
user impact and the causal explanation. Report no findings when none are
supported. Summarize checks and concrete unverified risks briefly; do not create
hypothetical findings or claim that source inspection proves full flow success.
