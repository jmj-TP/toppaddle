// Table Tennis Product Database

export interface Blade {
  Blade_Name: string;
  Blade_Speed: number; // 1-100
  Blade_Control: number; // 1-100
  Blade_Power: number; // 1-100
  Blade_Grip: string;
  Blade_Price: number; // USD
  Blade_Level: 'Beginner' | 'Intermediate' | 'Advanced';
  Blade_Affiliate_Link: string;
}

export interface Rubber {
  Rubber_Name: string;
  Rubber_Speed: number; // 1-100
  Rubber_Spin: number; // 1-100
  Rubber_Control: number; // 1-100
  Rubber_Price: number; // USD
  Rubber_Level: 'Beginner' | 'Intermediate' | 'Advanced';
  Rubber_Affiliate_Link: string;
}

export interface PreAssembledRacket {
  Racket_Name: string;
  Racket_Blade: string;
  Racket_FH_Rubber: string;
  Racket_BH_Rubber: string;
  Racket_Speed: number; // 1-100
  Racket_Spin: number; // 1-100
  Racket_Control: number; // 1-100
  Racket_Power: number; // 1-100
  Racket_Grip: string;
  Racket_Price: number; // USD
  Racket_Level: 'Beginner' | 'Intermediate' | 'Advanced';
  Racket_Affiliate_Link: string;
}

// Blades Database
export const blades: Blade[] = [
  {
    Blade_Name: "JOOLA Carbon Control Performance",
    Blade_Speed: 75,
    Blade_Control: 85,
    Blade_Power: 70,
    Blade_Grip: "Flared",
    Blade_Price: 69.99,
    Blade_Level: "Intermediate",
    Blade_Affiliate_Link: "https://www.amazon.com/Joola-Carbon-Control-Table-Tennis/dp/B010DB9WFY"
  },
  {
    Blade_Name: "JOOLA Rally TL Professional",
    Blade_Speed: 80,
    Blade_Control: 75,
    Blade_Power: 78,
    Blade_Grip: "Flared",
    Blade_Price: 44.95,
    Blade_Level: "Intermediate",
    Blade_Affiliate_Link: "https://www.amazon.com/JOOLA-Rally-TL-Professional-Assembly/dp/B0CNY4MXKS"
  },
  {
    Blade_Name: "JOOLA T-bat Carbon",
    Blade_Speed: 85,
    Blade_Control: 70,
    Blade_Power: 82,
    Blade_Grip: "Flared",
    Blade_Price: 89.99,
    Blade_Level: "Advanced",
    Blade_Affiliate_Link: "https://www.amazon.com/JOOLA-T-bat-Carbon-Table-Tennis/dp/B0C3RB3V3R"
  },
  {
    Blade_Name: "Butterfly Timo Boll CAF",
    Blade_Speed: 88,
    Blade_Control: 72,
    Blade_Power: 85,
    Blade_Grip: "Flared",
    Blade_Price: 129.99,
    Blade_Level: "Advanced",
    Blade_Affiliate_Link: "https://www.amazon.com/Butterfly-Timo-Table-Tennis-Blade/dp/B088WBJXDH"
  },
  {
    Blade_Name: "Butterfly B303FL Shakehand",
    Blade_Speed: 65,
    Blade_Control: 90,
    Blade_Power: 60,
    Blade_Grip: "Flared",
    Blade_Price: 39.99,
    Blade_Level: "Beginner",
    Blade_Affiliate_Link: "https://www.amazon.com/Butterfly-B303FL-Shakehand-Tennis-Racket/dp/B0F4YZ6BYZ"
  },
  {
    Blade_Name: "ANDRO Timber 5 OFF",
    Blade_Speed: 82,
    Blade_Control: 78,
    Blade_Power: 80,
    Blade_Grip: "Flared",
    Blade_Price: 79.99,
    Blade_Level: "Intermediate",
    Blade_Affiliate_Link: "https://www.amazon.com/stores/Andro/page/andro-blades"
  }
];

// Rubbers Database
export const rubbers: Rubber[] = [
  {
    Rubber_Name: "Butterfly Dignics 09C",
    Rubber_Speed: 92,
    Rubber_Spin: 96,
    Rubber_Control: 72,
    Rubber_Price: 89.99,
    Rubber_Level: "Advanced",
    Rubber_Affiliate_Link: "https://www.amazon.com/Butterfly-Dignics-Table-Tennis-Rubber/dp/B0C8JWBC4M"
  },
  {
    Rubber_Name: "Butterfly Tenergy 05 Hard",
    Rubber_Speed: 95,
    Rubber_Spin: 98,
    Rubber_Control: 65,
    Rubber_Price: 79.99,
    Rubber_Level: "Advanced",
    Rubber_Affiliate_Link: "https://www.amazon.com/Butterfly-Tenergy-Table-Tennis-Rubber/dp/B07HN11T3N"
  },
  {
    Rubber_Name: "JOOLA Omega Control",
    Rubber_Speed: 78,
    Rubber_Spin: 82,
    Rubber_Control: 88,
    Rubber_Price: 29.99,
    Rubber_Level: "Beginner",
    Rubber_Affiliate_Link: "https://www.amazon.com/JOOLA-Omega-Control-Tournament-Performance/dp/B0C539K1TF"
  },
  {
    Rubber_Name: "JOOLA Rhyzm-P",
    Rubber_Speed: 85,
    Rubber_Spin: 88,
    Rubber_Control: 85,
    Rubber_Price: 39.99,
    Rubber_Level: "Intermediate",
    Rubber_Affiliate_Link: "https://www.amazon.com/stores/JOOLANorthAmerica/page/3CC4DD23-DA94-4B1C-A3C8-620F1C17C104"
  },
  {
    Rubber_Name: "Butterfly Wakaba",
    Rubber_Speed: 70,
    Rubber_Spin: 75,
    Rubber_Control: 92,
    Rubber_Price: 19.99,
    Rubber_Level: "Beginner",
    Rubber_Affiliate_Link: "https://www.amazon.com/stores/Butterfly/page/5683577E-C949-4FAC-862C-4813F3104DC2"
  },
  {
    Rubber_Name: "ANDRO Hexer Powergrip",
    Rubber_Speed: 88,
    Rubber_Spin: 90,
    Rubber_Control: 75,
    Rubber_Price: 49.99,
    Rubber_Level: "Advanced",
    Rubber_Affiliate_Link: "https://www.amazon.com/stores/Andro/rubber"
  },
  {
    Rubber_Name: "ANDRO GTT 45",
    Rubber_Speed: 80,
    Rubber_Spin: 85,
    Rubber_Control: 82,
    Rubber_Price: 34.99,
    Rubber_Level: "Intermediate",
    Rubber_Affiliate_Link: "https://www.amazon.com/stores/Andro/page/andro-rubber"
  },
  {
    Rubber_Name: "Butterfly Sriver",
    Rubber_Speed: 75,
    Rubber_Spin: 80,
    Rubber_Control: 85,
    Rubber_Price: 24.99,
    Rubber_Level: "Beginner",
    Rubber_Affiliate_Link: "https://www.amazon.com/stores/Butterfly/page/5683577E-C949-4FAC-862C-4813F3104DC2"
  }
];

