import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yar.relationship',
  appName: 'Yar',
  webDir: 'dist',
  android: {
    backgroundColor: '#f5f7fc',
    allowMixedContent: true,
    // Keeps the WebView below the status bar and above the navigation/gesture bar
    // so the clock, battery and signal icons are never covered by the app UI.
    adjustMarginsForEdgeToEdge: 'force',
  },
};

export default config;
