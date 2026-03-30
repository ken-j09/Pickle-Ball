import { Team, Match } from '../types';

export async function generateTournamentRecap(teams: Team[], matches: Match[]): Promise<string> {
  const completedMatches = matches.filter(m => m.isCompleted);

  const matchSummaries = completedMatches.map(m => {
    const teamA = teams.find(t => t.id === m.team1Id)?.name ?? 'Team A';
    const teamB = teams.find(t => t.id === m.team2Id)?.name ?? 'Team B';
    return `${teamA} ${m.score1} – ${m.score2} ${teamB}`;
  }).join('\n');

  const standings = [...teams]
    .sort((a, b) => b.wins - a.wins || (b.pointsFor - b.pointsAgainst) - (a.pointsFor - a.pointsAgainst))
    .map((t, i) => `${i + 1}. ${t.name} — ${t.wins}W ${t.losses}L`)
    .join('\n');

  const prompt = `You are an energetic pickleball tournament broadcaster. Write a vivid, professional commentary recap (3–4 paragraphs) for this tournament.

MATCH RESULTS:
${matchSummaries || 'No completed matches yet.'}

STANDINGS:
${standings || 'No standings yet.'}

Write an exciting, insightful recap with tactical observations, standout performances, and drama. Use a broadcast commentary style.`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY ?? '',
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-opus-4-5',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API error: ${err}`);
  }

  const data = await response.json();
  return data.content?.[0]?.text ?? 'No recap generated.';
}
