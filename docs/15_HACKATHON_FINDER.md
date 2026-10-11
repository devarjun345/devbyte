# DEV BYTE â€” Hackathon Finder
## Purpose
Aggregate permitted public hackathon metadata into a searchable DEV BYTE interface.

## Collection model
Source adapter â†’ parser â†’ normalizer â†’ deduplicator â†’ MySQL â†’ FastAPI â†’ frontend.

Use API/feed/import/page collection only where the source permits it. Do not assume unrestricted scraping.

## Stored fields
Title, organizer, description/summary, mode, location, dates, deadline, prize, team size, skills/tags, image where permitted, source, source_event_id, source_url, registration_url, last_synced_at, status.

## Student features
Search, filters, details, bookmark, source link, external registration redirect.

## Current scope
No AI Hackathon Matcher.

## Deduplication
Prefer stable source IDs; otherwise compare normalized event identity signals such as title, organizer and dates.

## Reliability
Source failures must not break the page; preserve last valid records and mark stale/error as appropriate.

