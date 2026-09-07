import { useState, useEffect, useMemo } from 'react';
import {
  EXAM_BLUEPRINT_DOMAINS,
  ObjectiveMapping,
  TOTAL_OBJECTIVES_COUNT,
} from '../data/objectivesData';
import {
  CheckCircle2,
  Circle,
  ExternalLink,
  BookOpen,
  HelpCircle,
  Workflow,
  Sparkles,
  Layers,
  Search,
  CheckCheck,
  RotateCcw,
  ArrowRight,
  Filter,
} from 'lucide-react';

const REVISED_OBJECTIVES_STORAGE_KEY = 'ccarf_revised_objectives_v1';

interface ObjectivesViewProps {
  onNavigateToTopic: (topicId: number) => void;
  onNavigateToScenario: (scenarioId: number) => void;
  onPracticeTopic: (topicId: number) => void;
  onNavigateToCheatSheet?: () => void;
}

export function ObjectivesView({
  onNavigateToTopic,
  onNavigateToScenario,
  onPracticeTopic,
  onNavigateToCheatSheet,
}: ObjectivesViewProps) {
  // Persistence for user's revision checklist
  const [revisedIds, setRevisedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(REVISED_OBJECTIVES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'UNREVISED' | 'REVISED'>('ALL');
  const [selectedDomainFilter, setSelectedDomainFilter] = useState<number | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Persist revised objectives
  useEffect(() => {
    try {
      localStorage.setItem(REVISED_OBJECTIVES_STORAGE_KEY, JSON.stringify(revisedIds));
    } catch {
      // ignore
    }
  }, [revisedIds]);

  const toggleObjectiveRevised = (id: string) => {
    setRevisedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleMarkAllDomain = (objectives: ObjectiveMapping[], markAll: boolean) => {
    setRevisedIds((prev) => {
      const objIds = objectives.map((o) => o.id);
      if (markAll) {
        return Array.from(new Set([...prev, ...objIds]));
      } else {
        return prev.filter((id) => !objIds.includes(id));
      }
    });
  };

  const handleResetChecklist = () => {
    if (window.confirm('Reset your revision checklist progress?')) {
      setRevisedIds([]);
    }
  };

  // Progress calculations
  const totalRevised = revisedIds.length;
  const progressPercent = Math.round((totalRevised / TOTAL_OBJECTIVES_COUNT) * 100);

  // Filtered objectives list
  const filteredDomains = useMemo(() => {
    return EXAM_BLUEPRINT_DOMAINS.map((domain) => {
      // Check if domain matches domain filter
      if (selectedDomainFilter !== 'ALL' && domain.number !== selectedDomainFilter) {
        return { ...domain, objectives: [] };
      }

      const matchingObjectives = domain.objectives.filter((obj) => {
        const matchesStatus =
          activeFilter === 'ALL'
            ? true
            : activeFilter === 'REVISED'
            ? revisedIds.includes(obj.id)
            : !revisedIds.includes(obj.id);

        if (!matchesStatus) return false;

        if (!searchQuery.trim()) return true;

        const q = searchQuery.toLowerCase();
        return (
          obj.id.toLowerCase().includes(q) ||
          obj.text.toLowerCase().includes(q) ||
          obj.primaryTopicTitle.toLowerCase().includes(q) ||
          obj.keyCompetency.toLowerCase().includes(q) ||
          (obj.scenarioTitle && obj.scenarioTitle.toLowerCase().includes(q))
        );
      });

      return {
        ...domain,
        objectives: matchingObjectives,
      };
    }).filter((domain) => domain.objectives.length > 0 || (searchQuery.trim() === '' && selectedDomainFilter === domain.number));
  }, [selectedDomainFilter, activeFilter, revisedIds, searchQuery]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Blueprint Hero / Intro Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Official Examination Specification Blueprint
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Revision Progress:</span>
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-emerald-400">
                {totalRevised} / {TOTAL_OBJECTIVES_COUNT} ({progressPercent}%)
              </span>
              {totalRevised > 0 && (
                <button
                  type="button"
                  onClick={handleResetChecklist}
                  title="Reset Checklist"
                  className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              CCAR-F Exam Blueprint & Revision Checklist
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-4xl">
              CCAR-F tests you on <strong>5 domains and 30 published objectives</strong>. Every objective below is a skill the exam can assess — treat this as your revision checklist. The bars show how many objectives each domain carries.
            </p>
          </div>

          {/* Interactive Global Revision Progress Bar */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700">
              <div
                className="bg-linear-to-r from-indigo-500 via-purple-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.max(progressPercent, 2)}%` }}
              />
            </div>
          </div>

          {/* Domain Distribution Visualizer Bars */}
          <div className="space-y-2 pt-2">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Objective Distribution Across 5 Domains
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {EXAM_BLUEPRINT_DOMAINS.map((domain) => {
                const domainRevisedCount = domain.objectives.filter((o) =>
                  revisedIds.includes(o.id)
                ).length;
                const domainAllCount = domain.objectives.length;
                const isSelected = selectedDomainFilter === domain.number;

                return (
                  <button
                    key={domain.number}
                    type="button"
                    onClick={() =>
                      setSelectedDomainFilter((prev) =>
                        prev === domain.number ? 'ALL' : domain.number
                      )
                    }
                    className={`text-left p-3 rounded-xl border transition cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800 border-indigo-400 shadow-md ring-1 ring-indigo-400/50'
                        : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-mono font-bold text-xs text-indigo-400">
                        Domain {domain.number}
                      </span>
                      <span className="font-mono font-extrabold text-xs text-slate-200">
                        {domain.weightPercent}%
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-slate-100 line-clamp-1 mb-2" title={domain.name}>
                      {domain.name}
                    </div>

                    <div className="space-y-1">
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full ${domain.color.bar}`}
                          style={{ width: `${domain.weightPercent * 4}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>{domain.objectiveCount} objectives</span>
                        <span className={domainRevisedCount === domainAllCount ? 'text-emerald-400 font-bold' : ''}>
                          {domainRevisedCount}/{domainAllCount} revised
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Checklist Controls: Search & Status Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>

          <button
            type="button"
            onClick={() => setActiveFilter('ALL')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
              activeFilter === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All 30 Objectives
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('UNREVISED')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
              activeFilter === 'UNREVISED'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            To Revise ({TOTAL_OBJECTIVES_COUNT - totalRevised})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('REVISED')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
              activeFilter === 'REVISED'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Revised ({totalRevised})
          </button>

          {selectedDomainFilter !== 'ALL' && (
            <button
              type="button"
              onClick={() => setSelectedDomainFilter('ALL')}
              className="px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition ml-1"
            >
              Clear Domain Filter ✕
            </button>
          )}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search objectives, topics, skills..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
          />
        </div>
      </div>

      {/* Main Domains and 30 Objectives Content */}
      <div className="space-y-8">
        {filteredDomains.map((domain) => {
          const domainRevisedCount = domain.objectives.filter((o) =>
            revisedIds.includes(o.id)
          ).length;
          const allDomainRevised =
            domain.objectives.length > 0 && domainRevisedCount === domain.objectives.length;

          return (
            <section
              key={domain.number}
              id={`domain-section-${domain.number}`}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition"
            >
              {/* Domain Header Card */}
              <div className="bg-slate-900 text-white p-5 sm:p-6 border-b border-slate-800">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1 max-w-3xl">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white font-mono font-extrabold text-sm shadow-xs">
                        {domain.number}
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Domain {domain.number}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 font-mono">
                        {domain.weightPercent}% share
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                      {domain.name}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 font-medium">
                      {domain.objectiveCount} published objectives
                    </p>
                  </div>

                  {/* Domain Quick Actions & Mastery Badge */}
                  <div className="flex flex-col sm:items-end gap-2 shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Domain Progress:</span>
                      <span
                        className={`font-mono text-xs font-bold px-2 py-0.5 rounded border ${
                          allDomainRevised
                            ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300'
                            : 'bg-slate-800 border-slate-700 text-slate-300'
                        }`}
                      >
                        {domainRevisedCount} / {domain.objectiveCount}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleMarkAllDomain(domain.objectives, !allDomainRevised)}
                      className="text-xs text-indigo-300 hover:text-white flex items-center gap-1 hover:underline transition"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>{allDomainRevised ? 'Unmark Domain' : 'Mark All Revised'}</span>
                    </button>
                  </div>
                </div>

                {/* Progress Bar for this domain */}
                <div className="w-full bg-slate-800 rounded-full h-1.5 mt-4 overflow-hidden">
                  <div
                    className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${(domainRevisedCount / domain.objectiveCount) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Published Objectives List */}
              <div className="divide-y divide-slate-100 p-2 sm:p-4">
                {domain.objectives.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-sm">
                    No objectives matching current filter.
                  </div>
                ) : (
                  domain.objectives.map((obj, index) => {
                    const isRevised = revisedIds.includes(obj.id);

                    return (
                      <div
                        key={obj.id}
                        id={`objective-${obj.id}`}
                        className={`p-4 sm:p-5 rounded-xl transition-colors ${
                          isRevised ? 'bg-slate-50/80' : 'hover:bg-slate-50/50'
                        }`}
                      >
                        <div className="flex items-start gap-3.5">
                          {/* Interactive Checklist Checkbox */}
                          <button
                            type="button"
                            onClick={() => toggleObjectiveRevised(obj.id)}
                            className="mt-0.5 shrink-0 text-slate-400 hover:text-emerald-600 transition"
                            title={isRevised ? 'Mark as to revise' : 'Mark as revised'}
                          >
                            {isRevised ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                            ) : (
                              <Circle className="w-5 h-5 hover:border-emerald-500" />
                            )}
                          </button>

                          {/* Objective Body */}
                          <div className="flex-1 space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                  Skill {obj.id}
                                </span>
                                {isRevised && (
                                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                    Revised
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Exact Objective Statement (as published) */}
                            <h3
                              className={`text-base sm:text-lg font-bold leading-snug tracking-tight ${
                                isRevised ? 'text-slate-700 line-through decoration-slate-300' : 'text-slate-900'
                              }`}
                            >
                              {obj.text}
                            </h3>

                            {/* Key Competency Summary */}
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                              <strong className="text-slate-800">Assessed Skill Focus:</strong>{' '}
                              {obj.keyCompetency}
                            </p>

                            {/* Mapped Existing Content Links */}
                            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
                              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                                Linked Resources:
                              </span>

                              {/* Link to Primary Topic */}
                              {obj.topicIds.map((tId) => (
                                <button
                                  key={tId}
                                  type="button"
                                  onClick={() => onNavigateToTopic(tId)}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition shadow-2xs hover:shadow-xs"
                                  title={`Study Topic ${tId}`}
                                >
                                  <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                                  <span>Topic {tId}</span>
                                  <ArrowRight className="w-3 h-3 text-indigo-400" />
                                </button>
                              ))}

                              {/* Link to Mapped Scenario (if applicable) */}
                              {obj.scenarioId && (
                                <button
                                  type="button"
                                  onClick={() => onNavigateToScenario(obj.scenarioId!)}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition shadow-2xs hover:shadow-xs"
                                  title={`Inspect Scenario ${obj.scenarioId}`}
                                >
                                  <Workflow className="w-3.5 h-3.5 text-amber-600" />
                                  <span>Scenario {obj.scenarioId}</span>
                                  <ArrowRight className="w-3 h-3 text-amber-500" />
                                </button>
                              )}

                              {/* Link to Practice in Q-Bank */}
                              <button
                                type="button"
                                onClick={() => onPracticeTopic(obj.practiceTopicId)}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition shadow-2xs hover:shadow-xs"
                                title={`Practice exam questions for this objective in Q-Bank`}
                              >
                                <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Practice Q-Bank (Topic {obj.practiceTopicId})</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>
          );
        })}
      </div>

      {/* Official Footnote / Disclaimer Notice */}
      <div className="bg-slate-100 border border-slate-300 rounded-xl p-4 sm:p-5 text-slate-600 text-xs sm:text-sm leading-relaxed text-center">
        <p className="font-medium">
          Percentages show each domain's share of the published objectives — a guide to where the blueprint is densest. They are not Anthropic's official exam weightings.
        </p>
      </div>
    </div>
  );
}
