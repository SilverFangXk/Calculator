import { Button } from "./button";

export function Layer({ value, dark, onPress, scientific, isRad }) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {value.map((x) => (
        <Button key={x} value={x} dark={dark} onPress={onPress} scientific={scientific} isRad={isRad} />
      ))}
    </div>
  );
}