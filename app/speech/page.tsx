"use client";
import "regenerator-runtime/runtime";

import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

export default function LoginPage() {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  return (
    <div className="flex flex-col h-full w-full items-center gap-5">
      <div className="flex justify-between items-center py-2 p-4 h-20 bg-black border-b w-full">
        <h1 className="flex items-center text-2xl font-semibold text-white">
          Group Chat Application
        </h1>
      </div>
      <div>
        <p>Microphone: {listening ? "on" : "off"}</p>
        <button
          onClick={() => {
            SpeechRecognition.startListening({ continuous: true });
          }}
        >
          Start
        </button>
        <button onClick={SpeechRecognition.stopListening}>Stop</button>
        <button onClick={resetTranscript}>Reset</button>
        <p>{transcript}</p>
      </div>
    </div>
  );
}
