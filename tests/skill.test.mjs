// The skill loads in Claude (Code and claude.ai), Codex, Cursor, Hermes, OpenClaw and through
// `npx skills`. These are the strictest of their rules together (spec §3 F2, F7, F10).
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SKILLS_DIR = join(ROOT, "plugins/sakaira/skills");

/** Splits a SKILL.md into its one-line `key: value` frontmatter and its body. */
function parse(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  assert.ok(match, "SKILL.md must start with a --- frontmatter block on line 1");
  const fields = {};
  for (const line of match[1].split("\n")) {
    const pair = line.match(/^([a-z-]+): (.+)$/);
    assert.ok(pair, `frontmatter lines must be one-line "key: value", got: ${line}`);
    fields[pair[1]] = pair[2].replace(/^"(.*)"$/, "$1");
  }
  return { fields, body: match[2] };
}

test("the plugin has exactly one skill, sakaira", () => {
  assert.deepEqual(readdirSync(SKILLS_DIR), ["sakaira"]);
});

const text = readFileSync(join(SKILLS_DIR, "sakaira/SKILL.md"), "utf8");
const { fields, body } = parse(text);

test("the frontmatter uses only keys every client accepts", () => {
  assert.deepEqual(Object.keys(fields).sort(), ["description", "license", "name"]);
  assert.equal(fields.license, "Apache-2.0");
});

test("the name matches its folder and Hermes' limits", () => {
  assert.equal(fields.name, "sakaira");
  assert.match(fields.name, /^[a-z0-9-]{1,64}$/);
});

test("the description is 1-1024 characters and names Sakaira", () => {
  assert.ok(fields.description.length >= 1 && fields.description.length <= 1024);
  assert.match(fields.description, /Sakaira/);
});

test("the skill stays short", () => {
  assert.ok(text.split("\n").length <= 150, "SKILL.md over 150 lines");
});

test("it sends the user to connect when the tools are missing, and agents to the reference", () => {
  assert.match(body, /https:\/\/sakaira\.com\/connect/);
  assert.match(body, /https:\/\/sakaira\.com\/mcp\.md/);
});

test("it copies no prices: the catalog is read live", () => {
  const prices = body.match(/\b\d[\d,.]*\s*credits?\b/g) ?? [];
  assert.deepEqual(prices.filter((p) => p !== "500 credits"), []);
});
