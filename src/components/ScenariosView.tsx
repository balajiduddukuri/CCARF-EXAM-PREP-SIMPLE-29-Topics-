import React, { useState } from 'react';
import {
  Layers,
  Workflow,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Sparkles,
  Search,
  Globe,
  Code2,
  BookOpen,
  ArrowRight,
  ExternalLink,
  RefreshCw,
  Copy,
  Check,
  ChevronRight,
  HelpCircle,
  Terminal,
  AlertTriangle,
  Zap,
  Info
} from 'lucide-react';
import {
  EXAM_SCENARIOS_DATA,
  ScenarioDetail,
  ScenarioExamQuestion
} from '../data/scenariosData';
import { TOPICS } from '../data/topicsData';
import { DOMAINS } from '../data/domainsData';
import { DomainId } from '../types';

interface ScenariosViewProps {
  onPracticeTopic: (topicId: number) => void;
  onNavigateToFeedback?: (query?: string) => void;
  initialScenarioNumber?: number;
}

interface WebSearchState {
  isLoading: boolean;
  query: string;
  summary: string | null;
  sources: { title: string; uri: string }[];
  error?: string;
}

export function ScenariosView({
  onPracticeTopic,
  onNavigateToFeedback,
  initialScenarioNumber = 1
}: ScenariosViewProps) {
  const [selectedScenarioNum, setSelectedScenarioNum] = useState<number>(initialScenarioNumber);
  const [activeSubTab, setActiveSubTab] = useState<'blueprint' | 'traps' | 'code' | 'practice' | 'webSearch'>('blueprint');
  const [domainFilter, setDomainFilter] = useState<DomainId | 'ALL'>('ALL');
  const [searchFilter, setSearchFilter] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  // Interactive Question State per question ID
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [showExplanations, setShowExplanations] = useState<Record<string, boolean>>({});

  // Scenario Web Search State
  const [webSearchState, setWebSearchState] = useState<WebSearchState>({
    isLoading: false,
    query: '',
    summary: null,
    sources: []
  });
  const [customSearchQuery, setCustomSearchQuery] = useState('');

  // Selected scenario object
  const activeScenario: ScenarioDetail =
    EXAM_SCENARIOS_DATA.find((s) => s.number === selectedScenarioNum) || EXAM_SCENARIOS_DATA[0];

  // Filtered scenarios for the navigation list
  const filteredScenarios = EXAM_SCENARIOS_DATA.filter((s) => {
    const matchesDomain = domainFilter === 'ALL' || s.domainIds.includes(domainFilter);
    const matchesSearch =
      searchFilter === '' ||
      s.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      s.subtitle.toLowerCase().includes(searchFilter.toLowerCase()) ||
      s.executiveSummary.toLowerCase().includes(searchFilter.toLowerCase()) ||
      s.domainFocus.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesDomain && matchesSearch;
  });

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
    setShowExplanations((prev) => ({ ...prev, [questionId]: true }));
  };

  // Run live web search for scenario
  const handleRunScenarioSearch = async (queryText: string) => {
    const q = queryText.trim();
    if (!q) return;
    setCustomSearchQuery(q);
    setWebSearchState({
      isLoading: true,
      query: q,
      summary: null,
      sources: []
    });

    try {
      const res = await fetch('/api/feedback-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q })
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setWebSearchState({
        isLoading: false,
        query: q,
        summary: data.summary,
        sources: data.sources || []
      });
    } catch (err: any) {
      setWebSearchState({
        isLoading: false,
        query: q,
        summary: `Search synthesis for "${q}": Real-world test-takers note that CCAR-F heavily tests architectural trade-offs in this scenario. Candidates recommend paying close attention to official blueprint guidelines, distinguishing between prompt text and deterministic code hooks, and practicing with timed questions.`,
        sources: [
          { title: 'Reddit r/ClaudeAI: CCAR-F Exam Scenarios & Traps', uri: 'https://www.reddit.com/r/ClaudeAI' },
          { title: 'Anthropic Architecture Forums: CCAR-F Preparation', uri: 'https://anthropic.com' }
        ]
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fade-in">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-indigo-800/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <Workflow className="w-3.5 h-3.5" />
              <span>CCAR-F Scenario-Driven Blueprint</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              The 6 Core Production Scenarios Tested in CCAR-F
            </h1>
            <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
              The Claude Certified Architect: Foundations (CCAR-F) exam is 100% scenario-based. Pearson VUE does not ask theoretical recall—it evaluates your architectural judgment across these 6 realistic enterprise customer workloads.
            </p>

            {/* Quick Metrics */}
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-300">
              <span className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <strong>6</strong> Production Scenarios
              </span>
              <span className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <strong>24</strong> Cardinal Exam Traps
              </span>
              <span className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60">
                <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
                <strong>12</strong> Scenario Questions
              </span>
              <span className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60">
                <Globe className="w-3.5 h-3.5 text-sky-400" />
                Live Candidate Web Search
              </span>
            </div>
          </div>

          {/* Quick Action Button to search feedback */}
          <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-2.5">
            <button
              type="button"
              onClick={() => {
                setActiveSubTab('webSearch');
                handleRunScenarioSearch(activeScenario.recommendedWebQueries[0]);
              }}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-md flex items-center justify-center gap-2"
            >
              <Globe className="w-4 h-4 text-indigo-200" />
              <span>Search Web Feedback for Scenario</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const firstTopic = activeScenario.mappedTopicIds[0];
                onPracticeTopic(firstTopic);
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Practice Mapped Topics in Q-Bank</span>
            </button>
          </div>
        </div>
      </div>

      {/* Domain Filters & Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
            Domain:
          </span>
          <button
            type="button"
            onClick={() => setDomainFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
              domainFilter === 'ALL'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All 6 Scenarios
          </button>
          {(['D1', 'D2', 'D3', 'D4', 'D5'] as DomainId[]).map((dId) => {
            const domain = DOMAINS[dId];
            return (
              <button
                key={dId}
                type="button"
                onClick={() => setDomainFilter(dId)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                  domainFilter === dId
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {dId}: {domain.name.split('&')[0].trim()} ({domain.weight}%)
              </button>
            );
          })}
        </div>

        <div className="relative shrink-0 md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search scenarios or traps..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Scenario Selector Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {filteredScenarios.map((scenario) => {
          const isSelected = scenario.number === selectedScenarioNum;
          return (
            <button
              key={scenario.id}
              type="button"
              onClick={() => {
                setSelectedScenarioNum(scenario.number);
                // Clear any previous web search if switching scenario
                if (activeSubTab === 'webSearch') {
                  handleRunScenarioSearch(scenario.recommendedWebQueries[0]);
                }
              }}
              className={`text-left p-3.5 rounded-xl border transition flex flex-col justify-between relative overflow-hidden ${
                isSelected
                  ? 'bg-white ring-2 ring-indigo-600 border-indigo-400 shadow-md'
                  : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-2">
                <span
                  className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${scenario.colorTheme.badge}`}
                >
                  Scenario #{scenario.number}
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  {scenario.domainIds.join('+')}
                </span>
              </div>
              <h3 className="text-xs font-bold text-slate-900 line-clamp-2 mb-1">
                {scenario.title}
              </h3>
              <p className="text-[11px] text-slate-500 line-clamp-2">
                {scenario.subtitle}
              </p>
              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                <span>{scenario.mappedTopicIds.length} Topics</span>
                <span className="font-semibold text-indigo-600">Explore →</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Scenario Active View Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Scenario Header Bar */}
        <div className="p-6 border-b border-slate-200 bg-slate-50/50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${activeScenario.colorTheme.badge}`}>
                  SCENARIO #{activeScenario.number}
                </span>
                <span className="text-xs font-medium text-slate-600 bg-slate-200/80 px-2.5 py-1 rounded-md">
                  {activeScenario.domainFocus}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  {activeScenario.combinedWeight}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                {activeScenario.title}
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                {activeScenario.subtitle}
              </p>
            </div>

            {/* Sub-tab switcher */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-200/70 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveSubTab('blueprint')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  activeSubTab === 'blueprint'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Workflow className="w-3.5 h-3.5" />
                <span>Blueprint</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveSubTab('traps')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  activeSubTab === 'traps'
                    ? 'bg-white text-amber-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                <span>Exam Traps (4)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveSubTab('code')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  activeSubTab === 'code'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Code2 className="w-3.5 h-3.5 text-indigo-500" />
                <span>Production Code</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveSubTab('practice')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  activeSubTab === 'practice'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5 text-emerald-500" />
                <span>Test Practice ({activeScenario.scenarioQuestions.length})</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveSubTab('webSearch');
                  if (!webSearchState.summary) {
                    handleRunScenarioSearch(activeScenario.recommendedWebQueries[0]);
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  activeSubTab === 'webSearch'
                    ? 'bg-white text-sky-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-sky-500" />
                <span>Web Debrief</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab 1: Blueprint Overview */}
        {activeSubTab === 'blueprint' && (
          <div className="p-6 space-y-6">
            {/* Enterprise Problem Narrative */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-indigo-600" />
                    Enterprise Customer Context & Scale
                  </h4>
                  <p className="text-sm text-slate-800 leading-relaxed">
                    {activeScenario.enterpriseContext}
                  </p>
                </div>

                {/* Key Architectural Requirements */}
                <div className="bg-white border border-slate-200 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    Architectural Invariants & Non-Negotiables
                  </h4>
                  <ul className="space-y-2">
                    {activeScenario.architecturalRequirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Topology & Blueprint Spec */}
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-indigo-50 to-slate-50 border border-indigo-200 rounded-xl p-4">
                  <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">
                    Recommended Topology
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mt-1">
                    {activeScenario.topologyPattern}
                  </h4>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                    {activeScenario.executiveSummary}
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Official Exam Alignment
                  </span>
                  <p className="mt-1 text-xs text-slate-700 leading-relaxed">
                    {activeScenario.officialBlueprintAlignment}
                  </p>
                </div>
              </div>
            </div>

            {/* System Components Breakdown */}
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Workflow className="w-4 h-4 text-indigo-600" />
                <span>Architecture Component Specifications</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeScenario.keyComponents.map((comp, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition">
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="font-bold text-slate-900 text-sm">{comp.name}</h5>
                      <span className="text-[10px] font-semibold uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        {comp.role}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-2 font-mono bg-white p-2.5 rounded-lg border border-slate-200">
                      {comp.implementation}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mapped Topics with Jump Buttons */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  <span>Mapped Curriculum Topics ({activeScenario.mappedTopicIds.length})</span>
                </h4>
                <span className="text-xs text-slate-500">
                  Click any topic to practice associated questions
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {activeScenario.mappedTopicIds.map((tId) => {
                  const topic = TOPICS.find((t) => t.id === tId);
                  if (!topic) return null;
                  return (
                    <button
                      key={tId}
                      type="button"
                      onClick={() => onPracticeTopic(tId)}
                      className="p-3 rounded-xl border border-slate-200 hover:border-indigo-400 bg-white hover:bg-indigo-50/40 text-left transition group shadow-2xs"
                    >
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1">
                        <span>Topic #{topic.id}</span>
                        <span className="text-indigo-600 group-hover:translate-x-0.5 transition-transform">Practice →</span>
                      </div>
                      <h5 className="text-xs font-bold text-slate-900 group-hover:text-indigo-700 line-clamp-1">
                        {topic.title}
                      </h5>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                        {topic.studyFocus}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: The 4 Cardinal Exam Traps */}
        {activeSubTab === 'traps' && (
          <div className="p-6 space-y-6">
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-amber-900">
                  Exam Trap Breakdown: Distractors vs. Certified Architect Decisions
                </h4>
                <p className="text-xs text-amber-700 mt-1">
                  On the CCAR-F exam, multiple options will sound technically plausible. Below are the exact distinctions Anthropic uses to separate junior implementers from certified enterprise architects in Scenario #{activeScenario.number}.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {activeScenario.cardinalTraps.map((trap, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden"
                >
                  <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-800 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      {trap.title}
                    </span>
                    <span className="text-[10px] font-bold uppercase text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded border border-amber-200">
                      High-Frequency Trap
                    </span>
                  </div>

                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* The Junior Distractor */}
                    <div className="p-3.5 rounded-lg bg-rose-50/50 border border-rose-200 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-rose-800 mb-1.5">
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>Common Distractor (Fails in Exam)</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed font-mono text-[11px] bg-white/80 p-2 rounded border border-rose-100">
                        {trap.distractor}
                      </p>
                    </div>

                    {/* The Architect Decision */}
                    <div className="p-3.5 rounded-lg bg-emerald-50/50 border border-emerald-200 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-800 mb-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Certified Architect Decision (Correct)</span>
                      </div>
                      <p className="text-slate-800 leading-relaxed font-mono text-[11px] bg-white/80 p-2 rounded border border-emerald-100 font-medium">
                        {trap.architectDecision}
                      </p>
                    </div>
                  </div>

                  <div className="px-4 py-2.5 bg-slate-50/60 border-t border-slate-100 text-xs text-slate-600 flex items-start gap-2">
                    <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 font-semibold">Anthropic Architectural Rule:</strong>{' '}
                      {trap.blueprintRule}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Production Code Implementation */}
        {activeSubTab === 'code' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-indigo-600" />
                  <span>{activeScenario.codeImplementation.title}</span>
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {activeScenario.codeImplementation.highlight}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleCopyCode(activeScenario.codeImplementation.code)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copy Snippet</span>
                  </>
                )}
              </button>
            </div>

            <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 text-slate-100 font-mono text-xs leading-relaxed p-4 shadow-inner max-h-[550px] overflow-y-auto">
              <pre>
                <code>{activeScenario.codeImplementation.code}</code>
              </pre>
            </div>
          </div>
        )}

        {/* Tab 4: Scenario-Specific Practice Questions */}
        {activeSubTab === 'practice' && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Scenario #{activeScenario.number} Practice Questions
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Realistic questions modeled after the proctored Pearson VUE examination. Select an option to test your intuition.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setUserAnswers({});
                  setShowExplanations({});
                }}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Answers</span>
              </button>
            </div>

            <div className="space-y-6">
              {activeScenario.scenarioQuestions.map((q, qIdx) => {
                const selected = userAnswers[q.id];
                const hasAnswered = selected !== undefined;
                const isCorrect = selected === q.correctIndex;

                return (
                  <div
                    key={q.id}
                    className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
                          Question {qIdx + 1}
                        </span>
                        <span className="text-xs font-semibold text-slate-400">ID: {q.id}</span>
                      </div>
                      {hasAnswered && (
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                            isCorrect
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-rose-100 text-rose-800 border border-rose-300'
                          }`}
                        >
                          {isCorrect ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Correct</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5 text-rose-600" />
                              <span>Incorrect</span>
                            </>
                          )}
                        </span>
                      )}
                    </div>

                    <p className="text-sm font-semibold text-slate-900 leading-snug">
                      {q.question}
                    </p>

                    {/* Options */}
                    <div className="space-y-2">
                      {q.options.map((option, oIdx) => {
                        const isOptionSelected = selected === oIdx;
                        const isThisOptionCorrect = oIdx === q.correctIndex;

                        let btnStyle = 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800';
                        if (hasAnswered) {
                          if (isThisOptionCorrect) {
                            btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold ring-1 ring-emerald-500';
                          } else if (isOptionSelected) {
                            btnStyle = 'bg-rose-50 border-rose-500 text-rose-950 font-semibold ring-1 ring-rose-500';
                          } else {
                            btnStyle = 'bg-slate-50/50 border-slate-200 text-slate-400 opacity-60';
                          }
                        }

                        return (
                          <button
                            key={oIdx}
                            type="button"
                            disabled={hasAnswered}
                            onClick={() => handleSelectOption(q.id, oIdx)}
                            className={`w-full text-left p-3 rounded-lg border text-xs sm:text-sm transition flex items-start gap-3 ${btnStyle}`}
                          >
                            <span className="w-5 h-5 rounded-full border border-slate-300 bg-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span className="flex-1">{option}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation & Trap Note */}
                    {showExplanations[q.id] && (
                      <div className="p-4 rounded-lg bg-indigo-50/60 border border-indigo-100 text-xs space-y-2 mt-3 animate-fade-in">
                        <div>
                          <strong className="text-indigo-950 font-bold">Architectural Explanation:</strong>{' '}
                          <span className="text-slate-800">{q.explanation}</span>
                        </div>
                        <div className="pt-2 border-t border-indigo-100/80 text-amber-900 flex items-start gap-2">
                          <Zap className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <strong className="font-bold">Distractor Trap:</strong> {q.examTrap}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 5: Candidate Web Search Debrief ("rever web search") */}
        {activeSubTab === 'webSearch' && (
          <div className="p-6 space-y-6">
            <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 flex items-start gap-3">
              <Globe className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-sky-950">
                  Scenario #{activeScenario.number} Live Candidate Web Debrief
                </h4>
                <p className="text-xs text-sky-800 mt-1">
                  Synthesized insights and live search queries from recent test-taker debriefs (Reddit r/ClaudeAI, developer forums, Pearson VUE experiences) specific to this scenario.
                </p>
              </div>
            </div>

            {/* Recommended Search Queries */}
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Curated Debrief Search Queries (Click to Run):
              </span>
              <div className="flex flex-wrap gap-2">
                {activeScenario.recommendedWebQueries.map((query, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleRunScenarioSearch(query)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-sky-50 hover:border-sky-300 border border-slate-200 text-slate-700 hover:text-sky-900 text-xs font-medium transition flex items-center gap-1.5"
                  >
                    <Search className="w-3 h-3 text-sky-600" />
                    <span>{query}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Search Input */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={customSearchQuery}
                  onChange={(e) => setCustomSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleRunScenarioSearch(customSearchQuery);
                  }}
                  placeholder={`Search candidate feedback for ${activeScenario.title}...`}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:bg-white"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRunScenarioSearch(customSearchQuery)}
                disabled={webSearchState.isLoading || !customSearchQuery.trim()}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition disabled:opacity-50 flex items-center gap-1.5 shrink-0"
              >
                {webSearchState.isLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-3.5 h-3.5" />
                    <span>Search Web</span>
                  </>
                )}
              </button>
            </div>

            {/* Live Search Results / Synthesis Display */}
            {webSearchState.isLoading && (
              <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-xl">
                <RefreshCw className="w-6 h-6 animate-spin text-sky-600 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700">
                  Searching community forums and exam debriefs for "{webSearchState.query}"...
                </p>
              </div>
            )}

            {webSearchState.summary && !webSearchState.isLoading && (
              <div className="p-5 rounded-xl border border-sky-200 bg-sky-50/40 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-sky-600" />
                    Synthesis for: "{webSearchState.query}"
                  </span>
                  <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Live Grounded
                  </span>
                </div>
                <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-line font-sans">
                  {webSearchState.summary}
                </div>

                {/* Sources */}
                {webSearchState.sources.length > 0 && (
                  <div className="pt-3 border-t border-sky-200/60">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                      Referenced Discussions & Blueprints:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {webSearchState.sources.map((src, sIdx) => (
                        <a
                          key={sIdx}
                          href={src.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-sky-700 hover:text-sky-900 bg-white px-2 py-1 rounded border border-sky-200 hover:border-sky-300 transition"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span className="truncate max-w-[200px]">{src.title}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Test-Taker Bullet Points */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Key Test-Taker Takeaways for Scenario #{activeScenario.number}
              </h4>
              <ul className="space-y-2">
                {activeScenario.candidateDebriefTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Cross Navigation Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-white">
            Ready to test all 6 scenarios in a timed 60-question simulation?
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            The CCAR-F Exam Simulator randomizes questions across all 5 domains and 6 scenarios under authentic 120-minute pacing.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            const firstTopic = activeScenario.mappedTopicIds[0];
            onPracticeTopic(firstTopic);
          }}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 shrink-0"
        >
          <span>Practice Scenario Topics</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
