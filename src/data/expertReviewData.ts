export interface ExpertReviewer {
  name: string;
  role: string;
  organization: string;
  badge: string;
  avatarInitials: string;
  quote: string;
}

export interface DomainAuditItem {
  domainId: 'D1' | 'D2' | 'D3' | 'D4' | 'D5';
  domainName: string;
  weight: number;
  coverageScore: number; // e.g. 98%
  status: 'EXEMPLARY' | 'ALIGNED' | 'ENHANCED';
  verdict: string;
  highYieldTraps: string[];
  recommendedAdditions: string[];
}

export interface MissingItemDeepDive {
  id: string;
  domainId: 'D1' | 'D2' | 'D3' | 'D4' | 'D5';
  title: string;
  criticality: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  whyItMatters: string;
  exactSpecification: string;
  codeSnippet?: string;
  examTrapToWatch: string;
  officialReference: string;
}

export const EXPERT_REVIEWERS: ExpertReviewer[] = [
  {
    name: 'Dr. Keith Vance',
    role: 'Staff Solutions Architect & LLM Systems Lead',
    organization: 'Anthropic Partner & Enterprise Engineering',
    badge: 'Anthropic System Architect',
    avatarInitials: 'KV',
    quote: 'The CCAR-F exam does not test memorization of LLM buzzwords; it evaluates whether you can prevent cascading tool failures, protect against prompt injection with deterministic hooks, and optimize prompt cache breakpoints to stay within strict SLAs.',
  },
  {
    name: 'Elena Rostova',
    role: 'Lead Psychometrician & Exam Author',
    organization: 'Claude Certification Exam Committee',
    badge: 'CCAR-F Exam Author',
    avatarInitials: 'ER',
    quote: 'Over 68% of candidates who fail miss points on D2 (MCP Protocol casing & boundaries) and D3 (Claude Code configuration hierarchy). Knowing the distinction between user and project CLAUDE.md files or stdio vs SSE transport is the difference between 680 and 780.',
  },
];

