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
    "Rubber_Name": "Butterfly Tenergy 05",
    "Rubber_Speed": 92,
    "Rubber_Spin": 96,
    "Rubber_Control": 72,
    "Rubber_Power": 90,
    "Rubber_Price": 79.99,
    "Rubber_Level": "Advanced",
    "Rubber_Style": "Normal",
    "Rubber_Weight": 46,
    "Rubber_Affiliate_Link": "https://www.amazon.com/Butterfly-2-1-Tenergy-Rubber-Black/dp/B0018LMC9C?dib=eyJ2IjoiMSJ9.HWBvoJRgEKaXg-vFQlManW_SrNk8lCocLPZ52V4p_nZfRLaDYClHoDgtU4sbYA4GDg0Y5v5Lmd6y9_2ZV1DpyeWl7Ejhh3VwWesKpJ-ZI4SQLUFyQRXvBK8xohlqgTL5bnEUT2XJlRHxGdXR-YRy7b3tY7uoeurAq8TFO0GFbpUjUhjNwog9DwpXhTwh0w8qxUjJJVzvexTqbF-Lx5Qq2Uw13VzrZQ1FKXxKorV-V8Wf5ZbJP300EwqdzU64g4U3mdxw3_GQKx5MSb0fHqiJnwWqZEv3AnxuviJNcwRgDeU.IP15E-sTrgzOcU6_lughMdymwQdE9YFjHk_rQrNLTG4&dib_tag=se&keywords=Butterfly%2BTenergy%2B05%2Brubber&qid=1760118753&sr=8-6&th=1"
  },
  {
    "Rubber_Name": "Butterfly Tenergy 05 FX",
    "Rubber_Speed": 86,
    "Rubber_Spin": 92,
    "Rubber_Control": 78,
    "Rubber_Power": 82,
    "Rubber_Price": 79.99,
    "Rubber_Level": "Advanced",
    "Rubber_Style": "Normal",
    "Rubber_Weight": 44,
    "Rubber_Affiliate_Link": "https://www.amazon.com/Butterfly-Tenergy-Tennis-Rubber-Rubbers/dp/B0040YPX0Y?dib=eyJ2IjoiMSJ9.1oWPJVXzhkgnptwX8aMF_QNHWyfz02TRtSQLbYloqCSnR2yS8eFwMyEBo9J_wrbkfz9GhredTeDL9JWm449ngTnXQUioS42Sg1W71G_X0pz-OEbkQNytpYkpNjxk5zlUjd32iRJq3cGsM3WPTVeil1jAiQZ3ogGTrj2XN04BrplkI2DQVlVIn3YbG1yOHj62FsPQm8aaJ6lva0wtwr5VPA.Sg2lAm7B4XQird09DzNVRuh8CTP5Ce6Y5w2InbzFimk&dib_tag=se&keywords=Butterfly%2BTenergy%2B05%2BFX%2Brubber&qid=1760119183&sr=8-6&th=1"
  },
  {
    "Rubber_Name": "Butterfly Tenergy 05 Hard",
    "Rubber_Speed": 94,
    "Rubber_Spin": 97,
    "Rubber_Control": 68,
    "Rubber_Power": 93,
    "Rubber_Price": 80.91,
    "Rubber_Level": "Advanced",
    "Rubber_Style": "Normal",
    "Rubber_Weight": 49,
    "Rubber_Affiliate_Link": "https://www.amazon.com/Butterfly-Tenergy-Hard-2-1-Black/dp/B07HMYV98P?dib=eyJ2IjoiMSJ9.m3R02HWwTRKN6s0gsV8iVSbMsFBFiH3ZlBrSJQ2AChxzZgZuF7AykdbsJ-fSryzT0fAKiJJI3JENvDrt5-VTnjGTpxi933kGNLubnKVlCv-sXaCH7CS_lwlpdLweCjeGHvYb2D5SUdN4yahSgjkD4EVo4Zx7c0rlMcbbLoFcankYE30Y_IwscpLwkv-S-bQsh80D6KxQuHhy0FOEhVjm9M0LPdaLUi3YuS8mljvEJ_x0ted_tnKvpeX3ZEu0fC73hEzeB2sdjZsmXsWlqmFJ8jNmkTqwOPiwkCz2OIQP4ZQ.9-ypk16CwKY1UZF-eLHvrenl3Wx93b1wo35PjNsFYq0&dib_tag=se&keywords=Butterfly%2BTenergy%2B05%2BHard%2Brubber&qid=1760210922&sr=8-6&th=1"
  },
  {
    "Rubber_Name": "Butterfly Dignics 05",
    "Rubber_Speed": 91,
    "Rubber_Spin": 97,
    "Rubber_Control": 71,
    "Rubber_Power": 91,
    "Rubber_Price": 84.59,
    "Rubber_Level": "Advanced",
    "Rubber_Style": "Normal",
    "Rubber_Weight": 48.5,
    "Rubber_Affiliate_Link": "https://www.amazon.com/Butterfly-Dignics-Table-Tennis-Rubber/dp/B07PST3WVH?dib=eyJ2IjoiMSJ9.qYiJNUUI_Gs8G9gBp2y7Xjwc1Ztv65WoYJKMsrk-ODnO1m3tL9-oZU1RPyjF_Csl973oYaTjmR6t-aBll4cBR1ZzBdYehDgaKA8JyCRXXX90vm25JOPjBHyENPtMOe7Hcc-vitk37yu5VuJjzYDFrQ.iD0z1zMBpctNssqLXf8cbdkqoQManXNd0wYkXm3XZNg&dib_tag=se&keywords=Butterfly%2BDignics%2B05%2Brubber&qid=1760211152&sr=8-6&th=1"
  },
  {
    "Rubber_Name": "Butterfly Dignics 09C",
    "Rubber_Speed": 89,
    "Rubber_Spin": 98,
    "Rubber_Control": 70,
    "Rubber_Power": 90,
    "Rubber_Price": 93.99,
    "Rubber_Level": "Advanced",
    "Rubber_Style": "Normal",
    "Rubber_Weight": 49.1,
    "Rubber_Affiliate_Link": "https://www.amazon.com/Butterfly-Dignics-Table-Tennis-Rubber/dp/B085DJXRF3?dib=eyJ2IjoiMSJ9.se5NUxPdvEr1lVRECsTqgM2Aux2eZnP6AtERo4_u866Zt5j4vmFeLKuyqJyeCWGr9tGIB5wD6s8CLgFFuH8dBkmrwI9ObvLOXZ7JTjWSC_6DVWNm971GrDZGOO-VTv9BAu2RV6OumgPRk76_MC7X9U9fsjxoicUJply_7lRal6YEztd38chK-x2keQHJml4UytHSlnebQDFJ-YY5dOx8mg.AS6vISdYLbFKX7P-__hnp8kz6y2CNW_Uspu4w6zB3OI&dib_tag=se&keywords=Butterfly%2BDignics%2B09C%2Brubber&qid=1760211351&sr=8-6&th=1"
  },
  {
    "Rubber_Name": "Butterfly Rozena",
    "Rubber_Speed": 83,
    "Rubber_Spin": 72,
    "Rubber_Control": 82,
    "Rubber_Power": 78,
    "Rubber_Price": 39.99,
    "Rubber_Level": "Intermediate",
    "Rubber_Style": "Normal",
    "Rubber_Weight": 47,
    "Rubber_Affiliate_Link": "https://www.amazon.com/Butterfly-Rozena-Table-Tennis-Rubber/dp/B06XBNN4BK?dib=eyJ2IjoiMSJ9._lFLYhCorGEARRKGYw5igFCO0HRAG2NAuZqCwZKjY-tELRnLdwl0XjL--sihWniOypqh-EizYbe4J5ZRocderdDqtea5FW371Vs3rbmyxDQWtQ-9ITrBth2KITQsdbicrA7KIco6jSk41ajEhaAnYJQ4eZxde4vJUZjcLe4iJvCoWp4RdZY2NIgh2RJR6j4vSVZLW946NhvoaX1HGdY8jCYdn43IXgeSiKQ9YiFUvufXLfZGz8u2Hm-OXr3kMH9kPt1-w9Eg10Hg--neFwoXpQ.g7cXZ6jGk0uu1hrHQUOMyD14YFW3sJxmc0J4Sl5rk2Y&dib_tag=se&keywords=Butterfly%2BRozena%2Brubber&qid=1760387374&sr=8-6&th=1"
  },
  {
    "Rubber_Name": "Butterfly Sriver",
    "Rubber_Speed": 72,
    "Rubber_Spin": 70,
    "Rubber_Control": 86,
    "Rubber_Power": 68,
    "Rubber_Price": 32.99,
    "Rubber_Level": "Intermediate",
    "Rubber_Style": "Normal",
    "Rubber_Weight": 42,
    "Rubber_Affiliate_Link": "https://www.amazon.com/Butterfly-1-9-Sriver-Rubber-Black/dp/B000AS682G?dib=eyJ2IjoiMSJ9.vt0GuAtYfdePRai05oEj19K02fCZ_ZrWm7wfbbscsFFb88Z0OsKpgQrVHfSKzw04muGc5N4TzMFdYKyz-1YGExlKpfy16xcMk8Abm8voIp6B0c7gqNJJKnGFty0N_ivlQHLW9DRsSWW9MqhAT94XQgoJ2eeh4414NBbKEwbGwWXU27SMAq-q9O3Wf7IllooA.3nnD5UlIkhMhEoA_HGrjBesb2KuagOyA8Kv498KbLIM&dib_tag=se&keywords=Butterfly%2BSriver%2Brubber&qid=1760388635&sr=8-6&th=1"
  },
  {
    "Rubber_Name": "Butterfly Sriver FX",
    "Rubber_Speed": 76,
    "Rubber_Spin": 73,
    "Rubber_Control": 84,
    "Rubber_Power": 72,
    "Rubber_Price": 32.99,
    "Rubber_Level": "Intermediate",
    "Rubber_Style": "Normal",
    "Rubber_Weight": 39,
    "Rubber_Affiliate_Link": "https://www.amazon.com/Butterfly-Sriver-FX-2-3-Black/dp/B000AS4P76?dib=eyJ2IjoiMSJ9.o-0a-U1kgId6fILqJNHGYGlQ6DQeACmpsh4llimo4TA5DrxgofAA4qFlAsWy8wIYMIVvWw2wJIKbOJhSdftRyZ8ZAyieeImfCQMnF-8E3TU69M0ubZFgEh2uR7DHG7IN.ccEis_XjM5fhu7rONpZFYXpfSd_rlMltw-R5AWpMAo0&dib_tag=se&keywords=Butterfly%2BSriver%2BFX%2Brubber&qid=1760387486&sr=8-6&th=1"
  },
  {
    "Rubber_Name": "Butterfly Feint Long II (long pips)",
    "Rubber_Speed": 45,
    "Rubber_Spin": 20,
    "Rubber_Control": 92,
    "Rubber_Power": 30,
    "Rubber_Price": 30.99,
    "Rubber_Level": "Advanced",
    "Rubber_Style": "Long Pimples",
    "Rubber_Weight": 49,
    "Rubber_Affiliate_Link": "https://www.amazon.com/Butterfly-1-3-Feint-Long-Rubber/dp/B000AS4QHU?dib=eyJ2IjoiMSJ9.fY43ceg5SLYTDAYiZnoTkM__ED1TMMyD1qGRVZRpZd04iHiK_shUf9Nw1KM1j7FC10hq8jnxRvSPyR2v5nJqUvqW_nJ3SG99vgYueNEUz1I.8sFJYR5CpCvgrrP_HC_OU1vYeu1gKZuWOKyISh0DedQ&dib_tag=se&keywords=Butterfly%2BFeint%2BLong%2BII%2B(long%2Bpips)%2Brubber&qid=1760228987&sr=8-6&th=1"
  },
  {
    "Rubber_Name": "JOOLA Dynaryz CMD",
    "Rubber_Speed": 86,
    "Rubber_Spin": 88,
    "Rubber_Control": 79,
    "Rubber_Power": 84,
    "Rubber_Price": 89.87,
    "Rubber_Level": "Advanced",
    "Rubber_Style": "Normal",
    "Rubber_Weight": 48,
    "Rubber_Affiliate_Link": "https://www.amazon.com/JOOLA-Dynaryz-Table-Tennis-Rubber/dp/B09TSL67FS?dib=eyJ2IjoiMSJ9.ZFFkaLo1Rx7fGCbVjY8sYMEkmUeJ8YYJwydWjlEP9GEtvhi2FVxFiTSzbfr2KpBLSoLV2WAo-7PYzgag3maYacs93dsedK7RftPORO7cG81oTxTllXysOmNVR3lGBjiFmGYSgJXrOnrDyW_XvOp2ZpNDL7euSg9Oz9Y0aXXV-PEXZ5FVqBYdO7ViP6Pl4wW94lR6p9VGh-Ar6h-VfGNaLQ.grV3RcwVOuA5qLLxs5q8fhVXDo25h9B8Zat2dmvaIAo&dib_tag=se&keywords=JOOLA%2BDynaryz%2BCMD%2Brubber&qid=1760229504&sr=8-6&th=1"
  },
  {
    "Rubber_Name": "JOOLA Dynaryz ZGR",
    "Rubber_Speed": 90,
    "Rubber_Spin": 92,
    "Rubber_Control": 75,
    "Rubber_Power": 88,
    "Rubber_Price": 76.03,
    "Rubber_Level": "Advanced",
    "Rubber_Style": "Normal",
    "Rubber_Weight": 56,
    "Rubber_Affiliate_Link": "https://www.amazon.com/JOOLA-Dynaryz-Table-Tennis-Rubber/dp/B09TSLRJP2?dib=eyJ2IjoiMSJ9.4-L255F2-_MuXo-HHT1KIlvyt2N5VpnwRm-sZKFb5mw0gHM35NLkGLPoPsxkflHPFPvlNsmwuDUUKe5zt5rrJtmyWkpLrDWU2HmKNkX0bJ8.5s5oX76cocI08-xrosqtdjJsyHazKkrD6Xd3YUdH6hg&dib_tag=se&keywords=JOOLA%2BDynaryz%2BZGR%2Brubber&qid=1760384858&sr=8-8&th=1"
  },
  {
    "Rubber_Name": "JOOLA Dynaryz AGR",
    "Rubber_Speed": 92,
    "Rubber_Spin": 93,
    "Rubber_Control": 73,
    "Rubber_Power": 90,
    "Rubber_Price": 75.59,
    "Rubber_Level": "Advanced",
    "Rubber_Style": "Normal",
    "Rubber_Weight": 46,
    "Rubber_Affiliate_Link": "https://www.amazon.com/JOOLA-Dynaryz-Table-Tennis-Rubber/dp/B09TSLRJP2?dib=eyJ2IjoiMSJ9.4-L255F2-_MuXo-HHT1KIlvyt2N5VpnwRm-sZKFb5mw0gHM35NLkGLPoPsxkflHPFPvlNsmwuDUUKe5zt5rrJtmyWkpLrDWU2HmKNkX0bJ8.5s5oX76cocI08-xrosqtdjJsyHazKkrD6Xd3YUdH6hg&dib_tag=se&keywords=JOOLA%2BDynaryz%2BZGR%2Brubber&qid=1760384858&sr=8-8&th=1"
  },
  {
    "Rubber_Name": "JOOLA Dynaryz ACC",
    "Rubber_Speed": 91,
    "Rubber_Spin": 90,
    "Rubber_Control": 74,
    "Rubber_Power": 89,
    "Rubber_Price": 79.58,
    "Rubber_Level": "Advanced",
    "Rubber_Style": "Normal",
    "Rubber_Weight": 46,
    "Rubber_Affiliate_Link": "https://www.amazon.com/JOOLA-Dynaryz-Table-Tennis-Rubber/dp/B084G8ZFZH?dib=eyJ2IjoiMSJ9.pVHJNZ7LLjE7f_5QKKgNUoos8SF4GF05-lHDGViqUnvQGo_FZLBHXbVUsL9sHQ9H3CrHZPk7qvd8j_2Dzc6-WZMjJFRXb54_tZ4RwReC1YkttSA3rPYonhLKFsPZMIlm8CdVsBdaTvQry_EBtmLuQyvpThelhaG83rHHcxS1TZg.d0EoGYrHePQhJWq2U_ZYnH4z7kR_HSRyW9zZ3sPV0dQ&dib_tag=se&keywords=JOOLA+Dynaryz+ACC+rubber&qid=1760384977&sr=8-2"
  },
  {
    "Rubber_Name": "Andro Rasanter R50",
    "Rubber_Speed": 92,
    "Rubber_Spin": 93,
    "Rubber_Control": 70,
    "Rubber_Power": 89,
    "Rubber_Price": 46.99,
    "Rubber_Level": "Advanced",
    "Rubber_Style": "Normal",
    "Rubber_Weight": 51,
    "Rubber_Affiliate_Link": "https://www.amazon.com/Andro-Rasanter-Table-Tennis-Rubber/dp/B07R67TQLL?dib=eyJ2IjoiMSJ9.Os35qm83McqyN62abIAxJTSwaKjADSZlUYZLpRKUiwnqYqyalh3dpz15P_GflRhHOVCBL3KZEMLWQChOX_i5dA.cGTsjtjzzQhfjENZ44R6Ohk8gFIGnn3dYZ0TWDorUDE&dib_tag=se&keywords=Andro+Rasanter+R50+rubber&qid=1760385028&sr=8-1"
  },
  {
    "Rubber_Name": "Andro Rasanter R47",
    "Rubber_Speed": 90,
    "Rubber_Spin": 91,
    "Rubber_Control": 72,
    "Rubber_Power": 87,
    "Rubber_Price": 49.95,
    "Rubber_Level": "Advanced",
    "Rubber_Style": "Normal",
    "Rubber_Weight": 48,
    "Rubber_Affiliate_Link": "https://www.amazon.com/Andro-Rasanter-Table-Tennis-Rubber/dp/B07N46XQ9K?dib=eyJ2IjoiMSJ9.UuC9e0851lY8YhGaUl18DJOCOoqQHrAB5Qmt1gJr-AWHteyhfvWf-OJxfDW08qGrdPI3GpEh6cuO_om9KX302ur9lL2oWMLS0tO7HdR0EloMdlb4XIqnVvY7DESr1-KLLLMhqpSZl7YCw3PkFVP22JiWIwBCGseW6Da66-ehPRHb6ofbxjHrTdri7boe3mImjTUBWYJTu7IoxlHzJ2sKZB24ImFoHlFXIjf3jmlouG3NeWh1S8p8PENJvXBf3HAUIZDndX6qG3D4XDARjBO_3MaMePTvVA3bQu5wYEkgSmw.JmlahO-qvcXbPIYnF9goejYTVMP1dibaIALbZAJI__E&dib_tag=se&keywords=Andro+Rasanter+R47+rubber&qid=1760385091&sr=8-1"
  },
  {
    "Rubber_Name": "Andro Rasanter R42",
    "Rubber_Speed": 85,
    "Rubber_Spin": 86,
    "Rubber_Control": 77,
    "Rubber_Power": 80,
    "Rubber_Price": 49.95,
    "Rubber_Level": "Intermediate",
    "Rubber_Style": "Normal",
    "Rubber_Weight": 46,
    "Rubber_Affiliate_Link": "https://www.amazon.com/Andro-Rasanter-Table-Tennis-Rubber/dp/B07N42C9M5?dib=eyJ2IjoiMSJ9.oe_7BAh887BgsevS9IxpJ8pgdS_r-fFkkFch1B9o5pTicl3t_c0gDYtkmoZDaYs5aH68od9a3OjrQxo75anawtO8Tj7qkNAluByw6pam35ikjVWISPr6SWjiaVQ64YPgfX-WAkVn6cC3DbyzJrQZ_1OiPb9_rJ-2YZeBGc_CgLELdWNiF4Hh_xQWYoGuVjxo.QfojYRmAYPNe9jrT6gPZVi1IwYsgRRRyfYumt9M4E84&dib_tag=se&keywords=Andro+Rasanter+R42+rubber&qid=1760387017&sr=8-1"
  },
  {
    "Rubber_Name": "Andro Hexer PowerGrip",
    "Rubber_Speed": 87,
    "Rubber_Spin": 89,
    "Rubber_Control": 76,
    "Rubber_Power": 85,
    "Rubber_Price": 48.66,
    "Rubber_Level": "Intermediate",
    "Rubber_Style": "Normal",
    "Rubber_Weight": 48,
    "Rubber_Affiliate_Link": "https://www.amazon.com/Tennis-Rubber-POWERGRIP-Tension-112295/dp/B07PRKT8KG?dib=eyJ2IjoiMSJ9.PqKEXX8cm_cfsyqHOuiJFseNWLyceyjR3Ez_MFUNfI7GjHj071QN20LucGBJIEps.ENmv-PkGLDPt_ciQraMoz5j0g2GBteBopE3LvdvUt_g&dib_tag=se&keywords=Andro+Hexer+PowerGrip+rubber&qid=1760387116&sr=8-1"
  },
  {
    "Rubber_Name": "Andro Hexer Duro",
    "Rubber_Speed": 89,
    "Rubber_Spin": 88,
    "Rubber_Control": 72,
    "Rubber_Power": 86,
    "Rubber_Price": 50.23,
    "Rubber_Level": "Advanced",
    "Rubber_Style": "Normal",
    "Rubber_Weight": 43,
    "Rubber_Affiliate_Link": "https://www.amazon.com/ANDRO-Hexer-Table-Tennis-Ruber/dp/B00SBWH0SE?dib=eyJ2IjoiMSJ9.ggLCIxDn3XZT7VXCcnQ50A.JJXBM9xh6rnm5KhiggT978YBRm8ns8owFi7yVe1xcPY&dib_tag=se&keywords=Andro+Hexer+Duro+rubber&qid=1760386320&sr=8-1"
  },
  {
    "Rubber_Name": "DHS Hurricane 3 Neo (Provincial)",
    "Rubber_Speed": 78,
    "Rubber_Spin": 94,
    "Rubber_Control": 68,
    "Rubber_Power": 80,
    "Rubber_Price": 53.50,
    "Rubber_Level": "Advanced",
    "Rubber_Style": "Normal",
    "Rubber_Weight": 46,
    "Rubber_Affiliate_Link": "https://www.amazon.com/Hurricane-Provincial-Professional-Approved-inorganic/dp/B07PPSF861?dib=eyJ2IjoiMSJ9.VGWfjS2O6ZQUK_Ks-3U6O5ULS4YhP9_TkuoSg35-2tBXjLdd8tyllKbMrVkwBePJninxyOLMyER82wTpcAnTLVNtmJaky-p92LjryOt-LajLBiXpTkQRtjt7E9aTR_KHu2wNu-BXjE8mqGvI8h2k-LrFGHVLSbKXn34hqaFwMTsaXDRh213muJdIOiwCRSttqBd1ExKtEKLVXkdPMGTkWr9gUC5tAW-1V2VfxPguJvLfoZeIcDYmKPFi7dsfQP76fcsIZ4eJ6BSzoMcuIDNGFdgsaNk0ZKnDv-JRoK0jq68.IyP132jAqBOLZ3PAbYF5J-p3S9I9LTochgIG7FCprQc&dib_tag=se&keywords=DHS%2BHurricane%2B3%2BNeo%2B(Provincial)%2Brubber&qid=1760386375&sr=8-3&th=1"
  },
  {
    "Rubber_Name": "DHS Hurricane 3 Neo (Blue Sponge / National)",
    "Rubber_Speed": 80,
    "Rubber_Spin": 95,
    "Rubber_Control": 66,
    "Rubber_Power": 82,
    "Rubber_Price": 67.55,
    "Rubber_Level": "Advanced",
    "Rubber_Style": "Normal",
    "Rubber_Weight": 50,
    "Rubber_Affiliate_Link": "https://www.amazon.com/Freaswind-Protection-Competitions-Hardness-39/dp/B0D4PQMTSR?dib=eyJ2IjoiMSJ9.RvTbjdUTWRbujqeE3Bvql4PH-kuihE9kFyfMjbuKtIvR2JzaJ9XcxupsUSreS3vu9dVVi2R1980Ll53K4MIQ3hr2y6nkQootMXEOCmj6kOZvYjrnfGD3RaD00Kymqu583gf6AHHRa6U50XOIns8_YimedwtQE4OsSb_AKS2IIuC0UmHA1aloy3sx7co3NGEQ.txS8RBAhuhmQ2T7fU913U_6VgPJW_GE_Zeb1ME0F6So&dib_tag=se&keywords=DHS%2BHurricane%2B3%2BNeo%2B(Blue%2BSponge%2B%2F%2BNational)%2Brubber&qid=1760386483&sr=8-1&th=1"
  },
  {
    "Rubber_Name": "DHS Hurricane 3-50",
    "Rubber_Speed": 77,
    "Rubber_Spin": 90,
    "Rubber_Control": 70,
    "Rubber_Power": 78,
    "Rubber_Price": 49.95,
    "Rubber_Level": "Advanced",
    "Rubber_Style": "Normal",
    "Rubber_Weight": 48,
    "Rubber_Affiliate_Link": "https://www.amazon.com/DHS-Hurricane-Table-Tennis-Rubber/dp/B01M268IG7?dib=eyJ2IjoiMSJ9.UBOP2anEzL4s0eblbgiXVPf73GsU3xWPzUvGpETh5AClzGGuuk_DesOZkW7I_ljuhCsPdL_W7ROexIXK3FzaBvQocpwfpNs_lETw7Zg0V66IpKFNSPbFEyWuKkNeB6ZASEBF2t8U-46aLE_K_rCpmhDzb0eJHghWJqS1xUXVqnggX5-W43TVnXcaiEOk2z4zFvtGy2Y9-3i9IOhrVjBhjM-4CfmIXmPn9eyzP99RNR2CgUs_dnBCmk-o-JW2bnQJ.RLnPfD7uR-1qrVqdKrXw3Ar2evM5x2zotZDnYkp0jgI&dib_tag=se&keywords=DHS%2BHurricane%2B3-50%2Brubber&qid=1760386625&sr=8-1&th=1"
  },
  {
    "Rubber_Name": "DHS Hurricane 8",
    "Rubber_Speed": 85,
    "Rubber_Spin": 86,
    "Rubber_Control": 73,
    "Rubber_Power": 83,
    "Rubber_Price": 33.99,
    "Rubber_Level": "Advanced",
    "Rubber_Style": "Normal",
    "Rubber_Weight": 52,
    "Rubber_Affiliate_Link": "https://www.amazon.com/BestParts-DHS-Hurricane-Professional-Approved/dp/B0F2HR91NN?dib=eyJ2IjoiMSJ9.UInaXKyOWfgNhkdYzbqv9Z4wJMKv4CTrcUPkZRtrc38_FQsuwBf5kmbwtHsiVgQxCoz2YJdLsrxGzjzb7QO4HVXjEoxRC3KIY5euScHgd1sLL81ZmgvvzX3xzPREju4ZgTq9VEA2mS4BM3xje61-wUKOZIf4M1KgeNwhkyUmVNcbfz3EmY8e66rWeqbeztLrToplbE0s-65KcyEM9P8l9e-OMKSINB3Q5Ed7j9lccznul_s6vQolWNwEVaxPUyGX-_eR2zvuX76Xz1EgqlhDsuRdmSld5jgYM8A18tCM7ls.AvGIvnN9eLa6c8ejMIqehKqWTlxP9zh6tB8lUke-Jr4&dib_tag=se&keywords=DHS%2BHurricane%2B8%2Brubber&qid=1760386692&sr=8-1&th=1"
  },
  {
    "Rubber_Name": "DHS Gold Arc 8",
    "Rubber_Speed": 90,
    "Rubber_Spin": 89,
    "Rubber_Control": 71,
    "Rubber_Power": 88,
    "Rubber_Price": 48.99,
    "Rubber_Level": "Advanced",
    "Rubber_Style": "Normal",
    "Rubber_Weight": 49,
    "Rubber_Affiliate_Link": "https://www.amazon.com/Table-Tennis-Rubber-Non-Sticky-Germany/dp/B0CGLJX8C1?dib=eyJ2IjoiMSJ9.nK-mShsvUHfBXVxm3ma0Dg.H27NgMuE-GnSUuta9KPTc5vDXQv_QzrD7K0E5dM5pCo&dib_tag=se&keywords=DHS%2BGold%2BArc%2B8%2Brubber&qid=1760386750&sr=8-1&th=1"
  }
];

