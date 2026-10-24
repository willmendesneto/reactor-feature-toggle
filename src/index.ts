// Server-safe entry point: no React context or hooks, so it can be imported
// from React Server Components. Client-only APIs live in `reactor-feature-toggle/client`.
export * from './feature-toggle';
