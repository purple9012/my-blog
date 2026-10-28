# Work 서브에이전트 지침 — Todo 앱 구현

## 목표
`specs/todo-app/spec.md`를 읽고 그대로 구현한다.

## 수정 가능 범위
- 생성: `todo.html` (CSS/JS 인라인, 단일 파일)
- 수정: `index.html` — 14행 `site-header-links`에 `<a href="todo.html">할 일 목록</a>` 추가 (spec 5절)
- 그 외 파일(`assets/css/style.css` 포함)은 **수정 금지**. 읽기만 가능.
- 링크 간격이 붙어 보이면 style.css를 고치지 말고 `index.html` 마크업(공백/구분자)으로 해결한다. 그래도 안 되면 수정하지 말고 보고한다.

## 확정된 결정 (spec 7절 열린 질문)
1. localStorage 저장 포함 (키 `todo-items`)
2. "완료 항목 지우기" 버튼 제외
3. 링크 문구: "할 일 목록"
4. style.css 수정 안 함

## 규칙
- spec.md의 기능/화면/접근성/XSS(textContent) 요구사항을 모두 충족한다.
- 기존 `assets/css/style.css`를 링크해 색상 변수·헤더·푸터를 재사용하고, Todo 전용 스타일만 인라인 `<style>`에 둔다.
- 외부 라이브러리/CDN 금지. 한국어 UI.
- git 커밋은 하지 않는다 (메인이 처리).
- 완료 후 변경 파일과 spec 6절 체크리스트 중 직접 확인하지 못한 항목을 짧게 보고한다.
