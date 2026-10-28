# Work 지침 A — 화면 1: 단원 목록

## 목표
`specs/math-study/spec.md` 4절 "화면 1 — 단원 목록"을 구현한다. 진도 체크는 범위 제외이므로 진도 요약, 완료 표시, 최고 점수는 만들지 않는다.

## 수정 가능 범위 (이 외 수정 금지)
- 생성: `math-study.html`, `assets/js/math/list.js`
- 읽기만: `specs/math-study/common-api.md`, `spec.md`, `assets/css/math.css`, `assets/js/math/common.js`, `index.html` 등 나머지 전부
- 필요한 CSS 클래스가 `math.css`에 없으면 수정하지 말고 보고에 적는다. 인라인 `<style>`을 쓰지 말고, 부족하면 보고만 한다.

## 요구
- 먼저 `specs/math-study/common-api.md`를 읽고 그 로드 순서/마크업/API를 그대로 따른다.
- 단원 카드를 `MathApp.getUnits()` 결과로 생성: 번호+제목, `summary`(AI 연결 포인트), "학습하기"(`math-lesson.html?unit=ID`)와 "퀴즈"(`math-quiz.html?unit=ID`) 링크.
- 단원이 0개면 안내 문구 표시.
- 렌더링은 `textContent`/DOM 생성 우선(제목·요약). 콘텐츠 HTML이 필요한 곳만 `innerHTML`.
- 헤더에서 `index.html`로 돌아갈 수 있어야 한다. 모든 경로 상대경로.
- 단원 스크립트는 `unit-01.js`~`unit-04.js` 4개를 로드 순서 규칙대로 포함.

## 보고
생성 파일과 확인하지 못한 항목, 공통 CSS 부족 사항을 짧게 보고한다. git 커밋 금지.
