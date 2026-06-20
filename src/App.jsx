import { useState } from "react";
import { Calculator } from "./components/calculator";
import { Sidebar } from "./components/Sidebar";

function App() {
  const [dark, setDark] = useState(true);
  const [history, setHistory] = useState([]);
  const [mode, setMode] = useState("standard");

  return (
    <div className={`flex h-screen w-screen ${dark ? "bg-bg-dark" : "bg-bg-light"} transition-all duration-300`}>
      <Sidebar dark={dark} setDark={setDark} history={history} mode={mode} setMode={setMode} />
      <div className="flex flex-1 items-center justify-center">
        <Calculator dark={dark} setHistory={setHistory} mode={mode} />
      </div>
    </div>
  );
}

export default App;