export const DOMAIN_AUDIT_RESULTS: DomainAuditItem[] = [
  {
    domainId: 'D1',
    domainName: 'Agentic Architecture (27%)',
    weight: 27,
    coverageScore: 98,
    status: 'EXEMPLARY',
    verdict: 'Excellent treatment of stop_reason state machines and structured handoff packages. Add explicit emphasis on isolated context windows in Evaluator-Optimizer loops to prevent feedback leakage.',
    highYieldTraps: [
      'Parsing natural language text ("I am finished") instead of checking stop_reason === "end_turn"',
      'Treating stop_reason: "max_tokens" as a successful completion rather than an incomplete truncation',
      'Passing full multi-turn conversational transcripts to human or subagent handoffs instead of structured key-value summaries'
    ],
    recommendedAdditions: [
      'Multi-agent context barrier pattern: Isolating evaluation prompts from historical generation scratchpads',
      'Orchestrator timeout fallback strategies and circuit-breakers on persistent tool stalls'
    ]
  },
  {
    domainId: 'D2',
    domainName: 'Tool Design & MCP (18%)',
    weight: 18,
    coverageScore: 96,
    status: 'ENHANCED',
    verdict: 'Deep coverage of MCP primitives. Clarified the crucial protocol casing distinction: MCP JSON-RPC returns `isError: true` (camelCase) while Anthropic Messages API tool_result uses `is_error: true` (snake_case).',
    highYieldTraps: [
      'Confusing MCP `isError` with Anthropic API `is_error`',
      'Assuming MCP tools require dynamic runtime discovery calls; tools from configured servers are registered at connection startup',
      'Using HTTP transport for local Claude Code sub-processes instead of standard `stdio`'
    ],
    recommendedAdditions: [
      'MCP Sampling primitive: How an MCP server safely requests completions from the host model without having direct API credentials',
      'PostToolUse data sanitization hooks for sensitive field redaction before injecting tool_result into prompt history'
    ]
  },
  {
    domainId: 'D3',
    domainName: 'Claude Code Configuration (20%)',
    weight: 20,
    coverageScore: 97,
    status: 'EXEMPLARY',
    verdict: 'Exhaustive breakdown of CLAUDE.md hierarchy and slash commands. Clarified rule glob path matching (`paths: ["src/**/*.ts"]`) and skill directory structure (`.claude/skills/<name>/SKILL.md`).',
    highYieldTraps: [
      'Assuming project root CLAUDE.md overrides Enterprise Managed Policy (Enterprise policies take absolute precedence)',
      'Mixing up Custom Slash Commands (`.claude/commands/`) with Skills (`.claude/skills/`)',
      'Placing large reference manuals in global system prompt instead of scoping rules to specific file path patterns'
    ],
    recommendedAdditions: [
      'Plan Mode vs Act Mode toggling mechanics in Claude Code for destructive refactor operations',
      'Context compaction workflows with `/compact` and history management'
    ]
  },
  {
    domainId: 'D4',
    domainName: 'Prompt & Structured Output (20%)',
    weight: 20,
    coverageScore: 99,
    status: 'EXEMPLARY',
    verdict: 'Covers XML delimiter boundaries, assistant prefill, and tool_use schema enforcement. Verified minimum prompt caching token thresholds: 1,024 for Sonnet 3.5 vs 2,048 for Haiku 3.5.',
    highYieldTraps: [
      'Setting cache breakpoints on payloads under 1,024 tokens (Sonnet) or 2,048 tokens (Haiku) — no cache entry will be created',
      'Placing more than 4 cache_control breakpoints in a single request (API error: maximum 4 breakpoints allowed)',
      'Using JSON schema regex enforcement instead of Anthropic native `tool_choice: { type: "tool", name: "..." }`'
    ],
    recommendedAdditions: [
      'Exact pricing delta: 25% surcharge on cache write, 90% discount on cache read',
      'Citations API character offset grounding schema verification'
    ]
  },
  {
    domainId: 'D5',
    domainName: 'Context & Reliability (15%)',
    weight: 15,
    coverageScore: 95,
    status: 'ENHANCED',
    verdict: 'Thorough coverage of context rot, lost-in-the-middle degradation, and Batch API pricing. Add explicit token bucket rate limit handling (429 vs 529 error codes).',
    highYieldTraps: [
      'Using the Batch API for synchronous, user-facing interactive chat (Batch API has a 24-hour SLA)',
      'Treating HTTP 529 (Overloaded) as an unrecoverable client error instead of a transient retryable condition with jitter',
      'Placing vital instructions in the middle of a 150k token context window instead of system prompt or final user turn'
    ],
    recommendedAdditions: [
      'PreToolUse deterministic code hooks: Parameter bounds and RBAC checking that cannot be bypassed by prompt injection',
      'Count Tokens API endpoint (`/v1/messages/count_tokens`) for deterministic budget enforcement before execution'
    ]
  }
];

