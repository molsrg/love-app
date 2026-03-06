# Love App (Telegram Mini App)

A modern Telegram mini app built with Nuxt 3, Pinia, PrimeVue, and full i18n support.

---

## 📦 Project Structure

```
love-app/
├── app/                  # Main application directory
│   ├── assets/           # Static assets (styles, icons, images, localization)
│   ├── components/       # Vue components (grouped by feature)
│   ├── composables/      # Custom composables (hooks)
│   ├── config/           # App configuration files
│   ├── helpers/          # Helper functions and utilities
│   ├── layouts/          # Global page layouts
│   ├── legacy/           # Legacy/archived code (if any)
│   ├── middleware/       # Nuxt middleware
│   ├── pages/            # Application pages (Nuxt routing)
│   ├── plugins/          # Nuxt plugins
│   ├── stores/           # Pinia stores (global state)
│   ├── types/            # TypeScript types
│   ├── utils/            # Utilities and API wrappers
│   ├── app.config.ts     # App config
│   ├── app.vue           # Root Vue component
│   └── error.vue         # Global error page
├── public/               # Public files (favicon, etc.)
├── nuxt.config.ts        # Nuxt global config
├── package.json          # Dependencies and scripts
├── tsconfig.json
├── README.md
```

---

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   pnpm install
   # or npm install / yarn install / bun install
   ```

2. **Create environment files:**
   - `.env.development` and `.env.production` in the project root:
     ```dotenv
     NUXT_PUBLIC_API_URL=https://api.example.com
     ```
   - **Do not commit these files to version control!**

3. **Run the development server:**
   ```bash
   pnpm run dev
   # or npm run dev / yarn dev / bun run dev
   ```

4. **Build for production:**
   ```bash
   pnpm run build
   pnpm run start
   ```

---

## ⚙️ Directory Overview

- **assets/** — Styles, images, icons, and localization files (i18n).
- **components/** — Reusable Vue components, organized by feature (e.g., loader, location, progress).
- **composables/** — Custom hooks (e.g., useApi, useDebounce, usePolling, useLanguage).
- **config/** — App and connection configuration files.
- **helpers/** — Utility functions (e.g., date helpers, stats helpers).
- **layouts/** — Page layouts (default, unauthorized, etc.).
- **legacy/** — Deprecated or archived code.
- **middleware/** — Global and route middleware.
- **pages/** — Application pages (auto-routed by Nuxt).
- **plugins/** — Plugins for app initialization, i18n, input handling, etc.
- **stores/** — Pinia stores for global state (e.g., pair, tgWebApp, token).
- **types/** — TypeScript types for app data.
- **utils/** — API wrappers and general utilities (auth, calendar, pair, etc.).

---

## 🌍 Localization

- Localization files: `app/assets/i18n/en.json`, `ru.json`
- Config: `app/assets/i18n/i18n.config.ts`
- Uses `@nuxtjs/i18n` with automatic browser language detection.

---

## 🛠️ Technologies Used

- **Nuxt 3** — Modern Vue 3 framework (SPA/SSR)
- **Pinia** — State management
- **PrimeVue** — UI components
- **@nuxt/ui** — UI utilities and themes
- **@nuxtjs/i18n** — Internationalization
- **TypeScript** — Type safety

---

## 📜 Scripts (package.json)

- `dev` — Start development server
- `build` — Build for production
- `start` — Start production server
- `lint` — Run linter

---

## 💻 Environment Variables

Create `.env.development` and `.env.production` in the project root:

```dotenv
NUXT_PUBLIC_API_URL=https://api.example.com
```

Add other variables as needed for your deployment.

---

## 🤝 Contribution

We welcome contributions to improve Love App!

- **Reporting Bugs:** Open a detailed issue on GitHub (steps to reproduce, expected/actual behavior, screenshots if possible).
- **Feature Suggestions:** Open an issue with the "enhancement" tag and a clear description/use case.
- **Code Contributions:**
  1. Fork the repository
  2. Create a feature branch (`git checkout -b feature/your-feature`)
  3. Follow coding standards and use clear commit messages (conventional commits)
  4. Submit a Pull Request to the `development` branch

For questions and discussions, join our [Telegram channel](https://t.me/+Gm_8ULokA71kMTU6).

---

## 📄 License

[MIT](./LICENSE)
