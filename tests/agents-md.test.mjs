import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("AGENTS.md names every npm script a change must pass", () => {
  const agents = read("AGENTS.md");
  const scripts = Object.keys(JSON.parse(read("package.json")).scripts);
  for (const name of scripts) {
    const command = name === "test" ? "npm test" : `npm run ${name}`;
    assert.ok(agents.includes(command), `AGENTS.md does not name ${command}`);
  }
});

test("AGENTS.md says the site serves a copy of the skill", () => {
  assert.ok(read("AGENTS.md").includes("/.well-known/agent-skills/sakaira/SKILL.md"));
});
