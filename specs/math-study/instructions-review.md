# Review 서브에이전트 지침 — AI를 위한 수학 학습 웹

## 목표
구현된 수학 학습 웹을 `specs/math-study/spec.md` 8절 체크리스트로 테스트하고 `specs/math-study/review.md`를 작성한다.

## 수정 가능 범위
- 생성/수정: `specs/math-study/review.md` **단 하나**
- 그 외 모든 파일은 **수정 금지**. 버그를 찾아도 고치지 말고 review.md에 기록만 한다.
- 임시 파일은 스크래치 디렉터리(`C:\Users\lotte\AppData\Local\Temp\claude\D--test-my-blog-master\25dff207-094e-4b5b-85ec-607faae67252\scratchpad`)에만 만든다.

## 대상 파일
`index.html`, `math-study.html`, `math-lesson.html`, `math-quiz.html`, `assets/css/math.css`, `assets/js/math/**`

## 테스트 방법
1. **수학 내용 정확성 (가장 중요):** 4개 단원의 모든 설명 수식, 예제 풀이, 퀴즈 20문항을 직접 읽고 `node -e`로 재계산한다. 각 문항에서 정답 인덱스가 맞는지, 정답이 정확히 하나인지, 해설 수치가 맞는지, 설명 문장에 수학적 오류가 없는지 확인한다. 문항별로 결과를 표로 기록한다.
2. **스키마/로드:** `node`의 `vm`으로 4개 단원 파일을 로드해 필드, quiz 5개, choices 4개, answer 범위, id와 파일명 일치, order 중복 없음을 검증한다.
3. **퀴즈 로직:** 가능하면 `vm`+간단한 DOM 스텁으로, 불가능하면 코드 리뷰로 채점/다음/결과/다시 풀기 흐름과 선택 없이 확인 불가 조건을 확인한다.
4. **브라우저 테스트:** claude-in-chrome으로 `file:///D:/test/my-blog-master/index.html`부터 링크를 따라 실제 동작 확인을 시도한다. `file://` 이동이 2~3회 실패하면 중단하고 코드 리뷰로 대체했음을 명시한다. 로컬 서버(`python -m http.server` 등)를 스크래치 디렉터리가 아닌 프로젝트 루트에서 실행하는 것은 허용하되, 끝나면 반드시 종료한다. alert/confirm 모달은 피한다.
5. **정적 점검:** `localStorage` 미사용, `/assets/` 절대경로 없음, 파일명 소문자·대소문자 일치(HTML이 참조하는 모든 파일이 실제 존재), script 로드 순서(KaTeX → units-index → unit들 → common → 화면 js), KaTeX 버전 0.16.9 고정, 색 하드코딩 여부, 지침 범위 외 파일 변경 없음(`git status`로 확인).

## review.md 형식
1. 요약: 통과/실패/미확인 개수와 커밋 가능 여부 의견
2. 체크리스트 결과 표: ✅ 통과 / ❌ 실패 / ⚠️ 미확인(사유). 실제 실행으로 확인한 것과 코드 읽기로만 판단한 것을 구분
3. 퀴즈 20문항 검증 표
4. 발견된 문제 (심각도 높음/중간/낮음, 재현 방법, 파일:줄)
5. 테스트 방식 명시 (실행 vs 코드 리뷰)

## 규칙
- 한국어로 간결하게. 완료 후 요약을 짧게 보고한다. 수학 오류나 동작하지 않는 화면은 반드시 "높음"으로 표기한다.
