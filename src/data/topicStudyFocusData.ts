import { StudyFocusDetails } from '../types';

export interface CCARFScenarioInfo {
  number: 1 | 2 | 3 | 4 | 5 | 6;
  id: string;
  title: string;
  domainFocus: string;
  description: string;
  architectRole: string;
}

export const CCARF_EXAM_SCENARIOS: CCARFScenarioInfo[] = [
  {
    number: 1,
    id: 'SCENARIO_1',
    title: 'Omnichannel Customer Support & Live Triage Agent',
    domainFocus: 'D1: Agentic Architecture & D5: Context & Reliability',
    description: 'High-volume customer interaction, intent classification, CRM/Billing tool execution, human-in-the-loop escalation, SLA latency control, PII redaction, and session state management.',
    architectRole: 'Designing fail-safe loop state machines, preventing runaway API calls, structuring human handoff packages, and establishing objective escalation triggers.'
  },
  {
    number: 2,
    id: 'SCENARIO_2',
    title: 'Enterprise Code Assistant & Autonomous DevSecOps System',
    domainFocus: 'D2: Tool Design & D3: Claude Code Configuration',
    description: 'Claude Code configuration hierarchy, CLAUDE.md standards, MCP dev tools, PreToolUse/PostToolUse deterministic AST lint hooks, git fork_session branching, and systematic codebase exploration.',
    architectRole: 'Enforcing deterministic security boundaries via programmatic hooks, managing multi-tier configuration precedence, and scoping codebase exploration to minimize token usage.'
  },
  {
    number: 3,
    id: 'SCENARIO_3',
    title: 'Financial Regulatory Compliance & Contract Audit Extractor',
    domainFocus: 'D4: Prompt & Structured Output & D5: Context & Reliability',
    description: 'Long legal/financial document ingestion, prompt caching breakpoints, XML schema boundaries, Citations API character-level grounding, nullable/optional schema fields, and zero hallucination.',
    architectRole: 'Eliminating fabrication through tool_choice schema enforcement, designing nullable JSON schemas, implementing XML delimiter boundaries, and calibrating human review queues.'
  },
  {
    number: 4,
    id: 'SCENARIO_4',
    title: 'Multi-Agent Deep Research & Market Intelligence Pipeline',
    domainFocus: 'D1: Agentic Architecture & D2: Tool Design',
    description: 'Orchestrator-Workers topology, Evaluator-Optimizer feedback loops, context window isolation, parallel tool calling, dynamic subtask decomposition, structured handoffs, and token budget enforcement.',
    architectRole: 'Selecting the optimal multi-agent topology, isolating evaluation contexts from scratchpad bias, and sequencing dynamic turn-by-turn tool_choice modes.'
  },
  {
    number: 5,
    id: 'SCENARIO_5',
    title: 'Multi-Tool Enterprise Knowledge Retrieval (RAG & Distributed Systems)',
    domainFocus: 'D2: Tool Design & D5: Context & Reliability',
    description: 'Model Context Protocol (MCP) server architecture, stdio vs SSE transports, resource vs tool vs prompt primitives, unambiguous tool descriptions, tool_choice routing, and MCP sampling.',
    architectRole: 'Architecting enterprise MCP server configurations, mastering protocol casing differences (isError vs is_error), and crafting rich negative tool descriptions to eliminate misrouting.'
  },
  {
    number: 6,
    id: 'SCENARIO_6',
    title: 'High-Throughput Document Ingestion & Cost-Optimized Batch Engine',
    domainFocus: 'D4: Prompt & Structured Output & D5: Context & Reliability',
    description: 'Anthropic Message Batches API, 50% pricing discount, Haiku vs Sonnet vs Opus tier routing, asynchronous completion polling, token rate limit mitigation, and structured error recovery.',
    architectRole: 'Balancing real-time latency requirements against batch economic trade-offs (50% discount), designing asynchronous job polling, and routing requests across model intelligence tiers.'
  }
];

