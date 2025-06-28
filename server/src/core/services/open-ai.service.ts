import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';

import openai from '@core/services/open-ai';

// TODO Schema GenerateSentencesResponseSchema - переместить
export const GenerateSentencesResponseSchema = z
  .object({
    words: z
      .array(z.string())
      .refine((val) => val.length >= 2, {
        message: 'Words array cannot be empty.',
      })
      .describe('Array of words to be used in the generated sentence.'),
    originLanguage: z
      .string()
      .refine((val) => val.length >= 2, {
        message: 'Language code must be at least 2 characters long.',
      })
      .describe(`The language in which the original sentence is generated (e.g., 'English').`),
    originSentence: z
      .string()
      .refine((val) => val.length >= 2, {
        message: 'Original sentence cannot be empty.',
      })
      .describe('The generated sentence using the provided words in the origin language.'),
    targetLanguages: z
      .array(z.string())
      .refine((val) => val.length >= 2, {
        message: 'Target languages array cannot be empty.',
      })
      .describe(`Array of target languages (e.g., ['ru', 'ua']) for translations.`),
    translations: z
      .object({})
      .catchall(z.string().describe('The translated sentence for the target language.'))
      .describe('Object where keys are target language codes, and values are translations of the original sentence.'),
  })
  .strict();

// Generate TypeScript type from the schema
export type GenerateSentencesResponse = z.infer<typeof GenerateSentencesResponseSchema>;

// TODO SERVICE OpenAiService - переместить
export class OpenAiService {
  async generateSentence(
    words: string[],
    level: string,
    originLanguage: string,
    languages: string[],
  ): Promise<GenerateSentencesResponse> {
    const prompt = `Create an ${originLanguage} sentence using the words: ${words.join(', ')}. The sentence should be at level ${level}. Translate it into the following languages: ${languages.join(', ')}.`;
    console.log('prompt', prompt);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-2024-08-06',
      messages: [
        {
          role: 'system',
          content: `You generate sentences in ${originLanguage} and translate them.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_completion_tokens: 300,
      response_format: zodResponseFormat(GenerateSentencesResponseSchema, 'event'),
    });

    if (completion.choices[0].finish_reason === 'length') {
      // Handle the case where the api did not return a complete response
      throw new Error('Incomplete response');
    }
    const sentence_response = completion.choices[0].message;
    // console.log("sentence_response", sentence_response);
    if (sentence_response.refusal) {
      console.log('refusal >>>>> ', sentence_response.refusal);
    } else if (sentence_response.content) {
      console.log('content >>>>> ', sentence_response.content);
    } else {
      throw new Error('No response content');
    }

    // Answer validation with using Zod schema
    const parsedResponse = GenerateSentencesResponseSchema.parse(
      sentence_response.content ? JSON.parse(sentence_response.content) : {},
    );
    console.log('parsedResponse', parsedResponse);
    return parsedResponse;
  }
}

export default new OpenAiService();

// response_format: {
//   type: "json_schema",
//   json_schema: {
//     name: "sentence_response",
//     schema: {
//       type: "object",
//       properties: {
//         words: {
//           type: "array",
//           items: { type: "string" },
//           description: "Array of words to be used in the generated sentence.",
//         },
//         originLanguage: {
//           type: "string",
//           description: "The language in which the original sentence is generated (e.g., 'English').",
//         },
//         originSentence: {
//           type: "string",
//           description: "The generated sentence using the provided words in the origin language.",
//         },
//         targetLanguages: {
//           type: "array",
//           items: { type: "string" },
//           description: "Array of target languages (e.g., ['ru', 'ua']) for translations.",
//         },
//         translations: {
//           type: "object",
//           // additionalProperties: {
//           //   type: "string",
//           //   description: "The translated sentence for the target language.",
//           // },
//           description: "Object where keys are target language codes, and values are translations.",
//         },
//       },
//       required: ["words", "originLanguage", "originSentence", "targetLanguages", "translations"],
//       additionalProperties: false,
//     },
//   },
// },
