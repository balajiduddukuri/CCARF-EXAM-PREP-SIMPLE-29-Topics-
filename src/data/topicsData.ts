import { TopicData } from '../types';
import { TOPIC_STUDY_FOCUS_MAP } from './topicStudyFocusData';

const RAW_TOPICS_DATA: TopicData[] = [
  {
    id: 1,
    domainId: 'D1',
    taskRef: 'Task 1.1',
    title: 'Orchestration-Layer Safeguards for Agent Session Completion',
    studyFocus: 'Use structured API signals—not natural-language text—to control an agentic loop. stop_reason is the primary completion mechanism; iteration limits are secondary safeguards.',
    keys: ['stop_reason', 'end_turn', 'tool_use', 'max_tokens', 'iteration cap'],
    isGap: false,
    deepDive: {
      coreConcept: 'The agentic loop must use stop_reason to determine when to continue or terminate — NOT natural language parsing.',
      keyMechanism: 'stop_reason: "tool_use" → execute tools, continue loop · stop_reason: "end_turn" → model is finished, terminate.',
      safeguardsOrGuidelines: 'Check stop_reason on every iteration · Handle "max_tokens" gracefully (response truncated and incomplete).',
      antiPatterns: [
        'Parsing assistant text for phrases like "I am done" or "Here is your answer"',
        'Arbitrary iteration caps as the primary termination mechanism',
        'Checking for text content as a completion signal (text can co-exist alongside tool_use blocks)'
      ],
      examTrigger: '"How does the agentic loop know when to stop?" → Check stop_reason for "end_turn".'
    },
    qa: [
      { id: '1-1', question: 'What is the primary signal for ending an agent loop?', answer: 'Check stop_reason for end_turn.', trap: 'Do not parse text such as "I am done"; text is not a reliable completion signal.' },
      { id: '1-2', question: 'What does stop_reason: tool_use require?', answer: 'Execute the requested tools, return tool_result, and continue the loop.', trap: 'Text may appear with tool_use. Do not terminate just because a text block is present.' },
      { id: '1-3', question: 'What does stop_reason: max_tokens mean?', answer: 'The response was truncated and requires graceful handling.', trap: 'Do not treat max_tokens as a normal completed end_turn.' },
      { id: '1-4', question: 'Should an iteration cap be the main stop mechanism?', answer: 'No. It is a secondary safety net; stop_reason drives normal termination.', trap: 'Removing every cap is also unsafe; it can remain a fallback safeguard.' },
      { id: '1-5', question: 'If text says "I need one more check" but stop_reason is end_turn, what wins?', answer: 'end_turn wins; terminate the loop.', trap: 'Natural-language text must not override the structured API signal.' }
    ]
  },
  {
    id: 2,
    domainId: 'D1',
    taskRef: 'Task 1.4',
    title: 'Structured Handoff Packages for Agent-to-Agent and Agent-to-Human Transfers',
    studyFocus: 'Handoffs must explicitly package the information a receiving agent or human needs. Recipients do not automatically inherit conversation context.',
    keys: ['customer ID', 'root cause', 'actions taken', 'recommended next action', 'isolated context'],
    isGap: false,
    deepDive: {
      coreConcept: 'When transferring control (agent→agent or agent→human), context must be explicitly packaged in a structured format because subagents and humans do not inherit prior conversation history.',
      keyMechanism: 'Structured JSON or labeled fields containing: customer ID, root cause analysis, actions already taken, refund/transaction status, and recommended next steps.',
      safeguardsOrGuidelines: 'Upstream agents must distill multi-turn context into goal-oriented context (key facts, citations, relevance scores) rather than dumping full reasoning chains or raw source texts.',
      antiPatterns: [
        'Free-form natural language summaries that omit key identifiers, amounts, or status',
        'Assuming subagents or human operators inherit the coordinator’s conversation history',
        'Passing 15+ turns of full transcript to a human or context-constrained subagent'
      ],
      examTrigger: '"Human agent receives case but lacks context" → Structured handoff summary was missing/incomplete.'
    },
    qa: [
      { id: '2-1', question: 'What should a support-to-human handoff contain?', answer: 'Customer ID, root cause, actions taken, current status, and recommended next action.', trap: 'A vague statement such as "customer has an issue" is not actionable.' },
      { id: '2-2', question: 'Do subagents automatically inherit the coordinator’s conversation?', answer: 'No. Context must be explicitly passed.', trap: 'Assuming inherited history is a frequent multi-agent design failure.' },
      { id: '2-3', question: 'What form should handoff data take?', answer: 'Structured, labeled fields or objects.', trap: 'A full transcript is often too verbose and difficult to act on.' },
      { id: '2-4', question: 'What should upstream research agents return to a context-limited synthesizer?', answer: 'Key facts, citations, and relevance scores in structured form.', trap: 'Do not pass verbose reasoning chains and raw source text unnecessarily.' },
      { id: '2-5', question: 'Why is a structured handoff better than a free-form paragraph?', answer: 'It preserves required facts reliably and supports quick downstream action.', trap: 'Free-form summaries can omit IDs, status, actions, or recommendations.' }
    ]
  },
  {
    id: 3,
    domainId: 'D1',
    taskRef: 'Task 1.7',
    title: 'Session Resumption Techniques',
    studyFocus: 'Resume valid context, start fresh when previous findings are stale, and use separate branches when comparing alternative approaches.',
    keys: ['--resume', 'fresh session', 'structured summary', 'stale tool results', 'fork_session'],
    isGap: false,
    deepDive: {
      coreConcept: 'Managing state across work sessions: resuming (--resume), branching (fork_session), or starting fresh with an injected summary when files have changed.',
      keyMechanism: 'Prior context valid? → --resume. Files changed significantly? → Fresh session + injected summary. Comparing refactor options? → fork_session.',
      safeguardsOrGuidelines: 'On resume after code changes, inform the agent about specific file changes for targeted re-analysis rather than full re-exploration.',
      antiPatterns: [
        'Blindly resuming with --resume when critical files changed (relies on stale tool results)',
        'Using a single shared session when comparing alternative architectural options (biases findings)',
        'Injecting entire old conversation transcripts or full file contents into fresh sessions'
      ],
      examTrigger: '"Code changed since last session, tool results stale" → Start new session with structured summary.'
    },
    qa: [
      { id: '3-1', question: 'When should you use --resume?', answer: 'When the prior session context and codebase state remain valid.', trap: 'Do not resume blindly if important files changed.' },
      { id: '3-2', question: 'What is best when files changed substantially since a prior session?', answer: 'Start a fresh session with a structured summary and identify files needing re-analysis.', trap: 'A resumed session can rely on stale tool results.' },
      { id: '3-3', question: 'When is fork_session useful?', answer: 'When independently exploring alternative approaches from a shared baseline.', trap: 'Do not use one shared conversation if findings from one option may bias another.' },
      { id: '3-4', question: 'What belongs in a resume summary?', answer: 'Key findings, changed files, and focused re-analysis needs.', trap: 'Do not inject an entire old transcript or all file contents.' },
      { id: '3-5', question: 'What indicates context degradation in a resumed long session?', answer: 'The model cites "typical patterns" instead of earlier specific names and facts.', trap: 'A larger context window alone does not solve attention degradation.' }
    ]
  },
  {
    id: 4,
    domainId: 'D1',
    taskRef: 'Task 1.6',
    title: 'Dynamic Subtask Decomposition in Agentic Workflows',
    studyFocus: 'Use the simplest architecture that fits: chaining for predictable steps, dynamic decomposition for open-ended work, and hybrid planning plus execution for complex migrations.',
    keys: ['prompt chaining', 'routing', 'parallelization', 'orchestrator-workers', 'hybrid'],
    isGap: false,
    deepDive: {
      coreConcept: 'Choosing between fixed sequential pipelines (prompt chaining) vs. adaptive decomposition based on discovered findings.',
      keyMechanism: 'Predictable workflows (PR review checklist, ETL) → Prompt chaining. Open-ended discovery → Dynamic adaptive coordinator. Large library migration (45+ files) → Hybrid (dynamic planning then chained execution).',
      safeguardsOrGuidelines: 'For large multi-file PR reviews (14+ files), split into per-file local analysis passes followed by a separate cross-file integration pass to prevent attention dilution.',
      antiPatterns: [
        'Using complex multi-agent architectures when fixed sequential prompt chaining is sufficient',
        'Single-pass review across 14+ files simultaneously (causes inconsistent depth and contradictory feedback)',
        'Overly narrow decomposition by the coordinator, causing incomplete scope coverage'
      ],
      examTrigger: '"Report covers visual arts but misses music, writing, film" → Coordinator\'s decomposition was too narrow.'
    },
    qa: [
      { id: '4-1', question: 'What pattern fits a predictable extract → validate → transform workflow?', answer: 'Prompt chaining.', trap: 'Do not choose a multi-agent architecture when fixed sequential steps are sufficient.' },
      { id: '4-2', question: 'What does dynamic decomposition mean?', answer: 'The coordinator generates or changes subtasks based on intermediate findings.', trap: 'It is not defined simply by task size; predictability matters.' },
      { id: '4-3', question: 'What does missing report coverage usually indicate?', answer: 'The coordinator’s decomposition was too narrow.', trap: 'Do not automatically blame a subagent that was never assigned the missing area.' },
      { id: '4-4', question: 'What approach fits a large library migration?', answer: 'Hybrid: dynamic planning, followed by chained execution.', trap: 'Pure parallel processing can miss dependencies and shared migration decisions.' },
      { id: '4-5', question: 'How should a large PR be reviewed consistently?', answer: 'Per-file focused analysis plus a separate cross-file integration pass.', trap: 'A larger context window does not fix attention dilution.' }
    ]
  },
  {
    id: 5,
    domainId: 'D1',
    taskRef: 'Task 1.5',
    title: 'PreToolUse and PostToolUse Hook Patterns',
    studyFocus: 'Use hooks for deterministic enforcement. Intercept outgoing calls before execution and results after execution to enforce policies, prerequisites, normalization, and output trimming.',
    keys: ['PreToolUse', 'PostToolUse', 'deterministic', 'outgoing call', 'tool result'],
    isGap: true,
    gapDetails: {
      originalIssue: 'Exam guides distinguish PreToolUse (outgoing call interception before execution) from PostToolUse (result interception after execution), but teams often rely on prompt instructions alone.',
      gapResolved: 'Clarified that PreToolUse intercepts outgoing calls to block policy violations (e.g., refund > $500) or enforce prerequisites (e.g., must call verify_identity first). PostToolUse normalizes heterogeneous formats and trims verbose fields.',
      actionableTakeaway: 'When an agent skips a critical step X% of the time, prompt engineering is never the answer — implement a programmatic PreToolUse hook.'
    },
    deepDive: {
      coreConcept: 'Agent SDK hooks intercept tool calls at two distinct interception points: before execution (PreToolUse) and after execution (PostToolUse).',
      keyMechanism: 'PreToolUse: blocks forbidden actions, checks prerequisites, validates parameters. PostToolUse: normalizes data (timestamps → ISO 8601), trims 40 fields to 5, annotates findings.',
      safeguardsOrGuidelines: 'Hooks provide deterministic (100%) guarantees. Prompts provide probabilistic (non-zero failure rate) guidance. Never put financial, security, or compliance constraints in prompts alone.',
      antiPatterns: [
        'Adding more prompt emphasis ("IMPORTANT: MUST DO X") to fix an 8% policy violation rate',
        'Using PostToolUse to try to block an action that already executed',
        'Writing code hooks for cosmetic preferences (indentation, camelCase) instead of CLAUDE.md'
      ],
      examTrigger: '"Agent skips verification step 12% of the time" → Implement programmatic hook/prerequisite, NOT better prompting.'
    },
    qa: [
      { id: '5-1', question: 'What does a PreToolUse-style interception control?', answer: 'Outgoing tool calls before execution.', trap: 'It runs after the model requests a tool, not before model generation.' },
      { id: '5-2', question: 'What does PostToolUse control?', answer: 'Tool results after execution and before model processing.', trap: 'It cannot prevent a tool call that already executed.' },
      { id: '5-3', question: 'How should refunds over an approval threshold be enforced?', answer: 'Use a programmatic pre-call gate or hook.', trap: 'Prompt wording may reduce errors but cannot guarantee compliance.' },
      { id: '5-4', question: 'How should inconsistent dates returned by tools be handled?', answer: 'Normalize them in a PostToolUse hook before the model sees them.', trap: 'Adding a prompt instruction is probabilistic.' },
      { id: '5-5', question: 'When is CLAUDE.md preferable to a hook?', answer: 'For non-critical preferences such as style or conventions.', trap: 'Do not put compliance, security, or financial controls only in instructions.' }
    ]
  },
  {
    id: 6,
    domainId: 'D1',
    taskRef: 'Task 1.1',
    title: 'The Agentic Loop: Model Responses and stop_reason Signals',
    studyFocus: 'The loop is: send messages and tools, inspect stop_reason, execute requested tools, return tool_result blocks, then repeat until completion.',
    keys: ['tool_result', 'role: user', 'tool_use_id', 'end_turn', 'agentic loop'],
    isGap: false,
    deepDive: {
      coreConcept: 'The agentic loop is governed by inspecting stop_reason on each Claude response: tool_use vs. end_turn vs. max_tokens.',
      keyMechanism: 'Tool results are returned in a tool_result content block within a role: "user" message, referencing the matching tool_use_id.',
      safeguardsOrGuidelines: 'Stop_reason is authoritative. Text content and tool_use blocks frequently coexist. Never terminate on arbitrary text.',
      antiPatterns: [
        'Inventing a fictional role: "tool" message in the Messages API flow (it is always role: "user")',
        'Omitting the tool_use_id from tool_result content blocks',
        'Assuming text block means the model finished even when stop_reason is "tool_use"'
      ],
      examTrigger: '"Loop doesn\'t stop" or "Loop terminates prematurely" → Inspect stop_reason handling.'
    },
    qa: [
      { id: '6-1', question: 'Where is a tool result returned in the Messages API flow?', answer: 'In a tool_result content block inside a role: user message.', trap: 'Do not invent a separate role: tool for this flow.' },
      { id: '6-2', question: 'What does a tool_result reference?', answer: 'The matching tool_use_id from the model request.', trap: 'Without the ID, the result cannot reliably be associated with the request.' },
      { id: '6-3', question: 'What happens after a tool result is returned?', answer: 'Claude processes it and either requests more tools or completes with end_turn.', trap: 'The workflow is iterative, not a one-time batch of all possible calls.' },
      { id: '6-4', question: 'Can text and tool_use blocks coexist?', answer: 'Yes; stop_reason remains the authoritative signal.', trap: 'Do not assume a text block means the model is finished.' },
      { id: '6-5', question: 'What should end_turn cause?', answer: 'Terminate the normal agentic loop and provide the final response.', trap: 'Do not rely on arbitrary wording in the generated text.' }
    ]
  },
  {
    id: 7,
    domainId: 'D3',
    taskRef: 'Task 3.2',
    title: 'Custom Slash Commands in Claude Code',
    studyFocus: 'Commands provide reusable on-demand workflows. Project commands are shared through version control; user commands are personal.',
    keys: ['.claude/commands', '~/.claude/commands', 'SKILL.md', 'allowed-tools', 'context: fork'],
    isGap: false,
    deepDive: {
      coreConcept: 'Slash commands provide reusable on-demand templates invoked via /command-name. Scoping determines team sharing vs personal use.',
      keyMechanism: 'Project commands: .claude/commands/*.md (committed to VCS). User commands: ~/.claude/commands/*.md (personal only). Skills: .claude/skills/*/SKILL.md with frontmatter.',
      safeguardsOrGuidelines: 'Use context: fork in skill frontmatter to isolate exploratory skill output from the main conversation context. Use allowed-tools to restrict tool availability.',
      antiPatterns: [
        'Putting team-shared commands in ~/.claude/commands/ (teammates will not have them)',
        'Confusing context: fork with a Git branch (it is conversation context isolation)',
        'Putting manually invoked workflows into always-loaded CLAUDE.md'
      ],
      examTrigger: '"Team needs shared /review command" → .claude/commands/ in project repo (NOT ~/.claude/commands/).'
    },
    qa: [
      { id: '7-1', question: 'Where should a shared team slash command be stored?', answer: 'In .claude/commands/ within the project.', trap: 'Do not put shared team workflows in a user home directory.' },
      { id: '7-2', question: 'Where should a personal command be stored?', answer: 'In ~/.claude/commands/.', trap: 'Project command directories are shared through version control.' },
      { id: '7-3', question: 'What does context: fork do for a skill?', answer: 'It isolates the skill’s output from the main conversation context.', trap: 'It does not create a Git branch.' },
      { id: '7-4', question: 'What does allowed-tools do?', answer: 'Restricts the tools available while the command or skill runs.', trap: 'It does not automatically invoke those tools.' },
      { id: '7-5', question: 'Commands versus skills: what is the key difference?', answer: 'Skills support richer SKILL.md frontmatter and task-specific configuration.', trap: 'Both may be project or user scoped; scope is not the main distinction.' }
    ]
  },
  {
    id: 8,
    domainId: 'D3',
    taskRef: 'Task 3.5',
    title: 'Structuring Iterative Refinement Workflows',
    studyFocus: 'Improve output through concrete examples, test-driven iteration, targeted feedback, and clarifying questions before implementation.',
    keys: ['few-shot examples', 'test-driven', 'interview pattern', 'independent issues', 'interacting issues'],
    isGap: false,
    deepDive: {
      coreConcept: 'Progressive refinement via structured feedback loops: concrete examples for formatting, test-driven iteration for specifications, and the interview pattern for requirements discovery.',
      keyMechanism: 'Provide 2-3 input/output examples for inconsistent output. Write tests first, share failures. Send independent bug fixes sequentially; bundle interacting fixes in a single message.',
      safeguardsOrGuidelines: 'The interview pattern prompts Claude to ask clarifying questions before implementation, surfacing edge cases (cache invalidation, failure modes, race conditions) upfront.',
      antiPatterns: [
        'Adding more words like "be careful" or "handle all edge cases" instead of showing concrete examples',
        'Bundling independent unrelated bug fixes into one message',
        'Writing tests after implementation rather than test-first iteration'
      ],
      examTrigger: '"Inconsistent output from vague prose instructions" → Provide concrete input/output examples.'
    },
    qa: [
      { id: '8-1', question: 'What fixes inconsistent output from vague prose instructions?', answer: 'Provide concrete input/output examples.', trap: 'Repeating "be careful" does not clarify expected behavior.' },
      { id: '8-2', question: 'What is test-driven iteration?', answer: 'Write tests first, share failures, and iterate until tests pass.', trap: 'Writing tests only after implementation is not the same workflow.' },
      { id: '8-3', question: 'What is the interview pattern?', answer: 'Claude asks clarifying questions before implementation.', trap: 'It is used for requirement discovery, not merely unfamiliar languages.' },
      { id: '8-4', question: 'How should independent bugs be refined?', answer: 'Address them sequentially so each receives focused attention.', trap: 'Bundle interacting issues together only when fixes affect one another.' },
      { id: '8-5', question: 'What should examples demonstrate for edge cases?', answer: 'Specific input, expected output, and handling for missing or ambiguous values.', trap: 'A vague request to "handle all edge cases" is insufficient.' }
    ]
  },
  {
    id: 9,
    domainId: 'D3',
    taskRef: 'Task 3.4',
    title: 'Plan Mode vs. Direct Execution',
    studyFocus: 'Plan mode is for discovery and architectural decisions; direct execution is for well-scoped changes with an obvious implementation path.',
    keys: ['plan mode', 'direct execution', 'Explore subagent', 'architecture', 'well-scoped fix'],
    isGap: false,
    deepDive: {
      coreConcept: 'Choosing between Plan Mode (discovery, exploration, trade-off evaluation) and Direct Execution (simple, well-scoped fixes).',
      keyMechanism: 'Plan Mode: monolith-to-microservices, library migrations (45+ files), ambiguous requirements. Direct Execution: single-function bug fix, clear stack trace.',
      safeguardsOrGuidelines: 'Use Explore subagent for verbose discovery to isolate reading/tracing and return summaries to preserve main conversation context.',
      antiPatterns: [
        'Entering plan mode for a trivial one-function null pointer bug fix',
        'Jumping straight to direct execution when service boundaries and architecture are undecided',
        'Choosing mode based solely on file count rather than architectural impact and ambiguity'
      ],
      examTrigger: '"Restructure monolith to microservices" → Plan mode · "Fix null pointer in one function" → Direct execution.'
    },
    qa: [
      { id: '9-1', question: 'What mode fits monolith-to-microservices restructuring?', answer: 'Plan mode.', trap: 'Do not code immediately when service boundaries and migration decisions are unresolved.' },
      { id: '9-2', question: 'What mode fits a clear one-function null-pointer fix?', answer: 'Direct execution.', trap: 'Plan mode adds unnecessary overhead to a well-scoped task.' },
      { id: '9-3', question: 'When is an Explore subagent useful?', answer: 'For verbose discovery that should not pollute the main context.', trap: 'It is not primarily a code-generation or deployment mechanism.' },
      { id: '9-4', question: 'What hybrid workflow is recommended for complex work?', answer: 'Plan for discovery and design, then execute directly when the approach is clear.', trap: 'Keeping plan mode for every trivial implementation step can be inefficient.' },
      { id: '9-5', question: 'What decides between plan mode and direct execution?', answer: 'Task ambiguity, architectural impact, and number of valid approaches.', trap: 'Do not choose solely based on the number of files.' }
    ]
  },
  {
    id: 10,
    domainId: 'D3',
    taskRef: 'Task 1.5, 3.1',
    title: 'Settings, Permissions, Hooks vs. CLAUDE.md Instructions',
    studyFocus: 'Choose the mechanism based on guarantee level. Settings, permissions, and hooks enforce deterministically; CLAUDE.md guides behavior probabilistically.',
    keys: ['permissions', 'hooks', 'CLAUDE.md', 'deterministic', 'probabilistic'],
    isGap: true,
    gapDetails: {
      originalIssue: 'Candidates confuse which mechanism to select for rules: system settings vs permissions vs SDK hooks vs CLAUDE.md files.',
      gapResolved: 'Mapped explicit guarantee levels: Settings/Permissions & Hooks = Deterministic (100% code-level guarantee). CLAUDE.md = Probabilistic (natural language context guidance).',
      actionableTakeaway: 'If the rule MUST NEVER fail (PII masking, financial thresholds, DB limits), use settings/permissions/hooks. If it is a preferred coding style or convention, use CLAUDE.md.'
    },
    deepDive: {
      coreConcept: 'Different configuration mechanisms provide fundamentally different guarantee levels: Deterministic vs. Probabilistic.',
      keyMechanism: 'Settings/Permissions/Hooks = 100% deterministic code/system enforcement. CLAUDE.md = Probabilistic natural language guidance with non-zero failure rate.',
      safeguardsOrGuidelines: 'Financial limits, PII masking, identity verification gates, file deletion blocks → Hooks & permissions. Preferred indentation, async/await style, library choices → CLAUDE.md.',
      antiPatterns: [
        'Relying on CLAUDE.md for financial rules (e.g., "never refund over $500 without approval")',
        'Creating heavy programmatic hooks for minor cosmetic preferences (e.g., 2-space indentation)',
        'Thinking that adding more exclamation marks to prompt instructions makes them deterministic'
      ],
      examTrigger: '"Agent must ALWAYS verify identity before refund" → Hook/programmatic gate · "Prefer async/await style" → CLAUDE.md.'
    },
    qa: [
      { id: '10-1', question: 'What should enforce a must-never-fail compliance rule?', answer: 'Settings, permissions, or programmatic hooks.', trap: 'CLAUDE.md guidance alone can be skipped.' },
      { id: '10-2', question: 'What belongs in CLAUDE.md?', answer: 'Team standards, conventions, style preferences, and project context.', trap: 'Do not rely on it as the only control for financial or security constraints.' },
      { id: '10-3', question: 'What is the guarantee difference?', answer: 'Hooks/settings are deterministic; natural-language instructions are probabilistic.', trap: 'More emphatic instructions do not become deterministic.' },
      { id: '10-4', question: 'How should PII masking in logs be handled?', answer: 'Use deterministic enforcement such as hooks or code-level controls.', trap: 'A style instruction is insufficient for a privacy control.' },
      { id: '10-5', question: 'How should a preferred indentation style be handled?', answer: 'Use CLAUDE.md instructions.', trap: 'A hook for every cosmetic preference creates unnecessary complexity.' }
    ]
  },
  {
    id: 11,
    domainId: 'D3',
    taskRef: 'Tasks 3.1–3.3',
    title: 'Selecting the Correct Claude Code Configuration Mechanism',
    studyFocus: 'Scope configuration to the audience and file relevance: user preferences, project standards, directory context, path rules, commands, skills, and MCP configuration each serve distinct roles.',
    keys: ['project CLAUDE.md', 'user CLAUDE.md', 'directory CLAUDE.md', '.claude/rules', 'glob paths'],
    isGap: true,
    gapDetails: {
      originalIssue: 'Exam questions present scenarios requiring selection between project CLAUDE.md, subdirectory CLAUDE.md, .claude/rules glob patterns, commands, and skills.',
      gapResolved: 'Built the complete decision matrix covering scope (user vs project), applicability (universal vs path-scoped vs directory), and invocation (always-loaded vs on-demand).',
      actionableTakeaway: 'For file patterns across the entire codebase (*.test.tsx), use .claude/rules/*.md with glob paths. For isolated folders in a monorepo, use subdirectory CLAUDE.md.'
    },
    deepDive: {
      coreConcept: 'Claude Code provides a granular configuration hierarchy tailored to audience, directory depth, file patterns, and invocation style.',
      keyMechanism: 'Team standards → Project .claude/CLAUDE.md. Personal preferences → ~/.claude/CLAUDE.md. File pattern across repo → .claude/rules/*.md with glob paths. Directory tree → Subdirectory CLAUDE.md.',
      safeguardsOrGuidelines: 'Shared MCP integrations → .mcp.json with ${ENV_VAR}. Personal experiments → ~/.claude.json. On-demand workflows → .claude/commands/ or skills.',
      antiPatterns: [
        'Putting test conventions in a single subdirectory CLAUDE.md when tests exist throughout the repo',
        'Committing personal preferences into the shared team CLAUDE.md file',
        'Loading on-demand workflows into always-loaded CLAUDE.md files'
      ],
      examTrigger: '"Test conventions for *.test.tsx files across entire codebase" → .claude/rules/ with glob patterns (NOT subdirectory CLAUDE.md).'
    },
    qa: [
      { id: '11-1', question: 'Where do shared team standards belong?', answer: 'Project-level CLAUDE.md or .claude/CLAUDE.md committed to version control.', trap: 'User-level memory does not reach new teammates.' },
      { id: '11-2', question: 'Where do personal preferences belong?', answer: '~/.claude/CLAUDE.md.', trap: 'Do not place personal preferences in shared project configuration.' },
      { id: '11-3', question: 'What fits rules for *.test.tsx across many directories?', answer: '.claude/rules with a paths glob pattern.', trap: 'A directory CLAUDE.md cannot cover matching files across unrelated directories.' },
      { id: '11-4', question: 'What fits conventions unique to frontend/ versus backend/?', answer: 'Directory-level CLAUDE.md files for each area.', trap: 'Putting both sets in the project root can create irrelevant context.' },
      { id: '11-5', question: 'What fits a reusable on-demand team workflow?', answer: 'A project custom command or skill.', trap: 'Do not put a manually invoked workflow in always-loaded CLAUDE.md.' }
    ]
  },
  {
    id: 12,
    domainId: 'D1',
    taskRef: 'Task 1.5',
    title: 'PostToolUse Hooks for Automated Code Quality Enforcement',
    studyFocus: 'PostToolUse hooks can normalize, trim, annotate, or validate returned tool results before those results accumulate in model context.',
    keys: ['normalization', 'trimming', 'annotation', 'context budget', 'tool result'],
    isGap: false,
    deepDive: {
      coreConcept: 'PostToolUse hooks intercept tool results after execution to automate normalization, trimming, and annotation before context accumulation.',
      keyMechanism: 'Convert heterogeneous timestamps to ISO 8601; trim 40 returned database fields to the 5 needed fields; annotate findings (e.g., mark logging as acceptable in test files).',
      safeguardsOrGuidelines: 'Trimming verbose output at the source preserves context budget and prevents model attention degradation.',
      antiPatterns: [
        'Prompting the model to "ignore fields you don\'t need" (the tokens still consume context budget)',
        'Silently suppressing all findings in hooks rather than annotating context for the model',
        'Allowing heterogeneous MCP servers to pass raw divergent date formats directly into the model'
      ],
      examTrigger: '"MCP tools return different date formats, causing agent confusion" → PostToolUse hook to normalize.'
    },
    qa: [
      { id: '12-1', question: 'How can a 40-field tool result be made context-efficient?', answer: 'Trim it to the fields relevant to the task in a PostToolUse hook.', trap: 'Prompting the model to ignore fields does not prevent those fields from using tokens.' },
      { id: '12-2', question: 'How should multiple timestamp formats be standardized?', answer: 'Normalize all results to one format before model processing.', trap: 'Do not require the model to repeatedly reason over inconsistent formats.' },
      { id: '12-3', question: 'What can a PostToolUse hook add to a review finding?', answer: 'Useful context or annotations, such as the fact that a finding is in a test file.', trap: 'Do not silently suppress every similar finding without context.' },
      { id: '12-4', question: 'Why use a hook instead of only CLAUDE.md?', answer: 'A hook applies deterministic result processing.', trap: 'Instructions cannot guarantee every result will be normalized.' },
      { id: '12-5', question: 'When does PostToolUse run?', answer: 'After tool execution and before the model consumes the result.', trap: 'It cannot block a risky action before the action occurs.' }
    ]
  },
  {
    id: 13,
    domainId: 'D2',
    taskRef: 'Task 2.5',
    title: 'Systematic Codebase Exploration with Grep, Glob, and Read',
    studyFocus: 'Use Glob for file paths, Grep for content search, and Read for focused inspection. Explore incrementally instead of reading an entire repository.',
    keys: ['Glob', 'Grep', 'Read', 'Edit', 'path search'],
    isGap: false,
    deepDive: {
      coreConcept: 'Each built-in tool serves a distinct role in systematic codebase exploration: Glob = paths/names, Grep = file contents, Read = full file inspection, Edit = unique string replacement.',
      keyMechanism: 'Exploration workflow: 1. Glob to find relevant file paths → 2. Grep for entry points/patterns/callers → 3. Read specific files.',
      safeguardsOrGuidelines: 'When the Edit tool fails because the target string is not unique across the file, fall back to Read + Write.',
      antiPatterns: [
        'Using Grep to find filenames (Grep searches inside file contents)',
        'Using Glob to find function calls or variable definitions (Glob only matches paths)',
        'Reading all repository files upfront into context (wastes budget and causes attention dilution)'
      ],
      examTrigger: '"Find all usages of deprecated_function" → Grep · "Find all *.test.tsx files" → Glob.'
    },
    qa: [
      { id: '13-1', question: 'Which tool finds all *.test.ts files?', answer: 'Glob, using a file-path pattern.', trap: 'Grep searches inside files, not filenames.' },
      { id: '13-2', question: 'Which tool finds every use of deprecated_function?', answer: 'Grep, because it searches file contents.', trap: 'Glob cannot determine whether a function name appears inside a file.' },
      { id: '13-3', question: 'What is an efficient exploration sequence?', answer: 'Glob relevant files → Grep patterns/entry points → Read selected files.', trap: 'Reading every file first wastes context.' },
      { id: '13-4', question: 'Why can Edit fail on a change request?', answer: 'The target text is not unique; use Read plus Write when needed.', trap: 'The failure is not necessarily due to file type or file size.' },
      { id: '13-5', question: 'What tool should find middleware registration code?', answer: 'Grep for content patterns such as registration calls.', trap: 'A broad filename search for "auth" can return many irrelevant files.' }
    ]
  },
  {
    id: 14,
    domainId: 'D2',
    taskRef: 'Task 2.4',
    title: 'Configuring MCP Servers at the Correct Scope',
    studyFocus: 'Project MCP configuration is shared with the team; user MCP configuration is personal. Use environment-variable expansion rather than committing secrets.',
    keys: ['.mcp.json', '~/.claude.json', '${ENV_VAR}', 'project scope', 'user scope'],
    isGap: false,
    deepDive: {
      coreConcept: 'MCP server scoping dictates whether server tools and resources are shared with the engineering team (.mcp.json) or kept personal (~/.claude.json).',
      keyMechanism: 'Project scope: .mcp.json in root, committed to VCS, with ${TOKEN} variable expansion. User scope: ~/.claude.json in home folder, not in VCS.',
      safeguardsOrGuidelines: 'Use MCP resources for content catalogs (issue summaries, doc hierarchies, DB schemas) to reduce exploratory tool calls.',
      antiPatterns: [
        'Committing raw API keys or tokens into .mcp.json (always use ${VAR} expansion)',
        'Putting personal experimental MCP servers into the team .mcp.json file',
        'Assuming a missing environment variable will automatically use a fallback default token'
      ],
      examTrigger: '"Team needs shared GitHub integration" → .mcp.json with ${GITHUB_TOKEN} · "Personal experiment" → ~/.claude.json.'
    },
    qa: [
      { id: '14-1', question: 'Where should a shared team GitHub or Jira MCP server be configured?', answer: 'In project-level .mcp.json.', trap: 'Do not require every developer to recreate shared setup in user configuration.' },
      { id: '14-2', question: 'Where should a personal experimental MCP server be configured?', answer: 'In ~/.claude.json.', trap: 'Do not commit a personal experiment into the team project configuration.' },
      { id: '14-3', question: 'How should tokens be referenced in .mcp.json?', answer: 'Use environment variable expansion such as ${GITHUB_TOKEN}.', trap: 'Never commit raw secrets into version control.' },
      { id: '14-4', question: 'What happens when an expected environment variable is missing?', answer: 'Authentication-dependent MCP calls can fail at runtime.', trap: 'Do not assume a default secret or automatic token exists.' },
      { id: '14-5', question: 'Why use MCP resources for catalogs?', answer: 'They expose available content and reduce exploratory tool calls.', trap: 'Resources are not simply a replacement for action-oriented tools.' }
    ]
  },
  {
    id: 15,
    domainId: 'D5',
    taskRef: 'Tasks 5.1, 5.4',
    title: 'Context Management Strategies Across Long Sessions',
    studyFocus: 'Long sessions can lose specificity and overfill context. Persist key facts, trim outputs early, use structured summaries, compact context, and delegate verbose exploration.',
    keys: ['scratchpad files', '/compact', 'lost in the middle', 'trim output', 'structured summaries'],
    isGap: false,
    deepDive: {
      coreConcept: 'Long sessions experience context degradation — attention weakens and specific facts (e.g. line numbers, variable names) fade into generic "typical patterns".',
      keyMechanism: 'Mitigations: 1. Persist findings to external scratchpad files; 2. Use /compact to summarize context; 3. Delegate verbose exploration to subagents; 4. Trim tool outputs early.',
      safeguardsOrGuidelines: 'Understand the "lost in the middle" effect: models attend strongly to the start and end of prompts. Place key findings at the beginning and use clear section headers.',
      antiPatterns: [
        'Believing a larger context window alone solves attention quality degradation',
        'Letting 40-field database responses accumulate in conversation history without trimming',
        'Assuming /compact modifies repository files (it only compacts conversation context)'
      ],
      examTrigger: '"Agent says \'typical patterns\' instead of specific data" → Scratchpad files + /compact.'
    },
    qa: [
      { id: '15-1', question: 'What mitigates long-session drift toward "typical patterns"?', answer: 'Persist key findings in scratchpad files and reference them later.', trap: 'A bigger context window alone does not guarantee attention to old details.' },
      { id: '15-2', question: 'How should verbose tool output be handled?', answer: 'Trim irrelevant fields before output accumulates in context.', trap: 'Summarizing only after context is full is a weaker downstream fix.' },
      { id: '15-3', question: 'What is the lost-in-the-middle effect?', answer: 'Important information in the middle of long input receives weaker attention.', trap: 'Do not assume all positions in a long context are equally attended.' },
      { id: '15-4', question: 'How can lost-in-the-middle be mitigated?', answer: 'Place key summaries early and use explicit section headers.', trap: 'Repeating every raw tool result wastes tokens.' },
      { id: '15-5', question: 'What does /compact support?', answer: 'Reducing active conversation context through summarization.', trap: 'It does not modify project files or MCP configuration.' }
    ]
  },
  {
    id: 16,
    domainId: 'D3',
    taskRef: 'Tasks 3.1, 3.5',
    title: 'Providing Project Context: @ References, CLAUDE.md, or Inline Description',
    studyFocus: 'Use @ references for specific current files, CLAUDE.md for persistent project knowledge, and inline text for one-off task context.',
    keys: ['@ references', 'CLAUDE.md', 'inline context', 'persistent context', 'one-off context'],
    isGap: true,
    gapDetails: {
      originalIssue: 'Exam candidates struggle to choose the correct context mechanism among @ file references, CLAUDE.md files, and inline prompt text.',
      gapResolved: 'Explicitly mapped the lifecycle and scope: @ references = on-demand file inclusion; CLAUDE.md = permanent project standards; Inline text = temporary one-off task context.',
      actionableTakeaway: 'For CI-invoked Claude Code, testing conventions and review criteria must be placed in CLAUDE.md so they are loaded automatically without human interaction.'
    },
    deepDive: {
      coreConcept: 'Context mechanisms must match the persistence, scope, and audience of the information.',
      keyMechanism: '@path/file.ts → Inlines specific file contents on demand during a conversation. CLAUDE.md → Universal project context loaded every session. Inline text → Ephemeral task description.',
      safeguardsOrGuidelines: 'Never pollute persistent CLAUDE.md files with temporary migration details or session-specific bug scenarios.',
      antiPatterns: [
        'Adding temporary one-off migration schemas permanently to CLAUDE.md',
        'Manually copy-pasting an entire file into chat instead of using @path/file.ts',
        'Relying on inline repetition for permanent coding standards across every session'
      ],
      examTrigger: '"Claude doesn\'t know about project conventions" → Add to project-level CLAUDE.md · "Claude needs to see a specific file" → Use @ reference.'
    },
    qa: [
      { id: '16-1', question: 'What is best for bringing one specific file into a conversation?', answer: 'Use an @ file reference.', trap: 'Do not add one-off file content permanently to CLAUDE.md.' },
      { id: '16-2', question: 'What is best for coding standards needed in every session?', answer: 'Project-level CLAUDE.md.', trap: 'Do not require manual inline repetition of permanent standards.' },
      { id: '16-3', question: 'What is best for a one-time migration constraint?', answer: 'Inline description in the current conversation.', trap: 'Permanent memory files should not be polluted with temporary details.' },
      { id: '16-4', question: 'How should CI-invoked Claude Code receive testing conventions?', answer: 'Through CLAUDE.md project context.', trap: 'Environment variables are for configuration/secrets, not rich standards documentation.' },
      { id: '16-5', question: 'What determines the correct context mechanism?', answer: 'Whether context is specific, persistent, shared, or one-time.', trap: 'The decision is not based merely on file size.' }
    ]
  },
  {
    id: 17,
    domainId: 'D5',
    taskRef: 'Task 5.1',
    title: 'Conversation History in a Stateless API',
    studyFocus: 'The API does not retain server-side conversation state. Applications must send appropriate message history and separately preserve high-value facts that summarization could lose.',
    keys: ['stateless API', 'message history', 'case facts', 'summarization', 'multi-issue sessions'],
    isGap: true,
    gapDetails: {
      originalIssue: 'Engineers assume Claude retains server-side chat state, leading to broken multi-turn apps, or use naive summarization that silently drops critical transactional numbers and dates.',
      gapResolved: 'Documented that the Messages API is strictly stateless; full message arrays must be passed. Highlighted the "case facts" architecture: store exact IDs, amounts, and dates in an unsummarized structured block.',
      actionableTakeaway: 'Progressive summarization causes numerical loss ($47.99 instead of $49.99); always extract transactional facts into a dedicated persistent block outside summarized text.'
    },
    deepDive: {
      coreConcept: 'The Messages API is completely stateless — Claude has zero server-side memory between API calls.',
      keyMechanism: 'Developers must send the complete message array. For long or multi-issue sessions, extract transactional facts (customer IDs, amounts, order numbers) into a dedicated "case facts" block.',
      safeguardsOrGuidelines: 'Progressive summarization often degrades numbers, percentages, and dates. The "case facts" block is immune to summarization loss.',
      antiPatterns: [
        'Assuming Claude remembers previous API turns without sending the message history',
        'Progressive summarization that condenses exact numerical values into vague summaries',
        'Blending multiple customer support issues into one unstructured history'
      ],
      examTrigger: '"Agent loses track of earlier details" → Ensure full history is passed or extract critical facts to persistent block.'
    },
    qa: [
      { id: '17-1', question: 'Why might Claude not remember a previous API call?', answer: 'The API is stateless; prior messages were not included in the new request.', trap: 'Do not assume a hidden server-side chat memory.' },
      { id: '17-2', question: 'What should be preserved outside summarized history?', answer: 'Critical IDs, amounts, dates, statuses, and other transactional facts.', trap: 'Precise numerical facts are vulnerable to summary loss.' },
      { id: '17-3', question: 'How should multi-issue support sessions be structured?', answer: 'Keep separate structured issue data for each issue.', trap: 'Do not let details from multiple orders blend into one free-form history.' },
      { id: '17-4', question: 'Why can progressive summarization be risky?', answer: 'It can lose exact numbers, dates, and percentages.', trap: 'It is not guaranteed to preserve all details with equal precision.' },
      { id: '17-5', question: 'What helps maintain coherent multi-turn behavior?', answer: 'Send relevant full history plus a persistent structured facts block.', trap: 'Repeating arbitrary text every turn is inefficient and error-prone.' }
    ]
  },
  {
    id: 18,
    domainId: 'D5',
    taskRef: 'Task 5.2',
    title: 'Escalation Decision Criteria in Agentic Systems',
    studyFocus: 'Escalate when a customer explicitly requests a human, policy is ambiguous, or the agent cannot make meaningful progress. Do not rely on sentiment or self-reported confidence alone.',
    keys: ['explicit human request', 'policy gap', 'ambiguity', 'sentiment', 'additional identifiers'],
    isGap: false,
    deepDive: {
      coreConcept: 'Agentic escalation must be driven by objective criteria: explicit human request, policy gaps, and lack of progress — NOT sentiment or self-reported confidence.',
      keyMechanism: 'Customer asks for human → Escalate immediately. Customer frustrated but within capability → Acknowledge frustration, offer resolution; escalate if reiterated.',
      safeguardsOrGuidelines: 'When policy is silent on a requested exception (e.g. competitor price match), escalate to a human. When CRM returns multiple matches, ask for disambiguating identifiers.',
      antiPatterns: [
        'Escalating automatically just because sentiment score is negative (frustration ≠ complexity)',
        'Relying on model self-reported confidence scores for routing (poorly calibrated)',
        'Heuristic selection (e.g., picking the most recent customer record) when multiple matches occur'
      ],
      examTrigger: '"Customer says \'talk to a human\'" → Escalate immediately · "Customer is angry" → Does NOT require escalation.'
    },
    qa: [
      { id: '18-1', question: 'What happens when a customer explicitly asks for a human?', answer: 'Escalate immediately.', trap: 'Do not investigate first merely because the issue looks easy.' },
      { id: '18-2', question: 'What should happen when a customer is frustrated but has not requested a human?', answer: 'Acknowledge the frustration and offer resolution if the issue is within capability.', trap: 'Frustration is not itself a reliable complexity signal.' },
      { id: '18-3', question: 'What should happen when policy is silent on a requested exception?', answer: 'Escalate because the policy is ambiguous or incomplete.', trap: 'Do not invent a new policy interpretation.' },
      { id: '18-4', question: 'What should happen when CRM returns multiple customer matches?', answer: 'Ask for additional identifiers to disambiguate.', trap: 'Do not choose based on recent activity or another heuristic.' },
      { id: '18-5', question: 'Why not route solely on model confidence?', answer: 'Self-reported confidence can be poorly calibrated.', trap: 'A low confidence score is not automatically the same as a policy escalation trigger.' }
    ]
  },
  {
    id: 19,
    domainId: 'D5',
    taskRef: 'Task 5.5',
    title: 'Human Review Routing Strategies Based on Confidence and Ambiguity',
    studyFocus: 'Use calibrated, field-level and document-type-level measurements. Aggregate accuracy can conceal serious error rates in specific segments.',
    keys: ['stratified sampling', 'field-level confidence', 'calibration', 'document type', 'ambiguity'],
    isGap: false,
    deepDive: {
      coreConcept: 'Human review routing must use stratified, field-level and document-type-level measurements because aggregate metrics hide critical segment failures.',
      keyMechanism: 'Stratified sampling: 97% overall accuracy can conceal 78% accuracy on handwritten notes. Route low-confidence fields and ambiguous sources to human review.',
      safeguardsOrGuidelines: 'Sample high-confidence extractions periodically to detect novel error patterns and verify calibration.',
      antiPatterns: [
        'Automating all extractions because aggregate accuracy reached 97%',
        'Requiring human review of every field when only one field fell below confidence threshold',
        'Assuming high confidence means zero error rate forever'
      ],
      examTrigger: '"97% accuracy, should we automate?" → Check per-document-type and per-field accuracy first.'
    },
    qa: [
      { id: '19-1', question: 'Why is 97% overall extraction accuracy insufficient by itself?', answer: 'It can hide poor accuracy for particular document types or fields.', trap: 'Do not automate everything solely from one aggregate metric.' },
      { id: '19-2', question: 'What should be validated before broad automation?', answer: 'Accuracy by document type and field using labeled data.', trap: 'A single random aggregate test is not enough.' },
      { id: '19-3', question: 'How should high-confidence outputs be treated?', answer: 'Sample them for review to detect novel errors and confirm calibration.', trap: 'Do not assume high-confidence means error-free forever.' },
      { id: '19-4', question: 'What should low-confidence line-item extraction receive?', answer: 'Targeted human review of that field or document.', trap: 'Do not require full review of every high-confidence field unnecessarily.' },
      { id: '19-5', question: 'What routes an ambiguous or conflicting extraction?', answer: 'Human review or explicit uncertainty handling.', trap: 'Do not silently choose one plausible interpretation.' }
    ]
  },
  {
    id: 20,
    domainId: 'D4',
    taskRef: 'Task 4.5',
    title: 'Synchronous Messages API vs. Asynchronous Message Batches API',
    studyFocus: 'Use synchronous requests for interactive and blocking workflows. Use batches for non-urgent volume workloads, accepting asynchronous completion and no multi-turn tool loop.',
    keys: ['Messages API', 'Message Batches', '50% savings', '24 hours', 'custom_id'],
    isGap: false,
    deepDive: {
      coreConcept: 'Choosing between the Synchronous Messages API (real-time, blocking, interactive) and Message Batches API (asynchronous, non-blocking, 50% cost discount, 24-hour turnaround).',
      keyMechanism: 'Batches offer 50% cost savings for volume workloads (up to 10,000 requests per batch). Results correlated via custom_id (not array order).',
      safeguardsOrGuidelines: 'Message Batches API does NOT support multi-turn tool calling loops. Agentic loops requiring tool execution must use synchronous requests.',
      antiPatterns: [
        'Using Message Batches in a CI/CD pre-merge blocking review pipeline (pipeline will hang)',
        'Assuming batch results return in the same order as input requests',
        'Attempting multi-turn agentic tool loops inside a batch request'
      ],
      examTrigger: '"Pre-merge blocking check" → Synchronous · "Overnight tech debt report" → Batch.'
    },
    qa: [
      { id: '20-1', question: 'Which API fits a blocking pre-merge review?', answer: 'The synchronous Messages API.', trap: 'Batch processing may take too long for a blocking decision.' },
      { id: '20-2', question: 'Which API fits weekly reports for many repositories?', answer: 'Message Batches API.', trap: 'Do not pay synchronous cost when immediate results are unnecessary.' },
      { id: '20-3', question: 'What cost characteristic is associated with batches?', answer: 'They offer 50% cost savings.', trap: 'Savings do not make batches appropriate for real-time workflows.' },
      { id: '20-4', question: 'How are batch results correlated with requests?', answer: 'Using custom_id values.', trap: 'Do not assume results return in input array order.' },
      { id: '20-5', question: 'Can Message Batches run multi-turn tool-use loops?', answer: 'No; use synchronous requests for that agentic interaction pattern.', trap: 'Do not choose batches for workflows requiring iterative tool calls.' }
    ]
  },
  {
    id: 21,
    domainId: 'D4',
    taskRef: 'Task 4.3',
    title: 'Selecting the Most Reliable Structured Output Method',
    studyFocus: 'For reliable schema-compliant output, use tool_use with a JSON schema and appropriate tool_choice. Prompt-only JSON is less reliable.',
    keys: ['tool_use', 'JSON Schema', 'schema compliance', 'syntax errors', 'semantic errors'],
    isGap: false,
    deepDive: {
      coreConcept: 'tool_use with JSON Schema and controlled tool_choice is the most reliable method for schema-compliant structured output, eliminating syntax errors.',
      keyMechanism: 'Reliability hierarchy: 1. tool_use + forced tool_choice > 2. tool_use + "any" > 3. tool_use + "auto" > 4. Prompt-only JSON in text.',
      safeguardsOrGuidelines: 'tool_use guarantees schema and syntax compliance, but does NOT guarantee semantic correctness (e.g. line items summing to total). Semantic validation requires programmatic checks.',
      antiPatterns: [
        'Prompting "Return JSON only, no markdown" and using regex parsing for mission-critical machine output',
        'Confusing schema compliance with semantic business-rule correctness',
        'Assuming forced tool_choice validates whether the document type actually matches the schema'
      ],
      examTrigger: '"Need guaranteed JSON output" → tool_use with tool_choice (NOT prompt instructions to "output JSON").'
    },
    qa: [
      { id: '21-1', question: 'What is the most reliable method for guaranteed structured output?', answer: 'tool_use with a JSON schema and controlled tool_choice.', trap: 'Prompting "return JSON only" is not a structural guarantee.' },
      { id: '21-2', question: 'What does tool_use prevent effectively?', answer: 'Schema and JSON syntax failures.', trap: 'It does not guarantee that values are semantically correct.' },
      { id: '21-3', question: 'Can tool_use ensure line items sum to a total?', answer: 'No; that requires semantic validation beyond schema compliance.', trap: 'Do not confuse valid JSON structure with correct business logic.' },
      { id: '21-4', question: 'What is least reliable for machine output?', answer: 'Prompt-only JSON text parsing.', trap: 'Markdown fences and extra explanatory text can break parsers.' },
      { id: '21-5', question: 'Why use a schema?', answer: 'To constrain structure, types, required fields, and valid enumerated values.', trap: 'A schema does not create information absent from the source.' }
    ]
  },
  {
    id: 22,
    domainId: 'D4',
    taskRef: 'Task 4.3',
    title: 'Designing Extraction Schemas with Optional and Nullable Fields',
    studyFocus: 'Fields that may not appear in a source should be optional or nullable. This gives the model a valid way to express absence rather than fabricating data.',
    keys: ['optional', 'nullable', 'null', 'enum', 'other + detail'],
    isGap: false,
    deepDive: {
      coreConcept: 'Schema design directly affects model hallucination. If a missing field is required, the model is compelled to invent a plausible value or placeholder.',
      keyMechanism: 'Use "type": ["string", "null"] for optional fields; add "unclear" to enums for genuine ambiguity; use "other" + "category_detail" for unforeseen categories.',
      safeguardsOrGuidelines: 'Only mark fields as required if they are guaranteed to exist in every valid source document.',
      antiPatterns: [
        'Making all schema fields required (causes widespread hallucination and fabricated values)',
        'Using an empty string "" instead of explicit null for missing data',
        'Forcing ambiguous documents into the nearest category instead of offering an "unclear" option'
      ],
      examTrigger: '"Model fabricates values for missing fields" → Make fields nullable/optional.'
    },
    qa: [
      { id: '22-1', question: 'What prevents fabrication for a field absent from some documents?', answer: 'Make it optional or allow null.', trap: 'A required string field pressures the model to invent a value.' },
      { id: '22-2', question: 'What schema type permits a text value or no value?', answer: 'A nullable type such as [string, null].', trap: 'An empty string is not always a clear or safe missing-data signal.' },
      { id: '22-3', question: 'What enum value helps with genuine ambiguity?', answer: 'Use an explicit value such as unclear.', trap: 'Forcing a nearest category can create an incorrect classification.' },
      { id: '22-4', question: 'What supports future categories not anticipated in an enum?', answer: 'Use other plus a detail field.', trap: 'Listing every conceivable future category is not practical.' },
      { id: '22-5', question: 'What fields should be required?', answer: 'Only fields reliably present and truly required by the source/task.', trap: 'Making every field required increases hallucination risk.' }
    ]
  },
  {
    id: 23,
    domainId: 'D2',
    taskRef: 'Task 2.3, 4.3',
    title: 'Enforcing Structured Output with Tool Use and tool_choice',
    studyFocus: 'tool_choice determines whether the model may return text, must call some tool, or must call a specified tool.',
    keys: ['auto', 'any', 'forced tool', 'specific tool', 'structured output'],
    isGap: false,
    deepDive: {
      coreConcept: 'tool_choice controls whether the model can output text ("auto"), must invoke one tool ("any"), or must invoke a specific tool ({"type":"tool","name":"X"}).',
      keyMechanism: 'tool_choice: "any" is ideal when document type is unknown and multiple extraction schemas exist. Forced tool is ideal for mandatory first turn in multi-turn sequences.',
      safeguardsOrGuidelines: 'Multi-tool workflows must be sequenced across separate API turns; you cannot force multiple tools in a single turn.',
      antiPatterns: [
        'Using "auto" when structured extraction is mandatory (model might output free-text analysis)',
        'Forcing a specific invoice schema when the input could be a contract or report (forces fabrication)',
        'Attempting to force an ordered sequence of 3 tools in one single API request'
      ],
      examTrigger: '"Ensure model always calls extract tool" → tool_choice: "any" or forced · "Model returns text instead of JSON" → Switch from "auto" to "any".'
    },
    qa: [
      { id: '23-1', question: 'What does tool_choice: auto allow?', answer: 'The model may call a tool or return ordinary text.', trap: 'Do not use auto when a tool call is mandatory.' },
      { id: '23-2', question: 'What does tool_choice: any ensure?', answer: 'The model must call a tool, but may choose which one.', trap: 'It does not mean call every available tool.' },
      { id: '23-3', question: 'What does forced tool selection ensure?', answer: 'A specific named tool must be called.', trap: 'It can be inappropriate if the forced schema does not fit the input.' },
      { id: '23-4', question: 'What fits unknown document types with several extraction tools?', answer: 'tool_choice: any, so a tool is required but the model can choose.', trap: 'Forcing an invoice extractor on every document can cause fabrication.' },
      { id: '23-5', question: 'How is a multi-tool sequence enforced?', answer: 'Force the needed tool in one turn, process its result, then control the next turn.', trap: 'Do not assume every ordered step can be forced simultaneously in one turn.' }
    ]
  },
  {
    id: 24,
    domainId: 'D4',
    taskRef: 'Tasks 4.2, 4.4',
    title: 'Extraction Accuracy Patterns to Reduce Hallucination',
    studyFocus: 'Reduce fabrication by allowing nulls, providing examples for missing and ambiguous cases, defining normalization rules, and validating cross-field consistency.',
    keys: ['few-shot', 'null', 'unclear', 'normalization', 'semantic validation'],
    isGap: false,
    deepDive: {
      coreConcept: 'Minimizing hallucination in extraction combines nullable fields, few-shot examples demonstrating missing-data handling, normalization rules, and semantic cross-validation.',
      keyMechanism: 'Include few-shot examples showing "amount": null for missing data. Add cross-validation fields like conflict_detected: true when line items do not sum to total.',
      safeguardsOrGuidelines: 'Retries with error feedback only work if the information actually exists in the source document. Never retry for absent data.',
      antiPatterns: [
        'Showing few-shot examples where all fields are always present (teaches model to always populate fields)',
        'Assuming JSON Schema alone can validate arithmetic consistency across fields',
        'Endlessly retrying an extraction when the document simply contains no renewal date'
      ],
      examTrigger: '"Model invents data not in document" → Make fields nullable + add few-shot examples with null.'
    },
    qa: [
      { id: '24-1', question: 'Why show null in a few-shot extraction example?', answer: 'It teaches the model to return absence rather than inventing a value.', trap: 'The point is not merely demonstrating JSON syntax.' },
      { id: '24-2', question: 'What is a semantic extraction error?', answer: 'Values are structurally valid but logically inconsistent, such as totals that do not add up.', trap: 'It is not a malformed JSON syntax error.' },
      { id: '24-3', question: 'How should date/phone formatting be standardized?', answer: 'Provide normalization rules alongside the schema, optionally reinforced with post-processing.', trap: 'Allowing arbitrary formats defeats downstream consistency.' },
      { id: '24-4', question: 'What helps identify contradictory extracted values?', answer: 'Cross-validation fields or programmatic semantic checks.', trap: 'JSON Schema alone generally cannot enforce arithmetic relationships.' },
      { id: '24-5', question: 'What should happen when a source truly omits a value?', answer: 'Return null/optional absence and avoid retries meant to invent it.', trap: 'A required field or repeated retry can amplify hallucination.' }
    ]
  },
  {
    id: 25,
    domainId: 'D4',
    taskRef: 'Task 4.4',
    title: 'Feedback Loop Mechanisms for Continuous Prompt Improvement',
    studyFocus: 'Use validation errors, detected patterns, dismissed findings, and representative testing to improve prompts and extraction workflows systematically.',
    keys: ['retry-with-feedback', 'detected_pattern', 'false positives', 'validation errors', 'sample set'],
    isGap: false,
    deepDive: {
      coreConcept: 'Continuous prompt refinement leverages telemetry from validation errors, user dismissals, and tracked pattern triggers.',
      keyMechanism: 'Include detected_pattern field in review findings so developer dismissals can be grouped by pattern. Analyze dismissed patterns to refine prompt criteria.',
      safeguardsOrGuidelines: 'Retry-with-error-feedback includes the original text, failed output, and specific error message. Test on representative sample sets before batch deployment.',
      antiPatterns: [
        'Deleting an entire category of review findings because of high false positives on one pattern',
        'Retrying when the required information is absent from the source document',
        'Assuming developer severity adjustments (critical → major) are user errors rather than prompt miscalibration'
      ],
      examTrigger: '"High false positive rate on certain patterns" → Track detected_pattern, analyze dismissals, refine prompts.'
    },
    qa: [
      { id: '25-1', question: 'What makes retry-with-error-feedback effective?', answer: 'It provides specific validation failures when the source contains the needed information.', trap: 'It cannot recover facts that are absent from the source.' },
      { id: '25-2', question: 'When should a retry stop?', answer: 'When the required information does not exist in the source.', trap: 'More retries cannot extract nonexistent data.' },
      { id: '25-3', question: 'What is detected_pattern useful for?', answer: 'Tracking which patterns trigger findings and analyzing dismissals or false positives.', trap: 'Do not remove an entire category before identifying the problematic pattern.' },
      { id: '25-4', question: 'How should prompts be tested before large batch deployment?', answer: 'Use a representative sample set and measure first-pass quality.', trap: 'Testing one successful document is not sufficient.' },
      { id: '25-5', question: 'What does repeated developer severity correction indicate?', answer: 'Prompt criteria may not match the team’s intended severity definition.', trap: 'Do not assume repeated user corrections are simply user mistakes.' }
    ]
  },
  {
    id: 26,
    domainId: 'D2',
    taskRef: 'Task 2.2, 5.3',
    title: 'MCP Tool Error Handling with Structured, Type-Specific Errors',
    studyFocus: 'Return errors with actionable categories and recovery guidance. Distinguish retryable failures from valid empty results.',
    keys: ['isError', 'is_error', 'transient', 'validation', 'permission'],
    isGap: false,
    deepDive: {
      coreConcept: 'MCP errors must provide actionable structured metadata (category, retryability, alternatives) rather than generic text.',
      keyMechanism: 'MCP protocol uses isError: true (camelCase); Anthropic API uses is_error: true (snake_case). Error categories: transient (retryable), validation, business, permission.',
      safeguardsOrGuidelines: 'A successful database query that returns zero matches is NOT an error (isError: false, empty array). Do not trigger retry loops for valid empty results.',
      antiPatterns: [
        'Returning generic "Error occurred" without errorCategory or isRetryable flag',
        'Treating access failure (timeout) identically to a valid empty result (zero rows found)',
        'Retrying permission errors repeatedly without escalating for credential intervention'
      ],
      examTrigger: '"Coordinator retries wrong subagent" → Error lacks structured context · "Agent treats timeout as \'no results\'" → Distinguish access failure from empty result.'
    },
    qa: [
      { id: '26-1', question: 'What makes an MCP error actionable?', answer: 'A category, retryability indicator, useful description, partial results, and alternatives.', trap: '"Something went wrong" gives the coordinator no recovery information.' },
      { id: '26-2', question: 'What is the MCP/API error flag casing distinction?', answer: 'MCP uses isError; the Anthropic API tool_result uses is_error.', trap: 'Do not confuse camelCase and snake_case here.' },
      { id: '26-3', question: 'How should a timeout be categorized?', answer: 'Transient and retryable.', trap: 'It is not necessarily a validation or business-rule failure.' },
      { id: '26-4', question: 'How should access denied be categorized?', answer: 'Permission; generally not retryable without intervention.', trap: 'Repeated retries normally do not fix missing authorization.' },
      { id: '26-5', question: 'Is a successful query returning zero matches an error?', answer: 'No; return a valid empty result.', trap: 'Do not represent "no matches" as a failure that triggers retry logic.' }
    ]
  },
  {
    id: 27,
    domainId: 'D2',
    taskRef: 'Task 2.1',
    title: 'Improving Tool Selection Reliability via Rich Descriptions',
    studyFocus: 'Descriptions are the primary tool-selection mechanism. Explain purpose, returned data, when to use, when not to use, and parameter expectations.',
    keys: ['tool descriptions', 'boundaries', 'misrouting', '4–5 tools', 'overlap'],
    isGap: false,
    deepDive: {
      coreConcept: 'Tool descriptions are the primary mechanism Claude uses to select which tool to invoke.',
      keyMechanism: 'A complete description specifies: 1. What it does, 2. What it returns, 3. When to use it, 4. When NOT to use it, 5. Input parameters and edge cases.',
      safeguardsOrGuidelines: 'Keep tools per agent scoped to 4-5 tools. 18+ tools per agent significantly degrades selection reliability.',
      antiPatterns: [
        'Using vague minimal descriptions like "Gets data" or "Searches items"',
        'Adding a complex intent-routing layer before simply clarifying overlapping tool descriptions',
        'Overloading a single agent with 18+ tools rather than splitting into specialized subagents'
      ],
      examTrigger: '"Agent calls get_customer instead of lookup_order" → Expand tool descriptions with boundaries (NOT add routing layer).'
    },
    qa: [
      { id: '27-1', question: 'What is the first fix for misrouted similar tools?', answer: 'Improve descriptions and clarify boundaries.', trap: 'Do not immediately add a routing layer or more tools.' },
      { id: '27-2', question: 'What should a high-quality tool description include?', answer: 'What it does, returns, when to use it, when not to use it, and input guidance.', trap: 'A label such as "gets data" is not enough.' },
      { id: '27-3', question: 'How should overlapping fuzzy and exact search tools be documented?', answer: 'State precise use boundaries for approximate versus exact lookup.', trap: 'Do not leave two generic descriptions that compete for the same request.' },
      { id: '27-4', question: 'Why scope tools per agent?', answer: 'Too many unrelated tools increase decision complexity and misuse.', trap: 'Giving every agent all tools is not a specialization strategy.' },
      { id: '27-5', question: 'What tool count is a useful target per agent?', answer: 'About 4–5 relevant tools.', trap: 'Large toolsets—especially around 18 or more—reduce selection reliability.' }
    ]
  },
  {
    id: 28,
    domainId: 'D2',
    taskRef: 'Task 2.4',
    title: 'Integrating MCP Servers into Claude Code and Agent Applications',
    studyFocus: 'MCP servers connect Claude applications to external systems. Understand project/user configuration, transport, tool discovery, and the three MCP primitives.',
    keys: ['stdio', 'Streamable HTTP', 'tools', 'resources', 'prompts'],
    isGap: false,
    deepDive: {
      coreConcept: 'MCP integrates external capabilities via three core primitives: Tools, Resources, and Prompts.',
      keyMechanism: 'Tools = model-initiated actions. Resources = application/host-controlled data catalogs. Prompts = user-selected templates. Local Claude Code servers use stdio transport.',
      safeguardsOrGuidelines: 'Prefer existing community MCP servers for standard services (Jira, GitHub). Build custom MCP servers only for proprietary internal workflows.',
      antiPatterns: [
        'Assuming MCP server tools must be individually discovered by calling a special discovery tool (tools from configured servers are available simultaneously)',
        'Confusing stdio (local process command) with HTTP transport',
        'Failing to provide clear MCP tool descriptions, causing the model to prefer built-in Grep over specialized MCP tools'
      ],
      examTrigger: '"Agent uses Grep instead of MCP code search tool" → Improve MCP tool descriptions.'
    },
    qa: [
      { id: '28-1', question: 'What transport is common for local Claude Code MCP servers?', answer: 'stdio.', trap: 'A command-and-args local server setup is not automatically HTTP.' },
      { id: '28-2', question: 'When are configured MCP tools discovered?', answer: 'At connection time; tools from configured servers are available together.', trap: 'Do not assume a user must manually discover one server at a time.' },
      { id: '28-3', question: 'Who controls MCP tools?', answer: 'The model initiates tool use.', trap: 'Tools are not user-selected prompt templates.' },
      { id: '28-4', question: 'Who controls MCP resources?', answer: 'The host/application exposes or initiates access to resource data.', trap: 'Resources are not primarily model-initiated actions.' },
      { id: '28-5', question: 'Who selects MCP prompts?', answer: 'The user.', trap: 'Prompts are distinct from both model-called tools and host-provided resources.' }
    ]
  },
  {
    id: 29,
    domainId: 'D2',
    taskRef: 'Task 2.3',
    title: 'Configuring tool_choice and Sequencing Multi-Tool Workflows',
    studyFocus: 'Use forced selection for mandatory first steps, any when one of multiple tools must run, and auto when the model should decide the next action after receiving results.',
    keys: ['sequencing', 'forced tool', 'auto', 'any', 'scoped tools'],
    isGap: false,
    deepDive: {
      coreConcept: 'Orchestrating multi-tool sequences across turns using adaptive tool_choice configurations.',
      keyMechanism: 'Turn 1: Force extract_metadata → process result. Turn 2: Force enrich_data → process result. Turn 3: "auto" for synthesis. Provide scoped cross-role tools for high-frequency needs.',
      safeguardsOrGuidelines: 'Replace generic unconstrained tools (fetch_url) with purpose-specific alternatives (load_document) that validate document URLs before retrieval.',
      antiPatterns: [
        'Leaving tool_choice: "auto" on a mandatory first extraction step (risks model returning text without tool execution)',
        'Forcing tools in subsequent turns when the model needs flexibility to decide whether more data is needed',
        'Giving broad web-search tools to synthesis agents instead of narrowly scoped verification tools'
      ],
      examTrigger: '"Ensure extract_metadata runs before any enrichment" → Force tool_choice on first turn · "Model returns text instead of calling tool" → Switch to "any".'
    },
    qa: [
      { id: '29-1', question: 'How can extract_metadata be guaranteed before enrichment?', answer: 'Force extract_metadata in the first turn, then process its result before the next step.', trap: 'Do not rely only on prompt wording for a mandatory first action.' },
      { id: '29-2', question: 'What should follow a forced metadata step when the next action depends on results?', answer: 'Use auto if the model should adaptively decide the next action.', trap: 'Forcing an unnecessary next tool can reduce useful flexibility.' },
      { id: '29-3', question: 'When is any better than auto?', answer: 'When a tool call is mandatory but the appropriate tool depends on input.', trap: 'Auto can return text instead of calling a tool.' },
      { id: '29-4', question: 'How should a synthesis agent receive cross-role tool access?', answer: 'Give narrowly scoped, high-frequency tools only when justified.', trap: 'Do not give broad research toolsets to every specialized agent.' },
      { id: '29-5', question: 'How can a generic fetch_url tool be made safer?', answer: 'Use a constrained alternative that validates appropriate document URLs.', trap: 'A generic tool plus vague instruction has broader misuse risk.' }
    ]
  }
];

export const TOPICS_DATA: TopicData[] = RAW_TOPICS_DATA.map((topic) => {
  const details = TOPIC_STUDY_FOCUS_MAP[topic.id];
  return {
    ...topic,
    studyFocusDetails: details,
    studyFocus: details ? details.principle : topic.studyFocus,
  };
});
