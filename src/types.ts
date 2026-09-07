export type DomainId = 'D1' | 'D2' | 'D3' | 'D4' | 'D5';

export interface DomainInfo {
  id: DomainId;
  name: string;
  weight: number; // percentage e.g. 27 for 27%
  questionCountInExam: number;
  description: string;
  color: string;
  badgeBg: string;
  badgeBorder: string;
}

export interface TopicQA {
  id: string; // e.g. "1-1"
  question: string;
  answer: string;
  trap: string;
}

export interface ScenarioMapping {
  scenarioNumber: 1 | 2 | 3 | 4 | 5 | 6;
  scenarioName: string;
  architectTestFocus: string;
}

export interface StudyFocusDetails {
  principle: string;
  example: string;
  analogy: string;
  scenarioMapping: ScenarioMapping;
}

export interface TopicData {
  id: number; // 1 to 29
  domainId: DomainId;
  taskRef: string; // e.g. "Task 1.1"
  title: string;
  studyFocus: string;
  studyFocusDetails?: StudyFocusDetails;
  keys: string[];
  isGap: boolean; // Indicates one of the 5 identified critical gaps
  gapDetails?: {
    originalIssue: string;
    gapResolved: string;
    actionableTakeaway: string;
  };
  deepDive: {
    coreConcept: string;
    keyMechanism: string;
    safeguardsOrGuidelines: string;
    antiPatterns: string[];
    examTrigger: string;
  };
  qa: TopicQA[];
}

export interface PracticeQuestion {
  id: string; // "Q1.1", "Q1.2", etc.
  topicId: number;
  domainId: DomainId;
  taskRef: string;
  question: string;
  options: string[]; // exactly 4 options
  correctOptionIndex: number; // 0-indexed (0 to 3)
  explanation: string;
  trap: string;
}

export interface ExamSession {
  id: string;
  date: string;
  score: number; // 0 to 1000
  passed: boolean; // score >= 720
  totalQuestions: number;
  correctCount: number;
  domainScores: Record<DomainId, { correct: number; total: number; percentage: number }>;
  timeSpentSeconds: number;
  userAnswers: Record<number, number>; // question index -> selected option index
}

export interface UserProgress {
  reviewedQAs: string[]; // list of TopicQA IDs marked reviewed
  completedTopicDeepDives?: number[]; // topic IDs
  bookmarkedQuestionIds: string[]; // Question IDs bookmarked
  questionAttempts: Record<string, { selectedIndex: number; isCorrect: boolean; timestamp: number }>;
  examHistory: ExamSession[];
  examSessions?: ExamSession[];
}
