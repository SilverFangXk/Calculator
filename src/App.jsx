import { useState } from "react";
import { Calculator } from "./components/calculator";
import { Sidebar } from "./components/Sidebar";
import {Currency} from "./components/Currency"; 
import {UnitConverter} from "./components/UnitConverter";

function App() {
  const [dark, setDark] = useState(true);
  const [history, setHistory] = useState([]);
  const [mode, setMode] = useState("standard");

  // Helper to render the correct component based on mode
  const renderMode = () => {
    switch (mode) {
      case "standard":
      case "scientific":
        return <Calculator dark={dark} setHistory={setHistory} mode={mode} />;
      case "currency":
        return <Currency dark={dark} />;
      case "unit":
         return <UnitConverter dark={dark} />;
      default:
        return <Calculator dark={dark} setHistory={setHistory} mode={mode} />;
    }
  };

  return (
    <div className={`flex h-screen w-screen ${dark ? "bg-bg-dark" : "bg-bg-light"} transition-all duration-300`}>
      <Sidebar dark={dark} setDark={setDark} history={history} mode={mode} setMode={setMode} />
      <div className="flex flex-1 items-center justify-center">
        {renderMode()}
      </div>
    </div>
  );
}

export default App;