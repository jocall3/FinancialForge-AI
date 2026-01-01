
import { GoogleGenAI, Type } from "@google/genai";
import { 
  FinancialProductConcept, 
  MarketSegment, 
  InfrastructureComponentType, 
  AnyInfrastructureComponent,
  RegulatoryComplianceDocument,
  SmartContractPolicyEngine,
  InteroperabilityFramework,
  OperationalScenario
} from "../types";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  async generateConcept(prompt: string): Promise<{ concept: FinancialProductConcept, imageUrl: string }> {
    // Basic Text Tasks: 'gemini-3-flash-preview'
    const model = 'gemini-3-flash-preview';
    const response = await ai.models.generateContent({
      model,
      contents: `You are an expert financial architect. Generate a high-level description of a revolutionary financial product/infrastructure based on: "${prompt}". 
          Include description, a list of 5 key components, and market opportunity. 
          Respond in JSON format only.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
            keyComponents: { type: Type.ARRAY, items: { type: Type.STRING } },
            marketOpportunity: { type: Type.STRING }
          },
          required: ['description', 'keyComponents', 'marketOpportunity']
        }
      }
    });

    // The GenerateContentResponse object features a text property (not a method).
    const conceptText = response.text || '{}';
    const concept = JSON.parse(conceptText) as FinancialProductConcept;
    
    // Generate images using gemini-2.5-flash-image
    const imageResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: `Conceptual architectural visualization of ${concept.description}, sleek digital interface, global connection, high-tech financial grid, cinematic lighting, 8k.`,
      config: {
        imageConfig: { aspectRatio: '16:9' }
      }
    });

    let imageUrl = '';
    // Iterate through candidates and parts to find the image part (inlineData).
    const firstCandidate = imageResponse.candidates?.[0];
    if (firstCandidate?.content?.parts) {
      for (const part of firstCandidate.content.parts) {
        if (part.inlineData) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    return { concept, imageUrl };
  },

  async generateComponent(
    concept: string, 
    type: InfrastructureComponentType, 
    prompt: string
  ): Promise<{ component: any, imageUrl: string }> {
    const model = 'gemini-3-flash-preview';
    const response = await ai.models.generateContent({
      model,
      contents: `Context: Designing infrastructure for "${concept}". 
          Task: Create a detailed "${type}" specification based on prompt: "${prompt}". 
          Include specific technical fields appropriate for a financial system. 
          Respond in JSON only.`,
      config: { responseMimeType: 'application/json' }
    });

    const componentDataText = response.text || '{}';
    const componentData = JSON.parse(componentDataText);
    
    const imageResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: `Technical diagram or blueprint icon for ${type}: ${componentData.name || prompt}, professional financial tech aesthetic, cyber-security style.`
    });

    let imageUrl = '';
    const firstCandidate = imageResponse.candidates?.[0];
    if (firstCandidate?.content?.parts) {
      for (const part of firstCandidate.content.parts) {
        if (part.inlineData) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    return { component: componentData, imageUrl };
  }
};
