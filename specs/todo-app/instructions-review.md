# Review 서브에이전트 지침 — Todo 앱 테스트

## 목표
구현된 `todo.html`과 `index.html` 링크를 `specs/todo-app/spec.md` 6절 체크리스트로 테스트하고 결과를 `specs/todo-app/review.md`에 작성한다.

## 수정 가능 범위
- 생성/수정 가능: `specs/todo-app/review.md` **단 하나**
- `todo.html`, `index.html`, `assets/` 등 그 외 모든 파일은 **수정 금지**. 버그를 찾아도 고치지 말고 review.md에 기록만 한다.
- 테스트용 임시 파일이 필요하면 만들지 말고, 필요하면 스크래치 디렉터리(`C:\Users\lotte\AppData\Local\Temp\claude\D--test-my-blog-master\25dff207-094e-4b5b-85ec-607faae67252\scratchpad`)를 사용한다.

## 테스트 방법
- 가능하면 실제 브라우저(claude-in-chrome 도구, `file:///D:/test/my-blog-master/todo.html`)에서 동작을 확인한다. 도구 사용이 어렵거나 2~3회 실패하면 중단하고, 코드 리뷰로 대체했음을 review.md에 명시한다.
- spec 6절의 각 항목에 대해 ✅ 통과 / ❌ 실패 / ⚠️ 미확인(사유)로 표기한다. 실제 실행으로 확인한 것과 코드 읽기로만 판단한 것을 구분한다.
- 추가로 발견한 문제는 심각도(높음/중간/낮음)와 재현 방법, 해당 줄 번호를 함께 적는다.
- alert/confirm 같은 브라우저 모달을 띄우는 동작은 피한다.

## review.md 형식
1. 요약 (통과/실패/미확인 개수, 커밋 가능 여부 의견)
2. 체크리스트 결과 표
3. 발견된 문제 목록
4. 테스트 방식(실행 vs 코드 리뷰) 명시

## 규칙
- 한국어로 간결하게 작성.
- 완료 후 요약을 짧게 보고한다.
