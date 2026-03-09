const fs = require('fs');
const { blades, rubbers, preAssembledRackets } = require('./tmp_products.js');

function toCsv(items, fields) {
    const header = fields.map(f => `"${f}"`).join(',');
    const rows = items.map(item => {
        return fields.map(field => {
            let val = item[field];
            if (Array.isArray(val)) val = val.join(', ');
            if (val === undefined || val === null) val = '';
            val = String(val).replace(/"/g, '""'); // escape quotes
            return `"${val}"`;
        }).join(',');
    });
    return [header, ...rows].join('\n');
}

const bladeFields = ['Blade_Name', 'Blade_Speed', 'Blade_Spin', 'Blade_Control', 'Blade_Power', 'Blade_Level', 'Blade_Style', 'Blade_Price', 'Blade_Weight', 'Blade_Grip', 'Blade_Description', 'Blade_Image', 'Blade_Stiffness', 'Blade_Material', 'Blade_Brand'];
fs.writeFileSync('artifacts/blades.csv', toCsv(blades, bladeFields));

const rubberFields = ['Rubber_Name', 'Rubber_Speed', 'Rubber_Spin', 'Rubber_Control', 'Rubber_Power', 'Rubber_Level', 'Rubber_Style', 'Rubber_Price', 'Rubber_Weight', 'Rubber_Sponge_Sizes', 'Rubber_Description', 'Rubber_Image', 'Rubber_Hardness', 'Rubber_ThrowAngle', 'Rubber_Surface', 'Rubber_Brand'];
fs.writeFileSync('artifacts/rubbers.csv', toCsv(rubbers, rubberFields));

const racketFields = ['Racket_Name', 'Racket_Speed', 'Racket_Spin', 'Racket_Control', 'Racket_Power', 'Racket_Level', 'Racket_Price', 'Racket_Grip', 'Racket_Description', 'Racket_Image', 'Racket_Brand'];
fs.writeFileSync('artifacts/rackets.csv', toCsv(preAssembledRackets, racketFields));

console.log("Exported all products to artifacts directory successfully.");
