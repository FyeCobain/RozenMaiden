# Rozen Maiden

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.5.

## Requirements

- [Node.js](https://nodejs.org/) (a version compatible with Angular 21)
- [pnpm](https://pnpm.io/) (see `packageManager` in `package.json`; currently `pnpm@10.33.0`)

## Installation

```bash
pnpm install
```

## NPM scripts

| Command             | Description                                         |
| ------------------- | --------------------------------------------------- |
| `pnpm dev`          | Dev server (`ng serve`) at `http://localhost:4200/` |
| `pnpm build`        | Production build; output in `dist/`                 |
| `pnpm test`         | Unit tests (Vitest via `ng test`)                   |
| `pnpm test:ci`      | Unit tests for CI (`ng test --watch=false`)         |
| `pnpm lint`         | ESLint for `src/**/*.ts` and `src/**/*.html`        |
| `pnpm format`       | Run Prettier and write changes                      |
| `pnpm format:check` | Verify formatting without changing files            |

You can also run `pnpm exec ng <command>` for the Angular CLI.

## Development server

```bash
pnpm dev
```

When the server is running, open `http://localhost:4200/`. The app reloads when you change source files.

## Code quality

- **ESLint**: `pnpm lint` - rules in `eslint.config.js`.
- **Prettier**: settings in `.prettierrc`; use `pnpm format` to apply, or `pnpm format:check` to validate only.

## Code scaffolding

The workspace component/directive **prefix** is **`rm`** (see `angular.json`). Examples:

```bash
pnpm exec ng generate component some-name
pnpm exec ng generate directive some-name
```

For all schematics:

```bash
pnpm exec ng generate --help
```

## Building

```bash
pnpm build
```

Artifacts go to `dist/`. The default production configuration optimizes the app.

## Unit tests

```bash
pnpm test
```

For non-interactive environments (CI, scripts): `pnpm test:ci`.

## End-to-end tests

This workspace does not define an `e2e` target in `angular.json`. Add an e2e setup (for example Cypress or Playwright) if you need it.

## Additional resources

- [Angular documentation](https://angular.dev/)
- [Angular CLI overview and command reference](https://angular.dev/tools/cli)
