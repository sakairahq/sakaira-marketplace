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
