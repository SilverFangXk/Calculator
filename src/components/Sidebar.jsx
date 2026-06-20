import { Clock, Calculator, FlaskConical, DollarSign, Ruler } from "lucide-react";

const modes = [
  { id: "standard", label: "Standard", icon: Calculator },
  { id: "scientific", label: "Scientific", icon: FlaskConical },
  { id: "currency", label: "Currency", icon: DollarSign },
  { id: "unit", label: "Unit Converter", icon: Ruler },
];

export function Sidebar({ dark, setDark, history, mode, setMode }) {
  const toggle = () => {
    setDark(!dark);
    document.body.classList.toggle("light");
  };

  return (
    <div className={`${dark ? "bg-card-dark text-text-dark" : "bg-card-light text-text-light"} w-56 h-full flex flex-col p-4 gap-6 transition-all duration-300`}>

      {/* Modes */}
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Mode</p>
        <div className="flex flex-col gap-1">
          {modes.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setMode(id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer
                ${mode === id
                  ? "bg-accent text-white"
                  : dark ? "hover:bg-button-dark" : "hover:bg-button-light"
                }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className={`w-full h-px ${dark ? "bg-button-dark" : "bg-button-light"}`} />

      {/* History */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <Clock size={14} className="text-gray-500" />
          <p className="text-xs text-gray-500 uppercase tracking-widest">History</p>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1">
          {history.length === 0 ? (
            <p className="text-xs text-gray-500 text-center mt-4">No calculations yet</p>
          ) : (
            [...history].reverse().map((item, i) => (
              <div
                key={i}
                className={`${dark ? "bg-button-dark" : "bg-button-light"} rounded-xl px-3 py-2 text-right`}
              >
                <div
                  className="text-xs text-gray-500"
                  dangerouslySetInnerHTML={{ __html: item.expression }}
                />
                <div className="text-sm font-semibold text-accent">{item.result}</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Divider */}
      <div className={`w-full h-px ${dark ? "bg-button-dark" : "bg-button-light"}`} />

      {/* Dark/Light toggle */}
      <button
        onClick={toggle}
        className={`${dark ? "bg-button-dark text-white" : "bg-button-light text-text-light"} text-xs px-4 py-2 rounded-full cursor-pointer transition-all duration-300 w-full`}
      >
        {dark ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

    </div>
  );
}