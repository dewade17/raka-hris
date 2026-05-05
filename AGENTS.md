<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

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
<!-- END:nextjs-agent-rules -->
