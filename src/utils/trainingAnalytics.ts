import { TrainingSession } from '@/stores/trainingStore';

export interface SessionStats {
  totalSessions: number;
  trainingSessions: number;
  matchSessions: number;
  averageFeeling: number;
  currentStreak: number;
  bestArea: string;
  worstArea: string;
}

export interface SkillTrend {
  skill: string;
  trend: 'improving' | 'declining' | 'stable';
  change: number; // percentage change
  average: number;
}

export interface Insight {
  id: string;
  type: 'positive' | 'warning' | 'attention';
  title: string;
  description: string;
  icon: string;
}

export function calculateStats(sessions: TrainingSession[]): SessionStats {
  if (sessions.length === 0) {
    return {
      totalSessions: 0,
      trainingSessions: 0,
      matchSessions: 0,
      averageFeeling: 0,
      currentStreak: 0,
      bestArea: 'N/A',
      worstArea: 'N/A',
    };
  }

  const trainingSessions = sessions.filter((s) => s.sessionType === 'training').length;
  const matchSessions = sessions.filter((s) => s.sessionType === 'match').length;
  const averageFeeling = sessions.reduce((sum, s) => sum + s.overallFeeling, 0) / sessions.length;

  // Calculate current streak
  let streak = 0;
  const sortedSessions = [...sessions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < sortedSessions.length; i++) {
    const sessionDate = new Date(sortedSessions[i].date);
    sessionDate.setHours(0, 0, 0, 0);
    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - i);

    if (sessionDate.getTime() === expectedDate.getTime()) {
      streak++;
    } else {
      break;
    }
  }

  // Calculate best/worst areas
  const avgForehand = sessions.reduce((sum, s) => sum + s.forehandRating, 0) / sessions.length;
  const avgBackhand = sessions.reduce((sum, s) => sum + s.backhandRating, 0) / sessions.length;
  const avgServe = sessions.reduce((sum, s) => sum + s.serveRating, 0) / sessions.length;
  const avgReceive = sessions.reduce((sum, s) => sum + s.receiveRating, 0) / sessions.length;

  const areas = [
    { name: 'Forehand', avg: avgForehand },
    { name: 'Backhand', avg: avgBackhand },
    { name: 'Serve', avg: avgServe },
    { name: 'Receive', avg: avgReceive },
  ];

  const bestArea = areas.reduce((max, area) => (area.avg > max.avg ? area : max)).name;
  const worstArea = areas.reduce((min, area) => (area.avg < min.avg ? area : min)).name;

  return {
    totalSessions: sessions.length,
    trainingSessions,
    matchSessions,
    averageFeeling: Math.round(averageFeeling * 10) / 10,
    currentStreak: streak,
    bestArea,
    worstArea,
  };
}

export function calculateSkillTrends(sessions: TrainingSession[]): SkillTrend[] {
  if (sessions.length < 2) {
    return [];
  }

  const sortedSessions = [...sessions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const midpoint = Math.floor(sortedSessions.length / 2);
  const firstHalf = sortedSessions.slice(0, midpoint);
  const secondHalf = sortedSessions.slice(midpoint);

  const calculateAverage = (sessions: TrainingSession[], skill: keyof TrainingSession) => {
    return sessions.reduce((sum, s) => sum + (s[skill] as number), 0) / sessions.length;
  };

  const calculateTrend = (first: number, second: number): SkillTrend['trend'] => {
    const change = ((second - first) / first) * 100;
    if (change > 5) return 'improving';
    if (change < -5) return 'declining';
    return 'stable';
  };

  const skills = ['forehandRating', 'backhandRating', 'serveRating', 'receiveRating'] as const;
  const skillNames = ['Forehand', 'Backhand', 'Serve', 'Receive'];

  return skills.map((skill, index) => {
    const firstAvg = calculateAverage(firstHalf, skill);
    const secondAvg = calculateAverage(secondHalf, skill);
    const change = ((secondAvg - firstAvg) / firstAvg) * 100;

    return {
      skill: skillNames[index],
      trend: calculateTrend(firstAvg, secondAvg),
      change: Math.round(change),
      average: Math.round(secondAvg * 10) / 10,
    };
  });
}

export function generateInsights(sessions: TrainingSession[]): Insight[] {
  const insights: Insight[] = [];

  if (sessions.length === 0) {
    return insights;
  }

  const stats = calculateStats(sessions);
  const trends = calculateSkillTrends(sessions);

  // Streak insight
  if (stats.currentStreak >= 3) {
    insights.push({
      id: 'streak',
      type: 'positive',
      title: `${stats.currentStreak} Day Streak! 🔥`,
      description: 'Keep up the consistency! Regular training is key to improvement.',
      icon: '🔥',
    });
  } else if (stats.currentStreak === 0 && sessions.length > 0) {
    insights.push({
      id: 'no-streak',
      type: 'attention',
      title: 'Start a new streak today',
      description: 'Log a session to build training momentum!',
      icon: '💪',
    });
  }

  // Best area insight
  if (stats.bestArea !== 'N/A') {
    insights.push({
      id: 'best-area',
      type: 'positive',
      title: `${stats.bestArea} looking strong! 💪`,
      description: `Your ${stats.bestArea.toLowerCase()} is your strongest area right now.`,
      icon: '⭐',
    });
  }

  // Trends insights
  trends.forEach((trend) => {
    if (trend.trend === 'improving' && trend.change > 10) {
      insights.push({
        id: `improving-${trend.skill}`,
        type: 'positive',
        title: `${trend.skill} improving steadily`,
        description: `Up ${trend.change}% recently - excellent progress! 📈`,
        icon: '📈',
      });
    } else if (trend.trend === 'declining' && trend.change < -10) {
      insights.push({
        id: `declining-${trend.skill}`,
        type: 'warning',
        title: `${trend.skill} needs attention`,
        description: `Down ${Math.abs(trend.change)}% - consider focused drills. ⚠️`,
        icon: '⚠️',
      });
    }
  });

  // Training vs Match performance
  const trainingAvg =
    sessions
      .filter((s) => s.sessionType === 'training')
      .reduce((sum, s) => sum + s.overallFeeling, 0) /
    (stats.trainingSessions || 1);
  const matchAvg =
    sessions
      .filter((s) => s.sessionType === 'match')
      .reduce((sum, s) => sum + s.overallFeeling, 0) /
    (stats.matchSessions || 1);

  if (matchAvg > trainingAvg + 0.5) {
    insights.push({
      id: 'match-performance',
      type: 'positive',
      title: 'Match day performer! 🏆',
      description: `Your match performance is ${Math.round(((matchAvg - trainingAvg) / trainingAvg) * 100)}% better than training.`,
      icon: '🏆',
    });
  } else if (trainingAvg > matchAvg + 0.5) {
    insights.push({
      id: 'training-better',
      type: 'attention',
      title: 'Training stronger than matches',
      description: 'Consider match simulation drills to close the gap.',
      icon: '🎯',
    });
  }

  return insights.slice(0, 5); // Limit to 5 insights
}
