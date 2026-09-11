import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yar.relationship',
  appName: 'Yar',
  webDir: 'dist',
  android: {
    backgroundColor: '#f7efe6',
    allowMixedContent: true,
  },
};

export default config;
