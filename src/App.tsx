import React, { useState, useEffect, useRef } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { MenstrualCycleConfig,  ActiveTab, UserPreferences, Article, Exercise, Journey, PerspectiveCase } from './types';
import { StorageService } from './services/storage';
import { applySystemBars } from './native/systemBars';
import {
  SEED_ARTICLES,
  SEED_EXERCISES,
  SEED_JOURNEYS,
  SEED_DAILY_QUESTIONS,
  SEED_PERSPECTIVES,
  SEED_WEEKLY_DATES,
  SEED_MEDIA_ITEMS
} from './data/seedData';
import { ALAIN_DE_BOTTON_BOOKS } from './data/libraryBooks';
import { ALL_50_ARTICLES } from './data/allArticles';
import { Navbar } from './components/layout/Navbar';
import { BottomNav } from './components/layout/BottomNav';
import { ExpandedMenu } from './components/layout/ExpandedMenu';
import { SideDrawerMenu } from './components/layout/SideDrawerMenu';
import { HomeTab } from './components/home/HomeTab';
import { JourneysTab } from './components/journeys/JourneysTab';
import { CycleTab } from './components/cycle/CycleTab';
import { ExercisesTab } from './components/exercises/ExercisesTab';
import { CoupleTab } from './components/couple/CoupleTab';
import { SettingsTab } from './components/profile/SettingsTab';
import { ProfileTab } from './components/profile/ProfileTab';
import { ArticlesTimelineTab } from './components/library/ArticlesTimelineTab';
import { BookLibraryTab } from './components/library/BookLibraryTab';
import { LibraryTab } from './components/library/LibraryTab';
import { SchemasTab } from './components/schemas/SchemasTab';

// Modals
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { OnboardingModal } from './components/onboarding/OnboardingModal';
import { ConflictSOSModal } from './components/conflict/ConflictSOSModal';
import { ArticleModal } from './components/article/ArticleModal';
import { ExerciseModal } from './components/exercises/ExerciseModal';
import { JourneyModal } from './components/journeys/JourneyModal';
import { PerspectiveModal } from './components/exercises/PerspectiveModal';
import { AppIcon } from './components/common/AppIcon';
import { SplashScreen } from './components/common/SplashScreen';
import { BreathingModal } from './components/common/BreathingModal';
import { buildPersonalNotifications, learnMoodPattern } from './services/personalization';
import { computeRelationshipCycle } from './services/relationshipCycle';
import { NotificationPermissionPrompt } from './components/notifications/NotificationPermissionPrompt';
import { ClimateGuidePrompt } from './components/home/ClimateGuidePrompt';
import { disableDailyQuotes, listenForNotificationNavigation, requestNotificationPermission, scheduleDailyQuotes } from './services/notifications';

