'use server';

/**
 * @fileOverview Generates a simplified, age-appropriate explanation of a given topic.
 *
 * - generateTopicExplanation - A function that generates the topic explanation.
 * - GenerateTopicExplanationInput - The input type for the generateTopicExplanation function.
 * - GenerateTopicExplanationOutput - The return type for the generateTopicExplanation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTopicExplanationInputSchema = z.object({
  topic: z.string().describe('The topic to generate an explanation for.'),
});
export type GenerateTopicExplanationInput = z.infer<typeof GenerateTopicExplanationInputSchema>;

const GenerateTopicExplanationOutputSchema = z.object({
  explanation: z.string().describe('The simplified explanation of the topic.'),
});
export type GenerateTopicExplanationOutput = z.infer<typeof GenerateTopicExplanationOutputSchema>;

export async function generateTopicExplanation(
  input: GenerateTopicExplanationInput
): Promise<GenerateTopicExplanationOutput> {
  return generateTopicExplanationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTopicExplanationPrompt',
  input: {schema: GenerateTopicExplanationInputSchema},
  output: {schema: GenerateTopicExplanationOutputSchema},
  prompt: `You are an AI assistant that explains complex topics in simple terms for students.

  Explain the following topic in a way that is easy to understand:
  {{topic}}`,
});

const generateTopicExplanationFlow = ai.defineFlow(
  {
    name: 'generateTopicExplanationFlow',
    inputSchema: GenerateTopicExplanationInputSchema,
    outputSchema: GenerateTopicExplanationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
