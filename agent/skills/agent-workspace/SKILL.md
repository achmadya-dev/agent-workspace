---
name: agent-workspace
description: Use the registered capabilities in this workspace safely.
version: 0.1.0
author: Madya (achmadya-dev), Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [capabilities, workspace, structured-json]
    related_skills: []
---

# Agent Workspace Skill

Use the repository CLI as the execution boundary for capabilities registered in
this workspace. Do not bypass the registry with arbitrary shell commands or
direct provider APIs.

## Procedure

1. Run `agent-workspace list` to discover available capabilities.
2. Run `agent-workspace describe --capability <name>` to discover the exact
   registered skills and parameters.
3. Run the selected skill through `agent-workspace run ...`.
4. Check the exit code and parse the JSON response. A nonzero exit code or
   `ok: false` is a failure; never invent a replacement result.

Capability names and parameter schemas can evolve. Always discover them at
runtime instead of copying a schema into this skill.

## Safety

- Treat external mutations as requiring an explicit approval flow defined by
  the capability and its owning project.
- Never expose credentials, OAuth tokens, API keys, or private resource IDs.
- Use only registered behavior. Report a missing capability instead of
  bypassing the registry.

## Verification

A successful read-only call has exit code zero and a bounded JSON result. For
mutations, verify the returned status and resource result according to the
capability's documented contract.
