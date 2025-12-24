## 2024-03-24 - Accessible Labels for Icon-Only Buttons

**Learning:**
Discovered that responsive designs often toggle between text-labeled buttons for desktop and icon-only buttons for mobile. While the desktop versions are accessible by default (due to visible text), the mobile versions often strip the text label without adding an `aria-label` or `title` substitute. This leaves screen reader users on mobile devices navigating a list of "unlabeled buttons," significantly degrading the experience.

**Action:**
When hiding text labels for responsiveness (e.g., using `display: none` or conditional rendering), always ensure the icon-only alternative includes a descriptive `aria-label` mirroring the hidden text content.
