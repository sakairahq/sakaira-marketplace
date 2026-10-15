# AGENTS.md

Instructions for AI coding agents working in this repository. To *use* Sakaira (make images, video, voiceovers and music), install the plugin as the README says; the skill in `plugins/sakaira/skills/sakaira/SKILL.md` tells an agent how.

## What this repo is

The Sakaira plugin for Claude Code and Claude, Cursor, Codex, Hermes and OpenClaw: one remote MCP server (`https://mcp.sakaira.com/mcp`, OAuth 2.1) and one skill. There is no server code here, only manifests and Markdown.

- `.claude-plugin/`, `.cursor-plugin/`, `.agents/plugins/`: one marketplace file per client family.
- `plugins/sakaira/`: the plugin itself. `.claude-plugin/plugin.json`, `.cursor-plugin/plugin.json` and `plugin.json` (Agent Plugins) describe the same plugin; `.mcp.json` and `mcp.json` declare the same server.
- `tests/`: the rules every change must keep (`node --test`, no dependencies).
- `scripts/check-skill-tools.mjs`: checks that every tool the skill names is live on https://sakaira.com/mcp.md.

## Before you finish

Run all three; CI runs them on every push:

- `npm test`: the manifests agree with each other, and the skill keeps its rules.
- `npm run check:tools`: every tool the skill names exists today (needs the network).
- `npm run validate`: Claude Code's plugin validator, in strict mode.

## Rules

- A version bump changes every manifest at once (see the top of `tests/manifests.test.mjs`).
- In SKILL.md, write tool names in backticks and parameters without them; copy no prices, since the catalog is read live with `list_models`.
- Keep the SKILL.md frontmatter to `name`, `description` and `license`, as plain YAML values.
- sakaira.com serves a copy of the skill at `/.well-known/agent-skills/sakaira/SKILL.md`, so a change to SKILL.md is copied there too.
- No manifest pre-registers an OAuth client: every client signs in on its own.

Every tool's parameters and the error codes: https://sakaira.com/mcp.md. License: Apache-2.0.
