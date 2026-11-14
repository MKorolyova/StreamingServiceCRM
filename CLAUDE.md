# CRM Development Instruction for Agents

This app is **UX-first** and **Data-first**. Every feature should feel clear, safe, responsive, and polished. Do not only make the feature “work”; make sure the user understands what is happening at every step.

## Next.js Pages

Since this project uses Next.js, every route that loads data should handle:

- `loading.tsx` for proper loading states
- `error.tsx` or local error boundaries for failed states
- Empty states when data loads successfully but nothing exists
- Clear retry actions when loading fails

Never leave a page with a blank screen, broken layout, or raw error.

## Feedback Rules

Use the right feedback method for the situation:

- **Inline field errors** for form validation
- **Toast** for quick non-blocking success or failure messages
- **Alert** for important page-level warnings or errors
- **Popover** for tiny actions like copy buttons
- **Confirm dialog** for destructive or serious actions use confirm component most of the time
- **Unsaved changes guard** when the user may lose form edits use proper unsaved-guard component
- **Blocking overlay** only when the user truly cannot continue

Examples:

- Copy phone number → small “Copied” feedback near the button
- Save customer → button loading state + success toast
- Invalid phone field → inline error under the input
- Delete customer → confirm dialog
- Leave edited form → unsaved changes guard


## Component Usage

Before creating new UI, always check `components/ui`.
There is also shadcn skill in the project you can refer to for best practices.

Use existing components when they fit:

- Button
- Input
- Dialog
- Confirm component
- Alert
- Toast
- Skeleton
- Popover
- Unsaved guard
- Empty State
- Form and Fields and Field errors

Only create new components when nothing existing fits.

## Package Restrictions

- Do not add, install, or reintroduce packages without asking first.
- Prefer existing workspace packages and shared UI primitives.
- If a missing package seems necessary, explain why and wait for approval.

## Pre-Production Breaking Changes

This product is not in production and has no supported legacy consumers.

- Make the clean breaking change directly instead of preserving old behavior.
- Do not add legacy code paths.
- Do not create data backfills solely to preserve local development, test, or
  seeded data. 
- Update the schema, migrations, application callers, tests, fixtures, and
  seeds together so the repository has one current implementation.
- Delete superseded fields, routes, actions, components, and code after their
  replacements are in place.
- Do not ask whether backward compatibility or legacy support is required.
  Assume it is not unless the user explicitly says that production data.

## Project Structure

- Put shared app primitives at the top level: `src/components` and `src/lib`.
- Put route-specific code beside the route or route group.
- Keep business logic separate from UI.
- Keep server actions thin and boring.

Route or route-group structure:

```txt
app/(org)/jobs/[jobId]/
  page.tsx
  loading.tsx
  error.tsx
  components/
    job-header.tsx
    job-timeline.tsx
  actions.ts
  queries.ts
  validators.ts
```

- Use business route names: `customers`, `jobs`, `schedule`, `invoices`, `estimates`, `settings`.
- Avoid vague route names: `data`, `management`, `screens`, `modules`.

## Naming Conventions

Names should be boring, searchable, and obvious.

- Files and folders: kebab-case, like `job-timeline.tsx`, `create-job-form.tsx`, `customer-address-card.tsx`.
- React components: PascalCase, like `JobTimeline`, `CreateJobForm`, `InvoiceStatusBadge`.
- Server actions: verb-first and usually end with `Action`, like `createJobAction`, `assignTechnicianAction`, `recordPaymentAction`.
- Queries: use `get`, `find`, or `list`: `getJobById`, `findCustomerByEmail`, `listTechnicianAppointments`.
- Business logic: clear domain verbs, like `createJob`, `scheduleAppointment`, `generateInvoiceFromJob`.
- Validators: camelCase with `Schema`, like `createJobSchema`, `recordPaymentSchema`.
- Input/output types: PascalCase, like `CreateJobInput`, `RecordPaymentInput`, `SendInvoiceResult`.
- Prisma models: singular PascalCase, like `Job`, `Customer`, `Invoice`, `OrgMember`.
- Table maps: plural snake case, like `@@map("jobs")`, `@@map("job_timeline_events")`.
- Database fields: camelCase, like `organizationId`, `assignedTechnicianId`, `scheduledStartAt`.
- Enums: PascalCase enum names and SCREAMING_SNAKE_CASE values.
- Permissions: dot-based strings, like `jobs.create`, `jobs.assignTechnician`, `invoices.recordPayment`.
- Feature flags: kebab-case in DB/config, like `customer-portal`, `online-payments`, `review-requests`.

Use consistent suffixes:

- `At` for timestamps: `createdAt`, `sentAt`, `paidAt`, `completedAt`.
- `Date` for calendar dates: `issueDate`, `dueDate`, `serviceDate`.
- `Cents` for stored money: `subtotalCents`, `taxCents`, `totalCents`.

Avoid vague names like `handleThing`, `processData`, `doStuff`, `submitHandler`, `Data`, `Item`, `Payload`, `Response`, or `Result` unless scoped, such as `CreateJobResult`.

## Auth, Permissions, and Actions

Use the shared auth/action foundation by default:

- Use `getCurrentUser`, `requireCurrentUser`, `getAuthContext`, or `requireAuthContext` for current user and permission data.
- If another method is needed to find the current user or check permissions, ask first.
- If viewing a page requires a permission, call `requirePermission` from the auth context at the top of the page or shared layout before loading protected content.
- Use `hasPermission` / `hasPermissions` from the auth context for conditional logic that does not need to redirect.
- Use the `Restricted` server component for permission-gated UI fragments, with a clear fallback when the missing content needs explanation.
- Put permission checks that cover multiple related pages in a shared layout instead of repeating the same check on every page.
- All server actions should use `createSafeAction` unless there is a strong reason it does not fit; ask first when it does not fit.
- Every action should have an appropriate Zod validator for its input.
- Use `actionError` for expected action failures like `NOT_FOUND`, `CONFLICT`, or `EXPIRED` instead of throwing generic errors.
- When handler-side business validation maps to a field, pass `fieldErrors` to `actionError` so forms can highlight the exact field.
- Add `audit` metadata to safe actions where it is useful for business history or accountability.
- Audit only non-sensitive information. Never audit passwords, secret keys, auth tokens, raw credentials, private API responses, or full payloads that may contain those values.
- Keep form submit wrappers separate where possible. For example, convert `FormData` with `formDataToObject`, then pass the object into the safe action.
- Prefer the helpers in `apps/web/src/lib/auth` and `apps/web/src/lib/actions` for most new auth, permission, and mutation work.

## Logging

Use the shared logger adapter for meaningful server-side diagnostics.

- Include useful context like entity IDs, action names, organization IDs, and timing when it helps debugging.
- Do not log passwords, secret keys, auth tokens, raw credentials, private API responses, or unsafe full payloads.
- Prefer structured context over string-concatenated log messages.

## Required Quality

Every feature should include:

- Loading state
- Error state
- Empty state if relevant
- Success/failure feedback
- Proper disabled states during async actions
- Confirmation for dangerous actions
- Unsaved-change protection where needed
