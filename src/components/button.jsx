import { Delete } from "lucide-react";

export function Button({ value, dark, onPress, scientific, isRad }) {
  const isEqual = value === "=";
  const isOperator = ["/", "*", "-", "+"].includes(value);
  const isDelete = value === "delete";
  const isRadBtn = value === "rad";
  const isDegBtn = value === "deg";
  const isActiveRadDeg = (isRadBtn && isRad) || (isDegBtn && !isRad);

  const bg = isEqual
    ? "bg-accent shadow-lg shadow-accent/40"
    : isActiveRadDeg
    ? "bg-accent"
    : isRadBtn || isDegBtn
    ? dark ? "bg-button-dark/40" : "bg-button-light"
    : scientific
    ? dark ? "bg-button-dark/60" : "bg-button-light/60"
    : isOperator
    ? dark ? "bg-operator-dark" : "bg-operator-light"
    : dark ? "bg-button-dark" : "bg-button-light";

  const text = isEqual
    ? "text-white text-lg"
    : isActiveRadDeg
    ? "text-white text-xs"
    : isRadBtn || isDegBtn
    ? "text-gray-400 text-xs"
    : scientific
    ? dark ? "text-text-dark text-xs" : "text-text-light text-xs"
    : isOperator
    ? "text-accent text-base"
    : dark ? "text-text-dark text-base" : "text-text-light text-base";

  const height = scientific ? "h-10" : "h-12";

  return (
    <button
      onClick={() => onPress(value)}
      className={`${bg} ${text} ${height} w-full rounded-xl font-semibold cursor-pointer transition-all duration-150 active:scale-95 flex items-center justify-center`}
    >
      {isDelete ? <Delete size={16} /> : value}
    </button>
  );
}