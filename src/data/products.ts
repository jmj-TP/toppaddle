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
    Blade_Name: "JOOLA Rosskopf Classic",
    Blade_Speed: 85,
    Blade_Control: 80,
    Blade_Power: 82,
    Blade_Grip: "Flared",
    Blade_Price: 59.95,
    Blade_Level: "Intermediate",
    Blade_Affiliate_Link: "https://www.amazon.com/JOOLA-Rosskopf-Classic-Table-Tennis/dp/B0009VTG4W"
  },
  {
    Blade_Name: "Butterfly Timo Boll ALC",
    Blade_Speed: 90,
    Blade_Control: 70,
    Blade_Power: 85,
    Blade_Grip: "Flared",
    Blade_Price: 149.99,
    Blade_Level: "Advanced",
    Blade_Affiliate_Link: "https://www.amazon.com/Butterfly-Timo-Boll-Table-Tennis/dp/B07QXLS2QK"
  },
  {
    Blade_Name: "Stiga Allround Classic",
    Blade_Speed: 65,
    Blade_Control: 90,
    Blade_Power: 60,
    Blade_Grip: "Straight",
    Blade_Price: 39.99,
    Blade_Level: "Beginner",
    Blade_Affiliate_Link: "https://www.amazon.com/Stiga-Allround-Classic-Table-Tennis/dp/B00H3QVGF4"
  },
  {
    Blade_Name: "DHS Hurricane Long 5",
    Blade_Speed: 88,
    Blade_Control: 75,
    Blade_Power: 90,
    Blade_Grip: "Flared",
    Blade_Price: 89.95,
    Blade_Level: "Advanced",
    Blade_Affiliate_Link: "https://www.amazon.com/DHS-Hurricane-Long-Table-Tennis/dp/B01N6T7QJ1"
  },
  {
    Blade_Name: "JOOLA K1",
    Blade_Speed: 70,
    Blade_Control: 85,
    Blade_Power: 68,
    Blade_Grip: "Flared",
    Blade_Price: 44.95,
    Blade_Level: "Beginner",
    Blade_Affiliate_Link: "https://www.amazon.com/JOOLA-K1-Table-Tennis-Blade/dp/B07FKQBJ9X"
  },
  {
    Blade_Name: "Yasaka Ma Lin Extra Offensive",
    Blade_Speed: 92,
    Blade_Control: 68,
    Blade_Power: 88,
    Blade_Grip: "Flared",
    Blade_Price: 119.99,
    Blade_Level: "Advanced",
    Blade_Affiliate_Link: "https://www.amazon.com/Yasaka-Extra-Offensive-Table-Tennis/dp/B00L8XZJM4"
  }
];

// Rubbers Database
export const rubbers: Rubber[] = [
  {
    Rubber_Name: "Butterfly Tenergy 05",
    Rubber_Speed: 95,
    Rubber_Spin: 98,
    Rubber_Control: 65,
    Rubber_Price: 69.99,
    Rubber_Level: "Advanced",
    Rubber_Affiliate_Link: "https://www.amazon.com/Butterfly-Tenergy-Table-Tennis-Rubber/dp/B001QSHP1O"
  },
  {
    Rubber_Name: "DHS Hurricane 3",
    Rubber_Speed: 80,
    Rubber_Spin: 95,
    Rubber_Control: 70,
    Rubber_Price: 24.99,
    Rubber_Level: "Intermediate",
    Rubber_Affiliate_Link: "https://www.amazon.com/DHS-Hurricane-Table-Tennis-Rubber/dp/B00FQBXG9E"
  },
  {
    Rubber_Name: "Yasaka Mark V",
    Rubber_Speed: 75,
    Rubber_Spin: 80,
    Rubber_Control: 90,
    Rubber_Price: 19.99,
    Rubber_Level: "Beginner",
    Rubber_Affiliate_Link: "https://www.amazon.com/Yasaka-Mark-Table-Tennis-Rubber/dp/B00L8Y1LNE"
  },
  {
    Rubber_Name: "Butterfly Dignics 05",
    Rubber_Speed: 92,
    Rubber_Spin: 96,
    Rubber_Control: 72,
    Rubber_Price: 89.99,
    Rubber_Level: "Advanced",
    Rubber_Affiliate_Link: "https://www.amazon.com/Butterfly-Dignics-Table-Tennis-Rubber/dp/B07MXQYG9C"
  },
  {
    Rubber_Name: "JOOLA Rhyzm",
    Rubber_Speed: 85,
    Rubber_Spin: 88,
    Rubber_Control: 85,
    Rubber_Price: 34.95,
    Rubber_Level: "Intermediate",
    Rubber_Affiliate_Link: "https://www.amazon.com/JOOLA-Rhyzm-Table-Tennis-Rubber/dp/B07FKQC2X4"
  },
  {
    Rubber_Name: "Stiga Genesis M",
    Rubber_Speed: 78,
    Rubber_Spin: 82,
    Rubber_Control: 88,
    Rubber_Price: 29.99,
    Rubber_Level: "Beginner",
    Rubber_Affiliate_Link: "https://www.amazon.com/Stiga-Genesis-Table-Tennis-Rubber/dp/B07QXM3F8K"
  },
  {
    Rubber_Name: "Donic Bluefire M2",
    Rubber_Speed: 85,
    Rubber_Spin: 90,
    Rubber_Control: 75,
    Rubber_Price: 39.99,
    Rubber_Level: "Intermediate",
    Rubber_Affiliate_Link: "https://www.amazon.com/Donic-Bluefire-Table-Tennis-Rubber/dp/B07QXNB4F2"
  },
  {
    Rubber_Name: "Tibhar Evolution MX-P",
    Rubber_Speed: 88,
    Rubber_Spin: 85,
    Rubber_Control: 80,
    Rubber_Price: 44.99,
    Rubber_Level: "Intermediate",
    Rubber_Affiliate_Link: "https://www.amazon.com/Tibhar-Evolution-MX-P-Table-Tennis/dp/B07QXPG7H9"
  }
];

