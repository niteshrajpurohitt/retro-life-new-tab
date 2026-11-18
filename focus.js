// FOCUS TIMER ("BOSS BATTLE")
// A focus session is a boss fight: the boss's HP drains as the minutes pass.
// The battle lives in storage (by end time), so every open/new tab shows the
// same fight and closing tabs doesn't interrupt it.
(function () {
  "use strict";

  const TICK_MS = 1000;
  const MS_PER_MINUTE = 60 * 1000;
  const VICTORY_VISIBLE_MS = 12 * 60 * 60 * 1000; // hide old victories after 12h
  const ALLOWED_MINUTES = [15, 25, 50];

  const app = window.RetroLife;
  if (!app) return;
  const { storageGet, storageSet, getElement, clamp, CustomModal } = app;

  // Cached copy of storage, kept fresh via chrome.storage.onChanged
  let focus = null; // { startedAt, endsAt, minutes }
  let focusResult = null; // { endsAt, minutes } - last victory, until dismissed
  let focusStats = { defeated: 0, lastVictoryEndsAt: null };
  let completing = false;
  const baseTitle = document.title;

  function isValidFocus(f) {
    return (
      !!f &&
      Number.isFinite(f.startedAt) &&
      Number.isFinite(f.endsAt) &&
      f.endsAt > f.startedAt
    );
  }

  function formatClock(ms) {
    const totalSec = Math.max(0, Math.ceil(ms / 1000));
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  function formatAgo(ms) {
    const mins = Math.floor(ms / MS_PER_MINUTE);
    if (mins < 1) return "JUST NOW";
    if (mins < 60) return `${mins} MIN AGO`;
    return `${Math.floor(mins / 60)}H AGO`;
  }

  // ---- State changes ----
  async function startBattle(minutes) {
    const now = Date.now();
    focus = {
      startedAt: now,
      endsAt: now + minutes * MS_PER_MINUTE,
      minutes,
    };
    focusResult = null;
    await storageSet({ focus, focusResult: null });
    render();
  }

  async function retreat() {
    const confirmed = await CustomModal.confirm(
      "RETREAT? THE BOSS WILL ESCAPE."
    );
    if (!confirmed) return;
    focus = null;
    await storageSet({ focus: null });
    render();
  }

  async function dismissVictory() {
    focusResult = null;
    await storageSet({ focusResult: null });
    render();
  }

  async function completeBattle() {
    if (completing || !focus) return;
    completing = true;
    try {
      const finished = focus;
      const res = await storageGet(["focusStats"]);
      const stats = res.focusStats || { defeated: 0, lastVictoryEndsAt: null };
      // Several tabs may finish the same battle - only count it once
      if (stats.lastVictoryEndsAt !== finished.endsAt) {
        stats.defeated = (stats.defeated || 0) + 1;
        stats.lastVictoryEndsAt = finished.endsAt;
      }
      focusStats = stats;
      focus = null;
      focusResult = { endsAt: finished.endsAt, minutes: finished.minutes };
      await storageSet({ focus: null, focusResult, focusStats: stats });
      flashVictory();
    } finally {
      completing = false;
      render();
    }
  }

  // ---- Rendering ----
  function flashVictory() {
    const bar = getElement("bossBar");
    if (!bar) return;
    bar.classList.remove("flash");
    void bar.offsetWidth; // restart the animation
    bar.classList.add("flash");
  }

  // Set HP width; jump instantly (no slide) when the bar was hidden or the state changed
  function setHp(hp, percent, instant) {
    if (instant) {
      hp.style.transition = "none";
      hp.style.width = percent + "%";
      void hp.offsetWidth;
      hp.style.transition = "";
    } else {
      hp.style.width = percent + "%";
    }
  }

  function render() {
    const bar = getElement("bossBar");
    const label = getElement("bossLabel");
    const time = getElement("bossTime");
    const hp = getElement("bossHp");
    const btn = getElement("bossActionBtn");
    if (!bar || !label || !time || !hp || !btn) return;

    const now = Date.now();
    const wasHidden = bar.classList.contains("hidden");
    const wasVictory = bar.classList.contains("victory");

    if (isValidFocus(focus)) {
      if (now >= focus.endsAt) {
        completeBattle();
        return;
      }
      const total = focus.endsAt - focus.startedAt;
      const left = focus.endsAt - now;
      const hpPercent = clamp((left / total) * 100, 0, 100);

      bar.classList.remove("hidden", "victory");
      bar.classList.toggle("low-hp", hpPercent <= 15);
      label.textContent = "BOSS BATTLE";
      time.textContent = formatClock(left);
      setHp(hp, hpPercent, wasHidden || wasVictory);
      btn.textContent = "RETREAT";
      btn.dataset.action = "retreat";
      document.title = `${formatClock(left)} - BOSS BATTLE`;
      return;
    }

    document.title = baseTitle;

    if (
      focusResult &&
      Number.isFinite(focusResult.endsAt) &&
      now - focusResult.endsAt < VICTORY_VISIBLE_MS
    ) {
      bar.classList.remove("hidden", "low-hp");
      bar.classList.add("victory");
      label.textContent = "BOSS DEFEATED!";
      time.textContent = formatAgo(now - focusResult.endsAt);
      setHp(hp, 0, wasHidden);
      btn.textContent = "OK";
      btn.dataset.action = "dismiss";
      return;
    }

    bar.classList.add("hidden");
    bar.classList.remove("victory", "low-hp");
  }

  // ---- Focus modal (choose battle length) ----
  function initFocusModal() {
    const focusBtn = getElement("focusBtn");
    const modal = getElement("focusModal");
    const cancelBtn = getElement("focusCancelBtn");
    const defeatedEl = getElement("bossesDefeated");
    if (!focusBtn || !modal) return;

    const close = () => {
      modal.classList.add("hidden");
      document.removeEventListener("keydown", onKeyDown, true);
      focusBtn.focus();
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
    };

    focusBtn.addEventListener("click", async () => {
      if (isValidFocus(focus) && Date.now() < focus.endsAt) {
        await CustomModal.alert("A BATTLE IS ALREADY IN PROGRESS.");
        return;
      }
      if (defeatedEl) {
        defeatedEl.textContent = `BOSSES DEFEATED: ${focusStats.defeated || 0}`;
      }
      modal.classList.remove("hidden");
      document.addEventListener("keydown", onKeyDown, true);
      const first = modal.querySelector(".focus-option");
      if (first) first.focus();
    });

    modal.querySelectorAll(".focus-option").forEach((option) => {
      option.addEventListener("click", async () => {
        const minutes = Number(option.dataset.minutes);
        if (!ALLOWED_MINUTES.includes(minutes)) return;
        close();
        await startBattle(minutes);
      });
    });

    cancelBtn?.addEventListener("click", close);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) close();
    });
  }

  // ---- Init ----
  async function init() {
    const res = await storageGet(["focus", "focusResult", "focusStats"]);
    focus = isValidFocus(res.focus) ? res.focus : null;
    focusResult = res.focusResult || null;
    if (res.focusStats) focusStats = res.focusStats;

    initFocusModal();

    const btn = getElement("bossActionBtn");
    btn?.addEventListener("click", () => {
      if (btn.dataset.action === "retreat") retreat();
      else dismissVictory();
    });

    // Keep in sync with other tabs
    try {
      chrome.storage.onChanged.addListener((changes, area) => {
        if (area !== "local") return;
        let changed = false;
        if (changes.focus) {
          focus = isValidFocus(changes.focus.newValue)
            ? changes.focus.newValue
            : null;
          changed = true;
        }
        if (changes.focusResult) {
          focusResult = changes.focusResult.newValue || null;
          changed = true;
        }
        if (changes.focusStats && changes.focusStats.newValue) {
          focusStats = changes.focusStats.newValue;
        }
        if (changed) render();
      });
    } catch (e) {
      console.error("Focus storage listener error:", e);
    }

    render();
    setInterval(render, TICK_MS);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
