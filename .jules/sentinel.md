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

## 2025-05-23 - [ENHANCEMENT] Input Length Validation on OG Route
**Vulnerability:** The Open Graph image generation endpoint (`src/app/og/route.tsx`) accepted unlimited string length for the `title` parameter, potentially leading to Resource Exhaustion (DoS) as the image generator processes massive strings.
**Learning:** Edge functions and image generation are computationally expensive. Always limit input size for parameters that affect rendering complexity.
**Prevention:** Enforce a strict character limit (e.g., 100 chars) on text inputs used in image generation.

## 2026-01-08 - [HIGH] XSS Vulnerability in CustomLink
**Vulnerability:** The `CustomLink` component in `src/components/mdx.tsx` failed to validate `href` props, allowing `javascript:` URLs to be rendered in MDX content which could lead to XSS execution when clicked.
**Learning:** Custom components that bypass standard link handlers (like `next/link` or specialized secure components) must implement their own input validation. Assuming "everything not / or #" is a safe external link is dangerous.
**Prevention:** Explicitly check for and block `javascript:` schemes in all link-rendering components, regardless of whether they are internal or external.

## 2026-02-14 - [HIGH] Regex Validation Bypass in LazyframeVideo
**Vulnerability:** The `LazyframeVideo` component's URL validation regex was not anchored to the start of the string, allowing malicious URLs (e.g., `https://evil.com/?u=youtube.com...`) to bypass the check and inject arbitrary iframes.
**Learning:** When using regex for security validation (allowlisting), always anchor the pattern (`^...$`) to ensure the *entire* string matches the expected format, not just a substring.
**Prevention:** Use `^` to anchor the start of the regex and validate the protocol/domain explicitly, while allowing for valid subdomains (e.g., `m.`, `music.`).

## 2025-02-14 - [MEDIUM] Rate Limit Bypass via Cache Flushing
**Vulnerability:** The in-memory rate limiter cleared the entire storage map when it reached its size limit (10,000 records) to prevent OOM.
**Learning:** "Fail-open" strategies for resource exhaustion (like clearing all security state) can be weaponized by attackers to reset their own restrictions by flooding the system.
**Prevention:** Implement Least Recently Used (LRU) eviction or similar strategies that gracefully degrade (remove oldest/least important) rather than resetting the entire security state.

## 2025-06-15 - [MEDIUM] Log Injection via Untrusted Headers
**Vulnerability:** The authentication API blindly trusted the `X-Forwarded-For` header for logging and rate limiting, allowing attackers to inject CRLF characters to forge log entries or flood logs with garbage data.
**Learning:** Logs are often treated as trusted internal data streams. Injecting newlines into untrusted input (like headers) can corrupt logs (Log Spoofing), confusing monitoring systems and administrators.
**Prevention:** Always sanitize untrusted input before logging. Specifically, strip CR/LF characters and truncate strings to reasonable lengths.

## 2026-06-25 - [HIGH] Session Hijacking Risk via Missing User-Agent Binding
**Vulnerability:** The session cookie signature verification only checked the validity of the cookie payload (`val.expiry`) but did not verify the client's identity, allowing a stolen cookie to be used on any device.
**Learning:** Signed cookies prove *who* issued the cookie, but not *who* it was issued to. Without binding to client properties (like User-Agent), sessions are portable and easily hijacked.
**Prevention:** Include a hash of the User-Agent (or other client fingerprints) in the signed data during session creation, and verify it matches the current request's User-Agent on every check.

## 2026-06-25 - [MEDIUM] Missing Security Headers in Static Serve
**Vulnerability:** The project uses `serve out` to simulate production, but the security headers defined in `next.config.mjs` (CSP, HSTS, etc.) were not applied by `serve`, leaving the production verification environment vulnerable.
**Learning:** Next.js config headers are only applied by the Next.js server. Static file servers (like `serve`) require their own configuration.
**Prevention:** Explicitly configure the static server (e.g., via `package.json` "serve" property) to include necessary security headers.

## 2026-07-20 - [HIGH] Unanchored Regex in SmartImage Component
**Vulnerability:** The `YOUTUBE_REGEX` in `SmartImage` component was unanchored, allowing URLs containing "youtube.com" in the path (e.g. `https://evil.com/?u=youtube.com/watch?v=...`) to be incorrectly identified as YouTube videos, potentially leading to content spoofing or unexpected iframe rendering.
**Learning:** Regex validation must always be anchored (`^...$`) to ensure the entire string matches the expected pattern, especially when determining content type or origin.
**Prevention:** Use `^` anchor at the start of regex patterns used for URL validation.
