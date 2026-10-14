# Sakaira

Sakaira is a remote MCP server that gives Claude, ChatGPT and other AI assistants access to the top AI image, video and audio models.

You ask your assistant in plain words. Sakaira makes the file and returns a link to it, with what it cost and the credits you have left.

## What it does

| Ask for | Tools | From |
| --- | --- | --- |
| Images, and edits of your own | `create_image` | 2 credits an image |
| Videos, many with sound | `create_video` | 2 credits a second |
| Voiceovers | `create_voiceover` | 2 credits per 1,000 characters |
| Music | `create_music` | 8 credits a track |
| Background removal, upscaling, photo restoration | `remove_background`, `upscale_image`, `restore_image` | 1 credit an image |
| Video edits: trim, resize, GIF, stills, MP3, mute, join or add music | `cut_video`, `resize_video`, `video_to_gif`, `extract_frames`, `extract_audio`, `remove_audio`, `stitch_media` | 10 credits an edit |
| Transcription and noise removal | `transcribe`, `enhance_audio` | 1.6 credits a minute |
| A brand kit every result follows | `save_brand_kit`, `get_brand_kit` | free |

69 models, including Nano Banana, GPT Image, FLUX, Veo, Kling, Seedance, ElevenLabs and Lyria. Every model and its price: [sakaira.com/models](https://sakaira.com/models).

## Install the plugin

The `sakaira` plugin adds the Sakaira server and a skill that helps your assistant pick the model, write the prompt and finish the job. Sign-in happens in your browser the first time a tool runs.

**Claude Code**

```sh
claude plugin marketplace add sakairahq/sakaira-marketplace
claude plugin install sakaira@sakaira-marketplace
```

Or, inside a session on Claude Code 2.1.275 or later, in one step: `/plugin install sakaira --marketplace sakairahq/sakaira-marketplace`. Then type `/mcp`, choose sakaira and sign in. Already added Sakaira with `claude mcp add`? Remove it first (`claude mcp remove sakaira`) so the tools don't show up twice.

**Claude on the web and desktop (paid plans)**

Customize → Plugins → Add marketplace → `sakairahq/sakaira-marketplace`. Install Sakaira, then click **Connect** on its Connectors tab. On the Free plan, add the connector instead: [sakaira.com/connect/claude](https://sakaira.com/connect/claude).

**Codex**

```sh
codex plugin marketplace add sakairahq/sakaira-marketplace
```

Then type `/plugins` in Codex, install Sakaira and sign in when it asks.

**Hermes Agent**

```sh
hermes mcp add sakaira --url https://mcp.sakaira.com/mcp --auth oauth --connect-timeout 300
hermes plugins install sakairahq/sakaira-marketplace/plugins/sakaira --enable
```

The first line adds the server and signs you in; the second adds the skill.

**OpenClaw**

```sh
openclaw mcp add sakaira --url https://mcp.sakaira.com/mcp --transport streamable-http --auth oauth
openclaw mcp login sakaira
openclaw plugins install sakaira --marketplace sakairahq/sakaira-marketplace --accept-capabilities
```

The first two lines add the server and sign you in; the third adds the skill.

**Cursor and Grok Bot**

The plugin is on its way to the Cursor Marketplace. Until then, Cursor connects in one click at [sakaira.com/connect/cursor](https://sakaira.com/connect/cursor).

**Only the skill, for any agent**

```sh
npx skills add sakairahq/sakaira-marketplace
```

## Connect

The server URL is `https://mcp.sakaira.com/mcp` (Streamable HTTP). Sign-in is OAuth 2.1, in your browser, with Google or your email. There is no API key.

- Claude: [sakaira.com/connect/claude](https://sakaira.com/connect/claude)
- ChatGPT: [sakaira.com/connect/chatgpt](https://sakaira.com/connect/chatgpt)
- Claude Code: `claude mcp add --transport http sakaira --scope user https://mcp.sakaira.com/mcp`
- Cursor, Codex, Grok, Hermes, OpenClaw and any other MCP client: [sakaira.com/connect](https://sakaira.com/connect)

## Price

You start with 100 free credits. Plans are from $19 a month. See [sakaira.com/pricing](https://sakaira.com/pricing).

## For agents and developers

Every tool's parameters, the credit rules and the error codes are at [sakaira.com/mcp](https://sakaira.com/mcp), with a Markdown copy at [sakaira.com/mcp.md](https://sakaira.com/mcp.md). The whole catalog is in one file at [sakaira.com/llms-full.txt](https://sakaira.com/llms-full.txt).

## What's inside

| Path | For |
| --- | --- |
| `.claude-plugin/marketplace.json`, `plugins/sakaira/.claude-plugin/plugin.json`, `plugins/sakaira/.mcp.json` | Claude Code and Claude |
| `.cursor-plugin/marketplace.json`, `plugins/sakaira/.cursor-plugin/plugin.json` | Cursor and Grok Bot |
| `.agents/plugins/marketplace.json`, `plugins/sakaira/plugin.json`, `plugins/sakaira/mcp.json` | Codex, Hermes and other [Agent Plugins](https://agent-plugins.org) clients |
| `plugins/sakaira/skills/sakaira/SKILL.md` | The skill, for every client |

## Contributing

Run `npm test` (manifests and skill rules) and `npm run check:tools` (every tool the skill names is live) before a pull request; `npm run validate` runs Claude Code's plugin validator. In SKILL.md, write tool names in backticks and parameters without them. Apache-2.0.
