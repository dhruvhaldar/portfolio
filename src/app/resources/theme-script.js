/**
 * Inline script to detect system theme preference and prevent FOUC.
 * This script is injected into the document head/body before content renders.
 */
export const themeScript = `
(function() {
  try {
    var localTheme = localStorage.getItem('theme');
    var supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches === true;
    
    // If user has manually selected dark, satisfy that.
    // If user has no preference but system is dark, satisfy that.
    if (localTheme === 'dark' || (!localTheme && supportDarkMode)) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    } else {
      // Default is light (usually set by server), so we don't need to do anything
      // unless we want to explicitly enforce light if system is dark but user chose light.
      if (localTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        document.documentElement.classList.remove('dark');
      }
    }
  } catch (e) {
    // Fail silently to avoid interrupting the page load
  }
})();
`;
