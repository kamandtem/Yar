export * from './cycle';

export type RelationshipStage = 
  | 'engaged' 
  | 'newlywed' 
  | 'under_1_year' 
  | '1_to_3_years' 
  | 'over_3_years' 
  | 'solo';

export type PriorityTopic = 
  | 'communication' 
  | 'intimacy' 
  | 'conflict' 
  | 'trust' 
  | 'self_awareness' 
  | 'trauma' 
  | 'sexuality' 
  | 'family' 
  | 'finances' 
  | 'future' 
  | 'parenting';

export interface UserPreferences {
  hasCompletedOnboarding: boolean;
  relationshipStage?: RelationshipStage;
  priorityTopics: PriorityTopic[];
  partnerName?: string;
  userName?: string;
  anniversaryDate?: string;
  gender?: 'female' | 'male' | 'other' | 'prefer_not';
  darkMode: boolean;
  fontSize: 'normal' | 'large';
  notificationsEnabled: boolean;
}

export interface ArticleSource {
  author: string;
  bookOrStudy: string;
  insight: string;
}

export interface Article {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  summary: string;
  readingTime: number; // in minutes
  heroImage: string;
  content: {
    scenario: string;
    scientificInsight: string;
    keyTakeaway: string;
  };
  interactiveQuestion: {
    question: string;
    options: string[];
    reflectionPrompt: string;
  };
  exerciseSnippet: {
    title: string;
    instruction: string;
  };
  relatedContentIds: string[];
  sources: ArticleSource[];
  tags: string[];
}

export interface ExerciseStep {
  stepNumber: number;
  title: string;
  instruction: string;
  promptInput?: string;
  tip?: string;
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  duration: number; // minutes
  mode: 'couple' | 'solo' | 'both';
  category: string;
  safetyLevel: 'standard' | 'requires_calm' | 'caution_if_conflict';
  steps: ExerciseStep[];
  closingThought: string;
}

export interface JourneyStage {
  stageNumber: number;
  title: string;
  description: string;
  concept: string;
  reflection: string;
  durationMinutes: number;
  clinicalNote?: string;
  articleTitle?: string;
  articleId?: string;
  exerciseTitle?: string;
  exerciseId?: string;
  questionPrompt?: string;
}

export interface Journey {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  category: PriorityTopic;
  color: string;
  stages: JourneyStage[];
  estimatedDuration: string;
  estimatedWeeks?: string;
}

export interface DailyQuestion {
  id: string;
  question: string;
  context: string;
  category: string;
  couplePrompt: string;
}

export interface CheckinAxis {
  id: string;
  statement: string;
  category: string;
  tip: string;
}

export interface CoupleCheckin {
  id: string;
  title: string;
  description: string;
  axes: CheckinAxis[];
}

export interface CheckinResult {
  id?: string;
  date: string;
  intimacyScore?: number;
  energyLevel?: 'high' | 'medium' | 'low';
  currentNeed?: string;
  gratitudeNote?: string;
  scores?: Record<string, number>; // axisId -> 1 to 5
  strengths?: string[];
  attentionAreas?: string[];
  recommendations?: string[];
  partnerComparisonNote?: string;
}

export interface PerspectiveCase {
  id: string;
  title: string;
  category: string;
  situation: string;
  partnerA: {
    label: string;
    thought: string;
    underlyingFeeling: string;
    protectiveStrategy: string;
  };
  partnerB: {
    label: string;
    thought: string;
    underlyingFeeling: string;
    protectiveStrategy: string;
  };
  yarInsight: string;
  healthyBridge: string;
}

export interface WeeklyDate {
  id: string;
  title: string;
  description: string;
  duration: string;
  steps: string[];
  reflectionPrompt: string;
}

export interface RelationshipMemory {
  id: string;
  title: string;
  date: string;
  type: 'anniversary' | 'date' | 'milestone' | 'memory';
  notes: string;
  feeling?: string;
}

export interface Book {
  id: string;
  title: string;
  originalTitle?: string;
  author: string;
  translator?: string;
  publisher?: string;
  coverImage: string;
  rating: number;
  readTimeEstimate: string;
  pages: number;
  category: string;
  summary: string;
  keyInsights: string[];
  quote: string;
  whyReadForCouples: string;
  isAlainDeBotton?: boolean;
}

export interface MediaItem {
  id: string;
  title: string;
  creator: string;
  topic: string;
  duration: string;
  type: 'podcast' | 'video' | 'lecture' | 'book';
  description: string;
  sourceUrl: string;
  badge: string;
}

export type ActiveTab = 'home' | 'journeys' | 'exercises' | 'couple' | 'library' | 'library-old' | 'cycle' | 'profile';
