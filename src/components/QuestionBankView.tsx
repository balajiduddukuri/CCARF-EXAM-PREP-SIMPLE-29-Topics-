import { useState, useMemo, useEffect } from 'react';
import { DomainId, UserProgress } from '../types';
import { ALL_QUESTIONS } from '../data/questionsData';
import { DOMAINS } from '../data/domainsData';
import { TOPICS_DATA } from '../data/topicsData';
import {
  CheckCircle2,
  XCircle,
  Bookmark,
  Filter,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  LayoutGrid,
  Clock,
  Keyboard,
  X,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Eye,
  Check,
  ExternalLink,
  BookOpenCheck,
  GraduationCap
} from 'lucide-react';

interface QuestionBankViewProps {
  initialTopicFilter?: number | null;
  onClearTopicFilter?: () => void;
  userProgress: UserProgress;
  onRecordAttempt: (questionId: string, selectedIndex: number, isCorrect: boolean) => void;
  onToggleBookmark: (questionId: string) => void;
  onResetAttempts: () => void;
  onNavigateToTopic?: (topicId: number) => void;
}

export function QuestionBankView({
  initialTopicFilter = null,
  onClearTopicFilter,
  userProgress,
  onRecordAttempt,
  onToggleBookmark,
  onResetAttempts,
  onNavigateToTopic,
}: QuestionBankViewProps) {
  const [selectedDomain, setSelectedDomain] = useState<DomainId | 'ALL'>('ALL');
  const [selectedTopic, setSelectedTopic] = useState<number | 'ALL'>(
    initialTopicFilter ?? 'ALL'
  );
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'UNANSWERED' | 'CORRECT' | 'INCORRECT' | 'BOOKMARKED'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'CARD' | 'LIST'>('CARD');
  const [showMatrixModal, setShowMatrixModal] = useState<boolean>(false);

  // Answers & Explanations Mode (Study Key Mode)
  const [isStudyMode, setIsStudyMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('ccarf_qbank_study_mode_v1') === 'true';
    } catch {
      return false;
    }
  });

  // Individual question reveals in Practice Mode
  const [revealedInPractice, setRevealedInPractice] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      localStorage.setItem('ccarf_qbank_study_mode_v1', isStudyMode.toString());
    } catch {
      // ignore
    }
  }, [isStudyMode]);

  // Per-question Pacing Timer (seconds)
  const [secondsOnCurrentQ, setSecondsOnCurrentQ] = useState<number>(0);

  // Filter questions
  const filteredQuestions = useMemo(() => {
    return ALL_QUESTIONS.filter((q) => {
      // Topic filter
      if (selectedTopic !== 'ALL' && q.topicId !== selectedTopic) {
        return false;
      }
      // Domain filter
      if (selectedDomain !== 'ALL' && q.domainId !== selectedDomain) {
        return false;
      }
      // Status filter
      const attempt = userProgress.questionAttempts[q.id];
      const isBookmarked = userProgress.bookmarkedQuestionIds.includes(q.id);

      if (statusFilter === 'BOOKMARKED' && !isBookmarked) return false;
      if (statusFilter === 'UNANSWERED' && attempt !== undefined) return false;
      if (statusFilter === 'CORRECT' && (!attempt || !attempt.isCorrect)) return false;
      if (statusFilter === 'INCORRECT' && (!attempt || attempt.isCorrect)) return false;

      // Search term
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesQ = q.question.toLowerCase().includes(term);
        const matchesOpt = q.options.some((opt) => opt.toLowerCase().includes(term));
        const matchesExp = q.explanation.toLowerCase().includes(term);
        const matchesTrap = q.trap.toLowerCase().includes(term);
        return matchesQ || matchesOpt || matchesExp || matchesTrap;
      }

      return true;
    });
  }, [selectedTopic, selectedDomain, statusFilter, searchTerm, userProgress]);

  // Keep index in bounds
  useEffect(() => {
    if (currentQuestionIndex >= filteredQuestions.length && filteredQuestions.length > 0) {
      setCurrentQuestionIndex(0);
    }
  }, [filteredQuestions.length, currentQuestionIndex]);

  // Reset pacing timer when question changes
  useEffect(() => {
    setSecondsOnCurrentQ(0);
    const interval = setInterval(() => {
      setSecondsOnCurrentQ((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [currentQuestionIndex, selectedTopic, selectedDomain]);

  const currentQ = filteredQuestions[currentQuestionIndex];

  // Handle option selection
  const handleSelectOption = (questionId: string, optionIdx: number) => {
    setSelectedOptions((prev) => ({ ...prev, [questionId]: optionIdx }));
    const question = ALL_QUESTIONS.find((q) => q.id === questionId);
    if (question) {
      const isCorrect = optionIdx === question.correctOptionIndex;
      onRecordAttempt(questionId, optionIdx, isCorrect);
    }
  };

  // Keyboard navigation for card mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (viewMode === 'CARD' && currentQ) {
        const key = e.key.toLowerCase();
        if (key === '1' || key === 'a') {
          handleSelectOption(currentQ.id, 0);
        } else if (key === '2' || key === 'b') {
          handleSelectOption(currentQ.id, 1);
        } else if (key === '3' || key === 'c') {
          handleSelectOption(currentQ.id, 2);
        } else if (key === '4' || key === 'd') {
          handleSelectOption(currentQ.id, 3);
        } else if (key === 'arrowright' || key === 'n') {
          if (currentQuestionIndex < filteredQuestions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
          }
        } else if (key === 'arrowleft' || key === 'p') {
          if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prev) => prev - 1);
          }
        } else if (key === 'f' || key === 'k') {
          onToggleBookmark(currentQ.id);
        } else if (key === 'q') {
          setShowMatrixModal((prev) => !prev);
        } else if (key === 'e') {
          setIsStudyMode((prev) => !prev);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, currentQ, currentQuestionIndex, filteredQuestions.length]);

  // Helper stats
  const answeredCount = Object.keys(userProgress.questionAttempts).length;
  const correctCount = Object.values(userProgress.questionAttempts).filter((a) => a.isCorrect).length;
  const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Banner Stats & Mode Toggle */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                CCAF Practice Question Bank
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-mono font-bold">
                145 Questions
              </span>
              {isStudyMode && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 flex items-center gap-1">
                  <BookOpenCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Answers Key Mode</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              145 targeted scenario questions across 29 topics with verified solutions, official architectural explanations, and trap distractor analyses.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Quick stats badge */}
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-xs">
              <span>Answered: <strong className="text-slate-900">{answeredCount}</strong>/145</span>
              <span className="text-slate-300">|</span>
              <span>Accuracy: <strong className="text-emerald-600">{accuracy}%</strong></span>
              <span className="text-slate-300">|</span>
              <span>Bookmarked: <strong className="text-amber-600">{userProgress.bookmarkedQuestionIds.length}</strong></span>
            </div>

            {/* Mode Switcher: Practice vs Answers & Explanations */}
            <div className="flex items-center rounded-lg border border-slate-200 p-0.5 bg-slate-100 text-xs shadow-2xs">
              <button
                type="button"
                id="qb-mode-practice"
                onClick={() => setIsStudyMode(false)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition ${
                  !isStudyMode
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Practice Mode: Test your recall with hidden answers until submitted"
              >
                <CheckCircle2 className={`w-3.5 h-3.5 ${!isStudyMode ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>Practice Mode</span>
              </button>
              <button
                type="button"
                id="qb-mode-study"
                onClick={() => setIsStudyMode(true)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition ${
                  isStudyMode
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Answers & Explanations Mode: Immediately displays correct answers, official rationales & traps (Hotkey: E)"
              >
                <BookOpenCheck className="w-3.5 h-3.5" />
                <span>Answers & Explanations</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                  isStudyMode ? 'bg-emerald-700 text-emerald-100' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  KEY
                </span>
              </button>
            </div>

            {/* View Layout Toggle */}
            <div className="flex items-center rounded-lg border border-slate-200 p-0.5 bg-slate-100 text-xs">
              <button
                type="button"
                id="qb-view-card"
                onClick={() => setViewMode('CARD')}
                className={`px-3 py-1.5 rounded-md font-medium transition ${
                  viewMode === 'CARD' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Single card carousel mode"
              >
                Card View
              </button>
              <button
                type="button"
                id="qb-view-list"
                onClick={() => setViewMode('LIST')}
                className={`px-3 py-1.5 rounded-md font-medium transition ${
                  viewMode === 'LIST' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Continuous reading list"
              >
                Full List
              </button>
            </div>

            {/* Matrix Navigator Trigger */}
            <button
              type="button"
              id="qb-open-matrix"
              onClick={() => setShowMatrixModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs rounded-lg border border-indigo-200 transition"
              title="Open 145-Question Matrix Navigator (Hotkey: Q)"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid (Q)</span>
            </button>
          </div>
        </div>

        {/* Answers & Explanations Mode Active Alert Banner */}
        {isStudyMode && (
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-emerald-50/80 -mx-4 -mb-4 p-4 rounded-b-xl border-t border-emerald-200">
            <div className="flex items-start sm:items-center gap-3 text-xs text-emerald-950">
              <div className="p-1.5 rounded-lg bg-emerald-600 text-white shrink-0 mt-0.5 sm:mt-0">
                <BookOpenCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-emerald-950 text-sm">
                  Answers & Explanations Mode Active
                </span>
                <p className="text-emerald-800 text-xs mt-0.5">
                  Displaying verified correct answers, authoritative architectural explanations, and distractor traps for all 145 scenario questions.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] text-emerald-700 font-mono hidden md:inline">
                Hotkey: E
              </span>
              <button
                type="button"
                onClick={() => setIsStudyMode(false)}
                className="px-3 py-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition shadow-2xs"
              >
                Switch to Practice Mode
              </button>
            </div>
          </div>
        )}

        {/* Filters Bar */}
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Domain Select */}
          <div>
            <label htmlFor="qb-domain-select" className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Domain
            </label>
            <select
              id="qb-domain-select"
              value={selectedDomain}
              onChange={(e) => {
                setSelectedDomain(e.target.value as DomainId | 'ALL');
                setSelectedTopic('ALL');
                setCurrentQuestionIndex(0);
              }}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Domains (D1 - D5)</option>
              {(Object.keys(DOMAINS) as DomainId[]).map((dId) => (
                <option key={dId} value={dId}>
                  {dId} — {DOMAINS[dId].name} ({DOMAINS[dId].weight}%)
                </option>
              ))}
            </select>
          </div>

          {/* Topic Select */}
          <div>
            <label htmlFor="qb-topic-select" className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Topic
            </label>
            <select
              id="qb-topic-select"
              value={selectedTopic}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedTopic(val === 'ALL' ? 'ALL' : Number(val));
                setCurrentQuestionIndex(0);
                if (onClearTopicFilter && val === 'ALL') {
                  onClearTopicFilter();
                }
              }}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All 29 Topics</option>
              {TOPICS_DATA.map((t) => (
                <option key={t.id} value={t.id}>
                  Topic {t.id}: {t.title}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label htmlFor="qb-status-select" className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Attempt Status
            </label>
            <select
              id="qb-status-select"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setCurrentQuestionIndex(0);
              }}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="UNANSWERED">Unanswered Only</option>
              <option value="CORRECT">Mastered / Correct</option>
              <option value="INCORRECT">Incorrect (Need Review)</option>
              <option value="BOOKMARKED">Bookmarked Flags</option>
            </select>
          </div>

          {/* Search Filter */}
          <div>
            <label htmlFor="qb-search-input" className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Search Question or Trap
            </label>
            <input
              id="qb-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentQuestionIndex(0);
              }}
              placeholder="Search keywords..."
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Filter badge summary */}
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>Showing <strong className="text-slate-900">{filteredQuestions.length}</strong> questions</span>
            {selectedTopic !== 'ALL' && (
              <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-[11px]">
                Topic {selectedTopic}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTopic('ALL');
                    if (onClearTopicFilter) onClearTopicFilter();
                  }}
                  className="hover:text-indigo-900 font-bold"
                >
                  ×
                </button>
              </span>
            )}
          </div>

          {answeredCount > 0 && (
            <button
              type="button"
              onClick={onResetAttempts}
              className="flex items-center gap-1 text-slate-500 hover:text-rose-600 transition"
              title="Clear all question attempt history"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Practice History</span>
            </button>
          )}
        </div>
      </div>

      {filteredQuestions.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Filter className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No questions match your filter criteria</h3>
          <p className="text-xs text-slate-500 mt-1">Try resetting the status filter or clearing the search text.</p>
          <button
            type="button"
            onClick={() => {
              setSelectedDomain('ALL');
              setSelectedTopic('ALL');
              setStatusFilter('ALL');
              setSearchTerm('');
            }}
            className="mt-4 px-4 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition"
          >
            Reset All Filters
          </button>
        </div>
      ) : viewMode === 'CARD' ? (
        /* SINGLE CARD MODE WITH CAROUSEL NAVIGATION */
        currentQ && (
          <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs relative">
            {/* Question Top Header with Pacing Timer & Key Shortcuts */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-100">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-md font-mono font-bold text-xs bg-slate-900 text-white">
                  {currentQ.id}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${DOMAINS[currentQ.domainId].badgeBg} ${DOMAINS[currentQ.domainId].badgeBorder} border`}>
                  {currentQ.domainId} · {DOMAINS[currentQ.domainId].name}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  Topic {currentQ.topicId} · {currentQ.taskRef}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {/* Aspirant Question Pacing Indicator */}
                {isStudyMode ? (
                  <div
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono font-semibold bg-emerald-50 border-emerald-300 text-emerald-800"
                    title="Study Mode: Untimed review with immediate answers & explanations"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Study Review</span>
                  </div>
                ) : (
                  <div
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono font-semibold ${
                      secondsOnCurrentQ > 120
                        ? 'bg-rose-50 border-rose-300 text-rose-700'
                        : secondsOnCurrentQ > 90
                        ? 'bg-amber-50 border-amber-300 text-amber-700'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                    title="CCAR-F Exam Target Pace: 120 seconds per question"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>{secondsOnCurrentQ}s / 120s</span>
                  </div>
                )}

                {/* Individual reveal button for practice mode */}
                {!isStudyMode && !userProgress.questionAttempts[currentQ.id] && (
                  <button
                    type="button"
                    onClick={() => setRevealedInPractice((prev) => ({ ...prev, [currentQ.id]: !prev[currentQ.id] }))}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 transition"
                    title="Reveal answer and explanation without recording an attempt"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{revealedInPractice[currentQ.id] ? 'Hide Answer' : 'Show Answer'}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onToggleBookmark(currentQ.id)}
                  className={`p-1.5 rounded-lg border transition flex items-center gap-1 text-xs ${
                    userProgress.bookmarkedQuestionIds.includes(currentQ.id)
                      ? 'bg-amber-50 border-amber-300 text-amber-700'
                      : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                  title="Bookmark for later (Hotkey: F)"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">
                    {userProgress.bookmarkedQuestionIds.includes(currentQ.id) ? 'Bookmarked' : 'Bookmark'}
                  </span>
                </button>

                <span className="text-xs text-slate-500 font-medium">
                  {currentQuestionIndex + 1} of {filteredQuestions.length}
                </span>
              </div>
            </div>

            {/* Question Prompt */}
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed mb-6">
              {currentQ.question}
            </h3>

            {/* Multiple Choice Options */}
            {(() => {
              const attempt = userProgress.questionAttempts[currentQ.id];
              const selectedIdx = selectedOptions[currentQ.id] ?? attempt?.selectedIndex ?? null;
              const hasAnswered = selectedIdx !== null;
              const isRevealed = isStudyMode || !!revealedInPractice[currentQ.id] || hasAnswered;

              return (
                <div className="space-y-3 mb-6">
                  {currentQ.options.map((option, optIdx) => {
                    const isSelected = selectedIdx === optIdx;
                    const isCorrect = currentQ.correctOptionIndex === optIdx;

                    let optionStyle = 'bg-slate-50/70 border-slate-200 hover:bg-slate-100/80 text-slate-800';

                    if (isRevealed) {
                      if (isCorrect) {
                        optionStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-medium shadow-xs ring-1 ring-emerald-400';
                      } else if (isSelected && !isCorrect) {
                        optionStyle = 'bg-rose-50 border-rose-400 text-rose-950 font-medium shadow-xs';
                      } else {
                        optionStyle = 'bg-slate-50/50 border-slate-200 text-slate-600 opacity-75';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectOption(currentQ.id, optIdx)}
                        className={`w-full text-left p-4 rounded-xl border transition flex items-start gap-3 text-sm leading-relaxed ${optionStyle}`}
                      >
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                            isRevealed && isCorrect
                              ? 'bg-emerald-600 text-white'
                              : isRevealed && isSelected && !isCorrect
                              ? 'bg-rose-600 text-white'
                              : isSelected
                              ? 'bg-indigo-600 text-white'
                              : 'bg-white border border-slate-300 text-slate-700'
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <div className="flex-1">
                          <span>{option}</span>
                          {isRevealed && isCorrect && (
                            <span className="ml-2 inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                              <Check className="w-3 h-3 text-emerald-700" />
                              Correct Answer
                            </span>
                          )}
                          {isRevealed && isSelected && !isCorrect && (
                            <span className="ml-2 text-xs font-bold text-rose-700">✗ Your Choice</span>
                          )}
                          {isStudyMode && !isCorrect && (
                            <span className="ml-2 text-[11px] font-mono text-slate-400">(Distractor)</span>
                          )}
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 opacity-60 hidden sm:inline">
                          [{String.fromCharCode(65 + optIdx)}]
                        </span>
                      </button>
                    );
                  })}
                </div>
              );
            })()}

            {/* Answer Feedback & Trap Breakdown */}
            {(() => {
              const attempt = userProgress.questionAttempts[currentQ.id];
              const hasAnswered = (selectedOptions[currentQ.id] !== undefined) || (attempt !== undefined);
              const isRevealed = isStudyMode || !!revealedInPractice[currentQ.id] || hasAnswered;

              if (!isRevealed) return null;

              const isSuccess = attempt?.isCorrect ?? false;

              return (
                <div className="rounded-xl border p-5 space-y-3 bg-slate-50 border-slate-200 mb-6">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200/80">
                    <div className="flex items-center gap-2">
                      {isStudyMode ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          Verified Answer: Option {String.fromCharCode(65 + currentQ.correctOptionIndex)}
                        </span>
                      ) : hasAnswered ? (
                        isSuccess ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            Correct! Option {String.fromCharCode(65 + currentQ.correctOptionIndex)}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-100/80 px-2.5 py-1 rounded-full">
                            <XCircle className="w-4 h-4 text-rose-600" />
                            Incorrect — Verified Answer: Option {String.fromCharCode(65 + currentQ.correctOptionIndex)}
                          </span>
                        )
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-100/80 px-2.5 py-1 rounded-full">
                          <Eye className="w-4 h-4 text-indigo-600" />
                          Answer Revealed: Option {String.fromCharCode(65 + currentQ.correctOptionIndex)}
                        </span>
                      )}
                      <span className="text-xs text-slate-500 font-mono">
                        Topic {currentQ.topicId} · {currentQ.taskRef}
                      </span>
                    </div>

                    {onNavigateToTopic && (
                      <button
                        type="button"
                        onClick={() => onNavigateToTopic(currentQ.topicId)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2.5 py-1 rounded-lg transition"
                        title={`Go to Topic ${currentQ.topicId} in Quick Reference`}
                      >
                        <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Topic {currentQ.topicId} Guide</span>
                        <ExternalLink className="w-3 h-3 text-indigo-500" />
                      </button>
                    )}
                  </div>

                  {/* Authoritative Explanation */}
                  <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs leading-relaxed text-slate-800 shadow-2xs">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1.5">
                      <BookOpen className="w-4 h-4 text-indigo-600" />
                      <span>Official Exam Explanation & Architectural Rationale:</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{currentQ.explanation}</p>
                  </div>

                  {/* 🪤 Exam Trap Callout */}
                  <div className="p-4 bg-amber-50/90 rounded-xl border border-amber-200 text-xs leading-relaxed text-amber-950 shadow-2xs">
                    <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>🪤 Exam Trap & Distractor Analysis:</span>
                    </div>
                    <p className="text-amber-900/90 leading-relaxed">{currentQ.trap}</p>
                  </div>
                </div>
              );
            })()}

            {/* Navigation Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Previous (← or P)
              </button>

              {/* Jump Dropdown */}
              <div className="flex items-center gap-2">
                <select
                  value={currentQuestionIndex}
                  onChange={(e) => setCurrentQuestionIndex(Number(e.target.value))}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700 focus:outline-none"
                >
                  {filteredQuestions.map((q, idx) => {
                    const att = userProgress.questionAttempts[q.id];
                    let statusIcon = '⚪';
                    if (att) {
                      statusIcon = att.isCorrect ? '🟢' : '🔴';
                    }
                    return (
                      <option key={q.id} value={idx}>
                        {statusIcon} {q.id} ({idx + 1}/{filteredQuestions.length})
                      </option>
                    );
                  })}
                </select>
              </div>

              <button
                type="button"
                disabled={currentQuestionIndex === filteredQuestions.length - 1}
                onClick={() => setCurrentQuestionIndex((prev) => Math.min(filteredQuestions.length - 1, prev + 1))}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Next (→ or N)
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )
      ) : (
        /* ALL LIST VIEW */
        <div className="space-y-6">
          {filteredQuestions.map((q, idx) => {
            const attempt = userProgress.questionAttempts[q.id];
            const selectedIdx = selectedOptions[q.id] ?? attempt?.selectedIndex ?? null;
            const hasAnswered = selectedIdx !== null;
            const isRevealed = isStudyMode || !!revealedInPractice[q.id] || hasAnswered;
            const isBookmarked = userProgress.bookmarkedQuestionIds.includes(q.id);

            return (
              <div
                key={q.id}
                id={`q-item-${q.id}`}
                className={`bg-white rounded-xl border p-5 sm:p-6 shadow-xs transition ${
                  isStudyMode ? 'border-emerald-200 ring-1 ring-emerald-100' : 'border-slate-200'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-100">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-slate-900 text-white">
                      #{idx + 1} · {q.id}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${DOMAINS[q.domainId].badgeBg} ${DOMAINS[q.domainId].badgeBorder} border`}>
                      {q.domainId}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      Topic {q.topicId}
                    </span>

                    {/* Study Mode Indicator / Quick Reveal */}
                    {isStudyMode ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
                        <Check className="w-3 h-3 text-emerald-700" />
                        Answer: Option {String.fromCharCode(65 + q.correctOptionIndex)}
                      </span>
                    ) : (
                      !hasAnswered && (
                        <button
                          type="button"
                          onClick={() => setRevealedInPractice((prev) => ({ ...prev, [q.id]: !prev[q.id] }))}
                          className="inline-flex items-center gap-1 px-2 py-0.5 text-xs text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded transition"
                        >
                          <Eye className="w-3 h-3" />
                          <span>{revealedInPractice[q.id] ? 'Hide Key' : 'Reveal Key'}</span>
                        </button>
                      )
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {onNavigateToTopic && (
                      <button
                        type="button"
                        onClick={() => onNavigateToTopic(q.topicId)}
                        className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg border border-indigo-200 transition"
                        title={`View Topic ${q.topicId} in Reference Guide`}
                      >
                        <BookOpen className="w-3 h-3" />
                        <span>Topic {q.topicId} Ref</span>
                        <ExternalLink className="w-3 h-3 text-indigo-400" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onToggleBookmark(q.id)}
                      className={`p-1.5 rounded-lg border transition flex items-center gap-1 text-xs ${
                        isBookmarked
                          ? 'bg-amber-50 border-amber-300 text-amber-700'
                          : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
                    </button>
                  </div>
                </div>

                <h4 className="text-base font-bold text-slate-900 mb-4 leading-snug">
                  {q.question}
                </h4>

                <div className="space-y-2 mb-4">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = selectedIdx === oIdx;
                    const isCorrect = q.correctOptionIndex === oIdx;

                    let optClass = 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100';
                    if (isRevealed) {
                      if (isCorrect) {
                        optClass = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-medium shadow-2xs ring-1 ring-emerald-300';
                      } else if (isSelected && !isCorrect) {
                        optClass = 'bg-rose-50 border-rose-400 text-rose-950 font-medium';
                      } else {
                        optClass = 'bg-slate-50/50 border-slate-200 text-slate-600 opacity-75';
                      }
                    }

                    return (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() => handleSelectOption(q.id, oIdx)}
                        className={`w-full text-left p-3 rounded-lg border text-xs flex items-start gap-2.5 transition ${optClass}`}
                      >
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5 ${
                            isRevealed && isCorrect
                              ? 'bg-emerald-600 text-white'
                              : isRevealed && isSelected && !isCorrect
                              ? 'bg-rose-600 text-white'
                              : isSelected
                              ? 'bg-indigo-600 text-white'
                              : 'bg-white border border-slate-300 text-slate-700'
                          }`}
                        >
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <div className="flex-1">
                          <span>{opt}</span>
                          {isRevealed && isCorrect && (
                            <span className="ml-2 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300">
                              <Check className="w-2.5 h-2.5 text-emerald-700" />
                              Correct Answer
                            </span>
                          )}
                          {isRevealed && isSelected && !isCorrect && (
                            <span className="ml-2 text-[11px] font-bold text-rose-700">✗ Your Choice</span>
                          )}
                          {isStudyMode && !isCorrect && (
                            <span className="ml-2 text-[10px] font-mono text-slate-400">(Distractor)</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation & Trap Breakdown */}
                {isRevealed && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-3 mt-4">
                    <div className="p-3 bg-white rounded-lg border border-slate-200 text-slate-800">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1">
                        <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Official Exam Explanation:</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{q.explanation}</p>
                    </div>

                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-950">
                      <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        <span>🪤 Exam Trap & Distractor Analysis:</span>
                      </div>
                      <p className="text-amber-900/90 leading-relaxed">{q.trap}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Interactive 145-Question Matrix Modal / Drawer */}
      {showMatrixModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full p-6 shadow-2xl relative max-h-[85vh] flex flex-col">
            <button
              type="button"
              onClick={() => setShowMatrixModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <LayoutGrid className="w-5 h-5 text-indigo-600" />
                  145-Question Navigator Matrix
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Jump directly to any question.
                </p>
              </div>

              {/* In-modal mode toggle */}
              <div className="flex items-center rounded-lg border border-slate-200 p-0.5 bg-slate-100 text-xs">
                <button
                  type="button"
                  onClick={() => setIsStudyMode(false)}
                  className={`px-2.5 py-1 rounded-md font-medium transition ${
                    !isStudyMode ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Practice
                </button>
                <button
                  type="button"
                  onClick={() => setIsStudyMode(true)}
                  className={`px-2.5 py-1 rounded-md font-medium transition ${
                    isStudyMode ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Answers & Explanations
                </button>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-3 py-2 border-y border-slate-100 mb-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-slate-600">Correct ({correctCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="text-slate-600">Incorrect ({answeredCount - correctCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-slate-200" />
                <span className="text-slate-600">Unanswered ({145 - answeredCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-400 ring-2 ring-amber-300" />
                <span className="text-slate-600">Bookmarked ({userProgress.bookmarkedQuestionIds.length})</span>
              </div>
            </div>

            {/* Question Grid Dots */}
            <div className="overflow-y-auto pr-1 flex-1 grid grid-cols-5 sm:grid-cols-10 gap-2">
              {ALL_QUESTIONS.map((q, idx) => {
                const att = userProgress.questionAttempts[q.id];
                const isBookmarked = userProgress.bookmarkedQuestionIds.includes(q.id);
                let btnStyle = 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200';

                if (att) {
                  if (att.isCorrect) {
                    btnStyle = 'bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-600';
                  } else {
                    btnStyle = 'bg-rose-600 text-white hover:bg-rose-700 border-rose-600';
                  }
                }

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => {
                      // Find index of this question in filtered questions, or reset filters to jump
                      const targetIdx = filteredQuestions.findIndex((fq) => fq.id === q.id);
                      if (targetIdx !== -1) {
                        setCurrentQuestionIndex(targetIdx);
                      } else {
                        // Reset filters so question is visible
                        setSelectedDomain('ALL');
                        setSelectedTopic('ALL');
                        setStatusFilter('ALL');
                        setSearchTerm('');
                        const fullIdx = ALL_QUESTIONS.findIndex((allQ) => allQ.id === q.id);
                        setCurrentQuestionIndex(Math.max(0, fullIdx));
                      }
                      setViewMode('CARD');
                      setShowMatrixModal(false);
                    }}
                    className={`h-9 rounded-lg font-mono text-xs font-bold border transition flex items-center justify-center relative ${btnStyle} ${
                      isBookmarked ? 'ring-2 ring-amber-400 ring-offset-1' : ''
                    }`}
                    title={`${q.id} (Topic ${q.topicId})`}
                  >
                    <span>{idx + 1}</span>
                    {isBookmarked && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 absolute top-1 right-1" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-right">
              <button
                type="button"
                onClick={() => setShowMatrixModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
              >
                Close Navigator
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
