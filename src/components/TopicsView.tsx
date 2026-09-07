import { useState, useMemo } from 'react';
import { TopicData, DomainId, UserProgress } from '../types';
import { TOPICS_DATA } from '../data/topicsData';
import { DOMAINS } from '../data/domainsData';
import { CCARF_EXAM_SCENARIOS } from '../data/topicStudyFocusData';
import {
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  ExternalLink,
  BookOpen,
  Filter,
  Lightbulb,
  Compass,
  Cpu,
  Layers,
} from 'lucide-react';

interface TopicsViewProps {
  searchQuery: string;
  userProgress: UserProgress;
  toggleReviewQA: (qaId: string) => void;
  onPracticeTopic: (topicId: number) => void;
}

export function TopicsView({
  searchQuery,
  userProgress,
  toggleReviewQA,
  onPracticeTopic,
}: TopicsViewProps) {
  const [selectedDomain, setSelectedDomain] = useState<DomainId | 'ALL'>('ALL');
  const [selectedScenario, setSelectedScenario] = useState<number | 'ALL'>('ALL');
  const [onlyGaps, setOnlyGaps] = useState(false);
  const [expandedTopics, setExpandedTopics] = useState<Record<number, boolean>>({});
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});

  // Filter topics based on search query, domain, scenario, and gap filter
  const filteredTopics = useMemo(() => {
    return TOPICS_DATA.filter((topic) => {
      // Domain filter
      if (selectedDomain !== 'ALL' && topic.domainId !== selectedDomain) {
        return false;
      }
      // Scenario filter
      if (
        selectedScenario !== 'ALL' &&
        topic.studyFocusDetails?.scenarioMapping.scenarioNumber !== selectedScenario
      ) {
        return false;
      }
      // Gap filter
      if (onlyGaps && !topic.isGap) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = topic.title.toLowerCase().includes(query);
        const matchesFocus = topic.studyFocus.toLowerCase().includes(query);
        const matchesKeys = topic.keys.some((k) => k.toLowerCase().includes(query));
        const matchesDeepDive =
          topic.deepDive.coreConcept.toLowerCase().includes(query) ||
          topic.deepDive.examTrigger.toLowerCase().includes(query) ||
          topic.deepDive.antiPatterns.some((ap) => ap.toLowerCase().includes(query));
        const matchesQA = topic.qa.some(
          (qa) =>
            qa.question.toLowerCase().includes(query) ||
            qa.answer.toLowerCase().includes(query) ||
            qa.trap.toLowerCase().includes(query)
        );
        const matchesDetails = topic.studyFocusDetails
          ? topic.studyFocusDetails.principle.toLowerCase().includes(query) ||
            topic.studyFocusDetails.example.toLowerCase().includes(query) ||
            topic.studyFocusDetails.analogy.toLowerCase().includes(query) ||
            topic.studyFocusDetails.scenarioMapping.scenarioName.toLowerCase().includes(query) ||
            topic.studyFocusDetails.scenarioMapping.architectTestFocus.toLowerCase().includes(query)
          : false;
        return (
          matchesTitle ||
          matchesFocus ||
          matchesKeys ||
          matchesDeepDive ||
          matchesQA ||
          matchesDetails
        );
      }
      return true;
    });
  }, [selectedDomain, selectedScenario, onlyGaps, searchQuery]);

  const toggleTopicExpand = (id: number) => {
    setExpandedTopics((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const allExpanded: Record<number, boolean> = {};
    TOPICS_DATA.forEach((t) => {
      allExpanded[t.id] = true;
    });
    setExpandedTopics(allExpanded);
  };

  const collapseAll = () => {
    setExpandedTopics({});
  };

  const toggleAnswer = (qaId: string) => {
    setRevealedAnswers((prev) => ({ ...prev, [qaId]: !prev[qaId] }));
  };

  const revealAllAnswersForTopic = (topic: TopicData) => {
    setRevealedAnswers((prev) => {
      const next = { ...prev };
      topic.qa.forEach((q) => {
        next[q.id] = true;
      });
      return next;
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Controls & Domain Filter */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Domain Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Domain:
            </span>
            <button
              id="filter-domain-all"
              type="button"
              onClick={() => setSelectedDomain('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                selectedDomain === 'ALL'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All (29)
            </button>
            {(Object.keys(DOMAINS) as DomainId[]).map((dId) => {
              const dom = DOMAINS[dId];
              const count = TOPICS_DATA.filter((t) => t.domainId === dId).length;
              return (
                <button
                  key={dId}
                  id={`filter-domain-${dId}`}
                  type="button"
                  onClick={() => setSelectedDomain(dId)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                    selectedDomain === dId
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{dId}</span>
                  <span className="opacity-75 text-[11px]">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Action buttons */}
          <div className="flex items-center flex-wrap gap-2">
            <button
              id="toggle-gap-filter"
              type="button"
              onClick={() => setOnlyGaps(!onlyGaps)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 border ${
                onlyGaps
                  ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                  : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>5 Critical Gaps Only</span>
            </button>

            <button
              id="expand-all-btn"
              type="button"
              onClick={expandAll}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
            >
              Expand All
            </button>
            <button
              id="collapse-all-btn"
              type="button"
              onClick={collapseAll}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* CCAR-F 6 Exam Scenarios Filter Row */}
        <div className="mt-3.5 pt-3.5 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mr-1 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-emerald-600" /> Exam Scenario:
            </span>
            <button
              id="filter-scenario-all"
              type="button"
              onClick={() => setSelectedScenario('ALL')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                selectedScenario === 'ALL'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Scenarios
            </button>
            {CCARF_EXAM_SCENARIOS.map((sc) => {
              const count = TOPICS_DATA.filter(
                (t) => t.studyFocusDetails?.scenarioMapping.scenarioNumber === sc.number
              ).length;
              return (
                <button
                  key={sc.number}
                  id={`filter-scenario-${sc.number}`}
                  type="button"
                  onClick={() => setSelectedScenario(sc.number)}
                  title={sc.description}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                    selectedScenario === sc.number
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-emerald-50/80 text-emerald-900 hover:bg-emerald-100 border border-emerald-200/60'
                  }`}
                >
                  <span className="font-bold">S{sc.number}:</span>
                  <span className="truncate max-w-[130px] sm:max-w-[180px]">{sc.title.split(' ')[0]} {sc.title.split(' ')[1]}</span>
                  <span className="opacity-75 text-[10px]">({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Topics Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sticky Desktop Table of Contents Sidebar */}
        <div className="hidden lg:block lg:col-span-3">
          <div className="sticky top-28 bg-white rounded-xl border border-slate-200 p-4 shadow-sm max-h-[calc(100vh-140px)] overflow-y-auto">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center justify-between">
              <span>29 Study Topics</span>
              <span className="text-indigo-600 font-semibold">{filteredTopics.length} shown</span>
            </h3>
            <ul className="space-y-1 text-xs">
              {filteredTopics.map((topic) => (
                <li key={topic.id}>
                  <a
                    href={`#topic-${topic.id}`}
                    className="block py-1.5 px-2 rounded-md hover:bg-slate-100 text-slate-700 hover:text-indigo-700 truncate transition flex items-center justify-between"
                  >
                    <span className="truncate">
                      <strong className="text-slate-900 mr-1">{topic.id}.</strong>
                      {topic.title}
                    </span>
                    {topic.isGap && (
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 ml-1" title="Critical Gap Filled" />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Main Topics List */}
        <div className="lg:col-span-9 space-y-6">
          {filteredTopics.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-base font-semibold text-slate-700">No topics match your current filter</p>
              <p className="text-xs text-slate-500 mt-1">Try clearing your search query or switching domain filter to ALL.</p>
            </div>
          ) : (
            filteredTopics.map((topic) => {
              const isExpanded = expandedTopics[topic.id] ?? false;
              const reviewedInTopic = topic.qa.filter((q) => userProgress.reviewedQAs.includes(q.id)).length;

              return (
                <section
                  key={topic.id}
                  id={`topic-${topic.id}`}
                  className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-sm scroll-mt-28 transition hover:border-slate-300"
                >
                  {/* Topic Header Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center flex-wrap gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-900 text-white">
                        Topic {topic.id}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${DOMAINS[topic.domainId].badgeBg} ${DOMAINS[topic.domainId].badgeBorder} border`}>
                        {topic.domainId} · {DOMAINS[topic.domainId].name}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        {topic.taskRef}
                      </span>
                      {topic.isGap && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          <Sparkles className="w-3 h-3 text-amber-600" />
                          Critical Gap Resolved
                        </span>
                      )}
                    </div>

                    {/* Quick Topic Action */}
                    <button
                      id={`practice-topic-${topic.id}`}
                      type="button"
                      onClick={() => onPracticeTopic(topic.id)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-lg transition"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      Practice 5 Questions
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </button>
                  </div>

                  {/* Title */}
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                    {topic.title}
                  </h2>

                  {/* Elaborated Study Focus with Example, Analogy, & Scenario Mapping */}
                  <div className="mt-3.5 space-y-2.5">
                    {/* Core Architectural Directive */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/90 text-sm text-slate-700 leading-relaxed shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-800 mb-1">
                        <BookOpen className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span>Study Focus & Core Architectural Directive</span>
                      </div>
                      <p className="text-slate-700 text-xs sm:text-sm">
                        {topic.studyFocusDetails?.principle || topic.studyFocus}
                      </p>
                    </div>

                    {/* Example & Analogy Two-Column Cards */}
                    {topic.studyFocusDetails && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        {/* Real-World Implementation Example */}
                        <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200/80 text-xs flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-1.5 font-bold text-blue-900 mb-1">
                              <Cpu className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                              <span>Real-World Architectural Example</span>
                            </div>
                            <p className="text-slate-700 leading-relaxed">
                              {topic.studyFocusDetails.example}
                            </p>
                          </div>
                        </div>

                        {/* Intuitive Analogy */}
                        <div className="p-3 bg-purple-50/70 rounded-xl border border-purple-200/80 text-xs flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-1.5 font-bold text-purple-900 mb-1">
                              <Lightbulb className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                              <span>Intuitive Analogy</span>
                            </div>
                            <p className="text-slate-700 leading-relaxed">
                              {topic.studyFocusDetails.analogy}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* CCAR-F Exam Scenario Mapping & Architect Test Focus */}
                    {topic.studyFocusDetails && (
                      <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200/80 text-xs text-emerald-950">
                        <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1">
                          <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                            <Compass className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>CCAR-F Exam Scenario {topic.studyFocusDetails.scenarioMapping.scenarioNumber}: {topic.studyFocusDetails.scenarioMapping.scenarioName}</span>
                          </div>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Scenario {topic.studyFocusDetails.scenarioMapping.scenarioNumber} Target
                          </span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">
                          <strong className="text-emerald-900 font-semibold">What the Architect is Tested On:</strong>{' '}
                          {topic.studyFocusDetails.scenarioMapping.architectTestFocus}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Keywords Pill List */}
                  <div className="mt-3 flex flex-wrap gap-1.5 items-center">
                    <span className="text-xs text-slate-500 font-medium mr-1">Key concepts:</span>
                    {topic.keys.map((key) => (
                      <span
                        key={key}
                        className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-mono"
                      >
                        {key}
                      </span>
                    ))}
                  </div>

                  {/* Gap Analysis Box (if topic is a gap) */}
                  {topic.isGap && topic.gapDetails && (
                    <div className="mt-4 p-3.5 bg-amber-50/80 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1.5">
                      <div className="font-bold flex items-center gap-1.5 text-amber-950">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Gap Analysis & Exam Resolution:</span>
                      </div>
                      <p>
                        <strong className="text-amber-950">Identified Trap:</strong> {topic.gapDetails.originalIssue}
                      </p>
                      <p>
                        <strong className="text-amber-950">Resolution:</strong> {topic.gapDetails.gapResolved}
                      </p>
                      <p className="text-amber-800 font-medium bg-amber-100/70 p-1.5 rounded">
                        ⚡ <strong>Actionable Rule:</strong> {topic.gapDetails.actionableTakeaway}
                      </p>
                    </div>
                  )}

                  {/* Deep Dive Collapsible Section */}
                  <div className="mt-4 border-t border-slate-100 pt-4">
                    <div className="bg-slate-50/80 rounded-xl border border-slate-200/80 p-4 space-y-3 text-xs">
                      <div>
                        <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] block mb-0.5">
                          Core Architectural Principle
                        </span>
                        <p className="text-slate-700">{topic.deepDive.coreConcept}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-200/60">
                        <div>
                          <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] block mb-0.5">
                            Key Mechanism
                          </span>
                          <p className="text-slate-700">{topic.deepDive.keyMechanism}</p>
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] block mb-0.5">
                            Safeguards & Rules
                          </span>
                          <p className="text-slate-700">{topic.deepDive.safeguardsOrGuidelines}</p>
                        </div>
                      </div>

                      {/* Anti-Patterns List */}
                      <div className="pt-2 border-t border-slate-200/60">
                        <span className="font-bold text-rose-700 uppercase tracking-wider text-[11px] block mb-1">
                          Common Anti-Patterns (Always Wrong on Exam):
                        </span>
                        <ul className="list-none space-y-1">
                          {topic.deepDive.antiPatterns.map((ap, idx) => (
                            <li key={idx} className="flex items-start gap-1.5 text-slate-700">
                              <span className="text-rose-500 font-bold shrink-0">❌</span>
                              <span>{ap}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Exam Trigger High-Yield Box */}
                      <div className="p-2.5 rounded-lg bg-indigo-50/80 border border-indigo-100 flex items-start gap-2">
                        <span className="text-indigo-600 font-bold text-sm shrink-0">⚡</span>
                        <div>
                          <strong className="text-indigo-950 font-semibold block text-[11px] uppercase tracking-wider">
                            Direct Exam Trigger
                          </strong>
                          <p className="text-indigo-900 font-medium mt-0.5">{topic.deepDive.examTrigger}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 5 Q&A Cards Toggle */}
                  <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                    <button
                      id={`toggle-qa-topic-${topic.id}`}
                      type="button"
                      onClick={() => toggleTopicExpand(topic.id)}
                      className="flex items-center gap-2 text-xs font-semibold text-indigo-700 hover:text-indigo-900 transition"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      <span>
                        {isExpanded ? 'Hide' : 'Open'} 5 Mapped Exam Q&A Flashcards ({reviewedInTopic}/5 reviewed)
                      </span>
                    </button>

                    {isExpanded && (
                      <button
                        type="button"
                        onClick={() => revealAllAnswersForTopic(topic)}
                        className="text-[11px] text-slate-500 hover:text-slate-800 font-medium"
                      >
                        Reveal All 5 Answers
                      </button>
                    )}
                  </div>

                  {/* Expanded Q&A Cards */}
                  {isExpanded && (
                    <div className="mt-4 space-y-3 pt-2">
                      {topic.qa.map((qaItem, qIdx) => {
                        const isRevealed = revealedAnswers[qaItem.id] ?? false;
                        const isReviewed = userProgress.reviewedQAs.includes(qaItem.id);

                        return (
                          <div
                            key={qaItem.id}
                            className={`p-4 rounded-xl border transition ${
                              isReviewed
                                ? 'bg-emerald-50/40 border-emerald-200'
                                : 'bg-slate-50/50 border-slate-200'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                  Card Q{topic.id}.{qIdx + 1}
                                </span>
                                <h3 className="text-sm font-semibold text-slate-900 mt-0.5">
                                  {qaItem.question}
                                </h3>
                              </div>

                              <button
                                id={`mark-reviewed-${qaItem.id}`}
                                type="button"
                                onClick={() => toggleReviewQA(qaItem.id)}
                                className={`shrink-0 text-xs px-2.5 py-1 rounded-md font-medium transition flex items-center gap-1 ${
                                  isReviewed
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-white border border-slate-300 text-slate-600 hover:border-slate-400'
                                }`}
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>{isReviewed ? 'Reviewed ✓' : 'Mark Review'}</span>
                              </button>
                            </div>

                            {/* Show / Hide Toggle Button */}
                            <div className="mt-3">
                              <button
                                type="button"
                                onClick={() => toggleAnswer(qaItem.id)}
                                className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition underline underline-offset-2"
                              >
                                {isRevealed ? 'Hide Answer & Trap' : 'Reveal Answer & Exam Trap'}
                              </button>
                            </div>

                            {/* Revealed Answer & Trap */}
                            {isRevealed && (
                              <div className="mt-3 space-y-2 text-xs pt-2 border-t border-slate-200/60">
                                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900">
                                  <strong className="font-semibold block text-emerald-950 mb-0.5">
                                    Correct Answer:
                                  </strong>
                                  <p>{qaItem.answer}</p>
                                </div>
                                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900">
                                  <strong className="font-semibold block text-amber-950 mb-0.5 flex items-center gap-1">
                                    <span>🪤 Exam Trap to Avoid:</span>
                                  </strong>
                                  <p>{qaItem.trap}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
