# 공통 API / CSS 문서 (화면 에이전트용)

## 1. `window.MathApp` (assets/js/math/common.js)

| 함수 | 동작 |
|---|---|
| `getUnits()` | `window.MATH_UNITS` 복사본을 `order` 오름차순으로 정렬해 배열 반환. 없으면 `[]` |
| `getUnit(id)` | `id`가 일치하는 단원 객체 반환, 없으면 `null` |
| `getQueryUnit()` | URL `?unit=` 값을 문자열로 반환, 파라미터 없으면 `null` (빈 값이면 `""`) |
| `renderMath(el)` | `el`(생략 시 `document.body`) 안의 `$..$`(인라인), `$$..$$`(블록)를 KaTeX auto-render로 렌더. 성공 시 `true`. KaTeX 미로드/예외 시 `main` 맨 위에 `.math-notice` "수식 로드 실패..." 한 줄을 (중복 없이) 삽입하고 `false` 반환, 이후 동작은 계속 |

주의: `innerHTML`로 콘텐츠를 넣은 **뒤에** `renderMath(컨테이너)`를 호출한다. 동적으로 내용을 바꿀 때마다 다시 호출한다. 진도·localStorage는 사용하지 않는다.

## 2. CSS 클래스 (assets/css/math.css)

| 클래스 | 용도 |
|---|---|
| `main.math-main` | 화면 본문 컨테이너(`<main class="math-main">`) |
| `.math-page-title` | 화면 제목(h1/h2) |
| `.math-topbar` | 상단 이동 링크 줄(왼쪽 링크, 오른쪽 `.math-progress` 등). 링크 터치 영역 40px |
| `.math-progress` | 퀴즈 "(2 / 5)" 표시 |
| `.math-notice` | 안내 문구(오류/없음 안내). 단원 없음 안내에도 사용 |
| `.math-unit-list` / `.math-unit-card` / `.math-unit-title` / `.math-unit-summary` / `.math-unit-actions` | 화면 1 단원 카드 목록 |
| `.math-btn` | 버튼/링크 버튼 공통(`<a>`, `<button>` 모두). `:disabled` 스타일 포함 |
| `.math-btn-primary` | 강조 버튼(채움) |
| `.math-section` / `.math-section-heading` / `.math-section-body` | 학습 섹션 |
| `.math-example` / `.math-example-label` / `.math-example-question` | 예제 박스 |
| `.math-toggle` | 풀이 보기 버튼(`.math-btn`과 함께) |
| `.math-solution` | 풀이 영역. `hidden` 속성으로 숨김/표시 |
| `.math-nav` | 하단 링크 줄(퀴즈 풀기, 이전/다음 단원). 양끝 정렬 |
| `.math-question` | 퀴즈 문제문 |
| `.math-choices` / `.math-choice` / `.math-choice-text` | 보기 목록(ul > li > label). 안에 `input[type=radio]` |
| `.math-choice.is-selected` | 선택된 보기 |
| `.math-choice.is-correct` | 정답 보기(굵은 테두리) |
| `.math-choice.is-wrong` | 선택한 오답 보기(점선 + 취소선) |
| `.math-choice.is-disabled` | 채점 후 비활성(커서 기본) |
| `.math-feedback` (+ `.is-correct` / `.is-wrong`) | 채점 결과+해설 박스. `hidden`으로 숨김 |
| `.math-feedback-result` / `.math-explanation` | "정답!/오답" 문구 / 해설 |
| `.math-result` / `.math-result-score` / `.math-result-message` | 퀴즈 결과 화면 |
| `.math-actions` | 결과/버튼 줄(가운데 정렬) |

정답/오답은 색뿐 아니라 테두리 굵기·점선·취소선·"정답!/오답" 텍스트로도 구분된다.

### 마크업 예시

화면 1 (목록):
```html
<ul class="math-unit-list">
  <li class="math-unit-card">
    <h2 class="math-unit-title">1. 함수와 지수·로그</h2>
    <p class="math-unit-summary">활성화 함수(시그모이드), 로그 손실</p>
    <div class="math-unit-actions">
      <a class="math-btn" href="math-lesson.html?unit=unit-01">학습하기</a>
      <a class="math-btn" href="math-quiz.html?unit=unit-01">퀴즈</a>
    </div>
  </li>
</ul>
```

화면 2 (학습):
```html
<div class="math-topbar"><a href="math-study.html">← 단원 목록</a></div>
<h1 class="math-page-title">1. 함수와 지수·로그</h1>
<section class="math-section">
  <h2 class="math-section-heading">이차함수와 꼭짓점</h2>
  <div class="math-section-body">본문 HTML ... $f(x)=(x-2)^2-1$</div>
  <div class="math-example">
    <span class="math-example-label">예제</span>
    <div class="math-example-question">문제 HTML</div>
    <button type="button" class="math-btn math-toggle" aria-expanded="false">풀이 보기 ▼</button>
    <div class="math-solution" hidden>풀이 HTML</div>
  </div>
</section>
<div class="math-nav">
  <a class="math-btn math-btn-primary" href="math-quiz.html?unit=unit-01">퀴즈 풀기 →</a>
  <a class="math-btn" href="math-lesson.html?unit=unit-02">다음 단원 →</a>
</div>
```

화면 3 (퀴즈):
```html
<div class="math-topbar">
  <a href="math-study.html">← 단원 목록</a>
  <span class="math-progress">2 / 5</span>
</div>
<h1 class="math-page-title">퀴즈: 1. 함수와 지수·로그</h1>
<p class="math-question">$\log_2 8$ 의 값은?</p>
<ul class="math-choices">
  <li><label class="math-choice">
    <input type="radio" name="choice" value="0">
    <span class="math-choice-text">3</span>
  </label></li>
</ul>
<button type="button" class="math-btn math-btn-primary" disabled>정답 확인</button>
<div class="math-feedback is-correct" hidden>
  <p class="math-feedback-result">정답!</p>
  <p class="math-explanation">해설 HTML</p>
</div>
<div class="math-result">
  <p class="math-result-score">4 / 5</p>
  <p class="math-result-message">수고했어요</p>
  <div class="math-actions">
    <button type="button" class="math-btn math-btn-primary">다시 풀기</button>
    <a class="math-btn" href="math-study.html">단원 목록</a>
  </div>
</div>
```
참고: `.math-choice` 클래스는 `label`에 붙이고(`is-*` 클래스도 label에), 보기 `li`에는 클래스를 주지 않아도 된다. 필요한 클래스가 없으면 직접 math.css를 수정하지 말고 메인에게 보고.

## 3. 각 화면 HTML 로드 순서

`<head>`:
```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AI를 위한 수학</title>
<link rel="stylesheet" href="assets/css/style.css">
<link rel="stylesheet" href="assets/css/math.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
```

`</body>` 직전 (순서 고정):
```html
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"></script>
<script src="assets/js/math/units-index.js"></script>
<script src="assets/js/math/units/unit-01.js"></script>
<script src="assets/js/math/units/unit-02.js"></script>
<script src="assets/js/math/units/unit-03.js"></script>
<script src="assets/js/math/units/unit-04.js"></script>
<script src="assets/js/math/common.js"></script>
<script src="assets/js/math/list.js"></script> <!-- 화면별: list.js / lesson.js / quiz.js -->
```

## 4. 사이트 헤더 골격 (index.html과 동일)

```html
<body>
  <header class="site-header">
    <div class="site-header-inner">
      <p class="site-title"><a href="index.html">my-blog</a></p>
    </div>
  </header>

  <main class="math-main">
    ...
  </main>
</body>
```
