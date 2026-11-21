# Lantern Lane — Spot the Difference

[![make.fun](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/c/best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/akeww05/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/c/best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/akeww05/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/c/best-spot-the-difference-game-20261121-0451)

A complete, original spot-the-difference game that runs offline in a desktop
browser from static files. Three hand-drawn scenes — Harbour Dawn, Lantern
Night Market and Moonlit Garden — each with two near-identical panels, 7 to 10
well-hidden differences, click and keyboard marking, a live counter of how
many differences remain, hints, a timer, combo scoring and a win state.

Play it: serve `game/` with any static server and open `index.html`, or run
`python3 -m http.server` inside `game/` and visit `http://localhost:8000`.

## How to play

- Click a difference on either picture to mark it — a green ring appears on
  both panels and the Remaining counter drops.
- Arrow keys move the crosshair, Enter marks the spot under it. `H` uses a
  hint (−50 points, 3 per level), `R` restarts the level, `M` toggles sound.
- A wrong click costs 5 seconds. Clear all differences before the clock runs
  out to earn stars and a time bonus, then move on to the next scene.

Built for the make.fun competition
[best-spot-the-difference-game-20261121-0451](https://make.fun/c/best-spot-the-difference-game-20261121-0451).