export const TOPIC_STUDY_FOCUS_MAP: Record<number, StudyFocusDetails> = {
  1: {
    principle: 'Agent execution loops must be strictly gated by the structured API signal stop_reason (checking for "end_turn" to terminate and "tool_use" to execute tools), never by parsing natural-language conversational text. An iteration cap is an emergency circuit breaker, not the primary stop mechanism.',
    example: 'In an automated tier-1 support agent, Claude generates text explaining a refund alongside a tool_use block for "process_refund". Even though text is present, stop_reason is "tool_use". The orchestrator executes the refund tool and feeds back tool_result. When Claude completes all processing, it outputs stop_reason: "end_turn". The orchestrator halts the loop and emits the customer reply.',
    analogy: 'An air traffic controller reading the digital transponder squawk code rather than guessing an aircraft\'s altitude from casual radio chatter. The transponder signal (stop_reason) is authoritative; conversational chatter is secondary.',
    scenarioMapping: {
      scenarioNumber: 1,
      scenarioName: 'Omnichannel Customer Support & Live Triage Agent',
      architectTestFocus: 'Building an event-driven loop state machine that prevents infinite loops, correctly distinguishes "tool_use" from "end_turn", and safely handles "max_tokens" truncation without treating it as normal completion.'
    }
  },
  2: {
    principle: 'Subagents and human operators do not automatically inherit conversation history from parent agents. Handoffs must be packaged into a typed, structured object containing Customer ID, Root Cause, Actions Taken, Current State, and Recommended Next Steps.',
    example: 'When escalating an unresolved billing dispute to a human agent, the triage agent packages { customerId: "CUST-8831", rootCause: "overcharge_promo_expired", actionsTaken: ["verified_invoice_902", "checked_discount_rule"], currentState: "customer_demands_supervisor", recommendedNextStep: "issue_one_time_credit_50" }. The human resolves the case in 15 seconds without re-asking questions.',
    analogy: 'A surgical hospital patient handover where the anesthesiologist hands the ICU nurse a structured vitals chart, drug log, and post-op checklist—not a 4-hour raw audio recording of the surgery.',
    scenarioMapping: {
      scenarioNumber: 1,
      scenarioName: 'Omnichannel Customer Support & Live Triage Agent',
      architectTestFocus: 'Recognizing that passing raw multi-turn conversation transcripts bloats context and causes lost-in-the-middle omissions; structured, key-value summaries are mandatory for downstream actionability.'
    }
  },
  3: {
    principle: 'Resume existing sessions with --resume only when prior context and codebase state remain valid. When files have changed substantially (e.g., git branch switch), start a fresh session with an injected structured summary. Use fork_session for independent architectural experiments.',
    example: 'A developer has a 25-turn session refactoring an authentication service. If they pull upstream git changes with 18 modified files, --resume causes Claude Code to hallucinate based on stale tool outputs. The architect spins up a fresh session, injecting { branch: "auth-v2", modifiedFiles: ["auth.ts", "session.ts"], currentObjective: "implement JWT refresh" }.',
    analogy: 'Navigating with GPS: if you briefly pause your car at a highway rest stop, you hit "Resume Route" (--resume). But if a bridge was demolished ahead and road layouts shifted, you must recalibrate a fresh route from current coordinates.',
    scenarioMapping: {
      scenarioNumber: 2,
      scenarioName: 'Enterprise Code Assistant & Autonomous DevSecOps System',
      architectTestFocus: 'Identifying when prior tool outputs are stale and choosing between --resume, starting fresh with a high-density summary, or branching via fork_session.'
    }
  },
  4: {
    principle: 'Apply the simplest architecture that fits the task: use sequential prompt chaining for deterministic, predictable steps; dynamic decomposition with an Orchestrator-Workers pattern for open-ended discovery; and hybrid planning-then-execution for large migrations.',
    example: 'Analyzing 5 competitor whitepapers requires dynamic decomposition: an Orchestrator inspects the document index, assigns 5 parallel worker subagents (each analyzing one competitor against a shared schema), and an aggregator synthesizer compiles the market grid.',
    analogy: 'A general contractor building a house. For pouring concrete and framing, steps follow a strict critical path (chaining). But during interior finishing, the contractor dynamically assigns specialized subcontractors (plumbers, electricians, painters) to work concurrently.',
    scenarioMapping: {
      scenarioNumber: 4,
      scenarioName: 'Multi-Agent Deep Research & Market Intelligence Pipeline',
      architectTestFocus: 'Preventing over-engineering (e.g., using expensive multi-agent loops when simple sequential prompt chaining is faster and cheaper) and handling large multi-file workloads by splitting into local analysis passes before synthesis.'
    }
  },
  5: {
    principle: 'Deterministic guarantees cannot be achieved through prompt instructions alone. Use PreToolUse hooks for programmatic validation, security checks, and permission gating before tool execution; use PostToolUse hooks for payload sanitization, PII redaction, and output size trimming before results enter model context.',
    example: 'In Claude Code, an executable PreToolUse hook inspects bash commands via regex/AST to block "rm -rf /" or unauthorized git pushes. A PostToolUse hook on a SQL query tool automatically truncates result sets exceeding 50KB and masks credit card numbers with [REDACTED].',
    analogy: 'An airport security checkpoint (PreToolUse checks your boarding pass and bags before boarding) and customs declaration (PostToolUse inspects goods and taxes duty before releasing you into the city).',
    scenarioMapping: {
      scenarioNumber: 2,
      scenarioName: 'Enterprise Code Assistant & Autonomous DevSecOps System',
      architectTestFocus: 'Placing hard deterministic security controls in code hooks rather than relying on LLM prompt compliance, and knowing how to prevent context window overflow from verbose tool returns.'
    }
  },
  6: {
    principle: 'The core agentic loop is an asynchronous state machine: send messages + tools array -> inspect stop_reason -> if "tool_use", dispatch all tool calls (in parallel when independent) -> format results as role: "user" with tool_result content blocks -> repeat until stop_reason: "end_turn". If stop_reason: "max_tokens", trigger continuation.',
    example: 'Claude returns 3 parallel web search queries with stop_reason: "tool_use". The backend executes all 3 searches concurrently via Promise.all(), appends 3 tool_result blocks matching their tool_use_ids, and invokes the API again.',
    analogy: 'A ping-pong volley between client and server where the ball\'s spin (stop_reason) tells the player whether to return a tool execution strike or let the point conclude (end_turn).',
    scenarioMapping: {
      scenarioNumber: 4,
      scenarioName: 'Multi-Agent Deep Research & Market Intelligence Pipeline',
      architectTestFocus: 'Distinguishing between tool_use, end_turn, max_tokens, and stop_sequence, correctly matching tool_use_id in tool_result, and handling partial tool failures without crashing the loop.'
    }
  },
  7: {
    principle: 'Custom slash commands package repeatable, prompt-engineered workflows into single-token invocations. Project-level commands live in .claude/commands/ and are shared via git across the engineering team; user commands live in ~/.claude/commands/ for personal aliases.',
    example: 'A team creates .claude/commands/security-audit.md containing instructions to run "npm audit", grep for dangerous SQL patterns, and format output as a Sarbanes-Oxley audit table. Developers run /security-audit before opening any pull request.',
    analogy: 'A macro shortcut or keyboard keybinding on a developer\'s IDE that triggers a pre-recorded multi-step sequence instantly.',
    scenarioMapping: {
      scenarioNumber: 2,
      scenarioName: 'Enterprise Code Assistant & Autonomous DevSecOps System',
      architectTestFocus: 'Distinguishing between Project vs User slash command scopes, knowing where they reside on the filesystem, and choosing commands over skills when the task is an explicit user-invoked prompt workflow.'
    }
  },
  8: {
    principle: 'Do not attempt monolithic, single-prompt code generations. Structure iterative refinement: 1) Clarify requirements and interface specifications, 2) Write automated unit/integration tests, 3) Implement minimal code pass, 4) Run verification hook, 5) Feed targeted failure diagnostics back for surgical remediation.',
    example: 'Refactoring an OAuth2 token refresh pipeline: Claude writes test cases in auth.test.ts, runs npm test via bash tool, receives 2 assertion failures, inspects exact error lines, and updates only the expired timestamp comparison logic.',
    analogy: 'A sculptor carving marble: rough-hewing the shape with large strokes, chiseling anatomical details, and buffing fine textures, checking proportions with calipers at each stage.',
    scenarioMapping: {
      scenarioNumber: 2,
      scenarioName: 'Enterprise Code Assistant & Autonomous DevSecOps System',
      architectTestFocus: 'Architectural patterns that avoid token-heavy "hallucinated fixes" by establishing automated test fixtures as objective ground truth before generating production patches.'
    }
  },
  9: {
    principle: 'Toggle between Plan Mode (Shift + Tab or /plan) and Direct Execution (Act Mode) based on problem ambiguity and blast radius. Use Plan Mode for multi-file architectural discovery, refactoring dependencies, or risky schema migrations. Switch to Direct Execution once the execution plan is reviewed and approved.',
    example: 'Before migrating 40 database models from TypeORM to Prisma, the architect engages Plan Mode. Claude explores schema relationships with read-only tools, drafts migration phases, and presents a non-destructive plan for developer sign-off before modifying any source files.',
    analogy: 'An architect drafting blueprints and structural load calculations before construction workers bring bulldozers and pour concrete on site.',
    scenarioMapping: {
      scenarioNumber: 2,
      scenarioName: 'Enterprise Code Assistant & Autonomous DevSecOps System',
      architectTestFocus: 'Identifying the threshold for Plan Mode (unclear requirements, high risk, >3 interdependent files) vs Direct Execution (single-file bugfix, localized utility function).'
    }
  },
  10: {
    principle: 'Strict boundary rule: Settings, OS permissions, and programmatic hooks enforce deterministic constraints (100% compliance); CLAUDE.md instructions guide model reasoning probabilistically (~95% compliance). Never rely on prompt text to prevent dangerous filesystem or network operations.',
    example: 'To prevent deletion of production databases, configure Claude Code permissions with an explicit deny list on "rm -rf *" and run an executable PreToolUse hook verifying git branch != "main". Put styling preferences (tabs vs spaces, CamelCase) in CLAUDE.md.',
    analogy: 'A bank vault\'s steel door with biometric locks (deterministic hooks/permissions) versus a polite sign asking customers to speak quietly in the lobby (CLAUDE.md).',
    scenarioMapping: {
      scenarioNumber: 2,
      scenarioName: 'Enterprise Code Assistant & Autonomous DevSecOps System',
      architectTestFocus: 'Selecting the correct enforcement layer on exam questions where security compliance or data loss prevention is mandated.'
    }
  },
  11: {
    principle: 'Multi-tier precedence hierarchy: Enterprise Managed Policy > Project CLAUDE.md > User ~/.claude/CLAUDE.md > Scoped Path Rules .claude/rules/*.md. Scoped rules apply conditionally using glob patterns (paths: ["src/api/**/*.ts"]).',
    example: 'Enterprise policy mandates SOC2 logging; project CLAUDE.md specifies Next.js 14 conventions; a scoped rule .claude/rules/database.md injects strict transaction isolation requirements only when editing files under src/db/**.',
    analogy: 'Federal law (Enterprise) supersedes State law (Project CLAUDE.md), which supersedes Municipal code (User config), with specific zoning bylaws (Scoped path rules) governing only designated commercial zones.',
    scenarioMapping: {
      scenarioNumber: 2,
      scenarioName: 'Enterprise Code Assistant & Autonomous DevSecOps System',
      architectTestFocus: 'Evaluating configuration conflict resolution and choosing the appropriate scope to prevent global context clutter.'
    }
  },
  12: {
    principle: 'PostToolUse hooks execute immediately after a tool finishes, allowing the host application to validate, lint, format, or normalize output before the result is injected into Claude\'s context window.',
    example: 'After Claude edits UserService.ts with the FileEdit tool, a PostToolUse hook automatically runs "eslint --fix" and "prettier". If ESLint fails with syntax errors, the hook intercepts the response and feeds the linter error back as the tool result for immediate correction.',
    analogy: 'A manufacturing quality-assurance conveyor scanner that inspects every packaged item coming off the assembly line, immediately rejecting defective items back to the rework station.',
    scenarioMapping: {
      scenarioNumber: 2,
      scenarioName: 'Enterprise Code Assistant & Autonomous DevSecOps System',
      architectTestFocus: 'Implementing automated lint/test verification loops that guarantee generated code conforms to repository standards without requiring manual human prompting.'
    }
  },
  13: {
    principle: 'Efficient agentic exploration follows a funnel: 1) Glob to map file tree structures and identify candidate directories, 2) Grep to locate exact symbol definitions and usages across candidate files, 3) Read with targeted line ranges to inspect implementations. Never dump entire repositories or 10,000-line files into context.',
    example: 'To fix an authentication bug in a 200,000-line codebase: run Glob("src/auth/**/*.ts") to find 4 files, run Grep("verifyJwtToken", "src/auth/") to find lines 112-140 in jwt.ts, then call Read("src/auth/jwt.ts", start: 110, end: 150).',
    analogy: 'Finding a specific legal statute in a law library: look at the room directory (Glob), search the book index for keywords (Grep), and open only the designated volume to page 240 (Read).',
    scenarioMapping: {
      scenarioNumber: 2,
      scenarioName: 'Enterprise Code Assistant & Autonomous DevSecOps System',
      architectTestFocus: 'Minimizing token expenditure and preventing context bloat by selecting the precise exploratory tool sequence instead of brute-force reading.'
    }
  },
  14: {
    principle: 'Model Context Protocol (MCP) servers must be scoped appropriately: project-level MCP configurations (.mcp.json or .claude/mcp.json) for team-shared tools (Postgres DB, GitHub, Jira) using ${ENV_VAR} expansion for credentials; user-level configuration (~/.claude/mcp.json) for personal developer utilities.',
    example: 'A project repository commits .mcp.json with an internal Postgres MCP server configuration pointing to "localhost:5432" with user "${PG_USER}" and password "${PG_PASSWORD}". Developers supply secrets in their local .env rather than checking credentials into version control.',
    analogy: 'Team tools kept in the company workshop accessible by employee ID badges (Project MCP with env vars) versus personal pocket knives kept in an individual\'s backpack (User MCP).',
    scenarioMapping: {
      scenarioNumber: 5,
      scenarioName: 'Multi-Tool Enterprise Knowledge Retrieval (RAG & Distributed Systems)',
      architectTestFocus: 'Distinguishing between project and user MCP scopes and enforcing secret management best practices.'
    }
  },
  15: {
    principle: 'Long-running agent sessions suffer from context rot, attention dilution, and ballooning token costs. Combat this with: 1) Structured state persistence in external stores, 2) Early PostToolUse output truncation, 3) Invoking /compact or context summarization milestones, 4) Offloading deep exploration to ephemeral subagents.',
    example: 'An autonomous market research agent reviewing 30 competitor SEC 10-K filings stores extracted metrics in SQLite after each document. It runs /compact after every 5 documents to replace verbose tool call transcripts with a dense 500-token summary of findings.',
    analogy: 'An investigator clearing a whiteboard during a complex multi-day case: copying key phone numbers and suspect timelines into the permanent case file, then erasing messy brainstorm scribble to keep the board legible.',
    scenarioMapping: {
      scenarioNumber: 4,
      scenarioName: 'Multi-Agent Deep Research & Market Intelligence Pipeline',
      architectTestFocus: 'Identifying symptoms of context degradation (model forgetting early instructions or hallucinating generic patterns) and applying compaction vs subagent delegation.'
    }
  },
  16: {
    principle: 'Select the context delivery mechanism based on volatility and scope: Use @path/to/file for targeted, on-demand file inclusion; use CLAUDE.md for permanent project-wide conventions and build commands; use inline prompt text for one-off ephemeral constraints.',
    example: 'When asking Claude to refactor the payment gateway: mention @src/payments/stripe.ts in the prompt, rely on project CLAUDE.md for TypeScript strictness and test commands, and specify the new refund policy inline in the prompt.',
    analogy: 'An employee handbook (CLAUDE.md for company-wide standards), pulling a specific client contract from the filing cabinet (@ file reference), and verbal instructions given by a manager for today\'s meeting (inline prompt).',
    scenarioMapping: {
      scenarioNumber: 2,
      scenarioName: 'Enterprise Code Assistant & Autonomous DevSecOps System',
      architectTestFocus: 'Avoiding context pollution by choosing the right context channel rather than pasting entire file contents into CLAUDE.md or prompt headers.'
    }
  },
  17: {
    principle: 'The Anthropic Messages API is completely stateless; it stores zero session memory between HTTP calls. The client application must store, maintain, and pass the exact conversation array (role: "user" and role: "assistant"), preserving structured entities and tool pairs while trimming stale turns.',
    example: 'A banking chat app stores chat history in Redis. On turn 8, the backend retrieves the message array, ensures every tool_use is followed by its corresponding tool_result, and sends the full payload to POST /v1/messages.',
    analogy: 'Sending letters to a pen pal with amnesia: every time you write a new letter, you must include a binder containing copies of all previous correspondence so they understand the context of your question.',
    scenarioMapping: {
      scenarioNumber: 1,
      scenarioName: 'Omnichannel Customer Support & Live Triage Agent',
      architectTestFocus: 'Maintaining strict message alternation (user / assistant), ensuring tool_result blocks match tool_use blocks, and persisting state across client disconnects.'
    }
  },
  18: {
    principle: 'Base human escalation decisions on objective, programmatic triggers: 1) Explicit customer request for a human, 2) Repeated failure or loop detection (3 identical tool errors), 3) High-value transactions exceeding policy limits, 4) Regulatory/legal keywords. Never rely on the model\'s self-assessed confidence or sentiment analysis alone.',
    example: 'A customer says "Cancel my $10,000 corporate account immediately and let me speak with your director." The orchestrator detects transaction threshold ($10k > $1k limit) and explicit human request keyword, immediately freezing tool calls and invoking human handoff.',
    analogy: 'A fire alarm system triggered by optical smoke sensors and heat detectors (objective physical triggers) rather than asking the fire if it feels dangerous (subjective model self-evaluation).',
    scenarioMapping: {
      scenarioNumber: 1,
      scenarioName: 'Omnichannel Customer Support & Live Triage Agent',
      architectTestFocus: 'Designing fail-safe human-in-the-loop escalation gates that prevent catastrophic autonomous actions on high-stakes transactions.'
    }
  },
  19: {
    principle: 'Implement tiered, calibrated routing for extraction workflows: high-confidence, low-risk documents are straight-through-processed (STP); borderline documents or high-ambiguity contract clauses are routed to specialized human review queues with pre-highlighted bounding boxes and extracted confidence scores.',
    example: 'In processing 10,000 mortgage applications, loan applications with clear W-2 forms and cross-validated income pass automatically. When tax returns show complex depreciation schedules or missing schedules, the system routes the file to a senior underwriting queue.',
    analogy: 'Automated passport e-gates at international airports: passengers with valid biometric chips scan through automatically, while flags or expired biometric data redirect the passenger to a border control officer\'s booth.',
    scenarioMapping: {
      scenarioNumber: 3,
      scenarioName: 'Financial Regulatory Compliance & Contract Audit Extractor',
      architectTestFocus: 'Setting confidence thresholds, calculating segment-level accuracy, and structuring review UI payloads to maximize human reviewer throughput.'
    }
  },
  20: {
    principle: 'Choose between synchronous /v1/messages and asynchronous /v1/messages/batches based on latency and cost SLAs: Synchronous for interactive user-facing applications requiring sub-second response; Message Batches API for bulk, non-blocking workloads (nightly document indexing, batch analysis) providing a 50% discount on all model tokens within a 24-hour turnaround window. Note: Batches API does not support interactive multi-turn tool loops.',
    example: 'A fintech company processes real-time chatbot queries synchronously via Claude 3.5 Sonnet. For analyzing 500,000 annual reports overnight, it submits batch jobs via /v1/messages/batches cutting API costs by 50% ($1.50/M input tokens vs $3.00/M).',
    analogy: 'Taking an express toll lane for an immediate commute (Synchronous API at full price) versus freight rail shipping container cargo overnight for half the shipping cost (Message Batches API).',
    scenarioMapping: {
      scenarioNumber: 6,
      scenarioName: 'High-Throughput Document Ingestion & Cost-Optimized Batch Engine',
      architectTestFocus: 'Evaluating trade-offs between real-time responsiveness and cost efficiency, and recognizing that batch processing cannot support interactive multi-turn agentic loops.'
    }
  },
  21: {
    principle: 'To guarantee valid, machine-parseable JSON adhering to a schema, use Anthropic tool calling (tools definition + tool_choice: { type: "tool", name: "my_schema" }). This forces Claude to generate the payload inside tool_use.input with 100% syntactic JSON compliance. Avoid prompt-only instructions ("Return only valid JSON") which frequently wrap output in conversational preamble or markdown backticks.',
    example: 'Extracting balance sheets: define a tool "record_balance_sheet" with properties total_assets, total_liabilities, retained_earnings, and force it via tool_choice: { type: "tool", name: "record_balance_sheet" }. Claude outputs clean JSON directly parseable by backend services.',
    analogy: 'Filling out an electronic government tax webform with input masks and numeric validations versus writing an open-ended letter to the tax inspector and hoping you included all necessary numbers.',
    scenarioMapping: {
      scenarioNumber: 3,
      scenarioName: 'Financial Regulatory Compliance & Contract Audit Extractor',
      architectTestFocus: 'Selecting tool_choice schema enforcement as the architecturally superior pattern over prompt engineering or markdown parsing for enterprise structured data extraction.'
    }
  },
  22: {
    principle: 'Never force every schema field to be mandatory (required: [...]) when analyzing heterogeneous documents. If a field might be absent in the source document, define it as optional or explicitly nullable (type: ["string", "null"]). If a mandatory field has no value in the text, the model is forced to hallucinate or fabricate data to fulfill schema validation.',
    example: 'In a medical record extractor, fields like smoker_pack_years or previous_surgeries must be nullable. If the clinical note makes no mention of smoking history, the model outputs smoker_pack_years: null without fabricating a number.',
    analogy: 'A paper application form that marks certain questions "Leave blank if not applicable" rather than penalizing applicants for not answering questions that don\'t apply to them.',
    scenarioMapping: {
      scenarioNumber: 3,
      scenarioName: 'Financial Regulatory Compliance & Contract Audit Extractor',
      architectTestFocus: 'Designing JSON schemas that provide explicit off-ramps for missing data to eliminate hallucination vectors.'
    }
  },
  23: {
    principle: 'Master the three tool_choice modes: 1) auto (model decides whether to call a tool or reply with text), 2) any (model is forced to call at least one tool, but chooses which one among available options), 3) { type: "tool", name: "..." } (model is forced to call that specific named tool).',
    example: 'In an invoice processing pipeline where input may be an invoice, credit memo, or purchase order: supply 3 extraction tools and set tool_choice: { type: "any" }. The model is forced to structure its response via a tool, but dynamically selects extract_credit_memo when processing a memo.',
    analogy: 'A diner ordering system: "auto" = customer can order food or just ask for a glass of water; "any" = customer must order an entrée from the menu; "named tool" = customer must order the Chef\'s Daily Special.',
    scenarioMapping: {
      scenarioNumber: 3,
      scenarioName: 'Financial Regulatory Compliance & Contract Audit Extractor',
      architectTestFocus: 'Choosing between auto, any, and specific named tool choices to enforce workflow gates without causing schema mismatches.'
    }
  },
  24: {
    principle: 'Maximize extraction precision with four pillars: 1) Negative few-shot examples demonstrating proper null outputs for absent fields, 2) XML boundary tagging (<source_contract>) to prevent prompt injection, 3) Explicit normalization directives (ISO 8601 dates, currency symbols), 4) Programmatic semantic cross-validation rules (e.g., verifying subtotal + tax === total).',
    example: 'Extracting derivative contracts: few-shot examples show that when "counterparty credit rating" is omitted in the prospectus, the output is credit_rating: null. A post-extraction validator verifies that start date precedes termination date.',
    analogy: 'Double-entry bookkeeping where every debit must balance a credit, paired with sample ledger sheets showing blank lines where no transaction occurred.',
    scenarioMapping: {
      scenarioNumber: 3,
      scenarioName: 'Financial Regulatory Compliance & Contract Audit Extractor',
      architectTestFocus: 'Combining prompt engineering patterns (negative few-shot, XML delimiters) with deterministic post-validation to achieve zero-hallucination compliance.'
    }
  },
  25: {
    principle: 'Implement programmatic retry loops with targeted error feedback: when a schema validation or business rule fails, feed the specific error back to Claude (e.g., "Field \'effective_date\' must be in YYYY-MM-DD format, received \'October 3rd\'") for surgical self-correction. Crucial safeguard: never retry if the required data is genuinely absent in the source text.',
    example: 'A code analysis pipeline generates TypeScript interfaces. A validator compiles the snippet. If compilation fails, the compiler error message is sent back to Claude with the original prompt, enabling Claude to resolve the missing import in Turn 2.',
    analogy: 'A flight simulator instructor who pauses the simulation when a pilot enters an improper glide slope, highlights the altitude gauge error, and lets the pilot correct control surfaces immediately.',
    scenarioMapping: {
      scenarioNumber: 4,
      scenarioName: 'Multi-Agent Deep Research & Market Intelligence Pipeline',
      architectTestFocus: 'Designing automated retry circuits that include exact validation diffs while avoiding infinite retry loops on nonexistent data.'
    }
  },
  26: {
    principle: 'MCP tools must return structured, machine-actionable errors, not opaque strings like "Server Error". Include: error category (transient, validation, permission, business_rule), retryable: boolean, and recovery suggestions. Crucial exam distinction: MCP JSON-RPC returns isError: true (camelCase), while the Anthropic Messages API uses tool_result.is_error: true (snake_case). Valid empty queries (0 search results) must return a valid empty list, NOT an error flag.',
    example: 'An MCP database tool experiences a read timeout. It returns { isError: true, content: [{ type: "text", text: "Query timeout after 5000ms" }], error_category: "transient", retryable: true, retry_after_ms: 1000 }. The agent knows to back off and retry.',
    analogy: 'An HTTP status code system (404 Not Found vs 503 Service Unavailable vs 401 Unauthorized) telling a client exactly whether to retry, re-authenticate, or halt.',
    scenarioMapping: {
      scenarioNumber: 5,
      scenarioName: 'Multi-Tool Enterprise Knowledge Retrieval (RAG & Distributed Systems)',
      architectTestFocus: 'Protocol casing differences (isError in MCP vs is_error in API), distinguishing retryable network hiccups from permanent auth failures, and treating zero search results as valid empty data.'
    }
  },
  27: {
    principle: 'The tool description is the model\'s primary routing mechanism. Detailed descriptions must specify: 1) Exact functional purpose, 2) Return payload format, 3) Positive triggers (when to use), 4) Explicit negative boundaries (when NOT to use), 5) Parameter edge cases. Keep active tool count per agent between 3 and 5 to prevent selection confusion.',
    example: 'Instead of "search_users: finds users", write "search_users_by_email: Performs exact case-insensitive lookup of user profiles by corporate email address. Returns JSON with user_id and permissions. DO NOT use for name searches or fuzzy keyword queries; use search_users_fuzzy instead."',
    analogy: 'Clear labels on specialized medical instruments in an operating room tray so a surgeon can grab the exact micro-scalpel rather than a general incision knife.',
    scenarioMapping: {
      scenarioNumber: 5,
      scenarioName: 'Multi-Tool Enterprise Knowledge Retrieval (RAG & Distributed Systems)',
      architectTestFocus: 'Resolving tool misrouting and hallucinated tool calls by refining tool descriptions and negative bounds rather than building complex classifier routers.'
    }
  },
  28: {
    principle: 'Understand the Model Context Protocol architecture: 1) Transports: stdio for local sub-processes (default for Claude Code) vs SSE (Server-Sent Events) for remote network services; 2) MCP Primitives: Tools (model-controlled executable actions), Resources (host-controlled readable data streams like file logs or DB rows), Prompts (user-controlled prompt templates). Tools from configured servers are registered at connection time.',
    example: 'Claude Code configures a local Git MCP server via stdio transport using command: "mcp-server-git". At startup, Claude Code registers git commit, diff, and branch tools.',
    analogy: 'Connecting a laptop to an external docking station: one cable provides USB peripherals (Tools), monitor video feeds (Resources), and dock hotkey presets (Prompts).',
    scenarioMapping: {
      scenarioNumber: 5,
      scenarioName: 'Multi-Tool Enterprise Knowledge Retrieval (RAG & Distributed Systems)',
      architectTestFocus: 'Transport selection (stdio vs SSE), lifecycle registration of tools at connection startup, and mapping the 3 MCP primitives to their respective controllers (Model = Tools, Host = Resources, User = Prompts).'
    }
  },
  29: {
    principle: 'Orchestrate multi-step pipelines by dynamically adjusting tool_choice across conversation turns. Turn 1: Force a mandatory data collection tool using tool_choice: { type: "tool", name: "fetch_customer_record" }. Turn 2: Receive the customer data in tool_result, then transition to tool_choice: "auto" so Claude can intelligently decide whether to call apply_credit, send_email, or answer with text.',
    example: 'Automated claims processing: Turn 1 forces validate_policy_number. Once policy validity is confirmed in Turn 1\'s tool_result, Turn 2 switches to auto allowing Claude to evaluate claim severity and select between approve_under_500 or flag_for_fraud_investigation.',
    analogy: 'An assembly line inspection: the car must stop at the laser alignment station (forced tool choice). Once measurements pass, the technician has the autonomy to choose either paint touchup or clearcoat polish (auto).',
    scenarioMapping: {
      scenarioNumber: 4,
      scenarioName: 'Multi-Agent Deep Research & Market Intelligence Pipeline',
      architectTestFocus: 'Dynamic turn-by-turn tool_choice mutation to enforce deterministic sequence prerequisites while preserving downstream model reasoning flexibility.'
    }
  }
};
