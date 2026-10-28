(function () {
  "use strict";

  var NOTICE_ID = "math-katex-notice";

  function getUnits() {
    var list = (window.MATH_UNITS || []).slice();
    list.sort(function (a, b) {
      return (a.order || 0) - (b.order || 0);
    });
    return list;
  }

  function getUnit(id) {
    var units = getUnits();
    for (var i = 0; i < units.length; i++) {
      if (units[i].id === id) {
        return units[i];
      }
    }
    return null;
  }

  function getQueryUnit() {
    var search = window.location.search || "";
    if (search.charAt(0) === "?") {
      search = search.substring(1);
    }
    var parts = search.split("&");
    for (var i = 0; i < parts.length; i++) {
      var kv = parts[i].split("=");
      if (kv[0] === "unit") {
        try {
          return decodeURIComponent((kv[1] || "").replace(/\+/g, " "));
        } catch (e) {
          return kv[1] || "";
        }
      }
    }
    return null;
  }

  function showNotice() {
    if (document.getElementById(NOTICE_ID)) {
      return;
    }
    var p = document.createElement("p");
    p.id = NOTICE_ID;
    p.className = "math-notice";
    p.setAttribute("role", "alert");
    p.textContent = "수식 로드 실패: 수식이 LaTeX 원문으로 표시됩니다.";
    var main = document.querySelector("main") || document.body;
    main.insertBefore(p, main.firstChild);
  }

  function renderMath(el) {
    var target = el || document.body;
    if (typeof window.renderMathInElement !== "function") {
      showNotice();
      return false;
    }
    try {
      window.renderMathInElement(target, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false }
        ],
        throwOnError: false
      });
      return true;
    } catch (e) {
      showNotice();
      return false;
    }
  }

  window.MathApp = {
    getUnits: getUnits,
    getUnit: getUnit,
    getQueryUnit: getQueryUnit,
    renderMath: renderMath
  };
})();
