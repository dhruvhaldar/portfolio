## 2024-05-30 - Carousel Active State Announcement
**Learning:** Adding interactive navigation buttons inside a Carousel component requires `aria-current="true"` to accurately communicate which slide is currently active to screen reader users, rather than relying solely on visual cues like background color or borders.
**Action:** Ensure that all components representing an active/selected state in a set (like pagination dots, thumbnails, or tab panels) explicitly set `aria-current="true"` (or `aria-selected` / `aria-pressed` as appropriate for their role) when active.
