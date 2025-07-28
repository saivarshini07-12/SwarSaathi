const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export class MurfService {
  // Fallback using Web Speech API
  private static async useFallbackTTS(text: string) {
    return new Promise<void>((resolve, reject) => {
      if ('speechSynthesis' in window) {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Configure voice settings
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        // Try to find an Indian English voice
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(voice => 
          voice.lang.includes('en-IN') || 
          voice.name.toLowerCase().includes('indian') ||
          voice.lang.includes('en-US')
        );
        
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
        
        utterance.onend = () => {
          console.log('✅ Fallback TTS completed');
          resolve();
        };
        
        utterance.onerror = (error) => {
          console.error('❌ Fallback TTS error:', error);
          reject(error);
        };
        
        console.log('🔊 Using Web Speech API fallback');
        window.speechSynthesis.speak(utterance);
      } else {
        reject(new Error('Speech synthesis not supported'));
      }
    });
  }

  static async playText(text: string, voiceId?: string) {
    try {
      // First try Murf API
      const res = await fetch(`${BASE_URL}/speak`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voiceId })
      });

      const raw = await res.text();
      let data: any;
      try { data = JSON.parse(raw); } catch { data = raw; }

      console.log('[frontend] /speak ->', res.status, data);

      if (!res.ok) {
        // If Murf API fails, use fallback
        if (res.status === 500 && data?.error?.includes('MURF_API_KEY')) {
          console.warn('⚠️  Murf API key not configured. Using Web Speech API fallback.');
          await this.useFallbackTTS(text);
          return;
        }
        throw new Error(data?.error || `HTTP ${res.status}`);
      }
      
      if (!data?.audioUrl) {
        console.warn('⚠️  No audioUrl from Murf. Using fallback.');
        await this.useFallbackTTS(text);
        return;
      }

      // Play Murf audio
      const audio = new Audio(data.audioUrl);
      await audio.play();
      console.log('✅ Murf TTS completed');
      
    } catch (error) {
      console.error('🔴 MurfService Error:', error);
      
      // Ultimate fallback
      try {
        console.log('🔄 Attempting Web Speech API fallback...');
        await this.useFallbackTTS(text);
      } catch (fallbackError) {
        console.error('❌ All TTS methods failed:', fallbackError);
        // Last resort: show text alert
        alert(`🗣️ Voice Message: "${text}"`);
      }
    }
  }
}
