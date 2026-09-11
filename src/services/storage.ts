import { UserPreferences, CheckinResult, RelationshipMemory } from '../types';

const STORAGE_KEYS = {
  PREFERENCES: 'yar_preferences',
  COMPLETED_ARTICLES: 'yar_completed_articles',
  COMPLETED_EXERCISES: 'yar_completed_exercises',
  COMPLETED_STAGES: 'yar_completed_stages',
  COMPLETED_QUESTIONS: 'yar_completed_questions',
  FAVORITES: 'yar_favorites',
  CHECKIN_HISTORY: 'yar_checkin_history',
  MEMORIES: 'yar_memories',
  WEEKLY_DATES: 'yar_weekly_dates',
  STREAK: 'yar_streak',
  NOTES: 'yar_exercise_notes'
};

const DEFAULT_PREFERENCES: UserPreferences = {
  hasCompletedOnboarding: false,
  relationshipStage: undefined,
  priorityTopics: [],
  userName: '',
  partnerName: '',
  anniversaryDate: '',
  darkMode: false,
  fontSize: 'normal',
  notificationsEnabled: true
};

export const StorageService = {
  getPreferences(): UserPreferences {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      return data ? { ...DEFAULT_PREFERENCES, ...JSON.parse(data) } : DEFAULT_PREFERENCES;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  },

  savePreferences(prefs: Partial<UserPreferences>): UserPreferences {
    const current = this.getPreferences();
    const updated = { ...current, ...prefs };
    try {
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updated));
    } catch (e) {
      console.error('Storage error', e);
    }
    return updated;
  },

  getCompletedArticles(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COMPLETED_ARTICLES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  toggleArticleCompleted(articleId: string): boolean {
    const list = this.getCompletedArticles();
    const exists = list.includes(articleId);
    const updated = exists ? list.filter(id => id !== articleId) : [...list, articleId];
    localStorage.setItem(STORAGE_KEYS.COMPLETED_ARTICLES, JSON.stringify(updated));
    this.updateStreak();
    return !exists;
  },

  getCompletedExercises(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COMPLETED_EXERCISES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  toggleExerciseCompleted(exerciseId: string): boolean {
    const list = this.getCompletedExercises();
    const exists = list.includes(exerciseId);
    const updated = exists ? list.filter(id => id !== exerciseId) : [...list, exerciseId];
    localStorage.setItem(STORAGE_KEYS.COMPLETED_EXERCISES, JSON.stringify(updated));
    this.updateStreak();
    return !exists;
  },

  getCompletedStages(journeyId: string): number[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COMPLETED_STAGES);
      const map = data ? JSON.parse(data) : {};
      return map[journeyId] || [];
    } catch {
      return [];
    }
  },

  toggleStageCompleted(journeyId: string, stageNumber: number): boolean {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COMPLETED_STAGES);
      const map: Record<string, number[]> = data ? JSON.parse(data) : {};
      const current = map[journeyId] || [];
      const exists = current.includes(stageNumber);
      map[journeyId] = exists ? current.filter(s => s !== stageNumber) : [...current, stageNumber];
      localStorage.setItem(STORAGE_KEYS.COMPLETED_STAGES, JSON.stringify(map));
      this.updateStreak();
      return !exists;
    } catch {
      return false;
    }
  },

  getFavorites(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  toggleFavorite(id: string): boolean {
    const list = this.getFavorites();
    const exists = list.includes(id);
    const updated = exists ? list.filter(item => item !== id) : [...list, id];
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updated));
    return !exists;
  },

  getCheckinHistory(): CheckinResult[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHECKIN_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveCheckin(result: CheckinResult): void {
    const history = this.getCheckinHistory();
    const withId = { ...result, id: result.id || `checkin-${Date.now()}` };
    const updated = [withId, ...history.filter(item => item.date !== result.date)];
    localStorage.setItem(STORAGE_KEYS.CHECKIN_HISTORY, JSON.stringify(updated));
    this.updateStreak();
  },

  getMemories(): RelationshipMemory[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MEMORIES);
      if (data) return JSON.parse(data);
    } catch {
      // fallback to initial memories
    }
    return [];
  },

  addMemory(memory: Omit<RelationshipMemory, 'id'>): RelationshipMemory {
    const memories = this.getMemories();
    const newMemory: RelationshipMemory = {
      ...memory,
      id: 'mem-' + Date.now()
    };
    const updated = [newMemory, ...memories];
    localStorage.setItem(STORAGE_KEYS.MEMORIES, JSON.stringify(updated));
    return newMemory;
  },

  deleteMemory(id: string): void {
    const memories = this.getMemories();
    const updated = memories.filter(m => m.id !== id);
    localStorage.setItem(STORAGE_KEYS.MEMORIES, JSON.stringify(updated));
  },

  getWeeklyDatesCompleted(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WEEKLY_DATES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  markWeeklyDateCompleted(id: string): void {
    const list = this.getWeeklyDatesCompleted();
    if (!list.includes(id)) {
      list.push(id);
      localStorage.setItem(STORAGE_KEYS.WEEKLY_DATES, JSON.stringify(list));
      this.updateStreak();
    }
  },

  getStreak(): { count: number; lastActiveDate: string } {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STREAK);
      return data ? JSON.parse(data) : { count: 0, lastActiveDate: '' };
    } catch {
      return { count: 0, lastActiveDate: '' };
    }
  },

  updateStreak(): void {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const current = this.getStreak();
      if (current.lastActiveDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const isConsecutive = current.lastActiveDate === yesterday.toISOString().slice(0, 10);
        const nextCount = isConsecutive ? current.count + 1 : 1;
        localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify({ count: nextCount, lastActiveDate: today }));
      }
    } catch {
      // ignore
    }
  },

  saveExerciseNote(exerciseId: string, note: string): void {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTES);
      const map = data ? JSON.parse(data) : {};
      map[exerciseId] = note;
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(map));
    } catch {
      // ignore
    }
  },

  getExerciseNote(exerciseId: string): string {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTES);
      const map = data ? JSON.parse(data) : {};
      return map[exerciseId] || '';
    } catch {
      return '';
    }
  }
};
