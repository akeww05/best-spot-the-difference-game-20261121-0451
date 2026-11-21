// Lantern Lane — Spot the Difference: bootstrap.
//
// Creates the game, wires its events, and opens on the level-select menu so
// the player picks a scene. The game instance is kept on window.__game so a
// playtest can drive it exactly like a player (clicks, keys, hints).

(function () {
  'use strict';

  function boot() {
    var game = new window.SpotDifferenceGame();
    game.bindEvents();
    game.renderLevelTabs();
    game.renderHeader();
    game.renderFoundList();
    game.renderHud();
    // Paint level 1 behind the menu so the first screen already shows the
    // twin pictures; the menu overlay sits on top until a level is picked.
    game.renderPanel(document.getElementById('panel-left'), new Set());
    var all = new Set(game.level.differences.map(function (d) { return d.id; }));
    game.renderPanel(document.getElementById('panel-right'), all);
    game.placeCrosshair();
    game.showMenu();
    window.__game = game;
    console.log('Lantern Lane ready: ' + game.levelCount() + ' levels, '
      + game.level.differences.length + ' differences in the first scene.');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
