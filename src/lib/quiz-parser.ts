import type { Quiz, Question, QuestionType } from './types';

export function parseQuizText(text: string): Quiz {
  const questions: Question[] = [];
  // Split by number followed by a period, e.g., "1.", "2."
  const questionBlocks = text.split(/\n?(?=\d+\.\s)/).filter(block => block.trim() !== '');

  questionBlocks.forEach((block, index) => {
    try {
      const questionTextMatch = block.match(/^\d+\.\s(.*?)\n/);
      let questionText = questionTextMatch ? questionTextMatch[1] : `Question ${index + 1}`;
      
      const correctAnswerMatch = block.match(/Correct Answer:\s*(.*)/i);
      const correctAnswer = correctAnswerMatch ? correctAnswerMatch[1].trim() : '';
      
      let type: QuestionType = 'unknown';
      let options: string[] | undefined = undefined;

      // Clean metadata from question text
      questionText = questionText.replace(/\((Multiple Choice|True\/False|Fill-in-the-blank)\)/i, '').trim();

      // Determine question type
      if (block.match(/\n\s*[a-zA-Z]\)\s/)) {
        type = 'multiple-choice';
        options = [];
        const optionLines = block.split('\n').filter(line => /^\s*[a-zA-Z]\)/.test(line));
        optionLines.forEach(line => {
          options?.push(line.replace(/^\s*[a-zA-Z]\)\s*/, '').trim());
        });
      } else if (correctAnswer.toLowerCase() === 'true' || correctAnswer.toLowerCase() === 'false') {
        type = 'true-false';
        options = ['True', 'False'];
      } else if (questionText.includes('___') || questionText.includes('_____')) {
        type = 'fill-in-the-blank';
      }

      // Fallback for type detection
      if (type === 'unknown') {
        if (block.toLowerCase().includes('true or false')) type = 'true-false';
        else if (block.includes('___')) type = 'fill-in-the-blank';
        else type = 'multiple-choice'; // Default assumption
      }
      
      if (correctAnswer) {
        questions.push({
          id: index + 1,
          type,
          questionText,
          options,
          correctAnswer,
        });
      }
    } catch (e) {
      console.error("Failed to parse question block:", block, e);
    }
  });

  return { questions };
}
