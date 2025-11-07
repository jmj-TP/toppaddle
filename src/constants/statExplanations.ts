export interface StatExplanation {
  short: string;
  detailed: string;
}

export const statExplanations: Record<string, StatExplanation> = {
  Speed: {
    short: "How fast the ball travels off the paddle",
    detailed: "Speed determines how quickly the ball rebounds off your paddle. Higher speed (70+) suits offensive players who attack with flat hits and fast loops. Lower speed (30-50) provides more control and dwell time for defensive play. Measured on a 0-100 scale based on manufacturer specs and rubber/blade characteristics."
  },
  Control: {
    short: "Paddle predictability and forgiveness",
    detailed: "Control measures how consistent and forgiving the paddle is. Higher control (70+) means more predictable ball placement, easier to master, and more forgiving of technique errors. Lower control (30-50) requires more skill but offers greater spin and speed potential. Measured on a 0-100 scale."
  },
  Spin: {
    short: "Ability to generate ball rotation",
    detailed: "Spin determines how much rotation you can generate on serves, loops, and topspins. Higher spin (70+) is crucial for modern offensive play with powerful topspin loops and deceptive serves. Lower spin (30-50) suits defensive or blocking styles. Measured on a 0-100 scale based on rubber surface tackiness and thickness."
  },
  Power: {
    short: "Combined attacking force",
    detailed: "Power combines speed and spin into overall attacking capability. Higher power (70+) enables explosive offensive shots that are both fast and spinny. Lower power (30-50) emphasizes precision placement and control over raw attacking force. Calculated from Speed and Spin ratings."
  },
  Value: {
    short: "Stats per dollar - performance to price ratio",
    detailed: "Value represents cost-effectiveness. Calculated as: ((8 - (Price ÷ Total Stats)) ÷ 8) × 100. A setup with 240 stats at $240 ($1 per stat) scores 87.5. A setup with 200 stats at $400 ($2 per stat) scores 75. A setup with 100 stats at $800 ($8 per stat) scores 0. Higher value means better bang for your buck. Score of 87.5+ means less than $1 per stat - excellent value!"
  },
  Weight: {
    short: "Total assembled paddle weight in grams",
    detailed: "Weight shows the complete assembled racket weight. Score based on proximity to optimal 175g: ((50 - |Weight - 175|) ÷ 50) × 100. Lighter paddles (150-165g) offer faster reactions and less arm fatigue, ideal for defensive play. Heavier paddles (185-200g) provide more power and stability but can cause fatigue during long matches. Only shown in Overall Performance view as individual component weights don't combine linearly with assembly factors."
  }
};
