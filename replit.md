# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Artifacts

### Simuladores y Calculadoras Online (artifacts/calculadoras)
- React + Vite frontend-only web app at preview path `/`
- 11 calculators: Hipoteca Avanzada, IRPF, Interés Compuesto, Alquiler vs Compra, Salario Neto, Gasto de Coche, Consumo Eléctrico, Horas Trabajadas, MRU, MRUA, Conversor de Unidades
- All logic client-side in React (useState), no backend
- Charts with recharts, UI with shadcn components, green theme (#0FA958)
- Spanish language throughout, SEO-friendly pages with FAQs

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
