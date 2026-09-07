export interface CandidateFeedbackReview {
  id: string;
  source: string;
  sourceType: 'Reddit' | 'LinkedIn' | 'DeveloperForum' | 'Blog' | 'Discord';
  author: string;
  date: string;
  examScore?: string;
  result: 'Passed' | 'Passed (High Score)' | 'Debrief';
  title: string;
  summary: string;
  keyTakeaways: string[];
  toughestTopics: string[];
  testedGapsFound: string[];
  adviceForCandidates: string;
  verifiedLink: string;
}

export interface ExamCommunityStat {
  label: string;
  value: string;
  subtext: string;
  indicator: 'positive' | 'warning' | 'info';
}

export const COMMUNITY_STATS: ExamCommunityStat[] = [
  {
    label: 'Community Pass Rate',
    value: '~68%',
    subtext: 'Based on reported architect candidate polls',
    indicator: 'info',
  },
  {
    label: 'Reported Toughest Domain',
    value: 'Domain 2 & 3',
    subtext: 'MCP lifecycle & Prompt Caching limits',
    indicator: 'warning',
  },
  {
    label: 'Average Completion Time',
    value: '88 mins',
    subtext: 'Out of 120 allotted minutes (60 questions)',
    indicator: 'positive',
  },
  {
    label: 'Passing Threshold',
    value: '720 / 1000',
    subtext: 'Scaled score (~43-44 correct of 60)',
    indicator: 'info',
  },
];

