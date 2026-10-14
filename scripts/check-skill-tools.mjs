// Checks that every tool the skill names is live on Sakaira's server, by reading the public tool
// reference. Run by CI on every push: a renamed or removed tool fails the build instead of
// shipping a skill that sends agents to a tool that no longer exists. Tool names in SKILL.md are
// written in backticks, and parameters are not.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const MCP_MD_URL = "https://sakaira.com/mcp.md";
const SKILL = new URL("../plugins/sakaira/skills/sakaira/SKILL.md", import.meta.url);

/** The live tools: every `### name` heading of mcp.md. */
export function toolsInMcpMd(md) {
  return new Set([...md.matchAll(/^### ([a-z][a-z0-9_]*)\s*$/gm)].map((m) => m[1]));
}

/** The tools a skill names: every backticked snake_case word, once each. */
export function toolMentions(skill) {
  return [...new Set([...skill.matchAll(/`([a-z][a-z0-9]*(?:_[a-z0-9]+)+)`/g)].map((m) => m[1]))];
}

/** The tools a skill names that mcp.md doesn't list. */
export function unknownTools(skill, md) {
  const live = toolsInMcpMd(md);
  return toolMentions(skill).filter((tool) => !live.has(tool));
}

async function main() {
  const response = await fetch(MCP_MD_URL);
  if (!response.ok) throw new Error(`${MCP_MD_URL} answered ${response.status}`);
  const md = await response.text();
  const live = toolsInMcpMd(md);
  if (live.size < 10) {
    throw new Error(`only ${live.size} tools found in ${MCP_MD_URL}: has its format changed?`);
  }
  const skill = readFileSync(SKILL, "utf8");
  const unknown = unknownTools(skill, md);
  if (unknown.length > 0) {
    console.error(`SKILL.md names tools that aren't live: ${unknown.join(", ")}`);
    process.exit(1);
  }
  console.log(`ok: SKILL.md names ${toolMentions(skill).length} tools, all live (${live.size} live)`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main();
