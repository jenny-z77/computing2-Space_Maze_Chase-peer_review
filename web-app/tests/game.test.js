import {
  createGame,
  resetGame,
  movePlayer,
  nextTurn,
  moveAlien,
  collectCookie,
  checkCollision,
  checkWin,
  checkLose,
  getGameState,
  isValidMove
} from "../game.js";


// createGame

describe("createGame", function () {
  it("returns a game with status 'running'", function () {
    const game = createGame();
    if (game.status !== "running") {
      throw new Error(`Expected status "running" but got "${game.status}"`);
    }
  });

  it("returns a game with default 3 lives", function () {
    const game = createGame();
    if (game.lives !== 3) {
      throw new Error(`Expected 3 lives but got ${game.lives}`);
    }
  });

  it("returns a game with default 30 steps", function () {
    const game = createGame();
    if (game.steps !== 30) {
      throw new Error(`Expected 30 steps but got ${game.steps}`);
    }
  });

  it("accepts custom lives and steps via config", function () {
    const game = createGame({ lives: 5, steps: 50 });
    if (game.lives !== 5 || game.steps !== 50) {
      throw new Error(
        `Expected lives=5, steps=50 but got lives=${game.lives}, steps=${game.steps}`
      );
    }
  });

  it("treats lives: 0 as 0, not the default 3", function () {
    const game = createGame({ lives: 0 });
    if (game.lives !== 0) {
      throw new Error(`Expected lives=0 but got ${game.lives}`);
    }
  });

  it("treats steps: 0 as 0, not the default 30", function () {
    const game = createGame({ steps: 0 });
    if (game.steps !== 0) {
      throw new Error(`Expected steps=0 but got ${game.steps}`);
    }
  });

  it("starts with 4 cookies on the board", function () {
    const game = createGame();
    if (game.cookies.length !== 4) {
      throw new Error(`Expected 4 cookies but got ${game.cookies.length}`);
    }
  });

  it("starts with 0 collected cookies", function () {
    const game = createGame();
    if (game.collectedCookies !== 0) {
      throw new Error(`Expected 0 collectedCookies but got ${game.collectedCookies}`);
    }
  });
});


// resetGame


describe("resetGame", function () {
  it("resets the game to initial state", function () {
    const game = resetGame();
    if (game.steps !== 30 || game.status !== "running") {
      throw new Error("resetGame did not return a fresh game state");
    }
  });
});


// isValidMove


describe("isValidMove", function () {
  it("returns true for an open cell inside the board", function () {
    const game = createGame();
    if (!isValidMove(game, { row: 1, col: 1 })) {
      throw new Error("Expected (1,1) to be a valid move");
    }
  });

  it("returns false for a position outside the board", function () {
    const game = createGame();
    if (isValidMove(game, { row: -1, col: 0 })) {
      throw new Error("Expected (-1,0) to be invalid (out of bounds)");
    }
  });

  it("returns false for a wall position", function () {
    const game = createGame();
    // (0,3) is a wall in the default map
    if (isValidMove(game, { row: 0, col: 3 })) {
      throw new Error("Expected (0,3) to be invalid (wall)");
    }
  });
});

// ---------------------------------------------------------------------------
// movePlayer
// ---------------------------------------------------------------------------

describe("movePlayer", function () {
  it("moves the player right when the cell is free", function () {
    const game = createGame();
    // player starts at {row:1, col:0}
    const next = movePlayer(game, "right");
    if (next.player.col !== 1) {
      throw new Error(
        `Expected col=1 after moving right but got col=${next.player.col}`
      );
    }
  });

  it("does not mutate the original game state", function () {
    const game = createGame();
    const colBefore = game.player.col;
    movePlayer(game, "right");
    if (game.player.col !== colBefore) {
      throw new Error("movePlayer should not mutate the original game object");
    }
  });

  it("does not move the player into a wall", function () {
    const game = createGame();
    // player at {row:1, col:0} — move right twice to col:2,
    // then attempt to move into wall at (1,3)
    const step1 = movePlayer(game,  "right"); // col 1
    const step2 = movePlayer(step1, "right"); // col 2
    const step3 = movePlayer(step2, "right"); // col 3 is a wall — should stay at 2
    if (step3.player.col !== 2) {
      throw new Error(
        `Expected player to be blocked by wall at col=3 but got col=${step3.player.col}`
      );
    }
  });

  it("does not move when game status is not 'running'", function () {
    const game = { ...createGame(), status: "win" };
    const next = movePlayer(game, "right");
    if (next.player.col !== game.player.col) {
      throw new Error("Player should not move when game is over");
    }
  });
});

