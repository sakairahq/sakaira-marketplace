// The manifests of every client must describe the same plugin. This file is the one place that
// says what "the same" means; bump VERSION here and in every manifest together.
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PLUGIN_DIR = join(ROOT, "plugins/sakaira");
const read = (path) => JSON.parse(readFileSync(join(ROOT, path), "utf8"));

const NAME = "sakaira";
const MARKETPLACE = "sakaira-marketplace";
const VERSION = "1.0.0";
const SERVER_URL = "https://mcp.sakaira.com/mcp";
const DESCRIPTION =
  "Make AI images, video, voiceovers and music, and edit video, from your assistant. Paid in credits.";
const KEYWORDS = [
  "mcp",
  "mcp-server",
  "remote-mcp",
  "ai-image-generation",
  "ai-video",
  "text-to-speech",
  "image",
  "video",
  "voice",
  "music",
];
const AGENT_PLUGINS = "https://agent-plugins.org/schemas/1.0.0";

const plugins = {
  "plugins/sakaira/.claude-plugin/plugin.json": read("plugins/sakaira/.claude-plugin/plugin.json"),
  "plugins/sakaira/.cursor-plugin/plugin.json": read("plugins/sakaira/.cursor-plugin/plugin.json"),
  "plugins/sakaira/plugin.json": read("plugins/sakaira/plugin.json"),
};
const portable = plugins["plugins/sakaira/plugin.json"];
const codex = portable.extensions?.["com.openai"]?.interface;

test("the three plugin manifests describe the same plugin", () => {
  for (const [file, manifest] of Object.entries(plugins)) {
    assert.equal(manifest.name, NAME, file);
    assert.equal(manifest.version, VERSION, file);
    assert.equal(manifest.description, DESCRIPTION, file);
    assert.equal(manifest.license, "Apache-2.0", file);
    assert.equal(manifest.homepage, "https://sakaira.com", file);
    assert.equal(manifest.repository, "https://github.com/sakairahq/sakaira-marketplace", file);
    assert.equal(manifest.author?.name, "Sakaira", file);
    assert.deepEqual(manifest.keywords, KEYWORDS, file);
  }
});

test("each marketplace lists only the sakaira plugin, in plugins/sakaira", () => {
  const claudeFile = ".claude-plugin/marketplace.json";
  const claude = read(claudeFile);
  assert.equal(claude.name, MARKETPLACE, claudeFile);
  assert.equal(claude.version, VERSION, claudeFile);
  assert.equal(claude.owner?.name, "Sakaira", claudeFile);
  assert.equal(claude.plugins.length, 1, claudeFile);
  assert.equal(claude.plugins[0].name, NAME, claudeFile);
  assert.equal(claude.plugins[0].source, "./plugins/sakaira", claudeFile);
  assert.equal(claude.plugins[0].version, VERSION, claudeFile);
  assert.equal(claude.plugins[0].description, DESCRIPTION, claudeFile);

  const cursorFile = ".cursor-plugin/marketplace.json";
  const cursor = read(cursorFile);
  assert.equal(cursor.name, MARKETPLACE, cursorFile);
  assert.deepEqual(cursor.owner, { name: "Sakaira", email: "supportappsmaker@gmail.com" }, cursorFile);
  assert.equal(cursor.plugins.length, 1, cursorFile);
  assert.equal(cursor.plugins[0].name, NAME, cursorFile);
  assert.equal(cursor.plugins[0].source, "plugins/sakaira", cursorFile);
  assert.equal(cursor.plugins[0].description, DESCRIPTION, cursorFile);

  const codexFile = ".agents/plugins/marketplace.json";
  const codexMarket = read(codexFile);
  assert.equal(codexMarket.name, MARKETPLACE, codexFile);
  assert.equal(codexMarket.plugins.length, 1, codexFile);
  assert.equal(codexMarket.plugins[0].name, NAME, codexFile);
  assert.deepEqual(
    codexMarket.plugins[0].source,
    { source: "local", path: "./plugins/sakaira" },
    codexFile,
  );
  assert.deepEqual(
    codexMarket.plugins[0].policy,
    { installation: "AVAILABLE", authentication: "ON_INSTALL" },
    codexFile,
  );
  assert.equal(codexMarket.plugins[0].category, "Creativity", codexFile);
});

