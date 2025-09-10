import type { Quiz } from './types';

export function parseQuizText(text: string): Quiz {
  try {
    const parsed = JSON.parse(text);
    if (parsed.questions && Array.isArray(parsed.questions)) {
      return parsed as Quiz;
    }
    return { questions: [] };
  } catch (e) {
    console.error("Failed to parse quiz JSON:", e);
    return { questions: [] };
  }
}
