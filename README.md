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

### Client-side

You'll need to import `FeatureToggleProvider` and add it into the root component of your application. So that you can enable/disable features via `FeatureToggle` component any place in your application.

Also, multiple `FeatureToggleProvider` are allowed, which gives more flexibility for your application.

```javascript
// `FeatureToggleProvider` and `useFeatureToggle()` is only available on client-side
import { FeatureToggleProvider } from 'reactor-feature-toggle/client';
// `FeatureToggle` is available on both client and server sides
import { FeatureToggle } from 'reactor-feature-toggle';

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
// Make sure your parent component is wrapped with `FeatureToggleProvider` component
import { useFeatureToggle } from 'reactor-feature-toggle/client';

function Dashboard() {
  const { isOn } = useFeatureToggle();

  // {
  //  enableNewDashboard: true,
  //  enableProPlan: true,
  //  enableBetaFeatures: false,
  // }
  //
  const canAccessNewDashboard =
    isOn('enableNewDashboard') && isOn('enableProPlan');
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

### Server-Side Usage

For Server-Side Rendering or React Server Components, initialize `feature-toggle-service` directly without the Provider:

```javascript
import { set } from 'feature-toggle-service';
import { FeatureToggle } from 'reactor-feature-toggle';

// Initialize feature flags (typically in your root server component)
const featureFlags = {
  enableMainContent: true,
  enableServerSideFeature: true,
  enableNewAPI: false,
};

set(featureFlags);

// Use FeatureToggle component in any Server Component
export default function ServerPage() {
  return (
    <div>
      <h1>ServerPage</h1>
      <FeatureToggle featureName={['enableMainContent']}>
        <div>Main Content visible!</div>
      </FeatureToggle>
    </div>
  );
}
```

## Migrating from v8

- `FeatureToggleProvider` and `useFeatureToggle()` are only exported from `reactor-feature-toggle/client`. The main entry point only exports `FeatureToggle`, so it can be imported from React Server Components.
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
