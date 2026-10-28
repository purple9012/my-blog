# Work 지침 B — 화면 2: 단원 학습

## 목표
`specs/math-study/spec.md` 4절 "화면 2 — 단원 학습"을 구현한다. 진도 체크(학습 완료 토글)는 범위 제외이므로 만들지 않는다.

## 수정 가능 범위 (이 외 수정 금지)
- 생성: `math-lesson.html`, `assets/js/math/lesson.js`
- 읽기만: `specs/math-study/common-api.md`, `spec.md`, `assets/css/math.css`, `assets/js/math/common.js` 등 나머지 전부
- 필요한 CSS 클래스가 `math.css`에 없으면 수정하지 말고 보고에 적는다.

## 요구
- 먼저 `specs/math-study/common-api.md`를 읽고 그 로드 순서/마크업/API를 그대로 따른다.
- `MathApp.getQueryUnit()`으로 단원 결정. 없거나 잘못된 값이면 "단원을 찾을 수 없습니다" + `math-study.html` 링크.
- 섹션별 렌더: heading, body(HTML), `example`이 있으면 문제 + "풀이 보기" 토글(기본 접힘, 키보드 접근 가능한 `<button>` 또는 `<details>`).
- 렌더 후 `MathApp.renderMath()` 호출(풀이 토글을 열 때도 수식이 렌더되도록, 접힌 내용도 미리 렌더).
- 하단: "퀴즈 풀기"(`math-quiz.html?unit=ID`), 이전/다음 단원 링크(order 기준, 없으면 숨김), 단원 목록 링크.
- 모든 경로 상대경로. 단원 스크립트 `unit-01.js`~`unit-04.js`를 로드 순서 규칙대로 포함.

## 보고
생성 파일과 확인하지 못한 항목, 공통 CSS 부족 사항을 짧게 보고한다. git 커밋 금지.
