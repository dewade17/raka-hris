<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This project uses Next.js 16, React 19, and newer framework conventions that may differ from older assumptions. APIs, conventions, and file structure may contain breaking changes.

Before writing or proposing Next.js code, read the relevant guide in `node_modules/next/dist/docs/`. If it is not available, use `https://nextjs.org/docs`. Heed deprecation notices and prefer the documented Next.js 16 behavior over prior knowledge.

## Project Stack

- Framework: Next.js `16.2.4`
- React: `19.2.4`
- Language: TypeScript
- Database ORM: Prisma `7.8.0`
- Database provider: MySQL / MariaDB
- UI library: Ant Design `6`
- Icons: `lucide-react`
- Styling: Tailwind CSS `4`
- Path alias: `@/*` maps to `src/*`

## Project Structure

- `src/app` contains Next.js routes, layouts, route-level loading/error/not-found files, and app providers.
- `src/features` contains feature modules grouped by business area.
- Feature modules should follow the existing pattern where possible:
  - `repository.ts` for database access
  - `service.ts` for business logic
  - `types.ts` for shared feature types
- `src/lib` contains shared infrastructure helpers.
- `src/server` contains server-side application utilities.
- `src/generated/prisma` contains generated Prisma Client output. Do not edit generated files manually.

## Page and Section Organization

- For long route pages, keep `page.tsx` as a readable list of the page's main sections.
- Move each large section into its own clearly named component file inside the route's local component folder, such as `components_home` or `components_login`.
- Import section components explicitly from their files. Do not add barrel files such as `index.ts` unless the user explicitly asks for one.
- Keep shared route-group chrome such as headers, footers, and common page wrappers in the nearest relevant `layout.tsx`, not inside a page-specific section component folder.
- Avoid hiding an entire page behind a single wrapper component when the `page.tsx` can clearly show the section order.

## Client CRUD and Mutation Logic

For route-level Client Components, avoid placing CRUD or mutation logic directly inside visual components when the logic includes fetch calls, loading state, error state, success messages, router refreshes, or upload handling.

Prefer this separation:

- Components should focus on layout, form fields, display state, and user interactions.
- Route-local hooks should handle client-side mutation workflows such as `fetch`, pending state, error messages, success feedback, upload requests, and `router.refresh()`.
- API route handlers should remain responsible for authentication, authorization, server validation, and calling feature services.
- Feature `service.ts` and `repository.ts` files should remain responsible for business logic and database access.

For route-specific mutation hooks, place them in the route's local `hooks` folder:

```text
src/app/(group)/route-name/
├── page.tsx
├── hooks/
│   ├── useUpdateResource.ts
│   └── useUploadResourceAsset.ts
└── components_route_name/
    ├── ResourceEditor.tsx
    └── ResourceForm.tsx
```

Do not create unused CRUD hooks just to complete a naming set. For example, only create `useCreateResource.ts` when the route actually has a create flow or create endpoint.

When a type is only used by one component and one nearby hook, it may stay close to the component and be exported from that component file. If the type is shared across several components, hooks, or route files, move it to a route-level `types.ts`.

Hooks in Client Component routes must not import server-only modules such as Prisma repositories, server auth helpers, or feature services that are meant to run only on the server. Use route handlers or Server Actions as the boundary for server work.

## RBAC Rules

- Company access uses permission-based RBAC through `Permission`, `CompanyRole`, `CompanyRolePermission`, and `MembershipRole`.
- Do not add company module pages or company API mutations without defining the required permission in `src/features/auth/permissions/catalog.ts`.
- New company modules must add at least a `module:view` permission when the module has a page or sidebar item.
- New company API mutations must use `getCompanyApiPermissionContext(module, action, message)` instead of checking `membership.isOwner` directly.
- Server-rendered company pages must use `requirePermission(module, 'view')` instead of only `requireActiveCompanyMembership()` when the page belongs to a protected module.
- Owner access is a permanent bypass through `membership.isOwner`; do not make owner access depend on editable role permissions.
- Do not convert company roles to enums. Company role names are database records and may be created or renamed by the company owner.
- Employee accounts may be created without `MembershipRole`; lack of role means no module access until the owner assigns one.
- When adding a new module, also update the company sidebar item with the matching `permissionKey` if the module has navigation.

