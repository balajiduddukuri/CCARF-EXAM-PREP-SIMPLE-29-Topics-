import { PracticeQuestion } from '../types';

export const QUESTIONS_PART1: PracticeQuestion[] = [
  // TOPIC 1
  {
    id: 'Q1.1',
    topicId: 1,
    domainId: 'D1',
    taskRef: 'Domain 1, Task 1.1',
    question: "A development team's agentic loop occasionally continues executing tool calls even after Claude has provided its final answer to the user. What is the most likely cause?",
    options: [
      'The loop checks for stop_reason: "end_turn" but doesn\'t account for "max_tokens"',
      'The loop terminates based on parsing the assistant\'s text for phrases like "Here\'s your answer"',
      'The loop has an iteration cap set too high',
      'The model\'s temperature is set too high, causing unpredictable responses'
    ],
    correctOptionIndex: 1,
    explanation: 'Parsing natural language for termination signals is a known anti-pattern. Text content like "Here\'s your answer" is unreliable because the model may phrase its final response differently each time. The correct approach is to check stop_reason programmatically.',
    trap: 'Option 1 sounds technical and plausible but describes a different issue (truncation handling, not loop continuation). Option 3 is a distractor — iteration caps are secondary safeguards, not root causes of over-execution.'
  },
  {
    id: 'Q1.2',
    topicId: 1,
    domainId: 'D1',
    taskRef: 'Domain 1, Task 1.1',
    question: 'An agentic loop receives a response from Claude with stop_reason: "tool_use" and a text content block that says "Let me look that up for you." What should the loop do?',
    options: [
      'Display the text to the user and terminate the loop since the model produced a text response',
      'Execute the requested tool calls and continue the loop',
      'Display the text and wait for user confirmation before executing the tool',
      'Ignore the text and re-send the request since text and tool_use shouldn\'t appear together'
    ],
    correctOptionIndex: 1,
    explanation: 'Text content CAN appear alongside tool_use blocks — this is normal behavior. The stop_reason: "tool_use" is the authoritative signal that the model wants tools executed. The text is supplementary (e.g., informational message to the user).',
    trap: 'Option 1 is the classic trap — checking text content as a completion signal. Option 4 assumes text and tool_use are mutually exclusive, which is false.'
  },
  {
    id: 'Q1.3',
    topicId: 1,
    domainId: 'D1',
    taskRef: 'Domain 1, Task 1.1',
    question: 'A developer sets a maximum of 10 iterations for their agentic loop. On a complex task, the agent reaches the cap at iteration 10 while still mid-process. What is the correct assessment?',
    options: [
      'The cap is appropriate — it prevents infinite loops and should be the primary termination mechanism',
      'The cap should be raised to 50 to accommodate complex tasks',
      'Arbitrary iteration caps should be a secondary safeguard, not the primary termination mechanism — stop_reason should drive termination',
      'The developer should remove the cap entirely and rely solely on stop_reason'
    ],
    correctOptionIndex: 2,
    explanation: 'Iteration caps are valid as a safety net but should NOT be the primary mechanism. The loop should primarily check stop_reason: "end_turn" to terminate. Caps catch edge cases (infinite loops) but shouldn\'t interrupt normal multi-step operations.',
    trap: 'Option 4 sounds correct but removing caps entirely is risky — they serve as a secondary safeguard. Stop_reason is primary, caps are secondary.'
  },
  {
    id: 'Q1.4',
    topicId: 1,
    domainId: 'D1',
    taskRef: 'Domain 1, Task 1.1',
    question: 'Which stop_reason value indicates that Claude\'s response was cut off before the model finished generating?',
    options: [
      '"end_turn"',
      '"tool_use"',
      '"max_tokens"',
      '"truncated"'
    ],
    correctOptionIndex: 2,
    explanation: '"max_tokens" indicates the response was truncated because it hit the maximum token limit. This requires graceful handling — the response is incomplete. "end_turn" means normal finish.',
    trap: 'Option 4 ("truncated") sounds intuitive but is NOT a valid stop_reason value. Only "end_turn", "tool_use", and "max_tokens" are valid key values.'
  },
  {
    id: 'Q1.5',
    topicId: 1,
    domainId: 'D1',
    taskRef: 'Domain 1, Task 1.1',
    question: 'An agentic system processes customer requests. After calling a tool, the loop receives a response with stop_reason: "end_turn" and the assistant\'s text says "I need to check one more thing." What should the loop do?',
    options: [
      'Continue the loop since the text indicates the model wants to do more work',
      'Terminate the loop since stop_reason: "end_turn" is the authoritative signal',
      'Re-send the message to let the model call the tool it mentioned',
      'Log a warning and ask the user whether to continue'
    ],
    correctOptionIndex: 1,
    explanation: 'stop_reason is the authoritative signal for loop control. Even if the text suggests more work, "end_turn" means the model has concluded its turn. Parsing text to override stop_reason is an anti-pattern.',
    trap: 'Option 1 is tempting because the text says more work is needed. But text content must NEVER override the structured stop_reason signal.'
  },

  // TOPIC 2
  {
    id: 'Q2.1',
    topicId: 2,
    domainId: 'D1',
    taskRef: 'Domain 1, Task 1.4',
    question: 'A customer support agent escalates a case to a human agent. The human agent reports they "have no idea what\'s going on" despite the escalation including a message that says "Customer is having issues with their order." What went wrong?',
    options: [
      'The human agent wasn\'t trained on the escalation process',
      'The handoff lacked structured data — it should include customer ID, root cause, actions taken, and recommended next action',
      'The customer\'s issue was too complex for a handoff summary',
      'The system should have included the full conversation transcript instead'
    ],
    correctOptionIndex: 1,
    explanation: '"Customer is having issues with their order" is a vague, free-form handoff that gives the human agent nothing actionable. Structured handoff packages must include specific fields: customer ID, root cause analysis, actions already taken, amounts/statuses, and recommended next steps.',
    trap: 'Option 4 (full transcript) is too verbose for quick human review. A structured handoff package with labeled fields is the correct pattern.'
  },
  {
    id: 'Q2.2',
    topicId: 2,
    domainId: 'D1',
    taskRef: 'Domain 1, Task 1.2, 1.5',
    question: 'In a multi-agent system, Agent A completes a research task and hands off to Agent B for synthesis. Agent B produces a synthesis that contradicts several of Agent A\'s findings. What is the most likely cause?',
    options: [
      'Agent B\'s model is less capable than Agent A\'s',
      'Agent A\'s findings were not explicitly passed to Agent B — subagents have isolated context and do NOT inherit conversation history',
      'The synthesis task is too complex for a single agent',
      'Agent B\'s system prompt conflicts with Agent A\'s instructions'
    ],
    correctOptionIndex: 1,
    explanation: 'Subagents have isolated context — they do NOT automatically inherit the coordinator\'s or previous agent\'s conversation history. If findings aren\'t explicitly passed in the handoff, Agent B generates output without them.',
    trap: 'Assuming inherited conversation history across subagents is one of the most frequent architectural mistakes tested on the exam.'
  },
  {
    id: 'Q2.3',
    topicId: 2,
    domainId: 'D1',
    taskRef: 'Domain 1, Task 1.4',
    question: 'Which of the following is the BEST format for a handoff from a customer support agent to a human agent?',
    options: [
      'A paragraph summarizing the conversation in natural language',
      'The full conversation transcript with all tool call results',
      'A structured object with fields: customer_id, root_cause, actions_taken, refund_amount, recommended_action',
      'A bullet-point list of the customer\'s complaints'
    ],
    correctOptionIndex: 2,
    explanation: 'Structured handoff packages with specific, labeled fields ensure the receiving agent/human has immediate access to all critical information without parsing prose or transcripts.',
    trap: 'Option 1 (paragraph summary) easily omits key transactional fields. Option 2 is too noisy. Option 4 only captures customer complaints, not agent actions.'
  },
  {
    id: 'Q2.4',
    topicId: 2,
    domainId: 'D1',
    taskRef: 'Domain 1, Task 1.5',
    question: 'A coordinator spawns a research subagent. The coordinator\'s conversation includes detailed customer requirements gathered over 15 turns. The subagent receives only a one-line instruction: "Research cloud providers." The subagent returns irrelevant results. How should this be fixed?',
    options: [
      'Give the subagent access to the coordinator\'s full conversation history',
      'Use a larger context window for the subagent',
      'Pass goal-oriented context to the subagent: research goals, quality criteria, and specific requirements from the coordinator\'s conversation',
      'Replace the subagent with a direct tool call'
    ],
    correctOptionIndex: 2,
    explanation: 'Subagents need explicitly passed, goal-oriented context — not the full coordinator history. Distill the 15 turns of requirements into a focused prompt with clear goals, criteria, and constraints.',
    trap: 'Option 1 is both impossible (isolated context by design) and inefficient. Goal-oriented context distillation is the proper pattern.'
  },
  {
    id: 'Q2.5',
    topicId: 2,
    domainId: 'D1',
    taskRef: 'Domain 5, Task 5.1',
    question: 'When designing handoff context from upstream agents to downstream agents, which approach is recommended for agents with limited context budgets?',
    options: [
      'Pass the full reasoning chain so the downstream agent understands the process',
      'Return structured data: key facts, citations, and relevance scores',
      'Compress the response using summarization before passing',
      'Increase the downstream agent\'s context window'
    ],
    correctOptionIndex: 1,
    explanation: 'When downstream agents have limited context budgets, upstream agents should return structured data (key facts, citations, relevance scores) instead of verbose content and reasoning chains. This fixes the issue at the source.',
    trap: 'Option 3 (summarization) is a downstream workaround and can lose critical facts. Option 1 wastes context budget.'
  },

  // TOPIC 3
  {
    id: 'Q3.1',
    topicId: 3,
    domainId: 'D1',
    taskRef: 'Domain 1, Task 1.7',
    question: 'A developer was debugging an issue yesterday and wants to continue today. The codebase has NOT changed since yesterday. What is the best approach?',
    options: [
      'Start a fresh session and re-explain the problem from scratch',
      'Use --resume to continue the previous session',
      'Start a fresh session and inject a summary of yesterday\'s findings',
      'Fork the previous session to create a parallel exploration'
    ],
    correctOptionIndex: 1,
    explanation: 'When the codebase hasn\'t changed, the previous session\'s context (discovered findings, tool results, explored paths) is still valid. --resume efficiently continues from where you left off without re-exploration.',
    trap: 'Option 3 wastes time re-summarizing when the full context is valid. Option 4 is for branching alternatives, not straightforward continuation.'
  },
  {
    id: 'Q3.2',
    topicId: 3,
    domainId: 'D1',
    taskRef: 'Domain 1, Task 1.7',
    question: 'A developer was working on a refactoring task yesterday. Since then, three critical files have been modified by another teammate. What is the best approach to continue?',
    options: [
      'Use --resume and hope the model notices the file changes',
      'Start a new session with a structured summary of prior findings, noting which files have changed for targeted re-analysis',
      'Use --resume and inform the agent that "some files changed"',
      'Fork the previous session and re-read all changed files'
    ],
    correctOptionIndex: 1,
    explanation: 'When files have changed significantly since the last session, prior tool results are stale. Starting a fresh session with a structured summary prevents the model from relying on outdated file contents while preserving key findings.',
    trap: 'Option 1 and 3 will lead to hallucinated or stale code references because cached tool results inside the resumed session will contradict the disk.'
  },
  {
    id: 'Q3.3',
    topicId: 3,
    domainId: 'D1',
    taskRef: 'Domain 1, Task 1.7',
    question: 'A team wants to evaluate two different approaches to restructuring a module: Option A (extract service) and Option B (merge into monolith). What is the best session management technique?',
    options: [
      'Discuss both approaches sequentially in the same session',
      'Use fork_session to create independent branches from a shared baseline, exploring each approach in isolation',
      'Start two completely separate sessions from scratch',
      'Use plan mode to evaluate both approaches before committing to either'
    ],
    correctOptionIndex: 1,
    explanation: 'fork_session creates independent branches from a shared context baseline, perfect for comparing approaches without contaminating context between Option A and Option B.',
    trap: 'Option 1 causes context contamination where Option A details leak into and bias the Option B analysis.'
  },
  {
    id: 'Q3.4',
    topicId: 3,
    domainId: 'D1',
    taskRef: 'Domain 5, Task 5.4',
    question: 'After resuming a session, the agent starts referencing "typical patterns" instead of the specific class names and function signatures it discovered in the previous session. What is happening?',
    options: [
      'The resumed session has a bug in context loading',
      'Context degradation — the model\'s attention to earlier specific details has weakened over the growing conversation',
      'The model version has changed since the last session',
      'The session resume didn\'t include the previous tool results'
    ],
    correctOptionIndex: 1,
    explanation: 'Context degradation is a known phenomenon in long/resumed sessions. As conversation length grows, attention to specific details weakens, and the model tends to fall back to generic "typical patterns." Mitigate with scratchpad files or /compact.',
    trap: 'Options 1, 3, and 4 suggest system bugs, but attention degradation is an inherent property of attention over extended context.'
  },
  {
    id: 'Q3.5',
    topicId: 3,
    domainId: 'D1',
    taskRef: 'Domain 1, Task 1.7',
    question: 'When resuming a session after file changes, what information should be included in the structured summary injected into the new session?',
    options: [
      'The full text of all changed files',
      'A complete transcript of the previous session',
      'Key findings from the prior session, which files changed, and what aspects need re-analysis',
      'Only the list of changed file names'
    ],
    correctOptionIndex: 2,
    explanation: 'The structured summary should contain key prior findings, the specific changed files, and focused guidance on what needs targeted re-analysis.',
    trap: 'Option 1 wastes tokens on full text. Option 2 drags along stale transcript noise.'
  },

  // TOPIC 4
  {
    id: 'Q4.1',
    topicId: 4,
    domainId: 'D1',
    taskRef: 'Domain 1, Task 1.5',
    question: 'A coordinator is tasked with generating a comprehensive research report on "the impact of AI on creative industries." The final report covers visual arts and music but completely misses writing, film, and game design. What went wrong?',
    options: [
      'The subagents failed to find information on the missing topics',
      'The coordinator\'s task decomposition was too narrow — it didn\'t generate subtasks for writing, film, and game design',
      'The context window was too small to include all industries',
      'The model lacks knowledge about those creative industries'
    ],
    correctOptionIndex: 1,
    explanation: 'Missing coverage is a coordinator failure: overly narrow task decomposition. Subagents only execute what they are delegated.',
    trap: 'Option 1 blames the subagents, but subagents cannot execute tasks that the coordinator never created or assigned.'
  },
  {
    id: 'Q4.2',
    topicId: 4,
    domainId: 'D1',
    taskRef: 'Domain 1, Task 1.3',
    question: 'A team needs to migrate 45+ files from an old HTTP library to a new one. Which orchestration approach is most appropriate?',
    options: [
      'Single agent with a very large context window to process all files at once',
      'Prompt chaining with a fixed sequence: file 1 → file 2 → file 3 → ...',
      'Hybrid: dynamic planning phase to assess the migration scope, then chained execution per file',
      'Parallelization: process all 45 files independently and simultaneously'
    ],
    correctOptionIndex: 2,
    explanation: 'Complex multi-file migrations require a hybrid approach: dynamic planning to understand patterns and inter-file dependencies, followed by chained execution per file.',
    trap: 'Option 4 (pure parallelization) misses shared patterns and cross-file dependencies. Option 2 lacks upfront architecture planning.'
  },
  {
    id: 'Q4.3',
    topicId: 4,
    domainId: 'D1',
    taskRef: 'Domain 1, Tasks 1.3, 1.6',
    question: 'What is the key difference between fixed sequential decomposition (prompt chaining) and dynamic adaptive decomposition?',
    options: [
      'Fixed sequential is faster; dynamic is more accurate',
      'Fixed sequential follows predetermined steps; dynamic generates subtasks based on intermediate findings',
      'Fixed sequential uses one model; dynamic requires multiple models',
      'Fixed sequential is for small tasks; dynamic is for large tasks'
    ],
    correctOptionIndex: 1,
    explanation: 'Fixed sequential (prompt chaining) follows predetermined steps in code. Dynamic adaptive decomposition generates and alters subtasks at runtime based on intermediate discoveries.',
    trap: 'Option 4 incorrectly associates the choice with size rather than predictability. A large ETL pipeline uses chaining; an open-ended investigation uses dynamic decomposition.'
  },
  {
    id: 'Q4.4',
    topicId: 4,
    domainId: 'D1',
    taskRef: 'Domain 1, Task 1.6',
    question: 'A PR review of 14 files produces inconsistent results — flagging a pattern as problematic in one file while approving identical code elsewhere. What is the best solution?',
    options: [
      'Use a model with a larger context window to fit all 14 files',
      'Split into focused passes: per-file analysis for local issues, then a separate cross-file integration pass',
      'Require developers to submit smaller PRs of 3-4 files each',
      'Run three independent reviews and only flag issues appearing in at least two reviews'
    ],
    correctOptionIndex: 1,
    explanation: 'Inconsistency across large PRs stems from attention dilution. Two-pass review: per-file analysis for local patterns followed by a cross-file integration pass ensures consistent depth and catches cross-file issues.',
    trap: 'Option 1 (larger context) does not fix attention dilution. Option 4 (voting) suppresses detection of real bugs by demanding consensus.'
  },
  {
    id: 'Q4.5',
    topicId: 4,
    domainId: 'D1',
    taskRef: 'Domain 1, Task 1.3',
    question: 'A team is building a system to extract data from invoices. The document format is always the same: header, line items, totals. Which decomposition approach is most appropriate?',
    options: [
      'Dynamic adaptive decomposition with a coordinator',
      'Full autonomous agent',
      'Prompt chaining: extract header → extract line items → extract totals → validate',
      'Orchestrator-workers with specialized subagents per section'
    ],
    correctOptionIndex: 2,
    explanation: 'For predictable, uniform documents with predetermined structure, prompt chaining is the simplest and most robust architecture. Always choose the simplest architecture that fits.',
    trap: 'Options 1 and 4 add unnecessary multi-agent overhead for a predictable sequential workflow.'
  },

  // TOPIC 5
  {
    id: 'Q5.1',
    topicId: 5,
    domainId: 'D1',
    taskRef: 'Domain 1, Task 1.4, 1.5',
    question: 'A customer support agent occasionally processes refunds over $500 without manager approval, violating company policy. The team adds a prompt instruction: "Always get manager approval for refunds over $500." The violation rate drops from 15% to 8%. What should they do?',
    options: [
      'Add more emphasis to the prompt: "IMPORTANT: You MUST get manager approval"',
      'Add few-shot examples demonstrating the approval workflow',
      'Implement a PreToolUse hook that blocks process_refund calls when amount > $500 without prior approval',
      'Reduce the model temperature to make behavior more deterministic'
    ],
    correctOptionIndex: 2,
    explanation: 'An 8% violation rate on a financial compliance rule is unacceptable. Prompt instructions are probabilistic. A programmatic PreToolUse hook provides 100% deterministic enforcement by intercepting the tool call before execution.',
    trap: 'Options 1 and 2 are prompt tweaks that cannot guarantee 100% compliance. Critical financial and compliance rules demand programmatic hooks.'
  },
  {
    id: 'Q5.2',
    topicId: 5,
    domainId: 'D1',
    taskRef: 'Domain 1, Task 1.5; Domain 5, Task 5.1',
    question: 'A PostToolUse hook is applied to an order lookup tool that returns 40 fields. What is the primary benefit?',
    options: [
      'It speeds up the API call by reducing the request size',
      'It trims the response to only relevant fields (e.g., order status, refund eligibility) before the model processes it, preserving context budget',
      'It validates that the order exists before the model sees the result',
      'It adds error handling to the tool call'
    ],
    correctOptionIndex: 1,
    explanation: 'PostToolUse hooks intercept tool results after execution and before the model ingests them. Trimming 40 fields down to 5 relevant fields preserves the context window and prevents attention degradation.',
    trap: 'Option 1 is false because PostToolUse runs AFTER execution, not before the external API call.'
  },
  {
    id: 'Q5.3',
    topicId: 5,
    domainId: 'D1',
    taskRef: 'Domain 1, Task 1.5',
    question: 'What is the difference between PreToolUse hooks and PostToolUse hooks?',
    options: [
      'PreToolUse runs before the model generates the tool call; PostToolUse runs after the model generates it',
      'PreToolUse intercepts outgoing tool calls before execution; PostToolUse intercepts tool results after execution',
      'PreToolUse validates input parameters; PostToolUse validates output format',
      'PreToolUse is for security; PostToolUse is for performance'
    ],
    correctOptionIndex: 1,
    explanation: 'PreToolUse intercepts outgoing tool calls before they run on systems (can block or redirect). PostToolUse intercepts tool results after execution before the model sees them (can normalize, trim, or annotate).',
    trap: 'Option 1 claims PreToolUse runs before model generation — in reality, the model generates the tool_use call first, and PreToolUse intercepts it before code execution.'
  },
  {
    id: 'Q5.4',
    topicId: 5,
    domainId: 'D1',
    taskRef: 'Domain 1, Task 1.5',
    question: 'A team has three MCP tools that return dates in different formats: Unix timestamp, ISO 8601, and "MM/DD/YYYY". This causes the agent to make errors when comparing dates. What is the best solution?',
    options: [
      'Add a prompt instruction: "Always convert dates to ISO 8601 format"',
      'Implement a PostToolUse hook that normalizes all date formats to ISO 8601 before the model processes them',
      'Create a new date-conversion tool the agent can call',
      'Standardize the MCP server implementations to return the same format'
    ],
    correctOptionIndex: 1,
    explanation: 'A PostToolUse hook deterministically normalizes heterogeneous outputs before they enter model context, ensuring uniform ISO 8601 strings.',
    trap: 'Option 1 is probabilistic. Option 4 requires altering 3rd party MCP servers you may not control.'
  },
  {
    id: 'Q5.5',
    topicId: 5,
    domainId: 'D1',
    taskRef: 'Domain 1, Tasks 1.4, 1.5',
    question: 'Which of the following should use a hook (programmatic enforcement) rather than CLAUDE.md instructions?',
    options: [
      'Preferring TypeScript over JavaScript for new files',
      'Using camelCase for variable names',
      'Requiring identity verification before any account modification',
      'Adding JSDoc comments to public functions'
    ],
    correctOptionIndex: 2,
    explanation: 'Identity verification before modifying accounts is a strict security requirement that must NEVER fail (zero tolerance). It requires deterministic hook enforcement. Style preferences belong in CLAUDE.md.',
    trap: 'Options 1, 2, and 4 are soft conventions where occasional variance is acceptable.'
  },

  // TOPIC 6
  {
    id: 'Q6.1',
    topicId: 6,
    domainId: 'D1',
    taskRef: 'Domain 1, Task 1.1',
    question: 'In the agentic loop, after the model responds with stop_reason: "tool_use", the developer executes the tool. How should the tool result be sent back to Claude?',
    options: [
      'As a new system message with the tool output',
      'As a tool_result content block inside a role: "user" message, referencing the tool_use_id',
      'By appending the result to the original user message and re-sending',
      'As a role: "tool" message with the result'
    ],
    correctOptionIndex: 1,
    explanation: 'In the Anthropic Messages API, tool results are returned in a tool_result content block inside a role: "user" message, referencing the matching tool_use_id.',
    trap: 'Option 4 is a trap: there is NO role: "tool" in the Anthropic Messages API — it is always inside role: "user".'
  },
  {
    id: 'Q6.2',
    topicId: 6,
    domainId: 'D1',
    taskRef: 'Domain 1, Task 1.1',
    question: 'The model responds with two content blocks: a text block saying "I\'ll search for that" and a tool_use block requesting a search tool. The stop_reason is "tool_use". What is the correct interpretation?',
    options: [
      'The model is confused — text and tool_use shouldn\'t coexist; re-send the request',
      'Process the text block only since it came first',
      'Execute the tool call and continue the loop — stop_reason: "tool_use" is the authoritative signal',
      'Display the text and ask the user whether to proceed with the tool call'
    ],
    correctOptionIndex: 2,
    explanation: 'Text blocks and tool_use blocks regularly coexist. The stop_reason: "tool_use" is the authoritative control signal.',
    trap: 'Option 1 assumes text and tool calls are mutually exclusive (false). Stop_reason always governs loop continuation.'
  },
  {
    id: 'Q6.3',
    topicId: 6,
    domainId: 'D1',
    taskRef: 'Domain 1, Task 1.1',
    question: 'What happens when an agentic loop receives stop_reason: "max_tokens"?',
    options: [
      'The model has finished and the response is complete',
      'The response was truncated — the model hasn\'t finished generating its complete response',
      'The model ran out of input context space',
      'The API rate limit was reached'
    ],
    correctOptionIndex: 1,
    explanation: '"max_tokens" means generation reached the output token limit and was truncated midway. It requires graceful continuation handling.',
    trap: 'Option 1 confuses "max_tokens" with "end_turn". Truncated output must not be treated as a complete result.'
  },
  {
    id: 'Q6.4',
    topicId: 6,
    domainId: 'D1',
    taskRef: 'Domain 1, Task 1.1',
    question: 'In the standard agentic loop flow, what is the correct sequence?',
    options: [
      'User sends message → Claude calls tool → Developer sees result → Loop ends',
      'User sends message + tool definitions → Claude responds with tool_use → Developer executes tool and returns tool_result → Claude processes result → repeat until "end_turn"',
      'User sends message → Claude returns JSON → Developer parses and executes → Loop ends',
      'User sends message → Claude plans all tool calls → Developer executes all at once → Claude synthesizes'
    ],
    correctOptionIndex: 1,
    explanation: 'The loop is an iterative turn-by-turn process: send messages + definitions → receive tool_use → execute and return tool_result → Claude decides next action until end_turn.',
    trap: 'Option 4 assumes one-time batch execution, but agentic loops iteratively adapt tool calls based on intermediate findings.'
  },
  {
    id: 'Q6.5',
    topicId: 6,
    domainId: 'D1',
    taskRef: 'Domain 1, Task 1.1',
    question: 'A developer builds an agentic loop that terminates when stop_reason is anything other than "tool_use". Is this approach correct?',
    options: [
      'Yes — any non-tool_use stop_reason means the model is done',
      'No — it should only terminate on "end_turn"; "max_tokens" requires different handling (the response is incomplete)',
      'No — it should also check for "stop_sequence" as a termination signal',
      'No — it should continue the loop regardless of stop_reason until a maximum iteration count is reached'
    ],
    correctOptionIndex: 1,
    explanation: 'Terminating on any non-tool_use signal mishandles "max_tokens" by treating a truncated output as a completed turn.',
    trap: 'Option 1 ignores the difference between a successfully completed turn ("end_turn") and a truncated response ("max_tokens").'
  },

  // TOPIC 7
  {
    id: 'Q7.1',
    topicId: 7,
    domainId: 'D3',
    taskRef: 'Domain 3, Task 3.2',
    question: 'A team wants all developers to have access to a /deploy-check command that validates deployment readiness. Where should the command file be placed?',
    options: [
      '~/.claude/commands/deploy-check.md',
      '.claude/commands/deploy-check.md',
      '.claude/skills/deploy-check/SKILL.md',
      'CLAUDE.md with a "deploy-check" section'
    ],
    correctOptionIndex: 1,
    explanation: 'Project-scoped commands live in `.claude/commands/` inside the repository and are tracked in version control, making them available to all team members.',
    trap: 'Option 1 (`~/.claude/commands/`) is user-scoped and will not be shared with teammates.'
  },
  {
    id: 'Q7.2',
    topicId: 7,
    domainId: 'D3',
    taskRef: 'Domain 3, Task 3.2',
    question: 'A developer creates a personal shortcut command /my-review that applies their preferred review style. Where should this be stored?',
    options: [
      '.claude/commands/my-review.md',
      '~/.claude/commands/my-review.md',
      '.claude/rules/my-review.md',
      '.claude/CLAUDE.md'
    ],
    correctOptionIndex: 1,
    explanation: 'Personal slash commands belong in the user home directory: `~/.claude/commands/`. They do not pollute the shared team repository.',
    trap: 'Option 1 would commit personal shortcuts to version control, imposing them on the entire engineering team.'
  },
  {
    id: 'Q7.3',
    topicId: 7,
    domainId: 'D3',
    taskRef: 'Domain 3, Task 3.2',
    question: 'A skill is defined with the frontmatter context: fork. What does this mean?',
    options: [
      'The skill creates a copy of the current codebase in a separate branch',
      'The skill\'s execution output is isolated from the main conversation context',
      'The skill runs in a separate process for performance',
      'The skill can be used by multiple users simultaneously'
    ],
    correctOptionIndex: 1,
    explanation: '`context: fork` isolates the skill output from the main conversation context, preventing verbose intermediate exploration from bloating context.',
    trap: 'Option 1 confuses conversation context forking with Git branch forking.'
  },
  {
    id: 'Q7.4',
    topicId: 7,
    domainId: 'D3',
    taskRef: 'Domain 3, Task 3.2',
    question: 'What is the difference between a custom slash command and a skill in Claude Code?',
    options: [
      'Commands are for team use; skills are personal only',
      'Commands are simple templates; skills support richer configuration via SKILL.md frontmatter (like context, allowed-tools, argument-hint)',
      'Commands run automatically; skills must be invoked',
      'Commands modify files; skills only read files'
    ],
    correctOptionIndex: 1,
    explanation: 'Both can be project or user-scoped. Skills support rich YAML frontmatter configuration (context: fork, allowed-tools, argument-hint) in SKILL.md files.',
    trap: 'Option 1 reverses or misidentifies scopes. Both commands and skills can be scoped at either user or project level.'
  },
  {
    id: 'Q7.5',
    topicId: 7,
    domainId: 'D3',
    taskRef: 'Domain 3, Task 3.2',
    question: 'A command frontmatter includes allowed-tools: ["Read", "Grep"]. What is the effect?',
    options: [
      'The command can only be run if the user has Read and Grep permissions',
      'During the command\'s execution, only Read and Grep tools are available — all other tools are restricted',
      'Read and Grep are added as additional tools for the command',
      'The command automatically calls Read and Grep before executing'
    ],
    correctOptionIndex: 1,
    explanation: '`allowed-tools` restricts which tools are exposed to Claude while the command or skill is running, limiting capabilities to safe actions.',
    trap: 'Option 3 is wrong because allowed-tools is restrictive, not additive.'
  },

  // TOPIC 8
  {
    id: 'Q8.1',
    topicId: 8,
    domainId: 'D3',
    taskRef: 'Domain 3, Task 3.5',
    question: 'A developer gives Claude the instruction: "Generate a data migration script that handles edge cases gracefully." The output misses several critical edge cases (null values, duplicate keys, empty arrays). What is the most effective fix?',
    options: [
      'Add "IMPORTANT: Handle ALL edge cases" to the prompt',
      'Provide 2-3 concrete input/output examples showing specific edge cases: null values → default, duplicates → merge, empty arrays → skip',
      'Increase the model temperature for more creative problem-solving',
      'Switch to a larger model with better reasoning capabilities'
    ],
    correctOptionIndex: 1,
    explanation: 'Concrete input/output examples are the single most effective prompt refinement technique for eliminating ambiguity in edge cases and output formats.',
    trap: 'Option 1 uses repetitive emphasis, which does not define the actual expected behavior for nulls or duplicate keys.'
  },
  {
    id: 'Q8.2',
    topicId: 8,
    domainId: 'D3',
    taskRef: 'Domain 3, Task 3.5',
    question: 'When should a developer use the "interview pattern" with Claude Code?',
    options: [
      'When the task requires processing multiple files in sequence',
      'When the developer wants Claude to ask clarifying questions before implementing, surfacing considerations the developer may not have anticipated',
      'When the project requires approval workflows',
      'When working with unfamiliar programming languages'
    ],
    correctOptionIndex: 1,
    explanation: 'The interview pattern instructs Claude to probe with clarifying questions prior to generating code, surfacing subtle edge cases (e.g. cache invalidation, failure modes).',
    trap: 'Option 4 assumes the interview pattern is for unfamiliar syntax, whereas it is actually an architectural requirements elicitation technique.'
  },
  {
    id: 'Q8.3',
    topicId: 8,
    domainId: 'D3',
    taskRef: 'Domain 3, Task 3.5',
    question: 'A developer is iterating on a data transformation function. They find three independent bugs: an off-by-one error, a missing null check, and an incorrect sort order. How should they communicate these to Claude?',
    options: [
      'Send all three in a single detailed message since they interact with each other',
      'Send each bug fix request sequentially in separate messages since the bugs are independent',
      'Create three separate sessions, one for each bug',
      'Use plan mode to fix all three simultaneously'
    ],
    correctOptionIndex: 1,
    explanation: 'When bugs are independent, addressing them sequentially gives focused attention to each fix without cross-contamination. Interacting bugs should be bundled together.',
    trap: 'Option 1 mistakenly bundles independent bugs together. Bundling is only advised when fixes directly interact with one another.'
  },
  {
    id: 'Q8.4',
    topicId: 8,
    domainId: 'D3',
    taskRef: 'Domain 3, Task 3.5',
    question: 'A developer wants Claude to generate a specific JSON output format but keeps getting inconsistent structures. What is the MOST effective approach?',
    options: [
      'Write detailed prose describing each field and its type',
      'Provide 2-3 concrete examples showing the exact desired JSON structure with realistic data',
      'Tell Claude to "use standard JSON formatting"',
      'Provide a JSON schema definition'
    ],
    correctOptionIndex: 1,
    explanation: 'In conversational iterative refinement, providing 2-3 concrete examples demonstrates exact keys, nesting, and formatting without prose ambiguity.',
    trap: 'Option 1 (prose) is the cause of the inconsistency. Concrete examples provide definitive structural grounding.'
  },
  {
    id: 'Q8.5',
    topicId: 8,
    domainId: 'D3',
    taskRef: 'Domain 3, Task 3.5',
    question: 'What is the "test-driven iteration" approach in Claude Code?',
    options: [
      'Writing tests after Claude generates code to verify correctness',
      'Writing tests first, sharing test failures with Claude, and iterating until all tests pass',
      'Having Claude generate both tests and implementation simultaneously',
      'Using a test framework to benchmark Claude\'s output quality'
    ],
    correctOptionIndex: 1,
    explanation: 'Test-driven iteration requires writing tests first, providing failing test logs to Claude, and iterating on code changes until all tests pass.',
    trap: 'Option 1 is traditional post-hoc testing, which does not use test suites as iterative specifications.'
  },

  // TOPIC 9
  {
    id: 'Q9.1',
    topicId: 9,
    domainId: 'D3',
    taskRef: 'Domain 3, Task 3.4',
    question: 'A developer needs to restructure a monolithic application into three microservices. Which approach should they use?',
    options: [
      'Direct execution — start coding immediately for faster results',
      'Plan mode — explore the architecture, identify boundaries, and plan the migration strategy before making changes',
      'A single prompt chaining workflow with predetermined steps',
      'Direct execution with a detailed CLAUDE.md providing step-by-step instructions'
    ],
    correctOptionIndex: 1,
    explanation: 'Monolith-to-microservices involves architectural ambiguity and multiple valid paths. Plan mode enables exploration, trade-off evaluation, and strategy formation before editing files.',
    trap: 'Option 1 (direct execution) causes costly rework when boundary decisions prove flawed mid-implementation.'
  },
  {
    id: 'Q9.2',
    topicId: 9,
    domainId: 'D3',
    taskRef: 'Domain 3, Task 3.4',
    question: 'A developer has a clear stack trace showing a null pointer exception in a single function. Which approach should they use?',
    options: [
      'Plan mode to investigate potential root causes across the codebase',
      'Direct execution — the issue is well-scoped and the fix location is clear',
      'Create a multi-agent system to analyze the error from multiple angles',
      'Use the Explore subagent to understand the function\'s context first'
    ],
    correctOptionIndex: 1,
    explanation: 'A well-scoped, isolated bug with a clear stack trace should use Direct Execution. Plan mode introduces unnecessary overhead for straightforward fixes.',
    trap: 'Option 1 adds planning friction to a well-understood, single-file bug fix.'
  },
  {
    id: 'Q9.3',
    topicId: 9,
    domainId: 'D3',
    taskRef: 'Domain 3, Task 3.4',
    question: 'When is the Explore subagent most useful?',
    options: [
      'When generating new code from specifications',
      'When running tests to verify changes',
      'When performing verbose discovery that would pollute the main conversation context',
      'When deploying to production environments'
    ],
    correctOptionIndex: 2,
    explanation: 'The Explore subagent isolates verbose exploration (reading many files, deep dependency tracing) and returns concise summaries to preserve main conversation context.',
    trap: 'Explore subagent is for discovery isolation, not code generation or test execution.'
  },
  {
    id: 'Q9.4',
    topicId: 9,
    domainId: 'D3',
    taskRef: 'Domain 3, Task 3.4',
    question: 'A team is evaluating whether to use REST or GraphQL for a new API. Multiple valid approaches exist with different tradeoffs. Which mode should be used?',
    options: [
      'Direct execution — just pick REST and start building',
      'Plan mode — explore both options, compare tradeoffs, and make an informed architectural decision before implementation',
      'Create two separate sessions and build both simultaneously',
      'Use CLAUDE.md to specify which approach to use'
    ],
    correctOptionIndex: 1,
    explanation: 'When multiple valid approaches exist with trade-offs, Plan Mode facilitates comparative analysis prior to coding.',
    trap: 'Option 1 bypasses critical architectural evaluation.'
  },
  {
    id: 'Q9.5',
    topicId: 9,
    domainId: 'D3',
    taskRef: 'Domain 3, Task 3.4',
    question: 'A multi-phase task requires: (1) understanding the legacy codebase, (2) designing the new architecture, (3) implementing the changes. What is the recommended approach?',
    options: [
      'Direct execution through all three phases',
      'Plan mode for all three phases',
      'Plan mode for phases 1-2 (discovery and design), then direct execution for phase 3 (implementation)',
      'Three separate agents, one per phase'
    ],
    correctOptionIndex: 2,
    explanation: 'Hybrid workflow: use Plan Mode for investigation and design (phases 1-2), then switch to Direct Execution once implementation details are crystallized.',
    trap: 'Option 2 keeps plan mode active even for straightforward coding, slowing down execution.'
  },

  // TOPIC 10
  {
    id: 'Q10.1',
    topicId: 10,
    domainId: 'D3',
    taskRef: 'Domain 1, Tasks 1.4, 1.5; Domain 3, Task 3.1',
    question: 'A team requires that all database queries include a LIMIT clause to prevent runaway queries. The current prompt instruction is followed 90% of the time. How should they ensure 100% compliance?',
    options: [
      'Add the instruction to project-level CLAUDE.md with bold emphasis',
      'Add few-shot examples showing queries with LIMIT clauses',
      'Implement a PreToolUse hook that inspects outgoing SQL queries and rejects any without a LIMIT clause',
      'Set the model temperature to 0 for maximum determinism'
    ],
    correctOptionIndex: 2,
    explanation: 'A 90% compliance rate on a critical operational requirement is insufficient. A PreToolUse hook inspects outgoing SQL queries and programmatically rejects queries lacking LIMIT clauses (100% deterministic).',
    trap: 'Options 1 and 2 are prompt improvements that remain probabilistic.'
  },
  {
    id: 'Q10.2',
    topicId: 10,
    domainId: 'D3',
    taskRef: 'Domain 1, Task 1.5; Domain 3, Task 3.1',
    question: 'Which of the following is MOST appropriate for CLAUDE.md rather than a hook?',
    options: [
      'Blocking API calls to production endpoints during development',
      'Requiring approval for file deletions',
      'Preferring functional programming style over imperative',
      'Enforcing rate limits on external API calls'
    ],
    correctOptionIndex: 2,
    explanation: 'Stylistic preferences (functional vs imperative programming) are soft conventions where non-zero variation is harmless. They belong in CLAUDE.md. Security and operational gates require hooks.',
    trap: 'Options 1, 2, and 4 are critical boundaries that must never fail.'
  },
  {
    id: 'Q10.3',
    topicId: 10,
    domainId: 'D3',
    taskRef: 'Domain 1, Tasks 1.4, 1.5',
    question: 'A developer puts sensitive API rate limiting logic in CLAUDE.md: "Never call the payments API more than 3 times per session." In testing, Claude occasionally makes a 4th call. What is the correct fix?',
    options: [
      'Rewrite the CLAUDE.md instruction more clearly',
      'Add examples of sessions where the limit was respected',
      'Move this enforcement to a hook or code-level counter that blocks the 4th call programmatically',
      'Add the instruction to both system prompt and CLAUDE.md for redundancy'
    ],
    correctOptionIndex: 2,
    explanation: 'CLAUDE.md instructions are probabilistic. Strict operational rate limits require code-level tracking and programmatic hooks.',
    trap: 'Options 1, 2, and 4 keep the control inside probabilistic natural language instructions.'
  },
  {
    id: 'Q10.4',
    topicId: 10,
    domainId: 'D3',
    taskRef: 'Domain 1, Task 1.5',
    question: 'Which guarantee level does each mechanism provide?',
    options: [
      'Settings > CLAUDE.md > Hooks',
      'Hooks > Settings > CLAUDE.md',
      'Settings/Permissions = Hooks (deterministic) > CLAUDE.md (probabilistic)',
      'CLAUDE.md > Hooks > Settings'
    ],
    correctOptionIndex: 2,
    explanation: 'Settings, Permissions, and Hooks provide 100% deterministic code/system-level enforcement. CLAUDE.md instructions provide probabilistic guidance.',
    trap: 'Option 1 and 4 rank natural language instructions alongside code enforcement.'
  },
  {
    id: 'Q10.5',
    topicId: 10,
    domainId: 'D3',
    taskRef: 'Domain 1, Task 1.5; Domain 3, Task 3.1',
    question: 'A team needs to enforce four rules: (1) All tests must use Jest, (2) No direct database access from controllers, (3) PII must be masked in logs, (4) Use 2-space indentation. Which rules should be hooks vs CLAUDE.md?',
    options: [
      'All four should be hooks for maximum safety',
      'Hooks: PII masking, no direct DB access. CLAUDE.md: Jest preference, 2-space indentation',
      'Hooks: PII masking only. CLAUDE.md: everything else',
      'CLAUDE.md for all four since they\'re all coding conventions'
    ],
    correctOptionIndex: 1,
    explanation: 'PII masking (compliance/security) and architectural isolation (no direct DB from controllers) require deterministic hooks. Library preferences and indentation are conventions suited to CLAUDE.md.',
    trap: 'Option 1 creates unnecessary code overhead for indentation and testing preferences.'
  }
];
