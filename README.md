# Reactor feature toggle

[![npm version](https://badge.fury.io/js/reactor-feature-toggle.svg)](http://badge.fury.io/js/reactor-feature-toggle) [![npm downloads](https://img.shields.io/npm/dm/reactor-feature-toggle.svg)](https://npmjs.org/reactor-feature-toggle)

[![Build Status](https://travis-ci.org/willmendesneto/reactor-feature-toggle.svg?branch=master)](https://travis-ci.org/willmendesneto/reactor-feature-toggle)
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

* [Install](#install)
* [Setup](#setup)
* [Usage](#usage)


## Install

You can get it on NPM installing `reactor-feature-toggle` module as a project dependency.

```shell
npm install reactor-feature-toggle --save
```


## Setup

You'll need to import `FeatureToggleProvider` and add it into the root component of your application. So that you can enable/disable features via `FeatureToggle` component any place in your application.

```javascript
import React, { Component } from 'react'
import { FeatureToggleProvider, FeatureToggle } from 'reactor-feature-toggle'

const AppWrapper = () => {
  const featureToggleData = {
    enableMainContent: true,
    enableSecondContent: false
  };

  return (
    <FeatureToggleProvider featureToggleService={featureToggleData} >
      <div>
        <FeatureToggle featureName={'enableMainContent'} >
          <div className="content">
            <p>This content is enabled</p>
            <FeatureToggle featureName={'enableSecondContent'} >
              <p>This content is disabled</p>
            </FeatureToggle>
            <FeatureToggle featureName={'enableSecondContent'} showWhenDisabled>
              <p>This content is disabled, but should be displayed since it has `showWhenDisabled` property</p>
            </FeatureToggle>
          </div>
        </FeatureToggle>
      </div>
    </FeatureToggleProvider>
  );
};

export default AppWrapper;

```


## Author

**Wilson Mendes (willmendesneto)**
+ <https://plus.google.com/+WilsonMendes>
+ <https://twitter.com/willmendesneto>
+ <http://github.com/willmendesneto>
