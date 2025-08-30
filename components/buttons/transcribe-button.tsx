
import "regenerator-runtime/runtime";
import { LoaderCircle, Mic, Save, X } from "lucide-react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition"
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";

interface TranscribeButtonProps {
  onTranscriptChange: (transcript: string) => void;
  onListeningChange: (listening: boolean) => void;
  onTranscriptAbort: () => void;
  disabled?: boolean;
}

export function TranscribeButton({
  onTranscriptChange,
  onListeningChange,
  onTranscriptAbort,
  disabled = false
}: TranscribeButtonProps) {
  const {
    transcript,
    resetTranscript,
    listening,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const previousListeningRef = useRef<boolean>(false);
  // Notify parent component when listening state changes
  useEffect(() => {
    onListeningChange(listening);
  }, [listening, onListeningChange]);

  const lastSentTranscriptRef = useRef<string>('');
  // Send only the incremental/new part of the transcript for real-time updates
  useEffect(() => {
    if (transcript && transcript !== lastSentTranscriptRef.current && listening) {
      // Get only the new part that hasn't been sent yet
      const newPortion = transcript.slice(lastSentTranscriptRef.current.length);
      if (newPortion.trim()) {
        onTranscriptChange(newPortion);
        lastSentTranscriptRef.current = transcript;
      }
    }
    
    // Reset tracking when transcription stops
    if (previousListeningRef.current && !listening) {
      lastSentTranscriptRef.current = '';
      resetTranscript();
    }
    
    previousListeningRef.current = listening;
  }, [transcript, listening, onTranscriptChange, resetTranscript]);

  const startListening = () => {
    if (!listening) {
      SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
    }
  };

  const stopListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    }
  };

  const abortListening = () => {
    if (listening) {
      SpeechRecognition.abortListening();
      resetTranscript();
      onTranscriptChange('');
      onTranscriptAbort();
    }
  };

  useEffect(() => {
    return () => {
      if (listening) {
        SpeechRecognition.stopListening();
      }
    };
  }, [listening]);

  if (!browserSupportsSpeechRecognition) {
    return (
      <TooltipWrapper content="Speech recognition not supported" side="top">
        <Button variant="ghost" size="icon" disabled>
          <Mic className="h-4 w-4" />
          <span className="sr-only">Speech recognition not supported</span>
        </Button>
      </TooltipWrapper>
    );
  }

  if (listening) {
    return (
      <div className="flex items-center gap-1">
        <TooltipWrapper content="Save Transcription" side="top">
          <Button
            variant="ghost"
            size="icon"
            onClick={ stopListening }
            disabled={ disabled }
          >
            <Save className="text-green-500" />
            <span className="sr-only">Save Transcription</span>
          </Button>
        </TooltipWrapper>
        
        <TooltipWrapper content="Cancel Transcription" side="top">
          <Button
            variant="ghost"
            size="icon"
            onClick={ abortListening }
            disabled={ disabled }
          >
            <X className="text-red-500" />
            <span className="sr-only">Cancel Transcription</span>
          </Button>
        </TooltipWrapper>

        <LoaderCircle className="animate-spin h-6 w-6 text-gray-500 mx-1" />
      </div>
    );
  }

  return (
    <TooltipWrapper content="Start Transcription" side="top">
      <Button
        variant="ghost"
        size="icon"
        onClick={ startListening }
        disabled={ disabled }
      >
        <Mic />
        <span className="sr-only">Start Transcription</span>
      </Button>
    </TooltipWrapper>
  )
}