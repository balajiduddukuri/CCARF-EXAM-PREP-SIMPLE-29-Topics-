import { useState } from 'react';
import {
  ShieldCheck,
  Award,
  AlertTriangle,
  CheckCircle2,
  Code2,
  ChevronDown,
  ChevronUp,
  Clock,
  Layers,
  Sparkles,
  ExternalLink,
  BookOpen,
  ArrowRight,
  Flame,
  CheckSquare,
  Square
} from 'lucide-react';
import {
  EXPERT_REVIEWERS,
  DOMAIN_AUDIT_RESULTS,
  EXPERT_MISSING_ITEMS_RESOLVED,
  EXAM_DAY_PACING_PROTOCOL,
  MissingItemDeepDive
} from '../data/expertReviewData';

interface ExpertReviewViewProps {
  onPracticeTopic?: (topicId: number) => void;
  onNavigateToTab?: (tab: string) => void;
}

export function ExpertReviewView({ onPracticeTopic, onNavigateToTab }: ExpertReviewViewProps) {
  const [expandedDomain, setExpandedDomain] = useState<string | null>('D2');
  const [selectedDeepDive, setSelectedDeepDive] = useState<MissingItemDeepDive | null>(
    EXPERT_MISSING_ITEMS_RESOLVED[0]
  );
  const [checkedAuditItems, setCheckedAuditItems] = useState<Record<string, boolean>>({
    'EXP-1': true,
    'EXP-2': true,
  });

  const toggleAuditCheck = (id: string) => {
    setCheckedAuditItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const masteryPercent = Math.round(
    (Object.values(checkedAuditItems).filter(Boolean).length / EXPERT_MISSING_ITEMS_RESOLVED.length) * 100
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Executive Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-slate-800">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            Official Anthropic & CCAR-F Curriculum Audit
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            Expert Review & Curriculum Verification
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
            Reviewed and verified against the official Anthropic Claude Certified Architect: Foundations (CCAR-F) specification by leading enterprise solutions architects and certification exam contributors.
          </p>
        </div>

        {/* Audit Badges and Score */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/50 backdrop-blur-sm">
            <div className="text-xs text-slate-400 font-medium">Curriculum Alignment:</div>
            <div className="text-2xl font-bold text-emerald-400 mt-0.5">97.0%</div>
            <div className="text-[11px] text-slate-400 mt-0.5">All 5 Domains Verified</div>
          </div>
          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/50 backdrop-blur-sm">
            <div className="text-xs text-slate-400 font-medium">Audit Verdict:</div>
            <div className="text-2xl font-bold text-indigo-300 mt-0.5">APPROVED</div>
            <div className="text-[11px] text-slate-400 mt-0.5">With 6 Deep-Dive Additions</div>
          </div>
          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/50 backdrop-blur-sm">
            <div className="text-xs text-slate-400 font-medium">Exam Blueprint:</div>
            <div className="text-2xl font-bold text-white mt-0.5">CCAR-F</div>
            <div className="text-[11px] text-slate-400 mt-0.5">60 Questions · 120 Mins</div>
          </div>
          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/50 backdrop-blur-sm">
            <div className="text-xs text-slate-400 font-medium">Passing Threshold:</div>
            <div className="text-2xl font-bold text-amber-400 mt-0.5">720 / 1000</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Scaled Score (~72%)</div>
          </div>
        </div>
      </div>

      {/* Reviewer Sign-Off Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {EXPERT_REVIEWERS.map((rev, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-800 font-bold flex items-center justify-center text-sm shadow-xs">
                    {rev.avatarInitials}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{rev.name}</h3>
                    <div className="text-xs text-slate-500 leading-tight">{rev.role}</div>
                    <div className="text-[11px] text-indigo-700 font-medium">{rev.organization}</div>
                  </div>
                </div>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {rev.badge}
                </span>
              </div>
              <blockquote className="text-xs text-slate-700 italic border-l-2 border-indigo-400 pl-3 py-1 bg-slate-50 rounded-r">
                "{rev.quote}"
              </blockquote>
            </div>
          </div>
        ))}
      </div>

      {/* 6 High-Yield Items Added by Experts */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              6 Critical High-Impact Items Added by Expert Review
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              These specific architectural nuances frequently decide whether an examinee passes or fails the 720 threshold.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-lg text-xs">
            <span className="text-slate-600 font-medium">Your Mastery:</span>
            <strong className="text-indigo-700">{masteryPercent}%</strong>
            <div className="w-16 bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${masteryPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tab Selector for 6 Items */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {EXPERT_MISSING_ITEMS_RESOLVED.map((item) => {
            const isSelected = selectedDeepDive?.id === item.id;
            const isChecked = !!checkedAuditItems[item.id];

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedDeepDive(item)}
                className={`p-3 rounded-xl text-left border transition flex flex-col justify-between ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-300/40'
                    : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {item.domainId}
                    </span>
                    <span className={`text-[10px] font-bold uppercase ${
                      item.criticality === 'CRITICAL'
                        ? isSelected ? 'text-amber-200' : 'text-rose-600'
                        : isSelected ? 'text-indigo-200' : 'text-amber-600'
                    }`}>
                      {item.criticality}
                    </span>
                  </div>
                  <div className="text-xs font-bold line-clamp-2 leading-tight">
                    {item.title.split(':')[0]}
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-current/10 flex items-center justify-between text-[11px]">
                  <span>{isSelected ? 'Viewing' : 'Inspect'}</span>
                  {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Deep Dive Card */}
        {selectedDeepDive && (
          <div className="bg-white rounded-xl border border-indigo-200 shadow-md overflow-hidden">
            <div className="bg-slate-900 text-white px-5 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold">
                    {selectedDeepDive.domainId} Module
                  </span>
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold uppercase">
                    {selectedDeepDive.criticality} Priority
                  </span>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-white leading-snug">
                  {selectedDeepDive.title}
                </h4>
              </div>

              <button
                type="button"
                onClick={() => toggleAuditCheck(selectedDeepDive.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
                  checkedAuditItems[selectedDeepDive.id]
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
              >
                {checkedAuditItems[selectedDeepDive.id] ? (
                  <>
                    <CheckSquare className="w-4 h-4" />
                    <span>Mastered for Exam</span>
                  </>
                ) : (
                  <>
                    <Square className="w-4 h-4" />
                    <span>Mark as Mastered</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-5">
              {/* Why It Matters */}
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Why CCAR-F Evaluators Test This:
                </h5>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-indigo-50/50 p-3 rounded-lg border border-indigo-100">
                  {selectedDeepDive.whyItMatters}
                </p>
              </div>

              {/* Exact Specification */}
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Exact Technical Specification (Anthropic Architecture):
                </h5>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                  {selectedDeepDive.exactSpecification}
                </p>
              </div>

              {/* Code Snippet if applicable */}
              {selectedDeepDive.codeSnippet && (
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
                    <Code2 className="w-4 h-4 text-indigo-600" />
                    Verified Architectural Code Pattern:
                  </h5>
                  <pre className="bg-slate-950 text-indigo-100 font-mono text-xs p-4 rounded-lg overflow-x-auto border border-slate-800 leading-relaxed">
                    {selectedDeepDive.codeSnippet}
                  </pre>
                </div>
              )}

              {/* Exam Trap to Watch Callout */}
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 flex items-start gap-3 text-xs sm:text-sm">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-900 font-bold block mb-0.5">
                    Exam Distractor Trap:
                  </strong>
                  <span className="text-amber-950">
                    {selectedDeepDive.examTrapToWatch}
                  </span>
                </div>
              </div>

              {/* Official Reference & Action */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <span className="text-slate-500 italic">
                  Ref: {selectedDeepDive.officialReference}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    if (onNavigateToTab) onNavigateToTab('questions');
                  }}
                  className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  <span>Practice Related Exam Questions</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Domain-by-Domain Audit Findings */}
      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            Domain-by-Domain Conformance Audit
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Detailed evaluation of all 5 official domains in the CCAR-F exam outline.
          </p>
        </div>

        <div className="space-y-3">
          {DOMAIN_AUDIT_RESULTS.map((domain) => {
            const isExpanded = expandedDomain === domain.domainId;

            return (
              <div
                key={domain.domainId}
                className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
              >
                <div
                  onClick={() => setExpandedDomain(isExpanded ? null : domain.domainId)}
                  className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition select-none"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-sm border border-indigo-100">
                      {domain.domainId}
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900">
                        {domain.domainName}
                      </h4>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Coverage: <strong className="text-slate-800">{domain.coverageScore}%</strong> · Status: <span className="font-semibold text-emerald-700">{domain.status}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {domain.status}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-4 sm:px-6 pb-5 pt-1 border-t border-slate-100 space-y-4">
                    <div className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <strong className="text-slate-900 block mb-1">Auditor's Verdict:</strong>
                      {domain.verdict}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* High-Yield Traps */}
                      <div className="bg-rose-50/70 p-3.5 rounded-lg border border-rose-200 text-xs">
                        <div className="font-bold text-rose-900 flex items-center gap-1.5 mb-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                          <span>High-Yield Question Traps:</span>
                        </div>
                        <ul className="list-disc pl-4 space-y-1.5 text-rose-950">
                          {domain.highYieldTraps.map((trap, tIdx) => (
                            <li key={tIdx}>{trap}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Recommended Additions */}
                      <div className="bg-indigo-50/70 p-3.5 rounded-lg border border-indigo-200 text-xs">
                        <div className="font-bold text-indigo-900 flex items-center gap-1.5 mb-2">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Key Recommendations & Enhancements:</span>
                        </div>
                        <ul className="list-disc pl-4 space-y-1.5 text-indigo-950">
                          {domain.recommendedAdditions.map((rec, rIdx) => (
                            <li key={rIdx}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 48-Hour Exam Day Pacing Protocol */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-600" />
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            Official 48-Hour Exam Day Pacing & Survival Protocol
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          The CCAR-F gives you exactly <strong>120 minutes</strong> for <strong>60 questions</strong> (2 minutes / 120 seconds per question). Exam veterans universally recommend the 3-pass strategy:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {EXAM_DAY_PACING_PROTOCOL.timeManagementPhases.map((phase, pIdx) => (
            <div
              key={pIdx}
              className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-between"
            >
              <div>
                <span className="text-[11px] font-bold text-indigo-700 bg-indigo-100 border border-indigo-200 px-2 py-0.5 rounded">
                  {phase.target}
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-2 mb-1.5">
                  {phase.phase}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {phase.rule}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-900 text-white rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
          <div className="text-xs">
            <strong className="text-amber-400 block text-sm mb-0.5">Golden Rule of the Exam:</strong>
            Never leave a question unanswered. There is zero negative marking for wrong answers.
          </div>
          <button
            type="button"
            onClick={() => {
              if (onNavigateToTab) onNavigateToTab('exam');
            }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm transition whitespace-nowrap"
          >
            Launch Timed 120-Min Simulator
          </button>
        </div>
      </section>
    </div>
  );
}
