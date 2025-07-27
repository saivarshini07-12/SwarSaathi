import React, { useEffect, useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { MurfService } from '../services/MurfService';

const VoiceAssistant: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const { currentLanguage, t } = useLanguage();

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = currentLanguage.code;

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
        
        if (transcript.includes('hello sakhi') || transcript.includes('hello swarathi')) {
          handleVoiceCommand(transcript);
        }
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        if (isListening) {
          recognitionInstance.start(); // Restart listening
        }
      };

      setRecognition(recognitionInstance);
    }
  }, [currentLanguage, isListening]);

  const handleVoiceCommand = async (command: string) => {
    // Process voice commands
    let response = '';

    if (command.includes('medicine') || command.includes('medication')) {
      response = 'Opening medicine reminders for you.';
    } else if (command.includes('news')) {
      response = 'Let me get the latest news for you.';
    } else if (command.includes('mood') || command.includes('feeling')) {
      response = 'How are you feeling today? I can help improve your mood.';
    } else if (command.includes('meditate') || command.includes('meditation')) {
      response = 'Starting a calming meditation session for you.';
    } else if (command.includes('emergency')) {
      response = 'I can help you with emergency contacts. Stay safe.';
    } else {
      response = 'Hello! I am SwarSaathi, your caring voice assistant. How can I help you today?';
    }

    // Use Murf API to speak the response
    await MurfService.playText(response, currentLanguage.code);
  };

  const toggleListening = () => {
    if (recognition) {
      if (isListening) {
        recognition.stop();
        setIsListening(false);
      } else {
        recognition.start();
        setIsListening(true);
      }
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={toggleListening}
        className={`p-4 rounded-full shadow-lg transition-all duration-300 ${
          isListening
            ? 'bg-red-500 hover:bg-red-600 animate-pulse'
            : 'bg-blue-500 hover:bg-blue-600'
        } text-white`}
        title={isListening ? 'Stop listening' : 'Start voice assistant'}
      >
        {isListening ? <MicOff size={24} /> : <Mic size={24} />}
      </button>
      
      {isListening && (
        <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-lg p-3 whitespace-nowrap">
          <p className="text-sm text-gray-600">Listening... Say "Hello Sakhi"</p>
        </div>
      )}
    </div>
  );
};

// Extend Window interface for speech recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default VoiceAssistant;