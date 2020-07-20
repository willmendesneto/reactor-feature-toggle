# Reactor feature toggle

[![Greenkeeper badge](https://badges.greenkeeper.io/willmendesneto/reactor-feature-toggle.svg)](https://greenkeeper.io/)
[![npm](https://img.shields.io/badge/stackblitz-online-orange.svg)](https://stackblitz.com/edit/reactor-feature-toggle-sample)

[![npm version](https://badge.fury.io/js/reactor-feature-toggle.svg)](http://badge.fury.io/js/reactor-feature-toggle) [![npm downloads](https://img.shields.io/npm/dm/reactor-feature-toggle.svg)](https://npmjs.org/reactor-feature-toggle)

[![Build Status](https://circleci.com/gh/willmendesneto/reactor-feature-toggle.svg?style=shield)](https://circleci.com/gh/willmendesneto/reactor-feature-toggle)
[![Coverage Status](https://coveralls.io/repos/willmendesneto/reactor-feature-toggle/badge.svg?branch=master)](https://coveralls.io/r/willmendesneto/reactor-feature-toggle?branch=master)
[![Dependency Status](https://david-dm.org/willmendesneto/reactor-feature-toggle.svg)](https://david-dm.org/willmendesneto/reactor-feature-toggle)

[![NPM](https://nodei.co/npm/reactor-feature-toggle.png?downloads=true&downloadRank=true&stars=true)](https://npmjs.org/reactor-feature-toggle)
[![NPM](https://nodei.co/npm-dl/reactor-feature-toggle.png?height=3&months=3)](https://npmjs.org/reactor-feature-toggle)

Your module to handle with [feature toggles](http://martinfowler.com/bliki/FeatureToggle.html) in ReactJS applications easier.

## Why Feature toggle?

> This is a common concept, but why use this directive instead solve it via server-side rendering?

The idea of this directive is make this process transparent and easier. So the main point is integrate this directive with other tooling process, such as:

- Server-side rendering;
- Progressive rendering;
- Any other that yoy like :)

You can integrate with WebSockets or handling this in a EventSourcing architecture. It's totally transparent for you and you can integrate easier in your application.

- [Install](#install)
- [Setup](#setup)
- [Usage](#usage)
- [Releases](#releases)
- [Demo](#demo)

## Install

You can get it on NPM installing `reactor-feature-toggle` module as a project dependency.

```shell
npm install reactor-feature-toggle --save
# or
yarn add reactor-feature-toggle
```

You can also use the standalone UMD build by including `dist/reactor-feature-toggle.js` in your page. If you do this you'll also need to include the dependencies. For example:

```html
<script src="https://unpkg.com/react@<package-version></package-version>/dist/react.js"></script>
<script src="https://unpkg.com/react-dom@<package-version>/dist/react-dom.js"></script>
<script src="https://unpkg.com/reactor-feature-toggle/dist/umd/reactor-feature-toggle.js"></script>
```

## Setup

You'll need to import `FeatureToggleProvider` and add it into the root component of your application. So that you can enable/disable features via `FeatureToggle` component any place in your application.

Also, multiple `FeatureToggleProvider` are allowed, which gives more flexibility for your application.

```javascript
import React, { Component } from 'react';
import { FeatureToggleProvider, FeatureToggle } from 'reactor-feature-toggle';

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

# Demo

Try out the [demo](https://stackblitz.com/edit/reactor-feature-toggle-sample)!

## Publish

this project is using `np` package to publish, which makes things straightforward. EX: `np <patch|minor|major>`

> For more details, [please check np package on npmjs.com](https://www.npmjs.com/package/np)

## Author

**Wilson Mendes (willmendesneto)**

- <https://twitter.com/willmendesneto>
- <http://github.com/willmendesneto>
