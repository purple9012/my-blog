# Work 지침 C — 화면 3: 퀴즈

## 목표
`specs/math-study/spec.md` 4절 "화면 3 — 퀴즈"를 구현한다. 점수·기록 저장은 범위 제외(저장 없음, `localStorage` 사용 금지).

## 수정 가능 범위 (이 외 수정 금지)
- 생성: `math-quiz.html`, `assets/js/math/quiz.js`
- 읽기만: `specs/math-study/common-api.md`, `spec.md`, `assets/css/math.css`, `assets/js/math/common.js` 등 나머지 전부
- 필요한 CSS 클래스가 `math.css`에 없으면 수정하지 말고 보고에 적는다.

## 요구
- 먼저 `specs/math-study/common-api.md`를 읽고 그 로드 순서/마크업/API를 그대로 따른다.
- `MathApp.getQueryUnit()`으로 단원 결정. 없거나 잘못된 값이면 "단원을 찾을 수 없습니다" + `math-study.html` 링크.
- 한 번에 한 문제: 진행 표시 `(2 / 5)`, 문제(수식 가능), 4지선다 라디오(보기 순서 고정). 선택 없이 "정답 확인"은 비활성 또는 안내.
- "정답 확인" 후 정답/오답 표시(색만이 아니라 텍스트도: "정답!"/"오답"), 정답 보기 강조, 해설 표시, 선택 변경 불가, "다음 →" (마지막 문제는 "결과 보기").
- 결과 화면: `점수 N / 5`, "다시 풀기"(초기화), "학습으로 돌아가기"(`math-lesson.html?unit=ID`), "단원 목록".
- 문제/보기/해설 표시 후 `MathApp.renderMath()`로 수식 렌더(매 화면 전환마다).
- 키보드만으로 조작 가능해야 한다. 모든 경로 상대경로. 단원 스크립트 `unit-01.js`~`unit-04.js`를 로드 순서 규칙대로 포함.

## 보고
생성 파일과 확인하지 못한 항목, 공통 CSS 부족 사항을 짧게 보고한다. git 커밋 금지.
