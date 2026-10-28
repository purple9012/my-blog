# Plan 서브에이전트 지침 — Todo 앱

## 목표
`todo.html` 단일 파일(HTML+CSS+JS 인라인)로 만드는 원페이지 할 일 목록 웹 앱의 명세서 `specs/todo-app/spec.md`를 작성한다. 그리고 `index.html`에서 이 페이지로 링크를 거는 방법도 명세에 포함한다.

## 수정 가능 범위
- 생성/수정 가능: `specs/todo-app/spec.md` **단 하나**
- 그 외 모든 파일은 읽기만 가능. 코드 구현 금지.

## 참고할 기존 파일
- `index.html` — 헤더의 `site-header-links`에 2048 게임 링크가 있음. 같은 방식으로 링크를 추가할 계획을 쓸 것.
- `game-2048.html`, `assets/css/style.css` — 기존 사이트 톤/디자인 변수(다크모드 포함 여부) 파악.
- `specs/2048-game/spec.md` — 명세서 형식 참고.

## 사용자 요구사항 (원문)
HTML, CSS, JavaScript로 간단하게 할 일 목록(Todo list)을 작성할 수 있는 원페이지 웹 앱을 todo.html 파일 하나로 만들고 index.html에 링크를 건다.

## spec.md에 포함할 내용
1. 개요 및 범위 (포함/제외 기능 — 간단하게 유지, 과도한 기능 금지)
2. 기능 목록 (추가, 완료 토글, 삭제, 남은 개수 표시, localStorage 저장 여부 등을 제안하고 근거 한 줄)
3. 화면 구성 (와이어프레임 텍스트)
4. 파일 구조 (todo.html 하나에 CSS/JS 인라인, 기존 style.css 사용 여부 결정)
5. index.html 링크 변경 내용 (정확한 위치와 마크업)
6. 검증 체크리스트 (Review 단계에서 사용할 항목)
7. 사용자에게 확인이 필요한 열린 질문 (있다면)

## 규칙
- 간결하게 작성. 한국어로 작성.
