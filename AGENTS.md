# Agent Workspace Contract

## Architecture

- Execution follows `registry → validate → handler`.
- `src/registry.ts` is the composition root. Capabilities may depend on core and
  their own domain files; they must not import concrete implementations from
  sibling capabilities.
- `agent-workspace list` and `agent-workspace describe --capability <name>` are
  the source of truth for available behavior and parameters.
- CLI results are structured JSON. A nonzero exit code or `ok: false` is a
  failure; never invent a replacement result.

## Safety

- Read-only registered skills may run directly.
- If a capability performs an external mutation, follow the approval contract
  defined by that capability before executing it.
- Never expose credential values, OAuth tokens, private resource IDs, or API
  keys in logs, tests, documentation, or Git.
- Do not bypass a missing capability with direct provider APIs or arbitrary shell
  commands.

## Development

- Add behavior as a focused module under `src/capabilities/<domain>/` and
  register it in `src/registry.ts`.
- Use a failing focused test, minimal implementation, focused pass, then the
  full suite when adding behavior.
- Keep dynamic parameter definitions in the registry; skills and documentation
  should direct callers to `describe`, not copy schemas that can drift.
- Do not edit a protected/default branch, commit, push, merge, or publish
  without explicit approval.

## Verification

Run from the repository root:

```bash
bun run typecheck
bun run test
agent-workspace list
```
