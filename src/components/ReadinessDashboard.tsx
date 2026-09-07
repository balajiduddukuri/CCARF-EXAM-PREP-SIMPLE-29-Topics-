import { UserProgress, DomainId } from '../types';
import { DOMAINS } from '../data/domainsData';
import { TOPICS_DATA } from '../data/topicsData';
import { ALL_QUESTIONS } from '../data/questionsData';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  BookOpen,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';

interface ReadinessDashboardProps {
  userProgress: UserProgress;
  onNavigateToTab: (tab: 'topics' | 'questions' | 'exam' | 'cheatSheet') => void;
  onResetAllProgress: () => void;
}

export function ReadinessDashboard({
  userProgress,
  onNavigateToTab,
  onResetAllProgress,
}: ReadinessDashboardProps) {
  // Stats
  const totalCards = 145; // 29 topics * 5 cards
  const reviewedCards = userProgress.reviewedQAs.length;
  const cardsRatio = reviewedCards / totalCards;

  const totalQuestions = ALL_QUESTIONS.length;
  const answeredQuestions = Object.keys(userProgress.questionAttempts).length;
  const correctQuestions = Object.values(userProgress.questionAttempts).filter((a) => a.isCorrect).length;
  const accuracy = answeredQuestions > 0 ? Math.round((correctQuestions / answeredQuestions) * 100) : 0;

  // Domain level mastery
  const domainStats: Record<DomainId, { totalQ: number; answeredQ: number; correctQ: number; accuracy: number }> = {
    D1: { totalQ: 0, answeredQ: 0, correctQ: 0, accuracy: 0 },
    D2: { totalQ: 0, answeredQ: 0, correctQ: 0, accuracy: 0 },
    D3: { totalQ: 0, answeredQ: 0, correctQ: 0, accuracy: 0 },
    D4: { totalQ: 0, answeredQ: 0, correctQ: 0, accuracy: 0 },
    D5: { totalQ: 0, answeredQ: 0, correctQ: 0, accuracy: 0 },
  };

  ALL_QUESTIONS.forEach((q) => {
    domainStats[q.domainId].totalQ += 1;
    const att = userProgress.questionAttempts[q.id];
    if (att) {
      domainStats[q.domainId].answeredQ += 1;
      if (att.isCorrect) {
        domainStats[q.domainId].correctQ += 1;
      }
    }
  });

  (Object.keys(domainStats) as DomainId[]).forEach((dId) => {
    const s = domainStats[dId];
    s.accuracy = s.answeredQ > 0 ? Math.round((s.correctQ / s.answeredQ) * 100) : 0;
  });

  // Gaps status
  const gapTopicIds = [5, 10, 11, 16, 17];
  const reviewedGapQAs = userProgress.reviewedQAs.filter((id) =>
    gapTopicIds.some((tId) => id.startsWith(`T${tId}-`))
  ).length;
  const gapsRatio = reviewedGapQAs / 25; // 5 gaps * 5 QAs = 25

  // Overall Readiness Score (0 - 100%)
  // Weighted: 30% topic card review, 40% question accuracy, 20% mock exam performance, 10% critical gaps
  const bestMockExam = userProgress.examHistory.length > 0
    ? Math.max(...userProgress.examHistory.map((h) => h.score))
    : 0;
  const examReadiness = bestMockExam / 1000;

  const readinessScore = Math.min(
    100,
    Math.round(
      cardsRatio * 25 +
      (answeredQuestions > 0 ? (accuracy / 100) * 35 : 0) +
      examReadiness * 25 +
      gapsRatio * 15
    )
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Top Readiness Score Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800">
                Exam Readiness Assessment
              </span>
              <span className="text-xs text-slate-500 font-mono">
                Passing standard: 72% / 720
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              CCAF Certification Readiness: {readinessScore}%
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              Calculated across your reviewed topic flashcards, 145-question bank accuracy, mock exam benchmarks, and syllabus gap mastery.
            </p>
          </div>

          {/* Big Gauge Display */}
          <div className="flex items-center gap-4 bg-slate-50 border border-slate-200/80 p-4 rounded-xl shrink-0">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-200"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={readinessScore >= 72 ? 'text-emerald-500' : 'text-indigo-600'}
                  strokeDasharray={`${readinessScore}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute font-bold text-base text-slate-900">
                {readinessScore}%
              </span>
            </div>

            <div className="text-xs">
              <span className="text-slate-500 block">Status:</span>
              <strong className={`text-sm font-bold ${readinessScore >= 72 ? 'text-emerald-600' : 'text-amber-600'}`}>
                {readinessScore >= 72 ? 'Exam Ready 🚀' : 'Preparation in Progress'}
              </strong>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Target: ≥ 72%
              </span>
            </div>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase block">Topic Flashcards</span>
            <strong className="text-xl font-bold text-slate-900 mt-1 block">
              {reviewedCards} / {totalCards}
            </strong>
            <span className="text-[11px] text-slate-500">
              {Math.round(cardsRatio * 100)}% completed
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase block">Questions Answered</span>
            <strong className="text-xl font-bold text-slate-900 mt-1 block">
              {answeredQuestions} / {totalQuestions}
            </strong>
            <span className="text-[11px] text-slate-500">
              {accuracy}% accuracy
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase block">Critical Gaps</span>
            <strong className="text-xl font-bold text-amber-600 mt-1 block">
              {reviewedGapQAs} / 25
            </strong>
            <span className="text-[11px] text-slate-500">
              5 topics mastered
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase block">Best Mock Score</span>
            <strong className="text-xl font-bold text-indigo-600 mt-1 block">
              {bestMockExam > 0 ? `${bestMockExam} / 1000` : 'None taken'}
            </strong>
            <span className="text-[11px] text-slate-500">
              {userProgress.examHistory.length} mock attempts
            </span>
          </div>
        </div>
      </div>

      {/* Domain Readiness Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-indigo-600" />
          <span>Domain-by-Domain Preparedness</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {(Object.keys(domainStats) as DomainId[]).map((dId) => {
            const stat = domainStats[dId];
            const dom = DOMAINS[dId];
            const isPassing = stat.accuracy >= 72;

            return (
              <div key={dId} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-slate-900">{dId}</span>
                    <span className="text-[11px] font-semibold text-slate-500">{dom.weight}% weight</span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium line-clamp-1 mb-3">
                    {dom.name}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Accuracy</span>
                    <strong className={stat.answeredQ === 0 ? 'text-slate-400' : isPassing ? 'text-emerald-600' : 'text-rose-600'}>
                      {stat.answeredQ === 0 ? '—' : `${stat.accuracy}%`}
                    </strong>
                  </div>

                  <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        stat.answeredQ === 0 ? 'bg-slate-300' : isPassing ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${stat.answeredQ === 0 ? 0 : stat.accuracy}%` }}
                    />
                  </div>

                  <div className="text-[11px] text-slate-500 text-right">
                    {stat.answeredQ} / {stat.totalQ} answered
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mock Exam History Table */}
      {userProgress.examHistory.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-600" />
            <span>Mock Exam History</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <th className="p-3">Date</th>
                  <th className="p-3">Result</th>
                  <th className="p-3">Scaled Score</th>
                  <th className="p-3">Correct</th>
                  <th className="p-3">Time Spent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {userProgress.examHistory.map((session) => (
                  <tr key={session.id} className="hover:bg-slate-50">
                    <td className="p-3 text-slate-700">{session.date}</td>
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                          session.passed
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {session.passed ? 'PASSED' : 'FAILED'}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-slate-900">{session.score} / 1000</td>
                    <td className="p-3 text-slate-600">
                      {session.correctCount} / {session.totalQuestions} ({Math.round((session.correctCount / session.totalQuestions) * 100)}%)
                    </td>
                    <td className="p-3 text-slate-600">
                      {Math.floor(session.timeSpentSeconds / 60)}m {session.timeSpentSeconds % 60}s
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recommended Next Actions */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>Recommended Next Study Actions</span>
        </h3>
        <p className="text-xs text-slate-300 mb-6">
          Tailored suggestions based on your study telemetry and current score thresholds.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => onNavigateToTab('cheatSheet')}
            className="p-4 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-left transition"
          >
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-1">
              <Sparkles className="w-4 h-4" /> 1. Master the 5 Gaps
            </div>
            <p className="text-xs text-slate-300">
              Review the 5 high-yield syllabus gaps and trap resolutions before taking tests.
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigateToTab('questions')}
            className="p-4 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-left transition"
          >
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold mb-1">
              <HelpCircle className="w-4 h-4" /> 2. Practice Question Bank
            </div>
            <p className="text-xs text-slate-300">
              Work through the 145 scenario questions with instant answer feedback and trap notes.
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigateToTab('exam')}
            className="p-4 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-left transition"
          >
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-1">
              <Award className="w-4 h-4" /> 3. 60-Q Timed Simulation
            </div>
            <p className="text-xs text-slate-300">
              Test your exam pacing with the full 120-minute closed-book simulation.
            </p>
          </button>
        </div>

        {/* Reset Progress Button */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Are you sure you want to reset all study progress, question attempts, and mock exam history?')) {
                onResetAllProgress();
              }
            }}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-400 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Progress Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}
