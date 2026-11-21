// Lantern Lane — Spot the Difference: synthesized sound effects.
//
// Every sound is generated with the Web Audio API at play time, so the game
// ships no audio files and makes no network request.

(function () {
  'use strict';

  var audioContext = null;
  var muted = false;

  function ensureContext() {
    if (audioContext === null) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      audioContext = new AC();
    }
    if (audioContext.state === 'suspended') audioContext.resume();
    return audioContext;
  }

  function tone(freq, startAt, duration, type, volume, slideTo) {
    var ctx = ensureContext();
    if (ctx === null || muted) return;
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + startAt);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, ctx.currentTime + startAt + duration);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime + startAt);
    gain.gain.exponentialRampToValueAtTime(volume || 0.18, ctx.currentTime + startAt + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + startAt + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start(ctx.currentTime + startAt);
    osc.stop(ctx.currentTime + startAt + duration + 0.05);
  }

  // A bright two-note chime when a difference is found.
  function playFind(combo) {
    var lift = Math.min(combo || 0, 6) * 24;
    tone(660 + lift, 0, 0.16, 'sine', 0.2);
    tone(990 + lift, 0.08, 0.28, 'sine', 0.2);
    tone(1320 + lift, 0.16, 0.3, 'triangle', 0.1);
  }

  // A dull low thud for a wrong click.
  function playMiss() {
    tone(160, 0, 0.18, 'square', 0.1, 90);
  }

  // A soft shimmer when a hint is used.
  function playHint() {
    tone(1180, 0, 0.12, 'sine', 0.12);
    tone(1560, 0.09, 0.2, 'sine', 0.1);
  }

  // A rising arpeggio when a level is cleared.
  function playWin() {
    var notes = [523, 659, 784, 1047, 1319];
    for (var i = 0; i < notes.length; i++) tone(notes[i], i * 0.11, 0.32, 'triangle', 0.16);
  }

  // A short tick when the clock is nearly out.
  function playTick() {
    tone(880, 0, 0.06, 'square', 0.05);
  }

  // A click for buttons and level changes.
  function playClick() {
    tone(520, 0, 0.07, 'sine', 0.1);
  }

  // A bright two-note lift when a level starts.
  function playLevelStart() {
    tone(523, 0, 0.14, 'triangle', 0.14);
    tone(784, 0.1, 0.22, 'triangle', 0.14);
  }

  function setMuted(value) {
    muted = !!value;
    return muted;
  }

  function isMuted() {
    return muted;
  }

  // Expose one small sound bank on the window for the game logic.
  window.SoundBank = {
    playFind: playFind,
    playMiss: playMiss,
    playHint: playHint,
    playWin: playWin,
    playTick: playTick,
    playClick: playClick,
    playLevelStart: playLevelStart,
    setMuted: setMuted,
    isMuted: isMuted,
  };
})();
