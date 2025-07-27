const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export class MurfService {
  static async playText(text: string, voiceId?: string) {
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
      throw new Error(data?.error || `HTTP ${res.status}`);
    }
    if (!data?.audioUrl) {
      throw new Error('audioUrl not received from backend');
    }

    const audio = new Audio(data.audioUrl);
    await audio.play();
  }
}