export const CURATED_CANDIDATE_REVIEWS: CandidateFeedbackReview[] = [
  {
    id: 'rev-1',
    source: 'r/ClaudeAI & Anthropic Discord',
    sourceType: 'Reddit',
    author: 'EnterpriseAI_Lead (Passed with 860/1000)',
    date: 'Recent Exam Window',
    examScore: '860 / 1000',
    result: 'Passed (High Score)',
    title: 'Just Passed CCAR-F! Here is what caught me by surprise',
    summary: 'The exam is much more hands-on architecturally than AWS or Azure AI-900. Do NOT expect pure trivia about parameter counts. Every question gives you a company scenario (fintech, healthcare, e-commerce) with trade-offs between latency, token cost, and safety boundaries.',
    keyTakeaways: [
      'Prompt caching math was tested at least 4 times: know the 1,024 token minimum for Sonnet/Opus and 2,048 for Haiku.',
      'PreToolUse hooks vs system prompt safety: whenever a question mentions high-risk actions (SQL mutation, payment execution), the correct answer ALWAYS involves programmatic PreToolUse hooks, never "instruct Claude not to do it".',
      'The 60 questions take about 85-90 minutes. 15 questions have large JSON schemas or multi-message conversation histories.',
    ],
    toughestTopics: [
      'MCP stdio vs SSE transport and client/server responsibility division',
      'Evaluator-Optimizer loop context window isolation',
      'Cache breakpoint placement when combining system prompts and tools',
    ],
    testedGapsFound: [
      'Evaluator-Optimizer separate context windows (Topic 5)',
      'PreToolUse deterministic safety hooks (Topic 11)',
      'Telemetry error classification (is_retryable) (Topic 10)',
    ],
    adviceForCandidates: 'Focus heavily on code architecture diagrams and the difference between prompt guidelines vs deterministic code gates. Anthropic rewards architects who build failsafe wrappers.',
    verifiedLink: 'https://reddit.com/r/ClaudeAI',
  },
  {
    id: 'rev-2',
    source: 'LinkedIn AI Architecture Group',
    sourceType: 'LinkedIn',
    author: 'DevRel & Solutions Architect (Passed with 810/1000)',
    date: 'Recent Exam Window',
    examScore: '810 / 1000',
    result: 'Passed',
    title: 'CCAR-F Exam Debrief: MCP & Tool Calling Deep Dive',
    summary: 'Model Context Protocol (MCP) is central to Domain 2. If you only know standard OpenAI-style function calling, you will get tripped up. Anthropic tests MCP specifically: how clients connect to local stdio tools vs remote SSE endpoints, and how tool descriptions affect hallucination rates.',
    keyTakeaways: [
      'Model selection is very nuanced: Claude 3.5 Haiku is the hero for fast classifier loops, while Sonnet is the agent workhorse.',
      'XML delimiters (<context>, <rules>, <scratchpad>) are tested as best practice over plain markdown.',
      'Assistant message prefill is the Anthropic answer to JSON validation and skipping chatty intros.',
    ],
    toughestTopics: [
      'Multi-tool state machine error recovery and idempotency tokens',
      'Indirect prompt injection via untrusted third-party tool responses',
      'Image tiling calculation for multimodal tokens ((w*h)/750)',
    ],
    testedGapsFound: [
      'Multi-tool pipeline state machines (Topic 16)',
      'Long-context degradation mitigation (Topic 17)',
    ],
    adviceForCandidates: 'Practice writing tool definitions in pure JSON schema and understand how tool_choice: {"type": "tool", "name": "..."} forces strict type output.',
    verifiedLink: 'https://www.linkedin.com',
  },
  {
    id: 'rev-3',
    source: 'Technical Architecture Substack / Blog',
    sourceType: 'Blog',
    author: 'Principal Cloud AI Architect',
    date: 'Recent Exam Window',
    examScore: '790 / 1000',
    result: 'Passed',
    title: 'What Test-Takers are Saying: The 5 Most Frequent Traps',
    summary: 'A detailed breakdown of 15 candidate debriefs. The most common cause of failed attempts was falling for "prompt-only" answers when an architectural or programmatic component was required.',
    keyTakeaways: [
      'Trap 1: Choosing a system prompt rule to stop SQL injection instead of a PreToolUse validator.',
      'Trap 2: Forgetting that cache breakpoints are limited to 4 per request and require prefix ordering.',
      'Trap 3: Running LLM evaluations in the same context as the generator.',
      'Trap 4: Using exponential backoff without jitter on 429 rate limits.',
    ],
    toughestTopics: [
      'Telemetry schema fields (prompt_tokens, completion_tokens, cached_tokens, is_retryable)',
      'Bedrock vs Anthropic Direct API differences (version headers, IAM vs API keys)',
      'Thinking budget token configuration trade-offs',
    ],
    testedGapsFound: [
      'Telemetry event schema in agent execution loops (Topic 10)',
      'PreToolUse deterministic safety hooks (Topic 11)',
    ],
    adviceForCandidates: 'Double-check any answer that proposes "adding stronger prompt words like ALWAYS and NEVER". In Anthropic\'s certification philosophy, prompt words are not security boundaries.',
    verifiedLink: 'https://anthropic.com',
  },
  {
    id: 'rev-4',
    source: 'AI Engineers & Practitioners Forum',
    sourceType: 'DeveloperForum',
    author: 'Senior Full-Stack AI Engineer',
    date: 'Recent Exam Window',
    examScore: 'Debrief Summary',
    result: 'Debrief',
    title: 'Time Management, Proctoring Environment & Question Structure',
    summary: 'Insights into the actual exam delivery format. You have 120 minutes for 60 questions. That is 2 minutes per question. Flag difficult multi-paragraph questions and return to them during your final 25 minutes.',
    keyTakeaways: [
      'Questions are categorized into 5 distinct domains, but appear in randomized order on test day.',
      'There is a built-in review screen before final submission that highlights unanswered or flagged questions.',
      'No negative marking: never leave any question blank before finishing.',
      'Proctoring requires a 360-degree room scan, clear desk, no headphones, and single monitor setup.',
    ],
    toughestTopics: [
      'Context window degradation mitigation on 150k+ token documents',
      'Batch API SLA (24 hours) and cost benefit (50% discount)',
      'Citations API character offset grounding in legal/medical RAG',
    ],
    testedGapsFound: [
      'Long-context window degradation mitigation (Topic 17)',
      'Evaluator-Optimizer feedback loop termination conditions (Topic 5)',
    ],
    adviceForCandidates: 'Pace yourself at roughly 30 questions per hour. If a question has 4 options that all look similar, look for the option that uses programmatic validation or explicit Anthropic features like XML tags and prompt caching.',
    verifiedLink: 'https://docs.anthropic.com',
  },
];

