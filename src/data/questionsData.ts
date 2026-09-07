import { PracticeQuestion, DomainId } from '../types';
import { QUESTIONS_PART1 } from './questionsDataPart1';
import { QUESTIONS_PART2 } from './questionsDataPart2';
import { QUESTIONS_PART3 } from './questionsDataPart3';
import { DOMAINS } from './domainsData';

export const ALL_QUESTIONS: PracticeQuestion[] = [
  ...QUESTIONS_PART1,
  ...QUESTIONS_PART2,
  ...QUESTIONS_PART3,
];

// Helper to get questions for a specific topic
export function getQuestionsByTopic(topicId: number): PracticeQuestion[] {
  return ALL_QUESTIONS.filter((q) => q.topicId === topicId);
}

// Helper to get questions by domain
export function getQuestionsByDomain(domainId: DomainId): PracticeQuestion[] {
  return ALL_QUESTIONS.filter((q) => q.domainId === domainId);
}

// Helper to generate a 60-question weighted mock exam session
export function generate60QuestionExam(): PracticeQuestion[] {
  const selected: PracticeQuestion[] = [];
  const domainTargets: Record<DomainId, number> = {
    D1: DOMAINS.D1.questionCountInExam, // 16
    D2: DOMAINS.D2.questionCountInExam, // 11
    D3: DOMAINS.D3.questionCountInExam, // 12
    D4: DOMAINS.D4.questionCountInExam, // 12
    D5: DOMAINS.D5.questionCountInExam, // 9
  };

  // Select questions per domain randomly
  (Object.keys(domainTargets) as DomainId[]).forEach((domainId) => {
    const domainQuestions = [...getQuestionsByDomain(domainId)];
    // Shuffle
    domainQuestions.sort(() => Math.random() - 0.5);
    const count = domainTargets[domainId];
    selected.push(...domainQuestions.slice(0, count));
  });

  // Shuffle final 60 questions
  return selected.sort(() => Math.random() - 0.5);
}