// Pre-Assembled Rackets Database
export const preAssembledRackets: PreAssembledRacket[] = [
  {
    Racket_Name: "JOOLA Match Pro ITTF Approved",
    Racket_Blade: "JOOLA Match Pro",
    Racket_FH_Rubber: "JOOLA Control",
    Racket_BH_Rubber: "JOOLA Control",
    Racket_Speed: 75,
    Racket_Spin: 80,
    Racket_Control: 85,
    Racket_Power: 70,
    Racket_Grip: "Flared",
    Racket_Price: 19.95,
    Racket_Level: "Beginner",
    Racket_Affiliate_Link: "https://www.amazon.com/JOOLA-Approved-Allround-Competition-Thickness/dp/B095HGR1XM"
  },
  {
    Racket_Name: "Butterfly BTY-CS 2000 Penhold",
    Racket_Blade: "Butterfly CS 2000",
    Racket_FH_Rubber: "Butterfly Wakaba",
    Racket_BH_Rubber: "Butterfly Wakaba",
    Racket_Speed: 70,
    Racket_Spin: 75,
    Racket_Control: 90,
    Racket_Power: 65,
    Racket_Grip: "Penhold",
    Racket_Price: 31.04,
    Racket_Level: "Beginner",
    Racket_Affiliate_Link: "https://www.amazon.com/Butterfly-2000-Table-Tennis-Racket/dp/B00DCTAXOE"
  },
  {
    Racket_Name: "Butterfly Timo Boll Shakehand",
    Racket_Blade: "Butterfly Timo Boll",
    Racket_FH_Rubber: "Butterfly Sriver",
    Racket_BH_Rubber: "Butterfly Sriver",
    Racket_Speed: 85,
    Racket_Spin: 82,
    Racket_Control: 78,
    Racket_Power: 80,
    Racket_Grip: "Flared",
    Racket_Price: 69.99,
    Racket_Level: "Intermediate",
    Racket_Affiliate_Link: "https://www.amazon.com/Butterfly-Timo-Table-Tennis-Racket/dp/B008N7X06I"
  },
  {
    Racket_Name: "JOOLA Carbon Control Performance",
    Racket_Blade: "JOOLA Carbon Control",
    Racket_FH_Rubber: "JOOLA Omega",
    Racket_BH_Rubber: "JOOLA Omega",
    Racket_Speed: 78,
    Racket_Spin: 80,
    Racket_Control: 82,
    Racket_Power: 75,
    Racket_Grip: "Flared",
    Racket_Price: 89.99,
    Racket_Level: "Intermediate",
    Racket_Affiliate_Link: "https://www.amazon.com/Joola-Carbon-Control-Table-Tennis/dp/B010DB9WFY"
  },
  {
    Racket_Name: "Butterfly Viscaria Pro-Line",
    Racket_Blade: "Butterfly Viscaria",
    Racket_FH_Rubber: "Butterfly Tenergy 05",
    Racket_BH_Rubber: "Butterfly Tenergy 05",
    Racket_Speed: 95,
    Racket_Spin: 98,
    Racket_Control: 65,
    Racket_Power: 92,
    Racket_Grip: "Flared",
    Racket_Price: 299.99,
    Racket_Level: "Advanced",
    Racket_Affiliate_Link: "https://www.amazon.com/stores/Butterfly/page/95496F6D-88AF-42D7-8975-ED7CB7AE5ECA"
  },
  {
    Racket_Name: "ANDRO Timber Professional",
    Racket_Blade: "ANDRO Timber 5",
    Racket_FH_Rubber: "ANDRO Hexer",
    Racket_BH_Rubber: "ANDRO GTT 45",
    Racket_Speed: 88,
    Racket_Spin: 85,
    Racket_Control: 75,
    Racket_Power: 85,
    Racket_Grip: "Flared",
    Racket_Price: 149.99,
    Racket_Level: "Advanced",
    Racket_Affiliate_Link: "https://www.amazon.com/stores/Andro/page/andro-rackets"
  }
];