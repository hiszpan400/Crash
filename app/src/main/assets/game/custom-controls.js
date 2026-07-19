/* Custom touch control overlay for the Phaser "Crash Bandicoot 2D" game.
 * Left/Right drag zone + A (jump) button. B button restarts the level
 * (this game has no second action key - original controls required F5).
 *
 * Phaser's keyboard manager reads native keydown/keyup events directly
 * (no jQuery here), so we dispatch real KeyboardEvents with keyCode
 * overridden via defineProperty, since browsers ignore keyCode passed
 * to the KeyboardEvent constructor.
 */
(function () {
    "use strict";

    var KEY_LEFT = 37;
    var KEY_RIGHT = 39;
    var KEY_UP = 38; // Jump (A button)

    function dispatchKey(type, keyCode) {
        var evt = new KeyboardEvent(type, { bubbles: true, cancelable: true });
        try {
            Object.defineProperty(evt, "keyCode", { get: function () { return keyCode; } });
            Object.defineProperty(evt, "which", { get: function () { return keyCode; } });
        } catch (e) { /* older browsers: ignore */ }
        window.dispatchEvent(evt);
        document.dispatchEvent(evt);
    }

    function keyDown(code) { dispatchKey("keydown", code); }
    function keyUp(code) { dispatchKey("keyup", code); }

    function buildOverlay() {
        var root = document.createElement("div");
        root.id = "custom-controls";

        var moveZone = document.createElement("div");
        moveZone.id = "move-zone";
        root.appendChild(moveZone);

        var actionWrap = document.createElement("div");
        actionWrap.id = "action-buttons";

        var btnB = document.createElement("div");
        btnB.id = "btn-b";
        btnB.className = "action-btn";
        btnB.textContent = "B";

        var btnA = document.createElement("div");
        btnA.id = "btn-a";
        btnA.className = "action-btn";
        btnA.textContent = "A";

        actionWrap.appendChild(btnB);
        actionWrap.appendChild(btnA);
        root.appendChild(actionWrap);

        document.body.appendChild(root);

        setupMoveZone(moveZone);
        setupJumpButton(btnA);
        setupRestartButton(btnB);
    }

    function setupMoveZone(zone) {
        var activePointerId = null;
        var currentDir = null;

        function dirForX(clientX) {
            var rect = zone.getBoundingClientRect();
            var relX = clientX - rect.left;
            return (relX < rect.width / 2) ? KEY_LEFT : KEY_RIGHT;
        }

        function start(e) {
            e.preventDefault();
            if (activePointerId !== null) return;
            activePointerId = e.pointerId;
            currentDir = dirForX(e.clientX);
            keyDown(currentDir);
            zone.setPointerCapture && zone.setPointerCapture(e.pointerId);
        }

        function move(e) {
            if (e.pointerId !== activePointerId) return;
            e.preventDefault();
            var newDir = dirForX(e.clientX);
            if (newDir !== currentDir) {
                keyUp(currentDir);
                currentDir = newDir;
                keyDown(currentDir);
            }
        }

        function end(e) {
            if (e.pointerId !== activePointerId) return;
            e.preventDefault();
            keyUp(currentDir);
            activePointerId = null;
            currentDir = null;
        }

        zone.addEventListener("pointerdown", start);
        zone.addEventListener("pointermove", move);
        zone.addEventListener("pointerup", end);
        zone.addEventListener("pointercancel", end);
        zone.addEventListener("pointerleave", end);
    }

    function setupJumpButton(btn) {
        var activePointerId = null;

        function start(e) {
            e.preventDefault();
            if (activePointerId !== null) return;
            activePointerId = e.pointerId;
            btn.classList.add("pressed");
            keyDown(KEY_UP);
            btn.setPointerCapture && btn.setPointerCapture(e.pointerId);
        }

        function end(e) {
            if (e.pointerId !== activePointerId) return;
            e.preventDefault();
            btn.classList.remove("pressed");
            keyUp(KEY_UP);
            activePointerId = null;
        }

        btn.addEventListener("pointerdown", start);
        btn.addEventListener("pointerup", end);
        btn.addEventListener("pointercancel", end);
        btn.addEventListener("pointerleave", end);
    }

    function setupRestartButton(btn) {
        btn.addEventListener("pointerdown", function (e) {
            e.preventDefault();
            btn.classList.add("pressed");
        });
        btn.addEventListener("pointerup", function (e) {
            e.preventDefault();
            location.reload();
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", buildOverlay);
    } else {
        buildOverlay();
    }
})();
