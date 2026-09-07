import { TOPICS_DATA } from '../data/topicsData';
import { DOMAINS } from '../data/domainsData';
import { CCARF_EXAM_SCENARIOS } from '../data/topicStudyFocusData';
import { GLOSSARY_TERMS } from '../data/glossaryData';
import { DomainId } from '../types';

export type ExportHtmlType = 'complete' | 'snippets-only' | 'glossary';

function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function generateStudyGuideHtml(exportType: ExportHtmlType = 'complete'): string {
  const exportDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const domainColors: Record<DomainId, { bg: string; text: string; border: string }> = {
    D1: { bg: '#eef2ff', text: '#3730a3', border: '#c7d2fe' },
    D2: { bg: '#eff6ff', text: '#1e40af', border: '#bfdbfe' },
    D3: { bg: '#faf5ff', text: '#6b21a8', border: '#e9d5ff' },
    D4: { bg: '#fffbeb', text: '#92400e', border: '#fde68a' },
    D5: { bg: '#ecfdf5', text: '#065f46', border: '#a7f3d0' },
  };

  const domainEntries = Object.entries(DOMAINS) as [DomainId, typeof DOMAINS[DomainId]][];

  // Title and subtitle depending on export type
  const docTitle =
    exportType === 'snippets-only'
      ? 'Anthropic CCAR-F 29 Architectural Code Snippets Cheatsheet'
      : exportType === 'glossary'
      ? 'Anthropic CCAR-F Architecture Glossary & Definitions'
      : 'Anthropic Claude Certified Architect (CCAR-F) Comprehensive Study Guide';

  const docSubtitle =
    exportType === 'snippets-only'
      ? 'Quick-reference guide featuring all 29 TypeScript, JSON, and Bash architectural implementation patterns.'
      : exportType === 'glossary'
      ? 'Complete exam definitions, acronyms, and enterprise patterns for the CCAR-F certification.'
      : 'Comprehensive offline study manual, architectural code blueprints, and real-world implementation guides covering all 29 exam topics, 5 domains, and 6 core exam scenarios.';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(docTitle)}</title>
  <meta name="description" content="Offline Study Guide & Quick Reference for the Anthropic Claude Certified Architect Foundation (CCAR-F) Certification.">
  <style>
    :root {
      --primary: #4f46e5;
      --primary-dark: #3730a3;
      --slate-900: #0f172a;
      --slate-800: #1e293b;
      --slate-700: #334155;
      --slate-600: #475569;
      --slate-200: #e2e8f0;
      --slate-100: #f1f5f9;
      --slate-50: #f8fafc;
      --emerald-600: #059669;
      --emerald-50: #ecfdf5;
      --emerald-900: #064e3b;
      --rose-600: #e11d48;
      --rose-50: #fff1f2;
      --blue-600: #2563eb;
      --blue-50: #eff6ff;
      --purple-600: #7c3aed;
      --purple-50: #faf5ff;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background-color: #f8fafc;
      color: #1e293b;
      line-height: 1.6;
      padding: 0;
      margin: 0;
      -webkit-font-smoothing: antialiased;
    }

    /* Top Action Bar (Fixed / Screen Only) */
    .action-bar {
      position: sticky;
      top: 0;
      z-index: 50;
      background-color: #0f172a;
      color: #fff;
      padding: 12px 24px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .action-bar-title {
      font-size: 14px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .action-bar-title .badge {
      background: #4f46e5;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 11px;
      text-transform: uppercase;
    }
    .action-bar-btns {
      display: flex;
      gap: 8px;
    }
    .btn {
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      border: 1px solid transparent;
      transition: all 0.15s ease;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .btn-primary {
      background-color: #4f46e5;
      color: #fff;
    }
    .btn-primary:hover {
      background-color: #4338ca;
    }
    .btn-secondary {
      background-color: #1e293b;
      color: #cbd5e1;
      border-color: #334155;
    }
    .btn-secondary:hover {
      background-color: #334155;
      color: #fff;
    }

    .container {
      max-width: 1100px;
      margin: 0 auto;
      padding: 32px 24px 80px;
    }

    /* Hero Header */
    .hero {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 32px;
      margin-bottom: 28px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .hero-pre {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #4f46e5;
      margin-bottom: 8px;
    }
    .hero h1 {
      font-size: 26px;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.25;
      margin-bottom: 10px;
    }
    .hero-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid #f1f5f9;
      font-size: 13px;
      color: #475569;
    }
    .hero-stat {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .hero-stat strong {
      color: #0f172a;
    }

    /* Scenarios Banner */
    .scenarios-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 24px;
      margin-bottom: 28px;
    }
    .scenarios-card h3 {
      font-size: 16px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .scenario-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 12px;
    }
    .scenario-item {
      padding: 12px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 12px;
    }
    .scenario-item strong {
      color: #0f172a;
      display: block;
      margin-bottom: 4px;
    }
    .scenario-item p {
      color: #475569;
      font-size: 11px;
      line-height: 1.4;
    }

    /* Table of Contents */
    .toc {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 24px;
      margin-bottom: 32px;
    }
    .toc h2 {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 16px;
      color: #0f172a;
    }
    .toc-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 8px;
    }
    .toc-link {
      padding: 6px 10px;
      background: #f8fafc;
      border-radius: 6px;
      text-decoration: none;
      color: #334155;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border: 1px solid #f1f5f9;
      transition: background 0.1s;
    }
    .toc-link:hover {
      background: #eef2ff;
      color: #4f46e5;
      border-color: #c7d2fe;
    }
    .toc-link .topic-num {
      font-weight: 700;
      color: #4f46e5;
      margin-right: 6px;
    }

    /* Topic Card */
    .topic-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 28px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
      page-break-inside: avoid;
    }
    .topic-header {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
    }
    .topic-badges {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 6px;
    }
    .badge-pill {
      font-size: 11px;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 6px;
      border: 1px solid transparent;
    }
    .badge-gap {
      background: #fff1f2;
      color: #be123c;
      border-color: #fecdd3;
    }
    .topic-title {
      font-size: 20px;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.3;
      margin-bottom: 14px;
    }

    /* Directive Box */
    .directive-box {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      padding: 12px 16px;
      margin-bottom: 14px;
      font-size: 13px;
    }
    .directive-label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #334155;
      margin-bottom: 4px;
    }
    .directive-text {
      color: #1e293b;
      font-size: 13px;
      line-height: 1.5;
    }

    /* Two-col Example & Analogy */
    .two-col-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 12px;
      margin-bottom: 14px;
    }
    .col-box {
      padding: 12px;
      border-radius: 10px;
      font-size: 12px;
      border: 1px solid transparent;
    }
    .col-box.example {
      background: #eff6ff;
      border-color: #bfdbfe;
      color: #1e3a8a;
    }
    .col-box.analogy {
      background: #faf5ff;
      border-color: #e9d5ff;
      color: #581c87;
    }
    .col-title {
      font-weight: 700;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .col-text {
      color: #334155;
      font-size: 12px;
      line-height: 1.45;
    }

    /* Scenario mapping box */
    .scenario-mapping-box {
      background: #ecfdf5;
      border: 1px solid #a7f3d0;
      border-radius: 10px;
      padding: 12px 14px;
      margin-bottom: 16px;
      font-size: 12px;
      color: #064e3b;
    }
    .scenario-mapping-title {
      font-weight: 700;
      font-size: 11px;
      margin-bottom: 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    /* Code Snippet Box */
    .code-block-container {
      background: #090d16;
      border: 1px solid #1e293b;
      border-radius: 12px;
      overflow: hidden;
      margin-bottom: 18px;
    }
    .code-block-header {
      background: #111827;
      border-bottom: 1px solid #1f2937;
      padding: 8px 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #94a3b8;
      font-size: 12px;
    }
    .code-title {
      font-weight: 600;
      color: #e2e8f0;
      font-size: 12px;
    }
    .code-lang {
      font-family: monospace;
      font-size: 10px;
      background: #1f2937;
      color: #34d399;
      padding: 2px 6px;
      border-radius: 4px;
      text-transform: uppercase;
    }
    pre.code-content {
      padding: 14px;
      margin: 0;
      overflow-x: auto;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 12px;
      line-height: 1.5;
      color: #e2e8f0;
      background: #090d16;
      tab-size: 2;
    }
    .code-caption {
      background: #0f172a;
      border-top: 1px solid #1e293b;
      padding: 8px 14px;
      font-size: 11px;
      color: #cbd5e1;
      display: flex;
      gap: 6px;
    }
    .code-caption strong {
      color: #38bdf8;
    }

    /* Q&A Section */
    .qa-box {
      margin-top: 14px;
      padding-top: 14px;
      border-top: 1px solid #f1f5f9;
    }
    .qa-item {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px 14px;
      margin-bottom: 8px;
      font-size: 12px;
    }
    .qa-q {
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 6px;
    }
    .qa-a {
      color: #334155;
      line-height: 1.45;
    }
    .qa-tip {
      margin-top: 6px;
      font-size: 11px;
      color: #4f46e5;
      background: #eef2ff;
      padding: 4px 8px;
      border-radius: 4px;
      display: inline-block;
    }

    /* Back to top button */
    .back-to-top {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #4f46e5;
      color: #fff;
      padding: 10px 14px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
      text-decoration: none;
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
      z-index: 40;
    }

    /* Print Stylesheet */
    @media print {
      .action-bar, .back-to-top, .no-print {
        display: none !important;
      }
      body {
        background: #ffffff !important;
        color: #000000 !important;
      }
      .container {
        max-width: 100% !important;
        padding: 0 !important;
      }
      .topic-card {
        border: 1px solid #cbd5e1 !important;
        page-break-after: always;
        break-after: page;
        box-shadow: none !important;
      }
      .code-block-container {
        background: #f8fafc !important;
        border: 1px solid #cbd5e1 !important;
      }
      pre.code-content {
        color: #0f172a !important;
        background: #f8fafc !important;
      }
      .code-block-header {
        background: #f1f5f9 !important;
        color: #334155 !important;
      }
      .code-caption {
        background: #f1f5f9 !important;
        color: #334155 !important;
      }
    }
  </style>
</head>
<body>

  <!-- Top Action Bar -->
  <div class="action-bar no-print">
    <div class="action-bar-title">
      <span>${escapeHtml(docTitle)}</span>
      <span class="badge">Offline Reference</span>
    </div>
    <div class="action-bar-btns">
      <button class="btn btn-secondary" onclick="window.print()">
        🖨️ Print / Save as PDF
      </button>
    </div>
  </div>

  <div class="container">
    <!-- Hero Header -->
    <header class="hero" id="top">
      <div class="hero-pre">Anthropic Certified Professional Architect</div>
      <h1>${escapeHtml(docTitle)}</h1>
      <p style="color: #475569; font-size: 14px; max-width: 800px;">
        ${escapeHtml(docSubtitle)}
      </p>

      <div class="hero-meta">
        <div class="hero-stat">
          <span>Passing Criteria:</span>
          <strong>720 / 1000</strong>
        </div>
        <div class="hero-stat">
          <span>Exam Format:</span>
          <strong>60 Questions (120 Mins)</strong>
        </div>
        <div class="hero-stat">
          <span>Total Topics:</span>
          <strong>29 Architect Topics</strong>
        </div>
        <div class="hero-stat">
          <span>Export Date:</span>
          <strong>${exportDate}</strong>
        </div>
      </div>
    </header>

    ${
      exportType === 'complete'
        ? `
    <!-- 6 CCAR-F Exam Scenarios Card -->
    <section class="scenarios-card">
      <h3>🎯 6 Primary CCAR-F Exam Scenarios Breakdown</h3>
      <div class="scenario-grid">
        ${CCARF_EXAM_SCENARIOS.map(
          (sc) => `
          <div class="scenario-item">
            <strong>Scenario ${sc.number}: ${escapeHtml(sc.title)}</strong>
            <p>${escapeHtml(sc.description)}</p>
            <div style="margin-top: 4px; font-size: 10px; color: #4f46e5; font-weight: 600;">
              Target: ${escapeHtml(sc.domainFocus)}
            </div>
            <div style="margin-top: 2px; font-size: 10px; color: #059669;">
              <strong>Architect Focus:</strong> ${escapeHtml(sc.architectRole)}
            </div>
          </div>
        `
        ).join('')}
      </div>
    </section>

    <!-- Domains Weighting Summary -->
    <section class="scenarios-card" style="margin-bottom: 28px;">
      <h3>📊 Exam Domains & Blueprint Weightings</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px;">
        ${domainEntries
          .map(([domId, info]) => {
            const color = domainColors[domId];
            return `
            <div style="background: ${color.bg}; border: 1px solid ${color.border}; padding: 10px 14px; border-radius: 8px;">
              <div style="font-size: 11px; font-weight: 700; color: ${color.text};">${domId} • ${info.weight}%</div>
              <div style="font-size: 12px; font-weight: 700; color: #0f172a; margin-top: 2px;">${escapeHtml(info.name)}</div>
              <div style="font-size: 11px; color: #475569; margin-top: 4px;">${escapeHtml(info.description)}</div>
            </div>
          `;
          })
          .join('')}
      </div>
    </section>
    `
        : ''
    }

    <!-- Table of Contents -->
    ${
      exportType !== 'glossary'
        ? `
    <nav class="toc">
      <h2>📑 Quick Navigation Index (All 29 Topics)</h2>
      <div class="toc-grid">
        ${TOPICS_DATA.map(
          (topic) => `
          <a class="toc-link" href="#topic-${topic.id}">
            <span>
              <span class="topic-num">#${topic.id}</span>
              ${escapeHtml(topic.title)}
            </span>
            <span style="font-size: 10px; font-weight: 600; color: #64748b;">${topic.domainId}</span>
          </a>
        `
        ).join('')}
      </div>
    </nav>
    `
        : ''
    }

    <!-- Content Rendering -->
    ${
      exportType === 'glossary'
        ? `
    <main>
      <div class="scenarios-card">
        <h3>📖 Complete Exam Glossary & Architecture Dictionary (${GLOSSARY_TERMS.length} Terms)</h3>
        <p style="color: #64748b; font-size: 12px; margin-bottom: 20px;">
          Alphabetical directory of key concepts, parameters, APIs, security directives, and architectural patterns tested on the CCAR-F examination.
        </p>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 14px;">
          ${GLOSSARY_TERMS.map(
            (term) => `
            <div style="padding: 14px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; box-shadow: 0 1px 2px rgba(0,0,0,0.03);">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; margin-bottom: 6px;">
                <strong style="color: #0f172a; font-size: 13px;">${escapeHtml(term.term)}</strong>
                <span style="font-size: 10px; font-weight: 600; padding: 1px 6px; border-radius: 4px; background: #eef2ff; color: #4f46e5; border: 1px solid #c7d2fe;">
                  ${term.domainId}
                </span>
              </div>
              <p style="color: #334155; font-size: 12px; line-height: 1.5;">${escapeHtml(term.definition)}</p>
              ${
                term.category
                  ? `<div style="margin-top: 8px; font-size: 10px; color: #64748b;">Category: <em>${escapeHtml(term.category)}</em></div>`
                  : ''
              }
            </div>
          `
          ).join('')}
        </div>
      </div>
    </main>
    `
        : `
    <!-- All 29 Topics -->
    <main>
      ${TOPICS_DATA.map((topic) => {
        const domColor = domainColors[topic.domainId];
        const sDetails = topic.studyFocusDetails;
        const code = topic.codeSnippet;

        // If snippets-only, render a focused code cheatsheet card
        if (exportType === 'snippets-only') {
          return `
          <article class="topic-card" id="topic-${topic.id}">
            <div class="topic-header">
              <div class="topic-badges">
                <span class="badge-pill" style="background: ${domColor.bg}; color: ${domColor.text}; border-color: ${domColor.border};">
                  Topic #${topic.id} • ${topic.domainId}: ${escapeHtml(DOMAINS[topic.domainId].name)}
                </span>
                ${
                  sDetails
                    ? `<span class="badge-pill" style="background: #ecfdf5; color: #065f46; border-color: #a7f3d0;">
                        Scenario ${sDetails.scenarioMapping.scenarioNumber}: ${escapeHtml(sDetails.scenarioMapping.scenarioName)}
                      </span>`
                    : ''
                }
              </div>
              <a href="#top" class="no-print" style="font-size: 11px; color: #64748b; text-decoration: none;">↑ Top</a>
            </div>

            <h2 class="topic-title">${topic.id}. ${escapeHtml(topic.title)}</h2>

            ${
              code
                ? `
              <div class="code-block-container">
                <div class="code-block-header">
                  <span class="code-title">💻 ${escapeHtml(code.title)}</span>
                  <span class="code-lang">${code.language}</span>
                </div>
                <pre class="code-content"><code>${escapeHtml(code.code)}</code></pre>
                ${
                  code.caption
                    ? `
                  <div class="code-caption">
                    <span><strong>Exam Takeaway:</strong> ${escapeHtml(code.caption)}</span>
                  </div>
                `
                    : ''
                }
              </div>
            `
                : ''
            }

            <div style="font-size: 12px; color: #475569; background: #f8fafc; padding: 10px 14px; border-radius: 8px; border: 1px solid #e2e8f0;">
              <strong>Architect Directive:</strong> ${escapeHtml(sDetails ? sDetails.principle : topic.studyFocus)}
            </div>
          </article>
          `;
        }

        // Complete Study Guide View
        return `
        <article class="topic-card" id="topic-${topic.id}">
          <div class="topic-header">
            <div class="topic-badges">
              <span class="badge-pill" style="background: ${domColor.bg}; color: ${domColor.text}; border-color: ${domColor.border};">
                Topic #${topic.id} • ${topic.domainId}: ${escapeHtml(DOMAINS[topic.domainId].name)} (${DOMAINS[topic.domainId].weight}%)
              </span>
              ${
                topic.isGap
                  ? `<span class="badge-pill badge-gap">⚠️ Critical Gap (${escapeHtml(topic.gapDetails?.originalIssue || 'Exam Trap Area')})</span>`
                  : ''
              }
            </div>
            <a href="#top" class="no-print" style="font-size: 11px; color: #64748b; text-decoration: none;">↑ Top</a>
          </div>

          <h2 class="topic-title">${topic.id}. ${escapeHtml(topic.title)}</h2>

          <!-- Core Architectural Directive -->
          <div class="directive-box">
            <div class="directive-label">📘 Study Focus & Core Architectural Directive</div>
            <div class="directive-text">
              ${escapeHtml(sDetails ? sDetails.principle : topic.studyFocus)}
            </div>
          </div>

          <!-- Real-World Example & Analogy -->
          ${
            sDetails
              ? `
            <div class="two-col-grid">
              <div class="col-box example">
                <div class="col-title">⚙️ Real-World Implementation Example</div>
                <div class="col-text">${escapeHtml(sDetails.example)}</div>
              </div>
              <div class="col-box analogy">
                <div class="col-title">💡 Intuitive Analogy</div>
                <div class="col-text">${escapeHtml(sDetails.analogy)}</div>
              </div>
            </div>

            <!-- Scenario Mapping -->
            <div class="scenario-mapping-box">
              <div class="scenario-mapping-title">
                <span>🎯 CCAR-F Exam Scenario ${sDetails.scenarioMapping.scenarioNumber}: ${escapeHtml(sDetails.scenarioMapping.scenarioName)}</span>
                <span style="font-size: 10px; background: #d1fae5; padding: 1px 6px; border-radius: 4px;">Scenario ${sDetails.scenarioMapping.scenarioNumber} Target</span>
              </div>
              <div>
                <strong>What the Architect is Tested On:</strong> ${escapeHtml(sDetails.scenarioMapping.architectTestFocus)}
              </div>
            </div>
          `
              : ''
          }

          <!-- Quick Reference Code Snippet -->
          ${
            code
              ? `
            <div class="code-block-container">
              <div class="code-block-header">
                <span class="code-title">💻 Quick Reference: ${escapeHtml(code.title)}</span>
                <span class="code-lang">${code.language}</span>
              </div>
              <pre class="code-content"><code>${escapeHtml(code.code)}</code></pre>
              ${
                code.caption
                  ? `
                <div class="code-caption">
                  <span><strong>Exam Takeaway:</strong> ${escapeHtml(code.caption)}</span>
                </div>
              `
                  : ''
              }
            </div>
          `
              : ''
          }

          <!-- Keywords -->
          <div style="margin-bottom: 12px; display: flex; flex-wrap: wrap; gap: 4px; align-items: center;">
            <span style="font-size: 11px; font-weight: 600; color: #64748b; margin-right: 4px;">Key Concepts:</span>
            ${topic.keys
              .map(
                (k) => `
              <span style="background: #f1f5f9; color: #334155; font-size: 10px; font-family: monospace; padding: 2px 6px; border-radius: 4px; border: 1px solid #e2e8f0;">
                ${escapeHtml(k)}
              </span>
            `
              )
              .join('')}
          </div>

          <!-- Deep Dive Info -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 14px; font-size: 12px; color: #475569; margin-bottom: 12px;">
            <div style="margin-bottom: 4px;">
              <strong style="color: #0f172a;">Core Concept:</strong> ${escapeHtml(topic.deepDive.coreConcept)}
            </div>
            <div style="margin-bottom: 4px;">
              <strong style="color: #0f172a;">Key Mechanism:</strong> ${escapeHtml(topic.deepDive.keyMechanism)}
            </div>
            <div style="margin-top: 6px; font-size: 11px; color: #b45309; background: #fef3c7; padding: 6px 10px; border-radius: 6px; border: 1px solid #fde68a;">
              <strong>⚡ Exam Trigger:</strong> ${escapeHtml(topic.deepDive.examTrigger)}
            </div>
          </div>

          <!-- Practice Q&A -->
          <div class="qa-box">
            <h4 style="font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 8px;">
              📝 Exam Practice Flashcards (${topic.qa.length} Questions)
            </h4>
            ${topic.qa
              .map(
                (qaItem, idx) => `
              <div class="qa-item">
                <div class="qa-q">Q${idx + 1}: ${escapeHtml(qaItem.question)}</div>
                <div class="qa-a"><strong>Answer:</strong> ${escapeHtml(qaItem.answer)}</div>
                ${
                  qaItem.trap
                    ? `<div class="qa-tip">⚠️ <strong>Trap / Distinction:</strong> ${escapeHtml(qaItem.trap)}</div>`
                    : ''
                }
              </div>
            `
              )
              .join('')}
          </div>
        </article>
      `;
      }).join('')}
    </main>
    `
    }

    <!-- Key Glossary Appendix -->
    ${
      exportType === 'complete'
        ? `
    <section class="scenarios-card" style="margin-top: 40px;" id="glossary">
      <h3>📖 High-Priority Architecture Glossary (CCAR-F Terms)</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 10px;">
        ${GLOSSARY_TERMS.slice(0, 16)
          .map(
            (term) => `
          <div style="padding: 10px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 11px;">
            <strong style="color: #0f172a; display: block; margin-bottom: 2px;">${escapeHtml(term.term)}</strong>
            <span style="color: #475569;">${escapeHtml(term.definition)}</span>
          </div>
        `
          )
          .join('')}
      </div>
    </section>
    `
        : ''
    }

    <footer style="margin-top: 60px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 24px;">
      <p>Anthropic Claude Certified Architect Foundation (CCAR-F) Comprehensive Study Guide</p>
      <p style="margin-top: 4px;">Standalone Offline Reference • Generated for Certified Architect Candidates</p>
    </footer>
  </div>

  <a href="#top" class="back-to-top no-print">↑ Back to Top</a>
</body>
</html>`;
}

export function downloadStudyGuideHtml(exportType: ExportHtmlType = 'complete'): void {
  const htmlContent = generateStudyGuideHtml(exportType);
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `CCAR-F-Claude-Architect-Study-Guide-${new Date().toISOString().slice(0, 10)}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function openStudyGuideHtmlInNewTab(exportType: ExportHtmlType = 'complete'): void {
  const htmlContent = generateStudyGuideHtml(exportType);
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
