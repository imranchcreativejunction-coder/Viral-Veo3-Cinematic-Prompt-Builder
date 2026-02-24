
import { GoogleGenAI, Type } from "@google/genai";
import type { FormState } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const VEO3_JSON_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "A catchy campaign title for the ad." },
        product: { type: Type.STRING, description: "The name of the product provided by the user." },
        aspect_ratio: { type: Type.STRING, description: "The aspect ratio for the video provided by the user." },
        duration: { type: Type.STRING, description: "The total duration of the ad, always '8 seconds'." },
        style: { type: Type.STRING, description: "A cinematic style description including tone, lighting, and mood, matching the chosen preset." },
        description: { type: Type.STRING, description: "An expanded, cinematic description of the ad concept. If the user's description was short or vague, this should be a detailed, auto-expanded version." },
        reference_image: { type: Type.STRING, description: "The reference image URL provided by the user, or 'None' if not provided." },
        negative_prompts: { type: Type.STRING, description: "Standard negative prompts to ensure brand safety, like 'No clutter, no harsh shadows, no unsafe elements'." },
        shots: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    time: { type: Type.STRING, description: "Time range for the shot (e.g., '0-3s')." },
                    visual: { type: Type.STRING, description: "Detailed scene description: subject, action, camera movement, lighting, environment." },
                    sfx: { type: Type.STRING, description: "A relevant sound effect or audio cue for the shot." },
                    music: { type: Type.STRING, description: "A background music cue that fits the mood of the shot." },
                },
                required: ["time", "visual", "sfx", "music"]
            }
        }
    },
    required: ["title", "product", "aspect_ratio", "duration", "style", "description", "reference_image", "negative_prompts", "shots"]
};


function buildBasePrompt(formState: FormState): string {
    return `
You are an expert cinematic ad concept generator for Veo 3 video prompts. Your goal is to take user input and generate a creative, detailed, and brand-safe 8-second ad concept.

User Input:
- Product Name: "${formState.productName}"
- Product Description: "${formState.description || 'Not provided'}"
- Chosen Preset: "${formState.preset}"
- Aspect Ratio: "${formState.aspectRatio}"
- Reference Image URL: "${formState.referenceImageUrl || 'None'}"

Auto-Expansion Logic:
If the user's description is missing, under 6 words, or vague (like "${formState.description}"), you MUST auto-expand it into a full cinematic detail. Use the product name and preset to infer the product type and create a rich description with setting, mood, lighting, and motion cues.

Core Task:
Based on all the provided information, generate the output in the requested format.
`;
}

export const generateCinematicPrompt = async (formState: FormState): Promise<string> => {
    const basePrompt = buildBasePrompt(formState);

    if (formState.outputFormat === 'JSON') {
        const jsonPrompt = `
${basePrompt}
Output Format: JSON.

Generate a valid Veo 3 JSON output with 2-3 shots. The JSON must conform to the provided schema. The 'description' field in the JSON should be the fully expanded cinematic description. The total duration must be 8 seconds.
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: jsonPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: VEO3_JSON_SCHEMA,
            },
        });
        
        return response.text;

    } else { // Paragraph
        const paragraphPrompt = `
${basePrompt}
Output Format: Paragraph.

Transform the ad concept into a single, flowing cinematic narrative.
- The narrative should preserve all details, pacing, and visual cues that would be in the JSON version.
- Expand visual moments into rich prose, like a director’s voice-over or a screenplay description.
- The narrative should flow seamlessly without timestamps, JSON syntax, or technical jargon.
- It can be up to 900 words to allow for full atmospheric build-up, soundscape description, and emotional depth, while still maintaining the pacing of an 8-second ad.
- Generate ONLY the paragraph text. Do not include any titles, headers, or introductory phrases like "Here is the paragraph:".
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: paragraphPrompt
        });
        
        return response.text;
    }
};
