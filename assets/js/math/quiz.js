(function () {
  'use strict';

  var root = document.getElementById('quiz-root');
  var unitId = MathApp.getQueryUnit();
  var unit = unitId ? MathApp.getUnit(unitId) : null;

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  function topbar(progressText) {
    var bar = el('div', 'math-topbar');
    var a = el('a');
    a.href = 'math-study.html';
    a.textContent = '← 단원 목록';
    bar.appendChild(a);
    if (progressText) bar.appendChild(el('span', 'math-progress', progressText));
    return bar;
  }

  function showNotFound(msg) {
    root.innerHTML = '';
    root.appendChild(topbar());
    var n = el('p', 'math-notice');
    n.appendChild(document.createTextNode(msg + ' '));
    var a = el('a');
    a.href = 'math-study.html';
    a.textContent = '단원 목록으로 이동';
    n.appendChild(a);
    root.appendChild(n);
  }

  if (!unit) {
    showNotFound('단원을 찾을 수 없습니다.');
    return;
  }
  var quiz = unit.quiz || [];
  if (!quiz.length) {
    showNotFound('이 단원에는 퀴즈가 없습니다.');
    return;
  }

  var title = unit.order + '. ' + unit.title;
  var index = 0;
  var score = 0;

  function renderQuestion() {
    var q = quiz[index];
    var graded = false;
    root.innerHTML = '';
    root.appendChild(topbar('(' + (index + 1) + ' / ' + quiz.length + ')'));
    var h = el('h1', 'math-page-title');
    h.textContent = '퀴즈: ' + title;
    root.appendChild(h);
    root.appendChild(el('p', 'math-question', q.question));

    var ul = el('ul', 'math-choices');
    ul.setAttribute('role', 'radiogroup');
    var labels = [];
    var inputs = [];
    q.choices.forEach(function (c, i) {
      var li = document.createElement('li');
      var label = el('label', 'math-choice');
      var input = document.createElement('input');
      input.type = 'radio';
      input.name = 'choice';
      input.value = String(i);
      label.appendChild(input);
      label.appendChild(el('span', 'math-choice-text', c));
      li.appendChild(label);
      ul.appendChild(li);
      labels.push(label);
      inputs.push(input);
    });
    root.appendChild(ul);

    var check = el('button', 'math-btn math-btn-primary', '정답 확인');
    check.type = 'button';
    check.disabled = true;
    root.appendChild(check);

    var hint = el('p', 'math-notice', '');
    hint.hidden = true;
    root.appendChild(hint);

    var fb = el('div', 'math-feedback');
    fb.hidden = true;
    fb.setAttribute('aria-live', 'polite');
    var fbResult = el('p', 'math-feedback-result');
    var fbExp = el('p', 'math-explanation');
    fb.appendChild(fbResult);
    fb.appendChild(fbExp);
    root.appendChild(fb);

    var actions = el('div', 'math-actions');
    var next = el('button', 'math-btn math-btn-primary',
      index === quiz.length - 1 ? '결과 보기' : '다음 →');
    next.type = 'button';
    next.hidden = true;
    actions.appendChild(next);
    root.appendChild(actions);

    function selected() {
      for (var i = 0; i < inputs.length; i++) if (inputs[i].checked) return i;
      return -1;
    }

    ul.addEventListener('change', function () {
      if (graded) return;
      var s = selected();
      labels.forEach(function (l, i) { l.classList.toggle('is-selected', i === s); });
      check.disabled = s < 0;
    });

    check.addEventListener('click', function () {
      var s = selected();
      if (graded) return;
      if (s < 0) {
        hint.textContent = '보기를 선택해 주세요.';
        hint.hidden = false;
        return;
      }
      graded = true;
      var ok = s === q.answer;
      if (ok) score++;
      inputs.forEach(function (inp) { inp.disabled = true; });
      labels.forEach(function (l, i) {
        l.classList.add('is-disabled');
        l.classList.remove('is-selected');
        if (i === q.answer) l.classList.add('is-correct');
        else if (i === s) l.classList.add('is-wrong');
      });
      check.disabled = true;
      hint.hidden = true;
      fb.classList.add(ok ? 'is-correct' : 'is-wrong');
      fbResult.textContent = ok ? '정답!' : '오답';
      fbExp.innerHTML = q.explanation || '';
      fb.hidden = false;
      next.hidden = false;
      MathApp.renderMath(root);
      next.focus();
    });

    next.addEventListener('click', function () {
      index++;
      if (index < quiz.length) renderQuestion();
      else renderResult();
    });

    MathApp.renderMath(root);
    inputs[0].focus();
  }

  function renderResult() {
    root.innerHTML = '';
    root.appendChild(topbar());
    var h = el('h1', 'math-page-title');
    h.textContent = '퀴즈 결과: ' + title;
    root.appendChild(h);

    var box = el('div', 'math-result');
    var sc = el('p', 'math-result-score');
    sc.textContent = '점수 ' + score + ' / ' + quiz.length;
    box.appendChild(sc);
    var msg = score === quiz.length ? '만점이에요!' :
      score >= quiz.length * 0.6 ? '수고했어요' : '학습 내용을 다시 복습해 보세요';
    box.appendChild(el('p', 'math-result-message', msg));

    var actions = el('div', 'math-actions');
    var retry = el('button', 'math-btn math-btn-primary', '다시 풀기');
    retry.type = 'button';
    retry.addEventListener('click', function () {
      index = 0;
      score = 0;
      renderQuestion();
    });
    var lesson = el('a', 'math-btn', '학습으로 돌아가기');
    lesson.href = 'math-lesson.html?unit=' + encodeURIComponent(unit.id);
    var list = el('a', 'math-btn', '단원 목록');
    list.href = 'math-study.html';
    actions.appendChild(retry);
    actions.appendChild(lesson);
    actions.appendChild(list);
    box.appendChild(actions);
    root.appendChild(box);
    retry.focus();
  }

  renderQuestion();
})();
