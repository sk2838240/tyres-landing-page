# F&T Auto Services — Tyres Landing Page

Single-page marketing site for F&T Auto Services (Al Quoz 3, Dubai tyre shop and auto repair workshop), built with Vite, React 19 and TypeScript.

## Commands

- `npm run dev` — start the dev server (serves the app at `http://localhost:5173/tyre-shop-near-me/`)
- `npm run build` — type-check and build to `dist/`
- `npm run lint` — run ESLint
- `npm run preview` — serve the production build

## Hosting (shared hosting, sub-folder)

The site is built for **`https://tyreexperts.ae/tyre-shop-near-me/`**. It is a static build — no PHP, database or Node runtime is needed on the host.

- **Base path** — `vite.config.ts` sets `base` from `VITE_BASE_PATH` and falls back to `/tyre-shop-near-me/`. Every asset URL is built from that base, so nothing breaks when the page lives in a sub-folder:
  - files in `public/` are referenced through `assetUrl()` in `src/lib/site.ts` (logos, favicon);
  - images used from CSS live in `src/assets/` and are bundled by Vite, which rewrites their URLs with the base path.
- **Build** — `npm run build` writes `dist/` with the correct paths.
- **Upload** — `production-upload/` (and `production-upload.zip`) hold the ready-to-upload copy: `index.html`, `assets/`, `images/`, `favicon.svg` and an `.htaccess` (directory index, no listing, long cache for hashed assets, gzip). Upload the **contents** of that folder into `public_html/tyre-shop-near-me/`.
- **Different folder or domain root** — set `VITE_BASE_PATH` (for example `/` for a root install or `/another-folder/`) and rebuild; every path follows it.
- **File names** — the host rewrites any URL containing `_` with a 301 to a dash version that does not exist, which silently kills the stylesheet. `vite.config.ts` therefore builds with `hashCharacters: 'hex'`, so every asset name is lowercase and underscore-free. Keep it that way if the build config is changed.
- The preview instrumentation that used to sit in `index.html` (session recorder, element picker, page-view beacon) has been removed, so the production page loads no third-party scripts other than Google Fonts and the Google Maps embed.

## Tyre size finder

`src/sections/TyreFinder.tsx` renders the "Find your tyre size" section (mounted in `App.tsx` between the trust strip and the services section). It is a three-step picker — **Width → Aspect ratio → Rim size** — that prunes each step to the combinations that actually exist. The funnel collects no form data: once a size is chosen (or typed manually), the "Get my quote" button opens WhatsApp in a new tab with the size and quantity pre-filled in the message, so the enquiry arrives as a direct chat.

- `src/data/tyreSizes.ts` holds the catalogue of valid combinations and the derivation helpers (`heightsForWidth`, `rimsFor`, `formatSize`, `parseSize`).
- `src/lib/site.ts` exposes `whatsappLink(message)` for building a WhatsApp URL with a custom pre-filled text. The finder message reads `Hi F&T Auto Services, I need {qty} of size {size}. Please advise availability and a fitted quote.`
- The manual "My size isn't listed" escape hatch sends the size exactly as the customer typed it, even if it is not a standard combination.

### Maintaining the tyre size catalogue

Edit the `CATALOGUE` array in `src/data/tyreSizes.ts`. Only valid, orderable combinations belong in the list — remove anything you cannot supply. Customers whose size is missing can still use the "My size isn't listed" escape hatch, so the catalogue never has to block a lead.

## Lead capture

Both enquiries on the site end up in the same place: a **WhatsApp chat**. No form posts to a third-party service any more.

- **Hero callback form** (`src/App.tsx`) — the visitor picks a service, fills in name, phone and (optional) email, and "Continue on WhatsApp" opens a chat with those details pre-filled. The message reads:
  ```
  Hi F&T Auto Services, I would like a callback for {service}.

  Name: {name}
  Phone: {phone}
  Email: {email}
  ```
  The email line is only included when the visitor supplied one. If the browser blocks the new tab, the form shows a link to open the same chat manually.
- **Tyre size finder** — hands the customer to WhatsApp with the tyre size and quantity, as described above.

`src/lib/site.ts` exposes `whatsappLink(message)` for building both links, so the number and the message format live in one place.

The old formsubmit.co and Google Sheets pipeline has been removed (`src/lib/lead.ts` and the `formSubmit*` settings in `src/lib/site.ts`). `google-sheets-lead-webhook.gs` is kept in the repo for reference but is no longer wired to the site; the `VITE_FORMSUBMIT_WEBHOOK_URL` variable in `.env.local` and on Vercel is now unused and can be removed.

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
