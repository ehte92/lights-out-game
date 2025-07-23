import * as Haptics from 'expo-haptics';
import { getSettings } from './simpleStorage';

/**
 * Haptic feedback patterns for different game events
 */
export class GameHaptics {
  private static async isEnabled(): Promise<boolean> {
    const settings = await getSettings();
    return settings.hapticsEnabled;
  }

  /**
   * Light tap for cell selection
   */
  static async cellTap(): Promise<void> {
    if (!(await this.isEnabled())) return;
    
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.warn('Haptic feedback failed:', error);
    }
  }

  /**
   * Medium impact for successful moves
   */
  static async moveSuccess(): Promise<void> {
    if (!(await this.isEnabled())) return;
    
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      console.warn('Haptic feedback failed:', error);
    }
  }

  /**
   * Heavy impact for completing a puzzle
   */
  static async puzzleComplete(): Promise<void> {
    if (!(await this.isEnabled())) return;
    
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.warn('Haptic feedback failed:', error);
    }
  }

  /**
   * Error feedback for invalid moves or failures
   */
  static async error(): Promise<void> {
    if (!(await this.isEnabled())) return;
    
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch (error) {
      console.warn('Haptic feedback failed:', error);
    }
  }

  /**
   * Warning feedback for hints or important actions
   */
  static async warning(): Promise<void> {
    if (!(await this.isEnabled())) return;
    
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch (error) {
      console.warn('Haptic feedback failed:', error);
    }
  }

  /**
   * Selection feedback for menu navigation
   */
  static async selection(): Promise<void> {
    if (!(await this.isEnabled())) return;
    
    try {
      await Haptics.selectionAsync();
    } catch (error) {
      console.warn('Haptic feedback failed:', error);
    }
  }

  /**
   * Victory sequence - multiple haptics for celebration
   */
  static async victorySequence(): Promise<void> {
    if (!(await this.isEnabled())) return;
    
    try {
      // Quick success burst
      await this.puzzleComplete();
      
      // Small delay then another celebration
      setTimeout(async () => {
        if (await this.isEnabled()) {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        }
      }, 200);
      
      setTimeout(async () => {
        if (await this.isEnabled()) {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
      }, 400);
    } catch (error) {
      console.warn('Haptic victory sequence failed:', error);
    }
  }

  /**
   * Button press feedback for UI elements
   */
  static async buttonPress(): Promise<void> {
    if (!(await this.isEnabled())) return;
    
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.warn('Haptic feedback failed:', error);
    }
  }

  /**
   * Achievement unlock feedback
   */
  static async achievementUnlock(): Promise<void> {
    if (!(await this.isEnabled())) return;
    
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Follow up with impact for emphasis
      setTimeout(async () => {
        if (await this.isEnabled()) {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        }
      }, 150);
    } catch (error) {
      console.warn('Haptic achievement feedback failed:', error);
    }
  }
}