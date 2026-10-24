# 1. Single `FeatureToggleProvider` per application

- Status: accepted
- Date: 2026-10-24
- Version: 10.0.0

## Context

Up to v9, `FeatureToggleProvider` called the global `set()` from `feature-toggle-service` during render, and `FeatureToggle` read the global state. Every provider wrote to, and read from, the same place. Validating v9 with `feature-toggle-service` 8 showed that:

- with two providers, the last one to render overwrote the toggles of the other, so both subtrees ended up with the same values;
- a nested provider leaked its toggles to components rendered after it, outside its subtree;
- on the server, a toggle enabled for one request was visible to the next one;
- a component calling `set()` changed the toggles without updating the UI, and the provider discarded the change on its next render.

`feature-toggle-service` 8 added `createFeatureToggleService()`, which creates isolated and subscribable services, so each provider can keep its own toggles.

## Decision

- Only one `FeatureToggleProvider` is allowed per application. A provider rendered inside another one, or mounted while another one is mounted, logs an error via `console.error` and throws it. There is no option to disable this check.
- `FeatureToggle` and `useFeatureToggle()` must be rendered inside the provider, and they throw an error otherwise.
- The provider keeps its toggles in its own `createFeatureToggleService()` instance and doesn't change the global `feature-toggle-service` state.
- Components change the toggles with `set()` from `useFeatureToggle()`, which re-renders every consumer.

## Motivation

Feature toggles are application-level configuration: every component of the application must see the same values. `feature-toggle-service` is shared between the client and the server, so allowing several providers on the client would create more problems than it solves: toggles that differ between parts of the page, depend on render order and are hard to debug. Multiple providers were never encouraged, so failing loudly is better than supporting a setup that silently misbehaves.

## Consequences

- One source of truth per application, and no leaks between server requests.
- Nested providers are detected during render, on both the client and the server. Simultaneous (sibling) providers are detected when they are mounted, on the client only, since effects don't run on the server.
- Applications with more than one provider must merge them into a single provider at the root.
- `FeatureToggle` can't be used outside the provider, e.g. reading toggles set via the global `set()` of `feature-toggle-service`.
