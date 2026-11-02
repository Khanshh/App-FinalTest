# Repository Guidelines

## Project Structure & Module Organization

Planning is approved; source/tooling are not scaffolded. Start with MS01/T01.01 in `docs/ROADMAP.md`. Read these references before implementation: `docs/PRD.md` (scope), `docs/TECH_STACK.md` (technology), `docs/ARCHITECTURE.md` (modules), `docs/DATABASE.md` (schema), `docs/API_SPEC.md` (contracts). Resolve inconsistencies before changing contracts.

Planned layout:

- `mobile/src/app/`: Expo Router routes; keep route files thin.
- `mobile/src/features/`: feature code and colocated tests; shared UI in `mobile/src/components/`, assets in `mobile/assets/`.
- `backend/src/main/java/com/example/badminton/`: modular monolith packages `identity`, `ownerapplication`, `venue`, `booking`, `media`, `common`.
- `backend/src/main/resources/db/migration/`: Flyway migrations; backend tests belong in `backend/src/test/`.
- `infra/compose.yml`: PostgreSQL.

## Build, Test, and Development Commands

Commands are planned until scaffolding verifies them. Pin compatible versions during T01.01; align React/React Native with Expo.

- Root: `docker compose -f infra/compose.yml up -d` starts databases.
- `backend/`: `./mvnw spring-boot:run -Dspring-boot.run.profiles=local` starts API; `./mvnw verify` builds/checks. Windows: `mvnw.cmd`.
- `mobile/`: `npm ci` requires an existing lockfile; `npx expo start` starts Metro; `npx expo run:android` builds/installs Android.
- Once configured: `npx tsc --noEmit` checks types; `npx jest --runInBand` tests mobile.

## Coding Style & Naming Conventions

Use two-space indentation for TypeScript and four for Java. Use PascalCase components/classes, camelCase variables/functions, and snake_case database identifiers. Keep controllers thin; modules communicate through public services, not cross-module repositories. Return explicit DTOs, never JPA entities.

Use Expo Router, TanStack Query, hooks/Context, and Paper; do not duplicate server data in Context or add Redux/Zustand. Follow `/api/v1`, camelCase JSON, string-encoded VND, Problem Details, and API_SPEC pagination. Document formatter/linter choices during scaffolding; none exists yet.

## Testing Guidelines

Use JUnit/Mockito, Jest/jest-expo, and React Native Testing Library. Name tests `*Test.java`, `*IT.java`, `*.test.ts(x)`; configure Maven integration-test execution. Test constraints/concurrency on real PostgreSQL; use Clock for time boundaries. Cover ownership, rollback, idempotency, revocation, post-approval roles, and account-switch cache isolation. Separate test/demo data; no percentage target exists.

## Commit & Pull Request Guidelines

No Git history exists. Suggested prefixes: `feat:`, `fix:`, `test:`, `docs:`. Respect task dependencies. PRs reference task IDs, describe behavior, report actual checks, and include UI screenshots. DONE requires review and real integration, not mocks or file creation alone.

## Security & Configuration

Never commit credentials/tokens; `EXPO_PUBLIC_API_URL` is public. Enforce roles and ownership server-side: owners may own multiple venues; Admin is not an operational superuser. Use Flyway and Hibernate `validate`; preserve applied migrations. Bookings/maintenance share occupancy protection and transactions. Preserve idempotency keys when retrying the same intent. Stay within approved MVP scope.
