// Sight word library aligned to NC K Standard Course of Study
// Based on Dolch Pre-Primer, Primer lists + NC DPI ELA K standards
// Three tiers of difficulty

export const SIGHT_WORDS = {
  tier1: {
    label: "Safari Starter",
    emoji: "🐣",
    color: "#4caf50",
    words: [
      "a", "I", "in", "is", "it", "my", "no", "of", "on",
      "see", "the", "to", "up", "we", "go", "me", "be",
      "do", "he", "so", "am", "an", "as", "at", "by",
      "if", "or", "us"
    ]
  },
  tier2: {
    label: "Safari Explorer",
    emoji: "🦁",
    color: "#ff9800",
    words: [
      "all", "and", "are", "big", "but", "can", "cat",
      "come", "did", "dog", "for", "get", "got", "had",
      "has", "him", "his", "how", "into", "like", "look",
      "make", "man", "may", "mom", "not", "now", "one",
      "our", "out", "put", "ran", "run", "sad", "said",
      "saw", "she", "sit", "six", "ten", "that", "then",
      "they", "this", "too", "two", "was", "way", "who",
      "why", "win", "with", "yes", "you", "your"
    ]
  },
  tier3: {
    label: "Safari Champion",
    emoji: "🏆",
    color: "#e91e63",
    words: [
      "about", "again", "after", "always", "around", "because",
      "been", "before", "bring", "brown", "carry", "clean",
      "cold", "cut", "does", "done", "draw", "drink", "eat",
      "eight", "every", "fall", "far", "fast", "find", "first",
      "five", "fly", "found", "four", "from", "full", "funny",
      "gave", "give", "going", "good", "green", "grew", "grow",
      "hold", "hurt", "just", "keep", "kind", "know", "laugh",
      "learn", "let", "live", "long", "much", "must", "never",
      "new", "off", "old", "once", "only", "open", "over",
      "pick", "play", "please", "pull", "read", "right", "round",
      "same", "show", "sing", "sleep", "small", "start", "stop",
      "take", "thank", "their", "these", "think", "those", "three",
      "today", "together", "try", "under", "upon", "very", "walk",
      "want", "warm", "well", "went", "were", "what", "when",
      "where", "which", "while", "white", "will", "wish", "with",
      "work", "would", "write", "yellow"
    ]
  }
};

// Phonics pattern detection for parent report
export const PHONICS_PATTERNS = [
  { name: "Short vowels (a, e, i, o, u)", regex: /^[bcdfghjklmnpqrstvwxyz][aeiou][bcdfghjklmnpqrstvwxyz]$/i, examples: ["cat", "sit", "hot", "cut"] },
  { name: "Long vowel silent-e", regex: /[aeiou][bcdfghjklmnpqrstvwxyz]e$/i, examples: ["make", "like", "home"] },
  { name: "Consonant blends (bl, cr, st...)", regex: /^(bl|br|cl|cr|dr|fl|fr|gl|gr|pl|pr|sc|sk|sl|sm|sn|sp|st|sw|tr|tw)/i, examples: ["play", "stop", "bring"] },
  { name: "Digraphs (th, sh, ch, wh)", regex: /th|sh|ch|wh/i, examples: ["the", "she", "when", "that"] },
  { name: "Double letters", regex: /(.)\1/i, examples: ["all", "off", "well"] },
  { name: "Two-syllable words", words: ["about", "after", "again", "always", "around", "because", "before", "carry", "every", "funny", "going", "never", "over", "under", "very", "walking", "yellow"] }
];

export function detectPhonicsPatterns(missedWords) {
  const flagged = {};
  PHONICS_PATTERNS.forEach(pattern => {
    const matched = missedWords.filter(w => {
      if (pattern.regex) return pattern.regex.test(w);
      if (pattern.words) return pattern.words.includes(w.toLowerCase());
      return false;
    });
    if (matched.length > 0) {
      flagged[pattern.name] = matched;
    }
  });
  return flagged;
}

export function getTierForWord(word) {
  if (SIGHT_WORDS.tier1.words.includes(word)) return "tier1";
  if (SIGHT_WORDS.tier2.words.includes(word)) return "tier2";
  return "tier3";
}

export function getSimilarWord(word, excludeWords = []) {
  const tier = getTierForWord(word);
  const pool = SIGHT_WORDS[tier].words.filter(w => w !== word && !excludeWords.includes(w));
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function buildSession(currentTier, sessionHistory = []) {
  // Determine which tier to draw from based on performance
  const tierWords = SIGHT_WORDS[currentTier].words;
  const recentMissed = sessionHistory
    .filter(s => s.missedWords)
    .flatMap(s => s.missedWords)
    .slice(-20);
  
  // Prioritize recently missed words (up to 5), rest random
  const prioritized = tierWords.filter(w => recentMissed.includes(w));
  const rest = tierWords.filter(w => !recentMissed.includes(w));
  
  const shuffled = [...prioritized, ...rest].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 15);
}