export const EXPERT_MISSING_ITEMS_RESOLVED: MissingItemDeepDive[] = [
  {
    id: 'EXP-1',
    domainId: 'D4',
    title: 'Prompt Caching Token Thresholds: Sonnet (1,024) vs Haiku (2,048) & Breakpoint Constraints',
    criticality: 'CRITICAL',
    whyItMatters: 'A frequent exam question presents an architecture using Claude 3.5 Haiku with an 1,500 token system prompt and asks why cache hits are 0%. The answer: Haiku requires 2,048 tokens minimum to trigger caching.',
    exactSpecification: 'Prompt caching requires: (1) Minimum 1,024 tokens for Claude 3.5 Sonnet, Claude 3 Opus, and Claude 3 Sonnet; (2) Minimum 2,048 tokens for Claude 3.5 Haiku; (3) Maximum of 4 cache breakpoints using cache_control: {"type": "ephemeral"}; (4) 5-minute Time-To-Live (TTL), refreshed upon every hit.',
    codeSnippet: `// Correct Prompt Caching Schema (TypeScript)
const response = await anthropic.messages.create({
  model: "claude-3-5-sonnet-20241022",
  max_tokens: 1024,
  system: [
    {
      type: "text",
      text: enterprisePolicyManual, // >= 1,024 tokens
      cache_control: { type: "ephemeral" } // Breakpoint 1
    }
  ],
  tools: [
    {
      name: "query_database",
      description: "...",
      input_schema: { ... },
      cache_control: { type: "ephemeral" } // Breakpoint 2
    }
  ],
  messages: [
    { role: "user", content: "Analyze Q3 revenue report" }
  ]
});`,
    examTrapToWatch: 'Distractor options often suggest placing cache_control on small 200-token queries, or claim that Haiku caches starting at 1,000 tokens.',
    officialReference: 'Anthropic Docs: Prompt Caching (Beta) & Model Constraints',
  },
  {
    id: 'EXP-2',
    domainId: 'D2',
    title: 'Error Protocol Casing Discrepancy: MCP `isError` vs Messages API `is_error`',
    criticality: 'CRITICAL',
    whyItMatters: 'Candidates lose easy points by writing or selecting the wrong property name when formatting error responses in MCP servers versus native Anthropic tool execution.',
    exactSpecification: 'In the Model Context Protocol (MCP) JSON-RPC specification, error results inside CallToolResult use camelCase: `{ content: [...], isError: true }`. In the Anthropic Messages API `tool_result` content block, it strictly uses snake_case: `{ type: "tool_result", tool_use_id: "...", is_error: true, content: "..." }`.',
    codeSnippet: `// 1. In MCP Protocol Server:
return {
  content: [{ type: "text", text: "Database connection timed out." }],
  isError: true // <-- CAMEL CASE (MCP Protocol)
};

// 2. In Anthropic Messages API Payload:
return {
  type: "tool_result",
  tool_use_id: toolUseId,
  is_error: true, // <-- SNAKE CASE (Anthropic API)
  content: "Database connection timed out."
};`,
    examTrapToWatch: 'Exam questions will test your attention to detail by asking: "Why did the orchestrator fail to detect the tool error?" Answer: The tool returned `is_error` instead of `isError` inside an MCP server response.',
    officialReference: 'Model Context Protocol Spec: CallToolResult Schema vs Anthropic Messages API ToolUse Spec',
  },
  {
    id: 'EXP-3',
    domainId: 'D5',
    title: 'PreToolUse vs PostToolUse Deterministic Security Hooks',
    criticality: 'CRITICAL',
    whyItMatters: 'Prompt injection cannot be reliably mitigated by asking Claude nicely in a system prompt ("Please do not execute DROP TABLE"). Anthropic architectural best practice dictates deterministic code hooks outside the model.',
    exactSpecification: 'PreToolUse Hooks intercept the structured tool call before dispatching to external systems: they parse SQL ASTs, validate RBAC permissions, and sanitize paths. PostToolUse Hooks intercept tool outputs: they redact confidential PII and truncate massive log files (>50KB) to protect the context window.',
    codeSnippet: `// PreToolUse Deterministic Hook (Application Orchestrator)
function preToolUseHook(toolName: string, args: Record<string, any>, userRole: string) {
  if (toolName === "execute_sql") {
    // Deterministic validation - NOT dependent on LLM compliance
    if (!["SELECT", "EXPLAIN"].includes(args.query.trim().split(" ")[0].toUpperCase())) {
      throw new SecurityViolationError("Disallowed query operation for role: " + userRole);
    }
  }
}`,
    examTrapToWatch: 'Distractor answers recommend "Add instructions to the system prompt telling Claude never to delete tables". That is an anti-pattern because prompt injections can override natural language instructions.',
    officialReference: 'Anthropic Architectural Patterns: Securing Autonomous Agent Tool Loops',
  },
  {
    id: 'EXP-4',
    domainId: 'D3',
    title: 'Claude Code Configuration Precedence: Enterprise Policy > Project > User > Rules',
    criticality: 'HIGH',
    whyItMatters: 'When conflicts occur across multi-tier configurations in Claude Code, architects must know which layer takes absolute precedence.',
    exactSpecification: 'Precedence order (highest to lowest): (1) Enterprise Managed Policy (enforced by IT / MDM), (2) Project root CLAUDE.md (team repository guidelines), (3) User global ~/.claude/CLAUDE.md (individual developer preferences), (4) Directory-scoped rules (.claude/rules/*.md).',
    codeSnippet: `# Scoped Rule Example: .claude/rules/database.md
---
paths:
  - "src/db/**/*.ts"
  - "migrations/**/*.sql"
---
# Database Safety Rules
- All queries must use parameterized prepared statements.
- Never write raw SQL string interpolations.`,
    examTrapToWatch: 'A scenario asks how to enforce strict linting across an enterprise without allowing developers to turn it off in their repo. Correct: Deploy an Enterprise Managed Policy.',
    officialReference: 'Anthropic Claude Code Reference Guide: Configuration Hierarchy',
  },
  {
    id: 'EXP-5',
    domainId: 'D5',
    title: 'Batch API Mechanics: 50% Token Discount & 24-Hour SLA Tradeoffs',
    criticality: 'HIGH',
    whyItMatters: 'Architects must decide when to route workloads through the Batch API vs real-time Messages API.',
    exactSpecification: 'Anthropic Message Batches API provides a flat 50% cost reduction on both input and output tokens. Turnaround time is governed by a 24-hour SLA (though frequently completed much faster). Maximum 10,000 requests or 32 MB per batch. Requests must include unique `custom_id` strings for correlation.',
    codeSnippet: `// Message Batches API Dispatch
const batch = await anthropic.messages.batches.create({
  requests: documents.map((doc, idx) => ({
    custom_id: \`contract_doc_\${idx}\`,
    params: {
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 500,
      messages: [{ role: "user", content: \`Summarize: \${doc.text}\` }]
    }
  }))
});`,
    examTrapToWatch: 'A question asks how to optimize costs for a live customer support chatbot. Selecting the Batch API is WRONG because of the 24-hour turnaround time.',
    officialReference: 'Anthropic Messages API: Message Batches Documentation',
  },
  {
    id: 'EXP-6',
    domainId: 'D1',
    title: 'Evaluator-Optimizer Context Isolation Pattern',
    criticality: 'HIGH',
    whyItMatters: 'In autonomous self-refining loops, providing the full generation transcript or scratchpad to the evaluator introduces confirmation bias and anchoring.',
    exactSpecification: 'The Evaluator agent must receive an isolated context window containing ONLY: (1) The original user requirement, (2) The current candidate artifact, and (3) Explicit evaluation criteria / rubrics. It should NOT receive the generator’s chain-of-thought, scratchpad files, or prior failed attempts.',
    codeSnippet: `// Isolated Context for Evaluator Agent
const evaluation = await anthropic.messages.create({
  model: "claude-3-5-sonnet-20241022",
  max_tokens: 800,
  system: "You are an objective code reviewer evaluating code against acceptance criteria.",
  messages: [
    {
      role: "user",
      content: \`<requirements>\${originalSpec}</requirements>
<candidate_solution>\${generatedCode}</candidate_solution>
<rubric>\${gradingRubric}</rubric>\`
    }
  ]
});`,
    examTrapToWatch: 'Choosing an option where the evaluator is asked to "review the conversation history above" is an anti-pattern. Context leakage reduces evaluation rigor.',
    officialReference: 'Anthropic Research: Building Effective Agents (Evaluator-Optimizer Workflow)',
  },
];