export default function App() {
  const [onboardingStep, setOnboardingStep] = useState<'flow' | 'modal' | 'done'>('flow');
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [cycleConfig, setCycleConfig] = useState<MenstrualCycleConfig>(() => StorageService.getCycleConfig());

  const [preferences, setPreferences] = useState<UserPreferences>(() =>
    StorageService.getPreferences()
  );
  const [darkMode, setDarkMode] = useState<boolean>(() => StorageService.getPreferences().darkMode);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(true);
  const [isSOSOpen, setIsSOSOpen] = useState<boolean>(false);
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isBreathingOpen, setIsBreathingOpen] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);
  const [showClimateGuide, setShowClimateGuide] = useState(false);
  const [activeSchemaId, setActiveSchemaId] = useState<string | null>(null);

  // Active modal targets
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [activeJourney, setActiveJourney] = useState<Journey | null>(null);
  const [activePerspective, setActivePerspective] = useState<PerspectiveCase | null>(null);

  // Persistence reactive states
  const [favorites, setFavorites] = useState<string[]>(() => StorageService.getFavorites());
  const [completedArticles, setCompletedArticles] = useState<string[]>(() =>
    StorageService.getCompletedArticles()
  );
  const [completedExercises, setCompletedExercises] = useState<string[]>(() =>
    StorageService.getCompletedExercises()
  );
  const [completedStages, setCompletedStages] = useState<Record<string, number[]>>(() => {
    const map: Record<string, number[]> = {};
    SEED_JOURNEYS.forEach((j) => {
      map[j.id] = StorageService.getCompletedStages(j.id);
    });
    return map;
  });
  const [streak, setStreak] = useState(() => StorageService.getStreak());

  const liveCycleState = computeRelationshipCycle(cycleConfig, StorageService.getPeriodLogs());
  const moodInsight = learnMoodPattern(StorageService.getCycleCheckins(), liveCycleState.phase);
  const notifications = buildPersonalNotifications({ phase: liveCycleState.phase, inPms: liveCycleState.inPmsWindow, temperature: StorageService.getRelationTemperature(), moodInsight });

  useEffect(() => {
    if (onboardingStep !== 'done' || !preferences.hasCompletedOnboarding) return;
    const stopListening = listenForNotificationNavigation(target => setActiveTab(target));
    if (preferences.notificationsEnabled) void scheduleDailyQuotes();
    const climateGuideSeen = localStorage.getItem('yar_climate_guide_seen') === '1';
    const timer = !climateGuideSeen
      ? window.setTimeout(() => setShowClimateGuide(true), 650)
      : !preferences.notificationPermissionAsked
        ? window.setTimeout(() => setShowNotificationPrompt(true), 650)
        : undefined;
    return () => { if (timer) window.clearTimeout(timer); stopListening(); };
  }, [onboardingStep, preferences.hasCompletedOnboarding, preferences.notificationsEnabled, preferences.notificationPermissionAsked]);

  const enableNotifications = async () => {
    try {
      const granted = await requestNotificationPermission();
      setPreferences(StorageService.savePreferences({ notificationsEnabled: granted, notificationPermissionAsked: true }));
      if (granted) setShowNotificationPrompt(false);
      return granted;
    } catch {
      setPreferences(StorageService.savePreferences({ notificationsEnabled: false, notificationPermissionAsked: true }));
      return false;
    }
  };

  const toggleNotifications = async (enabled: boolean) => {
    if (enabled) return enableNotifications();
    try { await disableDailyQuotes(); } catch { /* Keep the UI usable if Android has no pending schedule. */ }
    setPreferences(StorageService.savePreferences({ notificationsEnabled: false, notificationPermissionAsked: true }));
    return true;
  };

  // Every tab is a fresh page, never inherit the previous page's scroll position.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [activeTab]);

  // Initialize app state and handle onboarding flow
  useEffect(() => {
    // Show splash screen for 2 seconds
    const splashTimer = setTimeout(() => setShowSplash(false), 2000);
    
    // Apply system bars for mobile
    applySystemBars(darkMode);
    
    return () => clearTimeout(splashTimer);
  }, [darkMode]);

  // Handle onboarding completion
  useEffect(() => {
    if (preferences.hasCompletedOnboarding) {
      setOnboardingStep('done');
      setIsOnboardingOpen(false);
    } else {
      setOnboardingStep('flow');
      setIsOnboardingOpen(false);
    }
  }, [preferences.hasCompletedOnboarding]);

  // Handle dark mode and preferences sync
  useEffect(() => {
    const newPrefs = { ...preferences, darkMode };
    setPreferences(StorageService.savePreferences(newPrefs));
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);


  // Dark mode class sync on document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    document.documentElement.style.colorScheme = darkMode ? 'dark' : 'light';
    void applySystemBars(darkMode);
  }, [darkMode]);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowSplash(false), 1700);
    return () => window.clearTimeout(timer);
  }, []);

  // Back button: first press goes one level back; a second press within the
  // short window asks whether the user wants to exit the app.
  const navigationRef = useRef({ activeArticle, activeExercise, activeJourney, activePerspective, activeSchemaId, isSOSOpen, isMenuExpanded, isDrawerOpen, onboardingStep, isOnboardingOpen, activeTab });
  navigationRef.current = { activeArticle, activeExercise, activeJourney, activePerspective, activeSchemaId, isSOSOpen, isMenuExpanded, isDrawerOpen, onboardingStep, isOnboardingOpen, activeTab };
  useEffect(() => {
    window.history.pushState({ yar: true }, '', window.location.href);
    let lastBackAt = 0;
    const pushBackState = () => {
      window.history.pushState({ yar: true }, '', window.location.href);
    };
    const handleBack = () => {
      const now = Date.now();
      const n = navigationRef.current;
      if (now - lastBackAt < 1800) {
        setShowExitDialog(true);
        lastBackAt = 0;
        return;
      }
      lastBackAt = now;
      if (n.activeArticle) { setActiveArticle(null); pushBackState(); return; }
      if (n.activeExercise) { setActiveExercise(null); pushBackState(); return; }
      if (n.activeJourney) { setActiveJourney(null); pushBackState(); return; }
      if (n.activePerspective) { setActivePerspective(null); pushBackState(); return; }
      if (n.activeSchemaId) { setActiveSchemaId(null); pushBackState(); return; }
      if (n.isSOSOpen) { setIsSOSOpen(false); pushBackState(); return; }
      if (n.isMenuExpanded) { setIsMenuExpanded(false); pushBackState(); return; }
      if (n.isDrawerOpen) { setIsDrawerOpen(false); pushBackState(); return; }
      if (n.onboardingStep === 'modal' && n.isOnboardingOpen) { pushBackState(); return; }
      if (n.activeTab !== 'home') { setActiveTab('home'); pushBackState(); return; }
      setShowExitDialog(true);
      pushBackState();
    };
    window.addEventListener('popstate', handleBack);
    const nativeBack = CapacitorApp.addListener('backButton', handleBack);
    return () => {
      window.removeEventListener('popstate', handleBack);
      void nativeBack.then(listener => listener.remove());
    };
  }, []);

  if (showSplash) {
    return (
      <div className="yar-splash" dir="rtl">
        <AppIcon size={132} rounded className="yar-splash-icon" />
        <div className="yar-splash-copy">
          <h1>یار</h1>
          <p>همراه رابطه‌ای آگاهانه‌تر</p>
        </div>
      </div>
    );
  }

  const handleToggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    setPreferences(StorageService.savePreferences({ darkMode: next }));
  };

  const handleOnboardingComplete = (updatedPrefs: Partial<UserPreferences>) => {
    const saved = StorageService.savePreferences(updatedPrefs);
    setPreferences(saved);
    setIsOnboardingOpen(false);
  };

  const handleToggleFavorite = (id: string) => {
    StorageService.toggleFavorite(id);
    setFavorites(StorageService.getFavorites());
  };

  const handleToggleArticleCompleted = (id: string) => {
    StorageService.toggleArticleCompleted(id);
    setCompletedArticles(StorageService.getCompletedArticles());
    setStreak(StorageService.getStreak());
  };

  const handleToggleExerciseCompleted = (id: string) => {
    StorageService.toggleExerciseCompleted(id);
    setCompletedExercises(StorageService.getCompletedExercises());
    setStreak(StorageService.getStreak());
  };

  const handleToggleStageCompleted = (journeyId: string, stageNumber: number) => {
    StorageService.toggleStageCompleted(journeyId, stageNumber);
    setCompletedStages({
      ...completedStages,
      [journeyId]: StorageService.getCompletedStages(journeyId)
    });
    setStreak(StorageService.getStreak());
  };

  const handleOpenArticleById = (articleId: string) => {
    const found = ALL_50_ARTICLES.find((a) => a.id === articleId) || SEED_ARTICLES.find((a) => a.id === articleId);
    if (found) {
      setActiveArticle(found);
    }
  };

  const handleOpenExerciseById = (exerciseId: string) => {
    const found = SEED_EXERCISES.find((e) => e.id === exerciseId);
    if (found) {
      setActiveExercise(found);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <SplashScreen isVisible={showSplash} />

      <div className="min-h-[100dvh] bg-[#F5F7FC] dark:bg-[#0B0F19] text-[#1E293B] dark:text-[#F1F5F9] transition-colors duration-200 antialiased font-sans selection:bg-rose-100 selection:text-rose-600">
      {/* Top Fixed Header */}
      <Navbar
        streakCount={streak.count}
        onOpenSOS={() => setIsSOSOpen(true)}
        onOpenMenu={() => setIsMenuExpanded(true)}
        notifications={notifications}
        onNotificationNavigate={(target) => setActiveTab(target)}
      />

      {/* Side Drawer Menu */}
      <ExpandedMenu
        isOpen={isMenuExpanded}
        onClose={() => setIsMenuExpanded(false)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        streakCount={streak.count}
        userName={preferences.userName}
        onOpenSOS={() => setIsSOSOpen(true)}
      />

      <SideDrawerMenu
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        onOpenSOS={() => setIsSOSOpen(true)}
        streakCount={streak.count}
      />

      {/* Main Screen Content */}
      <main className="yar-main">
        {activeTab === 'home' && (
          <HomeTab
            preferences={preferences}
            articles={SEED_ARTICLES}
            exercises={SEED_EXERCISES}
            journeys={SEED_JOURNEYS}
            dailyQuestions={SEED_DAILY_QUESTIONS}
            weeklyDates={SEED_WEEKLY_DATES}
            completedArticles={completedArticles}
            completedExercises={completedExercises}
            completedStages={completedStages}
            onOpenArticle={(art) => setActiveArticle(art)}
            onOpenExercise={(ex) => setActiveExercise(ex)}
            onOpenJourney={(j) => setActiveJourney(j)}
            onOpenSOS={() => setIsSOSOpen(true)}
            onOpenBreathing={() => setIsBreathingOpen(true)}
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'journeys' && (
          <JourneysTab
            journeys={SEED_JOURNEYS}
            completedStages={completedStages}
            onSelectJourney={(j) => setActiveJourney(j)}
          />
        )}

        {activeTab === 'library' && (
          <BookLibraryTab />
        )}

        {activeTab === 'library-old' && (
          <LibraryTab
            books={ALAIN_DE_BOTTON_BOOKS}
            articles={ALL_50_ARTICLES}
            favorites={favorites}
            completedArticles={completedArticles}
            onOpenArticle={(art) => setActiveArticle(art)}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {activeTab === 'schemas' && (
          <SchemasTab
            selectedId={activeSchemaId}
            onSelect={(id) => {
              setActiveSchemaId(id);
              window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
            }}
            onBack={() => {
              setActiveSchemaId(null);
              window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
            }}
          />
        )}

        {activeTab === 'cycle' && (
          <CycleTab
            cycleConfig={cycleConfig}
            onUpdateCycleConfig={(config) => setCycleConfig(StorageService.saveCycleConfig(config))}
          />
        )}

        {activeTab === 'exercises' && (
          <ExercisesTab
            exercises={SEED_EXERCISES}
            perspectives={SEED_PERSPECTIVES}
            completedExercises={completedExercises}
            onSelectExercise={(ex) => setActiveExercise(ex)}
            onSelectPerspective={(p) => setActivePerspective(p)}
          />
        )}

        {activeTab === 'couple' && (
          <CoupleTab
            preferences={preferences}
            weeklyDates={SEED_WEEKLY_DATES}
            onUpdatePreferences={(p) => setPreferences(StorageService.savePreferences(p))}
          />
        )}

        {activeTab === 'profile' && (
          <SettingsTab
            preferences={preferences}
            darkMode={darkMode}
            onToggleDarkMode={handleToggleDarkMode}
            onUpdatePreferences={(prefs) => setPreferences(StorageService.savePreferences(prefs))}
            onNotificationToggle={toggleNotifications}
            onResetAll={() => {
              localStorage.clear();
              location.reload();
            }}
            cycleConfig={cycleConfig}
            onUpdateCycleConfig={(config) => setCycleConfig(StorageService.saveCycleConfig(config))}
          />
        )}

        {activeTab === 'profile-old' && (
          <ProfileTab
            preferences={preferences}
            articles={SEED_ARTICLES}
            exercises={SEED_EXERCISES}
            mediaItems={SEED_MEDIA_ITEMS}
            favorites={favorites}
            completedArticles={completedArticles}
            completedExercises={completedExercises}
            onOpenArticle={(art) => setActiveArticle(art)}
            onOpenExercise={(ex) => setActiveExercise(ex)}
            onUpdatePreferences={(p) => setPreferences(StorageService.savePreferences(p))}
            onResetOnboarding={() => setIsOnboardingOpen(true)}
          />
        )}
      </main>

      {/* Bottom Sticky Navigation */}
      <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} />

      {/* Onboarding Flow */}
      {onboardingStep === 'flow' && (
        <OnboardingFlow
          onComplete={() => {
            setOnboardingStep('modal');
            setIsOnboardingOpen(true);
          }}
        />
      )}

      {/* Modals and Flows */}
      <OnboardingModal
        isOpen={onboardingStep === 'modal' && isOnboardingOpen}
        onComplete={handleOnboardingComplete}
        onCycleSetup={(config) => {
          StorageService.logPeriodStart(config.lastPeriodStartIso!);
          setCycleConfig(StorageService.saveCycleConfig(config));
        }}
      />

      <ConflictSOSModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
        onSelectExercise={handleOpenExerciseById}
      />

      <ArticleModal
        article={activeArticle}
        isOpen={!!activeArticle}
        onClose={() => setActiveArticle(null)}
        isFavorite={activeArticle ? favorites.includes(activeArticle.id) : false}
        isCompleted={activeArticle ? completedArticles.includes(activeArticle.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onToggleCompleted={handleToggleArticleCompleted}
        onSelectRelatedArticle={handleOpenArticleById}
        allArticles={ALL_50_ARTICLES}
      />

      <ExerciseModal
        exercise={activeExercise}
        isOpen={!!activeExercise}
        onClose={() => setActiveExercise(null)}
        isCompleted={activeExercise ? completedExercises.includes(activeExercise.id) : false}
        onToggleCompleted={handleToggleExerciseCompleted}
      />

      <JourneyModal
        journey={activeJourney}
        isOpen={!!activeJourney}
        onClose={() => setActiveJourney(null)}
        completedStages={activeJourney ? completedStages[activeJourney.id] || [] : []}
        onToggleStageCompleted={handleToggleStageCompleted}
        onOpenArticleById={handleOpenArticleById}
        onOpenExerciseById={handleOpenExerciseById}
      />

      <BreathingModal isOpen={isBreathingOpen} onClose={() => setIsBreathingOpen(false)} />

      <PerspectiveModal
        perspectiveCase={activePerspective}
        isOpen={!!activePerspective}
        onClose={() => setActivePerspective(null)}
      />


      <ClimateGuidePrompt
        isOpen={showClimateGuide}
        onClose={() => { localStorage.setItem('yar_climate_guide_seen', '1'); setShowClimateGuide(false); if (!preferences.notificationPermissionAsked) window.setTimeout(() => setShowNotificationPrompt(true), 260); }}
      />

      <NotificationPermissionPrompt
        isOpen={showNotificationPrompt}
        onEnable={enableNotifications}
        onLater={() => {
          setPreferences(StorageService.savePreferences({ notificationsEnabled: false, notificationPermissionAsked: true }));
          setShowNotificationPrompt(false);
        }}
      />

      {showExitDialog && <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[oklch(18%_0.03_290_/_0.48)] px-5 backdrop-blur-md" dir="rtl"><div role="dialog" aria-modal="true" className="w-full max-w-sm overflow-hidden rounded-[2rem] border border-[oklch(86%_0.07_300)] bg-[oklch(98%_0.012_300)] p-6 text-center shadow-[0_28px_80px_-24px_oklch(35%_0.12_300_/_0.55)] dark:border-[oklch(35%_0.08_300)] dark:bg-[oklch(20%_0.03_290)]"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[oklch(53%_0.18_300)] text-white shadow-lg shadow-[oklch(53%_0.18_300_/_0.3)]"><span className="text-2xl">♥</span></div><h2 className="mt-4 text-lg font-black text-slate-900 dark:text-white">آیا می‌خواهی از یار خارج شوی؟</h2><p className="mt-2 text-xs leading-6 text-slate-500 dark:text-slate-300">اطلاعاتت روی همین دستگاه می‌ماند و هر وقت برگردی منتظر توست.</p><div className="mt-5 grid grid-cols-2 gap-2"><button onClick={()=>setShowExitDialog(false)} className="min-h-12 rounded-2xl bg-[oklch(53%_0.18_300)] text-xs font-black text-white shadow-lg shadow-[oklch(53%_0.18_300_/_0.2)] transition-transform active:scale-95">ادامه در یار</button><button onClick={()=>void CapacitorApp.exitApp()} className="min-h-12 rounded-2xl border border-[oklch(82%_0.06_300)] bg-[oklch(99%_0.006_300)] text-xs font-black text-[oklch(48%_0.16_300)] transition-transform active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-violet-200">خروج</button></div></div></div>}
    </div>
    </div>
  );
}