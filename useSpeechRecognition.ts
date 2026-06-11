import { useState, useRef, useEffect } from 'react';

interface UseSpeechRecognitionProps {
  onTranscript: (transcript: string) => void;
  onTriggerInfo: (title: string, message: string) => void;
}

export function useSpeechRecognition({ onTranscript, onTriggerInfo }: UseSpeechRecognitionProps) {
  const [isListening, setIsListening] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const startListening = async () => {
    const hasCompat = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    if (!hasCompat) {
      onTriggerInfo(
        'SPEECH UNSUPPORTED',
        'Web Speech API is not supported in this browser. Please use Google Chrome, Safari, or Microsoft Edge.'
      );
      setIsListening(false);
      return;
    }

    // Step 1: Query permission status if available
    if (navigator.permissions && navigator.permissions.query) {
      try {
        const status = await navigator.permissions.query({ name: 'microphone' as any });
        if (status.state === 'denied') {
          onTriggerInfo(
            'MICROPHONE ACCESS REJECTED',
            'Please allow microphone access permission in your browser address bar settings.'
          );
          setIsListening(false);
          return;
        }
      } catch (e) {
        console.warn('Navigator permissions query skipped or un-supported:', e);
      }
    }

    // Step 2: Request microphone access stream to trigger explicit system prompt cleanly and prevent crashes
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Release mic resources instantly
        stream.getTracks().forEach(track => {
          try { track.stop(); } catch (err) {}
        });
      } catch (mediaErr: any) {
        console.warn('Microphone stream access denied by user or device:', mediaErr);
        onTriggerInfo(
          'MICROPHONE ACCESS REJECTED',
          'Access to microphone was declined or unavailable. Falling back to manual text input.'
        );
        setIsListening(false);
        return;
      }
    }

    // Step 3: Run Speech Recognition
    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        onTriggerInfo('SPEAK NOW', 'Web Speech API activated. Speak your target global Email or Phone number now.');
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          onTriggerInfo(
            'MICROPHONE ACCESS REJECTED',
            'Please allow microphone access permission in your browser address bar.'
          );
        } else if (event.error !== 'aborted') {
          onTriggerInfo('VOICE COMMAND CANCELLED', `Voice capture did not complete cleanly: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onresult = (event: any) => {
        const resultText = event.results[0][0].transcript;
        if (resultText) {
          let cleanText = resultText.trim().replace(/\s+/g, '');
          // Clean common spoken characters
          cleanText = cleanText
            .replace(/atgmail\.com$/i, '@gmail.com')
            .replace(/atgmil\.com$/i, '@gmail.com')
            .replace(/atgmaildotcom$/i, '@gmail.com')
            .replace(/at/i, '@')
            .replace(/dotcom$/i, '.com')
            .replace(/dot/g, '.');

          onTranscript(cleanText);
          onTriggerInfo('TRANSCRIPTION LOCKED', `Detected input: "${cleanText}"`);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Speech Recognition initiation error:', err);
      setIsListening(false);
      onTriggerInfo('ERR_MIC_INIT', 'Failed to initialize the system speech capture interface.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return {
    isListening,
    startListening,
    stopListening,
    toggleListening,
  };
}
