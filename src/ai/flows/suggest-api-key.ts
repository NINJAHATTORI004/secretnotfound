'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting a secure API key based on a description of the service and access level.
 *
 * - suggestApiKey - A function that suggests a secure API key.
 * - SuggestApiKeyInput - The input type for the suggestApiKey function.
 * - SuggestApiKeyOutput - The return type for the suggestApiKey function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestApiKeyInputSchema = z.object({
  serviceDescription: z
    .string()
    .describe('A description of the service for which the API key is needed.'),
  accessLevel: z
    .string()
    .describe(
      'The access level required for the API key (e.g., read-only, full access).'
    ),
});
export type SuggestApiKeyInput = z.infer<typeof SuggestApiKeyInputSchema>;

const SuggestApiKeyOutputSchema = z.object({
  apiKey: z.string().describe('The suggested secure API key.'),
  comments: z
    .string()
    .optional()
    .describe('Comments on the key characteristics or caveats.'),
});
export type SuggestApiKeyOutput = z.infer<typeof SuggestApiKeyOutputSchema>;

export async function suggestApiKey(input: SuggestApiKeyInput): Promise<SuggestApiKeyOutput> {
  return suggestApiKeyFlow(input);
}

const suggestApiKeyPrompt = ai.definePrompt({
  name: 'suggestApiKeyPrompt',
  input: {schema: SuggestApiKeyInputSchema},
  output: {schema: SuggestApiKeyOutputSchema},
  prompt: `You are an API key generation expert. You will be given a description of a service and the access level required for the API key.

  Based on this information, you will generate a secure, unique API key and return it.  Also return any relevant comments about the key or its usage, particularly security considerations.

  Service Description: {{{serviceDescription}}}
  Access Level: {{{accessLevel}}} `,
});

const suggestApiKeyFlow = ai.defineFlow(
  {
    name: 'suggestApiKeyFlow',
    inputSchema: SuggestApiKeyInputSchema,
    outputSchema: SuggestApiKeyOutputSchema,
  },
  async input => {
    const {output} = await suggestApiKeyPrompt(input);
    return output!;
  }
);
