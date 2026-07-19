/* Diagnostic overlay: catches any uncaught JS error (e.g. from Phaser or
 * game.js) and renders it as visible red text on screen. This must be
 * loaded BEFORE phaser/game.js so the error listener is attached in time.
 * Purpose: make errors visible on-device without needing ADB/Logcat,
 * since debugging happens purely from the phone.
 */
(function () {
    "use strict";

    var box = null;

    function ensureBox() {
        if (box) return box;
        box = document.createElement("div");
        box.id = "js-error-overlay";
        box.style.position = "fixed";
        box.style.left = "0";
        box.style.top = "0";
        box.style.width = "100%";
        box.style.maxHeight = "60%";
        box.style.overflow = "auto";
        box.style.background = "rgba(0,0,0,0.85)";
        box.style.color = "#ff5555";
        box.style.fontFamily = "monospace";
        box.style.fontSize = "14px";
        box.style.padding = "8px";
        box.style.zIndex = "999999";
        box.style.whiteSpace = "pre-wrap";
        box.style.wordBreak = "break-word";
        (document.body || document.documentElement).appendChild(box);
        return box;
    }

    function logError(text) {
        var el = ensureBox();
        var line = document.createElement("div");
        line.style.borderBottom = "1px solid #444";
        line.style.marginBottom = "4px";
        line.style.paddingBottom = "4px";
        line.textContent = text;
        el.appendChild(line);
    }

    window.addEventListener("error", function (e) {
        // capture=true (3rd arg below) is required to see resource-load
        // failures (e.g. a 404 on <script src>), which do NOT bubble to
        // window and are otherwise invisible here.
        var msg;
        if (e.target && (e.target.tagName === "SCRIPT" || e.target.tagName === "LINK" || e.target.tagName === "IMG")) {
            msg = "BLAD LADOWANIA PLIKU: " + (e.target.src || e.target.href) + "\n(plik nie zostal znaleziony lub nie udalo sie go wczytac)";
        } else {
            msg = "JS ERROR: " + e.message +
                "\nplik: " + e.filename +
                "\nlinia: " + e.lineno + ":" + e.colno;
            if (e.error && e.error.stack) {
                msg += "\n" + e.error.stack;
            }
        }
        logError(msg);
    }, true);

    window.addEventListener("unhandledrejection", function (e) {
        logError("UNHANDLED PROMISE REJECTION: " + (e.reason && e.reason.message ? e.reason.message : e.reason));
    });

    // Milestone logging: confirms how far execution actually got, even if
    // no error was thrown (e.g. Phaser loaded but game.js silently no-op'd).
    window.addEventListener("load", function () {
        logError("[diag] BUILD-STAMP-2026-07-19-v4 | window loaded. Phaser dostepny: " + (typeof Phaser !== "undefined") +
            (typeof Phaser !== "undefined" ? (" (wersja: " + Phaser.VERSION + ")") : "") +
            " | canvas w DOM: " + (document.querySelectorAll("canvas").length));
    });

    // The <body> element already exists by the time this script runs
    // (it's placed inside <body>), so log immediately rather than waiting.
    logError("[diag] BUILD-STAMP-2026-07-19-v4 | skrypt error-overlay.js uruchomiony");
})();
