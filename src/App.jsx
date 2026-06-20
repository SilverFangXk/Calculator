import { useState } from "react";
import { Calculator } from "./components/calculator";
import { Sidebar } from "./components/Sidebar";
import { Currency } from "./components/Currency";
import { WindowControls } from "./components/WindowControls"; 

function App() {
  const [dark, setDark] = useState(true);
  const [history, setHistory] = useState([]);
  const [mode, setMode] = useState("standard");

  const renderMode = () => {
    switch (mode) {
      case "standard":
      case "scientific":
        return <Calculator dark={dark} setHistory={setHistory} mode={mode} />;
      case "currency":
        return <Currency dark={dark} />;
      default:
        return <Calculator dark={dark} setHistory={setHistory} mode={mode} />;
    }
  };

  return (
    <div className={`relative flex h-screen w-screen ${dark ? "bg-bg-dark" : "bg-bg-light"} transition-all duration-300`}>
      
      
      <Sidebar dark={dark} setDark={setDark} history={history} mode={mode} setMode={setMode} />
      
      <div className="flex flex-1 items-center justify-center mt-10">
        {renderMode()}
      </div>
      <WindowControls dark={dark} />
    </div>
  );
}

export default App;