/* Scales the Phaser canvas to fill the phone screen while preserving the
 * game's native 800x600 aspect ratio (letterboxed). This replaces Phaser's
 * built-in Scale Manager, which is not available in the arcade-physics-only
 * build of Phaser used here (Phaser.Scale is undefined in that build).
 */
(function () {
    "use strict";

    var GAME_W = 800;
    var GAME_H = 600;
    var GAME_RATIO = GAME_W / GAME_H;

    function resize() {
        var canvas = document.querySelector("canvas");
        if (!canvas) return;

        var winW = window.innerWidth;
        var winH = window.innerHeight;
        var winRatio = winW / winH;

        var w, h;
        if (winRatio > GAME_RATIO) {
            h = winH;
            w = h * GAME_RATIO;
        } else {
            w = winW;
            h = w / GAME_RATIO;
        }

        canvas.style.position = "absolute";
        canvas.style.width = w + "px";
        canvas.style.height = h + "px";
        canvas.style.left = ((winW - w) / 2) + "px";
        canvas.style.top = ((winH - h) / 2) + "px";
    }

    window.addEventListener("resize", resize);
    window.addEventListener("orientationchange", function () {
        setTimeout(resize, 100);
    });
    window.addEventListener("load", function () {
        setTimeout(resize, 50);
    });

    // Also try immediately in case the canvas already exists
    // (this script loads right after game.js, which creates it synchronously).
    resize();
})();
