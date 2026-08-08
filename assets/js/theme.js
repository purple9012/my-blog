(function () {
  const STORAGE_KEY = "theme";

  function getStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function getPreferredTheme() {
    const stored = getStoredTheme();
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    const toggle = document.querySelector("[data-theme-toggle]");
    if (toggle) {
      toggle.textContent = theme === "dark" ? "☀️ 라이트 모드" : "🌙 다크 모드";
      toggle.setAttribute("aria-pressed", theme === "dark");
    }
  }

  function setTheme(theme) {
    applyTheme(theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      /* localStorage 접근 불가 시 무시 */
    }
  }

  applyTheme(getPreferredTheme());

  document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.querySelector("[data-theme-toggle]");
    applyTheme(getPreferredTheme());
    if (toggle) {
      toggle.addEventListener("click", () => {
        const current = document.documentElement.getAttribute("data-theme");
        setTheme(current === "dark" ? "light" : "dark");
      });
    }
  });
})();
