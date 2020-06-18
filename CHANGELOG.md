# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased][]

## [4.0.5][] - 2020-06-18

### Fixed

- Decreasing package download time

## [4.0.4][] - 2020-06-14

### Updated

- Update demo example to use Stackblitz
- Updating Github templates

## [4.0.3][] - 2020-06-14

### Updated

- Update demo example to use Stackblitz
- Updating Github templates

## [4.0.2][] - 2020-06-14

### Updated

- Minor changes

## [4.0.1][] - 2020-06-14

### Updated

- Update demo example to use Stackblitz
- Updating Github templates

## [4.0.0][] - 2020-06-14

### Added

- Supporting `!` prefix to change the boolean value to false on the `featureName` props check

```ts
{
  enableSecondContent: false,
}
```

```jsx
<FeatureToggle featureName={'!enableSecondContent'}>
  <p>
    This content is disabled, but should be displayed since it has `!` prefix at
    `featureName`
  </p>
</FeatureToggle>
```

- Adding support for accept string or an array or strings as feature toggle configuration

Example using string

```jsx
<FeatureToggle featureName={'enableMainContent'}>
  <div className="content">
    <p>This content is enabled if `enableMainContent` is true</p>
  </div>
</FeatureToggle>
```

Example using Array of strings

```jsx
<FeatureToggle featureName={['enableMainContent', 'enableDescriptionContent']}>
  <div className="content">
    <p>
      This content is enabled if `enableMainContent` and
      `enableDescriptionContent` are both truthly
    </p>
  </div>
</FeatureToggle>
```

### Updated

- Breaking changes:
  - _`showWhenDisabled`_ prop was removed since we can have the same behavior
    by using `FeatureToggle` component and passing `!` as a prefix for the
    `featureName` prop value.

So if you have this configuration for your feature toggle

```ts
{
  enableSecondContent: false,
}
```

You should replace your component configuration from this way

```jsx
<FeatureToggle featureName={'enableSecondContent'} showWhenDisabled>
  <p>
    This content is disabled, but should be displayed since it has
    `showWhenDisabled` prop
  </p>
</FeatureToggle>
```

And pass `featureName` prop with `!` prefix to keep the same behavior on WebApp

```jsx
<FeatureToggle featureName={'!enableSecondContent'}>
  <p>
    This content is disabled, but should be displayed since it has `!` prefix at
    `featureName`
  </p>
</FeatureToggle>
```

## [3.0.0][] - 2020-06-03

### Updated

- Bumping `feature-toggle-service` to 4.0.0
- Decreasing bundle size to `303B`
- Migrated Test Framework from Mocha to Jest
- Code Cleanup

### Fixed

- Adding missed dependencies
- Adding different build distrubutions: UMD, CommonJS, ES2015 and ESM

### Added

- Decreasing the bundle size to 1KB minified and Gzipped

[unreleased]: https://github.com/willmendesneto/reactor-feature-toggle/compare/v3.0.0...HEAD
[3.0.0]: https://github.com/willmendesneto/reactor-feature-toggle/tree/v3.0.0
[unreleased]: https://github.com/willmendesneto/reactor-feature-toggle/compare/v4.0.0...HEAD
[4.0.0]: https://github.com/willmendesneto/reactor-feature-toggle/tree/v4.0.0
[unreleased]: https://github.com/willmendesneto/reactor-feature-toggle/compare/v4.0.2...HEAD
[4.0.2]: https://github.com/willmendesneto/reactor-feature-toggle/compare/v4.0.1...v4.0.2
[4.0.1]: https://github.com/willmendesneto/reactor-feature-toggle/tree/v4.0.1
[unreleased]: https://github.com/willmendesneto/reactor-feature-toggle/compare/v4.0.3...HEAD
[4.0.3]: https://github.com/willmendesneto/reactor-feature-toggle/tree/v4.0.3
[unreleased]: https://github.com/willmendesneto/reactor-feature-toggle/compare/v4.0.3...HEAD
[unreleased]: https://github.com/willmendesneto/reactor-feature-toggle/compare/v4.0.4...HEAD
[4.0.4]: https://github.com/willmendesneto/reactor-feature-toggle/tree/v4.0.4


[Unreleased]: https://github.com/willmendesneto/reactor-feature-toggle/compare/v4.0.5...HEAD
[4.0.5]: https://github.com/willmendesneto/reactor-feature-toggle/tree/v4.0.5