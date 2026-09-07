import { PracticeQuestion } from '../types';

export const QUESTIONS_PART3: PracticeQuestion[] = [
  // TOPIC 21
  {
    id: 'Q21.1',
    topicId: 21,
    domainId: 'D4',
    taskRef: 'Domain 4, Task 4.3',
    question: 'A developer adds "Return your answer as JSON" to the prompt. Claude sometimes returns valid JSON, sometimes wraps it in markdown code blocks, and sometimes adds explanatory text around the JSON. What is the fix?',
    options: [
      'Add "Return ONLY JSON, no markdown, no text" with more emphasis',
      'Use tool_use with a JSON schema and tool_choice to guarantee schema-compliant structured output',
      'Parse the response with regex to extract the JSON',
      'Set the system prompt to "You are a JSON-only assistant"'
    ],
    correctOptionIndex: 1,
    explanation: 'Prompt-only instructions for JSON are probabilistic and prone to markdown fences or conversational preambles. Using `tool_use` with a JSON schema and controlled `tool_choice` programmatically guarantees syntax-valid, schema-compliant JSON.',
    trap: 'Options 1, 3, and 4 are fragile workarounds. `tool_use` with schema is the exam\'s authoritative answer for guaranteed structured output.'
  },
  {
    id: 'Q21.2',
    topicId: 21,
    domainId: 'D4',
    taskRef: 'Domain 4, Task 4.3',
    question: 'What does tool_use with JSON schemas guarantee? (Select the most accurate answer)',
    options: [
      'Syntactically valid, schema-compliant JSON with semantically correct values',
      'Syntactically valid, schema-compliant JSON — but NOT semantic correctness (values may be wrong, sums may not match)',
      'Valid JSON with no errors of any kind',
      'Correctly structured data that always matches the source document'
    ],
    correctOptionIndex: 1,
    explanation: '`tool_use` guarantees syntactic validity and adherence to field types and required arrays in the schema. It does NOT guarantee semantic business-rule correctness (e.g. line items summing to total).',
    trap: 'Options 1 and 3 overclaim what JSON schemas do. Schemas do not validate logical math across fields.'
  },
  {
    id: 'Q21.3',
    topicId: 21,
    domainId: 'D4',
    taskRef: 'Domain 4, Task 4.3; Domain 2, Task 2.3',
    question: 'Rank these structured output methods from MOST to LEAST reliable:',
    options: [
      'tool_use + forced tool_choice > tool_use + "any" > tool_use + "auto" > prompt-based JSON',
      'Prompt-based JSON > tool_use + "auto" > tool_use + "any" > forced tool_choice',
      'All tool_use variants are equally reliable > prompt-based JSON',
      'tool_use + "auto" > forced tool_choice > tool_use + "any" > prompt-based JSON'
    ],
    correctOptionIndex: 0,
    explanation: 'Forced tool_choice guarantees the named tool call. `any` guarantees a tool call but model selects which. `auto` may return text without calling a tool. Prompt-based JSON offers no schema guarantees.',
    trap: 'Option 3 ignores that `auto` permits the model to return plain text.'
  },
  {
    id: 'Q21.4',
    topicId: 21,
    domainId: 'D4',
    taskRef: 'Domain 4, Task 4.3',
    question: 'A system needs to extract data from unknown document types (could be invoices, contracts, or reports). Each type has a different schema. Which tool_choice setting is best?',
    options: [
      '"auto" — let the model decide whether to extract',
      '"any" — the model must call a tool but can choose which extraction schema matches the document',
      'Force a specific tool — always use the invoice schema',
      'Don\'t use tool_choice — let the prompt determine the format'
    ],
    correctOptionIndex: 1,
    explanation: '`tool_choice: "any"` guarantees that a tool call is made while allowing the model to choose which tool matches the document type.',
    trap: 'Option 3 forces an invoice schema onto a contract or report, leading to severe hallucination.'
  },
  {
    id: 'Q21.5',
    topicId: 21,
    domainId: 'D4',
    taskRef: 'Domain 4, Task 4.3',
    question: 'A developer forces tool_choice: {"type": "tool", "name": "extract_invoice"} but the input is a contract, not an invoice. What happens?',
    options: [
      'The model correctly identifies the mismatch and returns an error',
      'The model attempts to force the document into the invoice schema, potentially hallucinating invoice fields that don\'t exist in the contract',
      'The API returns an error since the document doesn\'t match',
      'The model ignores the tool_choice and returns text analysis instead'
    ],
    correctOptionIndex: 1,
    explanation: 'When a tool is forced, the model must populate its schema regardless of input content, prompting it to invent plausible values for absent invoice fields.',
    trap: 'The API will not throw an error because the API does not inspect document semantics.'
  },

  // TOPIC 22
  {
    id: 'Q22.1',
    topicId: 22,
    domainId: 'D4',
    taskRef: 'Domain 4, Task 4.3',
    question: 'An extraction schema has "purchase_order_number": {"type": "string"} as a required field. Some documents don\'t contain a PO number. What happens?',
    options: [
      'The model returns null for the field',
      'The model fabricates a plausible-looking PO number to satisfy the required field',
      'The extraction fails with a schema validation error',
      'The model skips the field entirely'
    ],
    correctOptionIndex: 1,
    explanation: 'When a field is required in the JSON schema but absent from the document, the model is compelled to invent or hallucinate a value to satisfy schema constraints.',
    trap: 'Option 1 only happens if the field type allows `null`.'
  },
  {
    id: 'Q22.2',
    topicId: 22,
    domainId: 'D4',
    taskRef: 'Domain 4, Task 4.3',
    question: 'How should the PO number field be defined to prevent fabrication when the number isn\'t in the document?',
    options: [
      '"purchase_order_number": {"type": "string", "default": "N/A"}',
      '"purchase_order_number": {"type": ["string", "null"]} and make it optional',
      '"purchase_order_number": {"type": "string", "minLength": 0}',
      'Remove the field from the schema entirely'
    ],
    correctOptionIndex: 1,
    explanation: 'Declaring `"type": ["string", "null"]` and omitting it from `required` allows the model to output `null` without fabricating data.',
    trap: 'Option 1 creates confusing dummy strings ("N/A") that downstream systems may misinterpret as real PO IDs.'
  },
  {
    id: 'Q22.3',
    topicId: 22,
    domainId: 'D4',
    taskRef: 'Domain 4, Task 4.3',
    question: 'An extraction schema categorizes documents into "invoice", "receipt", and "contract". A new document type (purchase order) appears. The model forces it into "invoice" since that\'s the closest match. What schema improvement would help?',
    options: [
      'Add "purchase_order" to the enum',
      'Add "other" to the enum with an accompanying "category_detail" free-text field',
      'Remove the enum and use a free-text field',
      'Add all possible document types to the enum'
    ],
    correctOptionIndex: 1,
    explanation: 'The `"other" + "category_detail"` pattern provides extensible taxonomy, allowing unexpected document types to be recorded accurately without schema breaks.',
    trap: 'Option 1 only patches one document type; option 2 handles all future unforeseen types.'
  },
  {
    id: 'Q22.4',
    topicId: 22,
    domainId: 'D4',
    taskRef: 'Domain 4, Task 4.3',
    question: 'A schema includes "confidence": {"type": "string", "enum": ["high", "medium", "low"]} for categorization certainty. A document is genuinely ambiguous — it could be either a contract or an amendment. What additional enum value would help?',
    options: [
      '"very_low"',
      '"unclear" — for cases where the model cannot confidently categorize',
      '"unknown"',
      '"skip"'
    ],
    correctOptionIndex: 1,
    explanation: 'Providing `"unclear"` in enums gives the model an explicit option to flag genuine ambiguity instead of being forced into an incorrect classification.',
    trap: 'The exam guide explicitly recommends the `"unclear"` enum value for ambiguity handling.'
  },
  {
    id: 'Q22.5',
    topicId: 22,
    domainId: 'D4',
    taskRef: 'Domain 4, Task 4.3',
    question: 'Source documents contain dates in various formats: "01/15/2024", "January 15, 2024", "2024-01-15", "15th Jan \'24". The extraction schema requires an ISO 8601 date. How should this be handled?',
    options: [
      'Make the date field accept any string format',
      'Include format normalization rules in the prompt alongside the strict output schema',
      'Add a PostToolUse hook to normalize dates after extraction',
      'Reject documents with non-standard date formats'
    ],
    correctOptionIndex: 1,
    explanation: 'Include normalization guidelines directly in the prompt alongside the schema (e.g. "Normalize all dates to YYYY-MM-DD regardless of source format").',
    trap: 'Option 1 destroys downstream date consistency.'
  },

  // TOPIC 23
  {
    id: 'Q23.1',
    topicId: 23,
    domainId: 'D2',
    taskRef: 'Domain 4, Task 4.3; Domain 2, Task 2.3',
    question: 'A developer sets tool_choice: "auto" for an extraction task. Sometimes Claude returns a well-formatted text analysis instead of calling the extraction tool. How should this be fixed?',
    options: [
      'Add a system prompt instruction: "Always call the extraction tool"',
      'Switch to tool_choice: "any" to guarantee the model calls a tool',
      'Add more tools so the model has more options',
      'Increase temperature to encourage tool calling'
    ],
    correctOptionIndex: 1,
    explanation: 'Under `tool_choice: "auto"`, the model is free to return text instead of a tool call. `tool_choice: "any"` guarantees tool invocation.',
    trap: 'Option 1 is a probabilistic prompt instruction that can still be ignored.'
  },
  {
    id: 'Q23.2',
    topicId: 23,
    domainId: 'D2',
    taskRef: 'Domain 2, Task 2.3',
    question: 'A multi-step extraction requires: Step 1 — extract metadata, Step 2 — enrich with external data, Step 3 — validate and synthesize. How should tool_choice be configured?',
    options: [
      'Set tool_choice: "auto" for all three steps',
      'Force extract_metadata in turn 1 → process → force enrich_data in turn 2 → process → "auto" in turn 3 for synthesis',
      'Force all three tools simultaneously in a single turn',
      'Set tool_choice: "any" for all three steps'
    ],
    correctOptionIndex: 1,
    explanation: 'Sequenced multi-tool workflows occur over distinct API turns. Force the necessary tool in each turn, then switch to "auto" for final synthesis.',
    trap: 'Option 3 is impossible: you cannot force multiple tools in a single turn.'
  },
  {
    id: 'Q23.3',
    topicId: 23,
    domainId: 'D2',
    taskRef: 'Domain 2, Task 2.3; Domain 4, Task 4.3',
    question: 'What is the difference between tool_choice: "any" and tool_choice: {"type": "tool", "name": "extract_metadata"}?',
    options: [
      'Both guarantee a tool is called; "any" lets the model choose, forced specifies which tool',
      'any calls all available tools; forced calls one specific tool',
      'any is faster; forced is more accurate',
      'any is for multiple tools; forced is for single-tool setups'
    ],
    correctOptionIndex: 0,
    explanation: 'Both guarantee tool execution. `any` delegates tool selection to Claude among the tool list; forced mandates the exact tool name.',
    trap: 'Option 1 claims `any` executes all tools, which is false.'
  },
  {
    id: 'Q23.4',
    topicId: 23,
    domainId: 'D2',
    taskRef: 'Domain 2, Task 2.3',
    question: 'An agent has 12 tools available. Tool selection reliability has decreased significantly. What is the most likely cause and fix?',
    options: [
      'The API has a tool limit — reduce to 10',
      'Too many tools degrade selection reliability — reduce to 4-5 per agent by splitting into specialized subagents with scoped tool sets',
      'The tools need to be alphabetically ordered',
      'The model version doesn\'t support 12 tools'
    ],
    correctOptionIndex: 1,
    explanation: 'Optimal tool count per agent is 4–5 tools. Large toolsets degrade selection accuracy; split responsibilities across specialized subagents.',
    trap: 'There is no arbitrary 10-tool API limit.'
  },
  {
    id: 'Q23.5',
    topicId: 23,
    domainId: 'D2',
    taskRef: 'Domain 1, Task 1.5; Domain 2, Task 2.3',
    question: 'A developer needs to guarantee that the model calls verify_identity before any account modification tool. How should this be enforced?',
    options: [
      'Add a system prompt instruction: "Always verify identity first"',
      'Force tool_choice: {"type": "tool", "name": "verify_identity"} on the first turn, then allow "auto" for subsequent turns',
      'Create a PreToolUse hook that blocks account modification if identity hasn\'t been verified',
      'Both B and C provide valid approaches — C is more robust'
    ],
    correctOptionIndex: 3,
    explanation: 'Forcing tool_choice on turn 1 orchestrates the sequence, and a PreToolUse hook provides a 100% deterministic safety gate against bypasses.',
    trap: 'Option 1 relies on prompt instructions that can be bypassed.'
  },

  // TOPIC 24
  {
    id: 'Q24.1',
    topicId: 24,
    domainId: 'D4',
    taskRef: 'Domain 4, Task 4.3',
    question: 'An extraction system consistently fabricates "N/A" or "Not specified" as values for fields that don\'t exist in the source document. What is the root cause?',
    options: [
      'The model is hallucinating due to high temperature',
      'The schema defines these fields as required, forcing the model to produce values even when the information doesn\'t exist',
      'The source documents are poorly formatted',
      'The model doesn\'t understand the document type'
    ],
    correctOptionIndex: 1,
    explanation: 'When fields are declared as required in the schema, the model is forced to fill them, leading to fabricated placeholders or values.',
    trap: 'Temperature adjustment will not stop the model from trying to satisfy required schema fields.'
  },
  {
    id: 'Q24.2',
    topicId: 24,
    domainId: 'D4',
    taskRef: 'Domain 4, Task 4.2',
    question: 'A few-shot example shows: Source: "Invoice dated Jan 15" → Output: {"date": "2024-01-15", "amount": null}. Why is including "amount": null in the example important?',
    options: [
      'It shows the model what null values look like in JSON',
      'It demonstrates the correct behavior when information is absent — return null rather than fabricating a value',
      'It ensures the schema validates correctly',
      'It proves the model can handle missing data'
    ],
    correctOptionIndex: 1,
    explanation: 'Few-shot examples with `null` explicitly demonstrate that absence of data should be represented by `null` rather than guessing or fabricating.',
    trap: 'Option 1 trivializes the example as mere JSON syntax training rather than behavioral guidance.'
  },
  {
    id: 'Q24.3',
    topicId: 24,
    domainId: 'D4',
    taskRef: 'Domain 4, Tasks 4.3, 4.4',
    question: 'An invoice extraction returns total_amount: $1,247.50 and line items summing to $1,247.30. The JSON is schema-compliant. What type of error is this?',
    options: [
      'Schema syntax error — the JSON is malformed',
      'Semantic error — the values don\'t add up, which tool_use cannot prevent',
      'Validation error — the schema should enforce sum matching',
      'Format error — the dollar sign shouldn\'t be included'
    ],
    correctOptionIndex: 1,
    explanation: 'This is a semantic error: the JSON adheres to the schema syntax, but the numbers are internally contradictory.',
    trap: 'JSON Schema has no built-in mechanism to enforce that the sum of an array equals a root-level total.'
  },
  {
    id: 'Q24.4',
    topicId: 24,
    domainId: 'D4',
    taskRef: 'Domain 4, Task 4.3',
    question: 'An extraction system consistently misformats phone numbers — some as "(555) 123-4567", others as "555-123-4567", and others as "+15551234567". The schema uses "type": "string" for phone numbers. What is the best fix?',
    options: [
      'Add a regex pattern to the JSON schema',
      'Include format normalization rules in the prompt: "All phone numbers should be formatted as +1XXXXXXXXXX"',
      'Create a PostToolUse hook that normalizes phone formats',
      'Both B and C are valid — B handles it during extraction, C provides a safety net'
    ],
    correctOptionIndex: 3,
    explanation: 'Combining prompt-level normalization rules with a PostToolUse deterministic normalizing hook provides comprehensive defense in depth.',
    trap: 'Option 1: JSON schema regex patterns are not always consistently enforced across every client engine.'
  },
  {
    id: 'Q24.5',
    topicId: 24,
    domainId: 'D4',
    taskRef: 'Domain 4, Task 4.4',
    question: 'A cross-validation field conflict_detected is added to the extraction schema. When should it be set to true?',
    options: [
      'When the model\'s confidence is below a threshold',
      'When the extracted data contradicts information in the source document (e.g., stated total doesn\'t match line item sum)',
      'When the document is poorly formatted',
      'When required fields are missing from the source'
    ],
    correctOptionIndex: 1,
    explanation: '`conflict_detected: true` flags internal contradictions within the extracted source data (such as arithmetic mismatches) for human review.',
    trap: 'Missing fields should be represented with `null`, not flagged as conflicts.'
  },

  // TOPIC 25
  {
    id: 'Q25.1',
    topicId: 25,
    domainId: 'D4',
    taskRef: 'Domain 4, Task 4.4',
    question: 'A code review system has a high false positive rate for "unused import" findings. Developers dismiss 80% of these findings. How should this be improved?',
    options: [
      'Remove "unused import" detection entirely',
      'Analyze the dismissed findings using the detected_pattern field to understand which import patterns trigger false positives, then refine the prompt criteria',
      'Lower the model\'s confidence threshold',
      'Add a "suppress warnings" option for developers'
    ],
    correctOptionIndex: 1,
    explanation: 'Use the `detected_pattern` telemetry to isolate the exact code patterns causing false positives, then refine prompt criteria to exclude them.',
    trap: 'Option 1 drops valid detections instead of refining the problematic pattern.'
  },
  {
    id: 'Q25.2',
    topicId: 25,
    domainId: 'D4',
    taskRef: 'Domain 4, Task 4.4',
    question: 'A retry-with-error-feedback mechanism appends the following to a retry attempt: "Previous extraction failed: line_items total ($1,247.30) does not match stated total ($1,247.50). Please re-extract with correct values." What type of error is this effective for?',
    options: [
      'Any extraction error',
      'Format and structural errors where the information exists but was incorrectly extracted',
      'Errors where the information is absent from the source document',
      'Schema syntax errors'
    ],
    correctOptionIndex: 1,
    explanation: 'Retry-with-error-feedback works when the information exists in the source text and the model simply needs directed correction.',
    trap: 'Option 3 is a major exam trap: retrying is completely ineffective when the information does not exist in the source document.'
  },
  {
    id: 'Q25.3',
    topicId: 25,
    domainId: 'D4',
    taskRef: 'Domain 4, Task 4.4',
    question: 'An extraction system retries 5 times on a document but keeps producing the same incorrect value for a "contract renewal date" field. The source document contains no mention of a renewal date. What should happen?',
    options: [
      'Increase retries to 10 — the model will eventually find it',
      'Stop retrying — the information is absent from the source document; retries are ineffective when data doesn\'t exist',
      'Use a different model for the retry',
      'Add the field as required in the schema to force extraction'
    ],
    correctOptionIndex: 1,
    explanation: 'Retries cannot extract nonexistent data. Stop retrying and return `null`.',
    trap: 'Option 4 will force the model to hallucinate a fake renewal date.'
  },
  {
    id: 'Q25.4',
    topicId: 25,
    domainId: 'D4',
    taskRef: 'Domain 4, Task 4.4',
    question: 'How should a team test prompt improvements before deploying them to a batch extraction pipeline?',
    options: [
      'Deploy directly and monitor results',
      'Test on a representative sample set first to measure impact, maximize first-pass success rate before batch processing',
      'A/B test with live production data',
      'Test with a single document and deploy if it passes'
    ],
    correctOptionIndex: 1,
    explanation: 'Testing prompts on a representative sample set maximizes first-pass success rates before committing to expensive batch processing runs.',
    trap: 'Testing on a single document is not representative of varied real-world layouts.'
  },
  {
    id: 'Q25.5',
    topicId: 25,
    domainId: 'D4',
    taskRef: 'Domain 4, Task 4.4',
    question: 'A feedback loop tracks that developers consistently modify the severity field from "critical" to "major" for race condition findings. What does this signal?',
    options: [
      'Developers don\'t understand severity levels',
      'The prompt\'s criteria for "critical" severity is too broad for race conditions — it should be refined to better match developer expectations',
      'Race conditions should be excluded from the review',
      'The severity scale needs more levels'
    ],
    correctOptionIndex: 1,
    explanation: 'Consistent user downgrades reveal a prompt calibration issue where the definition of "critical" does not align with team reality.',
    trap: 'Option 1 blames users instead of using human feedback to calibrate prompts.'
  },

  // TOPIC 26
  {
    id: 'Q26.1',
    topicId: 26,
    domainId: 'D2',
    taskRef: 'Domain 2, Task 2.2; Domain 5, Task 5.3',
    question: 'An MCP tool returns the following error: {"content": [{"type": "text", "text": "Error occurred"}], "isError": true}. A coordinator agent receives this and retries the same request 10 times. What is wrong with the error response?',
    options: [
      'isError should be is_error',
      'The error lacks structured context (error category, retryability, description) — the coordinator can\'t determine if retry is appropriate',
      'The content format is wrong',
      'MCP errors should use HTTP status codes'
    ],
    correctOptionIndex: 1,
    explanation: 'Unstructured errors like "Error occurred" give the coordinator no actionable classification (transient vs business rule vs permission) or retry flag.',
    trap: 'Option 1 notes that MCP uses `isError` (camelCase), which is correct for MCP. The real problem is missing category and retryability metadata.'
  },
  {
    id: 'Q26.2',
    topicId: 26,
    domainId: 'D2',
    taskRef: 'Domain 2, Task 2.2',
    question: 'What is the casing difference between MCP error flags and Anthropic API error flags?',
    options: [
      'Both use is_error',
      'MCP uses isError (camelCase); Anthropic API uses is_error (snake_case)',
      'Both use isError',
      'MCP uses error; Anthropic API uses is_error'
    ],
    correctOptionIndex: 1,
    explanation: 'The MCP specification uses camelCase `isError`, while the Anthropic Messages API uses snake_case `is_error` in tool_result blocks.',
    trap: 'This casing difference is a direct test question in Domain 2.'
  },
  {
    id: 'Q26.3',
    topicId: 26,
    domainId: 'D2',
    taskRef: 'Domain 2, Task 2.2; Domain 5, Task 5.3',
    question: 'A database tool times out. What error category and retryability should be returned?',
    options: [
      'errorCategory: "validation", isRetryable: false',
      'errorCategory: "transient", isRetryable: true',
      'errorCategory: "business", isRetryable: false',
      'errorCategory: "permission", isRetryable: false'
    ],
    correctOptionIndex: 1,
    explanation: 'Network and database timeouts are transient issues that may succeed on a subsequent retry (`isRetryable: true`).',
    trap: 'Timeouts are transient, not input validation or permission errors.'
  },
  {
    id: 'Q26.4',
    topicId: 26,
    domainId: 'D2',
    taskRef: 'Domain 2, Task 2.2',
    question: 'A tool query executes successfully and returns zero results. How should this be communicated?',
    options: [
      'Return isError: true with message "No results found"',
      'Return isError: false with empty results — this is a successful query with no matches, NOT an error',
      'Return isError: true with errorCategory: "not_found"',
      'Return nothing and let the model handle it'
    ],
    correctOptionIndex: 1,
    explanation: 'A query that executes cleanly and finds zero matching records is a valid, successful execution (`isError: false` with empty array). Returning an error triggers invalid retries.',
    trap: 'Conflating "zero matches found" with an execution failure is a common bug tested on the exam.'
  },
  {
    id: 'Q26.5',
    topicId: 26,
    domainId: 'D2',
    taskRef: 'Domain 2, Task 2.2; Domain 5, Task 5.3',
    question: 'A financial subagent fails with a permission error when trying to access premium market data. The coordinator receives: {"errorCategory": "permission", "isRetryable": false, "description": "Premium data access denied — subscription required"}. What should the coordinator do?',
    options: [
      'Retry with different credentials',
      'Escalate — permission errors are not retryable and require human/system intervention',
      'Skip the premium data and continue with free data sources',
      'Terminate the entire workflow'
    ],
    correctOptionIndex: 1,
    explanation: 'Permission errors marked with `isRetryable: false` cannot be self-healed by retrying; they require human/administrative intervention.',
    trap: 'Option 1 retries despite the explicit `isRetryable: false` flag.'
  },

  // TOPIC 27
  {
    id: 'Q27.1',
    topicId: 27,
    domainId: 'D2',
    taskRef: 'Domain 2, Task 2.1',
    question: 'An agent has two tools: get_customer(email) and lookup_order(order_id). When asked "What\'s the status of order #12345?", the agent calls get_customer instead of lookup_order. Both tools have minimal descriptions: "Gets customer data" and "Gets order data". What is the fix?',
    options: [
      'Add a routing layer that parses the user\'s intent',
      'Expand tool descriptions to include what each tool does, returns, when to use it, and when NOT to use it',
      'Rename the tools to be more distinct',
      'Reduce the number of tools to one'
    ],
    correctOptionIndex: 1,
    explanation: 'Tool descriptions are the primary driver of tool selection. Rich descriptions detailing exact parameters, use cases, and when NOT to use resolve tool selection confusion.',
    trap: 'Option 1 creates unnecessary architectural complexity when clear tool descriptions solve the root cause.'
  },
  {
    id: 'Q27.2',
    topicId: 27,
    domainId: 'D2',
    taskRef: 'Domain 2, Task 2.1',
    question: 'A tool description includes: "Gets data." What are ALL the problems with this description?',
    options: [
      'It\'s too short',
      'It doesn\'t state what data it returns, when to use it, when NOT to use it, or what parameters to provide — Claude has no guidance for selection',
      'It uses informal language',
      'It doesn\'t include error handling information'
    ],
    correctOptionIndex: 1,
    explanation: 'High-quality tool descriptions must answer: (1) what it does, (2) return payload structure, (3) when to use it, (4) when NOT to use it, and (5) parameter expectations.',
    trap: 'Option 1 is vague; the issue is missing semantic boundaries, not character count.'
  },
  {
    id: 'Q27.3',
    topicId: 27,
    domainId: 'D2',
    taskRef: 'Domain 2, Task 2.1',
    question: 'Two tools overlap: search_products(query) and find_items(keyword). Both search the product catalog but search_products supports fuzzy matching while find_items does exact matching. Agents frequently choose the wrong one. What is the best fix?',
    options: [
      'Remove find_items and only keep search_products',
      'Add clear boundary descriptions: search_products — "Use for natural language or approximate searches"; find_items — "Use ONLY for exact SKU or product code lookups"',
      'Merge them into one tool with a match_type parameter',
      'Add a classification step before tool selection'
    ],
    correctOptionIndex: 1,
    explanation: 'Explicit boundary descriptions specify complementary conditions (e.g. fuzzy vs exact SKU) so the model routes accurately.',
    trap: 'Option 1 deletes exact-matching capability.'
  },
  {
    id: 'Q27.4',
    topicId: 27,
    domainId: 'D2',
    taskRef: 'Domain 2, Task 2.3',
    question: 'An agent has 18 tools available. Tool selection accuracy has dropped to 60%. What is the recommended solution?',
    options: [
      'Improve all 18 tool descriptions',
      'Split tools across specialized subagents with 4-5 tools each',
      'Add a tool selection classifier',
      'Upgrade to a more capable model'
    ],
    correctOptionIndex: 1,
    explanation: 'At 18+ tools, cognitive decision space is overwhelmed. Architectural scoping down to 4–5 tools per specialized subagent is the exam\'s established benchmark.',
    trap: 'Improving descriptions for 18 tools will not overcome the fundamental combinatorial degradation.'
  },
  {
    id: 'Q27.5',
    topicId: 27,
    domainId: 'D2',
    taskRef: 'Domain 2, Tasks 2.1, 2.4',
    question: 'An MCP tool for code search exists but the agent consistently uses the built-in Grep tool instead. What is the most likely cause?',
    options: [
      'Built-in tools are hard-coded to have priority',
      'The MCP tool\'s description doesn\'t clearly differentiate its advantages (e.g., semantic search, cross-repo) from Grep\'s content pattern matching',
      'MCP tools are slower than built-in tools',
      'The agent can\'t access MCP tools'
    ],
    correctOptionIndex: 1,
    explanation: 'If an MCP tool description does not emphasize distinct advantages (e.g. semantic/cross-repo search), Claude defaults to familiar built-in tools.',
    trap: 'Option 1 is false: built-in tools do not possess hard-coded selection priority over MCP tools.'
  },

  // TOPIC 28
  {
    id: 'Q28.1',
    topicId: 28,
    domainId: 'D2',
    taskRef: 'Domain 2, Task 2.4',
    question: 'A team wants to connect Claude Code to their internal knowledge base. They already have a community MCP server for similar functionality. What should they do?',
    options: [
      'Build a custom MCP server from scratch for maximum customization',
      'Start with the community MCP server; build custom only if team-specific needs aren\'t met',
      'Use both community and custom servers simultaneously',
      'Skip MCP and use direct API calls instead'
    ],
    correctOptionIndex: 1,
    explanation: 'Leverage established, maintained community MCP servers first; build bespoke custom MCP servers only when proprietary workflows demand it.',
    trap: 'Building custom servers from scratch introduces unnecessary maintenance.'
  },
  {
    id: 'Q28.2',
    topicId: 28,
    domainId: 'D2',
    taskRef: 'Domain 2, Task 2.2',
    question: 'An MCP server configuration in .mcp.json uses "command": "npx" with "args": ["-y", "@modelcontextprotocol/server-github"]. What transport mechanism does this use?',
    options: [
      'HTTP',
      'WebSocket',
      'stdio (standard input/output)',
      'gRPC'
    ],
    correctOptionIndex: 2,
    explanation: 'A server configured with a CLI executable `command` runs as a child process communicating over `stdio` (standard input/output).',
    trap: 'Option 1 is for remote HTTP servers, not local process-based launches.'
  },
  {
    id: 'Q28.3',
    topicId: 28,
    domainId: 'D2',
    taskRef: 'Domain 2, Task 2.4',
    question: 'When are MCP tools from configured servers available to the agent?',
    options: [
      'Only when explicitly requested by the user',
      'All tools from all configured MCP servers are discovered at connection time and available simultaneously',
      'One server\'s tools at a time, switched by configuration',
      'Only after the agent calls a discovery tool'
    ],
    correctOptionIndex: 1,
    explanation: 'MCP tool discovery is automatic at connection time; tools across all configured servers are exposed simultaneously.',
    trap: 'Option 4 assumes a discovery tool call is needed, which is false.'
  },
  {
    id: 'Q28.4',
    topicId: 28,
    domainId: 'D2',
    taskRef: 'Domain 2, Task 2.4',
    question: 'What are the three MCP primitives and who controls each?',
    options: [
      'Tools (user), Resources (model), Prompts (application)',
      'Tools (model-initiated), Resources (application/host-initiated), Prompts (user-selected)',
      'Tools (application), Resources (user), Prompts (model)',
      'Tools (server), Resources (client), Prompts (host)'
    ],
    correctOptionIndex: 1,
    explanation: 'Tools = model-initiated actions. Resources = application/host-controlled data catalogs. Prompts = user-selected templates.',
    trap: 'Knowing WHO initiates/controls each MCP primitive is a foundational exam concept.'
  },
  {
    id: 'Q28.5',
    topicId: 28,
    domainId: 'D2',
    taskRef: 'Domain 2, Task 2.4',
    question: 'A team configures a GitHub MCP server in .mcp.json with "env": {"GITHUB_TOKEN": "${GITHUB_TOKEN}"}. A new developer clones the repo but their GitHub MCP tool calls fail with authentication errors. What is the most likely issue?',
    options: [
      'The .mcp.json file is not in the repository',
      'The developer hasn\'t set the GITHUB_TOKEN environment variable on their machine',
      'The MCP server doesn\'t support environment variables',
      'The token format is wrong in the configuration'
    ],
    correctOptionIndex: 1,
    explanation: '`${GITHUB_TOKEN}` references the local shell environment. If the developer has not exported that variable locally, the token resolves to undefined.',
    trap: 'The syntax `${VAR}` is standard; the failure is a missing local environment variable.'
  },

  // TOPIC 29
  {
    id: 'Q29.1',
    topicId: 29,
    domainId: 'D2',
    taskRef: 'Domain 2, Task 2.3',
    question: 'A workflow requires: first extract document metadata, then classify the document type, then extract type-specific data. How should tool_choice be configured across these steps?',
    options: [
      '"auto" for all three steps — let the model decide',
      'Force extract_metadata (turn 1) → Force classify_type (turn 2) → Force type-specific extractor (turn 3)',
      '"any" for all three steps',
      'Force all three tools in a single API call'
    ],
    correctOptionIndex: 1,
    explanation: 'Dependent multi-tool pipelines are orchestrated sequentially across separate API turns with targeted forced `tool_choice`.',
    trap: 'Option 4 is impossible: only one tool_choice parameter is sent per turn.'
  },
  {
    id: 'Q29.2',
    topicId: 29,
    domainId: 'D2',
    taskRef: 'Domain 2, Task 2.3',
    question: 'An agent has tool_choice: "any" set. The agent has access to search_web, search_database, and search_knowledge_base. What will happen when the user asks a question?',
    options: [
      'The agent calls all three tools',
      'The agent must call exactly one tool of its choosing — it can select the most appropriate search tool',
      'The agent can return text without calling any tool',
      'The agent calls the first tool in the list'
    ],
    correctOptionIndex: 1,
    explanation: '`tool_choice: "any"` guarantees that Claude calls exactly one tool, choosing which among the provided tool definitions.',
    trap: 'Option 1 assumes `any` triggers all tools simultaneously.'
  },
  {
    id: 'Q29.3',
    topicId: 29,
    domainId: 'D2',
    taskRef: 'Domain 2, Task 2.3',
    question: 'A specialized synthesis agent has access to web_search, verify_fact, and generate_summary. The web_search tool is from the research agent\'s domain and shouldn\'t be available to the synthesis agent. But verify_fact is a cross-role tool added for high-frequency needs. Is this design appropriate?',
    options: [
      'No — each agent should have completely isolated tools with zero overlap',
      'Yes — scoped cross-role tools (like verify_fact) for high-frequency needs are acceptable, but broad tools outside the agent\'s specialization (like web_search) should be removed',
      'Yes — agents should have access to all available tools',
      'No — verify_fact should be routed through the coordinator'
    ],
    correctOptionIndex: 1,
    explanation: 'Selective cross-role exposure for high-frequency micro-needs (like fact verification) is fine, while broad exploratory tools (like web search) should remain restricted to dedicated research agents.',
    trap: 'Option 1 demands dogmatic zero-overlap, which causes inefficient routing bottlenecks.'
  },
  {
    id: 'Q29.4',
    topicId: 29,
    domainId: 'D2',
    taskRef: 'Domain 2, Task 2.3',
    question: 'A developer wants to replace a generic fetch_url tool with something safer. What is the recommended approach?',
    options: [
      'Add a URL validation step after fetch_url',
      'Replace fetch_url with a constrained alternative like load_document that validates URLs are document URLs before fetching',
      'Add a system prompt instruction: "Only fetch document URLs"',
      'Use a PreToolUse hook to validate URLs'
    ],
    correctOptionIndex: 1,
    explanation: 'Replacing overly permissive generic tools with purpose-constrained alternatives (e.g. `load_document`) prevents misuse at the tool design layer.',
    trap: 'Option 3 uses prompt instructions that fail to guarantee tool security.'
  },
  {
    id: 'Q29.5',
    topicId: 29,
    domainId: 'D2',
    taskRef: 'Domain 2, Task 2.3',
    question: 'After processing extract_metadata in turn 1 with forced tool_choice, the developer wants the model to naturally decide what to do next based on the metadata. What should tool_choice be for turn 2?',
    options: [
      'Continue forcing a specific tool',
      'Set tool_choice: "auto" — the model can now decide whether to call another tool or synthesize the results',
      'Set tool_choice: "any" to guarantee another tool call',
      'Remove tool_choice entirely'
    ],
    correctOptionIndex: 1,
    explanation: 'After a forced initial step, switching to `tool_choice: "auto"` restores adaptive decision-making based on the returned metadata.',
    trap: 'Persisting forced tool_choice in subsequent turns strips the model of its adaptive agentic capability.'
  }
];
