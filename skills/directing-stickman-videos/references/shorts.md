# S · Shorts (vertical 9:16) for B · Autopilot

A delivery layer on top of any B style (B1–B4), not a new visual style. Use it when the user asks for YouTube Shorts, Reels, TikTok, "vertical" or `9:16`. The selected B style still owns its drawing grammar, palette, voice default and SFX; this file changes **format, pacing, approval scope, layout and packaging**. Where a rule here conflicts with a B-style rule that only exists because of landscape/long-form, this file wins for the Short; style identity rules still win.

Read this file, the selected B-style reference and [autopilot.md](autopilot.md) before planning. Platform facts below were checked in November 2026; re-check anything that matters for a decision (length cap, monetization thresholds, policy names) because platforms change.

## 1. Settings to resolve once per channel (the "series bible")

Ask once, record in the project/channel checkpoint, never re-ask per episode:

- **Language and variant.** Spanish needs an explicit audience choice: neutral Latin American, Mexican or Spain Spanish (vocabulary, `vosotros`/`ustedes`, voice accent). Most Spanish speakers live in Latin America, so do not assume Spain Spanish because the creator is in Spain; let the target audience decide. Record it.
- **Voice.** A native voice for the chosen variant from the user's provider; audition 2–3 candidates on the same 2 lines and let the user pick. Follow B's rule: no speed changes, no invented performance tuning. Spanish runs longer than English for the same idea; cut words, never speed up the voice.
- **Recurring character.** One own protagonist (name, silhouette, one signature prop or colour) reused in every episode. This is the channel's identity and its main defence against "mass-produced/templated" judgments. Never reuse a reference channel's character, name or design.
- **Format family.** 1–3 repeatable formats (for example: "dato raro de animales", "historia random en 40 s", "¿qué pasaría si…?"). Each episode varies topic, scenes and jokes inside the format; the format is not a template to copy-paste.
- **Audience and "made for kids".** Decide honestly whether the channel is directed at children. Cartoon animals can be read as kids' content. This setting changes comments, recommendations and ads; it is the user's legal decision, not the assistant's. Record it.
- **Default length.** Story and fact formats: 40–70 s (in November 2026, 7 of 8 sampled top Shorts from a 7 M-subscriber Spanish animated channel ran 57–80 s). Jokes and fiction lists: 30–45 s. Shorts accept up to 3 minutes (since 15 Oct 2024); length follows the story, never padding.

## 2. Reference channels: learn patterns, never clone

Users often say "clone this channel". Translate that into **pattern research**, and say so plainly:

- Allowed: list a reference channel's best-performing Shorts (via the user's connected analytics tools or public pages), then extract a pattern table: topic family, hook type, length, title formula, first-frame composition, ending type, posting cadence. Identify gaps: topics they do not cover, angles they repeat, comments asking for more.
- Produce **original** episode ideas from the gaps, with a different character, voice, wording, jokes and visual design.
- Not allowed: re-creating a specific video, script, plot, joke sequence, title, character, art or channel branding; translating someone's script; using their footage or audio. Besides rights, YouTube's October 2026 ranking update reduces reach for content that adds nothing new, and the "inauthentic content" monetization policy targets mass-produced or repetitive uploads, judged at channel level.
- Record the reference research (sources, date, patterns) in the checkpoint so later episodes reuse it without re-scraping.

## 3. Script contract (Spanish-first)

One idea per Short. Write the full spoken script before any visual planning.

| Beat | Time (40 s example) | Job |
|---|---|---|
| **Hook** | 0–1.5 s | First spoken words from frame 1 (voice `lead` 0–0.15 s). A concrete claim, contradiction, consequence or direct question. No greeting, channel name, title card or "en este vídeo". The first frame already shows the subject and a 2–5 word headline. |
| **Setup** | 1.5–8 s | Make the viewer need the answer: stakes, a wrong assumption, or a mini-mystery. |
| **Escalation** | 8–30 s | 2–4 progressive reveals, each with a new picture. Every reveal is more surprising than the last. |
| **Payoff** | ~30–36 s | The answer/twist, the strongest image of the video. |
| **Loop / exit** | last 2–4 s | End on the payoff or a line that flows back into the opening line. No spoken "suscríbete" outro, no fade to black, no end card. |

- **Word budget (heuristic):** about 2.4–2.8 Spanish words per second of natural TTS; 40 s ≈ 95–110 words. Measure the actual synthesized track and cut words if long.
- **Sentences:** short, spoken, concrete nouns and verbs; numbers said simply; one claim per sentence.
- **Facts:** every factual claim needs a source recorded in the checkpoint (animal/science facts are the most common misinformation in this niche). If a fact cannot be verified, cut it or frame it as a story/hypothetical.
- **Hook variants:** write 3 alternative hooks per episode; the user picks one at script approval. Keep the others for re-tests.
- **Retention devices (use 1–2, not all):** open loop answered at the payoff; countdown/list with the best item last; "pero" turn at the midpoint; a visual question answered on screen; callback to the first image at the end.

## 4. Vertical composition

Runtime coordinates use the 1280-unit-wide design plane (height 2276 for 9:16). Safe area (conservative, cross-platform): x 5–88 %, y 11.5–80 % of the frame. Platform UI covers the top bar, the bottom title/channel/description area and the right-hand button column.

