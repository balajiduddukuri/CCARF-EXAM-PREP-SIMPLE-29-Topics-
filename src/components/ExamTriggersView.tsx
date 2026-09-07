import { useState } from 'react';
import { TOPICS_DATA } from '../data/topicsData';
import { DOMAINS } from '../data/domainsData';
import {
  Sparkles,
  AlertTriangle,
  Zap,
  ShieldAlert,
  Cpu,
  Layers,
  ArrowRight,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

interface ExamTriggersViewProps {
  onPracticeTopic: (topicId: number) => void;
}

export function ExamTriggersView({ onPracticeTopic }: ExamTriggersViewProps) {
  const [filterType, setFilterType] = useState<'ALL' | 'GAPS' | 'TRIGGERS' | 'PATTERNS'>('GAPS');
  const [searchTerm, setSearchTerm] = useState('');

  const gapTopics = TOPICS_DATA.filter((t) => t.isGap);

  const filteredTriggers = TOPICS_DATA.filter((t) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      t.title.toLowerCase().includes(term) ||
      t.deepDive.examTrigger.toLowerCase().includes(term) ||
      t.deepDive.coreConcept.toLowerCase().includes(term) ||
      t.deepDive.antiPatterns.some((ap) => ap.toLowerCase().includes(term))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-800">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-3">
            <Sparkles className="w-3.5 h-3.5" /> High-Yield Exam Cram Guide
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            CCAF Critical Gaps & Instant Triggers
          </h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Every known question gap from the CCAR-F / CCAF syllabus resolved with definitive architectural principles, official distractor traps, and keyword triggers.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-6 border-t border-slate-800">
          <button
            type="button"
            onClick={() => setFilterType('GAPS')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              filterType === 'GAPS'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            5 Critical Gaps Resolved
          </button>
          <button
            type="button"
            onClick={() => setFilterType('TRIGGERS')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              filterType === 'TRIGGERS'
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All 29 Instant Exam Triggers
          </button>
          <button
            type="button"
            onClick={() => setFilterType('PATTERNS')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              filterType === 'PATTERNS'
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Architectural Anti-Patterns (❌ Never Pick)
          </button>
          <button
            type="button"
            onClick={() => setFilterType('ALL')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              filterType === 'ALL'
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Show Everything
          </button>
        </div>
      </div>

      {/* ---------------- 5 CRITICAL GAPS SECTION ---------------- */}
      {(filterType === 'GAPS' || filterType === 'ALL') && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-amber-100 text-amber-800">
                <AlertTriangle className="w-5 h-5" />
              </span>
              <h3 className="text-xl font-bold text-slate-900">
                The 5 Critical Syllabus Gaps & Exam Resolutions
              </h3>
            </div>
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              High Probability Exam Questions
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {gapTopics.map((topic) => {
              if (!topic.gapDetails) return null;
              return (
                <div
                  key={topic.id}
                  className="bg-white rounded-xl border border-amber-200 p-5 sm:p-6 shadow-sm hover:border-amber-300 transition"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-amber-500 text-slate-950 font-mono">
                        GAP #{topic.id}
                      </span>
                      <h4 className="text-base font-bold text-slate-900">
                        {topic.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${DOMAINS[topic.domainId].badgeBg} ${DOMAINS[topic.domainId].badgeBorder} border`}>
                        {topic.domainId} · {topic.taskRef}
                      </span>
                      <button
                        type="button"
                        onClick={() => onPracticeTopic(topic.id)}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-lg transition flex items-center gap-1"
                      >
                        Practice 5 Questions <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="p-3 bg-rose-50/70 rounded-lg border border-rose-200">
                      <strong className="text-rose-950 block font-bold mb-1 flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        Common Candidate Trap:
                      </strong>
                      <p className="text-rose-900 leading-relaxed">
                        {topic.gapDetails.originalIssue}
                      </p>
                    </div>

                    <div className="p-3 bg-emerald-50/70 rounded-lg border border-emerald-200">
                      <strong className="text-emerald-950 block font-bold mb-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Verified Exam Resolution:
                      </strong>
                      <p className="text-emerald-900 leading-relaxed">
                        {topic.gapDetails.gapResolved}
                      </p>
                    </div>

                    <div className="p-3 bg-indigo-50/70 rounded-lg border border-indigo-200">
                      <strong className="text-indigo-950 block font-bold mb-1 flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-indigo-600" />
                        Authoritative Exam Rule:
                      </strong>
                      <p className="text-indigo-900 font-medium leading-relaxed">
                        {topic.gapDetails.actionableTakeaway}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ---------------- 29 EXAM TRIGGERS MATRIX ---------------- */}
      {(filterType === 'TRIGGERS' || filterType === 'ALL') && (
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-indigo-100 text-indigo-800">
                <Zap className="w-5 h-5" />
              </span>
              <h3 className="text-xl font-bold text-slate-900">
                All 29 Direct Exam Triggers (When You See X → Choose Y)
              </h3>
            </div>

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search triggers or keywords..."
              className="text-xs bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white font-bold uppercase tracking-wider text-[11px]">
                    <th className="p-3 border-r border-slate-800 w-16">Topic</th>
                    <th className="p-3 border-r border-slate-800 w-1/4">Domain & Title</th>
                    <th className="p-3 border-r border-slate-800 w-1/3">
                      ⚡ Exam Trigger (Scenario Clue → Choose This)
                    </th>
                    <th className="p-3">❌ Dead Giveaways (Never Choose)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredTriggers.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50 transition">
                      <td className="p-3 font-mono font-bold text-slate-900 border-r border-slate-100 align-top">
                        T{t.id}
                      </td>
                      <td className="p-3 border-r border-slate-100 align-top">
                        <span className="font-bold text-slate-900 block">{t.title}</span>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {t.domainId} · {t.taskRef}
                        </span>
                      </td>
                      <td className="p-3 border-r border-slate-100 align-top bg-indigo-50/40">
                        <p className="text-indigo-950 font-medium leading-relaxed">
                          {t.deepDive.examTrigger}
                        </p>
                      </td>
                      <td className="p-3 align-top bg-rose-50/20">
                        <ul className="space-y-1">
                          {t.deepDive.antiPatterns.slice(0, 2).map((ap, idx) => (
                            <li key={idx} className="flex items-start gap-1 text-slate-700">
                              <span className="text-rose-500 shrink-0">❌</span>
                              <span>{ap}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* ---------------- CRITICAL ARCHITECTURE SUMMARY CHEATS ---------------- */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-md bg-purple-100 text-purple-800">
            <Cpu className="w-5 h-5" />
          </span>
          <h3 className="text-xl font-bold text-slate-900">
            Anthropic Architectural Reference Tables
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Model Family Decision Matrix */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-600" />
              Model Selection Matrix (Sonnet vs Haiku vs Opus)
            </h4>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-100">
                <strong className="font-bold text-indigo-950 block">
                  Claude 3.5 Sonnet (Default Workhorse)
                </strong>
                <p className="text-indigo-900 mt-0.5">
                  Complex reasoning, multi-step code generation, tool orchestration, coordinator agent roles, document extraction with subtle business rules.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                <strong className="font-bold text-emerald-950 block">
                  Claude 3.5 Haiku (Speed & Cost Efficiency)
                </strong>
                <p className="text-emerald-900 mt-0.5">
                  Sub-second latency requirements, simple classification, routing/triage, high-volume extraction, text filtering, light rewriting.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-purple-50 border border-purple-100">
                <strong className="font-bold text-purple-950 block">
                  Claude 3 Opus (Extreme Depth)
                </strong>
                <p className="text-purple-900 mt-0.5">
                  Extremely deep multi-variable reasoning, academic-grade synthesis, delicate safety judgment, high-stakes policy compliance.
                </p>
              </div>
            </div>
          </div>

          {/* Hooks & MCP Lifecycle Table */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-indigo-600" />
              Hooks & Tool Calling Security Lifecycle
            </h4>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-100">
                <strong className="font-bold text-amber-950 block">
                  PreToolUse Hooks (Deterministic Safety Gate)
                </strong>
                <p className="text-amber-900 mt-0.5">
                  Executes <strong>before</strong> the tool executes. Can modify arguments or block the call entirely. 100% deterministic security enforcement (SQL check, path validation).
                </p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <strong className="font-bold text-slate-900 block">
                  PostToolUse Hooks (Sanitization & Telemetry)
                </strong>
                <p className="text-slate-800 mt-0.5">
                  Executes <strong>after</strong> the tool returns. Sanitizes sensitive data, normalizes date/phone formats, records audit telemetry logs.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-100">
                <strong className="font-bold text-rose-950 block">
                  Prompt-Only Constraints (Anti-Pattern)
                </strong>
                <p className="text-rose-900 mt-0.5">
                  Writing "Never run DELETE queries" in the system prompt is <strong>probabilistic and bypassable</strong>. Never select as the sole safety mechanism!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
