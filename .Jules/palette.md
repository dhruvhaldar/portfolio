## 2025-04-05 - Carousel Focus Visibility
**Learning:** Carousel pagination controls (indicators and thumbnails) implemented as generic Flex components lack default keyboard focus indicators. Even when given `role="button"` and `tabIndex={0}`, they are invisible to keyboard users without explicitly mapping a focus-visible outline.
**Action:** Always map the shared `.element` style from `SharedInteractiveStyles.module.scss` (which provides a standard `:focus-visible` ring) to custom interactive components in this design system.
