const VALID_PHONEMES = new Set([
  "/p/",
  "/b/",
  "/t/",
  "/d/",
  "/k/",
  "/g/",
  "/m/",
  "/n/",
  "/s/",
  "/z/",
  "/f/",
  "/v/",
  "/ʃ/",
  "/θ/",
  "/tʃ/",
  "/ɪ/",
  "/æ/",
  "/ɛ/",
  "/iː/",
  "/ɒ/",
]);

export function validatePhonemes(phonemes) {
  if (typeof phonemes !== "string" || !phonemes.trim()) {
    return {
      valid: false,
      message: "Phonemes are required.",
    };
  }

  const tokens = phonemes.trim().split(/\s+/);

  for (const token of tokens) {
    if (!/^\/.+\/$/.test(token)) {
      return {
        valid: false,
        message: `Invalid phoneme format: ${token}. Phonemes must be written like /tʃ/.`,
      };
    }

    if (!VALID_PHONEMES.has(token)) {
      return {
        valid: false,
        message: `Unknown phoneme: ${token}.`,
      };
    }
  }

  return {
    valid: true,
  };
}