// ---------------------------------------------------------------------------
// collectCookie
// ---------------------------------------------------------------------------

describe("collectCookie", function () {
  it("collects a cookie when player is on its position", function () {
    const game = createGame();
    const onCookie = { ...game, player: { ...game.cookies[0] } };
    const next = collectCookie(onCookie);
    if (next.collectedCookies !== 1) {
      throw new Error(
        `Expected collectedCookies=1 but got ${next.collectedCookies}`
      );
    }
  });

  it("removes the cookie from the cookies array after collection", function () {
    const game = createGame();
    const onCookie = { ...game, player: { ...game.cookies[0] } };
    const next = collectCookie(onCookie);
    if (next.cookies.length !== 3) {
      throw new Error(
        `Expected 3 remaining cookies but got ${next.cookies.length}`
      );
    }
  });

  it("does not mutate the original game state", function () {
    const game = createGame();
    const onCookie = { ...game, player: { ...game.cookies[0] } };
    collectCookie(onCookie);
    if (onCookie.collectedCookies !== 0 || onCookie.cookies.length !== 4) {
      throw new Error("collectCookie should not mutate the original game object");
    }
  });

  it("does nothing when player is not on a cookie", function () {
    const game = createGame();
    // player starts at (1,0) which has no cookie
    const next = collectCookie(game);
    if (next.collectedCookies !== 0 || next.cookies.length !== 4) {
      throw new Error(
        "collectCookie should not change state when no cookie is present"
      );
    }
  });
});

// ---------------------------------------------------------------------------
// moveAlien
// ---------------------------------------------------------------------------

describe("moveAlien", function () {
  it("does not move the alien when frozenTurns > 0", function () {
    const game = { ...createGame(), frozenTurns: 3 };
    const next = moveAlien(game);
    if (next.alien.row !== game.alien.row || next.alien.col !== game.alien.col) {
      throw new Error("Alien should not move when frozen");
    }
  });

  it("decrements frozenTurns when alien is frozen", function () {
    const game = { ...createGame(), frozenTurns: 3 };
    const next = moveAlien(game);
    if (next.frozenTurns !== 2) {
      throw new Error(`Expected frozenTurns=2 but got ${next.frozenTurns}`);
    }
  });

  it("moves the alien closer to the player when not frozen", function () {
    const game = createGame();
    // alien at (7,0), player at (1,0) — alien should move up (row decreases)
    const next = moveAlien(game);
    if (next.alien.row >= game.alien.row) {
      throw new Error("Alien should move closer to the player");
    }
  });

  it("does not mutate the original game state", function () {
    const game = createGame();
    const rowBefore = game.alien.row;
    moveAlien(game);
    if (game.alien.row !== rowBefore) {
      throw new Error("moveAlien should not mutate the original game object");
    }
  });
});

// ---------------------------------------------------------------------------
// checkCollision
// ---------------------------------------------------------------------------

describe("checkCollision", function () {
  it("decrements lives when player and alien are on the same cell", function () {
    const game = createGame();
    const colliding = { ...game, alien: { ...game.player } };
    const next = checkCollision(colliding);
    if (next.lives !== 2) {
      throw new Error(`Expected lives=2 after collision but got ${next.lives}`);
    }
  });

  it("resets player to start position after collision (lives > 0)", function () {
    const game = createGame();
    const colliding = { ...game, alien: { ...game.player } };
    const next = checkCollision(colliding);
    if (
      next.player.row !== game.playerStart.row ||
      next.player.col !== game.playerStart.col
    ) {
      throw new Error("Player should reset to start after collision");
    }
  });

  it("sets status to 'lose' when lives reach 0", function () {
    const game = { ...createGame(), lives: 1 };
    const colliding = { ...game, alien: { ...game.player } };
    const next = checkCollision(colliding);
    if (next.status !== "lose") {
      throw new Error(`Expected status="lose" but got "${next.status}"`);
    }
  });

  it("does nothing when player and alien are on different cells", function () {
    const game = createGame();
    const next = checkCollision(game);
    if (next.lives !== game.lives) {
      throw new Error("Lives should not change when there is no collision");
    }
  });

  it("does not mutate the original game state", function () {
    const game = createGame();
    const colliding = { ...game, alien: { ...game.player } };
    const livesBefore = colliding.lives;
    checkCollision(colliding);
    if (colliding.lives !== livesBefore) {
      throw new Error("checkCollision should not mutate the original game object");
    }
  });
});

