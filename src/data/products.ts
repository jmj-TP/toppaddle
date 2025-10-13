// Table Tennis Product Database

export interface Blade {
  Blade_Name: string;
  Blade_Speed: number; // 1-100
  Blade_Spin: number; // 1-100
  Blade_Control: number; // 1-100
  Blade_Power: number; // 1-100
  Blade_Grip: string[]; // Array of available grips: e.g., ["Flared", "Straight", "Anatomic"]
  Blade_Price: number; // USD, manually added, for sorting only
  Blade_Level: 'Beginner' | 'Intermediate' | 'Advanced';
  Blade_Weight?: number; // grams (optional - will be estimated if not provided)
  Blade_Affiliate_Link: string;
  Blade_Style?: 'Offensive' | 'Defensive' | 'All-Round' | 'Allround'; // Playing style of the blade
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
  Racket_Grip: string[]; // Array of available grips: e.g., ["Flared", "Straight"]
  Racket_Price: number; // USD
  Racket_Level: 'Beginner' | 'Intermediate' | 'Advanced';
  Racket_Affiliate_Link: string;
}

// Blades Database
export const blades: Blade[] = [
  {
    "Blade_Name": "Butterfly Primorac",
    "Blade_Speed": 68,
    "Blade_Spin": 74,
    "Blade_Control": 86,
    "Blade_Power": 62,
    "Blade_Grip": [
      "Flared"
    ],
    "Blade_Price": 70.0,
    "Blade_Level": "Intermediate",
    "Blade_Weight": 88.0,
    "Blade_Affiliate_Link": "https://www.amazon.com/Butterfly-Primorac-FL-Blade-Flared-Handle/dp/B001ADV8NE?dib=eyJ2IjoiMSJ9.jSmhzbfHGqGdtGUOgn6qFAoz3p7uV9X5UE3Ahis8DwldR0UT36rGC3WL4fkyHiIbOURWLDTgAvgtk5Zlu5m2n-GS3T63gT0-U16c5mMfF-HbdH6M-s1JNgXHXX3UCq554jIB_njE7_HIA0os3nl8neveNDR8-S_ikN8pSXDQ39iMdr00RkUwFs4yiTWdHIyVu1wfivjr1AjhOS7SKuqtKZREMU758K4MhlMEM3f2YdYPSSarIP92FMqPbYDrcDasBOqZrrySraqhY1iEjJxlD_qkUlnI8h-PkQCfUK2Oq6c.cedMsr5rt0R7ESLEYfaeUWgirbPSpqqZSgTmyhsZQIE&dib_tag=se&keywords=Butterfly%2BPrimorac%2Bblade&qid=1759977220&sr=8-6&th=1",
    "Blade_Style": "Allround"
  },
  {
    "Blade_Name": "Butterfly Primorac Carbon",
    "Blade_Speed": 80,
    "Blade_Spin": 75,
    "Blade_Control": 74,
    "Blade_Power": 78,
    "Blade_Grip": [
      "Flared",
      "Straight"
    ],
    "Blade_Price": 104.0,
    "Blade_Level": "Intermediate",
    "Blade_Weight": 88.0,
    "Blade_Affiliate_Link": "https://www.amazon.com/Butterfly-Primorac-Carbon-FL-Flared-Handle/dp/B000AS884W?dib=eyJ2IjoiMSJ9.w9CgYdfAIaRCsMoh5YN0WyUvbt7tQVN9uKjbcef2D8_BtzJ-BekiB5TizLJ8rc6lk-5SesW05rcPWygyrbZRVvAa6v9fD-cWFD2ow_5bPJa0QTjuoMbUpRbV2zEuDvU36f4i6xt_GkzW7BO6wejgTDZfYlXefbprJdYpmg0vDGuV--OM4pZpQPrDf8S1-0L1t20icsOsU_qfpGEpt0fz1bApBx0Cpg9z8hBHY54U57mZFOZ7UC2hCC2nEPVqN44VP2pL-OaqWCUU89fn9KT9SxhAc3flLEIWKP1k5v3jl6c.hDpNvaeA3plWmRQdfhNI-oT2k0aMSPYv-CzuQZ3FiFw&dib_tag=se&keywords=Butterfly%2BPrimorac%2BCarbon%2Bblade&qid=1759978596&sr=8-2&th=1",
    "Blade_Style": "Offensive"
  },
  {
    "Blade_Name": "Butterfly Petr Korbel",
    "Blade_Speed": 76,
    "Blade_Spin": 76,
    "Blade_Control": 84,
    "Blade_Power": 70,
    "Blade_Grip": [
      "Flared",
      "Straight"
    ],
    "Blade_Price": 62.0,
    "Blade_Level": "Intermediate",
    "Blade_Weight": 91.0,
    "Blade_Affiliate_Link": "https://www.amazon.com/Butterfly-Korbel-FL-Blade-Flared-Handle/dp/B000AS886A?dib=eyJ2IjoiMSJ9.bFaDC2ha8h9NbhUdyhqY0MbeQzSi3ihNZeo5Du2HsYXqB61_GNcBmmF1PIOhKXCrj3gKHyygCpAFA86t8RgXMcPLQZ8r2nTik-ArC6aZchiGbzeK43wQTdN6zdA-1yg2SZP9fqBGii0qw9iW_zo_EJwnMA1q02DtCgHTlDaysaJ-SoYqWtLIiRWcU-KLxH1mkeHbc2YLhlyeaxt-BSRn4YsNVPg-azA-Qmu7kQVxop9vnbSkRSUe9SZioAMnSXLtUn8Xpt1jGi4I6ZQb3wW2AKyZC172lVf4G83KpafYuVs.hWWKv1hkn82tBNSPBKL11xka7hrR1L4cbhNCfOyfW5U&dib_tag=se&keywords=Butterfly%2BPetr%2BKorbel%2Bblade&qid=1759978564&sr=8-3&th=1",
    "Blade_Style": "Allround"
  },
  {
    "Blade_Name": "Butterfly Viscaria ALC",
    "Blade_Speed": 88,
    "Blade_Spin": 82,
    "Blade_Control": 72,
    "Blade_Power": 85,
    "Blade_Grip": [
      "Flared",
      "Straight"
    ],
    "Blade_Price": 166.0,
    "Blade_Level": "Advanced",
    "Blade_Weight": 87.0,
    "Blade_Affiliate_Link": "https://www.amazon.com/Butterfly-Viscaria-FL-Blade-Flared-Handle/dp/B003XLDQDQ?dib=eyJ2IjoiMSJ9.rhyhfsfBhz8apqx0i7KFggMI4Q5Eptxlq1DmrhtUMQ6x16yb-H79PMmADrPx8udAKSNfZutQ8Wi3imc4uCJLU0dHmrtkL9ET-FHeqiJ0vJaSurG6NWFIcWu1ZRjhL_c6SLA5roa0nnreHQEWbozfozzi1cepQKeHKWA6XIYYpbakryzjvafN5evJ9cR9XC_YqWSIousBn61sgLfgzPrGxJVgbtZ9a1wkbj8OBeCSDI4sIIZf6ZzmYIAhWzwSJlANiuh_YTiDoL0q44vnMCzeIK-yeoTIoUx08LYaxD0zVmM.G7SPX1Cnl4DVnoxnaSruot0Ritz4boMxsmP_D7c9Wzs&dib_tag=se&keywords=Butterfly%2BViscaria%2Bblade&qid=1759978501&sr=8-4&th=1",
    "Blade_Style": "Offensive"
  },
  {
    "Blade_Name": "Butterfly Timo Boll ALC",
    "Blade_Speed": 86,
    "Blade_Spin": 78,
    "Blade_Control": 74,
    "Blade_Power": 84,
    "Blade_Grip": [
      "Flared",
      "Straight",
      "Anatomic"
    ],
    "Blade_Price": 166.0,
    "Blade_Level": "Advanced",
    "Blade_Weight": 86.0,
    "Blade_Affiliate_Link": "https://www.amazon.com/Butterfly-Alc-ST-Blade-Straight-Handle/dp/B002EENFLQ?dib=eyJ2IjoiMSJ9.UIc7O75P4bR-CKZoADus-kzqstv0EDgXjgX49pCGJBh3ZJ-Ep6JAp2xe-ggqkAD-i3xUwMMBf_mOjO-luolSZiEYSIEo686f_pzP2L4-BGVyLW9eWzqRbG5We143zmRd6YZX4sDOIBk2u8C0l7lOXVdsZs16ab3KhqwNZyI4v8P9ej-OKI8jkRaf1iXcNLx4P8bJ74ykdAJSzN21_j1Gh90sAh85H1oEWz0uT6BKENK8Q4bDNnc0klNNek2ZrU_UKGXAUYTq3iRlfFQ32EELjp2OueFvhnaO-B78lkoEj6Q.qFY2PPYA9ds-hBreoTBfZIBx6J5TplrNSCoVa2-lQA8&dib_tag=se&keywords=Butterfly%2BTimo%2BBoll%2BALC%2Bblade&qid=1759978475&sr=8-6&th=1",
    "Blade_Style": "Offensive"
  },
  {
    "Blade_Name": "Butterfly Timo Boll ZLC",
    "Blade_Speed": 90,
    "Blade_Spin": 80,
    "Blade_Control": 70,
    "Blade_Power": 88,
    "Blade_Grip": [
      "Flared",
      "Straight",
      "Anatomic"
    ],
    "Blade_Price": 243.0,
    "Blade_Level": "Advanced",
    "Blade_Weight": 84.0,
    "Blade_Affiliate_Link": "https://www.amazon.com/Butterfly-Timo-Boll-ZLC-Blade/dp/B002EENFI4?dib=eyJ2IjoiMSJ9.rCnVjsTEPGZ_GPfFeQrCP3T5E5pw1LMjlBNcnCaVIu4eS0GqISe1C1I8FtpO6jjaPpsYJMOvaHYzkHDnW-5h6ZaTJS3PC8vJLvYi4kfoWxdgD-syTsddJ-uyk678GjQ_dlCkwuls-bx1dtLfYGZV-1G5stfmT2QyMa2fz6UjKiz2-vL44vvDDhEt-31co5AFhGLFjaI3R3G9I8Ez1MyPtaj25LZipXeSPm7QTS7xwf9x5w9pHxQ16FqpYnz6X2LksEgcGQdRdJjX5HEizYzI_7Phj131etOD4ofxBvJr-2w.PQzgttVJM0HnCkP9_nQNnBSxRrXxbBekyl4HjPVS2rw&dib_tag=se&keywords=Butterfly%2BTimo%2BBoll%2BZLC%2Bblade&qid=1759979381&sr=8-6&th=1",
    "Blade_Style": "Offensive"
  },
  {
    "Blade_Name": "Butterfly TB5 Alpha",
    "Blade_Speed": 78,
    "Blade_Spin": 75,
    "Blade_Control": 76,
    "Blade_Power": 74,
    "Blade_Grip": [
      "Flared"
    ],
    "Blade_Price": 58.0,
    "Blade_Level": "Intermediate",
    "Blade_Weight": 88.0,
    "Blade_Affiliate_Link": "https://www.amazon.com/Butterfly-Tennis-Cypress-Professional-Handle/dp/B07PQD6MB7?dib=eyJ2IjoiMSJ9.f5BmT3-Bu5f0ORo4PC8erv3k1uw5njtalbBL4-B-_HwsBs7cBCoTf3CrKLuncjR8jSPRxRQdiFXaKU9l0w_fGvqW_nJ3SG99vgYueNEUz1I.DQ1KqE8sqbvZn1-0vf7nRvs-2belwgvlloKDLPFcyiE&dib_tag=se&keywords=Butterfly%2BTB5%2BAlpha%2Bblade&qid=1759979504&sr=8-1&th=1",
    "Blade_Style": "Allround"
  },
  {
    "Blade_Name": "Butterfly Maze Advance",
    "Blade_Speed": 80,
    "Blade_Spin": 78,
    "Blade_Control": 74,
    "Blade_Power": 76,
    "Blade_Grip": [
      "Flared"
    ],
    "Blade_Price": 59.39,
    "Blade_Level": "Intermediate",
    "Blade_Weight": 82.0,
    "Blade_Affiliate_Link": "https://www.amazon.com/s?k=Butterfly+Maze+Advance+blade",
    "Blade_Style": "Allround"
  },
  {
    "Blade_Name": "Butterfly Falcima",
    "Blade_Speed": 74,
    "Blade_Spin": 73,
    "Blade_Control": 78,
    "Blade_Power": 70,
    "Blade_Grip": [
      "Flared",
      "Straight"
    ],
    "Blade_Price": 66.59,
    "Blade_Level": "Intermediate",
    "Blade_Weight": 87.0,
    "Blade_Affiliate_Link": "https://www.amazon.com/s?k=Butterfly+Falcima+blade",
    "Blade_Style": "Allround"
  },
  {
    "Blade_Name": "Butterfly Timo Boll CAF",
    "Blade_Speed": 84,
    "Blade_Spin": 80,
    "Blade_Control": 75,
    "Blade_Power": 82,
    "Blade_Grip": [
      "Flared",
      "Straight"
    ],
    "Blade_Price": 94.49,
    "Blade_Level": "Advanced",
    "Blade_Weight": 82.0,
    "Blade_Affiliate_Link": "https://www.amazon.com/Butterfly-Timo-Boll-CAF-Blade/dp/B07HN7R79P?dib=eyJ2IjoiMSJ9.DFA1J04bk1HBIC0xfjH9raRpajXn9WAr0sLApyfe3ItBKt64wqrjxNE7V908acTjujWmTF-rpN0ut9efLSpgk-6fiTOk8MfEXZm-L9zytwsNFxU3OQ-4tqoAFetDI1T4JuwWri3XVIbsI5dXYcspBrCCSiTmaaOSJSrq5gONdeQyjmbEaly884bqW5xl4uOp_mhXOxeCN_sUP4tuX4pS_I5p62Lnigq-4BzD2SOwT-ImtRng6TrQwwm00Qe1y-W3Aqm8cKv9B5HMKgWM-N_ZBwy1wlmQMaqM2bFew1TsXfA.fNh6CZaJHqVbkxdb5iV8DxPKZNpCdFGzgfljvvysldc&dib_tag=se&keywords=Butterfly%2BTimo%2BBoll%2BCAF%2Bblade&qid=1759980236&sr=8-6&th=1",
    "Blade_Style": "Offensive"
  },
  {
    "Blade_Name": "JOOLA Vyzaryz Trinity",
    "Blade_Speed": 92,
    "Blade_Spin": 86,
    "Blade_Control": 73,
    "Blade_Power": 90,
    "Blade_Grip": [
      "Flared"
    ],
    "Blade_Price": 273.24,
    "Blade_Level": "Advanced",
    "Blade_Weight": 90.0,
    "Blade_Affiliate_Link": "https://www.amazon.com/JOOLA-Vyzaryz-Trinity-Table-Tennis/dp/B084JQQV7P?dib=eyJ2IjoiMSJ9._FGPKwO7bWcopa469wHeOvIT6LPNFBW-2W28DicfG5jGjHj071QN20LucGBJIEps.yk9lmNedh8ENWIvhpeC4QFRa1pkIlzMjvF0vZUIt_vc&dib_tag=se&keywords=JOOLA%2BVyzaryz%2BTrinity%2Bblade&qid=1759980350&sr=8-3&th=1",
    "Blade_Style": "Offensive"
  },
  {
    "Blade_Name": "JOOLA Vyzaryz Freeze",
    "Blade_Speed": 90,
    "Blade_Spin": 85,
    "Blade_Control": 74,
    "Blade_Power": 88,
    "Blade_Grip": [
      "Flared"
    ],
    "Blade_Price": 211.7,
    "Blade_Level": "Advanced",
    "Blade_Weight": 85.0,
    "Blade_Affiliate_Link": "https://www.amazon.com/JOOLA-Vyzaryz-Freeze-Table-Tennis/dp/B084HKFXDY?dib=eyJ2IjoiMSJ9.2Q4EpK8yPRas1auR2E-7j2sw22LkFPMaKH1VioteloA.5TOQ1Ox3UBMLOUTIMlvsrXaas4ZG-5G6aQgVk5UJ_Ek&dib_tag=se&keywords=JOOLA%2BVyzaryz%2BFreeze%2Bblade&qid=1759980631&sr=8-3&th=1",
    "Blade_Style": "Offensive"
  },
  {
    "Blade_Name": "JOOLA CWX",
    "Blade_Speed": 62,
    "Blade_Spin": 65,
    "Blade_Control": 88,
    "Blade_Power": 58,
    "Blade_Grip": [
      "Flared"
    ],
    "Blade_Price": 55.52,
    "Blade_Level": "Intermediate",
    "Blade_Weight": 90.0,
    "Blade_Affiliate_Link": "https://www.amazon.com/JOOLA-Weixing-Flared-Table-Tennis/dp/B00589C40M?dib=eyJ2IjoiMSJ9.EMg6Lq73yBIuQzH0T33Axd9s83UWwWxyNJOBz-kDgGh3IxJGkydsikBtAn56DAKTSB_AjrUjcUd9V_7pqIDHOcpYxIN7cd0Mrb8Z6FzlKtw.jOKuYme2lk-lpGD9ExZIpbRSWirzx399pE1s_9ryMZk&dib_tag=se&keywords=JOOLA+CWX+blade&qid=1760026698&sr=8-3",
    "Blade_Style": "Defensive"
  },
  {
    "Blade_Name": "Andro Inizio OFF",
    "Blade_Speed": 80,
    "Blade_Spin": 70,
    "Blade_Control": 74,
    "Blade_Power": 74,
    "Blade_Grip": [
      "Flared"
    ],
    "Blade_Price": 41.09,
    "Blade_Level": "Intermediate",
    "Blade_Weight": 84.0,
    "Blade_Affiliate_Link": "https://www.amazon.ca/Andro-Inizio-Table-Tennis-Blade/dp/B07N8NT7FG",
    "Blade_Style": "Offensive"
  },
  {
    "Blade_Name": "Andro Treiber FO",
    "Blade_Speed": 89,
    "Blade_Spin": 76,
    "Blade_Control": 71,
    "Blade_Power": 81,
    "Blade_Grip": [
      "Flared"
    ],
    "Blade_Price": 89.95,
    "Blade_Level": "Advanced",
    "Blade_Weight": 90.0,
    "Blade_Affiliate_Link": "https://www.amazon.com/Andro-Treiber-Table-Tennis-Blade/dp/B07N48WCB4?dib=eyJ2IjoiMSJ9.oN7ZvLEd_wKvDTd-ag_Dq4zJwUwRM7wd_QDrPDiIbLPGjHj071QN20LucGBJIEps._LGfO1By5DKT1KHUiBRM2BAQLhaNwhrr4q90Oe4Cce4&dib_tag=se&keywords=Andro+Treiber+FO+blade&qid=1759981176&sr=8-1",
    "Blade_Style": "Offensive"
  },
  {
    "Blade_Name": "Andro Treiber CI",
    "Blade_Speed": 87,
    "Blade_Spin": 75,
    "Blade_Control": 73,
    "Blade_Power": 79,
    "Blade_Grip": [
      "Flared"
    ],
    "Blade_Price": 89.95,
    "Blade_Level": "Intermediate",
    "Blade_Weight": 90.0,
    "Blade_Affiliate_Link": "https://www.amazon.com/s?k=Andro+Treiber+CI+blade",
    "Blade_Style": "Offensive"
  },
  {
    "Blade_Name": "Andro Treiber CO",
    "Blade_Speed": 88,
    "Blade_Spin": 76,
    "Blade_Control": 72,
    "Blade_Power": 80,
    "Blade_Grip": [
      "Flared"
    ],
    "Blade_Price": 89.95,
    "Blade_Level": "Advanced",
    "Blade_Weight": 90.0,
    "Blade_Affiliate_Link": "https://www.amazon.com/Andro-Treiber-Table-Tennis-Blade/dp/B07N3XCWNJ?dib=eyJ2IjoiMSJ9.euOWEkewPuqI7uW2E9DUFaTsD0CShOkeyY7WMj_W21Zrepv9fRSXSAuzt4TBzhwI.dM9vCbMHLf0cDfCKxx52xv3RdUYRhHSFoLo6iOTw4fg&dib_tag=se&keywords=Andro+Treiber+CO+blade&qid=1759981282&sr=8-1",
    "Blade_Style": "Offensive"
  },
  {
    "Blade_Name": "Andro Timber 5 ALL",
    "Blade_Speed": 68,
    "Blade_Spin": 68,
    "Blade_Control": 86,
    "Blade_Power": 64,
    "Blade_Grip": [
      "Flared"
    ],
    "Blade_Price": 49.95,
    "Blade_Level": "Intermediate",
    "Blade_Weight": 83.0,
    "Blade_Affiliate_Link": "https://www.amazon.com/Andro-Timber-Table-Tennis-Blade/dp/B07N3Y339B?dib=eyJ2IjoiMSJ9.CWkJdYW_rNgJ4_QJMqfLpCrXN4PTb7CL4oei7tXJMXzJwONel3C48pAIlWNCOkmr.tyYKiTSuAIfzETqLsQa3bH6_nxtREP5DQjxl9ToFoqU&dib_tag=se&keywords=Andro+Timber+5+ALL+blade&qid=1760026727&sr=8-4",
    "Blade_Style": "Allround"
  },
  {
    "Blade_Name": "Andro Timber 5 OFF",
    "Blade_Speed": 80,
    "Blade_Spin": 74,
    "Blade_Control": 76,
    "Blade_Power": 76,
    "Blade_Grip": [
      "Flared"
    ],
    "Blade_Price": 49.95,
    "Blade_Level": "Intermediate",
    "Blade_Weight": 83.0,
    "Blade_Affiliate_Link": "https://www.amazon.com/s?k=Andro+Timber+5+OFF+blade",
    "Blade_Style": "Offensive"
  },
  {
    "Blade_Name": "DHS Power G7",
    "Blade_Speed": 81,
    "Blade_Spin": 86,
    "Blade_Control": 67,
    "Blade_Power": 82,
    "Blade_Grip": [
      "Flared"
    ],
    "Blade_Price": 42.95,
    "Blade_Level": "Intermediate",
    "Blade_Weight": 89.0,
    "Blade_Affiliate_Link": "https://www.megaspin.net/store/default.asp?pid=dhs-power-g7",
    "Blade_Style": "Offensive"
  },
  {
    "Blade_Name": "DHS Power G5X",
    "Blade_Speed": 80,
    "Blade_Spin": 82,
    "Blade_Control": 74,
    "Blade_Power": 78,
    "Blade_Grip": [
      "Flared"
    ],
    "Blade_Price": 44.95,
    "Blade_Level": "Intermediate",
    "Blade_Weight": 89.0,
    "Blade_Affiliate_Link": "https://www.megaspin.net/store/default.asp?pid=dhs-power-g5x",
    "Blade_Style": "Offensive"
  },
  {
    "Blade_Name": "DHS Hurricane Long 5X",
    "Blade_Speed": 92,
    "Blade_Spin": 89,
    "Blade_Control": 68,
    "Blade_Power": 91,
    "Blade_Grip": [
      "Flared"
    ],
    "Blade_Price": 198.0,
    "Blade_Level": "Advanced",
    "Blade_Weight": 95.0,
    "Blade_Affiliate_Link": "https://www.amazon.com/Ping-Pong-Hurricane-Long-5X-Aromatic-Carbon%EF%BC%9BFL/dp/B07QNKNQKS?dib=eyJ2IjoiMSJ9.yGrgufrqtgtPe60ZOhdRDx29bY0tH686zn3YoJL48ZwEK3f5t4FSbcMWeozmcEqX9Y4l0QV1tRdF5u9gBFDqwqShOnSOOXKWaoq1hVQVgeE.K1hpG7Zs8YOF8s7WAUdhNdNpiF3BPtboNUwL-slxEv8&dib_tag=se&keywords=DHS%2BHurricane%2BLong%2B5%2Bblade&qid=1759982209&sr=8-1&th=1",
    "Blade_Style": "Offensive"
  },
  {
    "Blade_Name": "DHS Hurricane 301",
    "Blade_Speed": 88,
    "Blade_Spin": 86,
    "Blade_Control": 72,
    "Blade_Power": 86,
    "Blade_Grip": [
      "Flared",
      "Straight"
    ],
    "Blade_Price": 89.95,
    "Blade_Level": "Advanced",
    "Blade_Weight": 89.0,
    "Blade_Affiliate_Link": "https://www.megaspin.net/store/default.asp?pid=dhs-hurricane-301",
    "Blade_Style": "Offensive"
  },
  {
    "Blade_Name": "DHS Hurricane King 3",
    "Blade_Speed": 86,
    "Blade_Spin": 80,
    "Blade_Control": 75,
    "Blade_Power": 85,
    "Blade_Grip": [
      "Flared"
    ],
    "Blade_Price": 165.95,
    "Blade_Level": "Advanced",
    "Blade_Weight": 87.0,
    "Blade_Affiliate_Link": "https://www.megaspin.net/store/default.asp?pid=dhs-hurricane-king-3",
    "Blade_Style": "Offensive"
  },
  {
    "Blade_Name": "DHS Fang Bo B2",
    "Blade_Speed": 82,
    "Blade_Spin": 80,
    "Blade_Control": 76,
    "Blade_Power": 78,
    "Blade_Grip": [
      "Flared"
    ],
    "Blade_Price": 76.95,
    "Blade_Level": "Intermediate",
    "Blade_Weight": 90.0,
    "Blade_Affiliate_Link": "https://www.megaspin.net/store/default.asp?pid=dhs-fang-bo-b2",
    "Blade_Style": "Offensive"
  },
  {
    "Blade_Name": "ANDRO ANDRO Kanter CO",
    "Blade_Speed": 90,
    "Blade_Spin": 88,
    "Blade_Control": 64,
    "Blade_Power": 92,
    "Blade_Grip": [
      "Flared"
    ],
    "Blade_Price": 89.95,
    "Blade_Level": "Advanced",
    "Blade_Weight": 68.0,
    "Blade_Affiliate_Link": "https://www.amazon.com/Andro-Kanter-Table-Tennis-Blade/dp/B07N3Z323G?dib=eyJ2IjoiMSJ9.0IS2umMKeEoitWDqWG7x_g.mBxhIYFbtoC64Da6AbdTmWRDR-asdgeVcM3zeWcxL4k&dib_tag=se&keywords=ANDRO+Kanter+CO&qid=1760027340&s=leisure-sports-games&sr=1-1",
    "Blade_Style": "Offensive"
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
    "Racket_Grip": ["Flared", "Straight"],
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
    "Racket_Grip": ["Flared", "Straight"],
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
    "Racket_Grip": ["Flared", "Straight"],
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
    "Racket_Grip": ["Flared", "Straight"],
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
    "Racket_Grip": ["Flared", "Straight"],
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
    "Racket_Grip": ["Anatomic"],
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
    "Racket_Grip": ["Flared", "Straight"],
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
    "Racket_Grip": ["Flared", "Straight"],
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
    "Racket_Grip": ["Flared", "Straight"],
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
    "Racket_Grip": ["Flared", "Straight"],
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
    "Racket_Grip": ["Anatomic"],
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
    "Racket_Grip": ["Flared", "Straight"],
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
    "Racket_Grip": ["Flared", "Straight"],
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
    "Racket_Grip": ["Flared", "Straight"],
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
    "Racket_Grip": ["Flared", "Straight"],
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
    "Racket_Grip": ["Anatomic"],
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
    Racket_Grip: ["Flared", "Straight"],
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
    Racket_Grip: ["Penhold"],
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
    Racket_Grip: ["Flared", "Straight"],
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
    Racket_Grip: ["Flared", "Straight"],
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
    Racket_Grip: ["Flared", "Straight"],
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
    Racket_Grip: ["Flared", "Straight"],
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
    Racket_Grip: ["Flared", "Straight"],
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
    Racket_Grip: ["Flared", "Straight"],
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
    Racket_Grip: ["Anatomic"],
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
    Racket_Grip: ["Anatomic"],
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
    Racket_Grip: ["Flared", "Straight"],
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
    Racket_Grip: ["Flared", "Straight"],
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
    Racket_Grip: ["Flared", "Straight"],
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
    Racket_Grip: ["Flared", "Straight"],
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
    Racket_Grip: ["Flared", "Straight"],
    Racket_Price: 29.99,
    Racket_Level: "Intermediate",
    Racket_Affiliate_Link: "https://www.paliotabletennis.com/palio-legend-2-paddle"
  }
];