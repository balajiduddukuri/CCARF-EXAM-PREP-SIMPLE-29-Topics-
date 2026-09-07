import { useState, useEffect, useMemo, useRef } from 'react';
import { PracticeQuestion, DomainId, ExamSession, UserProgress } from '../types';
import { generate60QuestionExam } from '../data/questionsData';
import { DOMAINS } from '../data/domainsData';
import {
  Timer,
  Award,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Flag,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Check,
  Pause,
  Play,
  FileCheck,
} from 'lucide-react';

interface ExamSimulatorProps {
  userProgress: UserProgress;
  onSaveExamSession: (session: ExamSession) => void;
}

export function ExamSimulator({ onSaveExamSession }: ExamSimulatorProps) {
  const [examState, setExamState] = useState<'IDLE' | 'RUNNING' | 'REVIEW_BEFORE_SUBMIT' | 'RESULT'>('IDLE');
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});
  const [secondsRemaining, setSecondsRemaining] = useState(120 * 60); // 120 minutes = 7200 seconds
  const [isPaused, setIsPaused] = useState(false);
  const [finalSession, setFinalSession] = useState<ExamSession | null>(null);
  const [reviewFilter, setReviewFilter] = useState<'ALL' | 'INCORRECT' | 'FLAGGED'>('ALL');

  const timerRef = useRef<number | null>(null);

  // Start a new 60-question exam
  const startNewExam = () => {
    const examQuestions = generate60QuestionExam();
    setQuestions(examQuestions);
    setUserAnswers({});
    setFlaggedQuestions({});
    setSecondsRemaining(120 * 60);
    setIsPaused(false);
    setCurrentIndex(0);
    setFinalSession(null);
    setExamState('RUNNING');
  };

  // Timer effect
  useEffect(() => {
    if (examState === 'RUNNING' && !isPaused) {
      timerRef.current = window.setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [examState, isPaused]);

  // Format time (MM:SS)
  const formattedTime = useMemo(() => {
    const hours = Math.floor(secondsRemaining / 3600);
    const minutes = Math.floor((secondsRemaining % 3600) / 60);
    const seconds = secondsRemaining % 60;
    if (hours > 0) {
      return `${hours}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, [secondsRemaining]);

  // Handle selecting an option during the test
  const handleSelect = (optionIdx: number) => {
    setUserAnswers((prev) => ({ ...prev, [currentIndex]: optionIdx }));
  };

  const toggleFlag = (index: number) => {
    setFlaggedQuestions((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  // Calculate final score
  const handleSubmitExam = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    let correctCount = 0;
    const domainStats: Record<DomainId, { correct: number; total: number; percentage: number }> = {
      D1: { correct: 0, total: 0, percentage: 0 },
      D2: { correct: 0, total: 0, percentage: 0 },
      D3: { correct: 0, total: 0, percentage: 0 },
      D4: { correct: 0, total: 0, percentage: 0 },
      D5: { correct: 0, total: 0, percentage: 0 },
    };

    questions.forEach((q, idx) => {
      const selected = userAnswers[idx];
      const isCorrect = selected === q.correctOptionIndex;
      domainStats[q.domainId].total += 1;
      if (isCorrect) {
        correctCount += 1;
        domainStats[q.domainId].correct += 1;
      }
    });

    (Object.keys(domainStats) as DomainId[]).forEach((dId) => {
      const d = domainStats[dId];
      d.percentage = d.total > 0 ? Math.round((d.correct / d.total) * 100) : 0;
    });

    // Score on a 1000-point scale: Passing is 720 / 1000 (72%)
    const rawRatio = questions.length > 0 ? correctCount / questions.length : 0;
    const scaledScore = Math.round(rawRatio * 1000);
    const passed = scaledScore >= 720;

    const session: ExamSession = {
      id: `exam-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      score: scaledScore,
      passed,
      totalQuestions: questions.length,
      correctCount,
      domainScores: domainStats,
      timeSpentSeconds: 120 * 60 - secondsRemaining,
      userAnswers: { ...userAnswers },
    };

    setFinalSession(session);
    onSaveExamSession(session);
    setExamState('RESULT');
  };

  const answeredCount = Object.keys(userAnswers).length;
  const currentQ = questions[currentIndex];

  /* ---------------- IDLE / START VIEW ---------------- */
  if (examState === 'IDLE') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto mb-4 text-indigo-600">
            <Award className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold text-slate-900">
            CCAF Official Mock Exam Simulator
          </h2>
          <p className="text-sm text-slate-600 mt-2 max-w-xl mx-auto">
            Experience a realistic test environment modeled on the Claude Certified Architect — Foundations exam specifications.
          </p>

          {/* Exam Specs Table */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 max-w-2xl mx-auto text-left">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase block">Questions</span>
              <strong className="text-lg font-bold text-slate-900 mt-0.5 block">60 MCQs</strong>
              <span className="text-[11px] text-slate-500">Domain weighted</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase block">Time Limit</span>
              <strong className="text-lg font-bold text-slate-900 mt-0.5 block">120 Minutes</strong>
              <span className="text-[11px] text-slate-500">2 mins / question</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase block">Passing Score</span>
              <strong className="text-lg font-bold text-emerald-600 mt-0.5 block">720 / 1000</strong>
              <span className="text-[11px] text-slate-500">72% threshold</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase block">Format</span>
              <strong className="text-lg font-bold text-slate-900 mt-0.5 block">Closed Book</strong>
              <span className="text-[11px] text-slate-500">Full trap review</span>
            </div>
          </div>

          {/* Domain Breakdown Cards */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-left max-w-2xl mx-auto">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Official Domain Weighting:
            </h3>
            <div className="space-y-2">
              {(Object.keys(DOMAINS) as DomainId[]).map((dId) => {
                const dom = DOMAINS[dId];
                return (
                  <div key={dId} className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-200/60">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{dId}:</span>
                      <span className="text-slate-700">{dom.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500">{dom.questionCountInExam} questions</span>
                      <span className="font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {dom.weight}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8">
            <button
              id="start-exam-button"
              type="button"
              onClick={startNewExam}
              className="px-8 py-3.5 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition"
            >
              Start 60-Question Timed Exam
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- RUNNING EXAM VIEW ---------------- */
  if (examState === 'RUNNING') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Top Sticky Test Controls Header */}
        <div className="bg-slate-900 text-white rounded-xl p-4 mb-6 shadow-md flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono font-bold bg-indigo-600 px-2.5 py-1 rounded">
              CCAF EXAM IN PROGRESS
            </span>
            <span className="text-sm text-slate-300">
              Question <strong className="text-white">{currentIndex + 1}</strong> of 60
            </span>
            <span className="text-xs text-slate-400">
              ({answeredCount} of 60 answered)
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Timer */}
            <div
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-mono font-bold text-sm border ${
                secondsRemaining < 15 * 60
                  ? 'bg-rose-950/80 border-rose-600 text-rose-300 animate-pulse'
                  : 'bg-slate-800 border-slate-700 text-slate-200'
              }`}
            >
              <Timer className="w-4 h-4 text-indigo-400" />
              <span>{formattedTime}</span>
            </div>

            <button
              type="button"
              onClick={() => setIsPaused(!isPaused)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 border border-slate-700"
              title={isPaused ? 'Resume exam' : 'Pause exam'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isPaused ? 'Resume' : 'Pause'}</span>
            </button>

            <button
              id="review-submit-button"
              type="button"
              onClick={() => setExamState('REVIEW_BEFORE_SUBMIT')}
              className="px-4 py-1.5 rounded-lg font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow transition"
            >
              Finish & Review
            </button>
          </div>
        </div>

        {isPaused ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center my-12">
            <Pause className="w-12 h-12 text-indigo-600 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-slate-900">Exam Paused</h3>
            <p className="text-sm text-slate-600 mt-1 mb-6">Take a breather. Your answers and time remaining are preserved.</p>
            <button
              type="button"
              onClick={() => setIsPaused(false)}
              className="px-6 py-2.5 rounded-lg font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white transition"
            >
              Resume Test
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Question Canvas */}
            <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              {/* Question Metadata Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-slate-900 text-white">
                    Q{currentIndex + 1}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${DOMAINS[currentQ.domainId].badgeBg} ${DOMAINS[currentQ.domainId].badgeBorder} border`}>
                    {currentQ.domainId} · {DOMAINS[currentQ.domainId].name}
                  </span>
                </div>

                <button
                  id={`flag-question-${currentIndex}`}
                  type="button"
                  onClick={() => toggleFlag(currentIndex)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition ${
                    flaggedQuestions[currentIndex]
                      ? 'bg-amber-50 border-amber-300 text-amber-800'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Flag className={`w-3.5 h-3.5 ${flaggedQuestions[currentIndex] ? 'fill-amber-500 text-amber-600' : ''}`} />
                  <span>{flaggedQuestions[currentIndex] ? 'Flagged for Review' : 'Flag Question'}</span>
                </button>
              </div>

              {/* Question Prompt */}
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed mb-6">
                {currentQ.question}
              </h3>

              {/* 4 Multiple Choice Options */}
              <div className="space-y-3 mb-8">
                {currentQ.options.map((option, optIdx) => {
                  const isSelected = userAnswers[currentIndex] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelect(optIdx)}
                      className={`w-full text-left p-4 rounded-xl border transition flex items-start gap-3.5 text-sm leading-relaxed ${
                        isSelected
                          ? 'bg-indigo-50/90 border-indigo-500 text-indigo-950 font-medium shadow-sm'
                          : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100 text-slate-800'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                          isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white border border-slate-300 text-slate-700'
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="flex-1">{option}</span>
                    </button>
                  );
                })}
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Previous
                </button>

                {userAnswers[currentIndex] !== undefined && (
                  <button
                    type="button"
                    onClick={() => {
                      setUserAnswers((prev) => {
                        const copy = { ...prev };
                        delete copy[currentIndex];
                        return copy;
                      });
                    }}
                    className="text-xs text-slate-500 hover:text-rose-600 font-medium underline"
                  >
                    Clear Choice
                  </button>
                )}

                <button
                  type="button"
                  disabled={currentIndex === questions.length - 1}
                  onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Next
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Question Palette Grid */}
            <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-5 shadow-sm h-fit">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center justify-between">
                <span>Question Palette</span>
                <span className="text-indigo-600 font-semibold">{answeredCount}/60 Answered</span>
              </h4>

              {/* Legend */}
              <div className="flex items-center gap-3 text-[11px] text-slate-500 mb-4 pb-3 border-b border-slate-100">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-indigo-600" /> Answered
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-amber-400" /> Flagged
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-slate-100 border border-slate-300" /> Unanswered
                </span>
              </div>

              {/* 60 Questions Button Matrix */}
              <div className="grid grid-cols-6 sm:grid-cols-10 lg:grid-cols-6 gap-1.5">
                {questions.map((_, qIdx) => {
                  const isCurrent = currentIndex === qIdx;
                  const isAnswered = userAnswers[qIdx] !== undefined;
                  const isFlagged = flaggedQuestions[qIdx] ?? false;

                  let btnStyle = 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100';
                  if (isCurrent) {
                    btnStyle = 'ring-2 ring-indigo-600 font-bold bg-indigo-50 border-indigo-400 text-indigo-950';
                  } else if (isFlagged) {
                    btnStyle = 'bg-amber-100 border-amber-300 text-amber-950 font-semibold';
                  } else if (isAnswered) {
                    btnStyle = 'bg-indigo-600 text-white font-medium border-indigo-700';
                  }

                  return (
                    <button
                      key={qIdx}
                      id={`palette-btn-${qIdx}`}
                      type="button"
                      onClick={() => setCurrentIndex(qIdx)}
                      className={`h-8 rounded-lg border text-xs flex items-center justify-center transition ${btnStyle}`}
                    >
                      {qIdx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Submit Button in Sidebar */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setExamState('REVIEW_BEFORE_SUBMIT')}
                  className="w-full py-2.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition flex items-center justify-center gap-1.5 shadow"
                >
                  <FileCheck className="w-4 h-4" />
                  Submit All 60 Answers
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ---------------- REVIEW BEFORE SUBMIT MODAL / SCREEN ---------------- */
  if (examState === 'REVIEW_BEFORE_SUBMIT') {
    const unansweredCount = 60 - answeredCount;
    const flaggedCount = Object.values(flaggedQuestions).filter(Boolean).length;

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Confirm Exam Submission
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mb-6">
            Review your completion status before officially submitting your exam for scoring.
          </p>

          <div className="grid grid-cols-3 gap-4 mb-6 text-center">
            <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100">
              <span className="text-xs text-indigo-700 font-medium">Answered</span>
              <strong className="text-2xl font-bold text-indigo-950 block mt-1">{answeredCount}</strong>
            </div>
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-100">
              <span className="text-xs text-rose-700 font-medium">Unanswered</span>
              <strong className="text-2xl font-bold text-rose-950 block mt-1">{unansweredCount}</strong>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
              <span className="text-xs text-amber-700 font-medium">Flagged</span>
              <strong className="text-2xl font-bold text-amber-950 block mt-1">{flaggedCount}</strong>
            </div>
          </div>

          {unansweredCount > 0 && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 mb-6 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                You still have <strong>{unansweredCount} unanswered questions</strong>. Unanswered questions will be scored as incorrect.
              </span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setExamState('RUNNING')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
            >
              Return to Exam & Answer More
            </button>
            <button
              id="confirm-submit-exam-btn"
              type="button"
              onClick={handleSubmitExam}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow transition"
            >
              Confirm & Grade Exam
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- RESULTS & IN-DEPTH REVIEW VIEW ---------------- */
  if (examState === 'RESULT' && finalSession) {
    const isPassed = finalSession.passed;

    const filteredReviewQuestions = questions.filter((q, idx) => {
      const selected = finalSession.userAnswers[idx];
      const isCorrect = selected === q.correctOptionIndex;
      const isFlagged = flaggedQuestions[idx] ?? false;

      if (reviewFilter === 'INCORRECT' && isCorrect) return false;
      if (reviewFilter === 'FLAGGED' && !isFlagged) return false;
      return true;
    });

    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Pass / Fail Banner */}
        <div
          className={`rounded-2xl border p-8 shadow-sm text-center mb-8 ${
            isPassed
              ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
              : 'bg-rose-50/80 border-rose-300 text-rose-950'
          }`}
        >
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-white ${
              isPassed ? 'bg-emerald-600' : 'bg-rose-600'
            }`}
          >
            {isPassed ? <Check className="w-9 h-9" /> : <XCircle className="w-9 h-9" />}
          </div>

          <span className="text-xs uppercase tracking-widest font-bold opacity-80 block mb-1">
            Exam Result
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight">
            {isPassed ? 'PASSED — CONGRATULATIONS!' : 'NEEDS MORE STUDY — FAILED'}
          </h2>
          <p className="text-sm mt-1 opacity-90 max-w-md mx-auto">
            {isPassed
              ? 'You met or exceeded the 720 / 1000 passing threshold required for CCAF certification.'
              : 'You scored below the 720 / 1000 passing mark. Review your incorrect answers and study traps below.'}
          </p>

          {/* Quick Score Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 max-w-xl mx-auto">
            <div className="p-3 bg-white/90 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase block">Scaled Score</span>
              <strong className="text-xl font-bold text-slate-900 block mt-0.5">
                {finalSession.score} / 1000
              </strong>
            </div>
            <div className="p-3 bg-white/90 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase block">Raw Accuracy</span>
              <strong className="text-xl font-bold text-slate-900 block mt-0.5">
                {Math.round((finalSession.correctCount / 60) * 100)}%
              </strong>
            </div>
            <div className="p-3 bg-white/90 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase block">Correct Questions</span>
              <strong className="text-xl font-bold text-slate-900 block mt-0.5">
                {finalSession.correctCount} / 60
              </strong>
            </div>
            <div className="p-3 bg-white/90 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase block">Time Elapsed</span>
              <strong className="text-xl font-bold text-slate-900 block mt-0.5">
                {Math.floor(finalSession.timeSpentSeconds / 60)}m {finalSession.timeSpentSeconds % 60}s
              </strong>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={startNewExam}
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-slate-900 hover:bg-slate-800 text-white transition flex items-center gap-1.5 shadow"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Retake Another 60-Q Simulation
            </button>
          </div>
        </div>

        {/* Domain-by-Domain Scorecard */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-8">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-4">
            Domain-by-Domain Performance Breakdown
          </h3>
          <div className="space-y-4">
            {(Object.keys(finalSession.domainScores) as DomainId[]).map((dId) => {
              const stat = finalSession.domainScores[dId];
              const dom = DOMAINS[dId];
              const domainPassed = stat.percentage >= 72;

              return (
                <div key={dId} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{dId}:</span>
                      <span className="text-slate-700">{dom.name}</span>
                      <span className="text-slate-400">({dom.weight}% of exam)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-600">
                        {stat.correct} / {stat.total}
                      </span>
                      <strong className={`font-bold ${domainPassed ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {stat.percentage}%
                      </strong>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        domainPassed ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${stat.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* In-Depth Question-by-Question Review */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-900">
              Exam Review & Distractor Analysis ({filteredReviewQuestions.length} questions)
            </h3>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setReviewFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  reviewFilter === 'ALL' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All 60
              </button>
              <button
                type="button"
                onClick={() => setReviewFilter('INCORRECT')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  reviewFilter === 'INCORRECT' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Mistakes Only ({60 - finalSession.correctCount})
              </button>
              <button
                type="button"
                onClick={() => setReviewFilter('FLAGGED')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  reviewFilter === 'FLAGGED' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Flagged
              </button>
            </div>
          </div>

          {filteredReviewQuestions.map((q) => {
            const originalIndex = questions.findIndex((item) => item.id === q.id);
            const userSelected = finalSession.userAnswers[originalIndex];
            const isCorrect = userSelected === q.correctOptionIndex;

            return (
              <div
                key={q.id}
                className={`bg-white rounded-xl border p-6 shadow-sm transition ${
                  isCorrect ? 'border-slate-200' : 'border-rose-300 bg-rose-50/20'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-slate-900 text-white">
                      #{originalIndex + 1} · {q.id}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${DOMAINS[q.domainId].badgeBg} ${DOMAINS[q.domainId].badgeBorder} border`}>
                      {q.domainId}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      Topic {q.topicId}
                    </span>
                  </div>

                  <div>
                    {isCorrect ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full">
                        <XCircle className="w-3.5 h-3.5" /> Incorrect
                      </span>
                    )}
                  </div>
                </div>

                <h4 className="text-base font-bold text-slate-900 mb-4 leading-snug">
                  {q.question}
                </h4>

                {/* Options Review */}
                <div className="space-y-2 mb-4">
                  {q.options.map((opt, optIdx) => {
                    const isOptionCorrect = q.correctOptionIndex === optIdx;
                    const isUserChoice = userSelected === optIdx;

                    let optClass = 'bg-slate-50/60 border-slate-200 text-slate-600 opacity-60';
                    if (isOptionCorrect) {
                      optClass = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-medium opacity-100';
                    } else if (isUserChoice && !isOptionCorrect) {
                      optClass = 'bg-rose-50 border-rose-400 text-rose-950 font-medium opacity-100';
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`p-3 rounded-lg border text-xs flex items-start gap-3 ${optClass}`}
                      >
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5 ${
                            isOptionCorrect
                              ? 'bg-emerald-600 text-white'
                              : isUserChoice && !isOptionCorrect
                              ? 'bg-rose-600 text-white'
                              : 'bg-white border border-slate-300 text-slate-600'
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <div className="flex-1">
                          <span>{opt}</span>
                          {isOptionCorrect && (
                            <span className="ml-2 font-bold text-emerald-700">✓ Correct Answer</span>
                          )}
                          {isUserChoice && !isOptionCorrect && (
                            <span className="ml-2 font-bold text-rose-700">✗ Your Choice</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Explanation & Trap Box */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <p className="text-slate-800">
                    <strong className="text-slate-900 font-semibold">Explanation:</strong> {q.explanation}
                  </p>
                  <p className="text-amber-950 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                    <strong className="font-bold">🪤 Exam Trap:</strong> {q.trap}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
}
