import { useState, useEffect } from 'react';
import {
  BookOpen,
  HelpCircle,
  Award,
  Zap,
  BarChart2,
  Printer,
  Search,
  CheckCircle2,
  Globe,
  BookMarked,
  ShieldCheck,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Keyboard,
  X
} from 'lucide-react';
import { UserProgress } from '../types';

export type ActiveTabType =
  | 'topics'
  | 'questions'
  | 'exam'
  | 'cheatSheet'
  | 'feedback'
  | 'glossary'
  | 'expertReview'
  | 'progress';

interface HeaderProps {
  activeTab: ActiveTabType;
  setActiveTab: (tab: ActiveTabType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  userProgress: UserProgress;
}

export function Header({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  userProgress,
}: HeaderProps) {
  const reviewedCardsCount = userProgress.reviewedQAs.length;
  const answeredQuestionsCount = Object.keys(userProgress.questionAttempts).length;
  const masteredCount = Object.values(userProgress.questionAttempts).filter((a) => a.isCorrect).length;

  // Live Scaled Score Estimate
  const accuracy = answeredQuestionsCount > 0 ? (masteredCount / answeredQuestionsCount) : 0;
  // Scaled score between 200 and 1000, where 72% correct = 720
  const estimatedScaledScore = answeredQuestionsCount >= 10
    ? Math.round(200 + (accuracy * 800))
    : null;

  // Aspirant Study Focus Timer (seconds)
  const [timerSeconds, setTimerSeconds] = useState<number>(25 * 60); // default 25 min Pomodoro
  const [timerMode, setTimerMode] = useState<'POMODORO' | 'EXAM_PACE'>('POMODORO');
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState<boolean>(false);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => Math.max(0, prev - 1));
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds]);

  const handleResetTimer = (mode: 'POMODORO' | 'EXAM_PACE') => {
    setTimerMode(mode);
    setIsTimerRunning(false);
    if (mode === 'POMODORO') {
      setTimerSeconds(25 * 60);
    } else {
      setTimerSeconds(120 * 60); // 120 mins full exam pace
    }
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-sm print:hidden">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white font-bold text-sm flex items-center justify-center shadow-sm shrink-0">
            CCAF
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white leading-tight">
                Claude Certified Architect: Foundations
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <ShieldCheck className="w-3 h-3" />
                Expert Verified
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
              Official CCAR-F Blueprint · 29 Topics · 145 Exam Questions with Traps · 60-Q Simulation
            </p>
          </div>
        </div>

        {/* Aspirant Study Toolbar (Focus Timer + Scaled Score + Print) */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Aspirant Study Focus Timer Widget */}
          <div className="flex items-center gap-1.5 bg-slate-800/90 px-2.5 py-1.5 rounded-lg border border-slate-700 text-xs">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-mono font-bold text-slate-100">{formatTime(timerSeconds)}</span>
            <button
              type="button"
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="p-1 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition"
              title={isTimerRunning ? 'Pause Timer' : 'Start Focus Timer'}
            >
              {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 text-emerald-400" />}
            </button>
            <button
              type="button"
              onClick={() => handleResetTimer(timerMode === 'POMODORO' ? 'EXAM_PACE' : 'POMODORO')}
              className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition text-[10px] uppercase font-mono"
              title={`Switch to ${timerMode === 'POMODORO' ? '120m Exam Pace' : '25m Pomodoro'}`}
            >
              {timerMode === 'POMODORO' ? '25m' : '120m'}
            </button>
            <button
              type="button"
              onClick={() => handleResetTimer(timerMode)}
              className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition"
              title="Reset Timer"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          {/* Scaled Score Predictor */}
          <div className="hidden sm:flex items-center gap-2 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700/60 text-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-300">
              <strong className="text-white">{masteredCount}</strong>/145 answered
            </span>
            {estimatedScaledScore !== null && (
              <>
                <span className="text-slate-600">|</span>
                <span className={`font-mono font-bold ${estimatedScaledScore >= 720 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {estimatedScaledScore}/1000 {estimatedScaledScore >= 720 ? '✓ PASS' : 'NEAR'}
                </span>
              </>
            )}
          </div>

          {/* Keyboard Shortcuts Trigger */}
          <button
            type="button"
            onClick={() => setShowShortcutsModal(true)}
            title="Keyboard Shortcuts (?)"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
          >
            <Keyboard className="w-3.5 h-3.5" />
          </button>

          {/* Print / PDF */}
          <button
            id="print-btn"
            type="button"
            onClick={() => window.print()}
            title="Print or Save PDF"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg border border-slate-700 transition"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">PDF</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs & Search bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 border-t border-slate-800/80 py-2">
        <nav className="flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none" aria-label="Main Navigation">
          <button
            id="nav-tab-topics"
            type="button"
            onClick={() => setActiveTab('topics')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
              activeTab === 'topics'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>29 Topics</span>
            <span className="text-[10px] text-slate-400 opacity-60 hidden xl:inline">1</span>
          </button>

          <button
            id="nav-tab-questions"
            type="button"
            onClick={() => setActiveTab('questions')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
              activeTab === 'questions'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>145 Q-Bank</span>
            <span className="text-[10px] text-slate-400 opacity-60 hidden xl:inline">2</span>
          </button>

          <button
            id="nav-tab-exam"
            type="button"
            onClick={() => setActiveTab('exam')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
              activeTab === 'exam'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>60-Q Simulator</span>
            <span className="text-[10px] text-slate-400 opacity-60 hidden xl:inline">3</span>
          </button>

          <button
            id="nav-tab-cheat-sheet"
            type="button"
            onClick={() => setActiveTab('cheatSheet')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
              activeTab === 'cheatSheet'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Triggers & Gaps</span>
            <span className="text-[10px] text-slate-400 opacity-60 hidden xl:inline">4</span>
          </button>

          <button
            id="nav-tab-expert-review"
            type="button"
            onClick={() => setActiveTab('expertReview')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
              activeTab === 'expertReview'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Expert Audit</span>
            <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
              NEW
            </span>
          </button>

          <button
            id="nav-tab-feedback"
            type="button"
            onClick={() => setActiveTab('feedback')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
              activeTab === 'feedback'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>Feedback Search</span>
            <span className="text-[10px] text-slate-400 opacity-60 hidden xl:inline">6</span>
          </button>

          <button
            id="nav-tab-glossary"
            type="button"
            onClick={() => setActiveTab('glossary')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
              activeTab === 'glossary'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BookMarked className="w-3.5 h-3.5 text-sky-400" />
            <span>Glossary</span>
            <span className="text-[10px] text-slate-400 opacity-60 hidden xl:inline">7</span>
          </button>

          <button
            id="nav-tab-progress"
            type="button"
            onClick={() => setActiveTab('progress')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
              activeTab === 'progress'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Readiness</span>
            <span className="text-[10px] text-slate-400 opacity-60 hidden xl:inline">8</span>
          </button>
        </nav>

        {/* Global Search Input */}
        <div className="relative min-w-[200px] sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            id="global-search-input"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topics, traps, keywords..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-800/90 text-white placeholder-slate-400 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>
      </div>

      {/* Keyboard Shortcuts Modal */}
      {showShortcutsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowShortcutsModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <Keyboard className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">Aspirant Keyboard Shortcuts</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-300">Switch Tabs 1 – 8</span>
                <span className="font-mono bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-indigo-300">
                  1 – 8
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-300">Select Question Option (in Q-Bank)</span>
                <span className="font-mono bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-indigo-300">
                  A / B / C / D (or 1-4)
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-300">Next Question</span>
                <span className="font-mono bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-indigo-300">
                  → or N
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-300">Previous Question</span>
                <span className="font-mono bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-indigo-300">
                  ← or P
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-300">Bookmark Current Question</span>
                <span className="font-mono bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-indigo-300">
                  B
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-300">Toggle Navigator Grid</span>
                <span className="font-mono bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-indigo-300">
                  Q
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-300">Toggle Shortcuts Dialog</span>
                <span className="font-mono bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-indigo-300">
                  ?
                </span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800 text-center">
              <button
                type="button"
                onClick={() => setShowShortcutsModal(false)}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-semibold text-white transition"
              >
                Got It, Let's Study
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
