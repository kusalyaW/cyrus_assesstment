# Client — quick instructions

This folder contains the frontend React app (Vite) and tests (Vitest).

Prereqs
- Node.js (16+)
- npm

Install deps

```powershell
cd client
npm install
```

Run dev server

```powershell
npm run dev
# open http://localhost:5173
```

Run tests

```powershell
# runs Vitest in jsdom environment; setupFiles loads jest-dom matchers
npm test
# or
npx vitest --environment jsdom --run
```

Notes
- Tests use a small shared mock factory in `src/test/mockApi.js` — tests call `vi.mock('../api/client', () => createMockApi())` to register the mock before importing components.
- Global jest-dom matchers are loaded via `vitest.setup.js` (configured in package.json `vitest.setupFiles`).
