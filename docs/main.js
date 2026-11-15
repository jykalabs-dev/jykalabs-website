// jykalabs.com: theme toggle, the hero product tabs, small scroll motion, and the contact form (checks the message,
// sends it to Web3Forms, shows what happened in place, and never loses what the person wrote).
// No cookies: the only thing stored is the theme choice, in this browser's localStorage.
(function () {
  "use strict";

  var SUPPORT_EMAIL = "support@jykalabs.com";
  var TOPICS = ["Build a product with us", "Partnership or investment", "Joining Jyka Labs", "Our products", "Something else"];
  var MESSAGE_MIN = 10;
  var MESSAGE_MAX = 5000;
  var TIMEOUT_MS = 20000;
  var THEME_KEY = "jyka-theme";
  var root = document.documentElement;
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  // ---------- Theme ----------
  var themeToggle = document.getElementById("theme-toggle");
  var themeColor = document.querySelector('meta[name="theme-color"]');
  function applyTheme(dark) {
    if (dark) root.setAttribute("data-theme", "dark");
    else root.removeAttribute("data-theme");
    if (themeToggle) {
      themeToggle.setAttribute("aria-pressed", dark ? "true" : "false");
    }
    if (themeColor) themeColor.setAttribute("content", dark ? "#0B0D0C" : "#F8F8F6");
  }
  if (themeToggle) {
    applyTheme(root.getAttribute("data-theme") === "dark");
    themeToggle.hidden = false;
    themeToggle.addEventListener("click", function () {
      var dark = root.getAttribute("data-theme") !== "dark";
      applyTheme(dark);
      try { localStorage.setItem(THEME_KEY, dark ? "dark" : "light"); } catch (e) { /* private mode: the choice lasts this visit */ }
    });
  }

  // ---------- Hero: product tabs ----------
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[data-stage-tabs] [role="tab"]'));
  if (tabs.length) {
    document.querySelector("[data-stage-tabs]").hidden = false;
    var selectTab = function (index, focus) {
      tabs.forEach(function (tab, i) {
        var on = i === index;
        var panel = document.getElementById(tab.getAttribute("aria-controls"));
        tab.setAttribute("aria-selected", on ? "true" : "false");
        tab.tabIndex = on ? 0 : -1;
        if (on && panel.hidden) {
          panel.hidden = false;
          panel.classList.remove("is-entering");
          void panel.offsetWidth; // restart the entrance
          panel.classList.add("is-entering");
        } else if (!on) {
          panel.hidden = true;
        }
      });
      if (focus) tabs[index].focus();
    };
    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { selectTab(i, false); });
      tab.addEventListener("keydown", function (event) {
        var next = null;
        if (event.key === "ArrowRight") next = (i + 1) % tabs.length;
        else if (event.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
        else if (event.key === "Home") next = 0;
        else if (event.key === "End") next = tabs.length - 1;
        if (next !== null) { event.preventDefault(); selectTab(next, true); }
      });
    });
  }

  // ---------- Scroll motion: reveal once, and play the city video only when visible ----------
  var revealables = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-in"); io.unobserve(entry.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add("is-in"); });
  }

  var video = document.querySelector("[data-ambient]");
  var videoToggle = document.querySelector("[data-ambient-toggle]");
  var saveData = navigator.connection && navigator.connection.saveData;
  if (video && videoToggle && !reduceMotion && !saveData && "IntersectionObserver" in window) {
    var userPaused = false;
    var setPlaying = function (on) {
      videoToggle.setAttribute("aria-pressed", on ? "true" : "false");
      videoToggle.setAttribute("aria-label", on ? "Pause background video" : "Play background video");
    };
    var play = function () {
      var p = video.play();
      if (p && p.then) p.then(function () { setPlaying(true); }).catch(function () { setPlaying(false); });
    };
    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !userPaused) play();
        else if (!entry.isIntersecting) video.pause();
      });
    }, { threshold: 0.25 }).observe(video);
    videoToggle.addEventListener("click", function () {
      if (video.paused) { userPaused = false; play(); }
      else { userPaused = true; video.pause(); setPlaying(false); }
    });
    videoToggle.hidden = false;
  }
  // With reduced motion or data saver on, the still photo (the poster) is shown and the video never downloads.

  // ---------- Contact form ----------
  var form = document.getElementById("contact-form");
  if (!form) return;

  var send = document.getElementById("send");
  var status = document.getElementById("send-status");
  var sent = document.getElementById("sent");
  var fallback = document.getElementById("fallback");
  var fallbackMail = document.getElementById("fallback-mail");
  var topic = document.getElementById("f-topic");
  var message = document.getElementById("f-message");
  var counter = document.querySelector("[data-counter]");
  var formCard = document.querySelector(".form-card");
  // The access key lives in one place: the hidden access_key field in index.html.
  var keyField = form.elements.namedItem("access_key");

  // Audience cards choose the topic, then bring the form into view and put the cursor in it.
  var audiences = Array.prototype.slice.call(document.querySelectorAll("a[data-topic]"));
  var markAudience = function () {
    audiences.forEach(function (a) { a.classList.toggle("is-selected", a.getAttribute("data-topic") === topic.value); });
  };
  audiences.forEach(function (link) {
    link.addEventListener("click", function (event) {
      var wanted = link.getAttribute("data-topic");
      if (TOPICS.indexOf(wanted) === -1) return;
      event.preventDefault();
      topic.value = wanted;
      markAudience();
      if (form.hidden) return;
      var first = document.getElementById("f-name");
      var target = first.value.trim() ? message : first;
      formCard.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
      target.focus({ preventScroll: true });
      formCard.classList.remove("is-flash");
      void formCard.offsetWidth;
      formCard.classList.add("is-flash");
    });
  });
  topic.addEventListener("change", markAudience);

  var fmt = function (n) { return n.toLocaleString("en-IN"); };
  function updateCounter() {
    var n = message.value.trim().length;
    counter.textContent = fmt(n) + " / " + fmt(MESSAGE_MAX);
    counter.classList.toggle("is-short", n > 0 && n < MESSAGE_MIN);
    counter.classList.toggle("is-over", n > MESSAGE_MAX);
  }
  if (counter) {
    counter.hidden = false;
    message.addEventListener("input", updateCounter);
    updateCounter();
  }

  function value(id) { return document.getElementById(id).value.trim(); }

  // A mailto: link carrying what the person typed, so nothing is lost if the form can't send.
  function mailtoHref() {
    var lines = [value("f-message"), "", "—", value("f-name")];
    if (value("f-org")) lines.push(value("f-org"));
    if (value("f-email")) lines.push(value("f-email"));
    return "mailto:" + SUPPORT_EMAIL +
      "?subject=" + encodeURIComponent((topic.value || "Message") + " (jykalabs.com)") +
      "&body=" + encodeURIComponent(lines.join("\n"));
  }

  function showFallback() {
    fallbackMail.href = mailtoHref();
    fallback.hidden = false;
  }

  // Keep the email link up to date with what's typed once it is showing.
  form.addEventListener("input", function () { if (!fallback.hidden) fallbackMail.href = mailtoHref(); });
  form.addEventListener("change", function () { if (!fallback.hidden) fallbackMail.href = mailtoHref(); });

  var EMAIL = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;
  var checks = [
    { id: "f-name", error: "e-name", test: function (v) { return v ? "" : "Please write your name."; } },
    {
      id: "f-email", error: "e-email",
      test: function (v) {
        if (!v) return "Please write your email, so we can reply.";
        return EMAIL.test(v) ? "" : "That email doesn't look complete. Check it, for example name@company.com.";
      }
    },
    {
      id: "f-topic", error: "e-topic",
      test: function (v) { return TOPICS.indexOf(v) !== -1 ? "" : "Please choose a topic from the list."; }
    },
    {
      id: "f-message", error: "e-message",
      test: function (v) {
        if (!v) return "Please write your message.";
        if (v.length < MESSAGE_MIN) return "Please tell us a little more (at least " + MESSAGE_MIN + " characters).";
        if (v.length > MESSAGE_MAX) return "Please keep it under " + fmt(MESSAGE_MAX) + " characters (it's " + fmt(v.length) + " now).";
        return "";
      }
    }
  ];

  function show(check, text) {
    var input = document.getElementById(check.id);
    var error = document.getElementById(check.error);
    error.textContent = text;
    error.hidden = !text;
    if (text) input.setAttribute("aria-invalid", "true");
    else input.removeAttribute("aria-invalid");
  }

  function validate() {
    var first = null;
    checks.forEach(function (check) {
      var text = check.test(value(check.id));
      show(check, text);
      if (text && !first) first = document.getElementById(check.id);
    });
    return first;
  }

  // Once a field has been flagged, clear its message as soon as it's fixed.
  checks.forEach(function (check) {
    var input = document.getElementById(check.id);
    var recheck = function () {
      if (input.getAttribute("aria-invalid") === "true") show(check, check.test(value(check.id)));
    };
    input.addEventListener("input", recheck);
    input.addEventListener("change", recheck);
  });

  function setStatus(text, isError) {
    status.textContent = text;
    status.classList.toggle("is-error", Boolean(isError));
  }

  var busy = false;
  function setBusy(on) {
    busy = on;
    send.disabled = on;
    if (on) send.setAttribute("aria-busy", "true");
    else send.removeAttribute("aria-busy");
    send.textContent = on ? "Sending…" : "Send message";
  }

  function fail(text) {
    setBusy(false);
    setStatus(text, true);
    showFallback();
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (busy) return;
    setStatus("");

    var invalid = validate();
    if (invalid) {
      invalid.focus();
      return;
    }

    var key = keyField && typeof keyField.value === "string" ? keyField.value.trim() : "";
    if (!key) {
      fail("The form can't send messages right now. What you wrote is still here.");
      return;
    }

    var data = {};
    new FormData(form).forEach(function (v, name) {
      if (name !== "redirect") data[name] = typeof v === "string" ? v.trim() : v;
    });
    // Web3Forms checks the honeypot on its side as well; a ticked box means a bot filled the form.
    if (data.botcheck) return;
    delete data.botcheck;
    data.access_key = key;
    data.subject = data.topic + ": new message from jykalabs.com";
    data.replyto = data.email;

    setBusy(true);
    var controller = "AbortController" in window ? new AbortController() : null;
    var timer = controller ? window.setTimeout(function () { controller.abort(); }, TIMEOUT_MS) : null;

    fetch(form.action, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data),
      signal: controller ? controller.signal : undefined
    })
      .then(function (response) {
        return response.json().catch(function () { return {}; }).then(function (body) {
          if (!response.ok || body.success !== true) {
            var error = new Error(body && body.message ? body.message : "HTTP " + response.status);
            error.status = response.status;
            throw error;
          }
        });
      })
      .then(function () {
        if (timer) window.clearTimeout(timer);
        setBusy(false);
        form.reset();
        if (counter) updateCounter();
        markAudience();
        form.hidden = true;
        sent.hidden = false;
        sent.focus();
      })
      .catch(function (error) {
        if (timer) window.clearTimeout(timer);
        var offlineNow = typeof navigator.onLine === "boolean" && !navigator.onLine;
        if (offlineNow) fail("You seem to be offline, so your message wasn't sent. What you wrote is still here.");
        else if (error && error.status === 429) fail("Too many messages were sent from here just now, so yours wasn't sent. What you wrote is still here.");
        else fail("Your message wasn't sent. Try again in a moment; what you wrote is still here.");
      });
  });
})();
