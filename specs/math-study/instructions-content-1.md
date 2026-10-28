# Work 지침 D1 — 콘텐츠: unit-01, unit-02

## 목표
`specs/math-study/spec.md` 3절의 unit-01(함수와 지수·로그), unit-02(벡터와 행렬) 콘텐츠를 5절 스키마대로 작성한다. 고등수학 수준에서 쉽게 시작해 AI 연결 포인트까지 이어지는, 설명이 친절한 한국어 글.

## 수정 가능 범위 (이 외 수정 금지)
- 생성: `assets/js/math/units/unit-01.js`, `assets/js/math/units/unit-02.js`
- 읽기만: 나머지 전부

## 요구
- 파일 형식: `window.MATH_UNITS.push({ id, order, title, summary, sections, quiz });` (spec.md 5절 스키마). `id`는 파일명과 일치(`unit-01`), `order`는 1, 2.
- 섹션 3~5개(각 섹션: 개념 설명 + 수식 + 가능하면 `example`), 퀴즈 정확히 5문항(4지선다, `answer`는 0부터의 인덱스, 정답 인덱스를 문항마다 고르게 분산).
- 수식은 `$...$`, `$$...$$`. JS 문자열 안 백슬래시는 `\\frac`처럼 이스케이프.
- spec.md 3절 "단원별 검증용 예제"의 수치를 반드시 일치시킨다.
- **수학 정확성이 최우선.** 새로 만든 계산 문제는 `node -e`로 직접 계산해 정답과 해설 수치를 확인한다. 퀴즈마다 정답이 정확히 하나여야 하고 오답 보기가 우연히 정답이 되면 안 된다.
- 완성 후 `node -e`로 두 파일을 로드해(`global.window={MATH_UNITS:[]}` 후 require 또는 vm) 스키마(필드 존재, quiz 5개, choices 4개, answer 범위)를 검증한다.

## 보고
생성 파일, 검증 결과를 짧게 보고한다. git 커밋 금지.
