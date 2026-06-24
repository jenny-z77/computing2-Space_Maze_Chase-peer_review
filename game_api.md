This is a turn-based 8×8 space board game. The player moves one square per turn, while the alien advances once every two player turns. The player must collect cookies, avoid the alien, and reach the exit before running out of lives or steps.

---

## Game Setup

### Game (Type)
Represents the full game state, including:
- `boardSize`: number — size of the board (always 8)
- `playerStart`: Position — player's default starting position
- `player`: Position — current player position
- `alien`: Position — current alien position
- `exit`: Position — exit position
- `walls`: Position[] — list of wall positions
- `cookies`: Position[] — remaining cookie positions
- `collectedCookies`: number — number of cookies collected so far
- `playerMoves`: number — total number of moves the player has made
- `lives`: number — remaining lives
- `steps`: number — remaining steps
- `status`: string — `"running"` | `"win"` | `"lose"`

### createGame(config)
Parameters:
- `config` (optional):
  - `lives`: number — starting lives (default: 3)
  - `steps`: number — starting steps (default: 30)

Returns: Game  
Creates and initialises a new game state, including the board, player, alien, cookies, exit, lives and steps.

### resetGame()
Returns: Game  
Resets the game to its initial state with default lives (3) and steps (30).

---

## Player Actions

### movePlayer(game, direction)
Parameters:
- `game`: Game
- `direction`: `"up"` | `"down"` | `"left"` | `"right"`

Returns: Game  
Attempts to move the player one square in the given direction. If the destination is a wall or outside the board, the player does not move and the original state is returned unchanged. Has no effect if the game has already ended.

### isValidMove(game, pos)
Parameters:
- `game`: Game
- `pos`: Position — `{ row, col }` to check

Returns: boolean
Returns `true` if the specified position is within the board and not blocked by a wall.

---

## Game Mechanics

### nextTurn(game, direction)
Parameters:
- `game`: Game
- `direction`: `"up"` | `"down"` | `"left"` | `"right"`

Returns: Game  
Executes one full turn: the player moves, collects any cookie on their new square, and is checked for collision with the alien. If the player reaches the exit they win immediately. The alien then moves one step closer every two player turns, after which collisions are checked again. The step count decreases by one; if no steps or lives remain the game is lost. Has no effect if the game has already ended. If the player cannot move (wall or out of bounds), no step is consumed.

### moveAlien(game)
Returns: Game  
Moves the alien one step closer to the player. The alien moves along whichever axis has the greater distance to the player (row axis preferred on a tie). The alien can pass through walls.

### collectCookie(game)
Returns: Game  
Picks up a cookie if the player is standing on one, removing it from the board and incrementing `collectedCookies`. Has no effect if there is no cookie at the player's current position.

### checkCollision(game)
Returns: Game  
Checks whether the player and alien occupy the same position. If so, the player loses one life and is reset to their starting position. If no lives remain, the game ends with status `"lose"`. Has no effect if the game has already ended.

---

## Game State

### checkWin(game)
Returns: boolean  
Returns `true` if the player is on the exit square.

### checkLose(game)
Returns: boolean  
Returns `true` if the player has no remaining lives (`lives <= 0`) or no remaining steps (`steps <= 0`).

### getGameState(game)
Returns: Object  
Returns a snapshot of the current game state, including:
- `player`: Position
- `alien`: Position
- `exit`: Position
- `lives`: number
- `steps`: number
- `collectedCookies`: number
- `remainingCookies`: number
- `playerMoves`: number
- `status`: `"running"` | `"win"` | `"lose"`
