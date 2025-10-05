// Table Tennis Product Database

export interface Blade {
  Blade_Name: string;
  Blade_Speed: number; // 1-100
  Blade_Spin: number; // 1-100
  Blade_Control: number; // 1-100
  Blade_Power: number; // 1-100
  Blade_Grip: string;
  Blade_Price: number; // USD, manually added, for sorting only
  Blade_Level: 'Beginner' | 'Intermediate' | 'Advanced';
  Blade_Weight?: number; // grams (optional - will be estimated if not provided)
  Blade_Affiliate_Link: string;
}

// Estimate blade weight based on characteristics
export function estimateBladeWeight(blade: Blade): number {
  if (blade.Blade_Weight) return blade.Blade_Weight;
  
  // Base weight ranges by level and style
  let baseWeight = 88;
  
  // Level adjustment
  if (blade.Blade_Level === 'Beginner') baseWeight = 86;
  else if (blade.Blade_Level === 'Advanced') baseWeight = 91;
  
  // Speed/Power adjustment (fast offensive blades are heavier)
  const offensiveScore = (blade.Blade_Speed + blade.Blade_Power) / 2;
  if (offensiveScore > 85) baseWeight += 3;
  else if (offensiveScore < 60) baseWeight -= 4; // Defensive blades lighter
  
  return Math.round(baseWeight);
}

export interface Rubber {
  Rubber_Name: string;
  Rubber_Speed: number; // 1-100
  Rubber_Spin: number; // 1-100
  Rubber_Control: number; // 1-100
  Rubber_Power: number; // 1-100
  Rubber_Price: number; // USD
  Rubber_Level: 'Beginner' | 'Intermediate' | 'Advanced';
  Rubber_Style: 'Normal' | 'Short Pimples' | 'Long Pimples' | 'Anti';
  Rubber_Weight?: number; // grams (when applied to blade - optional, will be estimated)
  Rubber_Affiliate_Link: string;
}

// Estimate rubber weight when applied to blade
export function estimateRubberWeight(rubber: Rubber): number {
  if (rubber.Rubber_Weight) return rubber.Rubber_Weight;
  
  // Weight varies by rubber style
  switch (rubber.Rubber_Style) {
    case 'Normal':
      // Thicker, power rubbers are heavier
      const powerScore = (rubber.Rubber_Speed + rubber.Rubber_Power) / 2;
      return Math.round(48 + (powerScore / 100) * 5); // 48-53g
    case 'Short Pimples':
      return 46;
    case 'Long Pimples':
      return 43;
    case 'Anti':
      return 41;
    default:
      return 50;
  }
}

