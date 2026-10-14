import assert from "node:assert/strict";
import { test } from "node:test";
import { toolMentions, toolsInMcpMd, unknownTools } from "../scripts/check-skill-tools.mjs";

const MD = [
  "# Sakaira MCP server",
  "## Tools",
  "### create_image",
  "Generate images.",
  "### get_job",
  "### transcribe",
  "## Credits",
].join("\n");

test("the live tools are mcp.md's ### headings", () => {
  assert.deepEqual([...toolsInMcpMd(MD)].sort(), ["create_image", "get_job", "transcribe"]);
});

test("the skill's tool mentions are its backticked snake_case words, once each", () => {
  const skill = "Call `create_image`, then `get_job`; `create_image` again. Pass image_url and `x`.";
  assert.deepEqual(toolMentions(skill), ["create_image", "get_job"]);
});

test("a backticked tool missing from mcp.md is reported", () => {
  assert.deepEqual(unknownTools("Use `create_image` or `add_watermark`.", MD), ["add_watermark"]);
});
