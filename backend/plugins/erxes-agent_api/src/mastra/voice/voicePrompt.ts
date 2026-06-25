// Per-turn voice system prompt. A voice-originated chat turn is read aloud by
// Chimege TTS, so the reply must be short and spoken-style. This module owns the
// directive plus the pure combiner that folds it together with any
// slash-activated skill instructions for the turn. Kept separate from routes.ts
// so the selection logic is unit-testable without booting the chat route.

// Prepended to the per-turn system prompt for voice-originated turns only. The
// reply is spoken aloud, so markdown, lists, and length all hurt; this asks for
// one or two natural spoken sentences. Typed chat never sees it.
export const VOICE_BREVITY_SYSTEM = [
  'This turn is happening over VOICE: your reply will be read aloud by a',
  'text-to-speech voice. Answer the way a person would say it out loud, in a',
  'short and natural conversational style, usually one or two sentences. Do not',
  'use markdown, headings, bullet points, numbered lists, tables, code blocks,',
  'emoji, or links. If you need to mention several things, say them in a flowing',
  'sentence rather than a list. Be warm, direct, and easy to listen to, and',
  'reply in the same language the user spoke.',
].join(' ');

/**
 * The per-turn system message for a chat turn: the voice brevity directive (only
 * when the turn came from voice mode) plus any explicitly slash-activated skill
 * instructions. Returns undefined when neither applies, so the caller can omit
 * the `system` option entirely and leave the agent's base instructions untouched.
 */
export function buildTurnSystem(opts: {
  voiceMode: boolean;
  activeSkillInstructions?: string;
}): string | undefined {
  const system = [
    opts.voiceMode ? VOICE_BREVITY_SYSTEM : '',
    opts.activeSkillInstructions || '',
  ]
    .filter(Boolean)
    .join('\n\n');
  return system || undefined;
}
