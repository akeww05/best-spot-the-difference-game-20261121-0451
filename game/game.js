// Lantern Lane — Spot the Difference: game logic.
//
// Owns the whole hunt: loading a level's two panels, hit-testing clicks and
// the keyboard crosshair against the level's differences, drawing found
// markers on both panels, the countdown, combo scoring, hints, and the
// level-complete / game-complete overlays. Exposes window.__game so an
// automated playtest can drive it exactly like a player would.

(function () {
  'use strict';

  var LEVELS = window.SceneLibrary.levels;
  var VW = window.SceneLibrary.viewWidth;
  var VH = window.SceneLibrary.viewHeight;
  var $ = function (id) { return document.getElementById(id); };

  function SpotDifferenceGame() {
    this.levelIndex = 0;
    this.level = LEVELS[0];
    this.found = {};          // difference id -> true
    this.foundOrder = [];
    this.score = 0;
    this.combo = 0;
    this.mistakes = 0;
    this.hintsLeft = 3;
    this.timeLeftSec = this.level.timeLimitSec;
    this.timerId = null;
    this.playing = false;
    this.crosshair = { x: VW / 2, y: VH / 2 };
    this.completedLevels = {}; // level id -> stars earned
    this.hintPulse = null;
    this.lastRemaining = null;
  }

  SpotDifferenceGame.prototype.levelCount = function () {
    return LEVELS.length;
  };

  SpotDifferenceGame.prototype.remainingCount = function () {
    return this.level.differences.length - this.foundOrder.length;
  };

  SpotDifferenceGame.prototype.differenceAt = function (x, y) {
    var diffs = this.level.differences;
    for (var i = 0; i < diffs.length; i++) {
      var d = diffs[i];
      if (this.found[d.id]) continue;
      var dx = x - d.x;
      var dy = y - d.y;
      if (dx * dx + dy * dy <= d.r * d.r) return d;
    }
    return null;
  };

  // Render one panel: the scene SVG plus an overlay layer for markers.
  SpotDifferenceGame.prototype.renderPanel = function (panelEl, variant) {
    var svg = this.level.build(variant);
    panelEl.innerHTML = svg + '<div class="marker-layer"></div>';
  };

  SpotDifferenceGame.prototype.renderLevelTabs = function () {
    var nav = $('level-tabs');
    nav.innerHTML = '';
    var self = this;
    LEVELS.forEach(function (level, index) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'level-tab'
        + (index === self.levelIndex ? ' active' : '')
        + (self.completedLevels[level.id] ? ' done' : '');
      button.textContent = (index + 1) + '. ' + level.title;
      button.addEventListener('click', function () { self.startLevel(index); });
      nav.appendChild(button);
    });
  };

  SpotDifferenceGame.prototype.renderFoundList = function () {
    var list = $('found-list');
    list.innerHTML = '';
    var self = this;
    this.level.differences.forEach(function (d) {
      var li = document.createElement('li');
      if (self.found[d.id]) {
        li.className = 'found';
        li.textContent = d.name;
      } else {
        li.className = 'pending';
        li.textContent = '???';
      }
      list.appendChild(li);
    });
  };

  SpotDifferenceGame.prototype.renderHud = function () {
    var remaining = this.remainingCount();
    if (this.lastRemaining !== null && remaining !== this.lastRemaining) {
      var pill = document.querySelector('.hud-remaining');
      pill.classList.remove('bump');
      void pill.offsetWidth;
      pill.classList.add('bump');
    }
    this.lastRemaining = remaining;
    $('score-value').textContent = String(this.score);
    $('combo-value').textContent = 'x' + Math.max(1, this.combo);
    $('remaining-value').textContent = String(remaining);
    $('remaining-small').textContent = String(remaining);
    $('found-value').textContent = String(this.foundOrder.length);
    $('hint-count').textContent = String(this.hintsLeft);
    $('hint-button').disabled = this.hintsLeft <= 0 || !this.playing;
    var mins = Math.floor(this.timeLeftSec / 60);
    var secs = this.timeLeftSec % 60;
    $('timer-text').textContent = mins + ':' + (secs < 10 ? '0' : '') + secs;
    var fill = $('timer-fill');
    fill.style.width = Math.max(0, (this.timeLeftSec / this.level.timeLimitSec) * 100) + '%';
    fill.classList.toggle('low', this.timeLeftSec <= 30);
    $('progress-fill').style.width =
      (this.foundOrder.length / this.level.differences.length) * 100 + '%';
  };

  SpotDifferenceGame.prototype.renderHeader = function () {
    $('level-title').textContent = this.level.title;
    $('level-blurb').textContent = this.level.blurb;
  };

  SpotDifferenceGame.prototype.startLevel = function (index) {
    this.stopTimer();
    this.levelIndex = index;
    this.level = LEVELS[index];
    this.found = {};
    this.foundOrder = [];
    this.combo = 0;
    this.mistakes = 0;
    this.hintsLeft = 3;
    this.timeLeftSec = this.level.timeLimitSec;
    this.playing = true;
    this.crosshair = { x: VW / 2, y: VH / 2 };
    this.clearHintPulse();
    this.renderHeader();
    this.renderLevelTabs();
    this.renderFoundList();
    this.renderHud();
    this.renderPanel($('panel-left'), new Set());
    var all = new Set(this.level.differences.map(function (d) { return d.id; }));
    this.renderPanel($('panel-right'), all);
    this.placeCrosshair();
    this.setMessage('Find ' + this.level.differences.length + ' differences — good hunting!');
    window.SoundBank.playLevelStart();
    this.startTimer();
  };

  SpotDifferenceGame.prototype.setMessage = function (msg) {
    $('message').textContent = msg;
  };

  SpotDifferenceGame.prototype.startTimer = function () {
    var self = this;
    this.timerId = window.setInterval(function () { self.tickTimer(); }, 1000);
  };

  SpotDifferenceGame.prototype.stopTimer = function () {
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
  };

  SpotDifferenceGame.prototype.tickTimer = function () {
    if (!this.playing) return;
    this.timeLeftSec -= 1;
    if (this.timeLeftSec === 30) window.SoundBank.playTick();
    if (this.timeLeftSec <= 0) {
      this.timeLeftSec = 0;
      this.renderHud();
      this.failLevel();
      return;
    }
    this.renderHud();
  };

  SpotDifferenceGame.prototype.markerLayer = function (panelEl) {
    return panelEl.querySelector('.marker-layer');
  };

  SpotDifferenceGame.prototype.markerPosition = function (panelEl, d) {
    var rect = panelEl.getBoundingClientRect();
    return { left: (d.x / VW) * rect.width, top: (d.y / VH) * rect.height, size: (d.r / VW) * rect.width * 2 };
  };

  SpotDifferenceGame.prototype.drawMarker = function (d, animate) {
    var self = this;
    ['panel-left', 'panel-right'].forEach(function (panelId) {
      var panel = $(panelId);
      var pos = self.markerPosition(panel, d);
      var ring = document.createElement('div');
      ring.className = 'marker-ring' + (animate ? ' pop' : '');
      ring.style.left = pos.left + 'px';
      ring.style.top = pos.top + 'px';
      ring.style.width = pos.size + 'px';
      ring.style.height = pos.size + 'px';
      self.markerLayer(panel).appendChild(ring);
    });
  };

  SpotDifferenceGame.prototype.drawMiss = function (panelEl, x, y) {
    var rect = panelEl.getBoundingClientRect();
    var mark = document.createElement('div');
    mark.className = 'miss-x';
    mark.textContent = '✕';
    mark.style.left = ((x / VW) * rect.width) + 'px';
    mark.style.top = ((y / VH) * rect.height) + 'px';
    this.markerLayer(panelEl).appendChild(mark);
    window.setTimeout(function () { mark.remove(); }, 750);
  };

  SpotDifferenceGame.prototype.markAt = function (panelEl, x, y) {
    if (!this.playing) return false;
    var d = this.differenceAt(x, y);
    if (d) {
      this.found[d.id] = true;
      this.foundOrder.push(d.id);
      this.combo += 1;
      var gained = 100 + (this.combo - 1) * 25;
      this.score += gained;
      window.SoundBank.playFind(this.combo);
      this.drawMarker(d, true);
      this.renderFoundList();
      this.renderHud();
      if (this.remainingCount() === 0) {
        this.winLevel();
      } else {
        this.setMessage('Found: ' + d.name + ' (+' + gained + ') — ' + this.remainingCount() + ' remain!');
      }
      return true;
    }
    this.combo = 0;
    this.mistakes += 1;
    this.timeLeftSec = Math.max(0, this.timeLeftSec - 5);
    window.SoundBank.playMiss();
    this.drawMiss(panelEl, x, y);
    this.renderHud();
    this.setMessage('Not a difference — 5 seconds lost. Look closer!');
    return false;
  };

  SpotDifferenceGame.prototype.svgCoords = function (panelEl, clientX, clientY) {
    var rect = panelEl.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * VW,
      y: ((clientY - rect.top) / rect.height) * VH,
    };
  };

  SpotDifferenceGame.prototype.handlePanelClick = function (panelEl, clientX, clientY) {
    var coords = this.svgCoords(panelEl, clientX, clientY);
    this.crosshair = { x: coords.x, y: coords.y };
    this.placeCrosshair();
    this.markAt(panelEl, coords.x, coords.y);
  };

  SpotDifferenceGame.prototype.placeCrosshair = function () {
    var self = this;
    ['panel-left', 'panel-right'].forEach(function (panelId) {
      var panel = $(panelId);
      var old = panel.querySelector('.crosshair');
      if (old) old.remove();
      var rect = panel.getBoundingClientRect();
      var mark = document.createElement('div');
      mark.className = 'crosshair';
      mark.style.left = ((self.crosshair.x / VW) * rect.width) + 'px';
      mark.style.top = ((self.crosshair.y / VH) * rect.height) + 'px';
      self.markerLayer(panel).appendChild(mark);
    });
  };

  SpotDifferenceGame.prototype.moveCrosshair = function (dx, dy) {
    this.crosshair.x = Math.max(0, Math.min(VW, this.crosshair.x + dx));
    this.crosshair.y = Math.max(0, Math.min(VH, this.crosshair.y + dy));
    this.placeCrosshair();
  };

  SpotDifferenceGame.prototype.markAtCrosshair = function () {
    if (!this.playing) return;
    this.markAt($('panel-left'), this.crosshair.x, this.crosshair.y);
  };

  SpotDifferenceGame.prototype.useHint = function () {
    if (!this.playing || this.hintsLeft <= 0) return;
    var remaining = this.level.differences.filter(function (d) { return !this.found[d.id]; }, this);
    if (remaining.length === 0) return;
    var d = remaining[Math.floor(Math.random() * remaining.length)];
    this.hintsLeft -= 1;
    this.score = Math.max(0, this.score - 50);
    window.SoundBank.playHint();
    this.clearHintPulse();
    var self = this;
    ['panel-left', 'panel-right'].forEach(function (panelId) {
      var panel = $(panelId);
      var pos = self.markerPosition(panel, d);
      var pulse = document.createElement('div');
      pulse.className = 'hint-pulse';
      pulse.style.left = pos.left + 'px';
      pulse.style.top = pos.top + 'px';
      pulse.style.width = pos.size + 'px';
      pulse.style.height = pos.size + 'px';
      self.markerLayer(panel).appendChild(pulse);
    });
    this.hintPulse = window.setTimeout(function () { self.clearHintPulse(); }, 4000);
    this.renderHud();
    this.setMessage('Hint: something changed over here… (−50 points)');
  };

  SpotDifferenceGame.prototype.clearHintPulse = function () {
    if (this.hintPulse !== null) {
      window.clearTimeout(this.hintPulse);
      this.hintPulse = null;
    }
    document.querySelectorAll('.hint-pulse').forEach(function (el) { el.remove(); });
  };

  SpotDifferenceGame.prototype.starsForLevel = function () {
    if (this.mistakes === 0 && this.timeLeftSec >= 60) return 3;
    if (this.mistakes <= 2) return 2;
    return 1;
  };

  SpotDifferenceGame.prototype.winLevel = function () {
    this.playing = false;
    this.stopTimer();
    var timeBonus = this.timeLeftSec * 2;
    this.score += timeBonus;
    var stars = this.starsForLevel();
    this.completedLevels[this.level.id] = stars;
    window.SoundBank.playWin();
    this.renderHud();
    this.renderLevelTabs();
    var isLast = this.levelIndex === LEVELS.length - 1;
    var starsText = '★'.repeat(stars) + '☆'.repeat(3 - stars);
    var html = '<h2>' + (isLast ? 'You cleared Lantern Lane!' : 'Level complete!') + '</h2>'
      + '<div class="stars">' + starsText + '</div>'
      + '<p>You found all ' + this.level.differences.length + ' differences in <b>' + this.level.title + '</b>'
      + (this.mistakes === 0 ? ' without a single wrong click!' : ' with ' + this.mistakes + ' wrong click' + (this.mistakes === 1 ? '' : 's') + '.')
      + '</p>'
      + '<p class="big-score">Time bonus +' + timeBonus + ' &nbsp;·&nbsp; Total score ' + this.score + '</p>';
    if (isLast) {
      html += '<p>All three scenes solved. You are a true Lantern Lane detective!</p>'
        + '<button class="overlay-button" id="overlay-again" type="button">Play again</button>'
        + '<button class="overlay-button secondary" id="overlay-menu" type="button">Level select</button>';
    } else {
      html += '<button class="overlay-button" id="overlay-next" type="button">Next level: '
        + LEVELS[this.levelIndex + 1].title + ' →</button>'
        + '<button class="overlay-button secondary" id="overlay-replay" type="button">Replay this level</button>';
    }
    this.showOverlay(html);
    var self = this;
    var next = $('overlay-next');
    if (next) next.addEventListener('click', function () { self.hideOverlay(); self.startLevel(self.levelIndex + 1); });
    var replay = $('overlay-replay');
    if (replay) replay.addEventListener('click', function () { self.hideOverlay(); self.startLevel(self.levelIndex); });
    var again = $('overlay-again');
    if (again) again.addEventListener('click', function () { self.hideOverlay(); self.score = 0; self.completedLevels = {}; self.startLevel(0); });
    var menu = $('overlay-menu');
    if (menu) menu.addEventListener('click', function () { self.hideOverlay(); self.showMenu(); });
  };

  SpotDifferenceGame.prototype.failLevel = function () {
    this.playing = false;
    this.stopTimer();
    window.SoundBank.playMiss();
    var html = '<h2>Out of time!</h2>'
      + '<p>The clock ran out with ' + this.remainingCount() + ' difference'
      + (this.remainingCount() === 1 ? '' : 's') + ' still hiding in <b>' + this.level.title + '</b>.</p>'
      + '<p class="big-score">Score ' + this.score + '</p>'
      + '<button class="overlay-button" id="overlay-retry" type="button">Try again</button>'
      + '<button class="overlay-button secondary" id="overlay-menu" type="button">Level select</button>';
    this.showOverlay(html);
    var self = this;
    $('overlay-retry').addEventListener('click', function () { self.hideOverlay(); self.startLevel(self.levelIndex); });
    $('overlay-menu').addEventListener('click', function () { self.hideOverlay(); self.showMenu(); });
  };

  SpotDifferenceGame.prototype.showMenu = function () {
    this.playing = false;
    this.stopTimer();
    var cards = LEVELS.map(function (level, index) {
      var stars = this.completedLevels[level.id] ? '★'.repeat(this.completedLevels[level.id]) : '';
      return '<button class="level-pick" type="button" data-level="' + index + '"><b>' + (index + 1) + '. '
        + level.title + '</b><span>' + level.differences.length + ' differences · '
        + Math.floor(level.timeLimitSec / 60) + ':' + String(level.timeLimitSec % 60).padStart(2, '0')
        + ' ' + stars + '</span></button>';
    }, this).join('');
    var html = '<h2>Lantern Lane</h2>'
      + '<p>Two pictures. A handful of sneaky differences. Find them all before the clock runs out — '
      + 'click a difference on either picture, or steer the crosshair with the arrow keys and press Enter. '
      + 'Wrong clicks cost 5 seconds; hints cost 50 points.</p>'
      + '<div class="level-picker">' + cards + '</div>'
      + '<p>Score ' + this.score + '</p>';
    this.showOverlay(html);
    var self = this;
    document.querySelectorAll('.level-pick').forEach(function (card) {
      card.addEventListener('click', function () {
        self.hideOverlay();
        self.startLevel(Number(card.getAttribute('data-level')));
      });
    });
  };

  SpotDifferenceGame.prototype.showOverlay = function (html) {
    $('overlay-card').innerHTML = html;
    $('overlay').classList.remove('hidden');
  };

  SpotDifferenceGame.prototype.hideOverlay = function () {
    $('overlay').classList.add('hidden');
  };

  SpotDifferenceGame.prototype.bindEvents = function () {
    var self = this;
    ['panel-left', 'panel-right'].forEach(function (panelId) {
      var panel = $(panelId);
      panel.addEventListener('click', function (event) {
        self.handlePanelClick(panel, event.clientX, event.clientY);
      });
    });
    $('hint-button').addEventListener('click', function () { self.useHint(); });
    $('mute-button').addEventListener('click', function () {
      var muted = window.SoundBank.setMuted(!window.SoundBank.isMuted());
      this.textContent = muted ? 'Sound: Off' : 'Sound: On';
      if (!muted) window.SoundBank.playClick();
    });
    document.addEventListener('keydown', function (event) {
      if (!$('overlay').classList.contains('hidden')) {
        if (event.key === 'Enter') {
          var first = document.querySelector('#overlay-card .overlay-button, #overlay-card .level-pick');
          if (first) first.click();
        }
        return;
      }
      var step = event.shiftKey ? 4 : 16;
      if (event.key === 'ArrowLeft') { self.moveCrosshair(-step, 0); event.preventDefault(); }
      else if (event.key === 'ArrowRight') { self.moveCrosshair(step, 0); event.preventDefault(); }
      else if (event.key === 'ArrowUp') { self.moveCrosshair(0, -step); event.preventDefault(); }
      else if (event.key === 'ArrowDown') { self.moveCrosshair(0, step); event.preventDefault(); }
      else if (event.key === 'Enter' || event.key === ' ') { self.markAtCrosshair(); event.preventDefault(); }
      else if (event.key === 'h' || event.key === 'H') { self.useHint(); }
      else if (event.key === 'r' || event.key === 'R') { self.startLevel(self.levelIndex); }
      else if (event.key === 'm' || event.key === 'M') { $('mute-button').click(); }
      else if (event.key === '1' || event.key === '2' || event.key === '3') {
        self.startLevel(Number(event.key) - 1);
      }
    });
    window.addEventListener('resize', function () { self.placeCrosshair(); });
  };

  window.SpotDifferenceGame = SpotDifferenceGame;
})();
