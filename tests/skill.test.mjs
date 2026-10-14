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
    fields[pair[1]] = pair[2];
  }
  return { fields, body: match[2] };
}

/**
 * Why a one-line value would not parse as itself in YAML (Claude Code and claude.ai read the
 * frontmatter as YAML), or null. Values stay unquoted, so they must avoid ": ", " #" and a leading
 * indicator character.
 */
function plainYamlProblem(value) {
  if (value.includes(": ")) return 'contains ": ", which YAML reads as a mapping';
  if (value.includes(" #")) return 'contains " #", which YAML reads as a comment';
  if (/^[>|'"[\]{}&*!%@`#,?:-]/.test(value)) return `starts with the indicator ${value[0]}`;
  if (value !== value.trim()) return "has leading or trailing spaces";
  return null;
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

test("it looks for Sakaira's tools and its sign-in before sending the user to connect again", () => {
  assert.match(body, /search your tools for "sakaira"/i);
  assert.match(body, /\/mcp/);
});

test("it checks a job named by an internal error before calling again, which could charge twice", () => {
  assert.match(body, /internal[^\n]*`get_job`[^\n]*before/i);
});

test("it sets the parameters that change what music and voiceovers come out as", () => {
  assert.match(body, /instrumental/);
  assert.match(body, /\bstyle\b/);
});

test("the YAML check rejects plain values a YAML parser rejects or cuts short", () => {
  assert.equal(plainYamlProblem("Make images. Use when asked."), null);
  assert.match(plainYamlProblem("Triggers: make images"), /": "/);
  assert.match(plainYamlProblem("Sakaira tools #media. Use when"), /" #"/);
  assert.match(plainYamlProblem("> folded"), /indicator/);
  assert.match(plainYamlProblem("'quoted"), /indicator/);
});

test("every frontmatter value is a plain YAML scalar that parses to itself", () => {
  for (const [key, value] of Object.entries(fields)) assert.equal(plainYamlProblem(value), null, key);
});