## Project Working Rules

- Use human-readable, descriptive function names.
- Avoid vague or overly generic names when a clearer name is possible.
- Treat this project as read-only by default.
- Do not execute changes directly in the project unless the user explicitly asks for execution.
- Do not create, edit, move, or delete files or folders unless the user explicitly requests it.
- Do not run project-changing commands without explicit user approval.
- Never run build commands.
- Never run commands such as `npm run build`, `pnpm build`, `yarn build`, `next build`, or equivalent build commands.
- When proposing implementation changes, prefer giving the output in chat first unless the user explicitly asks you to execute them.
- Unless a full file is necessary, do not provide full code. Prefer showing only the exact parts that need to be replaced or added, and clearly state where each change belongs.
- When writing error messages, make them human, clear, and actionable. Explain what went wrong in plain language and, when helpful, what the user can do next.

## Human-Like Engineering Standard

AI agents must work with the care, judgment, and accountability expected from a competent human software engineer.

- Understand the existing code before proposing or making changes.
- Follow the project’s current patterns instead of inventing new ones unnecessarily.
- Consider maintainability, readability, security, accessibility, and user experience.
- Avoid rushed or partial implementations.
- Do not leave TODO-style placeholders unless the user explicitly asks for a draft.
- Prefer complete, coherent solutions that are ready for production use.
- If a requirement is unclear, state the assumption clearly before giving the solution.
- If there is risk, tradeoff, or missing context, explain it plainly.
- Keep the implementation practical and focused on the user’s actual goal.

## Production-Ready Expectations

Any proposed or executed implementation should be suitable for production unless the user explicitly asks for a prototype.

A production-ready result should:

- Handle expected success, empty, loading, and error states.
- Use clear validation for user input.
- Avoid leaking sensitive internal details in user-facing errors.
- Preserve type safety and strict TypeScript compatibility.
- Avoid unnecessary dependencies.
- Avoid duplicated logic when an existing helper or pattern already exists.
- Keep UI consistent with the existing application.
- Use clear English for user-facing text unless another language is explicitly requested.
- Be easy for another developer to review and maintain.

## Prisma and Database Rules

- Do not edit `prisma/schema.prisma` unless the user explicitly asks for a schema change.
- Do not create, edit, delete, or rename migration files unless the user explicitly asks.
- Do not run Prisma migration commands without explicit user approval.
- Do not run database reset commands unless the user explicitly confirms that the target database is safe to reset.
- Prisma Client is generated into `src/generated/prisma`.
- Generated Prisma files must not be edited manually.
- Database changes should be explained clearly before execution, including the expected data impact.

## Language Rules

- Use English as the default application language.
- Do not add locale-prefixed routes, dictionary loading, or route-level internationalization unless explicitly requested.
- Keep user-facing text clear, human, and actionable.
- Write UI copy in production-ready, user-facing language; avoid technical wording such as API, endpoint, payload, mutation, schema, or implementation details unless the audience explicitly needs it.

## UI and Styling Rules

- Prefer Ant Design components when they fit the use case.
- Use `lucide-react` for icons when icons are needed.
- Follow the existing visual style before introducing new patterns.
- Do not create a new component system unless there is a clear need.
- Keep interfaces clean, predictable, and suitable for HRIS workflows.
- UI should be accessible, readable, and responsive.
- Error, empty, and loading states should feel complete, not temporary.

## Safe Verification

- Build commands are forbidden.
- Prefer lightweight checks only when the user permits execution.
- `npm run lint` may be used for verification if execution is allowed.
- Type checks or other validation commands should be proposed first unless the user explicitly asks the agent to run them.
- Do not start or stop services without user approval unless the user explicitly asks to run the app.

## Code Quality Rules

- Prefer small, focused changes.
- Keep behavior close to the existing project conventions.
- Avoid broad refactors unless necessary for the requested task.
- Use existing helpers, types, and feature boundaries where possible.
- Keep error messages clear and actionable.
- Keep comments minimal and useful.
- Do not edit unrelated files.
- Do not revert user changes unless explicitly instructed.

<!-- END:nextjs-agent-rules -->
