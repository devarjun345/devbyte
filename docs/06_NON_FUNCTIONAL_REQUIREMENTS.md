# DEV BYTE â€” Non-Functional Requirements

## Security
Passwords hashed; secrets in environment variables; server-side authorization; database private; submitted code isolated; AI output untrusted.

## Performance
Paginate lists; hackathon ingestion is background work; code execution doesn't block API; expensive queries indexed.

## Reliability
External source failure must not take down the API; stale source records remain usable; controlled error states.

## Maintainability
Modular backend; explicit Pydantic schemas; migration-controlled schema changes; tests for core services.

## Usability
Clear loading/error/empty states; predictable Student/Mentor navigation; core demo workflows require no developer intervention.

## Scalability
Adapters for external sources; service boundary for AI; modular monolith can later be split if justified.

