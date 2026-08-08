# spec: 2048 게임 페이지

## 0. 기존 저장소 구조 파악 요약

- `index.html`, `post.html`은 동일한 골격을 공유한다: `site-header`(로고+태그라인) → `main` → `site-footer`, `assets/css/style.css` 한 장만 링크.
- 디자인 시스템은 "딥그린" 단일 다크 테마다. `assets/css/style.css`의 `:root`에 다음 CSS 변수가 정의되어 있고, 별도의 라이트 모드/`[data-theme]` 분기나 `theme.js`(다크모드 토글)는 **현재 존재하지 않는다** (`html { color-scheme: dark; }`로 고정):
  - `--color-bg: #0b2b1f` (배경), `--color-bg-elevated: #123626` (카드/코드블록 등 강조 배경)
  - `--color-text: #ffffff`, `--color-text-muted: #a9c9b8`
  - `--color-border: #1f4a36`, `--color-accent: #7de3a0`
  - `--font-serif`(제목), `--font-sans`(본문), `--font-mono`(숫자/날짜 등)
  - `--content-width: 42rem`
- 레이아웃 컨벤션: `main`은 `max-width: var(--content-width)` + `margin: 0 auto` + `padding: 3rem 1.25rem 4rem`로 중앙 정렬. 카드류(`.post-card`, `.tag`)는 `var(--color-bg-elevated)` 배경 + `var(--color-border)` 테두리 조합을 사용.
- 반응형 브레이크포인트는 `@media (min-width: 640px)` 단 하나(모바일 퍼스트, 데스크톱에서 폰트 크기만 확대). 별도의 태블릿 브레이크포인트는 없음.
- `assets/js/`는 `markdown.js`(마크다운 파서), `posts-data.js`(글 원본 데이터), `main.js`(목록 렌더링), `post.js`(상세 렌더링) 4개뿐이며 각 파일은 IIFE로 감싸고 `DOMContentLoaded`에서 렌더링을 시작하는 패턴을 따른다.
- CLAUDE.md 제약: 프레임워크/번들러/npm 빌드 금지, 순수 HTML/CSS/Vanilla JS만 사용.

이번 작업은 이 기존 시스템에 **새 CSS 변수를 추가하지 않고** 기존 변수만 재사용해 게임 페이지를 통합하는 것을 원칙으로 한다.

## 1. 개요

블로그에 방향키(또는 모바일 스와이프)로 조작하는 2048 퍼즐 게임 페이지를 추가한다. 4x4 보드에서 같은 숫자 타일을 밀어 합치며, 현재 점수와 최고 점수(localStorage 저장)를 표시하는 점수판, 새 게임 버튼, 게임 오버/승리 안내를 포함한다. 기존 블로그와 동일한 다크(딥그린) 테마, 타이포그래피, 헤더/푸터 구조를 그대로 사용한다.

## 2. 파일 구조

새로 생성할 파일:

```
my-blog/
  game-2048.html            # 게임 페이지 (index.html/post.html과 동일한 헤더/푸터 골격)
  assets/
    css/
      game-2048.css          # 게임 전용 스타일 (보드, 타일, 점수판, 오버레이)
    js/
      game-2048.js           # 게임 로직 + 렌더링 (IIFE, DOMContentLoaded 진입)
```

- `game-2048.html`은 `style.css`를 기본으로 링크한 뒤 `game-2048.css`를 추가로 링크한다 (기존 `.site-header`, `.site-footer`, 색상 변수를 그대로 상속받기 위함).
- 전용 CSS를 별도 파일로 분리하는 이유: `style.css`는 "블로그 글 렌더링" 관심사에 집중되어 있고, 게임 UI(보드/타일/점수판)는 성격이 달라 파일을 분리하는 편이 유지보수에 유리하다. 단, 색상/폰트는 새로 정의하지 않고 `style.css`의 기존 CSS 변수(`--color-*`, `--font-*`)를 참조한다.
- `game-2048.js`는 다른 JS 파일들처럼 markdown.js 등과 의존관계 없이 독립적으로 동작한다 (게임은 마크다운 글이 아니므로 `markdown.js`/`posts-data.js`를 로드할 필요 없음).

## 3. 화면/UI 명세

### 3.1 페이지 골격 (`game-2048.html`)

기존 `index.html`/`post.html`과 동일하게 다음 구조를 따른다:

