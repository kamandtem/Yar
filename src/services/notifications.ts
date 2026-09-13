import { Capacitor } from '@capacitor/core';
import { LocalNotifications, type LocalNotificationSchema } from '@capacitor/local-notifications';
import { getDailyQuotePair, toLocalDateKey } from '../data/dailyQuotes';

const CHANNEL_ID = 'yar-daily-care';
const SCHEDULE_DAYS = 21;
const ID_BASE = 710000;
export type NotificationPermissionState = 'native-only' | 'prompt' | 'granted' | 'denied';
const notificationId = (date: Date, slot: 0 | 1) => ID_BASE + (Number(toLocalDateKey(date).replaceAll('-', '')) % 100000) * 2 + slot;
const atTime = (date: Date, hour: number, minute: number) => { const value = new Date(date); value.setHours(hour, minute, 0, 0); return value; };

export async function getNotificationPermission(): Promise<NotificationPermissionState> {
  if (!Capacitor.isNativePlatform()) return 'native-only';
  const permission = await LocalNotifications.checkPermissions();
  if (permission.display === 'granted') return 'granted';
  if (permission.display === 'denied') return 'denied';
  return 'prompt';
}

export async function scheduleDailyQuotes() {
  if (!Capacitor.isNativePlatform()) return false;
  const permission = await LocalNotifications.checkPermissions();
  if (permission.display !== 'granted') return false;
  if (Capacitor.getPlatform() === 'android') await LocalNotifications.createChannel({ id: CHANNEL_ID, name: 'دو جمله روزانه یار', description: 'دو یادآوری کوتاه برای توجه و گفت‌وگوی بهتر', importance: 4, visibility: 1, vibration: true });
  const now = new Date();
  const notifications: LocalNotificationSchema[] = [];
  for (let offset = 0; offset < SCHEDULE_DAYS; offset += 1) {
    const day = new Date(now); day.setDate(now.getDate() + offset);
    const pair = getDailyQuotePair(day);
    const morningAt = atTime(day, 10, 0), eveningAt = atTime(day, 20, 30);
    const morningId = notificationId(day, 0), eveningId = notificationId(day, 1);
    if (morningAt > now) notifications.push({ id: morningId, title: 'جمله صبح | تلنگر روز', body: pair.morning, schedule: { at: morningAt }, channelId: CHANNEL_ID, extra: { target: 'home', kind: 'morning-quote' } });
    if (eveningAt > now) notifications.push({ id: eveningId, title: 'جمله شب | تلنگر روز', body: pair.evening, schedule: { at: eveningAt }, channelId: CHANNEL_ID, extra: { target: 'home', kind: 'evening-quote' } });
  }
  const pending = await LocalNotifications.getPending();
  const existing = pending.notifications.filter(item => item.id >= ID_BASE && item.id < 1000000).map(item => ({ id: item.id }));
  if (existing.length) await LocalNotifications.cancel({ notifications: existing });
  if (notifications.length) await LocalNotifications.schedule({ notifications });
  return true;
}

export async function requestNotificationPermission() {
  if (!Capacitor.isNativePlatform()) return false;
  const result = await LocalNotifications.requestPermissions();
  if (result.display !== 'granted') return false;
  return scheduleDailyQuotes();
}
export async function disableDailyQuotes() {
  if (!Capacitor.isNativePlatform()) return;
  const pending = await LocalNotifications.getPending();
  const ours = pending.notifications.filter(item => item.id >= ID_BASE && item.id < 1000000).map(item => ({ id: item.id }));
  if (ours.length) await LocalNotifications.cancel({ notifications: ours });
}
export function listenForNotificationNavigation(onNavigate: (target: 'home' | 'couple' | 'cycle') => void) {
  if (!Capacitor.isNativePlatform()) return () => undefined;
  const listener = LocalNotifications.addListener('localNotificationActionPerformed', event => {
    const target = event.notification.extra?.target;
    if (target === 'home' || target === 'couple' || target === 'cycle') onNavigate(target);
  });
  return () => { void listener.then(handle => handle.remove()); };
}
