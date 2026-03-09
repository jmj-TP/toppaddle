const fs = require('fs');
const parse = require('csv-parse/sync').parse;

const csvData = `Blade Name,Composition (Veneers),Speed (1-100),Control (1-100),Stiffness (1-100),Dwell Time,Specialist SEO Description
Butterfly Viscaria,5W + 2 Arylate/Carbon (Outer),92,75,78,Medium,"The gold standard for modern offensive play. Viscaria's Koto outer ply and ALC fiber provide the crisp, powerful, and consistent benchmark used by countless professionals."
Butterfly Timo Boll ALC,5W + 2 Arylate/Carbon (Outer),93,74,80,Medium-Low,"Based on the Viscaria construction but with a slightly sharper, stiffer feel. It is optimized for close-to-the-table counter-looping and precise, powerful attacks."
DHS Hurricane Long 5,5W + 2 Arylate/Carbon (Inner),95,76,70,High,"The ultimate ""Innerforce"" ALC blade. Limba outer plies over a carbon core offer massive dwell time and safety for slow loops, unlocking devastating power on full-force strokes."
Stiga Clipper Wood,7-Ply Wood (Limba-Ayous),86,82,75,Medium-High,"The legendary all-wood powerhouse. Known for its thick composition and solid feel, it provides incredible control for blocking and driving, making it the perfect choice for traditional power players."
Nittaku Acoustic,5-Ply Wood (Limba),78,90,60,Very High,"Built using acoustic instrument manufacturing techniques. The special gluing process gives it unique ""feedback"" and flexibility, offering unparalleled control and spin for technical, loop-focused players."
Butterfly Innerforce Layer ALC,5W + 2 Arylate/Carbon (Inner),89,80,68,High,"Butterfly's answer to the Inner-carbon demand. This blade acts like a controllable 5-ply wood on soft contact but activates the ALC core for powerful, safe looping on strong attacks."
Stiga Carbonado 145,5W + 2 TeXtreme Carbon (Outer),94,72,85,Medium-Low,"A high-tech beast using unique TeXtreme flat-weave carbon. The 145 angle provides a wider sweet spot and a flatter, more direct trajectory for aggressive smashers and drivers."
Xiom Stradivarius,5W + 2 Aramid/Carbon (Outer),91,76,76,Medium,"A high-value alternative to the Viscaria class. The Aramid Carbon (a slightly softer ALC variant) over Koto provides a crisp, responsive feel for dynamic all-round offensive play."
Butterfly Primorac Carbon,3W + 2 Tamca 5000 (Outer),98,60,95,Low,"A pure speed legend. Thick Cypress outer plies combined with T5000 carbon make this one of the stiffest and fastest blades ever made, perfect for flat hitters and blockers."
Donier Balsa 14.5,3W + 2 Fiberglass + Balsa Core,84,85,70,High,"The lightweight touch specialist. A thick Balsa core offers a unique low-gear control for short-game precision, while the fiberglass layers give surprising power on put-away shots."
Nittaku Violin,5-Ply Wood (White Ash),75,94,55,Extreme,"The ultimate control blade. White Ash outer plies and special instrument gluing give the highest dwell time among all-wood blades, making it the spin-master's dream."
Butterfly Mazunov,5-Ply Wood (Planchonello),88,78,82,Medium,"An anomaly—a heavy, stiff, 5-ply wood that rivals many carbon blades in speed. Its unique Planchonello outer plies create a massive ""catapult effect"" for traditional, mid-distance power loops."
Stiga Infinity VPS V,5-Ply Wood (Limba - VPS),83,86,65,High,"Custom-treated ""Diamond Touch"" Limba plies. This VPS technology hardens the outer surface, giving the control of a 5-ply wood with a crispness that supports the modern, poly-ball loop game."
Joola Rossi Emotion,5W + 2 Carbon (Inner),87,84,62,High,"A hidden gem in the Inner-carbon category. Its extremely soft Hinoki outer plies provide luxurious touch, while the inner carbon layers give strong, dynamic speed when needed."
Butterfly Timo Boll ZLC,5W + 2 Zylon/Carbon (Outer),96,68,90,Low,"Zylon/Carbon weave is lighter, stiffer, and more explosive than ALC. This blade offers massive speed and a direct, flat trajectory, rewarding advanced players with precise timing."
DHS Hurricane Long 3,7-Ply Wood (Limba-Ayous),87,81,72,High,"A refined, slightly softer version of the classic Stiga Clipper Wood. This 7-ply all-wood construction offers a perfect balance of control, solid feel, and traditional loop power."
Nittaku Tenaly Acoustic,5-Ply Wood (Limba),78,90,60,Very High,"The ultimate ergonomic tool. It uses the award-winning Acoustic construction but with a patented curved handle that automatically aligns the blade angle for a natural, stress-free grip."
Butterfly Petr Korbel,5-Ply Wood (Limba),76,91,58,High,"The benchmark 5-ply Limba looping blade. Thousands of players have developed their game with this blade, which excels at producing massive spin and consistent rallies."
Stiga Rosewood NCT V,5-Ply Wood (Rosewood),89,77,85,Medium-Low,"Stiga's fastest all-wood blade. Extremely hard Rosewood outer plies combined with NCT technology make this blade stiff and responsive, supporting aggressive driving and smashing."
Victas Koki Niwa Wood,7-Ply Wood (Limba-Limba),90,75,80,Medium,"Designed for the counter-attack specialist. This unique 7-ply construction uses softer outer plies over a hard core, giving the solid feel needed to absorb and redirect opponent power."
Butterfly Mizutani Jun ZLC,5W + 2 Zylon/Carbon (Outer),95,70,88,Low,"A direct competitor to the TB ZLC. It utilizes the same explosive ZLC material but is configured for a slightly higher throw angle, making it deadlier for high-speed, mid-distance looping rallies."
DHS Power G7,7-Ply Wood (Limba-Ayous),85,83,70,High,"A legendary high-value 7-ply wood. It offers a versatile, ""classic"" 7-ply feel, giving strong power for drives and blocks without sacrificing the dwell time needed for strong loops."
Donic Ovtcharov True Carbon,5W + 2 Arylate/Carbon (Outer),92,74,79,Medium,"A direct, high-quality alternative to the Viscaria and TB ALC. Donic uses the identical Koto-ALC construction method, offering the same iconic crisp, versatile, professional offensive power."
Butterfly Gergely,3W + 2 Tamca 5000 (Outer),97,62,93,Low,"A speed beast derived from the Primorac Carbon but with a larger, more traditional handle shape. Its T5000/Cypress build is optimized for flat hitting, smashing, and uncompromising offensive pressure."
Stiga Ebenholz NCT V,5-Ply Wood (Ebony),91,75,88,Low,"Stiga's fastest and stiffest all-wood blade, using extremely hard Ebony outer plies. This creates a massive ""rebound effect,"" perfect for players who demand maximum speed and a direct, powerful trajectory."
Nittaku Ludeack Power,7-Ply Wood (Limba-Ayous),88,79,78,Medium,"A refined, stiffer version of the Nittaku Ludeack. This 7-ply wood is built for the post-poly ball era, giving the extra speed needed for power drives and consistent, strong counter-looping."
Butterfly Innerforce Layer ZLC,5W + 2 Zylon/Carbon (Inner),93,75,75,Medium-High,"The ultimate Inner-fiber blend. It features the soft feel and dwell time of a 5-ply wood on soft contact, but activating the powerful, stiff ZLC core unlocks massive, dynamic power on strong loops."
DHS Hurricane Hao III,5W + 1 Glass-Carbon (Mono-Core),89,80,65,High,"A unique ""glass-carbon"" mono-core blade. Its thick central carbon layer is designed specifically for the Penhold RPB grip, giving immense power for loop-drives while maintaining incredible touch."
Joola Aruna Off,5W + 2 Carbon (Inner),89,82,66,High,"A classic Inner-carbon blade. Limba outer plies over a soft carbon core offer massive dwell time and safety for loops, while the inner carbon core provides linear, dynamic power on command."
Butterfly Timo Boll Spirit,5W + 2 Arylate/Carbon (Outer),91,76,75,Medium,"The predecessor to the TB ALC and a legend in its own right. This blade uses the exact Koto-ALC construction that set the benchmark for versatile, controlled-looping offensive power."`;

