(function () {
  var container = document.getElementById('unit-list');
  if (!container) return;

  var units = window.MathApp ? window.MathApp.getUnits() : [];

  if (!units.length) {
    var notice = document.createElement('p');
    notice.className = 'math-notice';
    notice.textContent = '표시할 단원이 없습니다.';
    container.appendChild(notice);
    return;
  }

  var list = document.createElement('ul');
  list.className = 'math-unit-list';

  units.forEach(function (unit) {
    var li = document.createElement('li');
    li.className = 'math-unit-card';

    var title = document.createElement('h2');
    title.className = 'math-unit-title';
    title.textContent = unit.order + '. ' + unit.title;
    li.appendChild(title);

    var summary = document.createElement('p');
    summary.className = 'math-unit-summary';
    summary.textContent = unit.summary || '';
    li.appendChild(summary);

    var actions = document.createElement('div');
    actions.className = 'math-unit-actions';

    var id = encodeURIComponent(unit.id);

    var lesson = document.createElement('a');
    lesson.className = 'math-btn';
    lesson.href = 'math-lesson.html?unit=' + id;
    lesson.textContent = '학습하기';
    actions.appendChild(lesson);

    var quiz = document.createElement('a');
    quiz.className = 'math-btn';
    quiz.href = 'math-quiz.html?unit=' + id;
    quiz.textContent = '퀴즈';
    actions.appendChild(quiz);

    li.appendChild(actions);
    list.appendChild(li);
  });

  container.appendChild(list);
})();
