import { Capacitor } from '@capacitor/core';

/**
 * Paints the Android status bar to match the app theme so the clock / battery /
 * signal icons stay readable and never sit on top of the app UI.
 * No-ops on the web build.
 */
export async function applySystemBars(darkMode: boolean): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  try {
    const { StatusBar, Style } = await import('@capacitor/status-bar');
    await StatusBar.setStyle({ style: darkMode ? Style.Dark : Style.Light });
    await StatusBar.setBackgroundColor({ color: darkMode ? '#0B0F19' : '#F5F7FC' });
  } catch {
    // Plugin unavailable (e.g. web preview) - safe to ignore.
  }
}