const records = parse(csvData, { columns: true, skip_empty_lines: true });

function mapMaterial(composition) {
    if (composition.includes("(Outer)")) return "Outer-Carbon";
    if (composition.includes("(Inner)")) return "Inner-Carbon";
    if (composition.includes("Mono-Core")) return "Inner-Carbon";
    if (composition.includes("Balsa Core")) return "Inner-Carbon";
    if (composition.includes("Wood")) return "All-Wood";
    return "All-Wood";
}

let output = 'export const blades: Blade[] = [\n';

records.forEach(r => {
    const speed = parseInt(r['Speed (1-100)']);
    const control = parseInt(r['Control (1-100)']);
    const stiffness = parseInt(r['Stiffness (1-100)']);

    const power = speed;
    const spin = Math.min(99, Math.round(control * 1.1 + (speed * 0.1)));
    const level = speed > 85 ? "Advanced" : speed > 70 ? "Intermediate" : "Beginner";
    const style = speed > 80 ? '"Offensive"' : '"Allround"';
    const price = speed > 88 ? 150 : 80;

    output += `  {
    Blade_Name: ${JSON.stringify(r['Blade Name'])},
    Blade_Speed: ${speed},
    Blade_Spin: ${spin},
    Blade_Control: ${control},
    Blade_Power: ${power},
    Blade_Grip: ["FL", "ST"],
    Blade_Price: ${price},
    Blade_Level: "${level}",
    Blade_Style: ${style},
    Blade_Weight: 85,
    Blade_Stiffness: ${stiffness},
    Blade_Material: "${mapMaterial(r['Composition (Veneers)'])}",
    Blade_Description: ${JSON.stringify(r['Specialist SEO Description'])},
  },
`;
});
output += '];\n';

fs.writeFileSync('blades_output.ts', output);
