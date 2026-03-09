const fs = require('fs');
const file = 'c:\\Users\\jjsch\\.gemini\\antigravity\\scratch\\table_tennis_equipment\\src\\components\\configurator\\SlotMachine.tsx';
let content = fs.readFileSync(file, 'utf8');

const pImportEnd = content.indexOf('  const SlotWheel = ({');
const pMachineStart = content.indexOf('const SlotMachine = ({');
const pMachineSpinEnd = content.indexOf('  return () => clearTimeout(timer);');
const pMachineReturn = content.lastIndexOf('  return (\n    <div className="w-full">');

if (pImportEnd === -1 || pMachineStart === -1 || pMachineSpinEnd === -1 || pMachineReturn === -1) {
    console.log('Error finding indices:', { pImportEnd, pMachineStart, pMachineSpinEnd, pMachineReturn });
    process.exit(1);
}

const imports = content.substring(0, pImportEnd);
const wheelTop = content.substring(pImportEnd, pMachineStart);
const machineTop = content.substring(pMachineStart, pMachineSpinEnd);
const wheelBottom = content.substring(pMachineSpinEnd, pMachineReturn);
const machineBottom = content.substring(pMachineReturn);

const fixedContent = imports + wheelTop + wheelBottom + '\n\n' + machineTop + machineBottom;

fs.writeFileSync(file, fixedContent);
console.log('Fixed file successfully!');
