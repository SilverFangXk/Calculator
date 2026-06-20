import { Layer } from "./layer";
import { Display } from "./display";
import { useCalculator } from "../hooks/useCalculator";

export function Calculator({ dark, setHistory, mode }) {
  const { display, handleButton, isRad } = useCalculator(setHistory);

  const scientificRows = [
    ["sin", "cos", "tan", "log"],
    ["ln", "x²", "√x", "xʸ"],
    ["π", "e", "1/x", "!"],
    ["rad", "10²", "eˣ", "deg"],
  ];
  return (
    <div className={`${dark ? "bg-card-dark" : "bg-card-light"} rounded-calculator p-7 w-100 transition-all duration-300 shadow-2xl `}>

      {/* Display */}
      <Display dark={dark} value={display} />

      {/* Scientific rows */}
      {mode === "scientific" && (
        <div className="space-y-2 mt-4 mb-2">
          {scientificRows.map((row, i) => (
            <Layer key={i} value={row} dark={dark} onPress={handleButton} scientific isRad={isRad} />
          ))}
        </div>
      )}

      {/* Buttons */}
      <div className="space-y-3 mt-4">
        <Layer value={["AC", "()", "%", "/"]} dark={dark} onPress={handleButton} />
        <Layer value={[7, 8, 9, "*"]} dark={dark} onPress={handleButton} />
        <Layer value={[4, 5, 6, "-"]} dark={dark} onPress={handleButton} />
        <Layer value={[1, 2, 3, "+"]} dark={dark} onPress={handleButton} />
        <Layer value={[".", 0, "delete", "="]} dark={dark} onPress={handleButton} />
      </div>
    </div>
  );
}