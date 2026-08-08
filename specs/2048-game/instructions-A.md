# 지침: 2048 게임 - 마크업 + 스타일 담당 (서브에이전트 A)

## 배경

`specs/2048-game/spec.md`에 정의된 2048 게임 페이지를 구현하는 작업이다. 작업은 관심사 단위로 2명(A/B)에게 분할되어 있고, 당신은 A(마크업+CSS) 담당이다. spec.md를 반드시 먼저 전체 읽어라 (특히 3절 화면/UI 명세, 5절 네비게이션, 6절 작업 분할의 "서브에이전트 A" 항목).

## 범위 (이것만 수정/생성한다)

- 신규 생성: `game-2048.html`
- 신규 생성: `assets/css/game-2048.css`
- 수정: `index.html` (헤더에 게임 페이지 링크 추가)
- 수정: `assets/css/style.css` (`.site-header-links` 스타일 추가, 필요 시 `.post-back-top` 관련 기존 스타일 참고만 하고 재정의는 하지 않음)

**절대 만들지 않는 것**: `assets/js/game-2048.js` (B 담당). 게임 상태 관리 JS 로직을 작성하지 마라.

## 해야 할 일

1. `index.html`, `post.html`, `assets/css/style.css`를 읽고 기존 헤더/푸터 골격, CSS 변수, 클래스 네이밍 컨벤션을 파악한다.
2. `game-2048.html`을 spec 3.1절의 구조대로 작성한다. `data-score`, `data-best`, `data-new-game`, `data-board`, `data-overlay`, `data-overlay-msg`, `data-overlay-retry` 등 spec에 명시된 모든 `data-*` 훅을 정확히 그대로 포함해야 한다 (B가 이 훅을 대상으로 JS를 작성하므로 이름이 다르면 통합이 깨진다). `<script src="assets/js/game-2048.js" defer></script>`를 포함하되, 아직 파일이 없어도 정상이다 (B가 만들 것).
3. `assets/css/game-2048.css`를 spec 3.2~3.5절대로 작성한다. 타일 숫자별 색상 클래스(`.tile-2`, `.tile-4`, `.tile-8`, ... `.tile-2048`, `.tile-super`)를 정의하고, 이 클래스 목록을 최종 보고에 명시해서 B가 그대로 사용할 수 있게 한다. 색상은 기존 `style.css`의 CSS 변수만 사용하고 새 hex 값을 하드코딩하지 않는다.
4. `index.html` 헤더에 `.site-header-links` 링크(`game-2048.html`로 연결)를 추가하고, `style.css`에 해당 클래스 스타일을 추가한다 (spec 5절 참고).
5. `game-2048.html`에 `post.html`의 `.post-back-top`과 유사한 "← 목록으로" 링크를 상단에 추가한다.
6. JS가 없는 상태에서도 레이아웃을 확인할 수 있도록, `game-2048.html`의 보드 안에 정적 더미 타일 몇 개(예: 2, 4, 8 타일)를 하드코딩으로 넣어 CSS 검증용으로 사용해도 좋다. 단, 최종적으로 이 더미는 그대로 둬도 무방하다 — B의 JS가 로드되면 `data-board`를 비우고 다시 그리기 때문에 실제 게임에는 영향 없다. (B의 렌더링 함수가 innerHTML을 덮어쓰는 방식이라고 가정하고 진행하되, 확신이 없으면 더미 타일 없이 빈 보드로 두는 편이 안전하다.)

## 완료 후 보고

- 생성/수정한 파일 목록
- `.tile-*` 클래스 네이밍 최종 목록 (B가 참고할 수 있도록)
- 브라우저에서 정적으로 확인한 결과 (레이아웃이 깨지지 않는지)
