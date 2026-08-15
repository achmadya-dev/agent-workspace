# Hermes Capability Workspace

Minimal TypeScript workspace for building explicit, auditable Hermes capabilities.
This public repository contains the registry contract and a small example only;
private integrations and production capability implementations are intentionally
kept out of this repository.

## Architecture

```text
src/
├── capabilities/
│   └── text.ts              # Minimal example capability
├── core/
│   ├── args.ts              # CLI parsing and parameter validation
│   ├── registry.ts          # Capability registry
│   └── types.ts             # Capability and skill contracts
├── registry.ts              # Composition root
└── cli.ts                   # JSON CLI entry point

test/
└── cli.test.ts

agent/
└── skills/                  # Optional repository-owned Hermes skills
```

Dependency direction: `capabilities -> core`. The registry is the only
composition root. Capability names, skills, and parameters are discovered from
the registry rather than duplicated in prompts or documentation.

## Requirements

- Bun `>=1.3.5`
- TypeScript `5.7`

## Running

```bash
bun install
bun run typecheck
bun test
bun run dev -- list
bun run dev -- describe --capability text
```

The project uses Bun as its runtime and package manager. `bun.lock` is the
canonical lockfile and should be committed for reproducible installs.

## CLI contract

```text
agent-workspace list
agent-workspace describe --capability <name>
agent-workspace run --capability <name> --skill <name> --<parameter> <value>
```

All successful commands emit JSON. Invalid capabilities, skills, missing
parameters, invalid types, and unsupported values return a nonzero exit code
with a structured error.

## Adding a capability

1. Add a focused module under `src/capabilities/<domain>/`.
2. Define its `CapabilityDefinition` and `SkillDefinition` using the contracts in
   `src/core/types.ts`.
3. Register it in `src/registry.ts`.
4. Add focused tests under `test/`.
5. Run `bun run typecheck && bun test`.

Keep provider-specific code inside the capability or a dedicated integration
module. Never execute arbitrary user input as a shell command.

## Environment

Copy `.env.example` only when an integration needs environment configuration.
Do not commit credentials, OAuth tokens, API keys, or private resource IDs.

## Hermes integration

The optional example skill under `agent/skills/agent-workspace/` directs an
agent to discover behavior dynamically with `list` and `describe`. Adapt it to
your own public capabilities; do not copy schemas into the skill because the
registry is the source of truth.
