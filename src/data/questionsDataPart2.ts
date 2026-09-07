import { PracticeQuestion } from '../types';

export const QUESTIONS_PART2: PracticeQuestion[] = [
  // TOPIC 11
  {
    id: 'Q11.1',
    topicId: 11,
    domainId: 'D3',
    taskRef: 'Domain 3, Task 3.3',
    question: 'A team wants to enforce that all *.test.tsx files follow a specific testing pattern across the entire codebase — regardless of which directory they\'re in. Which configuration mechanism is most appropriate?',
    options: [
      'Project-level .claude/CLAUDE.md',
      'Subdirectory CLAUDE.md in the tests/ folder',
      '.claude/rules/testing-patterns.md with paths: ["**/*.test.tsx"]',
      'A custom slash command /test-check'
    ],
    correctOptionIndex: 2,
    explanation: '`.claude/rules/` with glob patterns in YAML frontmatter loads instructions conditionally only when editing matching files across any folder in the codebase.',
    trap: 'Option 1 loads rules for every file (wasting context). Option 2 only applies to files within that single subdirectory.'
  },
  {
    id: 'Q11.2',
    topicId: 11,
    domainId: 'D3',
    taskRef: 'Domain 3, Task 3.1',
    question: 'A developer wants to add their personal preference for verbose logging during debugging. This should NOT affect other team members. Where should this go?',
    options: [
      '.claude/CLAUDE.md',
      '~/.claude/CLAUDE.md',
      '.claude/rules/logging.md',
      '.mcp.json'
    ],
    correctOptionIndex: 1,
    explanation: 'User-level `~/.claude/CLAUDE.md` in the user\'s home directory is personal and not committed to VCS.',
    trap: 'Options 1 and 3 are project-level configurations committed to VCS, affecting all developers.'
  },
  {
    id: 'Q11.3',
    topicId: 11,
    domainId: 'D3',
    taskRef: 'Domain 3, Task 3.1',
    question: 'A team\'s frontend/ directory has specific React conventions (use hooks, no class components) while the backend/ directory uses different patterns (dependency injection, repository pattern). What is the best configuration approach?',
    options: [
      'Put all conventions in project-level .claude/CLAUDE.md',
      'Create frontend/CLAUDE.md and backend/CLAUDE.md with directory-specific conventions',
      'Use .claude/rules/ with glob patterns for each directory',
      'Create separate projects for frontend and backend'
    ],
    correctOptionIndex: 1,
    explanation: 'Subdirectory CLAUDE.md files provide scoped context that only loads when working inside that specific directory hierarchy in a monorepo.',
    trap: 'Option 1 loads both frontend and backend rules into every session, diluting context.'
  },
  {
    id: 'Q11.4',
    topicId: 11,
    domainId: 'D3',
    taskRef: 'Domain 3, Task 3.1',
    question: 'A new team member joins and reports that Claude doesn\'t follow the team\'s coding standards. Other team members don\'t have this issue. What is the most likely cause?',
    options: [
      'The new member\'s model version is different',
      'The team\'s coding standards are in ~/.claude/CLAUDE.md on other members\' machines, not in project-level configuration',
      'The new member hasn\'t installed Claude Code correctly',
      'The new member needs to adjust their temperature settings'
    ],
    correctOptionIndex: 1,
    explanation: 'If standards were mistakenly configured in user-level `~/.claude/CLAUDE.md`, they exist only on individual machines and are not pulled by new teammates via git.',
    trap: 'Options 1, 3, and 4 suggest tool bugs, but the issue is incorrect configuration scoping.'
  },
  {
    id: 'Q11.5',
    topicId: 11,
    domainId: 'D3',
    taskRef: 'Domain 2, Task 2.4; Domain 3, Task 3.1',
    question: 'A team needs to provide a shared GitHub integration for all developers. Where should this be configured?',
    options: [
      '~/.claude.json on each developer\'s machine',
      '.mcp.json in the project root with ${GITHUB_TOKEN} for authentication',
      '.claude/CLAUDE.md with instructions to use the GitHub API',
      'A custom slash command that wraps GitHub CLI calls'
    ],
    correctOptionIndex: 1,
    explanation: 'Project-level `.mcp.json` is committed to version control and shares MCP servers with the team. Using `${GITHUB_TOKEN}` references local environment variables without committing secrets.',
    trap: 'Option 1 requires manual recreation by every developer. Option 3 is instruction, not MCP configuration.'
  },

  // TOPIC 12
  {
    id: 'Q12.1',
    topicId: 12,
    domainId: 'D1',
    taskRef: 'Domain 1, Task 1.5; Domain 5, Task 5.1',
    question: 'An MCP tool returns order data with 40 fields, but the customer support agent only needs order_id, status, total, return_eligible, and customer_email. What is the best approach?',
    options: [
      'Add a prompt instruction: "Only pay attention to the relevant fields"',
      'Implement a PostToolUse hook that filters the response to only the 5 relevant fields before the model processes it',
      'Modify the MCP server to return fewer fields',
      'Use a smaller context window to force the model to ignore irrelevant data'
    ],
    correctOptionIndex: 1,
    explanation: 'A PostToolUse hook filters and trims the tool result payload before it enters model context, preventing token waste and attention degradation.',
    trap: 'Option 1 does not stop the 40 fields from consuming tokens. Option 3 assumes control over 3rd-party MCP servers.'
  },
  {
    id: 'Q12.2',
    topicId: 12,
    domainId: 'D1',
    taskRef: 'Domain 1, Task 1.5',
    question: 'Three different MCP tools return timestamps in different formats: Unix epoch (1703980800), ISO string ("2024-01-01T00:00:00Z"), and human-readable ("January 1, 2024"). The agent makes errors when comparing dates. What is the most reliable fix?',
    options: [
      'Add a system prompt instruction explaining all three formats',
      'Create a date-parsing utility tool the agent can call',
      'PostToolUse hook that normalizes all timestamps to ISO 8601 before model processing',
      'Train the model to handle multiple date formats'
    ],
    correctOptionIndex: 2,
    explanation: 'A PostToolUse hook deterministically parses and standardizes heterogeneous timestamp formats into ISO 8601 before the model consumes the result.',
    trap: 'Option 1 is probabilistic. Option 2 adds wasteful tool-calling round trips.'
  },
  {
    id: 'Q12.3',
    topicId: 12,
    domainId: 'D1',
    taskRef: 'Domain 1, Task 1.5',
    question: 'A code review hook runs after each file analysis and checks for specific patterns. It detects that the review flagged console.log in a test file where logging is intentionally used. What should the PostToolUse hook do?',
    options: [
      'Suppress all console.log findings',
      'Add context to the finding: mark it as occurring in a test file where logging may be intentional',
      'Override the model\'s finding and remove it from results',
      'Nothing — the model should handle test file exceptions on its own'
    ],
    correctOptionIndex: 1,
    explanation: 'PostToolUse hooks can annotate findings with context (e.g. test file flag) allowing downstream consumers to make nuanced decisions.',
    trap: 'Option 1 blindly suppresses real issues. Option 3 overrides rather than enriches.'
  },
  {
    id: 'Q12.4',
    topicId: 12,
    domainId: 'D1',
    taskRef: 'Domain 1, Tasks 1.4, 1.5',
    question: 'What is the primary difference between using a PostToolUse hook for enforcement vs. adding enforcement rules to CLAUDE.md?',
    options: [
      'PostToolUse hooks are faster; CLAUDE.md is slower',
      'PostToolUse hooks are deterministic (100%); CLAUDE.md instructions are probabilistic',
      'PostToolUse hooks modify the API call; CLAUDE.md modifies the model',
      'PostToolUse hooks are for security; CLAUDE.md is for formatting'
    ],
    correctOptionIndex: 1,
    explanation: 'PostToolUse hooks execute code with 100% deterministic reliability. CLAUDE.md instructions are probabilistic natural language prompts.',
    trap: 'Option 4 incorrectly categorizes them by topic rather than guarantee level.'
  },
  {
    id: 'Q12.5',
    topicId: 12,
    domainId: 'D1',
    taskRef: 'Domain 1, Task 1.5',
    question: 'A PostToolUse hook standardizes HTTP status codes returned by various MCP tools. Tool A returns "200" (string), Tool B returns 200 (integer), and Tool C returns "OK". What should the hook do?',
    options: [
      'Return all three formats to the model with explanations',
      'Normalize all to a consistent format: {"code": 200, "label": "OK"} before the model processes them',
      'Only fix Tool C since "OK" is the most ambiguous',
      'Log the inconsistency and alert the team'
    ],
    correctOptionIndex: 1,
    explanation: 'PostToolUse hooks normalize heterogeneous shapes into a consistent object representation across all tools.',
    trap: 'Option 1 retains format divergence and defeats the purpose of normalization.'
  },

  // TOPIC 13
  {
    id: 'Q13.1',
    topicId: 13,
    domainId: 'D2',
    taskRef: 'Domain 2, Task 2.5',
    question: 'A developer asks Claude to find all files that import a deprecated function called oldParser. Which built-in tool should Claude use?',
    options: [
      'Glob — to find files matching a pattern',
      'Grep — to search file contents for the import statement',
      'Read — to read each file and check for imports',
      'Edit — to find and replace the import'
    ],
    correctOptionIndex: 1,
    explanation: 'Grep searches file contents for patterns (such as `import { oldParser }`). Glob searches file names/paths.',
    trap: 'Option 1 is the most common exam trap: Glob matches paths and names, NOT code contents inside files.'
  },
  {
    id: 'Q13.2',
    topicId: 13,
    domainId: 'D2',
    taskRef: 'Domain 2, Task 2.5',
    question: 'A developer wants to find all TypeScript test files in the project. Which tool is correct?',
    options: [
      'Grep for "*.test.ts" across the codebase',
      'Glob with pattern **/*.test.ts',
      'Read the project\'s file listing',
      'Edit the project\'s tsconfig to list test files'
    ],
    correctOptionIndex: 1,
    explanation: 'Glob is designed for matching file paths and names against patterns like `**/*.test.ts`.',
    trap: 'Option 1 (Grep) would search inside files for the text string "*.test.ts".'
  },
  {
    id: 'Q13.3',
    topicId: 13,
    domainId: 'D2',
    taskRef: 'Domain 2, Task 2.5',
    question: 'What is the recommended exploration strategy for understanding an unfamiliar codebase?',
    options: [
      'Read every file from the root directory systematically',
      'Glob to find relevant files → Grep to find entry points/patterns → Read to follow imports and trace flows',
      'Grep the entire codebase for keywords → Read all matching files',
      'Ask the developer to explain the codebase first'
    ],
    correctOptionIndex: 1,
    explanation: 'Systematic exploration starts broad with Glob (file map), narrows with Grep (entry points/patterns), and deep-dives with Read on specific files.',
    trap: 'Option 1 exhausts context budget by reading everything upfront.'
  },
  {
    id: 'Q13.4',
    topicId: 13,
    domainId: 'D2',
    taskRef: 'Domain 2, Task 2.5',
    question: 'The Edit tool fails when trying to modify a section of code. What is the most likely cause and fix?',
    options: [
      'The file is read-only — change permissions',
      'The text match is not unique — the Edit tool requires a unique string match; fall back to Read + Write',
      'The file is too large for the Edit tool',
      'Edit doesn\'t support the file\'s programming language'
    ],
    correctOptionIndex: 1,
    explanation: 'Edit requires unique string matching. If the target snippet occurs multiple times, Edit fails. The standard fallback is Read the whole file and Write the updated file.',
    trap: 'Edit failures are almost always due to non-unique target strings, not permissions or file size.'
  },
  {
    id: 'Q13.5',
    topicId: 13,
    domainId: 'D2',
    taskRef: 'Domain 2, Task 2.5',
    question: 'A developer asks Claude to "find where the authentication middleware is configured." Claude uses Glob with **/auth*. This returns 50 files including auth utilities, auth tests, auth types, etc. What would be more effective?',
    options: [
      'Use Glob with a more specific pattern like **/middleware/auth*',
      'Use Grep to search for app.use(auth or middleware.register — content patterns that indicate middleware configuration',
      'Read all 50 files and filter manually',
      'Use Edit to search and highlight matches'
    ],
    correctOptionIndex: 1,
    explanation: 'Grep searches for functional syntax (`app.use(auth`, `useMiddleware`) inside file contents, finding the exact registration call regardless of filename.',
    trap: 'Option 1 still searches file paths, which cannot verify if middleware configuration code exists inside.'
  },

  // TOPIC 14
  {
    id: 'Q14.1',
    topicId: 14,
    domainId: 'D2',
    taskRef: 'Domain 2, Task 2.4',
    question: 'A team uses a shared Jira MCP server for project management. Where should it be configured?',
    options: [
      '~/.claude.json on each developer\'s machine',
      '.mcp.json in the project root with ${JIRA_TOKEN} for authentication',
      '.claude/CLAUDE.md with Jira API instructions',
      'A custom slash command that wraps the Jira CLI'
    ],
    correctOptionIndex: 1,
    explanation: 'Shared team tools live in project-level `.mcp.json` committed to VCS, using `${ENV_VAR}` expansion for security credentials.',
    trap: 'Option 1 requires every engineer to manually duplicate the config.'
  },
  {
    id: 'Q14.2',
    topicId: 14,
    domainId: 'D2',
    taskRef: 'Domain 2, Task 2.4',
    question: 'A developer is experimenting with a personal note-taking MCP server. Where should they configure it?',
    options: [
      '.mcp.json in the project root',
      '~/.claude.json in their home directory',
      '.claude/CLAUDE.md',
      'As an environment variable'
    ],
    correctOptionIndex: 1,
    explanation: 'Personal or experimental MCP servers belong in user-level `~/.claude.json`.',
    trap: 'Configuring personal experiments in `.mcp.json` commits them into the team repository.'
  },
  {
    id: 'Q14.3',
    topicId: 14,
    domainId: 'D2',
    taskRef: 'Domain 2, Task 2.4',
    question: 'A .mcp.json file contains "env": { "GITHUB_TOKEN": "${GITHUB_TOKEN}" }. What happens if the environment variable GITHUB_TOKEN is not set on a developer\'s machine?',
    options: [
      'The MCP server uses a default token',
      'The MCP server starts without authentication, potentially failing when calling authenticated endpoints',
      'Claude Code refuses to start',
      'The ${GITHUB_TOKEN} string is passed literally as the token value'
    ],
    correctOptionIndex: 1,
    explanation: 'Environment variable expansion resolves at runtime. If unset, it resolves to empty, causing authentication failures when calling authenticated endpoints.',
    trap: 'There is no automatic default secret or fallback token.'
  },
  {
    id: 'Q14.4',
    topicId: 14,
    domainId: 'D2',
    taskRef: 'Domain 2, Task 2.4',
    question: 'What is the primary benefit of MCP resources over MCP tools for exposing data catalogs (e.g., documentation hierarchies, database schemas)?',
    options: [
      'Resources are faster than tools',
      'Resources reduce exploratory tool calls by giving agents visibility into available data without needing to call tools to discover it',
      'Resources are more secure than tools',
      'Resources support real-time data; tools only support static data'
    ],
    correctOptionIndex: 1,
    explanation: 'MCP resources expose structured data catalogs directly to the host, eliminating wasteful exploratory tool calls.',
    trap: 'Tools are model-initiated actions; resources are application-provided data catalogs.'
  },
  {
    id: 'Q14.5',
    topicId: 14,
    domainId: 'D2',
    taskRef: 'Domain 2, Tasks 2.1, 2.4',
    question: 'Tools from multiple MCP servers are all available to the agent simultaneously. The agent consistently chooses the wrong tool when two servers expose similar functionality. What is the best fix?',
    options: [
      'Remove one of the conflicting MCP servers',
      'Improve the tool descriptions to clearly differentiate when each should be used',
      'Add a routing layer between the agent and the MCP servers',
      'Configure tool_choice to force a specific tool'
    ],
    correctOptionIndex: 1,
    explanation: 'Descriptions are the primary tool selection mechanism. Differentiating boundaries and specifying when NOT to use each tool resolves routing conflicts.',
    trap: 'Adding complex routing layers is unnecessary when descriptive boundaries solve tool selection.'
  },

  // TOPIC 15
  {
    id: 'Q15.1',
    topicId: 15,
    domainId: 'D5',
    taskRef: 'Domain 5, Task 5.4',
    question: 'After 2 hours of debugging, an agent starts saying "Based on typical error patterns..." instead of referencing the specific NullPointerException in UserService.java:142 that it found an hour ago. What is happening and how should it be fixed?',
    options: [
      'The model\'s knowledge has expired — restart with a fresh model',
      'Context degradation — persist key findings to scratchpad files and reference them for subsequent analysis',
      'The model is hallucinating — reduce temperature',
      'Switch to a larger context window model'
    ],
    correctOptionIndex: 1,
    explanation: 'Over long conversations, attention fades and the model reverts to generic "typical patterns". External scratchpad files persist specific facts across long sessions.',
    trap: 'Option 4 (larger context window) does NOT fix attention degradation across long histories.'
  },
  {
    id: 'Q15.2',
    topicId: 15,
    domainId: 'D5',
    taskRef: 'Domain 5, Task 5.1',
    question: 'An order lookup tool returns 40 fields per order. During a multi-issue support session, the context fills up rapidly. What is the best mitigation?',
    options: [
      'Summarize the conversation periodically',
      'Trim tool outputs to only relevant fields (e.g., order_id, status, return_eligible) before they accumulate in context',
      'Increase the context window size',
      'Limit the number of orders the agent can look up'
    ],
    correctOptionIndex: 1,
    explanation: 'Trimming outputs at the source prevents irrelevant fields from bloating the context window in the first place.',
    trap: 'Option 1 (summarizing later) is downstream and can drop key details; trimming at the source is superior.'
  },
  {
    id: 'Q15.3',
    topicId: 15,
    domainId: 'D5',
    taskRef: 'Domain 5, Task 5.1',
    question: 'What is the "lost in the middle" effect and how is it mitigated?',
    options: [
      'Models lose track of the conversation after too many turns — mitigated by shorter conversations',
      'Models attend well to the beginning and end of long inputs but may miss information in the middle — mitigated by placing key findings at the beginning and using explicit section headers',
      'Models lose context when switching between topics — mitigated by single-topic conversations',
      'Models forget tool results placed in the middle of the conversation — mitigated by repeating tool results'
    ],
    correctOptionIndex: 1,
    explanation: 'The lost-in-the-middle effect refers to weakened attention toward facts in the middle of long prompts. Mitigate by placing critical summaries early and using structured headers.',
    trap: 'Option 4 wastes tokens repeating data.'
  },
  {
    id: 'Q15.4',
    topicId: 15,
    domainId: 'D5',
    taskRef: 'Domain 5, Task 5.4',
    question: 'What does the /compact command do in Claude Code?',
    options: [
      'Compresses files in the project directory',
      'Reduces the current conversation context by summarizing it, freeing up context budget',
      'Removes all MCP server configurations',
      'Minifies code output for smaller file sizes'
    ],
    correctOptionIndex: 1,
    explanation: '`/compact` summarizes conversation context, freeing token budget without altering disk files.',
    trap: 'Option 1 confuses conversation context compaction with file compression.'
  },
  {
    id: 'Q15.5',
    topicId: 15,
    domainId: 'D5',
    taskRef: 'Domain 5, Tasks 5.1, 5.4',
    question: 'Which combination of strategies is MOST effective for managing a long, complex debugging session?',
    options: [
      'Larger context window + periodic summarization',
      'Scratchpad files for key findings + /compact for context reduction + subagent delegation for verbose exploration',
      'Shorter sessions + fresh starts each time',
      'Single large prompt with all information upfront'
    ],
    correctOptionIndex: 1,
    explanation: 'The standard three-pillar strategy: external scratchpad files (persistence), `/compact` (pruning context), and subagents (isolating discovery).',
    trap: 'Option 1 relies on larger context windows, which does not prevent attention dilution.'
  },

  // TOPIC 16
  {
    id: 'Q16.1',
    topicId: 16,
    domainId: 'D3',
    taskRef: 'Domain 3, Tasks 3.1, 3.5',
    question: 'A developer is discussing a bug and wants Claude to examine a specific file. What is the best way to bring that file into context?',
    options: [
      'Tell Claude the file path and ask it to read it',
      'Use an @ reference: @src/utils/parser.ts to pull the file directly into context',
      'Copy-paste the entire file content into the message',
      'Add the file path to CLAUDE.md'
    ],
    correctOptionIndex: 1,
    explanation: '`@path/file.ts` references in conversation inline the specified file on-demand in a single turn without extra tool calls or copy-pasting.',
    trap: 'Option 1 requires an extra tool-calling round trip. Option 4 adds a temporary file path permanently to CLAUDE.md.'
  },
  {
    id: 'Q16.2',
    topicId: 16,
    domainId: 'D3',
    taskRef: 'Domain 3, Task 3.1',
    question: 'A project\'s coding standards, architectural decisions, and testing conventions need to be available to Claude for every task across all sessions. Where should this be documented?',
    options: [
      'In @ references included in each conversation',
      'In project-level .claude/CLAUDE.md or root CLAUDE.md',
      'In inline descriptions at the start of each session',
      'In a separate documentation website'
    ],
    correctOptionIndex: 1,
    explanation: 'Project-level CLAUDE.md is automatically loaded in every session, making it the home for permanent, universal standards.',
    trap: 'Options 1 and 3 require manual repetition every single session.'
  },
  {
    id: 'Q16.3',
    topicId: 16,
    domainId: 'D3',
    taskRef: 'Domain 3, Task 3.5',
    question: 'A developer is working on a one-time data migration and needs to explain the source and target database schemas. This context is not relevant to any future tasks. What is the best approach?',
    options: [
      'Add the schemas to CLAUDE.md',
      'Create a custom command for the migration',
      'Provide the schemas as inline description directly in the conversation message',
      'Create a .claude/rules/migration.md file'
    ],
    correctOptionIndex: 2,
    explanation: 'Ephemeral, one-off context belongs in inline conversation messages. Adding temporary schemas to CLAUDE.md pollutes future sessions.',
    trap: 'Option 1 permanently pollutes project memory with temporary one-time schemas.'
  },
  {
    id: 'Q16.4',
    topicId: 16,
    domainId: 'D3',
    taskRef: 'Domain 3, Tasks 3.1, 3.5',
    question: 'When should a developer use @ references vs. CLAUDE.md vs. inline descriptions?',
    options: [
      '@ references for files, CLAUDE.md for instructions, inline for everything else',
      '@ references for specific files during conversation; CLAUDE.md for persistent universal project context; inline for one-off session-specific context',
      'All three are interchangeable — use whichever is most convenient',
      '@ references for small files, CLAUDE.md for large files, inline for code snippets'
    ],
    correctOptionIndex: 1,
    explanation: 'The decision is based on persistence (ephemeral vs universal) and scope (specific file reference vs project conventions).',
    trap: 'Option 4 misclassifies the choice by file size instead of lifecycle and scope.'
  },
  {
    id: 'Q16.5',
    topicId: 16,
    domainId: 'D3',
    taskRef: 'Domain 3, Task 3.6',
    question: 'For CI/CD-invoked Claude Code, how should project context (testing standards, review criteria, fixture conventions) be provided?',
    options: [
      'Through @ references in the CI script',
      'Through CLAUDE.md — it\'s the mechanism for providing project context to CI-invoked Claude Code',
      'Through environment variables in the CI pipeline',
      'Through command-line arguments to the Claude Code CLI'
    ],
    correctOptionIndex: 1,
    explanation: 'In headless CI pipelines, Claude Code automatically reads project CLAUDE.md for testing conventions and review standards.',
    trap: 'Environment variables are for credentials, not rich standards documentation.'
  },

  // TOPIC 17
  {
    id: 'Q17.1',
    topicId: 17,
    domainId: 'D5',
    taskRef: 'Domain 5, Task 5.1',
    question: 'A developer makes two consecutive API calls. In the second call, Claude doesn\'t remember anything from the first call. What is the issue?',
    options: [
      'A bug in the API — Claude should remember previous calls',
      'The API is stateless — the developer must include the full conversation history in every request',
      'The session token expired between calls',
      'Claude\'s memory feature needs to be enabled'
    ],
    correctOptionIndex: 1,
    explanation: 'The Anthropic Messages API is strictly stateless. There is no server-side conversation state. The caller must pass the entire conversation history in the `messages` array.',
    trap: 'Option 1 and 3 assume server-side session persistence exists in the API.'
  },
  {
    id: 'Q17.2',
    topicId: 17,
    domainId: 'D5',
    taskRef: 'Domain 5, Task 5.1',
    question: 'In a multi-turn customer support conversation, the agent "forgets" the customer\'s order number mentioned 10 turns ago. The conversation history is being sent with each request. What is the most likely issue?',
    options: [
      'The order number was lost during API transmission',
      'The conversation has grown so long that the order number falls in the "lost in the middle" zone of the context, or progressive summarization has dropped the numerical detail',
      'Claude can only remember information from the last 5 turns',
      'The order number format is not recognized by Claude'
    ],
    correctOptionIndex: 1,
    explanation: 'In long sessions, older turns enter the "lost in the middle" region or get compressed by summarization. Fix this by extracting exact IDs/dates into an unsummarized "case facts" block.',
    trap: 'There is no arbitrary 5-turn memory limit.'
  },
  {
    id: 'Q17.3',
    topicId: 17,
    domainId: 'D5',
    taskRef: 'Domain 5, Task 5.1',
    question: 'A customer support session handles three issues. The agent correctly handles issue 1, but by issue 3, it confuses details from issues 1 and 2. What is the recommended solution?',
    options: [
      'Handle only one issue per session',
      'Extract and persist structured issue data (order IDs, amounts, statuses) into a separate context layer for multi-issue sessions',
      'Increase the context window size',
      'Add a system prompt instruction: "Do not confuse details between issues"'
    ],
    correctOptionIndex: 1,
    explanation: 'Multi-issue sessions require structured issue data isolation (order IDs, amounts, item lists) in a persistent data layer outside the prose transcript.',
    trap: 'Option 4 uses a vague prompt instruction that cannot prevent attention cross-contamination.'
  },
  {
    id: 'Q17.4',
    topicId: 17,
    domainId: 'D5',
    taskRef: 'Domain 5, Task 5.1',
    question: 'Progressive summarization is used to manage a growing conversation. After summarization, the agent reports the correct refund outcome but uses the wrong refund amount ($47.99 instead of $49.99). What happened?',
    options: [
      'The model hallucinated the amount',
      'Progressive summarization lost the precise numerical value — numbers, dates, and percentages are vulnerable to summarization loss',
      'The refund tool returned the wrong amount',
      'The amount changed between turns'
    ],
    correctOptionIndex: 1,
    explanation: 'Progressive summarization frequently loses numerical precision. Keep critical financial amounts, dates, and IDs in a dedicated "case facts" block outside summarized text.',
    trap: 'This is not random hallucination — it is an architectural vulnerability of progressive summarization.'
  },
  {
    id: 'Q17.5',
    topicId: 17,
    domainId: 'D5',
    taskRef: 'Domain 5, Task 5.1',
    question: 'What is the recommended approach for preserving critical data across a long multi-turn conversation?',
    options: [
      'Repeat important information in every user message',
      'Extract critical facts (customer ID, order numbers, amounts, dates) into a structured "case facts" block that persists outside the summarized conversation history',
      'Use a database to store conversation state and query it each turn',
      'Keep conversations short and start new sessions for each topic'
    ],
    correctOptionIndex: 1,
    explanation: 'The "case facts" architecture maintains a structured block of ground-truth transactional facts that is never subjected to lossy summarization.',
    trap: 'Option 1 wastes tokens on arbitrary repetition.'
  },

  // TOPIC 18
  {
    id: 'Q18.1',
    topicId: 18,
    domainId: 'D5',
    taskRef: 'Domain 5, Task 5.2',
    question: 'A customer calls in extremely frustrated, using aggressive language, and demands their account be reviewed. The issue is a standard billing adjustment within the agent\'s capabilities. A sentiment analysis module rates the customer\'s frustration at 9/10. What should the agent do?',
    options: [
      'Escalate immediately because the sentiment score is very high',
      'Escalate because frustrated customers always need human attention',
      'Acknowledge the frustration, offer to resolve the billing adjustment since it\'s within the agent\'s capability',
      'Ask the customer to calm down before proceeding'
    ],
    correctOptionIndex: 2,
    explanation: 'Frustration alone is NOT an escalation trigger. If the customer hasn\'t explicitly demanded a human and the request is within capability, acknowledge frustration and offer resolution.',
    trap: 'Options 1 and 2 treat sentiment/frustration as an escalation trigger. Frustration ≠ complexity.'
  },
  {
    id: 'Q18.2',
    topicId: 18,
    domainId: 'D5',
    taskRef: 'Domain 5, Task 5.2',
    question: 'After the agent acknowledges the customer\'s frustration and offers to help with the billing adjustment, the customer says: "No, I really want to speak with a real person about this." What should the agent do now?',
    options: [
      'Continue trying to resolve the issue since it\'s simple',
      'Ask the customer why they want a human agent',
      'Escalate immediately — the customer has reiterated their preference for a human',
      'Offer one more attempt to resolve before escalating'
    ],
    correctOptionIndex: 2,
    explanation: 'Once a customer explicitly reiterates their preference for a human agent, the agent MUST escalate immediately.',
    trap: 'Option 1 and 4 argue or delay after an explicit human request.'
  },
  {
    id: 'Q18.3',
    topicId: 18,
    domainId: 'D5',
    taskRef: 'Domain 5, Task 5.2',
    question: 'A customer asks for a competitor price-match discount. The company\'s return policy mentions price adjustments for their own website but says nothing about competitor pricing. What should the agent do?',
    options: [
      'Deny the request since the policy doesn\'t explicitly allow it',
      'Apply the discount using the existing price adjustment mechanism',
      'Escalate because the policy is ambiguous/silent on competitor price matching',
      'Ask the customer to provide proof of the competitor\'s price'
    ],
    correctOptionIndex: 2,
    explanation: 'When policy is silent or ambiguous on an exception request, the agent must escalate rather than inventing policy interpretations.',
    trap: 'Option 1 assumes silence means prohibition, which can hurt customer relations; policy gaps require human judgment.'
  },
  {
    id: 'Q18.4',
    topicId: 18,
    domainId: 'D5',
    taskRef: 'Domain 5, Task 5.2',
    question: 'Which of the following is the LEAST reliable escalation trigger?',
    options: [
      'Customer explicitly requests a human agent',
      'Agent\'s self-reported confidence score drops below 60%',
      'Policy doesn\'t cover the customer\'s specific request',
      'Agent has made no progress after several attempts'
    ],
    correctOptionIndex: 1,
    explanation: 'Model self-reported confidence scores are poorly calibrated and unreliable. Legitimate triggers include explicit requests, policy gaps, and blocked progress.',
    trap: 'Self-reported confidence is explicitly cited in the exam guide as an unreliable escalation metric.'
  },
  {
    id: 'Q18.5',
    topicId: 18,
    domainId: 'D5',
    taskRef: 'Domain 5, Task 5.2',
    question: 'A CRM lookup returns three customer records with the same email but different names and account IDs. The customer is requesting a refund. What should the agent do?',
    options: [
      'Select the record with the most recent order activity',
      'Process the refund for all three accounts to ensure the correct one is covered',
      'Ask the customer for additional identifying information (account ID or full name) to determine the correct record',
      'Escalate to a human agent since multiple matches indicate a data quality issue'
    ],
    correctOptionIndex: 2,
    explanation: 'Ambiguity resolution pattern: ask the customer for clarifying identifiers (account ID, full name) to disambiguate. Never use heuristics (like most recent order).',
    trap: 'Option 1 uses heuristic selection, which can refund the wrong customer.'
  },

  // TOPIC 19
  {
    id: 'Q19.1',
    topicId: 19,
    domainId: 'D5',
    taskRef: 'Domain 5, Task 5.5',
    question: 'A data extraction system reports 97% overall accuracy. The team is ready to automate all extractions without human review. Is this appropriate?',
    options: [
      'Yes — 97% is excellent and safe to automate',
      'No — aggregate accuracy can mask poor performance on specific document types or fields; stratified accuracy by type and field must be checked first',
      'No — 97% is not high enough for automation',
      'Yes — but only if they add a random spot-check process'
    ],
    correctOptionIndex: 1,
    explanation: 'Aggregate accuracy can hide catastrophic failure rates (e.g. 70% accuracy on handwritten forms or 60% on line-item math). Stratified measurement across types and fields is mandatory.',
    trap: 'Option 1 falls for the aggregate accuracy trap.'
  },
  {
    id: 'Q19.2',
    topicId: 19,
    domainId: 'D5',
    taskRef: 'Domain 5, Task 5.5',
    question: 'A system extracts data from three document types: typed forms (99.5% accurate), scanned receipts (92% accurate), and handwritten notes (78% accurate). How should human review be routed?',
    options: [
      'All documents get human review since the average accuracy is only 90%',
      'Route by document type: auto-approve typed forms, random sample scanned receipts, full human review for handwritten notes',
      'All documents skip human review since the highest accuracy type is 99.5%',
      'Route all documents to human review until handwritten note accuracy improves'
    ],
    correctOptionIndex: 1,
    explanation: 'Stratified routing routes human effort where risk is highest: auto-approve high-accuracy typed forms, sample receipts, and fully review handwritten notes.',
    trap: 'Option 1 treats all document categories identically despite huge accuracy variance.'
  },
  {
    id: 'Q19.3',
    topicId: 19,
    domainId: 'D5',
    taskRef: 'Domain 5, Task 5.5',
    question: 'Why should high-confidence extractions still be sampled for human review?',
    options: [
      'To maintain human reviewers\' skills',
      'To detect novel error patterns that aggregate metrics miss and ensure confidence calibration remains accurate',
      'To meet regulatory compliance requirements',
      'To provide training data for model fine-tuning'
    ],
    correctOptionIndex: 1,
    explanation: 'Stratified sampling of high-confidence extractions detects novel edge-case errors that the model is wrongly confident about (miscalibration).',
    trap: 'Sampling is not busywork for reviewers; it monitors calibration and uncovers blind spots.'
  },
  {
    id: 'Q19.4',
    topicId: 19,
    domainId: 'D5',
    taskRef: 'Domain 5, Task 5.5',
    question: 'A model\'s field-level confidence scores show: company_name: 0.98, invoice_date: 0.95, line_items: 0.62, total_amount: 0.91. Which field should be flagged for human review?',
    options: [
      'All fields since no field has 100% confidence',
      'Only line_items (0.62) — it falls below a reasonable confidence threshold',
      'line_items and invoice_date — both have relatively lower scores',
      'None — all scores are above 50%'
    ],
    correctOptionIndex: 1,
    explanation: 'Field-level confidence enables targeted review of only the uncertain field (line_items at 0.62), saving human reviewers from re-checking 0.95+ fields.',
    trap: 'Option 1 forces review of all fields when only one is low-confidence.'
  },
  {
    id: 'Q19.5',
    topicId: 19,
    domainId: 'D5',
    taskRef: 'Domain 5, Task 5.5',
    question: 'Before deploying an automated extraction system, what validation should be performed?',
    options: [
      'Run the system on 100 random documents and check overall accuracy',
      'Validate accuracy by document type AND field segment using a labeled validation set, with stratified random sampling',
      'Verify that the model achieves >99% accuracy on a test set',
      'Confirm that the system can process documents faster than human reviewers'
    ],
    correctOptionIndex: 1,
    explanation: 'Validation must be stratified by document type AND field segment using ground-truth labeled validation sets.',
    trap: 'Option 1 is a naive unstratified test that masks segment weaknesses.'
  },

  // TOPIC 20
  {
    id: 'Q20.1',
    topicId: 20,
    domainId: 'D4',
    taskRef: 'Domain 4, Task 4.5',
    question: 'A CI pipeline runs a pre-merge code review that blocks the PR from merging until the review completes. Which API should be used?',
    options: [
      'Message Batches API for the 50% cost savings',
      'Synchronous Messages API because the pipeline requires immediate results to make a blocking decision',
      'Either API — it depends on budget',
      'Message Batches API with polling to check for results'
    ],
    correctOptionIndex: 1,
    explanation: 'Blocking workflows in CI pipelines cannot wait hours for results; they require the Synchronous Messages API.',
    trap: 'Option 1 falls for the 50% discount trap. Batches have no latency SLA (up to 24 hours), which would hang CI.'
  },
  {
    id: 'Q20.2',
    topicId: 20,
    domainId: 'D4',
    taskRef: 'Domain 4, Task 4.5',
    question: 'A team generates weekly tech debt reports for 200 repositories. The reports are reviewed Monday morning. Which API is most cost-effective?',
    options: [
      'Synchronous Messages API with parallel requests',
      'Message Batches API — non-blocking, 50% savings, results needed by Monday',
      'Synchronous API with rate limiting to reduce costs',
      'Manual review by engineers'
    ],
    correctOptionIndex: 1,
    explanation: 'Non-urgent volume workloads without immediate latency constraints are ideal for the Message Batches API (50% cost savings, 24h SLA).',
    trap: 'Option 1 unnecessarily pays full price for non-blocking weekend reports.'
  },
  {
    id: 'Q20.3',
    topicId: 20,
    domainId: 'D4',
    taskRef: 'Domain 4, Task 4.5',
    question: 'Which of the following is NOT supported by the Message Batches API?',
    options: [
      'Processing up to 10,000 requests per batch',
      'Multi-turn tool calling within a batch request',
      'Custom IDs for correlating results with requests',
      '50% cost reduction compared to synchronous API'
    ],
    correctOptionIndex: 1,
    explanation: 'The Message Batches API does NOT support multi-turn tool calling loops. Each batch item is a single-turn request.',
    trap: 'The lack of multi-turn tool calling in batches is a frequently tested architectural boundary.'
  },
  {
    id: 'Q20.4',
    topicId: 20,
    domainId: 'D4',
    taskRef: 'Domain 4, Task 4.5',
    question: 'A batch of 500 extraction requests is submitted. How are individual results correlated with their original requests?',
    options: [
      'By array position — results are returned in the same order',
      'By custom_id — each request includes a developer-assigned ID that appears in the result',
      'By timestamp — matching request and response times',
      'By content matching — comparing input and output text'
    ],
    correctOptionIndex: 1,
    explanation: 'Each batch request includes a developer-specified `custom_id` that is returned in the result object for deterministic correlation.',
    trap: 'Option 1 is dangerous: batch results are NOT guaranteed to return in input array order.'
  },
  {
    id: 'Q20.5',
    topicId: 20,
    domainId: 'D4',
    taskRef: 'Domain 4, Task 4.5',
    question: 'A real-time customer support chatbot needs to respond to users within seconds. Which API should it use?',
    options: [
      'Message Batches API with high priority',
      'Synchronous Messages API — real-time response required',
      'Message Batches API with small batch sizes for faster processing',
      'Either API with streaming enabled'
    ],
    correctOptionIndex: 1,
    explanation: 'Real-time interactive user interfaces require the Synchronous Messages API. Batches have no latency SLA.',
    trap: 'Option 1 invents a fictional "high priority" batch mode.'
  }
];
