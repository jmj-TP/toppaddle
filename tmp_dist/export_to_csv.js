"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var products_ts_1 = require("./src/data/products.ts");
var json2csv_1 = require("json2csv");
function exportToCsv() {
    var bladeParser = new json2csv_1.Parser({
        fields: ['Name', 'Speed', 'Spin', 'Control', 'Power', 'Level', 'Style', 'Price', 'Weight_g', 'Grips', 'Description', 'Image_URL', 'Stiffness', 'Material']
    });
    var formattedBlades = products_ts_1.blades.map(function (b) { return ({
        Name: b.Blade_Name,
        Speed: b.Blade_Speed,
        Spin: b.Blade_Spin,
        Control: b.Blade_Control,
        Power: b.Blade_Power,
        Level: b.Blade_Level,
        Style: b.Blade_Style || '',
        Price: b.Blade_Price,
        Weight_g: b.Blade_Weight || '',
        Grips: b.Blade_Grip.join(', '),
        Description: b.Blade_Description,
        Image_URL: b.Blade_Image || '',
        Stiffness: b.Blade_Stiffness || '',
        Material: b.Blade_Material || ''
    }); });
    (0, fs_1.writeFileSync)('blades_export.csv', bladeParser.parse(formattedBlades));
    var rubberParser = new json2csv_1.Parser({
        fields: ['Name', 'Speed', 'Spin', 'Control', 'Power', 'Level', 'Style', 'Price', 'Weight_g', 'Sponge_Sizes', 'Description', 'Image_URL', 'Hardness', 'Throw_Angle', 'Surface']
    });
    var formattedRubbers = products_ts_1.rubbers.map(function (r) { return ({
        Name: r.Rubber_Name,
        Speed: r.Rubber_Speed,
        Spin: r.Rubber_Spin,
        Control: r.Rubber_Control,
        Power: r.Rubber_Power,
        Level: r.Rubber_Level,
        Style: r.Rubber_Style,
        Price: r.Rubber_Price,
        Weight_g: r.Rubber_Weight || '',
        Sponge_Sizes: (r.Rubber_Sponge_Sizes || []).join(', '),
        Description: r.Rubber_Description,
        Image_URL: r.Rubber_Image || '',
        Hardness: r.Rubber_Hardness || '',
        Throw_Angle: r.Rubber_ThrowAngle || '',
        Surface: r.Rubber_Surface || ''
    }); });
    (0, fs_1.writeFileSync)('rubbers_export.csv', rubberParser.parse(formattedRubbers));
    var racketParser = new json2csv_1.Parser({
        fields: ['Name', 'Speed', 'Spin', 'Control', 'Power', 'Level', 'Price', 'Grips', 'Description', 'Image_URL']
    });
    var formattedRackets = products_ts_1.preAssembledRackets.map(function (r) { return ({
        Name: r.Racket_Name,
        Speed: r.Racket_Speed,
        Spin: r.Racket_Spin,
        Control: r.Racket_Control,
        Power: r.Racket_Power,
        Level: r.Racket_Level,
        Price: r.Racket_Price,
        Grips: r.Racket_Grip.join(', '),
        Description: r.Racket_Description,
        Image_URL: r.Racket_Image || ''
    }); });
    (0, fs_1.writeFileSync)('rackets_export.csv', racketParser.parse(formattedRackets));
    console.log("Exported successfully to blades_export.csv, rubbers_export.csv, and rackets_export.csv");
}
exportToCsv();
