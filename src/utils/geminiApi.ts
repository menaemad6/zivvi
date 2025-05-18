
// Gemini API configuration
const API_KEY = "AIzaSyCPq1M1m4GNyHBwnEILA874_Td9mxtRd8s";
// const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

/**
 * Interface for Gemini API response
 */
interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

/**
 * Sends a prompt to the Gemini API and returns the response
 * @param prompt - The text prompt to send to Gemini
 */
export async function getGeminiResponse(prompt: string): Promise<string> {
  try {
    const requestBody = {
      contents: [
        {
          parts: [{ text: prompt }],
          role: "user"
        }
      ]
    };
    
    // Send request to Gemini API
    const response = await fetch(`${BASE_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    const data = await response.json() as GeminiResponse;
    
    // Extract the text from the response
    const resultText = data.candidates[0]?.content.parts[0]?.text;
    return resultText || "";
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
}

/**
 * Parses a CV section from the AI response
 * @param aiResponse - The raw AI response
 * @param sectionType - Type of CV section to parse
 */
export function parseAIResponse(aiResponse: string, sectionType: string) {
  try {
    // Find JSON-like content in the response
    const jsonMatch = aiResponse.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    let parsedData;
    
    if (jsonMatch && jsonMatch[1]) {
      // Try parsing the JSON content
      parsedData = JSON.parse(jsonMatch[1]);
    } else {
      // If no JSON format is found, try to extract structured data
      return extractStructuredData(aiResponse, sectionType);
    }
    
    return parsedData;
  } catch (error) {
    console.error("Error parsing AI response:", error);
    return null;
  }
}

/**
 * Extract structured data from unformatted AI text response
 */
function extractStructuredData(text: string, sectionType: string) {
  switch (sectionType) {
    case 'about':
      // Basic extraction for about section
      const nameMatch = text.match(/name:?\s*([^\n]+)/i);
      const roleMatch = text.match(/role:?\s*([^\n]+)/i) || text.match(/position:?\s*([^\n]+)/i);
      const emailMatch = text.match(/email:?\s*([^\n]+)/i);
      const phoneMatch = text.match(/phone:?\s*([^\n]+)/i);
      const locationMatch = text.match(/location:?\s*([^\n]+)/i);
      const summaryMatch = text.match(/summary:?\s*([^\n]+(?:\n[^\n]+)*)/i) || 
                          text.match(/about:?\s*([^\n]+(?:\n[^\n]+)*)/i);
      
      return {
        name: nameMatch ? nameMatch[1].trim() : '',
        role: roleMatch ? roleMatch[1].trim() : '',
        email: emailMatch ? emailMatch[1].trim() : '',
        phone: phoneMatch ? phoneMatch[1].trim() : '',
        location: locationMatch ? locationMatch[1].trim() : '',
        summary: summaryMatch ? summaryMatch[1].trim() : ''
      };

    case 'experience':
      // Attempt to extract experience items
      const experiences = [];
      const expBlocks = text.split(/experience\s*\d*:|work\s*\d*:/i).slice(1);
      
      for (const block of expBlocks) {
        const companyMatch = block.match(/company:?\s*([^\n]+)/i) || block.match(/employer:?\s*([^\n]+)/i);
        const positionMatch = block.match(/position:?\s*([^\n]+)/i) || block.match(/role:?\s*([^\n]+)/i);
        const periodMatch = block.match(/period:?\s*([^\n]+)/i) || block.match(/date:?\s*([^\n]+)/i);
        const descMatch = block.match(/description:?\s*([^\n]+(?:\n[^\n]+)*)/i);
        
        if (companyMatch || positionMatch) {
          experiences.push({
            id: crypto.randomUUID(),
            company: companyMatch ? companyMatch[1].trim() : 'Unknown Company',
            role: positionMatch ? positionMatch[1].trim() : 'Unknown Position',
            period: periodMatch ? periodMatch[1].trim() : '20xx - Present',
            description: descMatch ? descMatch[1].trim() : 'Responsibilities and achievements...'
          });
        }
      }
      
      return experiences.length > 0 ? experiences : null;

    // Add similar extraction logic for other section types
    default:
      return null;
  }
}
