# DEV BYTE â€” Authentication and Roles

## Roles
STUDENT, MENTOR.

## Registration
Users can choose Student or Mentor. Mentor verification is a planned enhancement.

## JWT
Short-lived access token; minimal claims; server-side token validation.

## Authorization
- Verify role for mentor-only endpoints.
- Verify ownership for student resources.
- Verify team ownership for management operations.
- Never trust role/ownership claims from the frontend.

## Passwords
Use a strong password hashing library. Never store plaintext or log passwords.

## Future
Admin role, mentor verification, and stronger identity checks remain future enhancements..