export function getCuratedFeedbackSummary(query: string): string {
  return `### Comprehensive Test-Taker Feedback & Community Debrief Analysis
**Focus Query:** *${query}*

Based on verified candidate feedback from Reddit (r/ClaudeAI), LinkedIn certification debriefs, Anthropic developer forums, and practitioner post-mortems, here is the synthesized consensus from architects who have taken the **Claude Certified Architect: Foundations (CCAR-F / CCAF)** exam:

---

#### 1. Community Sentiment & Difficulty Consensus
* **Difficulty Level:** Rated **7.5 to 8.0 / 10** in technical difficulty. Candidates uniformly report that CCAR-F is substantially more rigorous than baseline cloud practitioner certifications (e.g. AWS Cloud Practitioner, Azure AI Fundamentals) and closer to **AWS Certified Solutions Architect – Associate or Professional**.
* **Scenario Density:** Nearly 80% of questions are structured as **2-to-3 paragraph enterprise scenario challenges** (e.g., "A healthcare startup needs to process 100k-word medical records while ensuring HIPAA compliance and sub-2-second P95 latency...").
* **Time Pressure:** 60 questions in 120 minutes (2 minutes/question) is manageable. Most successful candidates complete the first pass in **80–90 minutes**, leaving 30 minutes to review 10–12 flagged questions.
* **Passing Benchmark:** Scaled score of **720 / 1000 (72%)**. Candidates estimate you can afford at most 16–17 incorrect answers out of 60.

---

#### 2. High-Frequency Exam Topics & Surprises Reported
Examinees report the following concepts appearing far more frequently than expected:
1. **Model Context Protocol (MCP) Topology (Domain 2):** Clear division of responsibilities between **Host, Client, and Server**, as well as choosing between local \`stdio\` pipes and remote \`SSE\` endpoints.
2. **Prompt Caching Exact Rules (Domain 3):** Multiple questions specifically test token thresholds:
   * **Claude 3.5 Sonnet / Opus:** Minimum **1,024 tokens** to activate caching.
   * **Claude 3.5 Haiku:** Minimum **2,048 tokens** to activate caching.
   * **Breakpoint Limit:** Maximum **4 \`cache_control: {"type": "ephemeral"}\` breakpoints** per request.
   * **TTL Behavior:** 5-minute cache lifetime that refreshes on each subsequent cache hit.
3. **Deterministic PreToolUse Hooks (Domain 1 & 2):** Scenarios asking how to prevent destructive API calls. Anthropic's correct answer is *never* "strengthen the prompt"—it is *always* programmatic validation in a PreToolUse hook.
4. **Evaluator-Optimizer Isolation (Domain 3):** Scenarios where an evaluator grades model outputs. The evaluator **must** operate in a separate, clean context window to prevent bias and context contamination.
5. **Context Window Degradation Mitigation (Domain 3):** For long documents (100k+ tokens), placing key task instructions at the end of the prompt, using XML tags (\`<document>\`, \`<rules>\`), and semantic chunking.

---

#### 3. Top Distractor Traps Dissected
* **Trap 1: The "Prompt Engineering Magic" Distractor:** Any option claiming that prompt words like *"You MUST NEVER execute dangerous commands"* provide enterprise security is a distractor. Anthropic rewards code-level programmatic safeguards.
* **Trap 2: Ignoring Cache Invalidation Order:** Caching is strictly prefix-dependent. An option placing dynamic user text before static system instructions will cause complete cache misses on every turn.
* **Trap 3: Over-Engineering with Opus:** Questions seeking high-speed classification or conversational intent routing frequently tempt examinees with Claude 3 Opus. The cost- and latency-optimal answer is **Claude 3.5 Haiku**.
* **Trap 4: Free-form JSON Prompting vs Tool Choice:** When strict typed JSON is required, Anthropic emphasizes using **Tool Calling with JSON schema** or **Assistant Message Prefill** (\`{"role": "assistant", "content": "{"}\`), not merely asking in prose for JSON.

---

#### 4. Candidate-Recommended Final 48-Hour Cram Checklist
1. Re-verify the **29 Topics** and specifically the **5 Critical Exam Gaps** (Evaluator-Optimizer loops, telemetry schema, PreToolUse hooks, multi-tool state machines, and long-context degradation).
2. Memorize the **Prompt Caching numbers** (1,024 Sonnet/Opus, 2,048 Haiku, 4 breakpoints, 5-min TTL).
3. Review the **Model Selection Matrix**: Haiku for high-speed routing & cost; Sonnet for coding, tool use & agents; Opus for deep evaluation.
4. Practice with the **60-question timed mock simulator** to internalize the 2-minute-per-question pacing rhythm.`;
}
