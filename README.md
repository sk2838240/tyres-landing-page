# F&T Auto Services — Tyres Landing Page

Single-page marketing site for F&T Auto Services (Dubai tyre shop and mobile tyre fitting), built with Vite, React 19 and TypeScript.

## Commands

- `npm run dev` — start the dev server
- `npm run build` — type-check and build to `dist/`
- `npm run lint` — run ESLint
- `npm run preview` — serve the production build

## Brand asset credits

Vehicle manufacturer marks in `public/images/logos/` are sourced from Wikimedia Commons and keep their original brand colours:

- Mercedes-Benz star — `File:Mercedes-Benz Star.svg` (public domain, Mercedes-Benz)
- BMW roundel — `File:BMW logo (gray).svg` (public domain, BMW)
- Audi rings — `File:Audi Firmenlogo 1978 bis 1995.svg` (public domain, Audi)
- Land Rover / Range Rover oval — `File:Land Rover 1978 logo.svg` (public domain, British Leyland)
- Porsche crest — `File:Porsche-seeklogo.svg` (CC BY 4.0, Kai xzzrs)
- Toyota emblem — `File:Toyota logo (Red).svg` (public domain, Toyota)

---

## Template reference

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
