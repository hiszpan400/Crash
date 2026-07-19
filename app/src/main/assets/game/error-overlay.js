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
    var origWarn = console.warn.bind(console);
    var origError = console.error.bind(console);
    console.warn = function () {
        origWarn.apply(console, arguments);
        logError("[console.warn] " + Array.prototype.slice.call(arguments).join(" "));
    };
    console.error = function () {
        origError.apply(console, arguments);
        logError("[console.error] " + Array.prototype.slice.call(arguments).join(" "));
    };
    window.__diagLogError = logError;
    window.addEventListener("error", function (e) {
        var msg;
        if (e.target && (e.target.tagName === "SCRIPT" || e.target.tagName === "LINK" || e.target.tagName === "IMG")) {
            msg = "BLAD LADOWANIA PLIKU: " + (e.target.src || e.target.href);
        } else {
            msg = "JS ERROR: " + e.message + " @ " + e.filename + ":" + e.lineno;
            if (e.error && e.error.stack) { msg += "\n" + e.error.stack; }
        }
        logError(msg);
    }, true);
    window.addEventListener("unhandledrejection", function (e) {
        logError("UNHANDLED PROMISE REJECTION: " + (e.reason && e.reason.message ? e.reason.message : e.reason));
    });
    window.addEventListener("load", function () {
        logError("[diag] v5 window loaded. Phaser: " + (typeof Phaser !== "undefined") + " canvas: " + document.querySelectorAll("canvas").length);
    });
    logError("[diag] v5 error-overlay.js uruchomiony");
})();