```html
<header class="site-header">
  <div class="site-header-inner">
    <p class="site-title"><a href="index.html">my-blog</a></p>
    <p class="site-tagline">마크다운으로 쓰는 개발 기록</p>
  </div>
</header>

<main>
  <div class="game-2048">
    <div class="game-2048-header">
      <h1>2048</h1>
      <p class="game-2048-desc">방향키(←↑→↓)로 타일을 밀어 같은 숫자를 합치세요.</p>
    </div>

    <div class="game-2048-scoreboard">
      <div class="game-2048-score-box">
        <span class="game-2048-score-label">SCORE</span>
        <span class="game-2048-score-value" data-score>0</span>
      </div>
      <div class="game-2048-score-box">
        <span class="game-2048-score-label">BEST</span>
        <span class="game-2048-score-value" data-best>0</span>
      </div>
      <button class="game-2048-new-btn" data-new-game>새 게임</button>
    </div>

    <div class="game-2048-board-wrap">
      <div class="game-2048-board" data-board>
        <!-- 4x4 = 16개 셀 배경 + 타일은 JS가 절대좌표로 렌더 -->
      </div>
      <div class="game-2048-overlay" data-overlay hidden>
        <p class="game-2048-overlay-msg" data-overlay-msg></p>
        <button class="game-2048-new-btn" data-overlay-retry>다시 시작</button>
      </div>
    </div>
  </div>
</main>

<footer class="site-footer">
  <p>마크다운으로 쓰고, 프레임워크 없이 보여줍니다.</p>
</footer>
```

- `main` 안 콘텐츠는 기존과 동일하게 `var(--content-width)`(42rem) 안에서 중앙 정렬되지만, 게임 보드는 그보다 좁은 정사각형(예: 최대 420px, 모바일에서는 `calc(100vw - 2.5rem)`)로 별도 제한한다.

### 3.2 보드/타일 스타일