- **Headline band:** y ≈ 12–25 %. 2–5 words, large (80–110 plane units), visible from the first frame of each section; colour one key word.
- **Action zone:** y ≈ 25–62 %. The character's face and the main action live here. Make the character big: at least ~35–45 % of frame height in most shots.
- **Captions:** default y = 68 % (`captionY`), size 64 plane units, single line of 2–5 words. Do not move captions below 80 %. `burnCaptions: false` keeps the timed captions (required, exported as .srt/.vtt) but does not paint them, for projects that draw their own caption layers (e.g. word-by-word karaoke).
- **Never** put text, faces or key props in the right ~12 % between 40–80 % height.
- **Pace:** a new picture event (cut, reveal, prop arrival, expression change) every 1–2 s; principal-picture inactivity never above 2 s (stricter than B's 2.5 s).
- **Vertical motion:** drop-ins from the top, rises from the bottom, stacking, push-ins toward the face. Avoid long lateral pans built for 16:9.
- **First frame = the cover.** The Shorts feed shows the video, not the thumbnail. Frame 0 must read as a complete, intriguing image with headline and subject.

## 5. Runtime (vertical)

```bash
node scripts/autopilot.mjs init /abs/project --style B1 --shorts      # 1080x1920, 30 fps
node scripts/autopilot.mjs captions words.json captions.json --shorts  # 2–5 word cues, comma breaks
node scripts/autopilot.mjs validate /abs/project/project.json          # includes safe-zone status/problems
node scripts/autopilot.mjs safezone /abs/project/project.json          # writes output/safezone.png review sheet
node scripts/autopilot.mjs preview  /abs/project/project.json --seconds <full length if ≤ 60>
```

- Vertical projects (height > width) automatically get: captions in the safe area at phone size, a 9:16 contact sheet, a `preview-safezone.png` overlay sheet, a safe-zone report (`safezone_status`), and two-pass programme loudness to −14 LUFS (static gain + true-peak limiter on the whole mix; voice/SFX balance unchanged). Override with `loudness` (−24…−9, or `null` to disable), `captionY` (0.3–0.8) and `captionSize` (≤ 110).
- A `needs_repair` safe-zone status means text or captions are hidden by platform UI: move the layer, do not shrink everything. Image "notes" are informational (a character may cross an edge if its face/action stays visible).
- An overlong caption fails with a hint: regenerate cues with `captions --shorts` or split at a semantic boundary.

## 6. Approval flow for Shorts

The B flow (script → ~20 s sample → full film) collapses because a Short is about as long as the sample:

1. **Series bible** approved once (section 1). Changing it requires a new pilot review.
2. **Script batch:** propose 3–5 episode scripts at once (with 3 hooks each, sources, and planned key images). The user approves/edits per script.
3. **Pilot:** for the first episode of a new bible, render the full Short as the preview, have the user watch it with sound, then `approve` and `render`. For Shorts ≤ 60 s the full film reuses the preview's shot cache.
4. **Later episodes:** still require the user to review the actual preview before `approve`; never self-approve. Batch reviews are fine (several previews in one message).

## 7. Sound for Shorts

Voice first, always intelligible on a phone speaker. A recognisable SFX on most picture events (pop, whoosh, tap) helps rhythm; keep the story-led rules of the [sound system](autopilot-sound-system.md). Music only if licensed for the platform; trending platform audio cannot be baked in by the renderer and must be added in the platform app if wanted.

## 8. Shorts publishing kit

Extends the [Thumbnail & Publishing Kit](thumbnail-publishing-kit.md); offer it under the same rules. For a Short deliver:

1. **Title:** 3 variants, front-loaded with the subject, ≤ ~40 characters so it is not truncated on phones, in the channel language. Accurate; no clickbait the video does not pay off.
2. **Cover:** a vertical 1080×1920 frame (usually frame 0 or the payoff frame) with the headline. Custom Shorts thumbnails exist since July 2026, but most viewers meet the Short in the feed without one, so the first frame matters more.
3. **Description:** 1–2 sentences + 3–5 relevant hashtags (including the series hashtag) + sources for factual claims.
4. **Pinned comment:** one genuine question tied to the payoff (for example, "¿Qué animal quieres en el próximo?").
5. **Placement:** series/playlist assignment (Shorts can be grouped into series since 23 Sep 2026), a "related video" link to another episode, and the planned publish time.
6. **Checklist:** safe-zone report pass, loudness report, captions spelled correctly (tildes, ¿¡, ñ), fact sources recorded, rights for every image/SFX/music, the channel's "made for kids" choice applied, synthetic-content disclosure if anything looks realistic (clearly animated cartoons usually do not need it; check current rules), and nothing copied from a reference channel.

## 9. Learning loop

After 48 h and 7 days per Short, ask the user for (or read via their analytics connector) **"viewed vs swiped away"**, average percentage viewed, engaged views and subscribers gained. Keep an episode log in the channel checkpoint (topic, format, hook type, length, results). Change one variable at a time (hook type, length, topic family) and prefer the patterns that hold across several episodes over a single outlier. Monetization note for planning: Shorts revenue sharing requires full Partner Program eligibility (1,000 subscribers plus either 10 M qualified Shorts views in 90 days or 4,000 long-form watch hours in 12 months; verify current thresholds) and Shorts pay far less per view than long-form; treat Shorts as audience growth unless the numbers say otherwise.
