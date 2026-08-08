(function () {
  var SIZE = 4;
  var BEST_SCORE_KEY = "game2048BestScore";
  var SWIPE_THRESHOLD = 30;

  var board = [];
  var score = 0;
  var best = 0;
  var hasWon = false;
  var locked = false;

  var boardEl, scoreEl, bestEl, newGameBtn, overlayEl, overlayMsgEl, overlayRetryBtn;
  var overlayContinueBtn = null;

  var touchStartX = 0;
  var touchStartY = 0;
  var touchTracking = false;

  // ---- 보드 유틸 ----

  function createEmptyBoard() {
    var b = [];
    for (var r = 0; r < SIZE; r++) {
      b.push([0, 0, 0, 0]);
    }
    return b;
  }

  function cloneBoard(b) {
    return b.map(function (row) {
      return row.slice();
    });
  }

  function transpose(b) {
    var t = createEmptyBoard();
    for (var r = 0; r < SIZE; r++) {
      for (var c = 0; c < SIZE; c++) {
        t[c][r] = b[r][c];
      }
    }
    return t;
  }

  function reverseRows(b) {
    return b.map(function (row) {
      return row.slice().reverse();
    });
  }

  // 방향별로 "왼쪽으로 밀기" 기준 형태로 변환/역변환한다.
  function prepareForDirection(b, direction) {
    switch (direction) {
      case "left":
        return cloneBoard(b);
      case "right":
        return reverseRows(b);
      case "up":
        return transpose(b);
      case "down":
        return reverseRows(transpose(b));
      default:
        return cloneBoard(b);
    }
  }

  function restoreFromDirection(processed, direction) {
    switch (direction) {
      case "left":
        return processed;
      case "right":
        return reverseRows(processed);
      case "up":
        return transpose(processed);
      case "down":
        return transpose(reverseRows(processed));
      default:
        return processed;
    }
  }

  // 한 줄(4칸 배열)을 왼쪽으로 밀고 병합한다. 한 타일은 이동당 1회만 병합.
  function slideRowLeft(row) {
    var values = row.filter(function (v) {
      return v !== 0;
    });
    var result = [];
    var scoreGain = 0;

    for (var i = 0; i < values.length; i++) {
      if (i < values.length - 1 && values[i] === values[i + 1]) {
        var merged = values[i] * 2;
        result.push(merged);
        scoreGain += merged;
        i++; // 다음 값은 이미 병합에 사용됨
      } else {
        result.push(values[i]);
      }
    }

    while (result.length < SIZE) {
      result.push(0);
    }

    var moved = false;
    for (var j = 0; j < SIZE; j++) {
      if (result[j] !== row[j]) {
        moved = true;
        break;
      }
    }

    return { row: result, scoreGain: scoreGain, moved: moved };
  }

  function moveBoard(b, direction) {
    var processed = prepareForDirection(b, direction);
    var moved = false;
    var scoreGain = 0;

    var newProcessed = processed.map(function (row) {
      var res = slideRowLeft(row);
      if (res.moved) moved = true;
      scoreGain += res.scoreGain;
      return res.row;
    });

    var newBoard = restoreFromDirection(newProcessed, direction);

    return { board: newBoard, moved: moved, scoreGain: scoreGain };
  }

  function getEmptyCells(b) {
    var cells = [];
    for (var r = 0; r < SIZE; r++) {
      for (var c = 0; c < SIZE; c++) {
        if (b[r][c] === 0) cells.push([r, c]);
      }
    }
    return cells;
  }

  function addRandomTile() {
    var empties = getEmptyCells(board);
    if (empties.length === 0) return;
    var pick = empties[Math.floor(Math.random() * empties.length)];
    var value = Math.random() < 0.9 ? 2 : 4;
    board[pick[0]][pick[1]] = value;
  }

  function boardHasValue(b, target) {
    for (var r = 0; r < SIZE; r++) {
      for (var c = 0; c < SIZE; c++) {
        if (b[r][c] >= target) return true;
      }
    }
    return false;
  }

  function isGameOver(b) {
    if (getEmptyCells(b).length > 0) return false;

    for (var r = 0; r < SIZE; r++) {
      for (var c = 0; c < SIZE; c++) {
        var v = b[r][c];
        if (c < SIZE - 1 && b[r][c + 1] === v) return false;
        if (r < SIZE - 1 && b[r + 1][c] === v) return false;
      }
    }
    return true;
  }

  // ---- 렌더링 ----

  function tileClassName(value) {
    return value > 2048 ? "tile-super" : "tile-" + value;
  }

  function render() {
    boardEl.innerHTML = "";

    for (var i = 0; i < SIZE * SIZE; i++) {
      var cell = document.createElement("div");
      cell.className = "game-2048-cell";
      boardEl.appendChild(cell);
    }

    for (var r = 0; r < SIZE; r++) {
      for (var c = 0; c < SIZE; c++) {
        var value = board[r][c];
        if (value === 0) continue;
        var tile = document.createElement("div");
        tile.className = "game-2048-tile " + tileClassName(value);
        tile.style.gridRow = String(r + 1);
        tile.style.gridColumn = String(c + 1);
        tile.textContent = String(value);
        boardEl.appendChild(tile);
      }
    }

    if (scoreEl) scoreEl.textContent = String(score);
    if (bestEl) bestEl.textContent = String(best);
  }

  // ---- 오버레이 ----

  function ensureContinueButton() {
    if (overlayContinueBtn) return overlayContinueBtn;
    var btn = document.createElement("button");
    btn.className = "game-2048-new-btn";
    btn.textContent = "계속하기";
    btn.setAttribute("data-overlay-continue", "");
    btn.addEventListener("click", onContinueClick);
    overlayContinueBtn = btn;
    return btn;
  }

  function showGameOverOverlay() {
    locked = true;
    if (overlayContinueBtn && overlayContinueBtn.parentNode) {
      overlayContinueBtn.parentNode.removeChild(overlayContinueBtn);
    }
    if (overlayRetryBtn) overlayRetryBtn.textContent = "다시 시작";
    if (overlayMsgEl) overlayMsgEl.textContent = "게임 오버! 최종 점수 " + score;
    if (overlayEl) overlayEl.hidden = false;
  }

  function showWinOverlay() {
    locked = true;
    if (overlayMsgEl) {
      overlayMsgEl.textContent = "2048 달성! 계속 진행하거나 새 게임을 시작하세요";
    }
    if (overlayRetryBtn) overlayRetryBtn.textContent = "새 게임";
    var continueBtn = ensureContinueButton();
    if (overlayRetryBtn && overlayRetryBtn.parentNode && continueBtn.parentNode !== overlayRetryBtn.parentNode) {
      overlayRetryBtn.parentNode.insertBefore(continueBtn, overlayRetryBtn);
    }
    if (overlayEl) overlayEl.hidden = false;
  }

  function hideOverlay() {
    if (overlayEl) overlayEl.hidden = true;
    locked = false;
  }

  function onContinueClick() {
    hideOverlay();
  }

  function onRetryClick() {
    newGame();
  }

  // ---- 최고 점수 ----

  function loadBest() {
    var stored = window.localStorage.getItem(BEST_SCORE_KEY);
    var parsed = parseInt(stored, 10);
    return isNaN(parsed) ? 0 : parsed;
  }

  function updateBestIfNeeded() {
    if (score > best) {
      best = score;
      window.localStorage.setItem(BEST_SCORE_KEY, String(best));
    }
  }

  // ---- 게임 흐름 ----

  function newGame() {
    board = createEmptyBoard();
    score = 0;
    hasWon = false;
    hideOverlay();
    if (overlayContinueBtn && overlayContinueBtn.parentNode) {
      overlayContinueBtn.parentNode.removeChild(overlayContinueBtn);
    }
    addRandomTile();
    addRandomTile();
    render();
  }

  function handleMove(direction) {
    if (locked) return;

    var result = moveBoard(board, direction);
    if (!result.moved) return;

    board = result.board;
    score += result.scoreGain;
    updateBestIfNeeded();
    addRandomTile();
    render();

    if (!hasWon && boardHasValue(board, 2048)) {
      hasWon = true;
      showWinOverlay();
      return;
    }

    if (isGameOver(board)) {
      showGameOverOverlay();
    }
  }

  // ---- 입력 처리 ----

  var KEY_TO_DIRECTION = {
    ArrowUp: "up",
    ArrowDown: "down",
    ArrowLeft: "left",
    ArrowRight: "right"
  };

  function onKeyDown(event) {
    var direction = KEY_TO_DIRECTION[event.key];
    if (!direction) return;
    event.preventDefault();
    handleMove(direction);
  }

  function onTouchStart(event) {
    if (!event.touches || event.touches.length === 0) return;
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
    touchTracking = true;
  }

  function onTouchEnd(event) {
    if (!touchTracking) return;
    touchTracking = false;

    var touch = event.changedTouches && event.changedTouches[0];
    if (!touch) return;

    var dx = touch.clientX - touchStartX;
    var dy = touch.clientY - touchStartY;
    var absX = Math.abs(dx);
    var absY = Math.abs(dy);

    if (Math.max(absX, absY) < SWIPE_THRESHOLD) return;

    var direction;
    if (absX > absY) {
      direction = dx > 0 ? "right" : "left";
    } else {
      direction = dy > 0 ? "down" : "up";
    }

    handleMove(direction);
  }

  // ---- 초기화 ----

  function init() {
    boardEl = document.querySelector("[data-board]");
    if (!boardEl) return;

    scoreEl = document.querySelector("[data-score]");
    bestEl = document.querySelector("[data-best]");
    newGameBtn = document.querySelector("[data-new-game]");
    overlayEl = document.querySelector("[data-overlay]");
    overlayMsgEl = document.querySelector("[data-overlay-msg]");
    overlayRetryBtn = document.querySelector("[data-overlay-retry]");

    best = loadBest();

    if (newGameBtn) newGameBtn.addEventListener("click", newGame);
    if (overlayRetryBtn) overlayRetryBtn.addEventListener("click", onRetryClick);

    document.addEventListener("keydown", onKeyDown);
    boardEl.addEventListener("touchstart", onTouchStart, { passive: true });
    boardEl.addEventListener("touchend", onTouchEnd, { passive: true });

    newGame();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
