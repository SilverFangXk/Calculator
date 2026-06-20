import { useState } from "react";

export function useCalculator(setHistory) {
  const [calculation, setCalculation] = useState("");
  const [isRad, setIsRad] = useState(true);

  const formatDisplay = (calc) => {
    if (!calc) return "0";
    let result = String(calc);
    result = result.replace(/Math\.sqrt\(([^)]+)\)/g, "√($1)");
    result = result.replace(/Math\.log10\(([^)]+)\)/g, "log($1)");
    result = result.replace(/Math\.log\(([^)]+)\)/g, "ln($1)");
    result = result.replace(/Math\.sin\(([^)]+)\)/g, "sin($1)");
    result = result.replace(/Math\.cos\(([^)]+)\)/g, "cos($1)");
    result = result.replace(/Math\.tan\(([^)]+)\)/g, "tan($1)");
    result = result.replace(/Math\.PI/g, "π");
    result = result.replace(/Math\.E/g, "e");
    result = result.replace(/\*\*/g, "^");
    result = result.replace(/(\w+)\^(\w+)/g, "$1<sup>$2</sup>");
    result = result.replace(/\*(?![^<]*>)/g, "×");
    result = result.replace(/\/(?![^<]*\/?>)/g, "÷");
    return result;
  };

  const display = formatDisplay(calculation);

  const handleButton = (value) => {
    if (value === "delete") {
      setCalculation(prev => prev.slice(0, -1));

    } else if (value === "AC") {
      setCalculation("");

    } else if (value === "rad") {
      setIsRad(true);

    } else if (value === "deg") {
      setIsRad(false);

    } else if (value === "=") {
      try {
        const sanitized = calculation
          .replace(/×/g, "*")
          .replace(/÷/g, "/")
          .replace(/%/g, "/100");
        if (!/[\d)\.EI]$/.test(sanitized)) {
          setCalculation("ERROR");
          return;
        }
        const result = eval(sanitized);
        if (setHistory) {
          setHistory(prev => [...prev, {
            expression: formatDisplay(calculation),
            result: String(result)
          }]);
        }
        setCalculation(String(result));
      } catch {
        setCalculation("ERROR");
      }

    } else if (value === "()") {
      setCalculation(prev => {
        const openCount = (prev.match(/\(/g) || []).length;
        const closeCount = (prev.match(/\)/g) || []).length;
        return prev + (openCount > closeCount ? ")" : "(");
      });

    } else if (value === "%") {
      try {
        const result = eval(calculation) / 100;
        setCalculation(String(result));
      } catch {
        setCalculation("ERROR");
      }

    } else if (value === "x²") {
      setCalculation(prev => `(${prev})**2`);

    } else if (value === "√x") {
      setCalculation(prev => `Math.sqrt(${prev})`);

    } else if (value === "xʸ") {
      setCalculation(prev => `${prev}**`);

    } else if (value === "10²") {
      setCalculation(prev => `${prev}10**2`);

    } else if (value === "eˣ") {
      setCalculation(prev => `${prev}Math.E**`);

    } else if (value === "π") {
      setCalculation(prev => `${prev}Math.PI`);

    } else if (value === "e") {
      setCalculation(prev => `${prev}Math.E`);

    } else if (value === "sin") {
      setCalculation(prev => `Math.sin(${isRad ? prev : `${prev}*Math.PI/180`})`);

    } else if (value === "cos") {
      setCalculation(prev => `Math.cos(${isRad ? prev : `${prev}*Math.PI/180`})`);

    } else if (value === "tan") {
      setCalculation(prev => `Math.tan(${isRad ? prev : `${prev}*Math.PI/180`})`);

    } else if (value === "log") {
      setCalculation(prev => `Math.log10(${prev})`);

    } else if (value === "ln") {
      setCalculation(prev => `Math.log(${prev})`);

    } else if (value === "1/x") {
      setCalculation(prev => `1/(${prev})`);

    } else if (value === "!") {
      const num = parseInt(calculation);
      if (isNaN(num) || num < 0 || num > 20) { setCalculation("ERROR"); return; }
      let fact = 1;
      for (let i = 2; i <= num; i++) fact *= i;
      setCalculation(String(fact));

    } else {
      setCalculation(prev => prev === "ERROR" ? String(value) : prev + String(value));
    }
  };

  return { display, handleButton, isRad };
}