// ---------------------------------------------------------------------------
// checkWin
// ---------------------------------------------------------------------------

describe("checkWin", function () {
  it("returns true when player reaches the exit", function () {
    const game = { ...createGame(), player: { ...createGame().exit } };
    if (!checkWin(game)) {
      throw new Error(
        "Expected checkWin to return true when player is at exit"
      );
    }
  });

  it("returns false when player is not at the exit", function () {
    const game = createGame();
    if (checkWin(game)) {
      throw new Error(
        "Expected checkWin to return false when player is not at exit"
      );
    }
  });
});

// ---------------------------------------------------------------------------
// checkLose
// ---------------------------------------------------------------------------

describe("checkLose", function () {
  it("returns true when lives reach 0", function () {
    const game = { ...createGame(), lives: 0 };
    if (!checkLose(game)) {
      throw new Error("Expected checkLose to return true when lives=0");
    }
  });

  it("returns true when steps reach 0", function () {
    const game = { ...createGame(), steps: 0 };
    if (!checkLose(game)) {
      throw new Error("Expected checkLose to return true when steps=0");
    }
  });

  it("returns false when lives and steps are both > 0", function () {
    const game = createGame();
    if (checkLose(game)) {
      throw new Error("Expected checkLose to return false at game start");
    }
  });
});

// ---------------------------------------------------------------------------
// getGameState
// ---------------------------------------------------------------------------

describe("getGameState", function () {
  it("returns the correct player position", function () {
    const game = createGame();
    const state = getGameState(game);
    if (
      state.player.row !== game.player.row ||
      state.player.col !== game.player.col
    ) {
      throw new Error("getGameState returned wrong player position");
    }
  });

  it("returns the correct number of remaining cookies", function () {
    const game = createGame();
    const state = getGameState(game);
    if (state.remainingCookies !== 4) {
      throw new Error(
        `Expected remainingCookies=4 but got ${state.remainingCookies}`
      );
    }
  });

  it("returns the correct status", function () {
    const game = createGame();
    const state = getGameState(game);
    if (state.status !== "running") {
      throw new Error(`Expected status="running" but got "${state.status}"`);
    }
  });
});

// ---------------------------------------------------------------------------
// nextTurn
// ---------------------------------------------------------------------------

describe("nextTurn", function () {
  it("decrements steps by 1 each turn", function () {
    const game = createGame();
    const next = nextTurn(game, "right");
    if (next.steps !== game.steps - 1) {
      throw new Error(
        `Expected steps=${game.steps - 1} but got ${next.steps}`
      );
    }
  });

  it("does not mutate the original game state", function () {
    const game = createGame();
    const stepsBefore = game.steps;
    nextTurn(game, "right");
    if (game.steps !== stepsBefore) {
      throw new Error("nextTurn should not mutate the original game object");
    }
  });

  it("does nothing when game is not running", function () {
    const game = { ...createGame(), status: "win" };
    const next = nextTurn(game, "right");
    if (next.steps !== game.steps) {
      throw new Error("nextTurn should not change state when game is not running");
    }
  });

  it("sets status to 'win' when player reaches exit", function () {
    const game = createGame();
    // Place player one step left of exit
    const nearExit = {
      ...game,
      player: { row: game.exit.row, col: game.exit.col - 1 }
    };
    const next = nextTurn(nearExit, "right");
    if (next.status !== "win") {
      throw new Error(`Expected status="win" but got "${next.status}"`);
    }
  });
});