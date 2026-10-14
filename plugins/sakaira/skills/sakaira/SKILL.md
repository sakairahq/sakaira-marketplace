---
name: sakaira
description: Make and edit images, video, voiceovers and music with Sakaira's MCP tools. Use when the user asks to generate or edit an image, logo, illustration, product shot, video, clip, reel, animation, voiceover, narration, song or background music; to remove a background, upscale or restore a photo; to cut, resize, reframe, mute or join a video, turn it into a GIF, or pull frames or audio from it; to transcribe or clean up audio; to save or apply a brand kit; or when they mention Sakaira or its credits.
license: Apache-2.0
---

# Sakaira

Sakaira is a remote MCP server with the top AI image, video and audio models. This skill says when to use its tools and how to get a good result on the first try. For how to report a result, follow the server's own instructions.

## 1. Check that Sakaira is connected

If you don't see tools such as `create_image` and `check_balance`, search your tools for "sakaira" first: some assistants keep them behind a search. If Sakaira is listed but needs sign-in, ask the user to sign in (in Claude Code: type /mcp and choose sakaira). Only when it isn't there at all, say that Sakaira isn't connected yet and link https://sakaira.com/connect, which has a one-minute guide for each assistant. Never describe a file as made when no tool made it.

## 2. Brand first

Before making anything for the user's brand (a post, an ad, a banner, a voiceover), call `get_brand_kit` and follow its how_to_use:
- put its colors, fonts and tone into the prompt;
- pass its logo or reference image URLs only when the piece should show them, and never ask a model to redraw the logo;
- use its voice for voiceovers unless the user picks another.

If there is no kit and the user describes their brand, offer to save it with `save_brand_kit`.

## 3. Pick the tool

| The user wants | Tool |
| --- | --- |
| An image, or an edit of an image | `create_image` |
| A video, or an image brought to life | `create_video` |
| A voiceover or narration | `create_voiceover` |
| Music or a song | `create_music` |
| A transparent background | `remove_background` |
| A bigger, sharper image | `upscale_image` |
| An old or damaged photo fixed | `restore_image` |
| A part of a video or audio file | `cut_video` |
| A video reframed, e.g. vertical for social | `resize_video` |
| A GIF | `video_to_gif` |
| Stills from a video | `extract_frames` |
| A video's sound as audio | `extract_audio` |
| A video without sound | `remove_audio` |
| Music or a voiceover over a video, or clips joined | `stitch_media` |
| A transcript | `transcribe` |
| A voice cleaned of noise | `enhance_audio` |

## 4. Pick the model

- If the user named a model, use it.
- Otherwise the tool's default model is a good all-rounder: use it.
- When the request needs something specific (legible text, a vector logo, the same character across shots, lip-sync, 4K, a long single shot, the cheapest draft), call `list_models` with the category and pick by each model's description. Then call `describe_model` for its options and pricing rule.
- Never invent a model id, a parameter or a voice: use only what `list_models` and `describe_model` return.
- Say which model you used.

## 5. Write the prompt

Turn the request into a full prompt. Keep the user's own words, names and any text to show exactly as they wrote them.

- **Image:** subject, setting, style or medium, lighting, composition, colors; text to show goes in quotes. Set the size with the width and height parameters, not in the prompt.
- **Image edit:** pass the image as image_url and say only what changes and what must stay.
- **Video:** one shot: the subject, what happens, the camera's movement, the setting, light and sound. Set duration, aspect_ratio and resolution as parameters. For a product or a character, pass its image as image_url (the first frame) or in reference_image_urls.
- **Voiceover:** the exact script, punctuated for the pauses you want, and a voice from `describe_model`. Where the model takes a style, say how to read it ("warm and slow").
- **Music:** genre, mood, tempo, instruments and length. For background music, set instrumental to true, since some models sing by default; give lyrics only when the user wants vocals.

Tell the user in one sentence what you're about to make. Don't ask questions that the defaults answer.

## 6. Run it

- Images and most edits come back in the same reply.
- Videos and other long jobs return a job_id. Call `get_job` with it until the status is succeeded or failed; a video takes about 1–5 minutes.
- A job above 500 credits returns a quote instead of running. Show the quote, and call again with confirm set to true only after the user agrees.
- If a reply is lost or times out, call `get_job` without a job_id to find the job. Don't generate again: that would charge twice.
- On an error, read its retryable flag and message. With internal, if the message names a job, call `get_job` before calling again: the job may have finished and been charged. Fix the field an invalid_input names and call again. With tool_disabled, pick another model. With too_many_active_jobs, wait for a job to finish. With insufficient_credits, tell the user: `check_balance` shows their credits, and `buy_credits` is only for when they ask to buy.

## 7. Report and iterate

Report each result as the server asks, with its link. Then offer the most useful next step, passing the result's URL as the input:
- a vertical version for social with `resize_video`;
- a GIF with `video_to_gif`;
- a voiceover over the clip with `create_voiceover`, then `stitch_media`;
- a cut-out with `remove_background`, or a larger image with `upscale_image`.

For a variation, change one thing in the prompt at a time, and keep the seed when the model takes one.

## 8. More

Every tool's parameters, the credit rules and the error codes are at https://sakaira.com/mcp.md. If something about Sakaira itself goes wrong or is missing, `send_feedback` tells the team.
