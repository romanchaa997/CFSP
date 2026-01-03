
import { GoogleGenAI } from "@google/genai";
import { ScanResult } from "../types";

export const analyzeCasinoRisk = async (scanData: ScanResult): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `
    Analyze the following technical scan data for an online casino and provide a professional security assessment for a B2B audience.
    
    Data:
    - URL: ${scanData.url}
    - Risk Score: ${scanData.riskScore}/100
    - SSL Valid: ${scanData.features.sslValid}
    - Domain Age: ${scanData.features.domainAge} days
    - License Found: ${scanData.features.licenseFound}
    - Regulatory Status: ${scanData.features.regulatoryBlacklisted ? 'Blacklisted by PlayCity/KRAIL' : 'Clean'}
    - Withdrawal Delay: ${scanData.features.withdrawalDelayAvg} hours
    
    Identify specific red flags (if any) and give a final recommendation for a financial institution or legal firm. Keep it concise, under 150 words.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.8
      }
    });
    return response.text || "Assessment unavailable.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Error generating AI assessment. Please review manual feature flags.";
  }
};
