# TOOLS.md — mitla-frontend

## E2E Testing

### Framework: Playwright

Install (one-time per machine):
```bash
cd packages/frontend
npx playwright install --with-deps chromium
```

Run all E2E specs:
```bash
cd packages/frontend
npx playwright test
```

Run a specific spec:
```bash
npx playwright test e2e/<module-name>/<spec-file>.spec.ts
```

Open Playwright UI (interactive):
```bash
npx playwright test --ui
```

### Test file location

- `packages/frontend/e2e/<module-name>/` — one folder per module
- Naming: `<flow-name>.spec.ts` (e.g., `login.spec.ts`, `sales-orders.spec.ts`)

### Before-handoff checklist

- [ ] `npx playwright test` exits with code 0
- [ ] Login flow passes
- [ ] Primary CRUD spec passes
- [ ] Navigation spec passes
- [ ] No new console errors (Error level only)
