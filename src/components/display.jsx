export function Display({ dark, value, isRad }) {
  const formatDisplay = (val) => {
    if (!val) return "0";
    let result = String(val);
    result = result.replace(/Math\.sin\(([^)]*)\)/g, "sin($1)");
    result = result.replace(/Math\.cos\(([^)]*)\)/g, "cos($1)");
    result = result.replace(/Math\.tan\(([^)]*)\)/g, "tan($1)");
    result = result.replace(/Math\.log10\(([^)]*)\)/g, "log($1)");
    result = result.replace(/Math\.log\(([^)]*)\)/g, "ln($1)");
    result = result.replace(/Math\.sqrt\(([^)]*)\)/g, "√($1)");
    result = result.replace(/Math\.PI/g, "π");
    result = result.replace(/Math\.E/g, "e");
    result = result.replace(/\*\*/g, "^");
    result = result.replace(/(\w+)\^(\w+)/g, "$1<sup>$2</sup>");
    result = result.replace(/\*(?![^<]*>)/g, "×");
    result = result.replace(/\/(?![^<]*\/?>)/g, "÷");
    return result;
  };

  return (
    <div className="px-2 pt-4 pb-2 text-right">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-500">{isRad ? "RAD" : "DEG"}</span>
      </div>
      <div
        className={`text-5xl font-bold break-all leading-tight ${dark ? "text-text-dark" : "text-text-light"}`}
        dangerouslySetInnerHTML={{ __html: formatDisplay(value) }}
      />
    </div>
  );
}