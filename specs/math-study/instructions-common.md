# Work 지침 0 — 공통 (먼저 실행)

## 목표
`specs/math-study/spec.md`의 공통 부분을 구현하고, 화면 담당 에이전트들이 쓸 **공통 API/CSS 클래스 문서**를 만든다.

## 수정 가능 범위 (이 외 수정 금지)
- 생성: `assets/css/math.css`
- 생성: `assets/js/math/common.js`
- 생성: `assets/js/math/units-index.js` (`window.MATH_UNITS = window.MATH_UNITS || [];`)
- 수정: `index.html` (spec 7절: 할 일 목록 링크 뒤에 `<a href="math-study.html">AI를 위한 수학</a>` 추가)
- 생성: `specs/math-study/common-api.md` (아래 내용)
- 읽기만: `assets/css/style.css`, `todo.html`, spec.md 등 나머지 전부

## 구현 요구
- spec.md 1절(기술 스펙), 4절(화면 공통 구성), 5절(스키마), 공통 API를 따른다. 진도·localStorage는 쓰지 않는다.
- `common.js`: `getUnits()`(order 정렬), `getUnit(id)`, `getQueryUnit()`(URL `?unit=` 값 반환), `renderMath(el)`(KaTeX auto-render 호출, 미로드면 상단에 "수식 로드 실패" 안내 한 줄 표시 후 계속 동작). ES5~ES2015, 전역 네임스페스는 `window.MathApp` 하나로 노출.
- `math.css`: 기존 `style.css`의 CSS 변수만 사용(색 하드코딩 금지). 단원 카드, 학습 섹션, 예제/풀이 토글, 퀴즈(보기 라디오, 정답/오답 표시, 해설, 결과), 버튼, 안내 문구(`.math-notice`), 긴 수식 가로 스크롤(`.katex-display { overflow-x: auto }`), 모바일 375px 가로 스크롤 없음, 터치 영역 약 40px.
- 모든 경로는 상대경로, 파일명 소문자.

## common-api.md 내용 (필수)
화면 에이전트가 이것만 보고 작업할 수 있도록:
1. `MathApp`의 함수 시그니처와 동작
2. 사용 가능한 CSS 클래스 목록과 용도, 각 화면용 마크업 예시 조각
3. 각 화면 HTML이 로드해야 할 CSS/스크립트 순서(KaTeX 0.16.9 jsdelivr CDN 태그를 그대로 복붙 가능한 형태로, `integrity` 없이 버전 고정 URL만)
4. 사이트 헤더 마크업 골격(`index.html`과 동일)

## 보고
완료 후 생성/수정 파일과 확인하지 못한 항목을 짧게 보고한다. git 커밋 금지.
