# DEV BYTE â€” AI Design
## Provider
Gemini API through Google's `google-genai` Python SDK.

## AI Team Matcher
### Goal
Find compatible students for a team/hackathon.

### Inputs
Team requirements, hackathon requirements, student skills, proficiency, interests, projects, relevant activity and availability where present.

### Pipeline
1. Retrieve candidates deterministically.
2. Remove clearly ineligible candidates.
3. Compute compatibility.
4. Ask Gemini for concise explanations/structured output.
5. Validate AI output.
6. Show candidate + reasons.
7. User explicitly sends invitation.

AI never invents candidates, modifies team membership or exposes private data.

## AI Mentor
### Goal
Provide personalized technical/learning help.

### Authorized context
Skills, interests, learning goals, project metadata, Battle Arena performance and assignment performance where applicable.

### Capabilities
Technical explanations, practice guidance, learning sequence, actual DEV BYTE problem recommendations, progress discussion.

### Not included in the current scope
Career assistant, job/internship recommendations, code judging, mentor verification.

## AI safety
Keep API key backend-only. Minimize personal context. Validate structured output. Model output cannot directly execute privileged actions.

## Fetch.ai
Not required for the hackathon. Can be introduced later for agent orchestration if it materially benefits the product.

