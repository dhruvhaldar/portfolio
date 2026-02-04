# Jules Agent Instructions

## LCP Optimization
- **LCP Image Priority**: Ensure that the Largest Contentful Paint (LCP) image always has `priority={true}` (and consequently `fetchPriority="high"`) applied.
  - This is critical for performance metrics. Do not disable this feature or lazy-load the LCP image.
  - In `SmartImage.tsx`, the `preload` or `priority` prop controls this behavior.
