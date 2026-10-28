(function () {
  'use strict';

  var root = document.getElementById('lesson-root');
  if (!root) return;

  function el(tag, className, html) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (html != null) node.innerHTML = html;
    return node;
  }

  function link(href, className, text) {
    var a = el('a', className);
    a.href = href;
    a.textContent = text;
    return a;
  }

  function renderNotFound() {
    var top = el('div', 'math-topbar');
    top.appendChild(link('math-study.html', '', '← 단원 목록'));
    root.appendChild(top);
    var p = el('p', 'math-notice');
    p.appendChild(document.createTextNode('단원을 찾을 수 없습니다. '));
    p.appendChild(link('math-study.html', '', '단원 목록으로 돌아가기'));
    root.appendChild(p);
  }

  function renderSection(sec) {
    var section = el('section', 'math-section');
    var h = el('h2', 'math-section-heading');
    h.textContent = sec.heading || '';
    section.appendChild(h);
    section.appendChild(el('div', 'math-section-body', sec.body || ''));

    if (sec.example) {
      var ex = el('div', 'math-example');
      var label = el('span', 'math-example-label');
      label.textContent = '예제';
      ex.appendChild(label);
      ex.appendChild(el('div', 'math-example-question', sec.example.question || ''));

      var btn = el('button', 'math-btn math-toggle');
      btn.type = 'button';
      btn.setAttribute('aria-expanded', 'false');
      btn.textContent = '풀이 보기 ▼';
      var sol = el('div', 'math-solution', sec.example.solution || '');
      sol.hidden = true;
      btn.addEventListener('click', function () {
        var open = sol.hidden;
        sol.hidden = !open;
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        btn.textContent = open ? '풀이 숨기기 ▲' : '풀이 보기 ▼';
      });
      ex.appendChild(btn);
      ex.appendChild(sol);
      section.appendChild(ex);
    }
    return section;
  }

  var id = MathApp.getQueryUnit();
  var unit = id ? MathApp.getUnit(id) : null;

  if (!unit) {
    renderNotFound();
    MathApp.renderMath(root);
    return;
  }

  document.title = unit.title + ' - AI를 위한 수학';

  var top = el('div', 'math-topbar');
  top.appendChild(link('math-study.html', '', '← 단원 목록'));
  root.appendChild(top);

  var title = el('h1', 'math-page-title');
  title.textContent = unit.order + '. ' + unit.title;
  root.appendChild(title);

  (unit.sections || []).forEach(function (sec) {
    root.appendChild(renderSection(sec));
  });

  var units = MathApp.getUnits();
  var idx = -1;
  for (var i = 0; i < units.length; i++) {
    if (units[i].id === unit.id) { idx = i; break; }
  }
  var prev = idx > 0 ? units[idx - 1] : null;
  var next = idx >= 0 && idx < units.length - 1 ? units[idx + 1] : null;

  var nav = el('div', 'math-nav');
  nav.appendChild(link('math-quiz.html?unit=' + encodeURIComponent(unit.id), 'math-btn math-btn-primary', '퀴즈 풀기 →'));
  if (prev) nav.appendChild(link('math-lesson.html?unit=' + encodeURIComponent(prev.id), 'math-btn', '← 이전 단원'));
  if (next) nav.appendChild(link('math-lesson.html?unit=' + encodeURIComponent(next.id), 'math-btn', '다음 단원 →'));
  nav.appendChild(link('math-study.html', 'math-btn', '단원 목록'));
  root.appendChild(nav);

  // 접힌 풀이까지 포함해 미리 렌더
  MathApp.renderMath(root);
})();
