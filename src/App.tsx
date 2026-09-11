import React, { useState, useEffect, useRef } from 'react';
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
import { LibraryTab } from './components/library/LibraryTab';

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

export default function App() {
  const [onboardingStep, setOnboardingStep] = useState<'flow' | 'modal' | 'done'>('flow');
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [cycleConfig, setCycleConfig] = useState<MenstrualCycleConfig>(() => StorageService.getCycleConfig());

  const [preferences, setPreferences] = useState<UserPreferences>(() =>
    StorageService.getPreferences()
  );
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(true);
  const [isSOSOpen, setIsSOSOpen] = useState<boolean>(false);
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

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

  // Back button: close the deepest open surface first, then return to home.
  const navigationRef = useRef({ activeArticle, activeExercise, activeJourney, activePerspective, isSOSOpen, isMenuExpanded, isDrawerOpen, onboardingStep, isOnboardingOpen, activeTab });
  navigationRef.current = { activeArticle, activeExercise, activeJourney, activePerspective, isSOSOpen, isMenuExpanded, isDrawerOpen, onboardingStep, isOnboardingOpen, activeTab };
  useEffect(() => {
    window.history.pushState({ yar: true }, '', window.location.href);
    let lastBackAt = 0;
    const handleBack = () => {
      const now = Date.now();
      const n = navigationRef.current;
      if (n.activeArticle) { setActiveArticle(null); window.history.pushState({ yar: true }, '', window.location.href); return; }
      if (n.activeExercise) { setActiveExercise(null); window.history.pushState({ yar: true }, '', window.location.href); return; }
      if (n.activeJourney) { setActiveJourney(null); window.history.pushState({ yar: true }, '', window.location.href); return; }
      if (n.activePerspective) { setActivePerspective(null); window.history.pushState({ yar: true }, '', window.location.href); return; }
      if (n.isSOSOpen) { setIsSOSOpen(false); window.history.pushState({ yar: true }, '', window.location.href); return; }
      if (n.isMenuExpanded) { setIsMenuExpanded(false); window.history.pushState({ yar: true }, '', window.location.href); return; }
      if (n.isDrawerOpen) { setIsDrawerOpen(false); window.history.pushState({ yar: true }, '', window.location.href); return; }
      if (n.onboardingStep === 'modal' && n.isOnboardingOpen) return;
      if (n.activeTab !== 'home') { setActiveTab('home'); window.history.pushState({ yar: true }, '', window.location.href); return; }
      if (now - lastBackAt < 1800) {
        if (window.confirm('می‌خواهید از یار خارج شوید؟')) window.location.href = 'about:blank';
      } else {
        lastBackAt = now;
        window.history.pushState({ yar: true }, '', window.location.href);
        window.alert('برای خروج، یک‌بار دیگر دکمه برگشت را بزنید.');
      }
    };
    window.addEventListener('popstate', handleBack);
    return () => window.removeEventListener('popstate', handleBack);
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
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        onOpenSOS={() => setIsSOSOpen(true)}
        onOpenMenu={() => setIsMenuExpanded(true)}
      />

      {/* Side Drawer Menu */}
      <ExpandedMenu
        isOpen={isMenuExpanded}
        onClose={() => setIsMenuExpanded(false)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
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
          <ArticlesTimelineTab
            articles={ALL_50_ARTICLES}
            completedArticles={completedArticles}
            favorites={favorites}
            onOpenArticle={(art) => setActiveArticle(art)}
            onToggleFavorite={handleToggleFavorite}
          />
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
            onResetAll={() => {
              localStorage.clear();
              location.reload();
            }}
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

      <PerspectiveModal
        perspectiveCase={activePerspective}
        isOpen={!!activePerspective}
        onClose={() => setActivePerspective(null)}
      />
    </div>
    </div>
  );
}