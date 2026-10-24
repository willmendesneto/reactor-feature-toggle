# Reactor feature toggle

[![npm](https://img.shields.io/badge/stackblitz-online-orange.svg)](https://stackblitz.com/edit/reactor-feature-toggle-sample)

[![npm version](https://badge.fury.io/js/reactor-feature-toggle.svg)](http://badge.fury.io/js/reactor-feature-toggle) [![npm downloads](https://img.shields.io/npm/dm/reactor-feature-toggle.svg)](https://npmjs.org/reactor-feature-toggle)

[![Build Status](https://github.com/willmendesneto/reactor-feature-toggle/actions/workflows/ci.yml/badge.svg)](https://github.com/willmendesneto/reactor-feature-toggle/actions)
[![Coverage Status](https://coveralls.io/repos/willmendesneto/reactor-feature-toggle/badge.svg?branch=main)](https://coveralls.io/r/willmendesneto/reactor-feature-toggle?branch=main)

[![NPM](https://nodei.co/npm/reactor-feature-toggle.png?downloads=true&downloadRank=true&stars=true)](https://npmjs.org/reactor-feature-toggle)
[![NPM](https://nodei.co/npm-dl/reactor-feature-toggle.png?height=3&months=3)](https://npmjs.org/reactor-feature-toggle)

Your module to handle with [feature toggles](http://martinfowler.com/bliki/FeatureToggle.html) in ReactJS applications easier.

## Why Feature toggle?

> This is a common concept, but why use this directive instead solve it via server-side rendering?

The idea of this directive is make this process transparent and easier. So the main point is integrate this directive with other tooling process, such as:

- Client-side rendering;
- Server-side rendering;
- Progressive rendering;
- Any other that yoy like :)

You can integrate with WebSockets or handling this in a EventSourcing architecture. It's totally transparent for you and you can integrate easier in your application.

- [Install](#install)
- [Setup](#setup)
- [Demo](#demo)

## Install

You can get it on NPM installing `reactor-feature-toggle` module as a project dependency.

```shell
npm install reactor-feature-toggle --save
```

## Setup

Add a single `FeatureToggleProvider` at the root of your application. `FeatureToggle` and `useFeatureToggle()` must be rendered inside it, and they throw an error otherwise.

```javascript
import { FeatureToggle, FeatureToggleProvider } from 'reactor-feature-toggle';

const AppWrapper = () => {
  const featureToggleData = {
    enableMainContent: true,
    enableDescriptionContent: true,
    enableSecondContent: false,
  };

  return (
    <FeatureToggleProvider featureToggleService={featureToggleData}>
      <div>
        <FeatureToggle featureName={'enableMainContent'}>
          <div className="content">
            <p>This content is enabled</p>
            <FeatureToggle featureName={'enableSecondContent'}>
              <p>This content is disabled</p>
            </FeatureToggle>
            <FeatureToggle featureName={'!enableSecondContent'}>
              <p>
                This content is disabled, but should be displayed since it has
                `!` prefix at `featureName`
              </p>
            </FeatureToggle>
          </div>
        </FeatureToggle>

        <FeatureToggle
          featureName={['enableMainContent', 'enableDescriptionContent']}
        >
          <div className="content">
            <p>
              This content is enabled since `enableMainContent` and
              `enableDescriptionContent` are both truthly
            </p>
          </div>
        </FeatureToggle>

        <FeatureToggle
          featureName={['enableMainContent', '!enableDescriptionContent']}
        >
          <div className="content">
            <p>
              This content is disabled because `enableMainContent` is truthly
              and `enableSecondContent` is falsy when using `!` prefix on array
              of configuration passed via props.
            </p>
            <p>
              This can be used as a fallback if both feature toggles are not
              enabled, as an example
            </p>
          </div>
        </FeatureToggle>
      </div>
    </FeatureToggleProvider>
  );
};

export default AppWrapper;
```

### `FeatureToggle` props

| Prop          | Type                 | Description                                                         |
| ------------- | -------------------- | ------------------------------------------------------------------- |
| `featureName` | `string \| string[]` | Toggle name(s) to check, all must be on. Prefix with `!` to negate. |
| `fallback`    | `ReactNode`          | Rendered when the check fails. Defaults to `null`.                  |

```javascript
<FeatureToggle featureName="enableNewCheckout" fallback={<LegacyCheckout />}>
  <NewCheckout />
</FeatureToggle>
```

### Using `useFeatureToggle()`

```javascript
// Make sure your component is rendered inside `FeatureToggleProvider`
import { useFeatureToggle } from 'reactor-feature-toggle';

function Dashboard() {
  const { isOn } = useFeatureToggle();

  // {
  //  enableNewDashboard: true,
  //  enableProPlan: true,
  //  enableBetaFeatures: false,
  // }
  //
  // Same syntax as `featureName`: arrays and `!` prefix are supported
  const canAccessNewDashboard = isOn(['enableNewDashboard', 'enableProPlan']);
  const showBetaFeatures = isOn('enableBetaFeatures');

  if (canAccessNewDashboard) {
    return <div>New Dashboard</div>;
  }

  if (showBetaFeatures) {
    return <div>Beta Feature!</div>;
  }

  return <div>Current Dashboard</div>;
}
```

### Changing toggles from a component

`useFeatureToggle()` also returns `set()`. The new values are merged with the current ones, and every `FeatureToggle` and `useFeatureToggle()` re-renders:

```javascript
import { useFeatureToggle } from 'reactor-feature-toggle';

function BetaOptIn() {
  const { isOn, set } = useFeatureToggle();

  return (
    <button onClick={() => set({ enableBetaFeatures: true })}>
      {isOn('enableBetaFeatures') ? 'Beta enabled' : 'Try the beta'}
    </button>
  );
}
```

Changes made via `set()` are kept when the provider re-renders with the same `featureToggleService` values. When a value passed to the provider changes, the provider applies it.

### Single provider

Only one `FeatureToggleProvider` is allowed per application. Rendering a provider inside another one, or two providers at the same time, logs an error via `console.error` and throws it. The check runs when the provider is mounted in the browser, including when hydrating server-rendered markup (e.g. Next.js).

Why? Feature toggles are application-level configuration: every component must see the same values. `feature-toggle-service`, which this package is built on, is shared between the client and the server, so several providers on the client would create more problems than they solve, with toggles that differ between parts of the page and are hard to debug. Each provider keeps its toggles in its own `feature-toggle-service` instance (`createFeatureToggleService()`), so toggles never leak between server requests. See [the decision record](docs/decisions/0001-single-feature-toggle-provider.md) for more details.

### Server-side rendering and React Server Components

`FeatureToggleProvider` works with server-side rendering: each render creates its own toggles, so concurrent requests don't share them.

Both entry points are client modules (`'use client'`). In React Server Components, render the provider in your root layout and use `FeatureToggle` and `useFeatureToggle()` in client components, or pass them as children from server components:

```javascript
// app/layout.js (Server Component)
import { FeatureToggleProvider } from 'reactor-feature-toggle';

export default async function RootLayout({ children }) {
  const toggles = await getFeatureToggles(); // per request, e.g. from your API

  return (
    <html>
      <body>
        <FeatureToggleProvider featureToggleService={toggles}>
          {children}
        </FeatureToggleProvider>
      </body>
    </html>
  );
}
```

## Migrating from v9

- Only one `FeatureToggleProvider` is allowed per application: nested or simultaneous providers throw an error. See [Single provider](#single-provider).
- `FeatureToggle` must be rendered inside `FeatureToggleProvider`, and it throws an error otherwise. It reads the toggles from the provider instead of the global `feature-toggle-service` state, so calling `set()` from `feature-toggle-service` directly no longer affects it. Use `set()` from `useFeatureToggle()` instead.
- The provider no longer changes the global `feature-toggle-service` state.
- `FeatureToggle`, `FeatureToggleProvider` and `useFeatureToggle()` are exported from both `reactor-feature-toggle` and `reactor-feature-toggle/client`, which are client modules (`'use client'`).
- `useFeatureToggle()` returns `set()`, and its `isOn()` supports arrays and the `!` prefix.
- `feature-toggle-service` >= 8 is required.

## Migrating from v8

- New `fallback` prop, rendered when the check fails.
- `showWhenDisabled` was removed from the props types. It has been ignored since v4.0.0: use the `!` prefix or `fallback` instead.
- The UMD build was removed. Node.js >= 18 is required.

## Demo

Try out the [demo](https://stackblitz.com/edit/reactor-feature-toggle-sample)!

## Publish

this project is using `np` package to publish, which makes things straightforward. EX: `np <patch|minor|major>`

> For more details, [please check np package on npmjs.com](https://www.npmjs.com/package/np)

## Author

**Wilson Mendes (willmendesneto)**

- <http://github.com/willmendesneto>
