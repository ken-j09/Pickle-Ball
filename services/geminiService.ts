
import { GoogleGenAI } from "@google/genai";
import { Team, Match } from "../types";

// Always use named parameter and process.env.API_KEY directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateTournamentRecap = async (teams: Team[], matches: Match[]) => {
  const completedMatches = matches.filter(m => m.isCompleted);
  
  const matchDetails = completedMatches.map(m => {
    const t1 = teams.find(t => t.id === m.team1Id)?.name || 'Unknown';
    const t2 = teams.find(t => t.id === m.team2Id)?.name || 'Unknown';
    return `${t1} vs ${t2}: ${m.score1}-${m.score2}`;
  }).join(', ');

  const prompt = `
    You are a professional Pickleball commentator. 
    Summarize the current tournament state based on these match results: ${matchDetails}.
    Provide a brief, energetic, and professional update including:
    1. A highlight of the most exciting match.
    2. A shoutout to the current frontrunners.
    3. One "pro tip" for the players to improve their game.
    Keep it under 100 words.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to generate recap. Check your connection.";
  }
};
