
'use server';

import { generateTopicExplanation } from '@/ai/flows/generate-topic-explanation';
import { generateQuizFromExplanation } from '@/ai/flows/generate-quiz-from-explanation';
import { z } from 'zod';

const formSchema = z.object({
  topic: z.string().min(2, "Topic must be at least 2 characters.").max(100, "Topic must be 100 characters or less."),
});

export type AppState = {
  status: 'error' | 'success';
  message: string;
  explanation?: string;
  quiz?: string;
}

export async function generateExplanationAndQuiz(
  formData: FormData
): Promise<AppState> {

  const validatedFields = formSchema.safeParse({
    topic: formData.get('topic'),
  });

  if (!validatedFields.success) {
    return {
      status: 'error',
      message: validatedFields.error.errors[0].message,
    };
  }

  const { topic } = validatedFields.data;

  try {
    const explanationResult = await generateTopicExplanation({ topic });
    if (!explanationResult?.explanation) {
      throw new Error("Failed to generate explanation.");
    }
    const explanation = explanationResult.explanation;

    const quizResult = await generateQuizFromExplanation({ explanation });
    if (!quizResult?.quiz) {
      throw new Error("Failed to generate quiz.");
    }
    const quiz = quizResult.quiz;

    return {
      status: 'success',
      message: 'Content generated successfully.',
      explanation,
      quiz,
    };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred. Please try again.';
    return {
      status: 'error',
      message: errorMessage,
    };
  }
}
