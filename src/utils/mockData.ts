import { TrainingSession } from '@/stores/trainingStore';

export function generateMockTrainingSessions(days: number = 30): TrainingSession[] {
  const sessions: TrainingSession[] = [];
  const today = new Date();

  for (let i = 0; i < days; i++) {
    // Generate 70% training, 30% matches
    const sessionType = Math.random() > 0.3 ? 'training' : 'match';
    
    // Skip some days randomly (60% chance of having a session)
    if (Math.random() < 0.4) continue;

    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Generate ratings with some variance and general improvement trend
    const baseLevel = 5 + (days - i) / days; // Slight improvement over time
    const variance = () => Math.random() * 2 - 1; // -1 to +1

    sessions.push({
      id: `mock-session-${i}`,
      date: date.toISOString(),
      sessionType,
      overallFeeling: Math.max(1, Math.min(7, Math.round(baseLevel + variance()))),
      forehandRating: Math.max(1, Math.min(10, Math.round(baseLevel + variance() + 1))),
      backhandRating: Math.max(1, Math.min(10, Math.round(baseLevel + variance()))),
      serveRating: Math.max(1, Math.min(10, Math.round(baseLevel + variance() + 0.5))),
      receiveRating: Math.max(1, Math.min(10, Math.round(baseLevel + variance() - 0.5))),
      notes: i % 5 === 0 ? `Great session! Focused on ${sessionType === 'training' ? 'technique' : 'match tactics'}.` : undefined,
      currentSetup: {
        blade: 'Butterfly Viscaria',
        forehandRubber: 'Tenergy 05',
        backhandRubber: 'Tenergy 05',
      },
    });
  }

  return sessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
