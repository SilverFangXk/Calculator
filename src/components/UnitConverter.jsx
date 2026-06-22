import { useState } from 'react';

const conversionData = {
  length: {
    units: ['m', 'km', 'cm', 'mm', 'mi', 'ft'],
    factors: { m: 1, km: 1000, cm: 0.01, mm: 0.001, mi: 1609.34, ft: 0.3048 }
  },
  weight: {
    units: ['kg', 'g', 'lb', 'oz'],
    factors: { kg: 1, g: 0.001, lb: 0.453592, oz: 0.0283495 }
  }
};

export function UnitConverter({ dark }) {
  const [category, setCategory] = useState('length');
  const [from, setFrom] = useState(conversionData.length.units[0]);
  const [to, setTo] = useState(conversionData.length.units[1]);
  const [value, setValue] = useState(0);
  const [result, setResult] = useState(0);

  const handleConvert = () => {
    const factors = conversionData[category].factors;
    const baseValue = value * factors[from];
    const finalValue = baseValue / factors[to];
    setResult(finalValue.toFixed(4));
  };

  // Helper styles based on theme
  const bgInput = dark ? "bg-button-dark text-white" : "bg-gray-200 text-black";
  const textColor = dark ? "text-text-dark" : "text-text-light";

  return (
    <div className={`${dark ? "bg-card-dark" : "bg-card-light"} rounded-calculator p-7 w-100 shadow-2xl`}>
      <h2 className={`text-xl font-bold mb-4 ${textColor}`}>Unit Converter</h2>
      
      <select 
        onChange={(e) => {
          setCategory(e.target.value);
          setFrom(conversionData[e.target.value].units[0]);
          setTo(conversionData[e.target.value].units[1]);
        }} 
        className={`w-full p-2 mb-4 rounded-lg ${bgInput}`}
      >
        <option value="length">Length</option>
        <option value="weight">Weight</option>
      </select>

      <input 
        type="number" 
        onChange={(e) => setValue(Number(e.target.value))} 
        className={`w-full p-3 mb-2 rounded-xl ${bgInput}`} 
      />

      <div className="flex gap-2 mb-4">
        <select value={from} onChange={(e) => setFrom(e.target.value)} className={`flex-1 p-2 rounded-lg ${bgInput}`}>
          {conversionData[category].units.map(u => <option key={u} value={u}>{u}</option>)}
        </select>
        <select value={to} onChange={(e) => setTo(e.target.value)} className={`flex-1 p-2 rounded-lg ${bgInput}`}>
          {conversionData[category].units.map(u => <option key={u} value={u}>{u}</option>)}
        </select>
      </div>

      <button onClick={handleConvert} className="w-full h-12 bg-accent text-white rounded-xl font-semibold">Convert</button>
      
      <div className={`mt-4 p-4 text-center text-lg font-bold rounded-xl ${bgInput}`}>
        {result} {to}
      </div>
    </div>
  );
}