// Pre-Assembled Rackets Database
export const preAssembledRackets: PreAssembledRacket[] = [
  {
    Racket_Name: "Butterfly 401 Pre-Assembled",
    Racket_Blade: "Butterfly 401",
    Racket_FH_Rubber: "Butterfly Wakaba",
    Racket_BH_Rubber: "Butterfly Wakaba",
    Racket_Speed: 75,
    Racket_Spin: 80,
    Racket_Control: 85,
    Racket_Power: 70,
    Racket_Grip: "Flared",
    Racket_Price: 59.99,
    Racket_Level: "Beginner",
    Racket_Affiliate_Link: "https://www.amazon.com/Butterfly-401-Pre-Assembled-Table-Tennis/dp/B00FRMK80Y"
  },
  {
    Racket_Name: "Stiga Pro Carbon Performance",
    Racket_Blade: "Stiga Carbonado 290",
    Racket_FH_Rubber: "Stiga Genesis M",
    Racket_BH_Rubber: "Stiga Genesis S",
    Racket_Speed: 88,
    Racket_Spin: 85,
    Racket_Control: 75,
    Racket_Power: 85,
    Racket_Grip: "Flared",
    Racket_Price: 149.99,
    Racket_Level: "Advanced",
    Racket_Affiliate_Link: "https://www.amazon.com/Stiga-Carbon-Performance-Table-Tennis/dp/B07QXK2B4M"
  },
  {
    Racket_Name: "JOOLA Team School",
    Racket_Blade: "JOOLA Team",
    Racket_FH_Rubber: "JOOLA Team",
    Racket_BH_Rubber: "JOOLA Team",
    Racket_Speed: 65,
    Racket_Spin: 70,
    Racket_Control: 90,
    Racket_Power: 60,
    Racket_Grip: "Straight",
    Racket_Price: 34.95,
    Racket_Level: "Beginner",
    Racket_Affiliate_Link: "https://www.amazon.com/JOOLA-Team-School-Table-Tennis/dp/B00FQQQ3F4"
  },
  {
    Racket_Name: "Killerspin JET200",
    Racket_Blade: "Killerspin Jet Basic",
    Racket_FH_Rubber: "Killerspin Nitrx 4Z",
    Racket_BH_Rubber: "Killerspin Nitrx 4Z",
    Racket_Speed: 80,
    Racket_Spin: 78,
    Racket_Control: 82,
    Racket_Power: 75,
    Racket_Grip: "Flared",
    Racket_Price: 69.99,
    Racket_Level: "Intermediate",
    Racket_Affiliate_Link: "https://www.amazon.com/Killerspin-JET200-Blackout-Table-Tennis/dp/B01D1V6T9M"
  },
  {
    Racket_Name: "DHS 6002",
    Racket_Blade: "DHS 6002",
    Racket_FH_Rubber: "DHS Hurricane 3",
    Racket_BH_Rubber: "DHS G666",
    Racket_Speed: 85,
    Racket_Spin: 88,
    Racket_Control: 70,
    Racket_Power: 82,
    Racket_Grip: "Flared",
    Racket_Price: 89.99,
    Racket_Level: "Intermediate",
    Racket_Affiliate_Link: "https://www.amazon.com/DHS-6002-Pre-Assembled-Table-Tennis/dp/B07QXJ8P2L"
  },
  {
    Racket_Name: "Butterfly Balsa Carbo X5",
    Racket_Blade: "Butterfly Balsa Carbo",
    Racket_FH_Rubber: "Butterfly Sriver",
    Racket_BH_Rubber: "Butterfly Sriver",
    Racket_Speed: 92,
    Racket_Spin: 85,
    Racket_Control: 68,
    Racket_Power: 90,
    Racket_Grip: "Flared",
    Racket_Price: 199.99,
    Racket_Level: "Advanced",
    Racket_Affiliate_Link: "https://www.amazon.com/Butterfly-Balsa-Carbo-Pre-Assembled/dp/B07QXNM9F3"
  }
];