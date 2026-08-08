# 지침: 2048 게임 - 게임 로직 담당 (서브에이전트 B)

## 배경

`specs/2048-game/spec.md`에 정의된 2048 게임 페이지를 구현하는 작업이다. 작업은 관심사 단위로 2명(A/B)에게 분할되어 있고, 당신은 B(게임 로직 JS) 담당이다. spec.md를 반드시 먼저 전체 읽어라 (특히 4절 게임 로직 명세, 6절 작업 분할의 "서브에이전트 B" 항목).

A 담당자가 동시에 `game-2048.html`, `assets/css/game-2048.css`, `index.html`, `style.css`를 작업 중이다. 당신은 그 파일들을 직접 수정하지 않는다.

## 범위 (이것만 수정/생성한다)

- 신규 생성: `assets/js/game-2048.js`

**절대 수정하지 않는 것**: `game-2048.html`, `assets/css/game-2048.css`, `index.html`, `assets/css/style.css`. HTML 구조나 CSS 클래스가 부족하다고 느껴져도 이 파일들을 직접 고치지 말고, 완료 보고에 "A에게 필요한 변경사항"으로 기록하라.

## 인터페이스 (spec에서 고정된 값, 반드시 이 이름을 그대로 사용)

- DOM 훅(`data-*` 속성): `data-score`, `data-best`, `data-new-game`(버튼), `data-board`(보드 컨테이너), `data-overlay`, `data-overlay-msg`, `data-overlay-retry`(버튼)
- 타일 CSS 클래스: `.tile-2`, `.tile-4`, `.tile-8`, `.tile-16`, `.tile-32`, `.tile-64`, `.tile-128`, `.tile-256`, `.tile-512`, `.tile-1024`, `.tile-2048`, 2048 초과 시 `.tile-super` — 타일 DOM 엘리먼트에 숫자 값에 맞는 클래스를 부여하기만 하면 색상은 A가 작성한 CSS가 처리한다.
- localStorage 키: `game2048BestScore`

## 해야 할 일 (spec 4절 그대로 구현)

1. 4x4 2차원 배열로 게임 상태 관리. 렌더링은 매 상태 변경 후 `data-board` 컨테이너를 전체 재렌더링하는 단순한 방식으로 구현 (diff 알고리즘 불필요).
2. 방향키(`ArrowUp/Down/Left/Right`) `keydown` 처리, `preventDefault()`로 스크롤 방지. 4방향 이동/병합 로직은 하나의 공통 함수(예: "왼쪽으로 밀기")를 만들고 배열 회전/반전으로 재사용하는 방식으로 구현해 4방향 각각 중복 구현하지 않는다.
3. 병합 규칙: 한 이동에서 타일은 최대 1회만 병합. 병합값은 점수에 가산. 보드에 변화가 없으면 새 타일을 생성하지 않는다.
4. 모바일 스와이프: `touchstart`/`touchend` 좌표 비교, 최소 이동거리(30px) 이상일 때 우세 축으로 방향 판정, 키보드와 동일한 이동 함수 재사용.
5. 랜덤 타일 생성: 매 유효 이동 후 빈 칸에 90% 확률 2, 10% 확률 4. 새 게임/최초 로드 시 타일 2개 생성.
6. 게임 오버 판정: 빈 칸 없음 + 어떤 방향으로도 병합 불가능하면 `data-overlay` 표시, `data-overlay-msg`에 "게임 오버! 최종 점수 {score}" 표시, `data-overlay-retry` 클릭 시 새 게임 시작.
7. 승리 판정: 2048 타일이 그 게임에서 처음 등장하는 순간에만 오버레이 표시(플래그로 1회 제한), "계속하기"/"새 게임" 두 옵션 제공 (계속하기는 오버레이만 닫고 게임 지속).
8. 최고 점수: `localStorage.getItem('game2048BestScore')`로 로드해 `data-best`에 표시, 현재 점수가 초과할 때마다 갱신+저장.
9. `data-new-game` 버튼: 클릭 시 즉시 보드 초기화, 점수 0, 최고점수는 유지, 새 타일 2개 생성.
10. 코드 스타일은 기존 `assets/js/main.js`, `assets/js/post.js`를 참고해 IIFE로 감싸고 `DOMContentLoaded`에서 초기화하는 패턴을 따른다.

## 완료 후 보고

- 구현한 함수/구조 요약
- A가 만든 HTML/CSS 훅 중 실제로 사용 불가능했거나 부족했던 부분이 있으면 명시
- 정적 서버 없이 file://로 열었을 때 콘솔 에러 없는지 확인 결과
