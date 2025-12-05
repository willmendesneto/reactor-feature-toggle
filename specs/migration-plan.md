# Migration Plan: Enzyme to testing-library/react

This document outlines the steps to migrate the unit tests from Enzyme to testing-library/react.

## 1. Uninstall Enzyme and related dependencies

```bash
npm uninstall enzyme enzyme-adapter-react-16
```

## 2. Install testing-library/react and related dependencies

```bash
npm install @testing-library/react @testing-library/jest-dom jest-environment-jsdom
```

## 3. Update unit tests

- Replace Enzyme's `shallow`, `mount`, and `render` with testing-library/react's `render`.
- Use `screen.getByRole`, `screen.getByText`, `screen.getByTestId`, etc., to find elements.
- Use `fireEvent` to simulate user interactions.
- Update assertions to use Jest's matchers along with `@testing-library/jest-dom`.

## 4. Update Jest configuration

Update `jest.config.js` to include:

```javascript
module.exports = {
  // ...
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  // ...
};
```

## 5. Run linters, build, and tests

```bash
npm run lint
npm run build
npm run test
```

## 6. Ensure no changes in unrelated packages

- Focus solely on updating the testing framework and related test files.
