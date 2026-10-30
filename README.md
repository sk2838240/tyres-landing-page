# F&T Auto Services — Tyres Landing Page

Single-page marketing site for F&T Auto Services (Al Quoz 3, Dubai tyre shop and auto repair workshop), built with Vite, React 19 and TypeScript.

## Commands

- `npm run dev` — start the dev server
- `npm run build` — type-check and build to `dist/`
- `npm run lint` — run ESLint
- `npm run preview` — serve the production build

## Tyre size finder

`src/sections/TyreFinder.tsx` renders the "Find your tyre size" section (mounted in `App.tsx` between the trust strip and the services section). It is a three-step picker — **Width → Aspect ratio → Rim size** — that prunes each step to the combinations that actually exist. The funnel collects no form data: once a size is chosen (or typed manually), the "Get my quote" button opens WhatsApp in a new tab with the size and quantity pre-filled in the message, so the enquiry arrives as a direct chat.

- `src/data/tyreSizes.ts` holds the catalogue of valid combinations and the derivation helpers (`heightsForWidth`, `rimsFor`, `formatSize`, `parseSize`).
- `src/lib/site.ts` exposes `whatsappLink(message)` for building a WhatsApp URL with a custom pre-filled text. The finder message reads `Hi F&T Auto Services, I need {qty} of size {size}. Please advise availability and a fitted quote.`
- The manual "My size isn't listed" escape hatch sends the size exactly as the customer typed it, even if it is not a standard combination.

### Maintaining the tyre size catalogue

Edit the `CATALOGUE` array in `src/data/tyreSizes.ts`. Only valid, orderable combinations belong in the list — remove anything you cannot supply. Customers whose size is missing can still use the "My size isn't listed" escape hatch, so the catalogue never has to block a lead.

## Lead capture endpoints

Only the hero callback form submits lead data. The tyre size finder does not — it hands the customer to WhatsApp.

`VITE_FORMSUBMIT_WEBHOOK_URL` points at a Google Apps Script web app (`google-sheets-lead-webhook.gs`) that appends a row to the "Leads" sheet. The sheet columns are created automatically on the first write after the script is deployed.

Required fields are **name, phone and service**. Email is optional — when it is supplied it is still format-checked, so a lead can be captured from a phone-only enquiry.

**After changing `google-sheets-lead-webhook.gs` you must redeploy it:** open the Apps Script project, paste the updated file, then use **Deploy → Manage deployments → edit → Version: New version → Deploy**. Until that happens the running script keeps the old column set and new fields are not written.

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
