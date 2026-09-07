import { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  Layers,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Tag,
  Eye,
  EyeOff,
  Printer,
  ChevronRight,
  FileCode
} from 'lucide-react';
import { GLOSSARY_TERMS, GlossaryTerm } from '../data/glossaryData';
import { DomainId } from '../types';
import { downloadStudyGuideHtml } from '../utils/exportHtml';

export function GlossaryView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [testMode, setTestMode] = useState(false);
  const [revealedTermIds, setRevealedTermIds] = useState<Record<string, boolean>>({});

  const domainOptions = [
    { id: 'All', label: 'All Domains' },
    { id: 'CORE', label: 'Core Framework' },
    { id: 'D1', label: 'D1: Architecture (27%)' },
    { id: 'D2', label: 'D2: Tool Calling & MCP (18%)' },
    { id: 'D3', label: 'D3: Prompt Engineering (20%)' },
    { id: 'D4', label: 'D4: Structured Outputs (20%)' },
    { id: 'D5', label: 'D5: Production & Observability (15%)' },
  ];

  const categoryOptions = [
    'All',
    'Acronym',
    'Architecture',
    'Tooling & MCP',
    'Prompt Engineering',
    'Structured Output',
    'Production & Safety',
  ];

  const filteredTerms = useMemo(() => {
    return GLOSSARY_TERMS.filter((item) => {
      // Domain filter
      if (selectedDomain !== 'All' && item.domainId !== selectedDomain) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTerm = item.term.toLowerCase().includes(q);
        const matchesAcronym = item.acronym?.toLowerCase().includes(q);
        const matchesDef = item.definition.toLowerCase().includes(q);
        const matchesContext = item.examContext.toLowerCase().includes(q);
        const matchesKeyword = item.keyKeywords.some((k) => k.toLowerCase().includes(q));
        return matchesTerm || matchesAcronym || matchesDef || matchesContext || matchesKeyword;
      }
      return true;
    });
  }, [searchQuery, selectedCategory, selectedDomain]);

  const toggleReveal = (id: string) => {
    setRevealedTermIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const revealAll = () => {
    const next: Record<string, boolean> = {};
    filteredTerms.forEach((t) => {
      next[t.id] = true;
    });
    setRevealedTermIds(next);
  };

  const hideAll = () => {
    setRevealedTermIds({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg border border-slate-800">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold uppercase tracking-wider mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            Official Exam Terminology & Acronyms
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            CCAR-F Architectural Glossary & Acronym Index
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
            Essential concepts, Anthropic protocol specifications, and acronym definitions tested on the Claude Certified Architect: Foundations exam. Each term includes concise exam definitions and common question traps.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80 text-xs">
          <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/50">
            <span className="text-slate-400">Total Terms Defined:</span>
            <div className="text-xl font-bold text-white mt-0.5">{GLOSSARY_TERMS.length}</div>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/50">
            <span className="text-slate-400">Core Acronyms:</span>
            <div className="text-xl font-bold text-indigo-400 mt-0.5">
              {GLOSSARY_TERMS.filter((t) => t.category === 'Acronym').length}
            </div>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/50">
            <span className="text-slate-400">Exam Domains Covered:</span>
            <div className="text-xl font-bold text-emerald-400 mt-0.5">5 Domains + Core</div>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/50">
            <span className="text-slate-400">Matching Current Filter:</span>
            <div className="text-xl font-bold text-amber-400 mt-0.5">{filteredTerms.length}</div>
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-5 space-y-4">
        {/* Search input & Flashcard Mode toggle */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="glossary-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by term, acronym (MCP, NIAH, TTFT), or keyword..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => setTestMode(!testMode)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition ${
                testMode
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
              }`}
            >
              {testMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{testMode ? 'Test Mode Active' : 'Self-Test Mode'}</span>
            </button>

            {testMode && (
              <>
                <button
                  type="button"
                  onClick={revealAll}
                  className="px-2.5 py-2 text-xs font-medium text-slate-600 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 rounded-lg border border-slate-200 transition"
                >
                  Reveal All
                </button>
                <button
                  type="button"
                  onClick={hideAll}
                  className="px-2.5 py-2 text-xs font-medium text-slate-600 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 rounded-lg border border-slate-200 transition"
                >
                  Hide All
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => window.print()}
              title="Print or export glossary"
              className="hidden sm:flex items-center gap-1 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 transition"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print</span>
            </button>

            <button
              type="button"
              onClick={() => downloadStudyGuideHtml('glossary')}
              title="Export glossary as standalone HTML"
              className="hidden sm:flex items-center gap-1 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 transition"
            >
              <FileCode className="w-3.5 h-3.5 text-emerald-600" />
              <span>HTML</span>
            </button>
          </div>
        </div>

        {/* Domain Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
            <Layers className="w-3 h-3" />
            Domain:
          </span>
          {domainOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setSelectedDomain(opt.id)}
              className={`px-2.5 py-1 rounded-md font-medium transition ${
                selectedDomain === opt.id
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
            <Tag className="w-3 h-3" />
            Category:
          </span>
          {categoryOptions.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-md font-medium transition ${
                selectedCategory === cat
                  ? 'bg-slate-800 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat === 'All' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Glossary Terms Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTerms.map((term) => {
          const isRevealed = !testMode || !!revealedTermIds[term.id];

          return (
            <div
              key={term.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:border-indigo-300 transition flex flex-col justify-between"
            >
              <div>
                {/* Header with Term & Badges */}
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                      {term.acronym && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                          {term.acronym}
                        </span>
                      )}
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        {term.domainId}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-50 text-slate-600 border border-slate-200/60">
                        {term.category}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      {term.term}
                    </h3>
                  </div>

                  {testMode && (
                    <button
                      type="button"
                      onClick={() => toggleReveal(term.id)}
                      className={`shrink-0 p-1.5 rounded-lg border text-xs font-medium transition ${
                        isRevealed
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
                      }`}
                      title={isRevealed ? 'Hide definition' : 'Reveal definition'}
                    >
                      {isRevealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  )}
                </div>

                {/* Definition (conditional in test mode) */}
                {isRevealed ? (
                  <div className="space-y-3 mt-3">
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                      {term.definition}
                    </p>

                    {/* Exam Relevance & Trap Alert */}
                    <div className="bg-amber-50/80 rounded-lg p-3 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                      <div className="font-bold flex items-center gap-1 text-amber-800 mb-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>Exam Relevance & Trap Alert:</span>
                      </div>
                      <p className="text-amber-950 font-medium">
                        {term.examContext}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => toggleReveal(term.id)}
                    className="my-4 py-8 bg-slate-50 hover:bg-indigo-50/50 border border-dashed border-slate-300 hover:border-indigo-300 rounded-lg text-center cursor-pointer transition group"
                  >
                    <Eye className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 mx-auto mb-1.5" />
                    <span className="text-xs font-medium text-slate-500 group-hover:text-indigo-700">
                      Click to test your recall & reveal definition
                    </span>
                  </div>
                )}
              </div>

              {/* Footer with Keywords */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                <div className="flex flex-wrap items-center gap-1">
                  <span className="font-medium text-slate-500">Keywords:</span>
                  {term.keyKeywords.slice(0, 4).map((kw, kwIdx) => (
                    <span key={kwIdx} className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                      {kw}
                    </span>
                  ))}
                </div>
                <span className="text-slate-400 italic">{term.domainName}</span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTerms.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
          <Search className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <h4 className="text-base font-semibold text-slate-800">No terms match your filter</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or reset the Domain and Category filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedDomain('All');
              setSelectedCategory('All');
            }}
            className="mt-4 px-4 py-2 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