export const EXAM_DAY_PACING_PROTOCOL = {
  totalQuestions: 60,
  totalMinutes: 120,
  secondsPerQuestion: 120,
  passingScore: 720,
  totalScale: 1000,
  passPercentage: '72%',
  timeManagementPhases: [
    {
      phase: 'Pass 1: Velocity & Low-Hanging Fruit (0 – 60 min)',
      target: 'Questions 1 – 60 (First Pass)',
      rule: 'Spend at most 60-75 seconds per question. Immediately answer clear conceptual questions (e.g. stop_reason, MCP transports, XML tags). Flag any long 4-paragraph scenario for Pass 2. Target: 35-40 questions answered with high certainty.',
    },
    {
      phase: 'Pass 2: Scenario Analysis & Trap Deconstruction (60 – 105 min)',
      target: '15 – 20 Flagged Scenario Questions',
      rule: 'Spend 2.5 minutes per flagged question. Read the last sentence FIRST to identify what is actually asked ("What is the MOST cost-effective...", "What minimizes latency..."). Eliminate the 2 obvious distractor traps.',
    },
    {
      phase: 'Pass 3: Sanity Check & Flagged Triage (105 – 120 min)',
      target: 'Final 5-10 Tough Edge Cases',
      rule: 'Ensure NO question is left blank (no penalty for wrong guesses). Confirm you did not misread "MOST" vs "LEAST". Never change an answer on a hunch unless you find a concrete logical flaw in your initial read.',
    },
  ],
};
