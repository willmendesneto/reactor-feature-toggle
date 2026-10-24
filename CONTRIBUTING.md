# How to start

**Note** development requires the Node.js version in `.nvmrc` (run `nvm use`).

```bash
git clone https://github.com/willmendesneto/reactor-feature-toggle.git
cd reactor-feature-toggle
npm install
```

# Running test

```bash
npm test            # unit tests
npm run test:smoke  # installs the packed package and checks ESM/CJS/RSC
npm run lint        # ESLint
npm run format      # Prettier
```

## Submitting Pull Requests

**Please follow these basic steps to simplify pull request reviews - if you don't you'll probably just be asked to anyway.**

- Please rebase your branch against the current `main`
- Run `npm install` to make sure your development dependencies are up-to-date
- Please ensure that the test suite passes **and** that code is lint free before submitting a PR by running:
  - `npm test`
  - `npm run lint`
- If you've added new functionality, **please** include tests which validate its behaviour
- Make reference to possible [issues](https://github.com/willmendesneto/reactor-feature-toggle/issues) on PR comment

## Submitting bug reports

- Please detail the affected browser(s) and operating system(s)
- Please be sure to state which version of node **and** npm you're using