export interface PreAssembledRacket {
  Racket_Name: string;
  Racket_Blade: string;
  Racket_FH_Rubber: string;
  Racket_BH_Rubber: string;
  Racket_FH_Rubber_Style: 'Normal' | 'Short Pimples' | 'Long Pimples' | 'Anti';
  Racket_BH_Rubber_Style: 'Normal' | 'Short Pimples' | 'Long Pimples' | 'Anti';
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
export const blades: Blade[] = 

[
  {
    Blade_Name: "JOOLA BASEline All",
    Blade_Speed: 60,
    Blade_Spin: 70,
    Blade_Control: 82,
    Blade_Power: 65,
    Blade_Grip: "Flared",
    Blade_Price: 34.95,
    Blade_Level: "Beginner",
    Blade_Weight: 86,
    Blade_Affiliate_Link: "https://joola.com/products/joola-baseline-all-table-tennis-blade"
  },
  {
    Blade_Name: "JOOLA BASEline OFF",
    Blade_Speed: 70,
    Blade_Spin: 75,
    Blade_Control: 72,
    Blade_Power: 75,
    Blade_Grip: "Flared",
    Blade_Price: 39.95,
    Blade_Level: "Beginner",
    Blade_Weight: 88,
    Blade_Affiliate_Link: "https://joola.com/products/joola-baseline-off-table-tennis-blade"
  },
  {
    Blade_Name: "JOOLA BASEline Carbon",
    Blade_Speed: 78,
    Blade_Spin: 80,
    Blade_Control: 66,
    Blade_Power: 82,
    Blade_Grip: "Flared",
    Blade_Price: 49.95,
    Blade_Level: "Intermediate",
    Blade_Weight: 90,
    Blade_Affiliate_Link: "https://joola.com/products/joola-baseline-carbon-table-tennis-blade"
  },
  {
    Blade_Name: "JOOLA Challenger Off",
    Blade_Speed: 72,
    Blade_Spin: 74,
    Blade_Control: 74,
    Blade_Power: 78,
    Blade_Grip: "Flared",
    Blade_Price: 34.95,
    Blade_Level: "Beginner",
    Blade_Weight: 87,
    Blade_Affiliate_Link: "https://joola.com/products/joola-challenger-off-table-tennis-blade"
  },
  {
    Blade_Name: "JOOLA Chen Weixing Defensive",
    Blade_Speed: 55,
    Blade_Spin: 60,
    Blade_Control: 92,
    Blade_Power: 58,
    Blade_Grip: "Flared",
    Blade_Price: 59.95,
    Blade_Level: "Intermediate",
    Blade_Affiliate_Link: "https://joola.com/products/joola-chen-weixing-table-tennis-blade"
  },
  {
    Blade_Name: "JOOLA Xylo 7",
    Blade_Speed: 80,
    Blade_Spin: 82,
    Blade_Control: 72,
    Blade_Power: 84,
    Blade_Grip: "Flared",
    Blade_Price: 89.95,
    Blade_Level: "Intermediate",
    Blade_Affiliate_Link: "https://joola.com/products/joola-xylo-7-table-tennis-blade"
  },
  {
    Blade_Name: "JOOLA Classic All",
    Blade_Speed: 58,
    Blade_Spin: 68,
    Blade_Control: 88,
    Blade_Power: 62,
    Blade_Grip: "Flared",
    Blade_Price: 34.95,
    Blade_Level: "Beginner",
    Blade_Affiliate_Link: "https://joola.com/products/joola-classic-all-table-tennis-blade"
  },
  {
    Blade_Name: "JOOLA Rosskopf Emotion",
    Blade_Speed: 82,
    Blade_Spin: 84,
    Blade_Control: 78,
    Blade_Power: 83,
    Blade_Grip: "Flared",
    Blade_Price: 89.95,
    Blade_Level: "Intermediate",
    Blade_Affiliate_Link: "https://joola.com/products/joola-rosskopf-emotion-table-tennis-blade"
  },
  {
    Blade_Name: "JOOLA BASEline Junior",
    Blade_Speed: 56,
    Blade_Spin: 66,
    Blade_Control: 86,
    Blade_Power: 60,
    Blade_Grip: "Flared (Junior)",
    Blade_Price: 29.95,
    Blade_Level: "Beginner",
    Blade_Affiliate_Link: "https://joola.com/products/joola-baseline-jr-table-tennis-blade"
  },
  {
    Blade_Name: "ANDRO Treiber CO",
    Blade_Speed: 86,
    Blade_Spin: 84,
    Blade_Control: 72,
    Blade_Power: 88,
    Blade_Grip: "Flared",
    Blade_Price: 79.95,
    Blade_Level: "Intermediate",
    Blade_Affiliate_Link: "https://www.andro.de/en/treiber-co-off"
  },
  {
    Blade_Name: "ANDRO Treiber FI",
    Blade_Speed: 84,
    Blade_Spin: 82,
    Blade_Control: 74,
    Blade_Power: 86,
    Blade_Grip: "Flared",
    Blade_Price: 84.95,
    Blade_Level: "Intermediate",
    Blade_Affiliate_Link: "https://www.andro.de/en/treiber-fi-off"
  },
  {
    Blade_Name: "ANDRO Treiber FL",
    Blade_Speed: 85,
    Blade_Spin: 83,
    Blade_Control: 72,
    Blade_Power: 87,
    Blade_Grip: "Flared",
    Blade_Price: 84.95,
    Blade_Level: "Intermediate",
    Blade_Affiliate_Link: "https://www.andro.de/en/treiber-fl-off"
  },
  {
    Blade_Name: "ANDRO Timber 5 OFF",
    Blade_Speed: 72,
    Blade_Spin: 74,
    Blade_Control: 78,
    Blade_Power: 75,
    Blade_Grip: "Flared",
    Blade_Price: 69.95,
    Blade_Level: "Intermediate",
    Blade_Affiliate_Link: "https://www.andro.de/en/timber-5-off"
  },
  {
    Blade_Name: "ANDRO Timber 5 ALL",
    Blade_Speed: 66,
    Blade_Spin: 72,
    Blade_Control: 84,
    Blade_Power: 64,
    Blade_Grip: "Flared",
    Blade_Price: 64.95,
    Blade_Level: "Intermediate",
    Blade_Affiliate_Link: "https://www.andro.de/en/timber-5-all"
  },
  {
    Blade_Name: "ANDRO Timber 5 DEF",
    Blade_Speed: 52,
    Blade_Spin: 58,
    Blade_Control: 92,
    Blade_Power: 50,
    Blade_Grip: "Flared",
    Blade_Price: 69.95,
    Blade_Level: "Intermediate",
    Blade_Affiliate_Link: "https://www.andro.de/en/timber-5-def"
  },
  {
    Blade_Name: "ANDRO Kanter CO",
    Blade_Speed: 90,
    Blade_Spin: 88,
    Blade_Control: 64,
    Blade_Power: 92,
    Blade_Grip: "Flared",
    Blade_Price: 89.95,
    Blade_Level: "Intermediate",
    Blade_Affiliate_Link: "https://www.andro.de/en/kanter-co-off"
  },
  {
    Blade_Name: "Butterfly TB5 Alpha",
    Blade_Speed: 74,
    Blade_Spin: 76,
    Blade_Control: 80,
    Blade_Power: 70,
    Blade_Grip: "Flared",
    Blade_Price: 64.99,
    Blade_Level: "Intermediate",
    Blade_Affiliate_Link: "https://www.butterflyonline.com/product/tb5-alpha-fl-blade"
  },
  {
    Blade_Name: "Butterfly Boll Control",
    Blade_Speed: 58,
    Blade_Spin: 65,
    Blade_Control: 88,
    Blade_Power: 60,
    Blade_Grip: "Flared",
    Blade_Price: 59.99,
    Blade_Level: "Beginner",
    Blade_Affiliate_Link: "https://www.butterflyonline.com/product/boll-control-blade"
  },
  {
    Blade_Name: "Butterfly Boll Allround",
    Blade_Speed: 62,
    Blade_Spin: 70,
    Blade_Control: 84,
    Blade_Power: 65,
    Blade_Grip: "Flared",
    Blade_Price: 64.99,
    Blade_Level: "Intermediate",
    Blade_Affiliate_Link: "https://www.butterflyonline.com/product/boll-allround-blade"
  },
  {
    Blade_Name: "Butterfly Primorac",
    Blade_Speed: 74,
    Blade_Spin: 76,
    Blade_Control: 78,
    Blade_Power: 72,
    Blade_Grip: "Flared",
    Blade_Price: 69.99,
    Blade_Level: "Intermediate",
    Blade_Affiliate_Link: "https://www.butterflyonline.com/product/primorac-blade"
  },
  {
    Blade_Name: "Butterfly Viscaria",
    Blade_Speed: 92,
    Blade_Spin: 90,
    Blade_Control: 80,
    Blade_Power: 94,
    Blade_Grip: "Flared",
    Blade_Price: 166.49,
    Blade_Level: "Advanced",
    Blade_Affiliate_Link: "https://tabletennisstore.us/products/butterfly-viscaria-offensive-table-tennis-blade"
  },
  {
    Blade_Name: "Butterfly Timo Boll ALC",
    Blade_Speed: 90,
    Blade_Spin: 88,
    Blade_Control: 82,
    Blade_Power: 92,
    Blade_Grip: "Flared",
    Blade_Price: 179.90,
    Blade_Level: "Advanced",
    Blade_Affiliate_Link: "https://en.butterfly.tt/hoelzer/timo-boll-alc.html"
  },
  {
    Blade_Name: "JOOLA Nobilis PBO-C",
    Blade_Speed: 95,
    Blade_Spin: 92,
    Blade_Control: 78,
    Blade_Power: 98,
    Blade_Grip: "Flared",
    Blade_Price: 199.00,
    Blade_Level: "Advanced",
    Blade_Affiliate_Link: "https://joola.it/products/joola-holz-nobilis-pbo-c"
  },
  {
    Blade_Name: "Butterfly Viscaria Super ALC",
    Blade_Speed: 94,
    Blade_Spin: 92,
    Blade_Control: 78,
    Blade_Power: 96,
    Blade_Grip: "Flared",
    Blade_Price: 242.99,
    Blade_Level: "Advanced",
    Blade_Affiliate_Link: "https://tabletennisstore.us/products/butterfly-viscaria-super-alc-offensive-table-tennis-blade"
  },
  {
    Blade_Name: "Butterfly Zhang Jike ALC",
    Blade_Speed: 91,
    Blade_Spin: 89,
    Blade_Control: 80,
    Blade_Power: 93,
    Blade_Grip: "Flared",
    Blade_Price: 179.90,
    Blade_Level: "Advanced",
    Blade_Affiliate_Link: "https://en.butterfly.tt/hoelzer/zhang-jike-alc.html"
  },
  {
    Blade_Name: "Butterfly Fan Zhendong ALC",
    Blade_Speed: 94,
    Blade_Spin: 92,
    Blade_Control: 81,
    Blade_Power: 95,
    Blade_Grip: "Flared",
    Blade_Price: 184.90,
    Blade_Level: "Advanced",
    Blade_Affiliate_Link: "https://en.butterfly.tt/hoelzer/fan-zhendong-alc.html"
  },
  {
    Blade_Name: "Butterfly Lin Gaoyuan ALC",
    Blade_Speed: 93,
    Blade_Spin: 91,
    Blade_Control: 80,
    Blade_Power: 94,
    Blade_Grip: "Flared",
    Blade_Price: 184.90,
    Blade_Level: "Advanced",
    Blade_Affiliate_Link: "https://en.butterfly.tt/hoelzer/lin-gaoyuan-alc.html"
  },
  {
    Blade_Name: "Butterfly Harimoto Tomokazu Innerforce ALC",
    Blade_Speed: 92,
    Blade_Spin: 90,
    Blade_Control: 83,
    Blade_Power: 93,
    Blade_Grip: "Flared",
    Blade_Price: 184.90,
    Blade_Level: "Advanced",
    Blade_Affiliate_Link: "https://en.butterfly.tt/hoelzer/harimoto-tomokazu-innerforce-alc.html"
  },
  {
    Blade_Name: "Butterfly Jun Mizutani Super ZLC",
    Blade_Speed: 97,
    Blade_Spin: 94,
    Blade_Control: 76,
    Blade_Power: 99,
    Blade_Grip: "Flared",
    Blade_Price: 379.90,
    Blade_Level: "Advanced",
    Blade_Affiliate_Link: "https://en.butterfly.tt/hoelzer/mizutani-jun-super-zlc.html"
  },
  {
    Blade_Name: "Butterfly Zhang Jike Super ZLC",
    Blade_Speed: 98,
    Blade_Spin: 95,
    Blade_Control: 75,
    Blade_Power: 99,
    Blade_Grip: "Flared",
    Blade_Price: 379.90,
    Blade_Level: "Advanced",
    Blade_Affiliate_Link: "https://en.butterfly.tt/hoelzer/zhang-jike-super-zlc.html"
  },
  {
    "Blade_Name": "DHS Power G5X",
    "Blade_Speed": 86,
    "Blade_Spin": 88,
    "Blade_Control": 92,
    "Blade_Power": 88,
    "Blade_Grip": "Flared",
    "Blade_Price": 44.95,
    "Blade_Level": "Intermediate",
    "Blade_Weight": 89,
    "Blade_Affiliate_Link": "https://www.megaspin.net/store/default.asp?pid=dhs-power-g5x"
  },
  {
    "Blade_Name": "DHS Hurricane 301",
    "Blade_Speed": 78,
    "Blade_Spin": 82,
    "Blade_Control": 80,
    "Blade_Power": 76,
    "Blade_Grip": "Flared",
    "Blade_Price": 63.60,
    "Blade_Level": "Intermediate",
    "Blade_Weight": 85,
    "Blade_Affiliate_Link": "https://www.aliexpress.com/p/tesla-landing/index.html?scenario=c_ppc_item_bridge&productId=3256809282792901"
  },
  {
    "Blade_Name": "DHS Hurricane King ACB",
    "Blade_Speed": 88,
    "Blade_Spin": 90,
    "Blade_Control": 86,
    "Blade_Power": 90,
    "Blade_Grip": "Flared",
    "Blade_Price": 199.95,
    "Blade_Level": "Advanced",
    "Blade_Weight": 89,
    "Blade_Affiliate_Link": "https://dhssport.com/en/DHS_Hurricane_King_acB"
  },
  {
    "Blade_Name": "DHS PG7",
    "Blade_Speed": 82,
    "Blade_Spin": 80,
    "Blade_Control": 85,
    "Blade_Power": 80,
    "Blade_Grip": "Flared",
    "Blade_Price": 31.99,
    "Blade_Level": "Beginner",
    "Blade_Weight": 87,
    "Blade_Affiliate_Link": "https://www.dhs-729.eu/gb/dhs-blades/115-dhs-pg7.html"
  }
  
];

// Rubbers Database
export const rubbers: Rubber[] = [
  {
    "Rubber_Name": "Andro Hexer Powergrip",
    "Rubber_Speed": 90,
    "Rubber_Spin": 85,
    "Rubber_Control": 80,
    "Rubber_Power": 90,
    "Rubber_Price": 47.45,
    "Rubber_Level": "Advanced",
    "Rubber_Style": "Normal",
    "Rubber_Affiliate_Link": "https://www.tabletennis11.com/other_eng/andro-hexer-powergrip"
  },
  {
    "Rubber_Name": "Butterfly Flextra",
    "Rubber_Speed": 70,
    "Rubber_Spin": 75,
    "Rubber_Control": 85,
    "Rubber_Power": 65,
    "Rubber_Price": 17.99,
    "Rubber_Level": "Beginner",
    "Rubber_Style": "Normal",
    "Rubber_Affiliate_Link": "https://shop.butterflyonline.com/flextra"
  },
  {
    "Rubber_Name": "JOOLA Rhyzer 48",
    "Rubber_Speed": 90,
    "Rubber_Spin": 85,
    "Rubber_Control": 80,
    "Rubber_Power": 88,
    "Rubber_Price": 54.95,
    "Rubber_Level": "Advanced",
    "Rubber_Style": "Normal",
    "Rubber_Affiliate_Link": "https://joola.com/collections/table-tennis-rubbers/products/rhyzer-48-table-tennis-rubber"
  },
  {
    "Rubber_Name": "Andro Rasanter R42",
    "Rubber_Speed": 85,
    "Rubber_Spin": 90,
    "Rubber_Control": 88,
    "Rubber_Power": 85,
    "Rubber_Price": 47.45,
    "Rubber_Level": "Intermediate",
    "Rubber_Style": "Normal",
    "Rubber_Affiliate_Link": "https://www.tabletennis11.com/other_eng/andro-rasanter-r42"
  },
  {
    "Rubber_Name": "Butterfly Sriver",
    "Rubber_Speed": 80,
    "Rubber_Spin": 85,
    "Rubber_Control": 90,
    "Rubber_Power": 80,
    "Rubber_Price": 30.00,
    "Rubber_Level": "Intermediate",
    "Rubber_Style": "Normal",
    "Rubber_Affiliate_Link": "https://shop.butterflyonline.com/sriver"
  },
  {
    "Rubber_Name": "JOOLA Samba",
    "Rubber_Speed": 70,
    "Rubber_Spin": 80,
    "Rubber_Control": 85,
    "Rubber_Power": 75,
    "Rubber_Price": 24.99,
    "Rubber_Level": "Beginner",
    "Rubber_Style": "Normal",
    "Rubber_Affiliate_Link": "https://www.joola.com/products/samba"
  },
  {
    "Rubber_Name": "Andro Hexer",
    "Rubber_Speed": 85,
    "Rubber_Spin": 80,
    "Rubber_Control": 75,
    "Rubber_Power": 80,
    "Rubber_Price": 45.00,
    "Rubber_Level": "Intermediate",
    "Rubber_Style": "Normal",
    "Rubber_Affiliate_Link": "https://www.andro.de/en/hexer"
  },
  {
    "Rubber_Name": "Butterfly Flextra FX",
    "Rubber_Speed": 70,
    "Rubber_Spin": 75,
    "Rubber_Control": 85,
    "Rubber_Power": 70,
    "Rubber_Price": 17.99,
    "Rubber_Level": "Beginner",
    "Rubber_Style": "Normal",
    "Rubber_Affiliate_Link": "https://shop.butterflyonline.com/flextra-fx"
  },
  {
    "Rubber_Name": "JOOLA Rhyzer 45",
    "Rubber_Speed": 80,
    "Rubber_Spin": 85,
    "Rubber_Control": 90,
    "Rubber_Power": 80,
    "Rubber_Price": 54.95,
    "Rubber_Level": "Intermediate",
    "Rubber_Style": "Normal",
    "Rubber_Affiliate_Link": "https://joola.com/collections/table-tennis-rubbers/products/rhyzer-45-table-tennis-rubber"
  },
  {
    "Rubber_Name": "Andro Hexer Duro",
    "Rubber_Speed": 90,
    "Rubber_Spin": 85,
    "Rubber_Control": 80,
    "Rubber_Power": 90,
    "Rubber_Price": 47.45,
    "Rubber_Level": "Advanced",
    "Rubber_Style": "Normal",
    "Rubber_Affiliate_Link": "https://www.tabletennis11.com/other_eng/andro-hexer-duro"
  },
  {
    "Rubber_Name": "Andro Hexer PowerGrip SFX",
    "Rubber_Speed": 80,
    "Rubber_Spin": 85,
    "Rubber_Control": 90,
    "Rubber_Power": 82,
    "Rubber_Price": 50,
    "Rubber_Level": "Intermediate",
    "Rubber_Style": "Normal",
    "Rubber_Affiliate_Link" : "https://www.megaspin.net/store/default.asp?pid=andro-hexer-pg-sfx",
  },
  {
    "Rubber_Name": "Butterfly Dignics 09C",
    "Rubber_Speed": 86,
    "Rubber_Spin": 95,
    "Rubber_Control": 78,
    "Rubber_Power": 88,
    "Rubber_Price": 89.99,
    "Rubber_Level": "Advanced",
    "Rubber_Style": "Normal",
    "Rubber_Affiliate_Link": "https://shop.butterflyonline.com/dignics-09C-dig09Cp"
  },
  {
    "Rubber_Name": "Butterfly Dignics 05",
    "Rubber_Speed": 86,
    "Rubber_Spin": 85,
    "Rubber_Control": 80,
    "Rubber_Power": 85,
    "Rubber_Price": 89.99,
    "Rubber_Level": "Advanced",
    "Rubber_Style": "Normal",
    "Rubber_Affiliate_Link": "https://www.butterfly-global.com/en/products/detail/06040.html"
  },
  {
    "Rubber_Name": "Butterfly Tenergy 05",
    "Rubber_Speed": 88,
    "Rubber_Spin": 92,
    "Rubber_Control": 80,
    "Rubber_Power": 90,
    "Rubber_Price": 79.99,
    "Rubber_Level": "Advanced",
    "Rubber_Style": "Normal",
    "Rubber_Affiliate_Link": "https://www.butterfly-global.com/en/products/detail/05800.html"
  },
  {
    "Rubber_Name": "ANDRO Rasanter R47",
    "Rubber_Speed": 90,
    "Rubber_Spin": 93,
    "Rubber_Control": 78,
    "Rubber_Power": 92,
    "Rubber_Price": 47.45,
    "Rubber_Level": "Advanced",
    "Rubber_Style": "Normal",
    "Rubber_Affiliate_Link": "https://tabletennisstore.us/products/andro-rasanter-r47-table-tennis-rubber"
  },
  {
    "Rubber_Name": "ANDRO Rasanter R53",
    "Rubber_Speed": 92,
    "Rubber_Spin": 95,
    "Rubber_Control": 75,
    "Rubber_Power": 94,
    "Rubber_Price": 50.30,
    "Rubber_Level": "Advanced",
    "Rubber_Style": "Normal",
    "Rubber_Affiliate_Link": "https://www.tabletennis11.com/other_eng/andro-rasanter-r53"
  },
  {
    "Rubber_Name": "ANDRO Rasanter R50",
    "Rubber_Speed": 91,
    "Rubber_Spin": 94,
    "Rubber_Control": 77,
    "Rubber_Power": 93,
    "Rubber_Price": 59.95,
    "Rubber_Level": "Advanced",
    "Rubber_Style": "Normal",
    "Rubber_Affiliate_Link": "https://tabletennisstore.us/products/andro-rasanter-r50-table-tennis-rubber"
  },
  {
    "Rubber_Name": "ANDRO Rasanter R42 Advanced",
    "Rubber_Speed": 82,
    "Rubber_Spin": 88,
    "Rubber_Control": 83,
    "Rubber_Power": 84,
    "Rubber_Price": 47.45,
    "Rubber_Level": "Advanced",
    "Rubber_Style": "Normal",
    "Rubber_Affiliate_Link": "https://racketinsight.com/table-tennis/andro-rasanter-r42-review/"
  },
  {
    "Rubber_Name": "Butterfly Feint Long II",
    "Rubber_Speed": 40,
    "Rubber_Spin": 70,
    "Rubber_Control": 95,
    "Rubber_Power": 35,
    "Rubber_Price": 52.00,
    "Rubber_Level": "Advanced",
    "Rubber_Style": "Long Pimples",
    "Rubber_Affiliate_Link": "https://sb-beta.butterflyonline.com/feint-long-ii"
  },
  {
    "Rubber_Name": "Butterfly Feint Long III",
    "Rubber_Speed": 35,
    "Rubber_Spin": 65,
    "Rubber_Control": 97,
    "Rubber_Power": 30,
    "Rubber_Price": 53.95,
    "Rubber_Level": "Advanced",
    "Rubber_Style": "Long Pimples",
    "Rubber_Affiliate_Link": "https://sb-beta.butterflyonline.com/feint-long-iii"
  },
  {
    "Rubber_Name": "Butterfly Ilius B",
    "Rubber_Speed": 45,
    "Rubber_Spin": 60,
    "Rubber_Control": 92,
    "Rubber_Power": 40,
    "Rubber_Price": 34.19,
    "Rubber_Level": "Intermediate",
    "Rubber_Style": "Long Pimples",
    "Rubber_Affiliate_Link": "https://tabletennisstore.us/products/butterfly-ilius-b-long-pips-table-tennis-rubber"
  },
  {
    "Rubber_Name": "JOOLA CWX Long-Pips",
    "Rubber_Speed": 30,
    "Rubber_Spin": 60,
    "Rubber_Control": 98,
    "Rubber_Power": 25,
    "Rubber_Price": 55.00,
    "Rubber_Level": "Advanced",
    "Rubber_Style": "Long Pimples",
    "Rubber_Affiliate_Link": "https://joola.com.au/product/joola-cwx-long-pips-table-tennis-rubber"
  },
  {
    "Rubber_Name": "JOOLA Express Ultra Short-Pips",
    "Rubber_Speed": 88,
    "Rubber_Spin": 65,
    "Rubber_Control": 90,
    "Rubber_Power": 85,
    "Rubber_Price": 49.95,
    "Rubber_Level": "Advanced",
    "Rubber_Style": "Short Pimples",
    "Rubber_Affiliate_Link": "https://tabletennisstore.us/products/joola-express-ultra-short-pips-table-tennis-rubber"
  },
  {
    "Rubber_Name": "Butterfly Bryce Highspeed",
    "Rubber_Speed": 88,
    "Rubber_Spin": 85,
    "Rubber_Control": 78,
    "Rubber_Power": 90,
    "Rubber_Price": 89.99,
    "Rubber_Level": "Advanced",
    "Rubber_Style": "Normal",
    "Rubber_Affiliate_Link": "https://shop.butterflyonline.com/bryce-highspeed"
  },
  {
    "Rubber_Name": "Butterfly Bryce Highspin",
    "Rubber_Speed": 82,
    "Rubber_Spin": 90,
    "Rubber_Control": 80,
    "Rubber_Power": 88,
    "Rubber_Price": 89.99,
    "Rubber_Level": "Advanced",
    "Rubber_Style": "Normal",
    "Rubber_Affiliate_Link": "https://shop.butterflyonline.com/bryce-highspin"
  },
  {
    "Rubber_Name": "Butterfly Tenergy 64",
    "Rubber_Speed": 92,
    "Rubber_Spin": 88,
    "Rubber_Control": 75,
    "Rubber_Power": 93,
    "Rubber_Price": 79.99,
    "Rubber_Level": "Advanced",
    "Rubber_Style": "Normal",
    "Rubber_Affiliate_Link": "https://shop.butterflyonline.com/tenergy-64"
  },
  {
    "Rubber_Name": "Butterfly Dignics 80",
    "Rubber_Speed": 90,
    "Rubber_Spin": 90,
    "Rubber_Control": 79,
    "Rubber_Power": 91,
    "Rubber_Price": 89.99,
    "Rubber_Level": "Advanced",
    "Rubber_Style": "Normal",
    "Rubber_Affiliate_Link": "https://shop.butterflyonline.com/dignics-80"
  },
  {
    "Rubber_Name": "ANDRO Rasanter V47",
    "Rubber_Speed": 95,
    "Rubber_Spin": 85,
    "Rubber_Control": 76,
    "Rubber_Power": 93,
    "Rubber_Price": 59.95,
    "Rubber_Level": "Advanced",
    "Rubber_Style": "Normal",
    "Rubber_Affiliate_Link": "https://tabletennisstore.us/products/andro-rasanter-v47"
  },
  {
    "Rubber_Name": "ANDRO Rasanter C53",
    "Rubber_Speed": 88,
    "Rubber_Spin": 90,
    "Rubber_Control": 82,
    "Rubber_Power": 89,
    "Rubber_Price": 64.95,
    "Rubber_Level": "Advanced",
    "Rubber_Style": "Normal",
    "Rubber_Affiliate_Link": "https://www.andro.de/en/rubbers"
  },
  {
    "Rubber_Name": "JOOLA Rhyzer 55",
    "Rubber_Speed": 94,
    "Rubber_Spin": 92,
    "Rubber_Control": 77,
    "Rubber_Power": 93,
    "Rubber_Price": 69.95,
    "Rubber_Level": "Advanced",
    "Rubber_Style": "Normal",
    "Rubber_Affiliate_Link": "https://www.joola.com/products/rhyzer-55"
  }
];

// Pre-Assembled Rackets Database
export const preAssembledRackets: PreAssembledRacket[] = [

  {
    "Racket_Name": "Beginner Allround (Low)",
    "Racket_Blade": "5-ply all-wood (light)",
    "Racket_FH_Rubber": "Butterfly Flextra (inverted, soft)",
    "Racket_BH_Rubber": "Butterfly Flextra (inverted, soft)",
    "Racket_FH_Rubber_Style": "Normal",
    "Racket_BH_Rubber_Style": "Normal",
    "Racket_Speed": 51,
    "Racket_Spin": 52,
    "Racket_Control": 80,
    "Racket_Power": 56,
    "Racket_Grip": "Flared",
    "Racket_Price": 19.99,
    "Racket_Level": "Beginner",
    "Racket_Affiliate_Link": ""
  },
  {
    "Racket_Name": "Budget Offensive (Low)",
    "Racket_Blade": "5-ply wood (hard top layer)",
    "Racket_FH_Rubber": "JOOLA Samba FX (inverted, medium)",
    "Racket_BH_Rubber": "JOOLA Samba EL (inverted, soft)",
    "Racket_FH_Rubber_Style": "Normal",
    "Racket_BH_Rubber_Style": "Normal",
    "Racket_Speed": 69,
    "Racket_Spin": 60,
    "Racket_Control": 62,
    "Racket_Power": 67,
    "Racket_Grip": "Flared",
    "Racket_Price": 29.99,
    "Racket_Level": "Beginner",
    "Racket_Affiliate_Link": ""
  },
  {
    "Racket_Name": "Budget Short-Pips (Low)",
    "Racket_Blade": "5-ply all-wood",
    "Racket_FH_Rubber": "Short Pips (factory)",
    "Racket_BH_Rubber": "Inverted soft (factory)",
    "Racket_FH_Rubber_Style": "Short Pimples",
    "Racket_BH_Rubber_Style": "Normal",
    "Racket_Speed": 71,
    "Racket_Spin": 46,
    "Racket_Control": 75,
    "Racket_Power": 69,
    "Racket_Grip": "Flared",
    "Racket_Price": 34.99,
    "Racket_Level": "Beginner",
    "Racket_Affiliate_Link": ""
  },
  {
    "Racket_Name": "Budget Long-Pips Defender (Low)",
    "Racket_Blade": "5-ply limba outer",
    "Racket_FH_Rubber": "Inverted medium (factory)",
    "Racket_BH_Rubber": "Long Pips (factory defensive)",
    "Racket_FH_Rubber_Style": "Normal",
    "Racket_BH_Rubber_Style": "Long Pimples",
    "Racket_Speed": 42,
    "Racket_Spin": 51,
    "Racket_Control": 87,
    "Racket_Power": 38,
    "Racket_Grip": "Flared",
    "Racket_Price": 39.99,
    "Racket_Level": "Beginner",
    "Racket_Affiliate_Link": ""
  },
  {
    "Racket_Name": "Budget Anti-Spin Set (Low)",
    "Racket_Blade": "5-ply wood",
    "Racket_FH_Rubber": "Anti-spin (factory)",
    "Racket_BH_Rubber": "Inverted soft (factory)",
    "Racket_FH_Rubber_Style": "Anti",
    "Racket_BH_Rubber_Style": "Normal",
    "Racket_Speed": 49,
    "Racket_Spin": 20,
    "Racket_Control": 89,
    "Racket_Power": 38,
    "Racket_Grip": "Flared",
    "Racket_Price": 34.99,
    "Racket_Level": "Beginner",
    "Racket_Affiliate_Link": ""
  },
  {
    "Racket_Name": "Value Carbon Offense (Low→Mid)",
    "Racket_Blade": "5-ply + thin carbon layer",
    "Racket_FH_Rubber": "ANDRO Hexer (factory medium)",
    "Racket_BH_Rubber": "ANDRO Hexer Grip (factory)",
    "Racket_FH_Rubber_Style": "Normal",
    "Racket_BH_Rubber_Style": "Normal",
    "Racket_Speed": 76,
    "Racket_Spin": 71,
    "Racket_Control": 65,
    "Racket_Power": 78,
    "Racket_Grip": "Concave",
    "Racket_Price": 59.99,
    "Racket_Level": "Intermediate",
    "Racket_Affiliate_Link": ""
  },
  {
    "Racket_Name": "Mid Allround (Medium)",
    "Racket_Blade": "5-ply all-wood, balanced",
    "Racket_FH_Rubber": "Butterfly Rozena (factory)",
    "Racket_BH_Rubber": "Butterfly Sriver FX (factory)",
    "Racket_FH_Rubber_Style": "Normal",
    "Racket_BH_Rubber_Style": "Normal",
    "Racket_Speed": 72,
    "Racket_Spin": 74,
    "Racket_Control": 78,
    "Racket_Power": 72,
    "Racket_Grip": "Flared",
    "Racket_Price": 79.99,
    "Racket_Level": "Intermediate",
    "Racket_Affiliate_Link": ""
  },
  {
    "Racket_Name": "Mid Offensive Loop (Medium)",
    "Racket_Blade": "5-ply + inner carbon",
    "Racket_FH_Rubber": "JOOLA Rhyzer 48 (factory)",
    "Racket_BH_Rubber": "JOOLA Rhyzer 43 (factory)",
    "Racket_FH_Rubber_Style": "Normal",
    "Racket_BH_Rubber_Style": "Normal",
    "Racket_Speed": 83,
    "Racket_Spin": 80,
    "Racket_Control": 71,
    "Racket_Power": 83,
    "Racket_Grip": "Flared",
    "Racket_Price": 99.99,
    "Racket_Level": "Intermediate",
    "Racket_Affiliate_Link": ""
  },
  {
    "Racket_Name": "Mid Short-Pips Fast (Medium)",
    "Racket_Blade": "5-ply speed wood",
    "Racket_FH_Rubber": "Short-pips (factory fast)",
    "Racket_BH_Rubber": "Inverted medium",
    "Racket_FH_Rubber_Style": "Short Pimples",
    "Racket_BH_Rubber_Style": "Normal",
    "Racket_Speed": 87,
    "Racket_Spin": 60,
    "Racket_Control": 72,
    "Racket_Power": 86,
    "Racket_Grip": "Flared",
    "Racket_Price": 89.99,
    "Racket_Level": "Intermediate",
    "Racket_Affiliate_Link": ""
  },
  {
    "Racket_Name": "Mid Long-Pips Defender (Medium)",
    "Racket_Blade": "5-ply limba + soft core",
    "Racket_FH_Rubber": "Inverted soft (factory)",
    "Racket_BH_Rubber": "Long-pips (factory high control)",
    "Racket_FH_Rubber_Style": "Normal",
    "Racket_BH_Rubber_Style": "Long Pimples",
    "Racket_Speed": 49,
    "Racket_Spin": 54,
    "Racket_Control": 92,
    "Racket_Power": 43,
    "Racket_Grip": "Flared",
    "Racket_Price": 94.99,
    "Racket_Level": "Intermediate",
    "Racket_Affiliate_Link": ""
  },
  {
    "Racket_Name": "Mid Anti-Spin Specialist (Medium)",
    "Racket_Blade": "5-ply wood with dampening layer",
    "Racket_FH_Rubber": "Inverted medium",
    "Racket_BH_Rubber": "Anti-spin (factory high control)",
    "Racket_FH_Rubber_Style": "Normal",
    "Racket_BH_Rubber_Style": "Anti",
    "Racket_Speed": 54,
    "Racket_Spin": 23,
    "Racket_Control": 94,
    "Racket_Power": 49,
    "Racket_Grip": "Concave",
    "Racket_Price": 109.99,
    "Racket_Level": "Intermediate",
    "Racket_Affiliate_Link": ""
  },
  {
    "Racket_Name": "Premium Offense (High)",
    "Racket_Blade": "7-ply offensive + carbon layers",
    "Racket_FH_Rubber": "Butterfly Dignics 09C (factory)",
    "Racket_BH_Rubber": "Butterfly Dignics 05 (factory)",
    "Racket_FH_Rubber_Style": "Normal",
    "Racket_BH_Rubber_Style": "Normal",
    "Racket_Speed": 92,
    "Racket_Spin": 94,
    "Racket_Control": 76,
    "Racket_Power": 92,
    "Racket_Grip": "Flared",
    "Racket_Price": 259.99,
    "Racket_Level": "Advanced",
    "Racket_Affiliate_Link": ""
  },
  {
    "Racket_Name": "Premium Allround/Loop (High)",
    "Racket_Blade": "5-ply+inner ALC",
    "Racket_FH_Rubber": "ANDRO Rasanter R50 (factory)",
    "Racket_BH_Rubber": "JOOLA Rhyzer 55 (factory)",
    "Racket_FH_Rubber_Style": "Normal",
    "Racket_BH_Rubber_Style": "Normal",
    "Racket_Speed": 91,
    "Racket_Spin": 92,
    "Racket_Control": 75,
    "Racket_Power": 92,
    "Racket_Grip": "Flared",
    "Racket_Price": 229.99,
    "Racket_Level": "Advanced",
    "Racket_Affiliate_Link": ""
  },
  {
    "Racket_Name": "Premium Short-Pips Attack (High)",
    "Racket_Blade": "7-ply speed wood",
    "Racket_FH_Rubber": "Short-pips (professional fast, factory)",
    "Racket_BH_Rubber": "Inverted hard (factory)",
    "Racket_FH_Rubber_Style": "Short Pimples",
    "Racket_BH_Rubber_Style": "Normal",
    "Racket_Speed": 96,
    "Racket_Spin": 71,
    "Racket_Control": 78,
    "Racket_Power": 95,
    "Racket_Grip": "Flared",
    "Racket_Price": 199.99,
    "Racket_Level": "Advanced",
    "Racket_Affiliate_Link": ""
  },
  {
    "Racket_Name": "Premium Long-Pips Specialist (High)",
    "Racket_Blade": "5-ply limba + vibration damping",
    "Racket_FH_Rubber": "Inverted medium (factory)",
    "Racket_BH_Rubber": "Feint Long II / Long pips (factory premium)",
    "Racket_FH_Rubber_Style": "Normal",
    "Racket_BH_Rubber_Style": "Long Pimples",
    "Racket_Speed": 43,
    "Racket_Spin": 60,
    "Racket_Control": 98,
    "Racket_Power": 36,
    "Racket_Grip": "Flared",
    "Racket_Price": 179.99,
    "Racket_Level": "Advanced",
    "Racket_Affiliate_Link": ""
  },
  {
    "Racket_Name": "Premium Anti-Spin Expert (High)",
    "Racket_Blade": "5-ply wood + damped core",
    "Racket_FH_Rubber": "Inverted hard (factory)",
    "Racket_BH_Rubber": "High-quality anti-spin (factory)",
    "Racket_FH_Rubber_Style": "Normal",
    "Racket_BH_Rubber_Style": "Anti",
    "Racket_Speed": 58,
    "Racket_Spin": 18,
    "Racket_Control": 96,
    "Racket_Power": 51,
    "Racket_Grip": "Concave",
    "Racket_Price": 189.99,
    "Racket_Level": "Advanced",
    "Racket_Affiliate_Link": ""
  },
  {
    Racket_Name: "JOOLA Match Pro ITTF Approved",
    Racket_Blade: "JOOLA Match Pro",
    Racket_FH_Rubber: "JOOLA Control",
    Racket_BH_Rubber: "JOOLA Control",
    Racket_FH_Rubber_Style: "Normal",
    Racket_BH_Rubber_Style: "Normal",
    Racket_Speed: 69,
    Racket_Spin: 72,
    Racket_Control: 77,
    Racket_Power: 64,
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
    Racket_FH_Rubber_Style: "Normal",
    Racket_BH_Rubber_Style: "Normal",
    Racket_Speed: 64,
    Racket_Spin: 69,
    Racket_Control: 82,
    Racket_Power: 60,
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
    Racket_FH_Rubber_Style: "Normal",
    Racket_BH_Rubber_Style: "Normal",
    Racket_Speed: 77,
    Racket_Spin: 74,
    Racket_Control: 71,
    Racket_Power: 72,
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
    Racket_FH_Rubber_Style: "Normal",
    Racket_BH_Rubber_Style: "Normal",
    Racket_Speed: 71,
    Racket_Spin: 72,
    Racket_Control: 74,
    Racket_Power: 69,
    Racket_Grip: "Flared",
    Racket_Price: 25,
    Racket_Level: "Intermediate",
    Racket_Affiliate_Link: "https://www.amazon.com/Joola-Carbon-Control-Table-Tennis/dp/B010DB9WFY"
  },
  {
    Racket_Name: "Butterfly Viscaria Pro-Line",
    Racket_Blade: "Butterfly Viscaria",
    Racket_FH_Rubber: "Butterfly Tenergy 05",
    Racket_BH_Rubber: "Butterfly Tenergy 05",
    Racket_FH_Rubber_Style: "Normal",
    Racket_BH_Rubber_Style: "Normal",
    Racket_Speed: 87,
    Racket_Spin: 89,
    Racket_Control: 60,
    Racket_Power: 84,
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
    Racket_FH_Rubber_Style: "Normal",
    Racket_BH_Rubber_Style: "Normal",
    Racket_Speed: 79,
    Racket_Spin: 77,
    Racket_Control: 69,
    Racket_Power: 77,
    Racket_Grip: "Flared",
    Racket_Price: 149.99,
    Racket_Level: "Advanced",
    Racket_Affiliate_Link: "https://www.amazon.com/stores/Andro/page/andro-rackets"
  },
  {
    Racket_Name: "Killerspin JET400",
    Racket_Blade: "5-ply wood",
    Racket_FH_Rubber: "Nitrx-4Z",
    Racket_BH_Rubber: "Nitrx-4Z",
    Racket_FH_Rubber_Style: "Normal",
    Racket_BH_Rubber_Style: "Normal",
    Racket_Speed: 65,
    Racket_Spin: 69,
    Racket_Control: 60,
    Racket_Power: 65,
    Racket_Grip: "Flared",
    Racket_Price: 39.95,
    Racket_Level: "Beginner",
    Racket_Affiliate_Link: "https://www.killerspin.com/products/jet400-table-tennis-racket"
  },
  {
    Racket_Name: "Palio Expert 3.0",
    Racket_Blade: "5-ply wood",
    Racket_FH_Rubber: "Palio CJ8000 Biotech",
    Racket_BH_Rubber: "Palio CJ8000 Biotech",
    Racket_FH_Rubber_Style: "Normal",
    Racket_BH_Rubber_Style: "Normal",
    Racket_Speed: 56,
    Racket_Spin: 65,
    Racket_Control: 69,
    Racket_Power: 56,
    Racket_Grip: "Flared",
    Racket_Price: 19.99,
    Racket_Level: "Beginner",
    Racket_Affiliate_Link: "https://www.paliotabletennis.com/palio-expert-3-0-paddle"
  },
  {
    Racket_Name: "STIGA Pro Carbon",
    Racket_Blade: "7-ply wood + 2 carbon layers",
    Racket_FH_Rubber: "STIGA S5",
    Racket_BH_Rubber: "STIGA S5",
    Racket_FH_Rubber_Style: "Normal",
    Racket_BH_Rubber_Style: "Normal",
    Racket_Speed: 72,
    Racket_Spin: 69,
    Racket_Control: 56,
    Racket_Power: 72,
    Racket_Grip: "Concave",
    Racket_Price: 49.99,
    Racket_Level: "Intermediate",
    Racket_Affiliate_Link: "https://www.stigaus.com/products/stiga-pro-carbon-table-tennis-racket"
  },
  {
    Racket_Name: "JOOLA Infinity Balance",
    Racket_Blade: "5-ply wood",
    Racket_FH_Rubber: "JOOLA Micron",
    Racket_BH_Rubber: "JOOLA Micron",
    Racket_FH_Rubber_Style: "Normal",
    Racket_BH_Rubber_Style: "Normal",
    Racket_Speed: 65,
    Racket_Spin: 65,
    Racket_Control: 65,
    Racket_Power: 65,
    Racket_Grip: "Concave",
    Racket_Price: 39.95,
    Racket_Level: "Intermediate",
    Racket_Affiliate_Link: "https://www.joola.com/products/joola-infinity-balance"
  },
  {
    Racket_Name: "Butterfly 401",
    Racket_Blade: "5-ply wood",
    Racket_FH_Rubber: "Flextra",
    Racket_BH_Rubber: "Flextra",
    Racket_FH_Rubber_Style: "Normal",
    Racket_BH_Rubber_Style: "Normal",
    Racket_Speed: 60,
    Racket_Spin: 56,
    Racket_Control: 69,
    Racket_Power: 60,
    Racket_Grip: "Flared",
    Racket_Price: 19.99,
    Racket_Level: "Beginner",
    Racket_Affiliate_Link: "https://shop.butterflyonline.com/401"
  },
  {
    Racket_Name: "DHS 4002",
    Racket_Blade: "5-ply wood",
    Racket_FH_Rubber: "DHS Hurricane 3",
    Racket_BH_Rubber: "DHS Hurricane 3",
    Racket_FH_Rubber_Style: "Normal",
    Racket_BH_Rubber_Style: "Normal",
    Racket_Speed: 69,
    Racket_Spin: 72,
    Racket_Control: 56,
    Racket_Power: 69,
    Racket_Grip: "Flared",
    Racket_Price: 29.99,
    Racket_Level: "Intermediate",
    Racket_Affiliate_Link: "https://www.dhs-sports.com/4002"
  },
  {
    Racket_Name: "Yinhe 01B",
    Racket_Blade: "5-ply wood",
    Racket_FH_Rubber: "Yinhe Mercury II",
    Racket_BH_Rubber: "Yinhe Mercury II",
    Racket_FH_Rubber_Style: "Normal",
    Racket_BH_Rubber_Style: "Normal",
    Racket_Speed: 65,
    Racket_Spin: 69,
    Racket_Control: 60,
    Racket_Power: 65,
    Racket_Grip: "Flared",
    Racket_Price: 24.99,
    Racket_Level: "Intermediate",
    Racket_Affiliate_Link: "https://www.yinhett.com/01b"
  },
  {
    Racket_Name: "Sanwei Taiji 710 Pro Carbon",
    Racket_Blade: "7-ply wood + 2 carbon layers",
    Racket_FH_Rubber: "Sanwei Target National",
    Racket_BH_Rubber: "Sanwei Target National",
    Racket_FH_Rubber_Style: "Normal",
    Racket_BH_Rubber_Style: "Normal",
    Racket_Speed: 72,
    Racket_Spin: 69,
    Racket_Control: 56,
    Racket_Power: 72,
    Racket_Grip: "Flared",
    Racket_Price: 39.99,
    Racket_Level: "Advanced",
    Racket_Affiliate_Link: "https://www.sanwei.com/taiji-710-pro-carbon"
  },
  {
    Racket_Name: "Palio Legend 2",
    Racket_Blade: "5-ply wood",
    Racket_FH_Rubber: "Palio CJ8000 Biotech",
    Racket_BH_Rubber: "Palio CJ8000 Biotech",
    Racket_FH_Rubber_Style: "Normal",
    Racket_BH_Rubber_Style: "Normal",
    Racket_Speed: 60,
    Racket_Spin: 65,
    Racket_Control: 69,
    Racket_Power: 60,
    Racket_Grip: "Flared",
    Racket_Price: 29.99,
    Racket_Level: "Intermediate",
    Racket_Affiliate_Link: "https://www.paliotabletennis.com/palio-legend-2-paddle"
  }
];