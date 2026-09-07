import { TopicCodeSnippet } from '../types';

export const TOPIC_CODE_SNIPPETS_MAP: Record<number, TopicCodeSnippet> = {
  1: {
    title: 'Agentic Loop State Machine with stop_reason & Safeguards',
    language: 'typescript',
    caption: 'Primary loop completion is driven by stop_reason ("end_turn" vs "tool_use"). MAX_ITERATIONS serves as an emergency circuit breaker.',
    code: `import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();
const MAX_ITERATIONS = 10; // Secondary safety circuit breaker

async function runAgenticLoop(userPrompt: string, tools: Anthropic.Tool[]) {
  const messages: Anthropic.MessageParam[] = [{ role: 'user', content: userPrompt }];
  let iteration = 0;

  while (iteration < MAX_ITERATIONS) {
    iteration++;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      tools,
      messages,
    });

    // Append model assistant turn to messages
    messages.push({ role: 'assistant', content: response.content });

    // CRITICAL: Inspect structured stop_reason, NOT conversational text
    if (response.stop_reason === 'end_turn') {
      return response.content; // Normal completion
    }

    if (response.stop_reason === 'max_tokens') {
      // Token ceiling reached -> send continuation turn
      messages.push({ role: 'user', content: 'Continue where you left off.' });
      continue;
    }

    if (response.stop_reason === 'tool_use') {
      // Execute all tool calls concurrently
      const toolResults: Anthropic.ToolResultBlockParam[] = await Promise.all(
        response.content
          .filter((b): b is Anthropic.ToolUseBlock => b.type === 'tool_use')
          .map(async (toolCall) => {
            try {
              const output = await executeTool(toolCall.name, toolCall.input);
              return {
                type: 'tool_result',
                tool_use_id: toolCall.id, // Must match tool_use.id exactly
                content: JSON.stringify(output),
              };
            } catch (err: any) {
              return {
                type: 'tool_result',
                tool_use_id: toolCall.id,
                content: JSON.stringify({ error: err.message }),
                is_error: true,
              };
            }
          })
      );

      // Pass all tool results back in a single user message
      messages.push({ role: 'user', content: toolResults });
    }
  }

  throw new Error(\`Emergency halt: Max iteration limit (\${MAX_ITERATIONS}) reached.\`);
}`,
  },
  2: {
    title: 'Typed Structured Handoff Package for Agent Escalation',
    language: 'typescript',
    caption: 'Recipients do not inherit raw context transcripts. Handoffs must be packaged into typed summaries.',
    code: `export interface StructuredHandoffPackage {
  handoffId: string;
  timestamp: string;
  sourceAgentId: string;
  targetQueue: 'HUMAN_SUPERVISOR' | 'TIER2_SPECIALIST' | 'FRAUD_INVESTIGATION';
  customerId: string;
  summary: {
    rootCause: string;
    customerIntent: string;
    escalationTrigger: 'POLICY_LIMIT_EXCEEDED' | 'EXPLICIT_USER_REQUEST' | 'CONSECUTIVE_TOOL_ERRORS';
  };
  actionsTaken: Array<{
    toolName: string;
    status: 'SUCCESS' | 'FAILED';
    outputSummary: string;
  }>;
  currentState: {
    accountBalance: number;
    disputedChargeId: string;
    disputeAmountUSD: number;
  };
  recommendedNextSteps: string[];
}

export function buildHandoffPackage(context: AgentExecutionContext): StructuredHandoffPackage {
  return {
    handoffId: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    sourceAgentId: 'triage-support-v1',
    targetQueue: 'HUMAN_SUPERVISOR',
    customerId: context.user.id,
    summary: {
      rootCause: 'Promo discount expired but promised by marketing outreach',
      customerIntent: 'Requesting retroactive $75 invoice credit',
      escalationTrigger: 'POLICY_LIMIT_EXCEEDED', // Autonomous limit is $50
    },
    actionsTaken: [
      { toolName: 'fetch_billing_history', status: 'SUCCESS', outputSummary: 'Found invoice #8041 ($149.00)' },
      { toolName: 'verify_coupon_code', status: 'FAILED', outputSummary: 'Code SUMMER2026 marked expired' },
    ],
    currentState: {
      accountBalance: 149.00,
      disputedChargeId: 'INV-8041',
      disputeAmountUSD: 75.00,
    },
    recommendedNextSteps: [
      'Apply manual one-time goodwill courtesy credit for $75.00',
      'Notify customer with template CREDIT_APPROVED_V1',
    ],
  };
}`,
  },
  3: {
    title: 'Claude Code Session Resumption vs Fresh Branching Patterns',
    language: 'bash',
    caption: 'Resume valid context with --resume; start fresh with structured summary when codebase state has shifted.',
    code: `# 1. Resume existing session when prior tool context and files are still valid
claude --resume "session_abc123"

# 2. Quick continue: Resumes the most recent session in the current directory
claude --continue

# 3. CRITICAL ARCHITECT PATTERN: When git branches shift or tool outputs become stale:
# DO NOT resume. Start fresh and inject a structured key-value summary
claude -p "
Starting fresh session on branch 'feature/oauth2-pkce'.
Previous session findings:
- Auth provider requires code_challenge_method: S256
- Session tokens stored in encrypted httpOnly cookie
- Completed files: src/auth/pkce.ts, src/auth/cookie.ts
Current goal: Implement token refresh callback in src/auth/callback.ts
"

# 4. Forking Session: Explore alternative architecture without corrupting original state
claude --fork-session "session_abc123"`,
  },
  4: {
    title: 'Orchestrator-Workers Dynamic Subtask Decomposition',
    language: 'typescript',
    caption: 'Orchestrator analyzes objective, decomposes into subtasks, and runs worker subagents in isolated contexts.',
    code: `import Anthropic from '@anthropic-ai/sdk';
const anthropic = new Anthropic();

interface Subtask {
  id: string;
  targetModule: string;
  objective: string;
  requiredTools: string[];
}

// 1. Orchestrator decomposes high-level request into isolated subtasks
async function planSubtasks(overallGoal: string): Promise<Subtask[]> {
  const planResponse = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    tools: [{
      name: 'submit_decomposition_plan',
      description: 'Decomposes complex migration into parallel independent subtasks',
      input_schema: {
        type: 'object',
        properties: {
          subtasks: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                targetModule: { type: 'string' },
                objective: { type: 'string' },
                requiredTools: { type: 'array', items: { type: 'string' } },
              },
              required: ['id', 'targetModule', 'objective'],
            },
          },
        },
        required: ['subtasks'],
      },
    }],
    tool_choice: { type: 'tool', name: 'submit_decomposition_plan' },
    messages: [{ role: 'user', content: \`Analyze goal and decompose into subtasks: \${overallGoal}\` }],
  });

  const toolCall = planResponse.content.find((b): b is Anthropic.ToolUseBlock => b.type === 'tool_use');
  return (toolCall?.input as any).subtasks;
}

// 2. Worker subagents execute concurrently in isolated context windows
async function executeWorker(subtask: Subtask): Promise<string> {
  const workerRes = await anthropic.messages.create({
    model: 'claude-3-5-haiku-20241022', // Fast worker tier
    max_tokens: 2048,
    messages: [{ role: 'user', content: \`Execute subtask \${subtask.id}: \${subtask.objective} in \${subtask.targetModule}\` }],
  });
  return (workerRes.content[0] as Anthropic.TextBlock).text;
}

// 3. Parallel dispatch & aggregation
export async function runDecompositionPipeline(goal: string) {
  const subtasks = await planSubtasks(goal);
  const workerResults = await Promise.all(subtasks.map(executeWorker));
  return workerResults;
}`,
  },
  5: {
    title: 'PreToolUse & PostToolUse Programmatic Hooks Implementation',
    language: 'typescript',
    caption: 'PreToolUse enforces deterministic security gating; PostToolUse redacts PII and trims token bloat.',
    code: `interface ToolCall {
  name: string;
  input: Record<string, any>;
}

interface ToolExecutionResult {
  toolName: string;
  output: any;
  isError?: boolean;
}

// PRE-TOOL-USE HOOK: Deterministic security gating before tool runs
export async function preToolUseHook(toolCall: ToolCall): Promise<{ proceed: boolean; reason?: string }> {
  // 1. Guard destructive bash commands
  if (toolCall.name === 'execute_bash') {
    const cmd = toolCall.input.command || '';
    if (/\\brm\\s+-rf\\s+(\\/|~|\\.\\.)/i.test(cmd) || /\\b(mkfs|dd|chmod\\s+-R\\s+777)\\b/i.test(cmd)) {
      return { proceed: false, reason: 'SECURITY_BLOCK: Destructive disk/OS command detected' };
    }
  }

  // 2. Enforce read-only locks on production branch
  if (toolCall.name === 'write_file' && process.env.GIT_BRANCH === 'main') {
    return { proceed: false, reason: 'POLICY_BLOCK: Direct edits on main branch are forbidden' };
  }

  return { proceed: true };
}

// POST-TOOL-USE HOOK: Output sanitization, PII masking & token budget control
export async function postToolUseHook(result: ToolExecutionResult): Promise<ToolExecutionResult> {
  let stringified = typeof result.output === 'string' ? result.output : JSON.stringify(result.output);

  // 1. Deterministic PII Redaction
  stringified = stringified.replace(/\\b\\d{3}-\\d{2}-\\d{4}\\b/g, '[REDACTED_SSN]');
  stringified = stringified.replace(/\\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}\\b/gi, '[REDACTED_EMAIL]');

  // 2. Prevent context blowout: Truncate output exceeding 40KB
  const MAX_BYTES = 40 * 1024;
  if (Buffer.byteLength(stringified, 'utf8') > MAX_BYTES) {
    stringified = stringified.slice(0, MAX_BYTES) + '\\n... [OUTPUT_TRUNCATED_TO_PRESERVE_CONTEXT]';
  }

  return {
    ...result,
    output: stringified,
  };
}`,
  },
  6: {
    title: 'Anthropic Messages API Core Loop with Exact Type Matching',
    language: 'typescript',
    caption: 'Processes assistant responses, matches tool_result blocks by tool_use_id, and handles stop_reason values.',
    code: `import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

async function runCoreAgenticLoop(systemPrompt: string, userTask: string, tools: Anthropic.Tool[]) {
  const messages: Anthropic.MessageParam[] = [
    { role: 'user', content: userTask }
  ];

  while (true) {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      system: systemPrompt,
      tools,
      messages,
    });

    // 1. Assistant message must always be pushed to history
    messages.push({ role: 'assistant', content: message.content });

    // 2. Evaluate stop_reason enum
    switch (message.stop_reason) {
      case 'end_turn':
        return message.content; // Finished successfully

      case 'stop_sequence':
        return message.content; // Custom stop sequence reached

      case 'max_tokens':
        // Continuation turn
        messages.push({ role: 'user', content: 'Continue' });
        break;

      case 'tool_use': {
        const toolUseBlocks = message.content.filter(
          (b): b is Anthropic.ToolUseBlock => b.type === 'tool_use'
        );

        const toolResults: Anthropic.ToolResultBlockParam[] = await Promise.all(
          toolUseBlocks.map(async (block) => {
            const res = await dispatchToolExecution(block.name, block.input);
            return {
              type: 'tool_result' as const,
              tool_use_id: block.id, // MUST match block.id exactly
              content: typeof res === 'string' ? res : JSON.stringify(res),
            };
          })
        );

        // 3. Return results as role: 'user' containing ToolResultBlockParam items
        messages.push({ role: 'user', content: toolResults });
        break;
      }
    }
  }
}`,
  },
  7: {
    title: '.claude/commands/test-coverage.md (Project-Level Command)',
    language: 'markdown',
    caption: 'Project slash commands reside in .claude/commands/ and provide reusable workflows shared across Git.',
    code: `---
description: Runs Jest test suite with coverage and highlights untested edge cases
argument_schema:
  target_file:
    type: string
    description: Optional relative path to specific test file
---

Run the test suite with coverage report:
\`\`\`bash
npx jest --coverage --collectCoverageFrom="src/**/*.ts" $target_file
\`\`\`

Analyze the test output above:
1. Identify any branches, functions, or lines with less than 85% coverage.
2. For any uncovered error branches or boundary conditions, propose minimal test cases.
3. If all tests pass with >85% coverage, print a green summary table.

Scope: Project command stored at \`.claude/commands/test-coverage.md\`
Invoked via: \`/test-coverage target_file="src/auth/jwt.test.ts"\``,
  },
  8: {
    title: 'Automated Test-Driven Iterative Refinement Circuit',
    language: 'typescript',
    caption: 'Run test suite as objective oracle, capture exact failure diffs, and feed back for surgical repair.',
    code: `import { execSync } from 'child_process';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

// Iterative refinement: 1) Test verification, 2) Targeted error feedback, 3) Patching
async function iterativeCodeRefine(filePath: string, prompt: string, maxAttempts = 3) {
  let attempt = 0;

  while (attempt < maxAttempts) {
    attempt++;

    // 1. Run local test suite as ground-truth oracle
    try {
      execSync(\`npx jest --testPathPattern="\${filePath}"\`, { stdio: 'pipe' });
      console.log(\`Verification succeeded on attempt \${attempt}!\`);
      return true;
    } catch (testError: any) {
      const stderr = testError.stderr?.toString() || testError.stdout?.toString();

      // 2. Feed EXACT test failure diff back to Claude (no token-heavy generic chat)
      const repairResponse = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2048,
        messages: [
          {
            role: 'user',
            content: \`Unit test verification failed for \${filePath}.\\n\\nError Output:\\n\${stderr}\\n\\nPlease output ONLY the minimal surgical patch to fix the assertion failure.\`,
          },
        ],
      });

      // 3. Apply surgical patch and repeat loop
      applyCodePatch(filePath, repairResponse.content);
    }
  }

  throw new Error(\`Failed to pass tests after \${maxAttempts} iterative attempts.\`);
}`,
  },
  9: {
    title: 'Plan Mode vs Act Mode Switching in Claude Code',
    language: 'bash',
    caption: 'Plan mode is read-only exploration for multi-file architectural changes; Act mode is direct execution.',
    code: `# ==============================================================================
# 1. PLAN MODE (Shift + Tab or /plan): High ambiguity, large blast radius
# ==============================================================================
# Use for:
# - Migrating ORM from TypeORM to Prisma across 30+ entity models
# - Refactoring payment flow touchpoints across frontend + backend
# - Exploring unfamiliar repository architecture
claude
> /plan
# Claude switches to read-only tool access (Read, Grep, Glob)
# Explores codebase, builds dependency graph, outputs structured plan
# Prompts user: "Approve plan before making changes? [Y/n]"

# ==============================================================================
# 2. ACT MODE (Direct Execution): High clarity, localized blast radius
# ==============================================================================
# Use for:
# - Fixing typo or null pointer in src/utils/date.ts
# - Adding a single unit test case for an existing function
# - Well-scoped changes with clear specs
claude "Add missing validation for negative integers in src/math/calculator.ts"`,
  },
  10: {
    title: 'Deterministic (.claude/settings.json) vs Probabilistic (CLAUDE.md)',
    language: 'json',
    caption: 'Settings and hooks guarantee 100% hard compliance; CLAUDE.md guides reasoning probabilistically (~95%).',
    code: `// .claude/settings.json (DETERMINISTIC - 100% Hard Policy Enforcement)
{
  "permissions": {
    "allow": [
      "Bash:npm test*",
      "Bash:git status*",
      "Bash:git diff*"
    ],
    "deny": [
      "Bash:rm -rf *",
      "Bash:git push --force*",
      "Bash:curl * | sh",
      "Write:.env.production"
    ]
  },
  "hooks": {
    "pre_tool_use": "node scripts/security-audit-hook.js",
    "post_tool_use": "node scripts/auto-lint-hook.js"
  }
}

/*
  VERSUS CLAUDE.md (PROBABILISTIC - ~95% Guidance / Model Steering):
  - "Prefer functional React components with Tailwind CSS"
  - "Always write unit tests for exported helper functions"
  - "Follow TypeScript strict mode without 'any' types"
  Rule: Never rely on CLAUDE.md to prevent data loss or security breaches!
*/`,
  },
  11: {
    title: 'Claude Code Multi-Tier Configuration & Scoped Path Rules',
    language: 'markdown',
    caption: 'Scoped rules apply conditionally based on glob paths, avoiding global context bloat.',
    code: `Hierarchy Precedence:
1. Enterprise Managed Policies (IT Admin forced config)
2. Project Root: .claude/CLAUDE.md (Team conventions committed to Git)
3. User Home: ~/.claude/CLAUDE.md (Personal preferences across all repos)
4. Scoped Path Rules: .claude/rules/*.md (Glob conditional context)

Example: \`.claude/rules/database.md\`
---
paths:
  - "src/db/**/*.ts"
  - "prisma/schema.prisma"
---
# Database Architecture Rules (Injected ONLY when editing DB files):
1. All queries modifying >1 table must be wrapped in a transaction.
2. Read-only queries must specify explicit column projections (no SELECT *).
3. Migration files must include an idempotent down migration.`,
  },
  12: {
    title: 'PostToolUse Quality Hook: Automated ESLint & Format Interceptor',
    language: 'typescript',
    caption: 'Executes immediately after file edits to run Prettier & ESLint, feeding errors back into context.',
    code: `import { execSync } from 'child_process';

// Executed by host orchestrator immediately after Write/Edit tool completes
export function onPostFileEditHook(filePath: string): { success: boolean; toolFeedback?: string } {
  // Only target source files
  if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) {
    return { success: true };
  }

  try {
    // 1. Run automated prettier formatting silently
    execSync(\`npx prettier --write "\${filePath}"\`, { stdio: 'pipe' });

    // 2. Run deterministic ESLint check
    execSync(\`npx eslint "\${filePath}" --max-warnings=0\`, { stdio: 'pipe' });

    return { success: true };
  } catch (error: any) {
    const lintDiagnostics = error.stdout?.toString() || error.stderr?.toString();

    // 3. Return lint error directly as tool result so Claude fixes it immediately
    return {
      success: false,
      toolFeedback: \`AUTOMATED QUALITY HOOK FAILED on \${filePath}:\\n\${lintDiagnostics}\\nPlease modify the file to resolve all lint/type errors.\`,
    };
  }
}`,
  },
  13: {
    title: 'Glob -> Grep -> Read 3-Stage Token-Efficient Exploration Pattern',
    language: 'typescript',
    caption: 'Never dump full repositories. Funnel search: Glob (file tree) -> Grep (symbol) -> Read (line window).',
    code: `// ARCHITECT PATTERN: Systematic Funnel Exploration
// ❌ ANTI-PATTERN: Reading 50 full files or dumping directory trees (200k tokens)
// ✅ BEST PRACTICE: Glob (file tree) -> Grep (symbol location) -> Read (focused window)

async function locateAndInspectSymbol(symbolName: string) {
  // Stage 1: GLOB - Identify candidate file paths by pattern
  const candidateFiles = await callTool('Glob', {
    pattern: 'src/services/**/*.ts',
  }); // Returns: ['src/services/auth.ts', 'src/services/billing.ts']

  // Stage 2: GREP - Locate line number where symbol is declared or called
  const grepResults = await callTool('Grep', {
    pattern: \`class \${symbolName}|function \${symbolName}\`,
    path: 'src/services/',
  }); // Returns: 'src/services/auth.ts:142: export class TokenValidator {'

  // Stage 3: READ - Read only the focused 50-line window around target line
  const codeSection = await callTool('Read', {
    file_path: 'src/services/auth.ts',
    offset: 135,
    limit: 50,
  }); // Inspects lines 135-185 without loading 4,000 lines of unrelated auth logic
  
  return codeSection;
}`,
  },
  14: {
    title: 'Project-Scoped .mcp.json with Environment Variable Expansion',
    language: 'json',
    caption: 'Project MCP servers use ${ENV_VAR} expansion to avoid committing credentials into version control.',
    code: `{
  "mcpServers": {
    "enterprise-postgres": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres",
        "postgresql://\${DB_USER}:\${DB_PASSWORD}@\${DB_HOST}:5432/\${DB_NAME}"
      ],
      "env": {
        "DEBUG": "mcp:*"
      }
    },
    "team-github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "\${GITHUB_TOKEN}"
      }
    }
  }
}
/*
  EXAM ESSENTIALS:
  1. Project MCP configuration: \`.mcp.json\` or \`.claude/mcp.json\` committed to Git.
  2. NEVER commit raw credentials! Use \`\${ENV_VAR}\` expansion.
  3. Personal developer servers belong in \`~/.claude/mcp.json\` (User scope).
*/`,
  },
  15: {
    title: 'Context Compaction & Token Budget Monitoring',
    language: 'typescript',
    caption: 'Track active token consumption and trigger structured /compact directives before context rot sets in.',
    code: `interface ConversationTurn {
  role: 'user' | 'assistant';
  content: any;
  tokenEstimate: number;
}

export function manageContextBudget(
  history: ConversationTurn[],
  maxTokenThreshold = 140000 // e.g. 70% of 200k window
): { shouldCompact: boolean; compactPrompt?: string } {
  const currentTotal = history.reduce((acc, turn) => acc + turn.tokenEstimate, 0);

  if (currentTotal < maxTokenThreshold) {
    return { shouldCompact: false };
  }

  // Generate /compact directive: retain critical facts, wipe tool scratchpads
  return {
    shouldCompact: true,
    compactPrompt: \`
CONTEXT BUDGET EXCEEDED (\${currentTotal} tokens). Perform compaction:
1. Retain: Key architectural decisions, verified file paths, active TODOs, current blockers.
2. Discard: Verbose bash command outputs, raw JSON query returns, repetitive lint logs.
3. Replace prior 20 turns with a structured 500-word state snapshot.
    \`.trim(),
  };
}`,
  },
  16: {
    title: 'Context Delivery Channels: @ Reference vs CLAUDE.md vs Inline',
    language: 'bash',
    caption: 'Select channel by scope: @file for specific files, CLAUDE.md for permanent rules, inline for task specifics.',
    code: `# 1. On-Demand File Inclusion: Use @path/to/file for specific, task-relevant files
claude "Refactor the authentication middleware in @src/middleware/auth.ts to support OAuth2 Bearer tokens"

# 2. Permanent Project Conventions: Belongs in CLAUDE.md (loaded on every turn)
# .claude/CLAUDE.md:
# "All API endpoints must return { success: boolean, data?: T, error?: string }"
# "Use Vitest instead of Jest; run tests with 'npm run test:unit'"

# 3. Ephemeral / One-Off Constraints: Provide inline in current prompt
claude "Generate mock fixtures for invoice testing. Inline constraint: Use only EUR currency and customers from Germany."`,
  },
  17: {
    title: 'Stateless Messages Array Management & Tool Pair Guarantee',
    language: 'typescript',
    caption: 'API stores zero conversation memory. Caller must resend history and strictly pair tool_use with tool_result.',
    code: `import Anthropic from '@anthropic-ai/sdk';

// Anthropic API is completely STATELESS. The caller must store and resend history.
export function validateAndSanitizeMessages(
  history: Anthropic.MessageParam[]
): Anthropic.MessageParam[] {
  // Rule 1: Strict alternation (User -> Assistant -> User -> Assistant)
  // Rule 2: Every 'tool_use' block MUST have a corresponding 'tool_result' block

  const validated: Anthropic.MessageParam[] = [];

  for (let i = 0; i < history.length; i++) {
    const msg = history[i];

    if (msg.role === 'assistant' && Array.isArray(msg.content)) {
      const toolUseBlocks = msg.content.filter((b): b is Anthropic.ToolUseBlock => b.type === 'tool_use');

      if (toolUseBlocks.length > 0) {
        // Next message MUST exist and MUST be role: 'user' containing matching tool_result blocks
        const nextMsg = history[i + 1];
        if (!nextMsg || nextMsg.role !== 'user') {
          throw new Error(\`Orchestration error: Missing tool_result for tool_use IDs: \${toolUseBlocks.map(t => t.id).join(', ')}\`);
        }
      }
    }
    validated.push(msg);
  }

  return validated;
}`,
  },
  18: {
    title: 'Programmatic Escalation Evaluator with Objective Triggers',
    language: 'typescript',
    caption: 'Escalate based on explicit user requests, error loops, and transaction limits—never sentiment alone.',
    code: `interface SessionState {
  consecutiveToolFailures: number;
  transactionAmountUSD: number;
  userMessageText: string;
}

export function evaluateEscalation(state: SessionState): { shouldEscalate: boolean; triggerReason?: string } {
  // TRIGGER 1: Explicit human request by customer (deterministic keyword match)
  const humanKeywords = /\\b(human|agent|representative|supervisor|manager|person)\\b/i;
  if (humanKeywords.test(state.userMessageText)) {
    return { shouldEscalate: true, triggerReason: 'EXPLICIT_CUSTOMER_HUMAN_REQUEST' };
  }

  // TRIGGER 2: Loop / Failure detection (3 consecutive tool errors)
  if (state.consecutiveToolFailures >= 3) {
    return { shouldEscalate: true, triggerReason: 'CONSECUTIVE_TOOL_FAILURES_THRESHOLD' };
  }

  // TRIGGER 3: Financial blast radius ($1,000 threshold for autonomous actions)
  if (state.transactionAmountUSD > 1000) {
    return { shouldEscalate: true, triggerReason: 'TRANSACTION_EXCEEDS_AUTONOMOUS_LIMIT' };
  }

  // DO NOT escalate solely based on model sentiment or self-reported confidence!
  return { shouldEscalate: false };
}`,
  },
  19: {
    title: 'Extraction Confidence Calibration & Tiered Review Router',
    language: 'typescript',
    caption: 'Straight-through-processing for high-confidence items; route ambiguous items to specialized human queues.',
    code: `interface ExtractedContract {
  contractId: string;
  fieldConfidenceScores: Record<string, number>; // e.g. { indemnityCap: 0.88, terminationNotice: 0.99 }
  governingLaw: string;
}

export function routeExtractionForReview(doc: ExtractedContract): 'STRAIGHT_THROUGH' | 'LEGAL_QUEUE' | 'SENIOR_COUNSEL' {
  const scores = Object.values(doc.fieldConfidenceScores);
  const minScore = Math.min(...scores);
  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;

  // Straight-Through-Processing (STP): Zero human touch if all fields high confidence
  if (minScore >= 0.95 && avgScore >= 0.98) {
    return 'STRAIGHT_THROUGH';
  }

  // High-Risk / Ambiguous Clause: Route to senior legal queue
  if (doc.fieldConfidenceScores['indemnityCap'] < 0.90 || doc.governingLaw === 'Non-Standard') {
    return 'SENIOR_COUNSEL';
  }

  // Standard Human Verification Queue
  return 'LEGAL_QUEUE';
}`,
  },
  20: {
    title: 'Anthropic Message Batches API (50% Cost Discount Processing)',
    language: 'typescript',
    caption: 'Asynchronous batch processing provides a 50% discount on model tokens. Cannot run interactive tool loops.',
    code: `import Anthropic from '@anthropic-ai/sdk';
const anthropic = new Anthropic();

// 1. Submit asynchronous batch job (50% token discount, 24h completion window)
async function submitDocumentBatch(documents: Array<{ id: string; text: string }>) {
  const batch = await anthropic.messages.batches.create({
    requests: documents.map((doc) => ({
      custom_id: \`doc-audit-\${doc.id}\`,
      params: {
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [
          { role: 'user', content: \`Extract liability clauses from:\\n\${doc.text}\` },
        ],
      },
    })),
  });

  console.log(\`Batch submitted! ID: \${batch.id}, Status: \${batch.processing_status}\`);
  return batch.id;
}

// 2. Poll batch results (Batches do NOT support interactive multi-turn tool loops)
async function checkBatchResults(batchId: string) {
  const batch = await anthropic.messages.batches.retrieve(batchId);
  if (batch.processing_status === 'ended') {
    for await (const result of await anthropic.messages.batches.results(batchId)) {
      console.log(\`Custom ID: \${result.custom_id}, Result:\`, result.result);
    }
  }
}`,
  },
  21: {
    title: 'tool_choice Schema Enforcement for 100% Valid JSON Output',
    language: 'typescript',
    caption: 'Forcing a named tool via tool_choice guarantees 100% schema-compliant JSON without markdown wrappers.',
    code: `import Anthropic from '@anthropic-ai/sdk';
const anthropic = new Anthropic();

// ARCHITECT RULE: Never rely on prompt text ("Return only JSON").
// Use tool calling with tool_choice forced to the schema tool.

const auditSchemaTool: Anthropic.Tool = {
  name: 'record_financial_audit',
  description: 'Records structured financial audit extraction metrics',
  input_schema: {
    type: 'object',
    properties: {
      fiscalYear: { type: 'integer' },
      revenueUSD: { type: 'number' },
      ebitdaUSD: { type: 'number' },
      auditOpinion: { type: 'string', enum: ['UNQUALIFIED', 'QUALIFIED', 'ADVERSE', 'DISCLAIMER'] },
    },
    required: ['fiscalYear', 'revenueUSD', 'auditOpinion'],
  },
};

const response = await anthropic.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 1024,
  tools: [auditSchemaTool],
  // FORCES Claude to return payload inside tool_use.input
  tool_choice: { type: 'tool', name: 'record_financial_audit' },
  messages: [{ role: 'user', content: 'Extract audit findings from 10-K report...' }],
});

const toolBlock = response.content.find((b): b is Anthropic.ToolUseBlock => b.type === 'tool_use');
const structuredData = toolBlock!.input; // Guaranteed JSON matching schema`,
  },
  22: {
    title: 'Nullable JSON Schema to Prevent Hallucination on Absent Data',
    language: 'json',
    caption: 'Explicitly define fields as type: ["type", "null"] so the model has a valid way to represent absent data.',
    code: `{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "MedicalRecordExtraction",
  "type": "object",
  "properties": {
    "patientName": {
      "type": "string"
    },
    "diagnosisDate": {
      "type": "string",
      "format": "date"
    },
    "smokerPackYears": {
      "type": ["number", "null"],
      "description": "Number of pack-years if smoking history is noted; null if patient is non-smoker or history not documented."
    },
    "allergyNotes": {
      "type": ["string", "null"],
      "description": "Explicit allergy details; null if no allergies are documented in source."
    }
  },
  "required": ["patientName", "diagnosisDate", "smokerPackYears", "allergyNotes"]
}
/*
  KEY RULE: By making absent fields explicitly nullable (type: ["type", "null"]),
  the model has a valid syntactic channel to report absence, completely
  eliminating the incentive to hallucinate or fabricate values!
*/`,
  },
  23: {
    title: 'Comparing tool_choice Modes: "auto" vs "any" vs Specific Named Tool',
    language: 'typescript',
    caption: 'Use auto for general decisions, any when one of several tools must run, and specific tool for strict schemas.',
    code: `import Anthropic from '@anthropic-ai/sdk';

// MODE 1: auto (Default)
// Model decides freely whether to invoke a tool or respond with natural language text
const autoChoice: Anthropic.MessageCreateParams['tool_choice'] = { type: 'auto' };

// MODE 2: any
// FORCES model to call at least one tool from the tools array, but model chooses WHICH tool
// Perfect for multi-document triage (e.g. invoice vs purchase order vs credit memo)
const anyChoice: Anthropic.MessageCreateParams['tool_choice'] = { type: 'any' };

// MODE 3: tool (Specific Tool Forcing)
// FORCES model to call the specified named tool. Generates zero conversational preamble.
// Ideal for strict single-schema data extraction workflows.
const forcedNamedChoice: Anthropic.MessageCreateParams['tool_choice'] = {
  type: 'tool',
  name: 'extract_invoice_data',
};`,
  },
  24: {
    title: 'XML Delimiters + Negative Few-Shot Prompt Pattern',
    language: 'markdown',
    caption: 'Combine negative few-shot examples with XML tag delimiters to guard against injection and fabrication.',
    code: `You are a regulatory compliance extraction engine.
Analyze the source contract text contained within the <source_document> tags.

<negative_examples>
Example 1 (Absent field):
Document: "Vendor will deliver goods within 30 days of purchase order."
Output: { "delivery_sla_days": 30, "liquidated_damages_daily_usd": null }
Reasoning: Liquidated damages clause is absent; output must be null, NOT zero or fabricated estimate.
</negative_examples>

<normalization_rules>
- Dates: Normalize to ISO-8601 (YYYY-MM-DD)
- Currency: Convert abbreviations to ISO 4217 code (USD, EUR, GBP)
</normalization_rules>

<source_document>
\${rawContractText}
</source_document>

Extract fields using the 'submit_compliance_audit' tool.`,
  },
  25: {
    title: 'Evaluator-Optimizer Programmatic Retry Feedback Loop',
    language: 'typescript',
    caption: 'Validate extracted objects with schemas, returning exact validation diffs to Claude for Turn 2 correction.',
    code: `import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';

const InvoiceSchema = z.object({
  invoiceNumber: z.string().regex(/^INV-\\d{5}$/, 'Must match INV-XXXXX format'),
  subtotalUSD: z.number().positive(),
  taxUSD: z.number().nonnegative(),
  totalUSD: z.number().positive(),
}).refine(data => Math.abs((data.subtotalUSD + data.taxUSD) - data.totalUSD) < 0.01, {
  message: 'Cross-field validation failed: subtotal + tax must equal total',
});

async function extractWithValidationLoop(docText: string, anthropic: Anthropic) {
  const messages: Anthropic.MessageParam[] = [
    { role: 'user', content: \`Extract invoice metrics from:\\n\${docText}\` }
  ];

  for (let attempt = 1; attempt <= 2; attempt++) {
    const res = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages,
    });

    const parsed = JSON.parse((res.content[0] as Anthropic.TextBlock).text);
    const validation = InvoiceSchema.safeParse(parsed);

    if (validation.success) {
      return validation.data;
    }

    // Feed specific Zod validation error back to Claude for surgical Turn 2 correction
    messages.push({ role: 'assistant', content: res.content });
    messages.push({
      role: 'user',
      content: \`Validation failed: \${JSON.stringify(validation.error.issues)}.\\nPlease correct the fields and resubmit.\`,
    });
  }
}`,
  },
  26: {
    title: 'MCP Server Tool Error Casing: isError: true vs is_error: true',
    language: 'typescript',
    caption: 'CRITICAL: MCP JSON-RPC returns isError (camelCase); Anthropic Messages API returns is_error (snake_case).',
    code: `// MCP JSON-RPC Server Implementation (CamelCase: isError)
export function handleMcpQueryTool(query: string) {
  try {
    const results = executeDbQuery(query);

    // CRITICAL EXAM TRAP: Zero search results is VALID EMPTY DATA, NOT an error!
    if (results.length === 0) {
      return {
        isError: false, // NOT an error!
        content: [{ type: 'text', text: JSON.stringify({ count: 0, items: [] }) }],
      };
    }

    return { isError: false, content: [{ type: 'text', text: JSON.stringify(results) }] };
  } catch (dbErr: any) {
    // Return structured, actionable error category
    return {
      isError: true, // MCP uses isError (camelCase)
      content: [{ type: 'text', text: \`Database query failed: \${dbErr.message}\` }],
      error_category: dbErr.isTimeout ? 'TRANSIENT' : 'INVALID_SQL',
      retryable: dbErr.isTimeout ? true : false,
    };
  }
}

/*
  VERSUS Anthropic Messages API (SnakeCase: is_error):
  {
    "type": "tool_result",
    "tool_use_id": "toolu_01...",
    "content": "Database timeout after 5000ms",
    "is_error": true  <-- API uses snake_case
  }
*/`,
  },
  27: {
    title: 'Tool Definition with Explicit Positive & Negative Boundaries',
    language: 'json',
    caption: 'Prevent misrouting by explicitly stating positive use cases, input formats, and negative boundaries.',
    code: `{
  "name": "lookup_customer_by_corporate_email",
  "description": "Performs an exact, case-insensitive database lookup for corporate customer accounts using a corporate email address (e.g. user@company.com).\\n\\nWHEN TO USE:\\n- When customer provides a verified corporate email and requests account or subscription status.\\n\\nWHEN NOT TO USE (NEGATIVE BOUNDARIES):\\n- DO NOT use for consumer @gmail.com or @yahoo.com accounts; use 'lookup_consumer_account' instead.\\n- DO NOT use for searching by Customer ID or invoice number; use 'lookup_by_identifier' instead.\\n- DO NOT use for fuzzy name searching.\\n\\nRETURNS: JSON object with customerId, tier, and subscriptionStatus.",
  "input_schema": {
    "type": "object",
    "properties": {
      "corporateEmail": {
        "type": "string",
        "format": "email",
        "description": "Corporate domain email address. Must contain '@' and corporate domain."
      }
    },
    "required": ["corporateEmail"]
  }
}`,
  },
  28: {
    title: 'MCP Client Connection & Anthropic SDK Tools Integration',
    language: 'typescript',
    caption: 'Connects to an MCP server via Stdio transport, discovers registered tools, and maps them to Anthropic SDK format.',
    code: `import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import Anthropic from '@anthropic-ai/sdk';

// 1. Initialize MCP Client with Stdio transport
const transport = new StdioClientTransport({
  command: 'npx',
  args: ['-y', '@modelcontextprotocol/server-filesystem', '/allowed/workspace'],
});

const mcpClient = new Client({ name: 'enterprise-agent', version: '1.0.0' });
await mcpClient.connect(transport);

// 2. Discover MCP tools and map to Anthropic SDK format
const mcpToolsResult = await mcpClient.listTools();
const anthropicTools: Anthropic.Tool[] = mcpToolsResult.tools.map((t) => ({
  name: t.name,
  description: t.description || '',
  input_schema: t.inputSchema as Anthropic.Tool.InputSchema,
}));

// 3. Dispatch tool execution via MCP client
async function executeMcpTool(name: string, args: Record<string, any>) {
  const result = await mcpClient.callTool({ name, arguments: args });
  return result.content;
}`,
  },
  29: {
    title: 'Dynamic Turn-by-Turn tool_choice Mutation Pipeline',
    language: 'typescript',
    caption: 'Enforce prerequisite steps by forcing a tool in Turn 1, then switching to "auto" in Turn 2 for reasoning.',
    code: `import Anthropic from '@anthropic-ai/sdk';
const anthropic = new Anthropic();

// TURN 1: Force data retrieval prerequisite tool
const turn1Response = await anthropic.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 1024,
  tools: myToolsArray,
  // FORCED: Turn 1 must retrieve customer data before taking action
  tool_choice: { type: 'tool', name: 'fetch_customer_entitlements' },
  messages: [{ role: 'user', content: 'Customer requesting refund for order #9921' }],
});

// Execute fetch_customer_entitlements and get toolResult...

// TURN 2: Transition to 'auto' to allow model autonomous reasoning
const turn2Response = await anthropic.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 1024,
  tools: myToolsArray,
  // AUTO: Model inspects entitlements returned in Turn 1 and decides
  // whether to call 'process_refund', 'deny_refund', or ask user for info
  tool_choice: { type: 'auto' },
  messages: [
    ...priorMessages,
    { role: 'assistant', content: turn1Response.content },
    { role: 'user', content: [toolResult] },
  ],
});`,
  },
};
