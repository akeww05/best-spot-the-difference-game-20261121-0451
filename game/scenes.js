// Lantern Lane — Spot the Difference: the three hand-drawn scenes.
//
// Every scene is drawn as inline SVG from code, so the two panels are built
// from one builder: the left panel with no differences applied, the right
// panel with every difference in its list applied. A difference is one small
// change (a colour, a missing object, an added object) at a fixed spot.
//
// Each level entry: id, title, blurb, timeLimitSec, and differences — each
// with an id, a human name (revealed in the found list), and x/y/r hotspot
// coordinates in the scene's 640x480 space.

(function () {
  'use strict';

  var W = 640;
  var H = 480;

  // Small string helpers so the scene builders stay readable.
  function circle(cx, cy, r, fill, extra) {
    return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + fill + '"' + (extra || '') + '/>';
  }
  function ellipse(cx, cy, rx, ry, fill, extra) {
    return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="' + fill + '"' + (extra || '') + '/>';
  }
  function rect(x, y, w, h, fill, extra) {
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + fill + '"' + (extra || '') + '/>';
  }
  function poly(points, fill, extra) {
    return '<polygon points="' + points + '" fill="' + fill + '"' + (extra || '') + '/>';
  }
  function path(d, fill, extra) {
    return '<path d="' + d + '" fill="' + fill + '"' + (extra || '') + '/>';
  }
  function line(x1, y1, x2, y2, stroke, width) {
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + stroke + '" stroke-width="' + width + '" stroke-linecap="round"/>';
  }
  function text(x, y, str, size, fill, extra) {
    return '<text x="' + x + '" y="' + y + '" font-size="' + size + '" fill="' + fill + '" font-family="Trebuchet MS, sans-serif" font-weight="bold" text-anchor="middle"' + (extra || '') + '>' + str + '</text>';
  }
  function cloud(cx, cy, s) {
    return '<g fill="#ffffff" opacity="0.92">'
      + ellipse(cx, cy, 34 * s, 16 * s, '#ffffff')
      + ellipse(cx - 24 * s, cy + 6 * s, 22 * s, 12 * s, '#ffffff')
      + ellipse(cx + 26 * s, cy + 6 * s, 24 * s, 13 * s, '#ffffff') + '</g>';
  }
  function bird(cx, cy, s) {
    return '<path d="M ' + (cx - 12 * s) + ' ' + cy + ' Q ' + (cx - 5 * s) + ' ' + (cy - 9 * s) + ' ' + cx + ' ' + cy
      + ' Q ' + (cx + 5 * s) + ' ' + (cy - 9 * s) + ' ' + (cx + 12 * s) + ' ' + cy
      + '" fill="none" stroke="#2c3e50" stroke-width="2.5" stroke-linecap="round"/>';
  }

  // ---- Level 1: Harbour Dawn -------------------------------------------
  function buildHarbour(variant) {
    var sunRays = variant.has('sun-rays') ? '' :
      '<g stroke="#ffb703" stroke-width="4" stroke-linecap="round">'
      + line(520, 18, 520, 6, '#ffb703', 4) + line(520, 122, 520, 134, '#ffb703', 4)
      + line(468, 70, 456, 70, '#ffb703', 4) + line(572, 70, 584, 70, '#ffb703', 4)
      + line(483, 33, 475, 25, '#ffb703', 4) + line(557, 33, 565, 25, '#ffb703', 4)
      + line(483, 107, 475, 115, '#ffb703', 4) + line(557, 107, 565, 115, '#ffb703', 4) + '</g>';
    var gullMid = variant.has('gull-mid') ? '' : bird(300, 95, 1);
    var lampFill = variant.has('lighthouse-lamp') ? '#4a4a55' : '#fff200';
    var sailFill = variant.has('sail-color') ? '#2a9d8f' : '#e63946';
    var hat = variant.has('fisherman-hat') ? '' :
      path('M 104 238 Q 118 224 132 238 L 136 242 L 100 242 Z', '#7b4b2a')
      + rect(110, 232, 16, 7, '#7b4b2a', ' rx="2"');
    var fish = variant.has('jumping-fish') ?
      '<g transform="translate(430 372) rotate(-18)">'
      + ellipse(0, 0, 16, 8, '#ff8fa3') + poly('16,0 26,-7 26,7', '#ff8fa3')
      + circle(8, -2, 2, '#1d3557') + '</g>'
      + path('M 408 392 Q 416 382 424 392 Q 432 382 440 392', 'none', ' stroke="#bde0fe" stroke-width="2" fill="none"') : '';
    var bucket = variant.has('pier-bucket') ? '' :
      '<g>' + path('M 78 352 L 98 352 L 94 376 L 82 376 Z', '#c1121f')
      + rect(76, 350, 24, 5, '#7f1d1d', ' rx="2"') + '</g>';

    return '<svg viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Harbour at dawn">'
      + '<defs>'
      + '<linearGradient id="hb-sky" x1="0" y1="0" x2="0" y2="1">'
      + '<stop offset="0" stop-color="#ffe3b3"/><stop offset="0.55" stop-color="#a8d8ea"/><stop offset="1" stop-color="#7ec8e3"/>'
      + '</linearGradient>'
      + '<linearGradient id="hb-sea" x1="0" y1="0" x2="0" y2="1">'
      + '<stop offset="0" stop-color="#4aa8c8"/><stop offset="1" stop-color="#1d6f9c"/>'
      + '</linearGradient></defs>'
      + rect(0, 0, 640, 300, 'url(#hb-sky)')
      + circle(520, 70, 34, '#ffdf6b') + sunRays
      + cloud(140, 70, 1) + cloud(330, 48, 0.8) + cloud(470, 130, 0.7)
      + bird(180, 90, 1) + gullMid + bird(420, 70, 0.9)
      // distant hills and harbour houses
      + path('M 0 300 L 120 220 L 240 300 Z', '#6a994e')
      + path('M 180 300 L 330 210 L 480 300 Z', '#588157')
      + '<g>' + rect(30, 240, 70, 60, '#f4a261') + poly('25,242 65,210 105,242', '#bc6c25')
      + rect(45, 262, 14, 16, '#ffe66d') + rect(72, 262, 14, 16, '#3a5a7c') + '</g>'
      + '<g>' + rect(420, 248, 64, 52, '#e9c46a') + poly('416,250 452,222 488,250', '#8d5a2b')
      + rect(432, 266, 13, 14, '#3a5a7c') + rect(458, 266, 13, 14, '#ffe66d') + '</g>'
      // lighthouse on the right
      + '<g>' + rect(566, 170, 28, 130, '#f8edeb') + rect(566, 196, 28, 14, '#e63946') + rect(566, 232, 28, 14, '#e63946')
      + rect(566, 268, 28, 14, '#e63946') + rect(560, 156, 40, 16, '#343a40', ' rx="3"')
      + circle(580, 164, 7, lampFill, ' stroke="#343a40" stroke-width="2"')
      + poly('556,300 604,300 596,318 564,318', '#6c757d') + '</g>'
      // sea
      + rect(0, 300, 640, 180, 'url(#hb-sea)')
      + path('M 0 330 Q 40 322 80 330 T 160 330 T 240 330 T 320 330 T 400 330 T 480 330 T 560 330 T 640 330', 'none', ' stroke="#bde0fe" stroke-width="3" fill="none" opacity="0.7"')
      + path('M 0 380 Q 40 372 80 380 T 160 380 T 240 380 T 320 380 T 400 380 T 480 380 T 560 380 T 640 380', 'none', ' stroke="#bde0fe" stroke-width="3" fill="none" opacity="0.5"')
      + path('M 0 440 Q 40 432 80 440 T 160 440 T 240 440 T 320 440 T 400 440 T 480 440 T 560 440 T 640 440', 'none', ' stroke="#bde0fe" stroke-width="3" fill="none" opacity="0.35"')
      + fish
      // sailboat with a red (or teal) sail
      + '<g>' + poly('180,290 180,340 148,340', sailFill) + poly('184,296 184,340 214,340', '#f1faee')
      + rect(178, 288, 4, 56, '#6c4a2f') + path('M 138 340 L 226 340 L 214 358 L 150 358 Z', '#8d5a2b')
      + circle(160, 348, 3, '#ffe66d') + circle(200, 348, 3, '#ffe66d') + '</g>'
      // rowboat
      + '<g>' + path('M 380 392 L 460 392 L 448 408 L 392 408 Z', '#bc6c25')
      + rect(398, 384, 6, 12, '#6c4a2f') + rect(436, 384, 6, 12, '#6c4a2f')
      + circle(404, 400, 3, '#ffe66d') + circle(436, 400, 3, '#ffe66d') + '</g>'
      // a striped buoy bobbing in the open water
      + '<g>' + ellipse(280, 420, 13, 6, '#e76f51') + rect(273, 404, 14, 12, '#f1faee')
      + rect(273, 404, 14, 5, '#e63946') + circle(280, 401, 3, '#ffd97a') + '</g>'
      // wooden pier on the left, with a fisherman and his bucket
      + '<g>' + rect(30, 330, 130, 12, '#8d5a2b') + rect(30, 342, 130, 8, '#7b4b2a')
      + rect(44, 350, 10, 60, '#6c4a2f') + rect(136, 350, 10, 60, '#6c4a2f')
      + line(60, 336, 60, 330, '#5a3a22', 2) + line(90, 336, 90, 330, '#5a3a22', 2) + line(120, 336, 120, 330, '#5a3a22', 2) + '</g>'
      + bucket
      + '<g>' + circle(118, 252, 11, '#f4d58d') + hat
      + rect(110, 264, 16, 30, '#2a9d8f', ' rx="4"') + rect(110, 292, 7, 26, '#3a3a3a') + rect(119, 292, 7, 26, '#3a3a3a')
      + line(126, 272, 158, 300, '#6c4a2f', 3) + line(158, 300, 158, 336, '#6c4a2f', 2)
      + path('M 158 336 Q 170 330 176 340', 'none', ' stroke="#6c4a2f" stroke-width="2" fill="none"') + '</g>'
      // rocks at the lighthouse base
      + ellipse(560, 330, 34, 12, '#6c757d') + ellipse(600, 334, 26, 10, '#495057')
      + '</svg>';
  }

  // ---- Level 2: Lantern Night Market -------------------------------------
  function lantern(x, y, s, color, lit) {
    var glow = lit ? '<circle cx="' + x + '" cy="' + y + '" r="' + (26 * s) + '" fill="' + color + '" opacity="0.25"/>' : '';
    return glow
      + '<g><line x1="' + x + '" y1="' + (y - 34 * s) + '" x2="' + x + '" y2="' + (y - 12 * s) + '" stroke="#5a3a22" stroke-width="2"/>'
      + ellipse(x, y, 13 * s, 16 * s, color)
      + rect(x - 5 * s, y - 19 * s, 10 * s, 4 * s, '#ffd97a')
      + rect(x - 5 * s, y + 15 * s, 10 * s, 4 * s, '#ffd97a')
      + '<line x1="' + (x - 13 * s) + '" y1="' + y + '" x2="' + (x + 13 * s) + '" y2="' + y + '" stroke="#00000033" stroke-width="2"/></g>';
  }
  function star(cx, cy, r, fill) {
    return '<path d="M ' + cx + ' ' + (cy - r) + ' L ' + (cx + r * 0.3) + ' ' + (cy - r * 0.3)
      + ' L ' + (cx + r) + ' ' + cy + ' L ' + (cx + r * 0.3) + ' ' + (cy + r * 0.3)
      + ' L ' + cx + ' ' + (cy + r) + ' L ' + (cx - r * 0.3) + ' ' + (cy + r * 0.3)
      + ' L ' + (cx - r) + ' ' + cy + ' L ' + (cx - r * 0.3) + ' ' + (cy - r * 0.3) + ' Z" fill="' + fill + '"/>';
  }
  function apple(cx, cy) {
    return circle(cx, cy, 9, '#e63946') + '<path d="M ' + cx + ' ' + (cy - 9) + ' q 2 -7 8 -8" stroke="#588157" stroke-width="2.5" fill="none" stroke-linecap="round"/>'
      + ellipse(cx + 6, cy - 10, 5, 3, '#588157', ' transform="rotate(-30 ' + (cx + 6) + ' ' + (cy - 10) + ')"');
  }

  function buildMarket(variant) {
    var starNearMoon = variant.has('moon-star') ? '' : star(150, 55, 9, '#fff3b0');
    var bulbFill = variant.has('bulb-dark') ? '#3a3a4a' : '#ffd97a';
    var stallLantern = variant.has('lantern-color') ? '#2a9d8f' : '#e63946';
    var cat = variant.has('cat-gone') ? '' :
      '<g>' + ellipse(545, 372, 26, 14, '#343a40') + circle(522, 356, 11, '#343a40')
      + poly('514,348 518,336 524,346', '#343a40') + poly('524,346 530,336 532,348', '#343a40')
      + line(568, 366, 586, 352, '#343a40', 4) + circle(519, 354, 2, '#ffd97a') + '</g>';
    var apples = apple(180, 296) + apple(200, 296) + apple(220, 296)
      + apple(190, 282) + (variant.has('apple-count') ? '' : apple(210, 282));
    var apronFill = variant.has('apron-color') ? '#e76f51' : '#4361ee';
    var extraLantern = variant.has('extra-lantern') ? lantern(120, 185, 0.8, '#e63946', true) : '';
    var bow = variant.has('teddy-bow') ? '' :
      '<g fill="#e63946"><polygon points="445,322 433,314 433,330"/><polygon points="445,322 457,314 457,330"/>'
      + circle(445, 322, 4, '#c1121f') + '</g>';

    return '<svg viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Lantern night market">'
      + '<defs><linearGradient id="mk-sky" x1="0" y1="0" x2="0" y2="1">'
      + '<stop offset="0" stop-color="#12082e"/><stop offset="0.6" stop-color="#2a1a5e"/><stop offset="1" stop-color="#4a2a7a"/>'
      + '</linearGradient></defs>'
      + rect(0, 0, 640, 480, 'url(#mk-sky)')
      // moon, stars
      + '<g>' + circle(90, 60, 30, '#fff3b0') + circle(100, 54, 24, '#e9d27a', ' opacity="0.55"')
      + circle(80, 52, 5, '#d9c27a') + circle(98, 70, 4, '#d9c27a') + circle(72, 70, 3, '#d9c27a') + '</g>'
      + starNearMoon + star(220, 40, 7, '#ffffff') + star(330, 70, 6, '#ffffff') + star(420, 36, 8, '#fff3b0')
      + star(560, 90, 6, '#ffffff') + star(610, 50, 7, '#ffffff') + star(40, 150, 5, '#ffffff')
      // string lights across the top
      + '<g>' + path('M 0 96 Q 320 150 640 96', 'none', ' stroke="#5a3a22" stroke-width="3" fill="none"')
      + circle(80, 112, 6, '#ffd97a') + circle(160, 126, 6, '#ff8fa3') + circle(240, 134, 6, '#ffd97a')
      + circle(330, 138, 7, bulbFill) + circle(420, 134, 6, '#ff8fa3') + circle(500, 124, 6, '#ffd97a')
      + circle(580, 110, 6, '#ff8fa3') + '</g>'
      + extraLantern
      // back wall and cobbled ground
      + rect(0, 300, 640, 180, '#241536')
      + '<g fill="#3a2a55">' + ellipse(80, 400, 60, 14, '#3a2a55') + ellipse(240, 440, 70, 16, '#3a2a55')
      + ellipse(420, 410, 66, 14, '#3a2a55') + ellipse(560, 450, 70, 16, '#3a2a55') + '</g>'
      + '<g fill="#4a3570">' + ellipse(160, 420, 46, 10, '#4a3570') + ellipse(330, 450, 52, 12, '#4a3570')
      + ellipse(500, 425, 48, 10, '#4a3570') + '</g>'
      // fruit stall (left)
      + '<g>' + rect(140, 260, 140, 90, '#6d4c2f') + rect(140, 260, 140, 10, '#8d5a2b')
      + poly('130,262 150,224 270,224 290,262', '#e63946')
      + poly('150,224 170,224 160,262 140,262', '#f1faee') + poly('190,224 210,224 200,262 180,262', '#f1faee')
      + poly('230,224 250,224 240,262 220,262', '#f1faee')
      + rect(150, 300, 120, 8, '#5a3a22') + apples
      + text(210, 340, 'FRUIT', 15, '#ffd97a') + '</g>'
      // lantern stall (middle) with vendor
      + '<g>' + rect(310, 260, 140, 90, '#6d4c2f') + rect(310, 260, 140, 10, '#8d5a2b')
      + poly('300,262 320,224 440,224 460,262', '#2a9d8f')
      + poly('320,224 340,224 330,262 310,262', '#ffd97a') + poly('360,224 380,224 370,262 350,262', '#ffd97a')
      + poly('400,224 420,224 410,262 390,262', '#ffd97a')
      + lantern(335, 210, 1, '#e63946', true) + lantern(380, 205, 1.1, stallLantern, true) + lantern(425, 210, 1, '#ffd97a', true)
      + '</g>'
      + '<g>' + circle(380, 296, 13, '#f4d58d') + path('M 366 288 Q 380 276 394 288 L 392 292 L 368 292 Z', '#2b2d42')
      + rect(364, 308, 32, 42, apronFill, ' rx="5"') + rect(364, 308, 32, 12, '#f4d58d')
      + circle(368, 330, 3, '#ffd97a') + circle(392, 330, 3, '#ffd97a') + '</g>'
      // Stall names are drawn last so the vendor never covers his own sign.
      + text(380, 344, 'LANTERNS', 14, '#ffd97a')
      // toy stall (right)
      + '<g>' + rect(490, 260, 130, 90, '#6d4c2f') + rect(490, 260, 130, 10, '#8d5a2b')
      + poly('480,262 500,224 610,224 630,262', '#e76f51')
      + poly('500,224 520,224 510,262 490,262', '#f1faee') + poly('540,224 560,224 550,262 530,262', '#f1faee')
      + poly('580,224 600,224 590,262 570,262', '#f1faee')
      + '<g>' + circle(555, 300, 14, '#b08968') + circle(540, 288, 7, '#b08968') + circle(570, 288, 7, '#b08968')
      + ellipse(555, 322, 16, 14, '#b08968') + circle(550, 298, 2, '#1d3557') + circle(560, 298, 2, '#1d3557')
      + ellipse(555, 306, 5, 3, '#5a3a22') + bow + '</g>'
      + circle(590, 322, 11, '#4361ee') + circle(590, 322, 4, '#ffffff')
      + text(555, 344, 'TOYS', 14, '#ffd97a') + '</g>'
      // crate with the cat, and a hanging sign
      + '<g>' + rect(516, 372, 64, 44, '#8d5a2b') + line(516, 386, 580, 386, '#6c4a2f', 3) + line(516, 400, 580, 400, '#6c4a2f', 3) + '</g>'
      + cat
      + '<g>' + rect(250, 150, 140, 34, '#3a2a55', ' stroke="#ffd97a" stroke-width="2" rx="6"')
      + text(320, 173, 'LANTERN LANE', 16, '#ffd97a') + '</g>'
      + '</svg>';
  }

  // ---- Level 3: Moonlit Garden -------------------------------------------
  function firefly(cx, cy) {
    return '<g><circle cx="' + cx + '" cy="' + cy + '" r="9" fill="#d9f99d" opacity="0.3"/>'
      + circle(cx, cy, 3.5, '#e9ff70') + '</g>';
  }
  function tulip(cx, cy, petal, stemH) {
    return '<g>' + line(cx, cy, cx, cy + stemH, '#2d6a4f', 3)
      + '<path d="M ' + cx + ' ' + (cy + 12) + ' q -10 2 -14 10 q 10 4 14 -2" fill="#2d6a4f"/>'
      + path('M ' + (cx - 9) + ' ' + cy + ' Q ' + (cx - 11) + ' ' + (cy - 16) + ' ' + (cx - 4) + ' ' + (cy - 12)
      + ' Q ' + cx + ' ' + (cy - 20) + ' ' + (cx + 4) + ' ' + (cy - 12) + ' Q ' + (cx + 11) + ' ' + (cy - 16) + ' ' + (cx + 9) + ' ' + cy
      + ' Q ' + cx + ' ' + (cy + 4) + ' ' + (cx - 9) + ' ' + cy + ' Z', petal) + '</g>';
  }
  function mushroom(cx, cy, s) {
    return '<g>' + rect(cx - 3 * s, cy, 6 * s, 10 * s, '#f1faee', ' rx="2"')
      + path('M ' + (cx - 12 * s) + ' ' + cy + ' Q ' + cx + ' ' + (cy - 16 * s) + ' ' + (cx + 12 * s) + ' ' + cy + ' Z', '#e63946')
      + circle(cx - 5 * s, cy - 6 * s, 2 * s, '#ffffff') + circle(cx + 4 * s, cy - 9 * s, 2 * s, '#ffffff') + '</g>';
  }

  function buildGarden(variant) {
    var fireflyOne = variant.has('firefly-gone') ? '' : firefly(150, 120);
    var frog = variant.has('frog-gone') ? '' :
      '<g>' + ellipse(405, 388, 16, 10, '#588157') + circle(396, 380, 7, '#588157') + circle(412, 380, 7, '#588157')
      + circle(394, 378, 2.5, '#1d3557') + circle(414, 378, 2.5, '#1d3557')
      + path('M 396 388 Q 404 392 412 388', 'none', ' stroke="#1d3557" stroke-width="1.5" fill="none"') + '</g>';
    var tulipFill = variant.has('tulip-color') ? '#f8edeb' : '#e63946';
    var butterfly = variant.has('butterfly-gone') ? '' :
      '<g transform="translate(505 150)"><ellipse cx="-8" cy="-4" rx="9" ry="12" fill="#c77dff" transform="rotate(-24 -8 -4)"/>'
      + '<ellipse cx="8" cy="-4" rx="9" ry="12" fill="#c77dff" transform="rotate(24 8 -4)"/>'
      + '<ellipse cx="-7" cy="8" rx="6" ry="8" fill="#e0aaff" transform="rotate(-18 -7 8)"/>'
      + '<ellipse cx="7" cy="8" rx="6" ry="8" fill="#e0aaff" transform="rotate(18 7 8)"/>'
      + rect(-1.5, -10, 3, 22, '#3a2a55', ' rx="1.5"') + '</g>';
    var mushrooms = mushroom(70, 428, 1) + mushroom(100, 432, 0.85)
      + (variant.has('mushroom-count') ? '' : mushroom(128, 430, 0.9));
    var benchSlat = variant.has('bench-slat') ? '' : rect(298, 348, 54, 7, '#8d5a2b', ' rx="3"');
    var willowBranch = variant.has('willow-branch') ? '' :
      path('M 596 122 Q 602 155 590 186', 'none', ' stroke="#40916c" stroke-width="3" fill="none"')
      + circle(590, 186, 4, '#40916c');
    var ripples = variant.has('ripple-rings')
      ? ellipse(360, 430, 22, 6, 'none', ' stroke="#bde0fe" stroke-width="2" fill="none" opacity="0.6"')
        + ellipse(360, 430, 36, 9, 'none', ' stroke="#bde0fe" stroke-width="2" fill="none" opacity="0.4"')
      : ellipse(360, 430, 14, 4, 'none', ' stroke="#bde0fe" stroke-width="2" fill="none" opacity="0.6"')
        + ellipse(360, 430, 26, 7, 'none', ' stroke="#bde0fe" stroke-width="2" fill="none" opacity="0.5"')
        + ellipse(360, 430, 40, 10, 'none', ' stroke="#bde0fe" stroke-width="2" fill="none" opacity="0.35"');
    var crater = variant.has('moon-crater') ? '' : circle(535, 60, 6, '#d9c27a');
    var stones = ellipse(170, 446, 22, 8, '#adb5bd') + ellipse(240, 452, 22, 8, '#adb5bd')
      + (variant.has('path-stone') ? '' : ellipse(205, 428, 20, 7, '#ced4da'));

    return '<svg viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Moonlit garden">'
      + '<defs><linearGradient id="gd-sky" x1="0" y1="0" x2="0" y2="1">'
      + '<stop offset="0" stop-color="#0b1026"/><stop offset="0.6" stop-color="#1b2a52"/><stop offset="1" stop-color="#2d4a7a"/>'
      + '</linearGradient></defs>'
      + rect(0, 0, 640, 480, 'url(#gd-sky)')
      // big moon with craters
      + '<g>' + circle(520, 70, 42, '#fff3b0') + circle(505, 55, 8, '#e9d27a') + circle(535, 88, 5, '#e9d27a')
      + crater + circle(508, 88, 4, '#e9d27a') + '</g>'
      + star(90, 50, 6, '#ffffff') + star(200, 90, 5, '#fff3b0') + star(330, 50, 7, '#ffffff')
      + star(430, 110, 5, '#ffffff') + star(610, 160, 6, '#ffffff') + star(40, 200, 5, '#ffffff')
      + fireflyOne + firefly(250, 90) + firefly(350, 150) + firefly(90, 200) + firefly(470, 200)
      // fence along the back
      + '<g>' + rect(0, 258, 640, 8, '#5a3a22')
      + rect(40, 230, 10, 60, '#6c4a2f') + rect(140, 230, 10, 60, '#6c4a2f') + rect(240, 230, 10, 60, '#6c4a2f')
      + rect(340, 230, 10, 60, '#6c4a2f') + rect(440, 230, 10, 60, '#6c4a2f') + rect(540, 230, 10, 60, '#6c4a2f')
      + rect(0, 282, 640, 6, '#5a3a22') + '</g>'
      // grass
      + rect(0, 290, 640, 190, '#1d4d33')
      + path('M 0 330 Q 160 318 320 330 T 640 330 L 640 480 L 0 480 Z', '#245c3d')
      // willow tree on the right, its long branches drooping over the pond
      + '<g>' + rect(578, 175, 20, 125, '#5a3a22')
      + ellipse(560, 118, 52, 26, '#2d6a4f') + ellipse(610, 104, 42, 24, '#2d6a4f') + ellipse(586, 82, 38, 22, '#2d6a4f')
      + ellipse(530, 100, 30, 18, '#40916c') + ellipse(600, 130, 34, 16, '#40916c')
      + path('M 552 138 Q 542 185 550 228', 'none', ' stroke="#40916c" stroke-width="3" fill="none"')
      + path('M 520 150 Q 504 195 512 236', 'none', ' stroke="#40916c" stroke-width="3" fill="none"')
      + willowBranch
      + circle(550, 228, 4, '#40916c') + circle(512, 236, 4, '#40916c') + '</g>'
      // stone path
      + stones
      + ellipse(300, 446, 22, 8, '#adb5bd') + ellipse(370, 452, 22, 8, '#ced4da')
      // pond with lily pads
      + '<g>' + ellipse(390, 410, 110, 34, '#1d6f9c') + ellipse(390, 410, 96, 28, '#2a8ab8')
      + ellipse(340, 400, 26, 9, '#40916c') + ellipse(440, 418, 28, 9, '#40916c')
      + ellipse(405, 392, 30, 10, '#52b788') + circle(432, 400, 4, '#ff8fa3') + circle(348, 398, 4, '#ffffff')
      + ripples + frog + '</g>'
      // bench
      + '<g>' + rect(292, 330, 66, 8, '#8d5a2b', ' rx="3"') + benchSlat
      + rect(292, 316, 66, 7, '#8d5a2b', ' rx="3"') + rect(296, 322, 6, 44, '#6c4a2f') + rect(348, 322, 6, 44, '#6c4a2f')
      + rect(298, 356, 6, 20, '#6c4a2f') + rect(348, 356, 6, 20, '#6c4a2f') + '</g>'
      // tulip row
      + tulip(210, 400, '#e63946', 22) + tulip(255, 400, tulipFill, 22) + tulip(300, 400, '#ffd97a', 22)
      + tulip(160, 402, '#ff8fa3', 20) + tulip(480, 402, '#e63946', 22)
      + butterfly
      + mushrooms
      + '<g>' + ellipse(60, 360, 30, 10, '#245c3d') + ellipse(120, 350, 24, 8, '#245c3d')
      + ellipse(580, 380, 28, 9, '#245c3d') + '</g>'
      + '</svg>';
  }

  // ---- The level catalogue -----------------------------------------------
  var LEVELS = [
    {
      id: 'harbour',
      title: 'Harbour Dawn',
      blurb: 'Dawn over a little fishing harbour. Seven small things are not the same on the right — a sail, a hat, a gull and more.',
      timeLimitSec: 240,
      build: buildHarbour,
      differences: [
        { id: 'sun-rays', name: "The sun's rays", x: 520, y: 70, r: 40 },
        { id: 'gull-mid', name: 'The middle seagull', x: 300, y: 95, r: 26 },
        { id: 'lighthouse-lamp', name: 'The lighthouse lamp', x: 580, y: 164, r: 24 },
        { id: 'sail-color', name: "The sailboat's sail", x: 180, y: 312, r: 34 },
        { id: 'fisherman-hat', name: "The fisherman's hat", x: 118, y: 240, r: 26 },
        { id: 'jumping-fish', name: 'The jumping fish', x: 430, y: 372, r: 30 },
        { id: 'pier-bucket', name: 'The bucket on the pier', x: 88, y: 362, r: 26 },
      ],
    },
    {
      id: 'market',
      title: 'Lantern Night Market',
      blurb: 'Paper lanterns, a fruit stall, a toy stall and one very sleepy cat. Eight differences hide in the lamplight.',
      timeLimitSec: 240,
      build: buildMarket,
      differences: [
        { id: 'moon-star', name: 'The star by the moon', x: 150, y: 55, r: 24 },
        { id: 'bulb-dark', name: 'The dark string bulb', x: 330, y: 138, r: 24 },
        { id: 'lantern-color', name: 'The green paper lantern', x: 380, y: 205, r: 28 },
        { id: 'cat-gone', name: 'The cat on the crate', x: 545, y: 366, r: 34 },
        { id: 'apple-count', name: 'The missing apple', x: 210, y: 282, r: 24 },
        { id: 'apron-color', name: "The vendor's apron", x: 380, y: 328, r: 28 },
        { id: 'extra-lantern', name: 'The extra little lantern', x: 120, y: 185, r: 28 },
        { id: 'teddy-bow', name: "The teddy bear's bow", x: 445, y: 322, r: 26 },
      ],
    },
    {
      id: 'garden',
      title: 'Moonlit Garden',
      blurb: 'Fireflies, a pond frog and a willow tree under a big moon. Ten differences — the hardest hunt in Lantern Lane.',
      timeLimitSec: 300,
      build: buildGarden,
      differences: [
        { id: 'firefly-gone', name: 'The missing firefly', x: 150, y: 120, r: 24 },
        { id: 'frog-gone', name: 'The frog on the lily pad', x: 405, y: 386, r: 28 },
        { id: 'tulip-color', name: 'The white tulip', x: 255, y: 396, r: 26 },
        { id: 'butterfly-gone', name: 'The purple butterfly', x: 505, y: 150, r: 30 },
        { id: 'mushroom-count', name: 'The missing mushroom', x: 128, y: 428, r: 24 },
        { id: 'bench-slat', name: 'The bench slat', x: 325, y: 350, r: 26 },
        { id: 'willow-branch', name: 'The willow branch', x: 586, y: 140, r: 30 },
        { id: 'ripple-rings', name: 'The pond ripples', x: 360, y: 430, r: 32 },
        { id: 'moon-crater', name: 'The moon crater', x: 535, y: 60, r: 22 },
        { id: 'path-stone', name: 'The stepping stone', x: 205, y: 428, r: 26 },
      ],
    },
  ];

  window.SceneLibrary = {
    viewWidth: W,
    viewHeight: H,
    levels: LEVELS,
    levelById: function (id) {
      for (var i = 0; i < LEVELS.length; i++) if (LEVELS[i].id === id) return LEVELS[i];
      return LEVELS[0];
    },
  };
})();
