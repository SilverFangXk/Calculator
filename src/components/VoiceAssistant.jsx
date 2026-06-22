import { MdKeyboardVoice, MdAutoAwesome } from 'react-icons/md';
import { CiMicrophoneOn } from "react-icons/ci";
export function VoiceAssistant({ isListening, onToggle, dark }) {
  return (
    <button
      onClick={() => {
        console.log("BUTTON CLICKED");
        onToggle();
      }}
      className={`fixed bottom-8 right-8 w-16 h-16 flex items-center justify-center transition-all duration-300 z-[9999] shadow-2xl border-2 
        ${dark ? 'bg-card-dark border-transparent' : 'bg-card-light border-transparent'}
        rounded-[var(--radius-calculator)]
        ${isListening
          ? 'bg-accent shadow-[0_0_30px_var(--color-accent)] animate-pulse scale-110'
          : 'hover:scale-105'
        }`}
      aria-label="Toggle Voice Assistant"
    >
      <span className={`text-2xl ${dark ? 'text-white' : 'text-black'}`}>
        {isListening ? <CiMicrophoneOn /> : <MdAutoAwesome />}
      </span>
    </button>
  );
}