// Drop the user's original recording here; absent recordings produce no network request.
const recordings = import.meta.glob('./clips/shanshenbu.{mp3,wav,ogg,m4a}', {
  eager: true, query: '?url', import: 'default',
});
export const DODGE_VOICE_KEY = 'xiaoqian-dodge-voice';
export const DODGE_VOICE_URL = Object.entries(recordings).sort(([a], [b]) => a.localeCompare(b))[0]?.[1];

export default class DodgeVoice {
  constructor(scene) {
    this.scene = scene;
    this.lastPlayed = -Infinity;
    this.utterance = null;
  }

  play() {
    if (this.scene.time.now - this.lastPlayed < 650) return;
    this.lastPlayed = this.scene.time.now;
    if (this.scene.cache.audio.exists(DODGE_VOICE_KEY)) {
      if (!this.sound) this.sound = this.scene.sound.add(DODGE_VOICE_KEY, { volume: 0.85 });
      if (!this.sound.isPlaying) this.sound.play();
      return;
    }
    if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') return;
    // Browser voice only: never copy the meme video's recording or imitate its speaker.
    if (this.utterance) return;
    const utterance = new SpeechSynthesisUtterance('閃身步');
    utterance.lang = 'zh-TW';
    utterance.rate = 1.35;
    utterance.volume = 0.8;
    const voice = window.speechSynthesis.getVoices().find(v => /^zh[-_]TW/i.test(v.lang))
      ?? window.speechSynthesis.getVoices().find(v => /^zh/i.test(v.lang));
    if (voice) utterance.voice = voice;
    const done = () => { if (this.utterance === utterance) this.utterance = null; };
    utterance.onend = done;
    utterance.onerror = done;
    this.utterance = utterance;
    try { window.speechSynthesis.speak(utterance); } catch { done(); }
  }

  destroy() {
    this.sound?.destroy();
    if (this.utterance) window.speechSynthesis?.cancel();
    this.utterance = null;
    this.scene = null;
  }
}