- 보드: 4x4 그리드, `display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.6rem`. 배경은 `var(--color-bg-elevated)`, 테두리는 `var(--color-border)`, 모서리는 기존 카드류와 통일감 있게 `border-radius: 8px`.
- 빈 셀: `var(--color-bg)` 위에 살짝 밝은 슬롯(`var(--color-border)` 배경, 낮은 불투명도)으로 표현.
- 타일: 숫자별 배경색 구분이 필요하지만 새 색상 팔레트를 남발하지 않고, `var(--color-accent)`(#7de3a0)를 기준으로 **불투명도/명도 단계**를 조절해 2~2048까지 구분한다. 예:
  - 2, 4: `var(--color-bg-elevated)` 배경 + `var(--color-text)` 글자 (연한 단계)
  - 8, 16, 32, 64: `var(--color-accent)`를 배경에 낮은 불투명도(`color-mix` 또는 rgba)로 사용, 글자는 `var(--color-bg)` 또는 `var(--color-text)`
  - 128 이상: `var(--color-accent)` 불투명도를 점점 높여 진하게, 2048 도달 타일은 `var(--color-accent)` 풀 배경 + `var(--color-bg)` 글자로 강조
  - 글자는 `var(--font-mono)` (숫자 표기 컨벤션과 일치, `.post-card-date` 등에서 이미 mono 사용 중).
- 타일 이동/병합 애니메이션: CLAUDE.md의 "불필요한 장식/애니메이션 지양" 원칙에 따라 화려한 트랜지션 대신 `transform`/`opacity`에 대한 짧은(120~150ms) `ease-out` 트랜지션 정도로 최소화.
- 다크모드: 현재 사이트는 다크 테마 단일 고정이므로 별도 라이트 모드 대응은 불필요. 단, 향후 라이트 모드가 추가될 경우를 대비해 색상은 반드시 CSS 변수 경유로만 참조하고 하드코딩 hex를 피한다.

### 3.3 점수판

- `data-score`: 현재 점수. 타일 병합 시 합쳐진 값만큼 즉시 갱신.
- `data-best`: 최고 점수. `localStorage.getItem('game2048BestScore')`에서 로드, 현재 점수가 이를 초과할 때마다 갱신 및 저장.
- 점수판 박스 스타일은 `.tag`/`.post-card-number`처럼 `var(--color-bg-elevated)` 배경 + `var(--color-border)` 테두리 + `var(--font-mono)` 숫자로 기존 컨벤션과 통일.

### 3.4 새 게임 버튼

- `data-new-game` 버튼: 클릭 시 확인 없이 즉시 보드 초기화(현재 점수 0으로 리셋, 최고 점수는 유지), 타일 2개 랜덤 생성.
- 스타일은 기존 링크(`var(--color-accent)`) 색을 사용한 아웃라인 버튼: 배경 투명, `border: 1px solid var(--color-accent)`, hover 시 `var(--color-accent)` 배경 채움 + 텍스트는 `var(--color-bg)`.

### 3.5 게임 오버 / 승리 표시

- `data-overlay`: 보드 위를 덮는 반투명 오버레이(`position: absolute`, 보드 컨테이너 기준). 평상시 `hidden` 속성으로 숨김.
- 게임 오버 시: 오버레이 표시, 메시지 "게임 오버! 최종 점수 {score}", "다시 시작" 버튼(`data-overlay-retry`) 노출.
- 2048 타일 최초 생성(승리) 시: 오버레이 표시, 메시지 "2048 달성! 계속 진행하거나 새 게임을 시작하세요" + "계속하기"/"새 게임" 두 버튼 제공. "계속하기" 선택 시 오버레이만 닫고 게임은 계속 진행(더 큰 타일 도전 가능하도록 원작 2048 규칙 준수).
- 오버레이 배경은 `var(--color-bg)`에 불투명도를 준 색, 텍스트는 `var(--color-text)`.

## 4. 게임 로직 명세 (`assets/js/game-2048.js`)

### 4.1 데이터 모델

- 4x4 2차원 배열(`board[row][col]`)로 상태 관리, 값 0은 빈 칸.
- 렌더링은 매 상태 변경 후 `board` 전체를 순회해 DOM을 다시 그리는 단순한 방식(타일 개수가 최대 16개뿐이라 성능 이슈 없음, 별도 diff 알고리즘 불필요 — 프레임워크 없는 원칙과도 부합).

### 4.2 입력 처리

- `keydown` 이벤트에서 `ArrowUp/ArrowDown/ArrowLeft/ArrowRight`를 감지, `event.preventDefault()`로 스크롤 방지.
- 각 방향에 대해 "행 또는 열 단위로 한쪽 끝을 향해 밀기 + 인접한 동일 숫자 1회 병합" 로직을 공통 함수화한다 (예: 왼쪽 이동을 기준 함수로 구현하고, 다른 방향은 배열을 회전/반전시켜 동일 함수를 재사용하는 방식 — 4방향 각각 별도 구현보다 버그 위험이 적음).
- 병합 규칙: 한 번의 이동에서 한 타일은 최대 1회만 병합된다 (병합으로 생긴 타일이 같은 이동에서 다시 병합되지 않음). 병합된 값은 점수에 가산.
- 이동 결과 보드에 변화가 없으면(막혀서 아무 것도 안 움직인 경우) 새 타일을 생성하지 않는다.

### 4.3 모바일 대응: 스와이프 제스처

- CLAUDE.md의 모바일 반응형 원칙에 따라 필수로 지원한다.
- `touchstart`에서 시작 좌표 기록, `touchend`에서 종료 좌표와 비교해 이동 벡터 계산.
- 최소 스와이프 거리(예: 30px) 이상이고, 수평/수직 중 더 큰 변위 축을 방향으로 판정 (좌우 우세면 left/right, 상하 우세면 up/down). 짧은 터치(탭)는 무시.
- 방향 판정 후에는 4.2의 공통 이동 함수를 그대로 호출 (키보드/터치가 동일 로직 재사용).

### 4.4 랜덤 타일 생성

- 매 유효 이동 후 빈 칸 중 하나를 무작위로 골라 새 타일 생성.
- 값은 90% 확률로 2, 10% 확률로 4.
- 게임 시작/새 게임 시 초기 타일 2개를 동일 규칙으로 생성.

### 4.5 게임 오버 판정

- 다음 두 조건을 모두 만족하면 게임 오버:
  1. 빈 칸이 하나도 없음
  2. 상하좌우 어느 방향으로도 인접한 두 칸이 같은 값을 가지지 않음 (더 이상 병합 불가)
- 매 이동 후 위 조건을 검사해 게임 오버 오버레이를 노출한다.

### 4.6 승리 판정

- 병합 결과 값이 2048이 되는 순간, 그 게임에서 처음 2048이 등장했을 때만 승리 오버레이를 노출 (플래그로 1회만 트리거, "계속하기" 이후 재노출하지 않음).

### 4.7 최고 점수 저장

- `localStorage` 키: `game2048BestScore`.
- 페이지 로드 시 읽어서 `data-best`에 표시, 게임 중 현재 점수가 저장된 최고 점수를 넘으면 즉시 갱신 및 저장.

## 5. 네비게이션

- `index.html`의 `.site-header-inner` 안, `site-tagline` 아래(또는 옆)에 게임 페이지로 가는 링크를 추가한다. 새로운 nav 컴포넌트를 만들기보다 기존 헤더 안에 작은 링크 한 줄을 추가하는 최소 변경을 권장:

```html
<p class="site-header-links"><a href="game-2048.html">2048 게임</a></p>
```

- `.site-header-links`는 `var(--color-text-muted)` 색의 작은 텍스트 링크로, `.post-back-top a`와 동일한 hover(`var(--color-accent)`) 스타일을 재사용.
- `game-2048.html`에도 동일하게 헤더의 `site-title`(`my-blog` → `index.html`)을 통해 목록으로 돌아갈 수 있으므로 별도의 "뒤로가기" 링크는 필수는 아니나, 통일성을 위해 `post.html`의 `.post-back-top`처럼 페이지 상단에 "← 목록으로" 링크를 추가하는 것을 권장한다.
- 이 네비게이션 변경(`index.html`, `style.css`에 `.site-header-links` 스타일 추가)은 **Work 단계에서 실제 구현 시** 반영 대상이며, 이번 spec 작성 단계에서는 코드를 수정하지 않는다.

## 6. 작업 분할 제안

화면이 1개(게임 페이지 1개)뿐이므로 화면 단위가 아닌 **관심사 단위**로 2개 서브에이전트로 나눌 것을 제안한다. 상태 관리 방식(4x4 배열, DOM 재렌더링)과 CSS 클래스 네이밍(`data-*` 속성, `.game-2048-*` 접두사)을 미리 이 spec에서 고정해두었으므로 두 담당자가 병렬로 작업해도 인터페이스 충돌 위험이 낮다.

### 서브에이전트 A: 마크업 + 스타일 담당

- 범위: `game-2048.html`, `assets/css/game-2048.css` 작성. `index.html`에 네비게이션 링크 추가, `style.css`에 `.site-header-links`(및 필요 시 `.post-back-top` 재사용) 스타일 추가.
- 산출물: 3.1~3.5절에 정의된 DOM 구조(모든 `data-*` 훅 포함)와 스타일을 완성. 이 시점에는 `game-2048.js`가 아직 없어도 정적인 보드/타일 예시(더미 마크업 또는 CSS만)로 레이아웃을 검증 가능해야 함.
- 겹치지 않는 경계: JS 로직(게임 상태, 이벤트 핸들러)은 작성하지 않는다. `data-*` 속성과 클래스명은 이 spec에서 정의한 이름을 그대로 사용해 B와의 인터페이스를 맞춘다.

### 서브에이전트 B: 게임 로직 담당

- 범위: `assets/js/game-2048.js` 작성 (4.1~4.7절: 상태 모델, 입력 처리, 스와이프, 랜덤 생성, 게임오버/승리 판정, localStorage 연동, DOM 렌더링 함수).
- 산출물: A가 만든 `data-board`, `data-score`, `data-best`, `data-new-game`, `data-overlay`, `data-overlay-msg`, `data-overlay-retry` 훅을 대상으로 동작하는 완전한 게임 로직.
- 겹치지 않는 경계: HTML 구조나 CSS 클래스를 새로 만들지 않는다 (필요한 요소가 없으면 A와 조율해 spec을 갱신). 타일 DOM 생성 시 A가 정의한 타일 색상 클래스 네이밍 규칙(예: `.tile-2`, `.tile-4`, … `.tile-2048`, `.tile-super`)을 따른다 — 이 클래스 목록도 A가 CSS와 함께 정의하고 B는 숫자값에 따라 해당 클래스명을 그대로 부여하기만 한다.

### 통합 시 확인 사항 (두 작업 완료 후)

- 두 산출물을 합친 뒤 실제 브라우저에서 라이트/다크(현재는 다크 고정) 및 모바일 뷰로 열어 방향키/스와이프 조작, 점수 갱신, 게임 오버/승리 오버레이, 새 게임 버튼을 확인한다 (CLAUDE.md "작업 방식" 원칙).