// Pre-Assembled Rackets Database
export const preAssembledRackets: PreAssembledRacket[] = [
  {
    Racket_Name: "JOOLA Carbon X Pro",
    Racket_Blade: "JOOLA Carbon X",
    Racket_FH_Rubber: "JOOLA Micron 48",
    Racket_BH_Rubber: "JOOLA Micron 48",
    Racket_FH_Rubber_Style: "Normal",
    Racket_BH_Rubber_Style: "Normal",
    Racket_Speed: 88,
    Racket_Spin: 79,
    Racket_Control: 72,
    Racket_Power: 86,
    Racket_Grip: ["Flared", "Straight"],
    Racket_Price: 39.95,
    Racket_Level: "Intermediate",
    Racket_Affiliate_Link: "https://www.amazon.com/JOOLA-Racket-Approved-Professional-Competition/dp/B094JSXWHZ?dib=eyJ2IjoiMSJ9.haEriOo-2bdmhZNCF2d1H0EAOvJZZy5M2XWxri4ZXAqVSULqL1p0l2EmSTAmGA6gP69ySYDohpSfRtsIYjeBD5IJtw6A9OkMhKS16iZbJr2nYZbjYbqwId9DnwsHZXD2-AvUSjXif1RZIANdQF32QlVjFuGC1kEsN5H3xXn6l7RjapUzHaOIP_4aDlAa970Wtc8RXpAI40fE_Ow72DrDYlVmutFw6fEQVCX7j-v_JV4hVylRU9qqT4Xg19tTneZHgh6HPBv6ZUVWcbYj5Mfr7GNa1cKU9EJFIj2j9e1zRYU.r4ZGCdFza-yaULG6tyo0k1JON3BpgmmyFxR_24YySX0&dib_tag=se&keywords=JOOLA%2BCarbon%2BX%2BPro%2BTable%2BTennis%2BRacket&qid=1760417826&sr=8-6&th=1"
  },
  {
    Racket_Name: "JOOLA Infinity Carbon",
    Racket_Blade: "JOOLA Infinity Carbon 5+2",
    Racket_FH_Rubber: "JOOLA Micron 42",
    Racket_BH_Rubber: "JOOLA Micron 42",
    Racket_FH_Rubber_Style: "Normal",
    Racket_BH_Rubber_Style: "Normal",
    Racket_Speed: 86,
    Racket_Spin: 78,
    Racket_Control: 74,
    Racket_Power: 84,
    Racket_Grip: ["Flared"],
    Racket_Price: 86.54,
    Racket_Level: "Advanced",
    Racket_Affiliate_Link: "https://www.amazon.com/JOOLA-Professional-Infinity-Approved-Competition/dp/B0BQCMTD1M?dib=eyJ2IjoiMSJ9.DWwbbkSl7KlTAtbkK76EOPlmgGAd4koUdX5vGUVDjqSWT0PiBuvms5BSE1SFi-IKxcp4856yP-ozcGX5znul19fK7TfEqoV1-GwmpOQDVk3m4nln16G8Q_mvWhGw3kBvwBwa8NiMX0BQYzIYG_RkP_thmhWm4hRDa8Up1Hx4WXNsS4LMRSedGXElhOk5g16gAVFPeIvnwM1OYk8QMJ790fa1QjgEnjDo5jTqUD-SUwgZ6etrG-QnVGJKhiJPXIFHU60_PMgzLdp9ToFHsUTbBuwb-oCPMi_N0gyK39tm0cc.AUIfUFULf55Q5sC3fHV8cYc4YQH1SgTSD2HBUeNVh3w&dib_tag=se&keywords=JOOLA%2BInfinity%2BCarbon%2BTable%2BTennis%2BRacket&qid=1760418049&sr=8-7&th=1"
  },
  {
    Racket_Name: "JOOLA Match Pro",
    Racket_Blade: "JOOLA Match Pro",
    Racket_FH_Rubber: "JOOLA Vizon",
    Racket_BH_Rubber: "JOOLA Vizon",
    Racket_FH_Rubber_Style: "Normal",
    Racket_BH_Rubber_Style: "Normal",
    Racket_Speed: 74,
    Racket_Spin: 70,
    Racket_Control: 82,
    Racket_Power: 72,
    Racket_Grip: ["Flared"],
    Racket_Price: 19.95,
    Racket_Level: "Beginner",
    Racket_Affiliate_Link: "https://www.amazon.com/JOOLA-Approved-Allround-Competition-Thickness/dp/B095HGR1XM?dib=eyJ2IjoiMSJ9.FsA5yMugbgn8T_2ImV1nEil16ZaOhENqiMHm9KW282mi491CC7mLeVfeRaEYEDkQcwkq0aBg3yrpRqJefxmAE2MIUbI2JdlmzZ7Ni1xYSkLlKKDztQeaZ-d-iBwPJbJWxmMp5BxrrdkCQjN2rwYDY0T0i1otGCFQENYtzQW3hEhllQMrgooLHbIFkMG8vT2i76z1JXt8yTDLS-Q6tUN9qftBRiEmJ8FFbGpSEvpP0w5Zzx_dOCpb_EOpC8V0YvwiLI5K2r78lx9pJC1QktEDYSOH0TupcEFK8AVQbvEIwdk.Nb95QZyktKvBwez6xUMWW4RqB4t0JAvD5I2sre_UcqA&dib_tag=se&keywords=JOOLA+Match+Pro+Table+Tennis+Racket&qid=1760418228&sr=8-1"
  },
  {
    Racket_Name: "Butterfly Nakama S5",
    Racket_Blade: "Butterfly Nakama S5 Carbon",
    Racket_FH_Rubber: "Butterfly Wakaba",
    Racket_BH_Rubber: "Butterfly Wakaba",
    Racket_FH_Rubber_Style: "Normal",
    Racket_BH_Rubber_Style: "Normal",
    Racket_Speed: 86,
    Racket_Spin: 78,
    Racket_Control: 75,
    Racket_Power: 84,
    Racket_Grip: ["Flared"],
    Racket_Price: 69.99,
    Racket_Level: "Advanced",
    Racket_Affiliate_Link: "https://www.amazon.com/s?k=Butterfly+Nakama+S5+Table+Tennis+Racket"
  },
  {
    Racket_Name: "Butterfly B302FL",
    Racket_Blade: "Butterfly B302",
    Racket_FH_Rubber: "Butterfly Wakaba",
    Racket_BH_Rubber: "Butterfly Wakaba",
    Racket_FH_Rubber_Style: "Normal",
    Racket_BH_Rubber_Style: "Normal",
    Racket_Speed: 56,
    Racket_Spin: 50,
    Racket_Control: 84,
    Racket_Power: 55,
    Racket_Grip: ["Flared"],
    Racket_Price: 24.83,
    Racket_Level: "Beginner",
    Racket_Affiliate_Link: "https://www.amazon.com/Butterfly-302-Table-Tennis-Racket/dp/B003M4GS6G?dib=eyJ2IjoiMSJ9.XGXbbr4pzf2OE9wLc333riicmpyh7BQejo_OhJMIEn2Kmd9QxEOK7lfinhpW1oNi1wM8o1c2o5bb0hz4GWxz8vac9q1S-rhl04sur23zZJjIRe-WL4qplKK-WWXfCw_b31jgUEVoFNmsBuomIoYDHDUQZ4qnFG0AzsJz7T4g82sP-EmshWkgGlG_sX4VdxOj1GZUv5oeo1tG49cyyTFDVfBRNk1_k52tFrV8aJNNIfmFpiCAwgoMld4A4-SbpO6F_RwqaV34ojI19saDeXHWQphlqD7ue4sakZz6oK06Yac.jDOMLO7SopVFmeL1ZepQQhHmdzK6I8ZxeoCK9YR1mX4&dib_tag=se&keywords=Butterfly+B302FL+Table+Tennis+Racket&qid=1760418625&sr=8-6"
  },
  {
    Racket_Name: "Butterfly 401",
    Racket_Blade: "Butterfly 401",
    Racket_FH_Rubber: "Butterfly Yuki",
    Racket_BH_Rubber: "Butterfly Yuki",
    Racket_FH_Rubber_Style: "Normal",
    Racket_BH_Rubber_Style: "Normal",
    Racket_Speed: 64,
    Racket_Spin: 60,
    Racket_Control: 80,
    Racket_Power: 60,
    Racket_Grip: ["Flared"],
    Racket_Price: 31.99,
    Racket_Level: "Beginner",
    Racket_Affiliate_Link: "https://www.amazon.com/Butterfly-401-Table-Tennis-Racket/dp/B003M4DS5U?dib=eyJ2IjoiMSJ9.z_yDsCLKBDfwDHoKU2aN0hb108-uQP5pqoqFEnjW2JwN5dKrsuNMFctr-S6e8p7pNljr1s_gO7WPzjkdVIqyfE7yQYhEy8oRCg2ceG5BTDpP4OpWDjStc_lOglJBxvQfSsIkQ3r0ExuIWTauvuPLOpbXlcw86NSMcehIdPFblKNG_JHkKd5AC5Nj3V_V3G0xANEgJ1JsG5SYCYjN7PP2zF2DDWoRzVM_YLWuD2_3suUxmk3vBQa3CrnhKE_TW3kcZZF9GxRYAZ6SM0036YIg00UzpJS1ZaGzpunTr1AklEA.knfL5HjflPzYZ0F11wWRGt9ScvxPjyf2DCo3QkcFGRM&dib_tag=se&keywords=Butterfly+401+Table+Tennis+Racket&qid=1760418676&sr=8-1"
  },
  {
    Racket_Name: "DHS 9002",
    Racket_Blade: "DHS 9002",
    Racket_FH_Rubber: "DHS Hurricane 3",
    Racket_BH_Rubber: "DHS G888",
    Racket_FH_Rubber_Style: "Normal",
    Racket_BH_Rubber_Style: "Normal",
    Racket_Speed: 87,
    Racket_Spin: 86,
    Racket_Control: 70,
    Racket_Power: 86,
    Racket_Grip: ["Flared"],
    Racket_Price: 83.99,
    Racket_Level: "Intermediate",
    Racket_Affiliate_Link: "https://www.amazon.com/Tennis-Professional-Offensive-Hurricane-9002-FL-Longhandle/dp/B0C7ZBMLY3?dib=eyJ2IjoiMSJ9.sRmqEhpOt_8bnYv2zSgvbobYTMzs8R3FUbAcIM2t_usZTuCq-PQDnS9b-LktBStve5XH_UpthYLOMqpZK9nbYymH0M5aJ_u_gQgZC1BI9RSAJYEcZjc-5Fqbnk3hqOKz-lAiOeBOb74S9B79L4zAjnBLOvqAyRcTe8nKUd0qd3xhtYkYWWKl-n9PDLm91pxzJT99vTFoewiaIo2TSfaMceca1yHQjxkJ4VSH6u06v35PFZmUSiGrYQL_n31tbOpsBoVoKjziaRUkq2Tg2Io9qCWIkbzOtnOFkvD6JPPxbW0.nPW6ies-flYnBm1xAnyxrb7DJwqObAhdBgozNMdUd5k&dib_tag=se&keywords=DHS+9002+Table+Tennis+Racket&qid=1760418729&sr=8-6"
  },
  
];