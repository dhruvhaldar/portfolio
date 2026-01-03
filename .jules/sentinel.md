## 2024-05-22 - [CRITICAL] Hardcoded Admin Password
**Vulnerability:** Found a hardcoded password "password" in `src/pages/api/authenticate.ts`.
**Learning:** Simple authentication handlers often get overlooked in initial development, leading to hardcoded secrets.
**Prevention:** Always use environment variables for secrets, even in development. Implement checks to fail securely if secrets are missing.

## 2024-10-27 - [HIGH] Authentication Bypass via Cookie Forgery
**Vulnerability:** The `authToken` cookie contained a static string "authenticated", allowing attackers to bypass authentication by manually setting this cookie.
**Learning:** Simple string checks for authentication are insufficient. Always use signed sessions (JWT, signed cookies) to ensure integrity.
**Prevention:** Use `crypto.createHmac` to sign cookie values with a server-side secret (`ADMIN_PASSWORD`).

## 2025-01-03 - [HIGH] Unvalidated Video Source in LazyframeVideo
**Vulnerability:** The `LazyframeVideo` component blindly accepted any `src` prop and passed it to the `lazyframe` library, potentially allowing XSS via `javascript:` URLs or loading unintended content types.
**Learning:** Components wrapping external libraries must validate inputs to ensure they match the library's expectations and security constraints (e.g., enforcing YouTube URLs when `data-vendor="youtube"` is hardcoded).
**Prevention:** Validate inputs against a strict allowlist (regex for YouTube IDs) before rendering the component.
