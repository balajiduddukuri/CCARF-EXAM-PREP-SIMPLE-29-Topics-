import { useState, useEffect } from 'react';
import { UserProgress, ExamSession } from './types';
import { Header, ActiveTabType } from './components/Header';
import { TopicsView } from './components/TopicsView';
import { QuestionBankView } from './components/QuestionBankView';
import { ExamSimulator } from './components/ExamSimulator';
import { ExamTriggersView } from './components/ExamTriggersView';
import { ReadinessDashboard } from './components/ReadinessDashboard';
import { CandidateFeedbackView } from './components/CandidateFeedbackView';
import { GlossaryView } from './components/GlossaryView';
import { ExpertReviewView } from './components/ExpertReviewView';

const STORAGE_KEY = 'ccaf_exam_prep_user_progress_v1';

const defaultProgress: UserProgress = {
  reviewedQAs: [],
  questionAttempts: {},
  bookmarkedQuestionIds: [],
  examHistory: [],
};

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTabType>('topics');
  const [searchQuery, setSearchQuery] = useState('');
  const [initialTopicFilter, setInitialTopicFilter] = useState<number | null>(null);

  // Global Keyboard Shortcuts for Tab Switching (1 - 8)
  useEffect(() => {
    const handleTabKeyDown = (e: KeyboardEvent) => {
      // Don't switch if typing in input/textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }
      switch (e.key) {
        case '1':
          setActiveTab('topics');
          break;
        case '2':
          setActiveTab('questions');
          break;
        case '3':
          setActiveTab('exam');
          break;
        case '4':
          setActiveTab('cheatSheet');
          break;
        case '5':
          setActiveTab('expertReview');
          break;
        case '6':
          setActiveTab('feedback');
          break;
        case '7':
          setActiveTab('glossary');
          break;
        case '8':
          setActiveTab('progress');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleTabKeyDown);
    return () => window.removeEventListener('keydown', handleTabKeyDown);
  }, []);

  // Load progress from localStorage
  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return defaultProgress;
  });

  // Save progress to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userProgress));
    } catch {
      // ignore
    }
  }, [userProgress]);

  // Actions
  const toggleReviewQA = (qaId: string) => {
    setUserProgress((prev) => {
      const isReviewed = prev.reviewedQAs.includes(qaId);
      return {
        ...prev,
        reviewedQAs: isReviewed
          ? prev.reviewedQAs.filter((id) => id !== qaId)
          : [...prev.reviewedQAs, qaId],
      };
    });
  };

  const handleRecordAttempt = (questionId: string, selectedIndex: number, isCorrect: boolean) => {
    setUserProgress((prev) => ({
      ...prev,
      questionAttempts: {
        ...prev.questionAttempts,
        [questionId]: {
          selectedIndex,
          isCorrect,
          timestamp: Date.now(),
        },
      },
    }));
  };

  const handleToggleBookmark = (questionId: string) => {
    setUserProgress((prev) => {
      const isBookmarked = prev.bookmarkedQuestionIds.includes(questionId);
      return {
        ...prev,
        bookmarkedQuestionIds: isBookmarked
          ? prev.bookmarkedQuestionIds.filter((id) => id !== questionId)
          : [...prev.bookmarkedQuestionIds, questionId],
      };
    });
  };

  const handleSaveExamSession = (session: ExamSession) => {
    setUserProgress((prev) => ({
      ...prev,
      examHistory: [session, ...prev.examHistory],
    }));
  };

  const handleResetAttempts = () => {
    setUserProgress((prev) => ({
      ...prev,
      questionAttempts: {},
    }));
  };

  const handleResetAllProgress = () => {
    setUserProgress(defaultProgress);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handlePracticeTopic = (topicId: number) => {
    setInitialTopicFilter(topicId);
    setActiveTab('questions');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Header & Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'questions') {
            setInitialTopicFilter(null);
          }
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        userProgress={userProgress}
      />

      {/* Main View Display */}
      <main className="flex-1 pb-16">
        {activeTab === 'topics' && (
          <TopicsView
            searchQuery={searchQuery}
            userProgress={userProgress}
            toggleReviewQA={toggleReviewQA}
            onPracticeTopic={handlePracticeTopic}
          />
        )}

        {activeTab === 'questions' && (
          <QuestionBankView
            initialTopicFilter={initialTopicFilter}
            onClearTopicFilter={() => setInitialTopicFilter(null)}
            userProgress={userProgress}
            onRecordAttempt={handleRecordAttempt}
            onToggleBookmark={handleToggleBookmark}
            onResetAttempts={handleResetAttempts}
          />
        )}

        {activeTab === 'exam' && (
          <ExamSimulator
            userProgress={userProgress}
            onSaveExamSession={handleSaveExamSession}
          />
        )}

        {activeTab === 'cheatSheet' && (
          <ExamTriggersView onPracticeTopic={handlePracticeTopic} />
        )}

        {activeTab === 'feedback' && (
          <CandidateFeedbackView onPracticeTopic={handlePracticeTopic} />
        )}

        {activeTab === 'glossary' && (
          <GlossaryView />
        )}

        {activeTab === 'expertReview' && (
          <ExpertReviewView
            onPracticeTopic={handlePracticeTopic}
            onNavigateToTab={(tab) => {
              setActiveTab(tab as ActiveTabType);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'progress' && (
          <ReadinessDashboard
            userProgress={userProgress}
            onNavigateToTab={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onResetAllProgress={handleResetAllProgress}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-medium text-slate-700">
            Claude Certified Architect: Foundations (CCAR-F / CCAF) Reference Guide & Exam Simulator
          </p>
          <p className="mt-1 text-slate-400">
            Aligned with official syllabus: 5 Domains (D1 27%, D2 18%, D3 20%, D4 20%, D5 15%) · 29 Topics · 145 Verified Scenario Questions · 720/1000 Passing Score
          </p>
        </div>
      </footer>
    </div>
  );
}
