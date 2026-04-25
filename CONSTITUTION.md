# 📜 Fincore Constitution

## 1. Architectural Integrity
*   **Layered Structure:** Adhere strictly to the defined layers: `core/`, `ui/`, `pattern/`, `layouts/`, `features/`, and `routes/`.
*   **Feature Isolation:** Business logic must reside within `features/`. Features should be self-contained and modular.
*   **Thin Routes:** Routes are for orchestration (guards, prefetching, composition) only. They should not contain complex business logic.

## 2. Technical Mandates
*   **The `__specs__/` Rule:** No implementation is complete without automated tests. Tests must be co-located in `__specs__/` directories.
*   **Type Safety:** Absolute commitment to TypeScript. No `any` or loose typing.
*   **Validation:** All data ingress/egress must be validated using **Valibot** schemas.
*   **Server/Client Boundary:** Utilize TanStack Start's server functions (`src/core/server/`) for database operations and secure logic.

## 3. Tooling & Ecosystem
*   **Routing:** File-based routing via **TanStack Router**.
*   **Data Fetching:** **TanStack Query** for all server-state management.
*   **Database:** **Drizzle ORM** for schema definition and migrations.
*   **Styling:** **Tailwind CSS v4** with a focus on interactive, modern aesthetics.

## 4. Operational Principles
*   **Privacy First:** All data must remain local. No third-party tracking or cloud dependencies.
*   **Casa OS Compatibility:** Maintain a "1-click install" readiness through optimized Docker configurations.
*   **Performance:** Prioritize SPA performance using Vite and TanStack's optimization tools (Virtual, Table).

## 5. Coding Standards
*   **Functional Style:** Prefer functional components and hooks over classes.
*   **Composition:** Favor composition and delegation over inheritance.
*   **Consistency:** Use `pnpm` for package management and follow existing linting/formatting rules (`eslint`, `prettier`).
