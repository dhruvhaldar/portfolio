# Jules Agent Instructions

## Critical Tests
- **Space Debris Image Verification**: The test `tests/verify-stuffinspace-image.spec.ts` MUST pass in every build and after any code restructuring.
  - This test verifies that the `stuffinspace2.avif` image renders correctly.
  - **Context**: The project uses `output: 'export'`, which is incompatible with Next.js default image optimization. We rely on `images: { unoptimized: true }` in `next.config.mjs` to ensure images (especially animated ones like this AVIF) are served correctly.
