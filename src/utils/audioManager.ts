import { Audio } from 'expo-av';
import { getSettings } from './storage';

interface SoundCache {
  [key: string]: Audio.Sound | null;
}

class AudioManager {
  private soundCache: SoundCache = {};
  private isInitialized = false;
  private isEnabled = true;

  /**
   * Initialize the audio system
   * Should be called once when the app starts
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Configure audio session for mobile
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      // Load sound setting from storage
      const settings = await getSettings();
      this.isEnabled = settings.soundEnabled;

      // Preload all sound effects
      await this.preloadSounds();
      
      this.isInitialized = true;
      
      if (__DEV__) {
        console.log('🔊 AudioManager initialized:', {
          isEnabled: this.isEnabled,
          soundsLoaded: Object.keys(this.soundCache).length
        });
      }
    } catch (error) {
      console.error('❌ Failed to initialize AudioManager:', error);
    }
  }

  /**
   * Preload all sound effects into memory
   */
  private async preloadSounds(): Promise<void> {
    const soundFiles = {
      cellTap: require('../../assets/sounds/cell-tap.wav'),
      victory: require('../../assets/sounds/victory.wav'),
    };

    const loadPromises = Object.entries(soundFiles).map(async ([key, source]) => {
      try {
        const { sound } = await Audio.Sound.createAsync(source, {
          shouldPlay: false,
          isLooping: false,
          volume: 0.7, // Default volume
        });
        
        this.soundCache[key] = sound;
        
        if (__DEV__) {
          console.log(`🔊 Loaded sound: ${key}`);
        }
      } catch (error) {
        console.error(`❌ Failed to load sound ${key}:`, error);
        this.soundCache[key] = null;
      }
    });

    await Promise.all(loadPromises);
  }

  /**
   * Play a sound effect by name
   */
  async playSound(soundName: keyof SoundCache, volume: number = 0.7): Promise<void> {
    if (!this.isEnabled || !this.isInitialized) {
      return;
    }

    const sound = this.soundCache[soundName];
    if (!sound) {
      if (__DEV__) {
        console.warn(`⚠️ Sound not found or failed to load: ${soundName}`);
      }
      return;
    }

    try {
      // Set volume and play
      await sound.setVolumeAsync(volume);
      await sound.replayAsync();
      
      if (__DEV__) {
        console.log(`🔊 Playing sound: ${soundName} (volume: ${volume})`);
      }
    } catch (error) {
      console.error(`❌ Failed to play sound ${soundName}:`, error);
    }
  }

  /**
   * Play cell tap sound
   */
  async playCellTap(): Promise<void> {
    await this.playSound('cellTap', 0.6);
  }

  /**
   * Play victory sound
   */
  async playVictory(): Promise<void> {
    await this.playSound('victory', 0.8);
  }

  /**
   * Enable or disable sound effects
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    
    if (__DEV__) {
      console.log(`🔊 Audio ${enabled ? 'enabled' : 'disabled'}`);
    }
  }

  /**
   * Get current enabled state
   */
  getEnabled(): boolean {
    return this.isEnabled;
  }

  /**
   * Set volume for all sounds (0.0 to 1.0)
   */
  async setGlobalVolume(volume: number): Promise<void> {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    
    const volumePromises = Object.values(this.soundCache).map(async (sound) => {
      if (sound) {
        try {
          await sound.setVolumeAsync(clampedVolume);
        } catch (error) {
          console.error('❌ Failed to set volume:', error);
        }
      }
    });

    await Promise.all(volumePromises);
    
    if (__DEV__) {
      console.log(`🔊 Global volume set to: ${clampedVolume}`);
    }
  }

  /**
   * Clean up all loaded sounds
   * Should be called when the app is being destroyed
   */
  async cleanup(): Promise<void> {
    const unloadPromises = Object.entries(this.soundCache).map(async ([key, sound]) => {
      if (sound) {
        try {
          await sound.unloadAsync();
          if (__DEV__) {
            console.log(`🔊 Unloaded sound: ${key}`);
          }
        } catch (error) {
          console.error(`❌ Failed to unload sound ${key}:`, error);
        }
      }
    });

    await Promise.all(unloadPromises);
    this.soundCache = {};
    this.isInitialized = false;
    
    if (__DEV__) {
      console.log('🔊 AudioManager cleaned up');
    }
  }
}

// Create and export singleton instance
export const audioManager = new AudioManager();

// Export convenience functions
export const GameAudio = {
  initialize: () => audioManager.initialize(),
  playCellTap: () => audioManager.playCellTap(),
  playVictory: () => audioManager.playVictory(),
  setEnabled: (enabled: boolean) => audioManager.setEnabled(enabled),
  getEnabled: () => audioManager.getEnabled(),
  setGlobalVolume: (volume: number) => audioManager.setGlobalVolume(volume),
  cleanup: () => audioManager.cleanup(),
};