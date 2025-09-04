export interface GroundingChunk {
  web?: {
    // Fix: Make `uri` and `title` optional to align with the @google/genai GroundingChunk type.
    // This resolves a type incompatibility error in App.tsx.
    uri?: string;
    title?: string;
  };
}
export interface Message {
  id: string;
  text: string; // Raw text from user or markdown from AI
  html: string; // Sanitized HTML for rendering
  sender: 'user' | 'ai';
  groundingChunks?: GroundingChunk[];
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
}


// Fix: Add global type definitions for the Web Speech API to resolve errors in App.tsx.
// The SpeechRecognition API is experimental and its types are not included in TypeScript's default DOM library.
declare global {
  interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    onresult: (event: SpeechRecognitionEvent) => void;
    onend: () => void;
    onerror: (event: SpeechRecognitionErrorEvent) => void;
  }

  var SpeechRecognition: {
    prototype: SpeechRecognition;
    new (): SpeechRecognition;
  };

  var webkitSpeechRecognition: {
    prototype: SpeechRecognition;
    new (): SpeechRecognition;
  };

  interface SpeechRecognitionEvent extends Event {
    readonly resultIndex: number;
    readonly results: SpeechRecognitionResultList;
  }

  interface SpeechRecognitionResultList {
    readonly length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
  }

  interface SpeechRecognitionResult {
    readonly isFinal: boolean;
    readonly length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
  }

  interface SpeechRecognitionAlternative {
    readonly transcript: string;
  }

  interface SpeechRecognitionErrorEvent extends Event {
    readonly error: string;
  }
}