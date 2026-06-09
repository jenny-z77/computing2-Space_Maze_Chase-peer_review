This is a turn-based 8×8 space board game. The player moves one square per turn, while the alien advances twice towards the player. The player must collect cookies, avoid the alien, and reach the exit before running out of lives or steps. Collecting a cookie freezes the alien for 3 turns.

---

## Game Setup

### Game (Type)
Represents the full game state, including:
- board: 8×8 grid
- player: position
- alien: position
- cookies: list of positions
- exit: position
- lives: number
- steps: number
- frozenTurns: number
- status: string

### createGame(config)
Returns: Game  
Creates and initialises a new game state, including the board, player, alien, cookies, exit, lives and steps.

### resetGame()
Returns: Game  
Resets the game to its initial state.

---

## Player Actions

### movePlayer(game, direction)
Parameters:
- game: Game
- direction: "up" | "down" | "left" | "right"

Returns: Game  
Updates the player position...
---

## Game Mechanics

### nextTurn(game, direction)
Returns: Game  
Executes one full turn of the game, including player movement, cookie collection, alien movement, step reduction, and game state updates.

### moveAlien(game)
Returns: Game  
Advances the alien towards the player according to the rule that the alien moves twice per player turn, unless frozen.

### collectCookie(game)
Returns: Game  
Handles cookie collection when the player reaches a cookie, increasing the score and freezing the alien for 3 turns.

### checkCollision(game)
Returns: Game  
Checks whether the player and alien occupy the same position. If so, the player loses one life and is reset.

---

## Game State

### checkWin(game)
Returns: boolean  
Returns true if the player reaches the exit.

### checkLose(game)
Returns: boolean  
Returns true if the player has no remaining lives or steps.

### getGameState(game)
Returns: Object  
Returns the current game state, including:
- player position
- alien position
- remaining lives
- remaining steps
- collected cookies
- remaining cookies
- game status (running / win / lose)

### isValidMove(game, row, col)
Returns: boolean  
Returns true if the specified position is within the board and not blocked.