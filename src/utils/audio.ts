// Audio completely disabled per user preference ("không cần âm thanh. chỉ cần hiệu ứng là đủ")
class SoundEffects {
  public setMuted(_muted: boolean) {}
  public getMuted(): boolean { return true; }
  public toggleMute(): boolean { return true; }
  public playClick() {}
  public playCorrect() {}
  public playWrong() {}
  public playVictory() {}
}

export const sounds = new SoundEffects();
