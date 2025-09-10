'use server';

/**
 * @fileOverview Generates a quiz based on a given explanation.
 *
 * - generateQuizFromExplanation - A function that generates a quiz from an explanation.
 * - GenerateQuizFromExplanationInput - The input type for the generateQuizFromExplanation function.
 * - GenerateQuizFromExplanationOutput - The return type for the generateQuizFromExplanation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuizFromExplanationInputSchema = z.object({
  explanation: z.string().describe('The explanation to generate a quiz from.'),
});
export type GenerateQuizFromExplanationInput = z.infer<typeof GenerateQuizFromExplanationInputSchema>;

const GenerateQuizFromExplanationOutputSchema = z.object({
  quiz: z.string().describe('The generated quiz.'),
});
export type GenerateQuizFromExplanationOutput = z.infer<typeof GenerateQuizFromExplanationOutputSchema>;

export async function generateQuizFromExplanation(
  input: GenerateQuizFromExplanationInput
): Promise<GenerateQuizFromExplanationOutput> {
  return generateQuizFromExplanationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizFromExplanationPrompt',
  input: {schema: GenerateQuizFromExplanationInputSchema},
  output: {schema: GenerateQuizFromExplanationOutputSchema},
  prompt: `You are a quiz generator. Generate a quiz with 3-5 questions based on the following explanation. The quiz should include multiple choice, true/false, and fill-in-the-blank questions.
Explanation: {{{explanation}}}`,
});

const generateQuizFromExplanationFlow = ai.defineFlow(
  {
    name: 'generateQuizFromExplanationFlow',
    inputSchema: GenerateQuizFromExplanationInputSchema,
    outputSchema: GenerateQuizFromExplanationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
