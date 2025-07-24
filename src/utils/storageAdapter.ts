import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Storage adapter that works with both MMKV (bare RN) and AsyncStorage (Expo Go)
 * Provides a consistent interface regardless of the underlying storage mechanism
 */

// Check if MMKV is available
let MMKV: any = null;
let isMMKVAvailable = false;

try {
  MMKV = require('react-native-mmkv').MMKV;
  isMMKVAvailable = true;
} catch (error) {
  // MMKV not available (likely Expo Go), fall back to AsyncStorage
  if (__DEV__) {
    console.log('MMKV not available, using AsyncStorage fallback');
  }
}

// Storage interface
interface StorageInterface {
  getItem: (key: string) => string | null | Promise<string | null>;
  setItem: (key: string, value: string) => void | Promise<void>;
  removeItem: (key: string) => void | Promise<void>;
  clearAll?: () => void | Promise<void>;
  getString: (key: string) => string | null | Promise<string | null>;
  getNumber: (key: string) => number | Promise<number>;
  getBoolean: (key: string) => boolean | Promise<boolean>;
  set: (key: string, value: string | number | boolean) => void | Promise<void>;
}

class MMKVAdapter implements StorageInterface {
  private storage: any;

  constructor() {
    if (!isMMKVAvailable || !MMKV) {
      throw new Error('MMKV not available');
    }

    // Generate a secure encryption key
    const generateEncryptionKey = (): string => {
      const timestamp = Date.now().toString();
      const random = Math.random().toString(36).substring(2);
      const packageId = 'lights-out-puzzle-game';
      return `${packageId}-${timestamp}-${random}`;
    };

    // Get or create encryption key
    const getEncryptionKey = (): string => {
      const keyStorage = new MMKV({ id: 'encryption-key-store' });
      let key = keyStorage.getString('encryption_key');
      
      if (!key) {
        key = generateEncryptionKey();
        keyStorage.set('encryption_key', key);
      }
      
      return key;
    };

    this.storage = new MMKV({
      id: 'lights-out-game',
      encryptionKey: getEncryptionKey(),
    });
  }

  getItem(key: string): string | null {
    return this.storage.getString(key) || null;
  }

  setItem(key: string, value: string): void {
    this.storage.set(key, value);
  }

  removeItem(key: string): void {
    this.storage.delete(key);
  }

  clearAll(): void {
    this.storage.clearAll();
  }

  getString(key: string): string | null {
    return this.storage.getString(key) || null;
  }

  getNumber(key: string): number {
    return this.storage.getNumber(key) || 0;
  }

  getBoolean(key: string): boolean {
    return this.storage.getBoolean(key) || false;
  }

  set(key: string, value: string | number | boolean): void {
    this.storage.set(key, value);
  }
}

class AsyncStorageAdapter implements StorageInterface {
  async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      if (__DEV__) {
        console.error('AsyncStorage getItem error:', error);
      }
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      if (__DEV__) {
        console.error('AsyncStorage setItem error:', error);
      }
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      if (__DEV__) {
        console.error('AsyncStorage removeItem error:', error);
      }
    }
  }

  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      if (__DEV__) {
        console.error('AsyncStorage clear error:', error);
      }
    }
  }

  async getString(key: string): Promise<string | null> {
    return this.getItem(key);
  }

  async getNumber(key: string): Promise<number> {
    try {
      const value = await this.getItem(key);
      return value ? parseFloat(value) : 0;
    } catch (error) {
      return 0;
    }
  }

  async getBoolean(key: string): Promise<boolean> {
    try {
      const value = await this.getItem(key);
      return value === 'true';
    } catch (error) {
      return false;
    }
  }

  async set(key: string, value: string | number | boolean): Promise<void> {
    await this.setItem(key, String(value));
  }
}

// Create storage instance
let storageInstance: StorageInterface;

if (isMMKVAvailable) {
  try {
    storageInstance = new MMKVAdapter();
    if (__DEV__) {
      console.log('Using MMKV storage (encrypted)');
    }
  } catch (error) {
    if (__DEV__) {
      console.log('MMKV initialization failed, falling back to AsyncStorage');
    }
    storageInstance = new AsyncStorageAdapter();
  }
} else {
  storageInstance = new AsyncStorageAdapter();
  if (__DEV__) {
    console.log('Using AsyncStorage (Expo Go compatibility)');
  }
}

export const storage = storageInstance;
export const isUsingMMKV = isMMKVAvailable && storageInstance instanceof MMKVAdapter;