

// Wrapped everything in an IIFE to avoid global scope pollution
(function () {
  "use strict";

  const DAYS_PER_YEAR = 365.25;
  const HOURS_PER_DAY = 24;
  const MINUTES_PER_HOUR = 60;
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  const MAX_SHORTCUT_SLOTS = 5;
  const ANIMATION_DELAY_MS = 100;
  const ECLIPSE_ANIMATION_DELAY_MS = 300;
  const LIVE_REFRESH_MS = 30 * 1000;

  const GOOGLE_APPS = Object.freeze([
    { name: "Gmail", icon: "📧", url: "https://mail.google.com" },
    { name: "Calendar", icon: "📅", url: "https://calendar.google.com" },
    { name: "Drive", icon: "📁", url: "https://drive.google.com" },
    { name: "Docs", icon: "📄", url: "https://docs.google.com" },
    { name: "Sheets", icon: "📊", url: "https://sheets.google.com" },
    { name: "Slides", icon: "🎬", url: "https://slides.google.com" },
    { name: "Photos", icon: "📸", url: "https://photos.google.com" },
    { name: "Keep", icon: "📝", url: "https://keep.google.com" },
    { name: "YouTube", icon: "📺", url: "https://youtube.com" },
  ]);


  const LIFE_DATA = Object.freeze({
    "Global Average": { male: 71, female: 76 },
    Afghanistan: { male: 64, female: 68 },
    Albania: { male: 78, female: 81 },
    Algeria: { male: 75, female: 78 },
    "American Samoa": { male: 70, female: 76 },
    Andorra: { male: 82, female: 86 },
    Angola: { male: 62, female: 67 },
    "Antigua and Barbuda": { male: 75, female: 80 },
    Argentina: { male: 75, female: 80 },
    Armenia: { male: 74, female: 81 },
    Aruba: { male: 74, female: 79 },
    Australia: { male: 81, female: 85 },
    Austria: { male: 79, female: 84 },
    Azerbaijan: { male: 72, female: 77 },
    Bahamas : { male: 71, female: 78 },
    Bahrain: { male: 81, female: 82 },
    Bangladesh: { male: 73, female: 76 },
    Barbados: { male: 74, female: 79 },
    Belarus: { male: 70, female: 79 },
    Belgium: { male: 80, female: 85 },
    Belize: { male: 71, female: 76 },
    Benin: { male: 59, female: 62 },
    Bermuda: { male: 79, female: 86 },
    Bhutan: { male: 71, female: 75 },
    Bolivia: { male: 66, female: 71 },
    "Bosnia and Herzegovina": { male: 74, female: 81 },
    Botswana: { male: 67, female: 72 },
    Brazil: { male: 73, female: 79 },
    "British Virgin Islands": { male: 75, female: 80 },
    "Brunei Darussalam": { male: 73, female: 78 },
    Bulgaria: { male: 72, female: 80 },
    "Burkina Faso": { male: 59, female: 63 },
    Burundi: { male: 62, female: 66 },
    "Cabo Verde": { male: 73, female: 79 },
    Cambodia: { male: 68, female: 73 },
    Cameroon: { male: 62, female: 66 },
    Canada: { male: 80, female: 84 },
    "Cayman Islands": { male: 78, female: 83 },
    "Central African Republic": { male: 55, female: 59 },
    Chad: { male: 53, female: 57 },
    "Channel Islands": { male: 79, female: 83 },
    Chile: { male: 79, female: 83 },
    China: { male: 75, female: 81 },
    Colombia: { male: 75, female: 80 },
    Comoros: { male: 65, female: 69 },
    "Congo, Dem. Rep.": { male: 60, female: 64 },
    "Congo, Rep.": { male: 64, female: 67 },
    "Costa Rica": { male: 78, female: 83 },
    "Cote d'Ivoire": { male: 60, female: 64 },
    Croatia: { male: 75, female: 82 },
    Cuba: { male: 76, female: 81 },
    Curacao: { male: 72, female: 81 },
    Cyprus: { male: 80, female: 84 },
    Czechia: { male: 77, female: 83 },
    Denmark: { male: 80, female: 84 },
    Djibouti: { male: 64, female: 69 },
    Dominica: { male: 68, female: 75 },
    "Dominican Republic": { male: 71, female: 77 },
    Ecuador: { male: 75, female: 80 },
    "Egypt, Arab Rep.": { male: 69, female: 74 },
    "El Salvador": { male: 68, female: 76 },
    "Equatorial Guinea": { male: 62, female: 66 },
    Eritrea: { male: 67, female: 71 },
    Estonia: { male: 74, female: 83 },
    Eswatini: { male: 61, female: 67 },
    Ethiopia: { male: 64, female: 71 },
    "Faroe Islands": { male: 81, female: 86 },
    Fiji: { male: 65, female: 69 },
    Finland: { male: 79, female: 84 },
    France: { male: 80, female: 86 },
    "French Polynesia": { male: 82, female: 87 },
    Gabon: { male: 66, female: 71 },
    "Gambia, The": { male: 64, female: 68 },
    Georgia: { male: 70, female: 79 },
    Germany: { male: 78, female: 83 },
    Ghana: { male: 63, female: 68 },
    Gibraltar: { male: 81, female: 86 },
    Greece: { male: 79, female: 84 },
    Greenland: { male: 70, female: 73 },
    Grenada: { male: 72, female: 78 },
    Guam: { male: 73, female: 81 },
    Guatemala: { male: 70, female: 75 },
    Guinea: { male: 60, female: 62 },
    "Guinea-Bissau": { male: 62, female: 66 },
    Guyana: { male: 67, female: 74 },
    Haiti: { male: 62, female: 68 },
    Honduras: { male: 70, female: 76 },
    "Hong Kong SAR, China": { male: 83, female: 88 },
    Hungary: { male: 74, female: 80 },
    Iceland: { male: 81, female: 84 },
    India: { male: 71, female: 74 },
    Indonesia: { male: 69, female: 73 },
    "Iran, Islamic Rep.": { male: 76, female: 80 },
    Iraq: { male: 70, female: 74 },
    Ireland: { male: 81, female: 85 },
    "Isle of Man": { male: 79, female: 83 },
    Israel: { male: 81, female: 86 },
    Italy: { male: 82, female: 86 },
    Jamaica: { male: 69, female: 74 },
    Japan: { male: 81, female: 87 },
    Jordan: { male: 76, female: 80 },
    Kazakhstan: { male: 70, female: 78 },
    Kenya: { male: 61, female: 66 },
    Kiribati: { male: 65, female: 68 },
    "Korea, Dem. People's Rep.": { male: 71, female: 76 },
    "Korea, Rep.": { male: 81, female: 86 },
    Kosovo: { male: 76, female: 80 },
    Kuwait: { male: 83, female: 84 },
    "Kyrgyz Republic": { male: 68, female: 77 },
    "Lao PDR": { male: 67, female: 71 },
    Latvia: { male: 71, female: 81 },
    Lebanon: { male: 76, female: 80 },
    Lesotho: { male: 55, female: 60 },
    Liberia: { male: 61, female: 63 },
    Libya: { male: 68, female: 70 },
    Liechtenstein: { male: 83, female: 87 },
    Lithuania: { male: 73, female: 82 },
    Luxembourg: { male: 82, female: 85 },
    "Macao SAR, China": { male: 80, female: 86 },
    Madagascar: { male: 62, female: 65 },
    Malawi: { male: 64, female: 71 },
    Malaysia: { male: 74, female: 79 },
    Maldives: { male: 80, female: 83 },
    Mali: { male: 59, female: 62 },
    Malta: { male: 82, female: 85 },
    "Marshall Islands": { male: 65, female: 69 },
    Mauritania: { male: 66, female: 70 },
    Mauritius: { male: 70, female: 77 },
    Mexico: { male: 72, female: 78 },
    "Micronesia, Fed. Sts.": { male: 63, female: 71 },
    Moldova: { male: 67, female: 76 },
    Monaco: { male: 84, female: 89 },
    Mongolia: { male: 68, female: 77 },
    Montenegro: { male: 75, female: 80 },
    Morocco: { male: 73, female: 78 },
    Mozambique: { male: 60, female: 67 },
    Myanmar: { male: 64, female: 70 },
    Namibia: { male: 63, female: 71 },
    Nauru: { male: 60, female: 64 },
    Nepal: { male: 69, female: 72 },
    Netherlands: { male: 81, female: 83 },
    "New Caledonia": { male: 76, female: 81 },
    "New Zealand": { male: 81, female: 85 },
    Nicaragua: { male: 72, female: 77 },
    Niger: { male: 60, female: 62 },
    Nigeria: { male: 54, female: 55 },
    "North Macedonia": { male: 73, female: 78 },
    "Northern Mariana Islands": { male: 77, female: 81 },
    Norway: { male: 82, female: 85 },
    Oman: { male: 78, female: 82 },
    Pakistan: { male: 65, female: 70 },
    Palau: { male: 67, female: 72 },
    Panama: { male: 77, female: 83 },
    "Papua New Guinea": { male: 64, female: 69 },
    Paraguay: { male: 71, female: 77 },
    Peru: { male: 75, female: 80 },
    Philippines: { male: 67, female: 73 },
    Poland: { male: 75, female: 82 },
    Portugal: { male: 80, female: 85 },
    "Puerto Rico (US)": { male: 78, female: 85 },
    Qatar: { male: 82, female: 83 },
    Romania: { male: 73, female: 81 },
    "Russian Federation": { male: 68, female: 79 },
    Rwanda: { male: 65, female: 70 },
    Samoa: { male: 70, female: 74 },
    "San Marino": { male: 84, female: 87 },
    "Sao Tome and Principe": { male: 66, female: 74 },
    "Saudi Arabia": { male: 77, female: 81 },
    Senegal: { male: 67, female: 71 },
    Serbia: { male: 74, female: 79 },
    Seychelles: { male: 71, female: 79 },
    "Sierra Leone": { male: 60, female: 64 },
    Singapore: { male: 81, female: 85 },
    "Sint Maarten (Dutch part)": { male: 74, female: 80 },
    "Slovak Republic": { male: 75, female: 82 },
    Slovenia: { male: 79, female: 85 },
    "Solomon Islands": { male: 69, female: 72 },
    "Somalia, Fed. Rep.": { male: 56, female: 61 },
    "South Africa": { male: 63, female: 70 },
    "South Sudan": { male: 55, female: 61 },
    Spain: { male: 81, female: 87 },
    "Sri Lanka": { male: 74, female: 81 },
    "St. Kitts and Nevis": { male: 69, female: 76 },
    "St. Lucia": { male: 69, female: 76 },
    "St. Martin (French part)": { male: 77, female: 84 },
    "St. Vincent and the Grenadines": { male: 69, female: 74 },
    Sudan: { male: 63, female: 70 },
    Suriname: { male: 70, female: 77 },
    Sweden: { male: 82, female: 85 },
    Switzerland: { male: 82, female: 86 },
    "Syrian Arab Republic": { male: 70, female: 74 },
    Tajikistan: { male: 70, female: 74 },
    Tanzania: { male: 64, female: 70 },
    Thailand: { male: 72, female: 81 },
    "Timor-Leste": { male: 66, female: 69 },
    Togo: { male: 63, female: 63 },
    Tonga: { male: 69, female: 76 },
    "Trinidad and Tobago": { male: 70, female: 77 },
    Tunisia: { male: 74, female: 79 },
    Turkiye: { male: 75, female: 80 },
    Turkmenistan: { male: 67, female: 73 },
    "Turks and Caicos Islands": { male: 76, female: 80 },
    Tuvalu: { male: 64, female: 71 },
    Uganda: { male: 65, female: 71 },
    Ukraine: { male: 67, female: 80 },
    "United Arab Emirates": { male: 82, female: 84 },
    "United Kingdom": { male: 79, female: 83 },
    "United States": { male: 76, female: 81 },
    Uruguay: { male: 74, female: 82 },
    Uzbekistan: { male: 69, female: 75 },
    Vanuatu: { male: 69, female: 74 },
    "Venezuela, RB": { male: 69, female: 77 },
    "Viet Nam": { male: 70, female: 79 },
    "Virgin Islands (U.S.)": { male: 77, female: 84 },
    "West Bank and Gaza": { male: 60, female: 72 },
    "Yemen, Rep.": { male: 67, female: 71 },
    Zambia: { male: 64, female: 69 },
    Zimbabwe: { male: 60, female: 65 },
  });

  //STATE
  let currentCycle = "life";
  let userData = {};
  let settings; // initialised in the SETTINGS section below

  //UTILITY FUNCTIONS

  /**
   * Safely get element by ID with null check
   * @param {string} id - Element ID
   * @returns {HTMLElement|null}
   */
  function getElement(id) {
    return document.getElementById(id);
  }

  /**
   * Wrapper for chrome.storage.local.get with error handling
   * @param {string|string[]} keys - Storage keys to retrieve
   * @returns {Promise<Object>}
   */
  function storageGet(keys) {
    return new Promise((resolve) => {
      try {
        chrome.storage.local.get(keys, (result) => {
          if (chrome.runtime.lastError) {
            console.error("Storage get error:", chrome.runtime.lastError);
            resolve({});
          } else {
            resolve(result);
          }
        });
      } catch (e) {
        console.error("Storage get exception:", e);
        resolve({});
      }
    });
  }

  /**
   * Wrapper for chrome.storage.local.set with error handling
   * @param {Object} data - Data to store
   * @returns {Promise<void>}
   */
  function storageSet(data) {
    return new Promise((resolve) => {
      try {
        chrome.storage.local.set(data, () => {
          if (chrome.runtime.lastError) {
            console.error("Storage set error:", chrome.runtime.lastError);
          }
          resolve();
        });
      } catch (e) {
        console.error("Storage set exception:", e);
        resolve();
      }
    });
  }

  /**
   * Clamp a value between min and max
   * @param {number} value
   * @param {number} min
   * @param {number} max
   * @returns {number}
   */
  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  /**
   * Check if a year is a leap year
   * @param {number} year
   * @returns {boolean}
   */
  function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  /**
   * Parse a "YYYY-MM-DD" string as a LOCAL date.
   * (new Date("YYYY-MM-DD") parses as UTC, which shifts the day for users west of UTC.)
   * @param {string} str
   * @returns {Date|null}
   */
  function parseLocalDate(str) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(str || "");
    if (!m) return null;
    return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  }

  /**
   * Midnight (local) of the given date
   * @param {Date} date
   * @returns {Date}
   */
  function startOfDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  /**
   * Normalize user input into an absolute http(s) URL, or null if invalid
   * @param {string} input
   * @returns {string|null}
   */
  function normalizeUrl(input) {
    const trimmed = (input || "").trim();
    if (!trimmed) return null;
    const withProtocol = /^https?:\/\//i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;
    try {
      const url = new URL(withProtocol);
      const host = url.hostname;
      if (!host || (!host.includes(".") && host !== "localhost")) {
        return null;
      }
      return url.href;
    } catch (e) {
      return null;
    }
  }

  /**
   * Local favicon URL via Chrome's built-in favicon cache (no third-party request)
   * @param {string} pageUrl
   * @returns {string}
   */
  function faviconUrl(pageUrl) {
    const url = new URL(chrome.runtime.getURL("/_favicon/"));
    url.searchParams.set("pageUrl", pageUrl);
    url.searchParams.set("size", "32");
    return url.toString();
  }

  /**
   * Escape HTML entities to prevent XSS
   * @param {string} text - Text to escape
   * @returns {string}
   */
  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  // ============ SETTINGS ============
  const DEFAULT_SETTINGS = Object.freeze({
    dayStart: "00:00",
    dayEnd: "00:00",
    showTabCounter: true,
  });
  settings = normalizeSettings();

  /**
   * Merge saved settings with defaults, dropping anything malformed
   * @param {Object} [raw]
   * @returns {{dayStart: string, dayEnd: string, showTabCounter: boolean}}
   */
  function normalizeSettings(raw) {
    const out = { ...DEFAULT_SETTINGS };
    if (raw && typeof raw === "object") {
      if (parseTimeToMinutes(raw.dayStart) !== null) out.dayStart = raw.dayStart;
      if (parseTimeToMinutes(raw.dayEnd) !== null) out.dayEnd = raw.dayEnd;
      if (typeof raw.showTabCounter === "boolean") out.showTabCounter = raw.showTabCounter;
    }
    return out;
  }

  /**
   * "HH:MM" -> minutes since midnight, or null if invalid
   * @param {string} str
   * @returns {number|null}
   */
  function parseTimeToMinutes(str) {
    const m = /^(\d{2}):(\d{2})$/.exec(str || "");
    if (!m) return null;
    const h = Number(m[1]);
    const min = Number(m[2]);
    if (h > 23 || min > 59) return null;
    return h * MINUTES_PER_HOUR + min;
  }

  /**
   * The user's custom waking-hours window, or null for a normal 24h day
   * @returns {{start: number, end: number, length: number}|null}
   */
  function getDayWindow() {
    const start = parseTimeToMinutes(settings.dayStart);
    const end = parseTimeToMinutes(settings.dayEnd);
    if (start === null || end === null || start === end) return null;
    const dayMins = HOURS_PER_DAY * MINUTES_PER_HOUR;
    const length = end > start ? end - start : end + dayMins - start;
    return { start, end, length };
  }

  /**
   * Remaining minutes -> "4H 20M" / "35M" (rounded up, like a countdown)
   * @param {number} minutes
   * @returns {string}
   */
  function formatDuration(minutes) {
    const total = Math.max(0, Math.ceil(minutes - 1e-9));
    const h = Math.floor(total / MINUTES_PER_HOUR);
    const m = total % MINUTES_PER_HOUR;
    return h > 0 ? `${h}H ${m}M` : `${m}M`;
  }

  // ============ TAB COUNTER ============
  /**
   * Local date as "YYYY-MM-DD"
   * @param {Date} date
   * @returns {string}
   */
  function localDateKey(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  function renderTabCounter(tabStats) {
    const el = getElement("tabCounter");
    if (!el) return;
    if (!settings.showTabCounter) {
      el.classList.add("hidden");
      return;
    }
    const today = localDateKey(new Date());
    const count = tabStats && tabStats.date === today ? tabStats.count : 0;
    el.textContent = `TABS TODAY: ${count}`;
    el.classList.remove("hidden");
  }

  /**
   * Count this new tab (page reloads are not counted), then render
   */
  async function countThisTab() {
    let isReload = false;
    try {
      const nav = performance.getEntriesByType("navigation")[0];
      isReload = !!nav && nav.type === "reload";
    } catch (e) {
      // ignore
    }

    const res = await storageGet(["tabStats"]);
    const today = localDateKey(new Date());
    const stats =
      res.tabStats && res.tabStats.date === today
        ? res.tabStats
        : { date: today, count: 0 };

    if (!isReload) {
      stats.count += 1;
      await storageSet({ tabStats: stats });
    }
    renderTabCounter(stats);
  }

  // CUSTOM MODAL 
  const CustomModal = {
    _getElements() {
      return {
        overlay: getElement("customModal"),
        title: getElement("modalTitle"),
        message: getElement("modalMessage"),
        inputContainer: getElement("modalInputContainer"),
        input: getElement("modalInput"),
        btnOk: getElement("modalBtnOk"),
        btnCancel: getElement("modalBtnCancel"),
      };
    },

    show(type, msg, placeholder = "") {
      return new Promise((resolve) => {
        const els = this._getElements();
        if (!els.overlay) {
          resolve(type === "prompt" ? null : false);
          return;
        }

        // Reset state
        els.title.textContent =
          type === "prompt" ? "INPUT_REQUIRED" : "SYSTEM_MSG";
        els.message.textContent = msg;
        els.input.value = "";

        // Show/Hide elements based on type
        if (type === "alert") {
          els.inputContainer.classList.add("hidden");
          els.btnCancel.classList.add("hidden");
        } else if (type === "confirm") {
          els.inputContainer.classList.add("hidden");
          els.btnCancel.classList.remove("hidden");
        } else if (type === "prompt") {
          els.inputContainer.classList.remove("hidden");
          els.btnCancel.classList.remove("hidden");
          els.input.placeholder = placeholder;
        }

        // Show modal
        els.overlay.classList.remove("hidden");
        if (type === "prompt") els.input.focus();
        else els.btnOk.focus();

        // Click outside to close (for confirm/alert only)
        els.overlay.onclick = (e) => {
          if (e.target === els.overlay && type !== "prompt") {
            close(type === "alert" ? true : false);
          }
        };

        // Handlers
        const close = (value) => {
          els.overlay.classList.add("hidden");
          // Remove listeners to prevent leaks
          els.btnOk.onclick = null;
          els.btnCancel.onclick = null;
          els.input.onkeydown = null;
          els.overlay.onclick = null;
          document.removeEventListener("keydown", onKeyDown, true);
          resolve(value);
        };

        // Keyboard: Enter = OK, Escape = Cancel (works for every modal type)
        const onKeyDown = (e) => {
          if (e.isComposing) return;
          if (e.key === "Enter") {
            e.preventDefault();
            els.btnOk.click();
          } else if (e.key === "Escape") {
            e.preventDefault();
            if (type === "alert") els.btnOk.click();
            else els.btnCancel.click();
          }
        };
        document.addEventListener("keydown", onKeyDown, true);

        els.btnOk.onclick = () => {
          if (type === "prompt") close(els.input.value);
          else close(true);
        };

        els.btnCancel.onclick = () => {
          if (type === "prompt") close(null);
          else close(false);
        };

      });
    },

    alert(msg) {
      return this.show("alert", msg);
    },
    confirm(msg) {
      return this.show("confirm", msg);
    },
    prompt(msg, placeholder) {
      return this.show("prompt", msg, placeholder);
    },
  };

  // ============ CYCLE STATS CALCULATION ============
  function getCycleStats() {
    const now = new Date();

    if (currentCycle === "life") {
      if (!userData.dob) return null;
      const birthDate = parseLocalDate(userData.dob);
      if (!birthDate) return null;
      const dataSet = LIFE_DATA[userData.country] || LIFE_DATA["Global Average"];
      const maxAge = dataSet[userData.gender];
      const totalDays = maxAge * DAYS_PER_YEAR;
      const livedDays = (now - birthDate) / MS_PER_DAY;
      const yearsLived = livedDays / DAYS_PER_YEAR;
      const yearsLeft = maxAge - yearsLived;

      return {
        current: Math.floor(yearsLived),
        max: maxAge,
        percent: (livedDays / totalDays) * 100,
        label: "LEVEL",
        maxLabel: "MAX CAP",
        msg:
          yearsLeft > 0
            ? `TIME REMAINING: ${yearsLeft.toFixed(1)} YEARS`
            : `BONUS STAGE: +${Math.abs(yearsLeft).toFixed(1)} YEARS`,
      };
    } else if (currentCycle === "year") {
      const year = now.getFullYear();
      const start = new Date(year, 0, 1);
      const end = new Date(year + 1, 0, 1);
      // Use real start/end timestamps so DST shifts can't cause off-by-one days
      const fraction = (now - start) / (end - start);
      const totalDays = isLeapYear(year) ? 366 : 365;
      const dayOfYear = Math.round((startOfDay(now) - start) / MS_PER_DAY) + 1;

      return {
        current: dayOfYear,
        max: totalDays,
        percent: fraction * 100,
        label: "DAY PASSED",
        maxLabel: "TOTAL DAYS",
        msg: `ORBIT PROGRESS: ${dayOfYear}/${totalDays} DAYS`,
      };
    } else if (currentCycle === "month") {
      const dayOfMonth = now.getDate();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      const totalDays = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0
      ).getDate();

      return {
        current: dayOfMonth,
        max: totalDays,
        percent: ((now - start) / (end - start)) * 100,
        label: "DAY PASSED",
        maxLabel: "TOTAL DAYS",
        msg: `LUNAR CYCLE: ${dayOfMonth}/${totalDays} DAYS`,
      };
    } else if (currentCycle === "day") {
      const hours = now.getHours();
      const mins = now.getMinutes();
      const totalMins = hours * MINUTES_PER_HOUR + mins;
      const dayMins = HOURS_PER_DAY * MINUTES_PER_HOUR;

      const dayWindow = getDayWindow();
      if (dayWindow) {
        // Custom waking hours (may cross midnight, e.g. 10:00 -> 02:00)
        const nowMins = totalMins + now.getSeconds() / 60;
        const sinceStart = (nowMins - dayWindow.start + dayMins) % dayMins;
        const totalHours = Math.round((dayWindow.length / MINUTES_PER_HOUR) * 10) / 10;

        let percent;
        let msg;
        if (sinceStart <= dayWindow.length) {
          percent = (sinceStart / dayWindow.length) * 100;
          msg = `TIME LEFT: ${formatDuration(dayWindow.length - sinceStart)}`;
        } else {
          // Outside waking hours: closer to the end -> resting, closer to the start -> not started
          const sinceEnd = (nowMins - dayWindow.end + dayMins) % dayMins;
          const untilStart = (dayWindow.start - nowMins + dayMins) % dayMins;
          if (sinceEnd < untilStart) {
            percent = 100;
            msg = "REST MODE: DAY COMPLETE";
          } else {
            percent = 0;
            msg = `DAY STARTS IN ${formatDuration(untilStart)}`;
          }
        }

        return {
          current: Math.floor(((percent / 100) * dayWindow.length) / MINUTES_PER_HOUR),
          max: totalHours,
          percent,
          label: "HOURS PASSED",
          maxLabel: "WAKING HOURS",
          msg,
        };
      }

      return {
        current: hours,
        max: HOURS_PER_DAY,
        percent: (totalMins / dayMins) * 100,
        label: "CURRENT HOUR",
        maxLabel: "TOTAL HOURS",
        msg: `DAY CYCLE: ${hours}:${mins.toString().padStart(2, "0")}`,
      };
    }

    return null;
  }

  // ============ UI UPDATE FUNCTIONS ============
  function updateCycleButtons() {
    document.querySelectorAll(".cycle-btn").forEach((btn) => {
      if (btn.dataset.cycle === currentCycle) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }

  function renderDashboard() {
    const appEl = getElement("app");
    const onboardingEl = getElement("onboarding");

    if (!appEl || !onboardingEl) return;

    // Show the Dashboard
    appEl.classList.remove("hidden");
    onboardingEl.classList.add("hidden");

    const stats = getCycleStats();
    if (!stats) return;

    const visualPercentage = clamp(stats.percent, 0, 100);

    // Update Labels
    const hudStats = document.querySelectorAll(".hud-stat");
    if (hudStats[0]) {
      const label = hudStats[0].querySelector(".label");
      if (label) label.textContent = stats.label;
    }
    if (hudStats[1]) {
      const label = hudStats[1].querySelector(".label");
      if (label) label.textContent = stats.maxLabel;
    }

    // Update values
    const levelDisplay = getElement("levelDisplay");
    const capDisplay = getElement("capDisplay");
    const percentDisplay = getElement("percentDisplay");
    const timeLeftDisplay = getElement("timeLeftDisplay");

    if (levelDisplay) levelDisplay.textContent = stats.current;
    if (capDisplay) capDisplay.textContent = stats.max;
    if (percentDisplay) percentDisplay.textContent = stats.percent.toFixed(1) + "%";
    if (timeLeftDisplay) timeLeftDisplay.textContent = stats.msg;

    // Animate Visuals
    const expBar = getElement("expBar");
    if (expBar) {
      setTimeout(() => {
        expBar.style.width = visualPercentage + "%";
      }, ANIMATION_DELAY_MS);
    }

    // Eclipse Animation
    const eclipseShadow = getElement("eclipseShadow");
    if (eclipseShadow) {
      setTimeout(() => {
        const shadowPos = -100 + visualPercentage;
        eclipseShadow.style.left = shadowPos + "%";
      }, ECLIPSE_ANIMATION_DELAY_MS);
    }
  }

  // ============ INVENTORY (SHORTCUTS) ============
  function renderInventory() {
    const inventoryDock = getElement("inventoryDock");
    if (!inventoryDock) return;

    storageGet(["inventory"]).then((res) => {
      // Drop any corrupted entries so one bad item can't break the whole dock
      const inventory = (Array.isArray(res.inventory) ? res.inventory : [])
        .filter((item) => item && normalizeUrl(item.url));
      inventoryDock.innerHTML = "";

      for (let i = 0; i < MAX_SHORTCUT_SLOTS; i++) {
        const slot = document.createElement("div");
        slot.className = "inv-slot";

        if (inventory[i]) {
          const item = inventory[i];
          const itemUrl = normalizeUrl(item.url);
          const title = item.title || new URL(itemUrl).hostname;
          slot.setAttribute("data-title", title);
          slot.title = title;

          // Icon (from Chrome's local favicon cache)
          const img = document.createElement("img");
          img.src = faviconUrl(itemUrl);
          img.alt = title;
          slot.appendChild(img);

          // Click to open
          slot.addEventListener("click", () => {
            window.location.href = itemUrl;
          });

          // Right click to remove
          slot.addEventListener("contextmenu", async (e) => {
            e.preventDefault();
            const confirmed = await CustomModal.confirm(
              `Delete shortcut to ${title}?`
            );
            if (confirmed) {
              // Re-read storage so changes from other tabs aren't overwritten
              const latest = await storageGet(["inventory"]);
              const current = Array.isArray(latest.inventory) ? latest.inventory : [];
              const idx = current.findIndex((s) => s && s.url === item.url);
              if (idx !== -1) current.splice(idx, 1);
              await storageSet({ inventory: current });
              renderInventory();
            }
          });
        } else {
          slot.className += " empty";
          slot.title = "Add shortcut";
          slot.addEventListener("click", async () => {
            const input = await CustomModal.prompt(
              "Enter URL for shortcut:",
              "e.g., youtube.com"
            );
            if (input === null || !input.trim()) return;

            const finalUrl = normalizeUrl(input);
            if (!finalUrl) {
              await CustomModal.alert("Invalid URL");
              return;
            }
            const latest = await storageGet(["inventory"]);
            const current = Array.isArray(latest.inventory) ? latest.inventory : [];
            if (current.length >= MAX_SHORTCUT_SLOTS) {
              await CustomModal.alert("INVENTORY FULL");
              renderInventory();
              return;
            }
            current.push({ title: new URL(finalUrl).hostname, url: finalUrl });
            await storageSet({ inventory: current });
            renderInventory();
          });
        }
        inventoryDock.appendChild(slot);
      }
    });
  }

  // ============ QUEST LOG ============
  function newId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  /**
   * Read the latest quests from storage, transform them, save, and re-render.
   * @param {(quests: Array) => Array} transform
   */
  async function updateQuests(transform) {
    const res = await storageGet(["quests"]);
    const quests = Array.isArray(res.quests) ? res.quests : [];
    await storageSet({ quests: transform(quests) });
    renderQuests();
  }

  function renderQuests() {
    const questLog = getElement("questLog");
    const questList = getElement("questList");
    const completedQuestList = getElement("completedQuestList");
    const completedDivider = getElement("completedDivider");
    const clearCompletedBtn = getElement("clearCompletedBtn");
    const toggleQuestBtn = getElement("toggleQuestBtn");

    if (!questLog || !questList) return;

    storageGet(["quests", "questLogCollapsed"]).then(async (res) => {
      const quests = Array.isArray(res.quests) ? res.quests : [];

      // One-time migration: older quests have no id
      if (quests.some((q) => !q.id)) {
        quests.forEach((q) => {
          if (!q.id) q.id = newId();
        });
        await storageSet({ quests });
      }

      const isCollapsed = res.questLogCollapsed || false;

      // Handle Collapsed State
      if (isCollapsed) {
        questLog.classList.add("collapsed");
        if (toggleQuestBtn) {
          toggleQuestBtn.textContent = "▼";
          toggleQuestBtn.title = "Expand";
        }
      } else {
        questLog.classList.remove("collapsed");
        if (toggleQuestBtn) {
          toggleQuestBtn.textContent = "▲";
          toggleQuestBtn.title = "Minimize";
        }
      }

      // Clear Lists
      questList.innerHTML = "";
      if (completedQuestList) completedQuestList.innerHTML = "";

      let activeCount = 0;
      let completedCount = 0;

      quests.forEach((quest) => {
        const item = document.createElement("div");
        item.className = `quest-item ${quest.completed ? "completed" : ""}`;
        item.innerHTML = `
          <div class="quest-checkbox"></div>
          <span>${escapeHtml(quest.text)}</span>
        `;

        // Toggle Complete (re-read storage so other tabs' changes aren't lost)
        item.addEventListener("click", async () => {
          await updateQuests((list) =>
            list.map((q) =>
              q.id === quest.id ? { ...q, completed: !q.completed } : q
            )
          );
        });

        // Right click delete
        item.addEventListener("contextmenu", async (e) => {
          e.preventDefault();
          if (await CustomModal.confirm("ABANDON QUEST?")) {
            await updateQuests((list) => list.filter((q) => q.id !== quest.id));
          }
        });

        if (quest.completed) {
          if (completedQuestList) completedQuestList.appendChild(item);
          completedCount++;
        } else {
          questList.appendChild(item);
          activeCount++;
        }
      });

      // Empty State for Active (using CSS class instead of inline style)
      if (activeCount === 0) {
        const emptyState = document.createElement("div");
        emptyState.className = "quest-empty-state";
        emptyState.textContent = "NO ACTIVE QUESTS";
        questList.appendChild(emptyState);
      }

      // Handle Completed Section Visibility
      if (completedDivider && clearCompletedBtn) {
        if (completedCount > 0) {
          completedDivider.classList.remove("hidden");
          clearCompletedBtn.classList.remove("hidden");
        } else {
          completedDivider.classList.add("hidden");
          clearCompletedBtn.classList.add("hidden");
        }
      }
    });
  }

  // ============ GOOGLE APPS ============
  function renderGoogleApps() {
    const googleAppsGrid = document.querySelector(".google-apps-grid");
    if (!googleAppsGrid) return;

    googleAppsGrid.innerHTML = GOOGLE_APPS.map(
      (app) => `
      <a href="${app.url}" target="_blank" class="google-app-item" title="${app.name}">
        <span style="font-size: 24px;">${app.icon}</span>
        <span class="google-app-label">${app.name}</span>
      </a>
    `
    ).join("");
  }

  function initGoogleAppsTray() {
    const googleAppsTray = getElement("googleAppsTray");
    const googleAppsToggle = getElement("googleAppsToggle");
    const googleAppsMenu = getElement("googleAppsMenu");

    if (!googleAppsTray || !googleAppsToggle || !googleAppsMenu) return;

    // Render apps
    renderGoogleApps();

    // Toggle menu
    googleAppsToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      googleAppsMenu.classList.toggle("hidden");
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!googleAppsTray.contains(e.target)) {
        googleAppsMenu.classList.add("hidden");
      }
    });

    // Clean up the position saved by the old draggable version
    try {
      chrome.storage.local.remove("googleAppsTrayPosition");
    } catch (e) {
      // ignore
    }
  }

  // ============ SETTINGS MODAL ============
  function initSettingsModal() {
    const settingsBtn = getElement("settingsBtn");
    const modal = getElement("settingsModal");
    const startInput = getElement("dayStartInput");
    const endInput = getElement("dayEndInput");
    const tabToggle = getElement("tabCounterToggle");
    const saveBtn = getElement("settingsSaveBtn");
    const cancelBtn = getElement("settingsCancelBtn");
    if (!settingsBtn || !modal || !startInput || !endInput || !tabToggle) return;

    const close = () => {
      modal.classList.add("hidden");
      document.removeEventListener("keydown", onKeyDown, true);
      settingsBtn.focus();
    };

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
    };

    settingsBtn.addEventListener("click", () => {
      startInput.value = settings.dayStart;
      endInput.value = settings.dayEnd;
      tabToggle.checked = settings.showTabCounter;
      modal.classList.remove("hidden");
      document.addEventListener("keydown", onKeyDown, true);
      startInput.focus();
    });

    cancelBtn?.addEventListener("click", close);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) close();
    });

    saveBtn?.addEventListener("click", async () => {
      // Empty time inputs fall back to midnight
      const dayStart = startInput.value || "00:00";
      const dayEnd = endInput.value || "00:00";
      if (
        parseTimeToMinutes(dayStart) === null ||
        parseTimeToMinutes(dayEnd) === null
      ) {
        close();
        await CustomModal.alert("ERROR: INVALID TIME.");
        return;
      }
      const next = normalizeSettings({
        dayStart,
        dayEnd,
        showTabCounter: tabToggle.checked,
      });
      settings = next;
      await storageSet({ settings: next });
      close();
      const app = getElement("app");
      if (app && !app.classList.contains("hidden")) renderDashboard();
      const res = await storageGet(["tabStats"]);
      renderTabCounter(res.tabStats);
    });
  }

  // ============ INITIALIZATION ============
  function initApp() {
    // Populate Country Dropdown
    const countrySelect = getElement("countryInput");
    if (countrySelect) {
      // Add default hidden option
      const defaultOption = document.createElement("option");
      defaultOption.text = "SELECT REGION";
      defaultOption.value = "";
      defaultOption.disabled = true;
      defaultOption.selected = true;
      countrySelect.appendChild(defaultOption);

      // Populate list alphabetically
      Object.keys(LIFE_DATA)
        .sort()
        .forEach((country) => {
          if (country !== "Global Average") {
            const option = document.createElement("option");
            option.value = country;
            option.textContent = country;
            countrySelect.appendChild(option);
          }
        });
    }

    // Auto-open Date Picker with validation
    const dobInput = getElement("dobInput");
    if (dobInput) {
      // Set date constraints: 1900 to today
      dobInput.min = "1900-01-01";
      dobInput.max = new Date().toISOString().split("T")[0];

      dobInput.addEventListener("click", function () {
        try {
          this.showPicker();
        } catch (e) {
          // Fallback or ignore if not supported
        }
      });
    }

    // Load Saved Data & Theme
    storageGet([
      "dob",
      "country",
      "gender",
      "theme",
      "currentCycle",
      "isGuest",
      "settings",
    ]).then(
      (res) => {
        settings = normalizeSettings(res.settings);
        countThisTab();

        // Apply theme
        if (res.theme) {
          document.body.className = res.theme;
          const themeSelect = getElement("themeSelect");
          if (themeSelect) themeSelect.value = res.theme;
        }

        // Set Cycle
        if (res.currentCycle) {
          currentCycle = res.currentCycle;
        }
        updateCycleButtons();

        // Check user data
        userData = { dob: res.dob, country: res.country, gender: res.gender };
        const hasData = res.dob && res.country && res.gender;
        const isGuest = res.isGuest;

        if (hasData || isGuest) {
          // If guest mode, force non-life cycle if currently on life
          if (isGuest && currentCycle === "life") {
            currentCycle = "day";
            updateCycleButtons();
          }
          renderDashboard();
        } else {
          const onboarding = getElement("onboarding");
          if (onboarding) onboarding.classList.remove("hidden");
        }
      }
    );

    // Save Button Logic
    const saveBtn = getElement("saveBtn");
    if (saveBtn) {
      saveBtn.addEventListener("click", async () => {
        const dob = getElement("dobInput")?.value;
        const country = getElement("countryInput")?.value;
        const gender = getElement("genderInput")?.value;

        if (dob && country && gender) {
          await storageSet({ dob, country, gender, isGuest: false });
          userData = { dob, country, gender };
          const onboarding = getElement("onboarding");
          if (onboarding) onboarding.classList.add("hidden");
          currentCycle = "life";
          updateCycleButtons();
          renderDashboard();
        } else {
          await CustomModal.alert("ERROR: MISSING DATA INPUT.");
        }
      });
    }

    // Skip Button Logic
    const skipBtn = getElement("skipBtn");
    if (skipBtn) {
      skipBtn.addEventListener("click", async () => {
        await storageSet({ isGuest: true });
        const onboarding = getElement("onboarding");
        if (onboarding) onboarding.classList.add("hidden");
        currentCycle = "day";
        updateCycleButtons();
        renderDashboard();
      });
    }

    // Cycle Switcher Logic
    document.querySelectorAll(".cycle-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const cycle = e.target.dataset.cycle;

        // Check if trying to access LIFE without data
        if (cycle === "life" && !userData.dob) {
          const confirmed = await CustomModal.confirm(
            "INITIALIZE CHARACTER TO VIEW LIFE STATS?"
          );
          if (confirmed) {
            const app = getElement("app");
            const onboarding = getElement("onboarding");
            if (app) app.classList.add("hidden");
            if (onboarding) onboarding.classList.remove("hidden");
          }
          return;
        }

        currentCycle = cycle;
        await storageSet({ currentCycle: cycle });
        updateCycleButtons();
        renderDashboard();
      });
    });

    // Theme Changer
    const themeSelect = getElement("themeSelect");
    if (themeSelect) {
      themeSelect.addEventListener("change", async (e) => {
        const newTheme = e.target.value;
        document.body.className = newTheme;
        await storageSet({ theme: newTheme });
      });
    }

    // Reset Button
    const resetBtn = getElement("resetBtn");
    if (resetBtn) {
      resetBtn.addEventListener("click", async () => {
        const confirmed = await CustomModal.confirm(
          "RESET ALL DATA? THIS WILL ERASE YOUR CHARACTER, QUESTS, SHORTCUTS AND THEME."
        );
        if (!confirmed) return;
        try {
          await new Promise((resolve) => chrome.storage.local.clear(resolve));
        } catch (e) {
          console.error("Reset error:", e);
        }
        location.reload();
      });
    }

    // Search Functionality
    const searchInput = getElement("searchInput");
    if (searchInput) {
      searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.isComposing) {
          const query = searchInput.value.trim();
          if (query) {
             chrome.search.query({ text: query, disposition: "CURRENT_TAB" });
          }
        }
      });
    }

    // Initialize Inventory
    renderInventory();

    // Initialize Quest Log
    const addQuestBtn = getElement("addQuestBtn");
    const toggleQuestBtn = getElement("toggleQuestBtn");
    const clearCompletedBtn = getElement("clearCompletedBtn");
    const questLog = getElement("questLog");

    if (addQuestBtn) {
      addQuestBtn.addEventListener("click", async () => {
        const input = await CustomModal.prompt("NEW QUEST OBJECTIVE:");
        const text = input ? input.trim() : "";
        if (text) {
          await updateQuests((list) => [
            ...list,
            { id: newId(), text, completed: false },
          ]);
        }
      });
    }

    if (toggleQuestBtn && questLog) {
      toggleQuestBtn.addEventListener("click", async () => {
        const isCollapsed = questLog.classList.contains("collapsed");
        await storageSet({ questLogCollapsed: !isCollapsed });
        renderQuests();
      });
    }

    if (clearCompletedBtn) {
      clearCompletedBtn.addEventListener("click", async () => {
        if (await CustomModal.confirm("CLEAR COMPLETED QUESTS?")) {
          await updateQuests((list) => list.filter((q) => !q.completed));
        }
      });
    }

    renderQuests();

    initGoogleAppsTray();

    // Live refresh: keep stats current while the tab stays open
    setInterval(() => {
      const app = getElement("app");
      if (app && !app.classList.contains("hidden")) renderDashboard();
    }, LIVE_REFRESH_MS);

    initSettingsModal();

    // Keep multiple open tabs in sync
    try {
      chrome.storage.onChanged.addListener((changes, area) => {
        if (area !== "local") return;
        if (changes.settings) {
          settings = normalizeSettings(changes.settings.newValue);
          const app = getElement("app");
          if (app && !app.classList.contains("hidden")) renderDashboard();
          storageGet(["tabStats"]).then((r) => renderTabCounter(r.tabStats));
        }
        if (changes.tabStats) renderTabCounter(changes.tabStats.newValue);
        if (changes.quests || changes.questLogCollapsed) renderQuests();
        if (changes.inventory) renderInventory();
        if (changes.theme && changes.theme.newValue) {
          document.body.className = changes.theme.newValue;
          const themeSelect = getElement("themeSelect");
          if (themeSelect) themeSelect.value = changes.theme.newValue;
        }
      });
    } catch (e) {
      console.error("Storage listener error:", e);
    }
  }

  // Small shared API for the other feature scripts (focus.js)
  window.RetroLife = Object.freeze({
    storageGet,
    storageSet,
    getElement,
    clamp,
    CustomModal,
  });

  // ============ ENTRY POINT ============
  document.addEventListener("DOMContentLoaded", initApp);
})();
