'use server';

/**
 * @fileOverview AI agent that generates strong passwords.
 *
 * - generateStrongPassword - A function that generates a strong password based on user-specified criteria.
 * - GenerateStrongPasswordInput - The input type for the generateStrongPassword function.
 * - GenerateStrongPasswordOutput - The return type for the generateStrongPassword function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStrongPasswordInputSchema = z.object({
  length: z
    .number()
    .min(8)
    .max(128)
    .default(16)
    .describe('The desired length of the password (between 8 and 128 characters).'),
  includeNumbers: z.boolean().default(true).describe('Whether to include numbers in the password.'),
  includeSymbols: z.boolean().default(true).describe('Whether to include symbols in the password.'),
});
export type GenerateStrongPasswordInput = z.infer<typeof GenerateStrongPasswordInputSchema>;

const GenerateStrongPasswordOutputSchema = z.object({
  password: z.string().describe('The generated strong password.'),
});
export type GenerateStrongPasswordOutput = z.infer<typeof GenerateStrongPasswordOutputSchema>;

export async function generateStrongPassword(input: GenerateStrongPasswordInput): Promise<GenerateStrongPasswordOutput> {
  return generateStrongPasswordFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStrongPasswordPrompt',
  input: {schema: GenerateStrongPasswordInputSchema},
  output: {schema: GenerateStrongPasswordOutputSchema},
  prompt: `You are a password expert, skilled at generating strong and unique passwords.

  Based on the following criteria, generate a password. The password should be random and difficult to guess.

  Length: {{length}}
  Include Numbers: {{#if includeNumbers}}Yes{{else}}No{{/if}}
  Include Symbols: {{#if includeSymbols}}Yes{{else}}No{{/if}}

  Ensure that the password meets the specified criteria and is suitable for securing sensitive accounts.

  Respond with ONLY the generated password.
  `,
});

const generateStrongPasswordFlow = ai.defineFlow(
  {
    name: 'generateStrongPasswordFlow',
    inputSchema: GenerateStrongPasswordInputSchema,
    outputSchema: GenerateStrongPasswordOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {
      password: output!.password,
    };
  }
);