test("both MCP files declare only the sakaira server, at the production URL", () => {
  assert.deepEqual(read("plugins/sakaira/.mcp.json"), {
    mcpServers: { sakaira: { type: "http", url: SERVER_URL } },
  });
  assert.deepEqual(read("plugins/sakaira/mcp.json"), {
    $schema: `${AGENT_PLUGINS}/mcp.schema.json`,
    mcpServers: { sakaira: { type: "streamable-http", url: SERVER_URL } },
  });
});

test("no manifest pre-registers an OAuth client", () => {
  const jsonFiles = (dir) =>
    readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      if (entry.name === "node_modules" || entry.name === ".git") return [];
      const path = join(dir, entry.name);
      if (entry.isDirectory()) return jsonFiles(path);
      return entry.name.endsWith(".json") ? [path] : [];
    });
  for (const file of jsonFiles(ROOT)) {
    assert.doesNotMatch(readFileSync(file, "utf8"), /client_?id|"oauth"/i, file);
  }
});

test("the Agent Plugins plugin.json uses only the keys its schema allows", () => {
  const allowed = new Set([
    "$schema",
    "name",
    "version",
    "description",
    "author",
    "homepage",
    "repository",
    "license",
    "keywords",
    "extensions",
  ]);
  assert.equal(portable.$schema, `${AGENT_PLUGINS}/plugin.schema.json`);
  for (const key of Object.keys(portable)) assert.ok(allowed.has(key), `unexpected key ${key}`);
});

test("every file a manifest points at exists in the plugin", () => {
  const paths = [
    plugins["plugins/sakaira/.claude-plugin/plugin.json"].icon,
    plugins["plugins/sakaira/.cursor-plugin/plugin.json"].logo,
    plugins["plugins/sakaira/.cursor-plugin/plugin.json"].mcpServers,
    codex.composerIcon,
    codex.logo,
  ];
  for (const path of paths) {
    assert.equal(typeof path, "string");
    assert.ok(!path.includes(".."), path);
    assert.ok(existsSync(join(PLUGIN_DIR, path)), `${path} is missing`);
  }
});

// WCAG relative luminance, for Codex's rule that brandColor reads on white (at least 2:1).
const channel = (value) => {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};
const luminance = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => channel(Number.parseInt(hex.slice(i, i + 2), 16)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

test("the Codex interface meets OpenAI's limits", () => {
  assert.ok(codex, "extensions.com.openai.interface is missing");
  assert.equal(codex.displayName, "Sakaira");
  assert.ok(codex.shortDescription.length <= 30, "shortDescription over 30 characters");
  assert.ok(codex.longDescription.length > 0 && codex.longDescription.length <= 4000);
  assert.ok(codex.developerName.length <= 80);
  assert.equal(codex.category, "Creativity");
  assert.ok(Array.isArray(codex.capabilities) && codex.capabilities.length <= 20);
  for (const key of ["websiteURL", "supportURL", "privacyPolicyURL", "termsOfServiceURL"]) {
    assert.match(codex[key], /^https:\/\/sakaira\.com/, key);
  }
  assert.ok(codex.defaultPrompt.length >= 1 && codex.defaultPrompt.length <= 3);
  for (const prompt of codex.defaultPrompt) {
    assert.ok(prompt.length <= 128 && !prompt.includes("@"), prompt);
  }
  assert.match(codex.brandColor, /^#[0-9a-f]{6}$/i);
  assert.ok(1.05 / (luminance(codex.brandColor) + 0.05) >= 2, "brandColor under 2:1 on white");
  assert.match(codex.composerIcon, /^\.\/assets\//);
  assert.match(codex.logo, /^\.\/assets\//);
});

test("the logos are square and at least 48 px", () => {
  const png = readFileSync(join(PLUGIN_DIR, "assets/logo.png"));
  const [width, height] = [png.readUInt32BE(16), png.readUInt32BE(20)];
  assert.equal(width, height);
  assert.ok(width >= 48);
  const svg = readFileSync(join(PLUGIN_DIR, "assets/logo.svg"), "utf8");
  const size = (attr) => Number(svg.match(new RegExp(`<svg[^>]*\\s${attr}="(\\d+)"`))?.[1]);
  assert.equal(size("width"), size("height"));
  assert.ok(size("width") >= 48);
});
