import { useState, useRef } from "react";
import { Calculator } from "./components/calculator";
import { Sidebar } from "./components/Sidebar";
import { Currency } from "./components/Currency";
import { WindowControls } from "./components/WindowControls";
import { UnitConverter } from "./components/UnitConverter";
import { VoiceAssistant } from "./components/VoiceAssistant";
import { AIResponse } from "./components/AIResponse";
import { useVoiceAI } from "./hooks/useVoiceAI";
import { useAICalculator } from "./hooks/useAICalculator";

function App() {
  const [dark, setDark] = useState(true);
  const [history, setHistory] = useState([]);
  const [mode, setMode] = useState("standard");

  // Ref to call handleButton from App level
  const handleButtonRef = useRef(null);
  // Ref to read the current display value
  const displayRef = useRef("0");

  const { askAI, aiResponse, isThinking, clearResponse } = useAICalculator();

  /**
   * Called by useVoiceAI when speech recognition returns a transcript.
   * 1. Sends it to Claude
   * 2. If action === "calculate" → fires button sequence on the calculator
   * 3. If action === "explain" | "formula" → AIResponse overlay handles display
   */
  const handleVoiceCommand = async (transcript) => {
    // Switch to standard/scientific mode when user asks to calculate
    if (mode !== "standard" && mode !== "scientific") {
      setMode("standard");
    }

    const parsed = await askAI(transcript, displayRef.current);
    if (!parsed) return;

    if (parsed.action === "calculate" && parsed.expression) {
      // Clear calculator first, then inject the expression via AC + direct eval
      if (handleButtonRef.current) {
        handleButtonRef.current("AC");
        // Inject each char one by one so the display builds naturally
        // But we short-circuit: set expression directly and press =
        injectExpression(parsed.expression);
      }
    }
    // explain / formula are handled by AIResponse overlay (aiResponse state)
  };

  /**
   * Injects an expression into the calculator by simulating button presses.
   * Maps JS expression chars to calculator button values.
   */
  const injectExpression = (expr) => {
    if (!handleButtonRef.current) return;

    // Map special tokens before char-by-char injection
    const tokenMap = [
      [/Math\.sin\(/g,   () => handleButtonRef.current("sin")],
      [/Math\.cos\(/g,   () => handleButtonRef.current("cos")],
      [/Math\.tan\(/g,   () => handleButtonRef.current("tan")],
      [/Math\.log10\(/g, () => handleButtonRef.current("log")],
      [/Math\.log\(/g,   () => handleButtonRef.current("ln")],
      [/Math\.sqrt\(/g,  () => handleButtonRef.current("√x")],
      [/Math\.PI/g,      () => handleButtonRef.current("π")],
      [/Math\.E/g,       () => handleButtonRef.current("e")],
    ];

    // Replace tokens and send remaining chars
    let remaining = expr;
    tokenMap.forEach(([regex, fn]) => {
      remaining = remaining.replace(regex, (match) => {
        fn();
        return ""; // remove matched token from string
      });
    });

    // Send remaining chars individually
    for (const ch of remaining) {
      if ([..."0123456789.+-*/()"].includes(ch)) {
        handleButtonRef.current(ch === "*" ? "*" : ch === "/" ? "/" : ch);
      } else if (ch === "^") {
        handleButtonRef.current("xʸ");
      }
    }

    // Press equals
    setTimeout(() => handleButtonRef.current("="), 50);
  };

  const { isListening, toggleListening } = useVoiceAI(handleVoiceCommand);

  const renderMode = () => {
    switch (mode) {
      case "standard":
      case "scientific":
        return (
          <Calculator
            dark={dark}
            setHistory={setHistory}
            mode={mode}
            onHandleButtonReady={(fn) => { handleButtonRef.current = fn; }}
            onDisplayChange={(val) => { displayRef.current = val; }}
          />
        );
      case "currency":
        return <Currency dark={dark} />;
      case "unit":
        return <UnitConverter dark={dark} />;
      default:
        return (
          <Calculator
            dark={dark}
            setHistory={setHistory}
            mode={mode}
            onHandleButtonReady={(fn) => { handleButtonRef.current = fn; }}
            onDisplayChange={(val) => { displayRef.current = val; }}
          />
        );
    }
  };

  return (
    <div
      className={`relative flex h-screen w-screen ${
        dark ? "bg-bg-dark" : "bg-bg-light"
      } transition-all duration-300`}
    >
      <Sidebar
        dark={dark}
        setDark={setDark}
        history={history}
        mode={mode}
        setMode={setMode}
      />

      <div className="flex flex-1 items-center justify-center mt-10">
        {renderMode()}
      </div>

      {/* AI text response overlay */}
      <AIResponse
        response={aiResponse}
        isThinking={isThinking}
        dark={dark}
        onDismiss={clearResponse}
      />

      <VoiceAssistant isListening={isListening} onToggle={toggleListening} />
      <WindowControls dark={dark} />
    </div>
  );
}

export default App;
