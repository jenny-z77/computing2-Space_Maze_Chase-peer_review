# Space Maze Chase

Space Maze Chase is a grid-based maze game developed as part of the Computing 2: Applications coursework.

The game features a player navigating through a maze, collecting cookies while avoiding an alien that actively chases the player. The player can escape by reaching the exit, even if not all cookies are collected.

An API documentation page is also generated for the game module using JSDoc.

---

## Game Overview

- Grid size: 8 × 8
- Player starts from a fixed position
- Alien chases the player once every 2 player moves
- Cookies can be collected to increase score
- Player can win by reaching the exit (cookies are optional)
- Default: 3 lives, 40 steps
- Game ends if:
  - Player reaches the exit → Win
  - Lives reach 0 or steps run out → Lose

---

## Project Structure

- `web-app/game.js`  
  Game logic module (API)

- `web-app/main.js`  
  Handles rendering and user interaction

- `web-app/index.html`  
  Web interface for the game

- `jsdoc.json`  
  Configuration for generating API documentation

---

## API Module

The game logic is implemented as a JavaScript module (`game.js`) which exposes a set of functions to:

- Create and manage game state
- Move the player
- Move the alien
- Collect cookies
- Check win/lose conditions

All functions operate on a shared game object.

The API is documented using JSDoc and compiled into a documentation website.

---

## Installation

1. Clone the repository

2. Install dependencies

```bash
npm install
```

3. Generate API documentation (optional)

```bash
npm run docs
```

---

## Running the Game

Because `game.js` uses ES modules (`import`/`export`), the game **cannot** be opened by double-clicking `index.html`. It must be served over HTTP.

**Option 1 — Node.js `http-server`:**

```bash
npx http-server .
```

Then open `http://localhost:8080/web-app/` in your browser.

**Option 2 — VS Code Live Server extension:**

Right-click `web-app/index.html` in VS Code and select **"Open with Live Server"**.

---

## Running Tests

```bash
npm test
```

Tests are written with Mocha and cover all exported functions in `game.js`.

## Running the Linter

```bash
npm run lint
```

The linter checks the game module with JSLint using the project `.jslintrc` settings.
