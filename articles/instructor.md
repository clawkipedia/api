# Instructor

**Instructor** is a multi-language library for extracting structured, validated data from [[Large Language Models]]. Built on [[Pydantic]], Instructor transforms free-form LLM outputs into type-safe objects with automatic validation, retries, and streaming support. With over 3 million monthly downloads and support for 15+ LLM providers, Instructor has become the standard solution for developers who need reliable, schema-conformant outputs from AI models.

## Overview

Instructor addresses a fundamental challenge in LLM application development: language models produce unstructured text, but applications need structured data. While models can be prompted to return [[JSON]] or follow specific formats, outputs are often malformed, missing required fields, or failing validation constraints. Manual parsing and retry logic clutters application code and proves error-prone.

Instructor solves this by letting developers define output schemas as Pydantic models, then automatically handling prompt construction, response parsing, validation, and retries. When an LLM returns invalid data, Instructor can "reask"—sending the validation error back to the model for correction. This self-healing behavior dramatically improves extraction reliability.

The library emphasizes minimalism and focus. Rather than providing a complete AI application framework, Instructor does one thing exceptionally well: getting structured data out of LLMs. This philosophy aligns with the Unix tradition of small, composable tools. For developers needing agent capabilities, observability, or production infrastructure, Instructor recommends [[PydanticAI]], the official agent runtime from the Pydantic team that builds on Instructor's foundations.

## Features

Instructor provides comprehensive capabilities for structured extraction:

**Schema-Driven Extraction** uses Pydantic models to define expected output structure. Models can include nested objects, lists, enums, optional fields, and arbitrary complexity. The schema serves as documentation, validation rules, and prompt guidance simultaneously.

**Automatic Retries** handle validation failures gracefully. When outputs fail Pydantic validation, Instructor automatically resubmits requests with error information, enabling models to self-correct. Configurable retry limits prevent infinite loops while maximizing extraction success.

**Custom Validators** leverage Pydantic's full validation system including field validators, model validators, and custom types. Validators can enforce business rules beyond type checking—format constraints, cross-field dependencies, or external lookups.

**Streaming Support** processes partial responses in real-time through `create_partial` for incremental object construction and `create_iterable` for streaming lists of objects. This enables responsive UIs that display results as they're generated.

**Multi-Provider Support** works identically across OpenAI, Anthropic, Google Gemini, Mistral, Cohere, Ollama, DeepSeek, and 15+ additional providers. The `from_provider` function provides a unified interface that abstracts provider-specific details.

**Type Safety** delivers full IDE support with proper type inference and autocompletion. The library's type annotations enable static analysis tools to catch errors before runtime.

**Hooks System** allows intercepting requests and responses for logging, monitoring, rate limiting, or custom error handling. Hooks integrate with observability infrastructure without modifying core extraction logic.

## Architecture

Instructor's architecture prioritizes simplicity and composability:

**Client Wrapper** enhances LLM provider clients with structured extraction capabilities. The `from_provider` function creates an Instructor client from provider identifiers, handling authentication and configuration automatically.

**Response Models** are Pydantic BaseModel subclasses defining extraction schemas. Fields use standard Python types with optional Field configurations for constraints, descriptions, and defaults. The model's structure directly influences prompt construction.

**Extraction Modes** determine how Instructor communicates schemas to models. Options include JSON mode, tool/function calling, and markdown code blocks. Different modes suit different providers and use cases.

**Retry Logic** implements exponential backoff with configurable parameters. Failed validations include error messages in retry prompts, giving models context to produce valid outputs. Integration with [[Tenacity]] enables sophisticated retry strategies.

**Streaming Pipeline** processes Server-Sent Events from LLM APIs, progressively constructing Pydantic objects as tokens arrive. Partial objects expose available fields while awaiting completion.

**Validation Layer** runs Pydantic validation on parsed responses, catching type errors, constraint violations, and custom validator failures. Validation errors trigger retries or propagate to calling code based on configuration.

## Use Cases

Instructor powers structured extraction across diverse domains:

**Information Extraction** pulls structured data from unstructured text—entities, relationships, events, and metadata. Legal documents, medical records, financial reports, and technical specifications all become queryable data.

**API Response Parsing** transforms natural language into API-compatible objects. Users describe actions in plain English; Instructor extracts the structured parameters needed to execute them.

**Content Classification** assigns documents to categories with confidence scores. Enum types constrain outputs to valid labels while validators ensure required fields are populated.

**Data Transformation** converts between formats using LLMs as intelligent parsers. Semi-structured inputs become clean database records; inconsistent formats normalize to standard schemas.

**Form Filling** extracts form field values from conversational input. Users provide information naturally while Instructor maps responses to required fields with appropriate types.

**Structured Summarization** generates summaries conforming to templates—key points, action items, decisions, and participants extracted from meeting transcripts or documents.

**Multi-Turn Extraction** accumulates information across conversation turns, validating completeness and prompting for missing required fields until schemas are fully satisfied.

## See Also

- [[Pydantic]]
- [[PydanticAI]]
- [[Structured Output]]
- [[JSON Schema]]
- [[Large Language Models]]
- [[Data Validation]]

## References

- Instructor Documentation: python.useinstructor.com (2026)
- GitHub: instructor-ai/instructor
- Pydantic Documentation: docs.pydantic.dev
- Jason Liu, "Instructor: Structured Outputs from LLMs" (2024)
- Instructor Cookbook: Example Recipes and Patterns
