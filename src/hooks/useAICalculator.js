import { useState, useCallback } from "react";

const SYSTEM_PROMPT = `You are an AI assistant embedded inside a calculator app.
The user speaks to you via voice.

Respond with ONLY a valid JSON object — no markdown, no explanation, no backticks.

Choose ONE of these response shapes:

1. If the user wants to CALCULATE something:
{"action":"calculate","expression":"<valid JS math expression>"}
Use Math.sin, Math.cos, Math.tan, Math.sqrt, Math.log, Math.log10, Math.PI, Math.E, ** for power.
For trig in degrees: Math.sin(45*Math.PI/180)

2. If the user wants an EXPLANATION:
{"action":"explain","text":"<2-3 sentences max>"}

3. If the user asks for a FORMULA:
{"action":"formula","text":"<formula + brief explanation>","expression":"<JS expression or empty string>"}

Always respond in the same language the user spoke in (French or English).`;

export function useAICalculator() {
  const [aiResponse, setAiResponse] = useState(null);
  const [isThinking, setIsThinking] = useState(false);

  const askAI = useCallback(async (transcript, currentDisplay) => {
    setIsThinking(true);
    setAiResponse(null);

    const fullPrompt = `${SYSTEM_PROMPT}\n\nCalculator currently shows: "${currentDisplay}"\nUser said: "${transcript}"`;

    try {
      // Use Electron IPC — already set up in main.js
      const raw = await window.aiAPI.ask(fullPrompt);
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setAiResponse(parsed);
      return parsed;
    } catch (err) {
      console.error("AI error:", err);
      setAiResponse({ action: "explain", text: "Sorry, I couldn't process that. Try again." });
      return null;
    } finally {
      setIsThinking(false);
    }
  }, []);

  const clearResponse = useCallback(() => setAiResponse(null), []);

  return { askAI, aiResponse, isThinking, clearResponse };
}