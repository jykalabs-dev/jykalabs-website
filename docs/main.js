// jykalabs.com: the year, the header edge, and the contact form (checks the message, sends it to Web3Forms,
// shows what happened in place, and never loses what the person wrote).
(function () {
  "use strict";

  var SUPPORT_EMAIL = "support@jykalabs.com";
  var TOPICS = ["Build a product with us", "Partnership or investment", "Joining Jyka Labs", "Our products", "Something else"];
  var MESSAGE_MIN = 10;
  var MESSAGE_MAX = 5000;
  var TIMEOUT_MS = 20000;

  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 8); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  var form = document.getElementById("contact-form");
  if (!form) return;

  var send = document.getElementById("send");
  var status = document.getElementById("send-status");
  var sent = document.getElementById("sent");
  var fallback = document.getElementById("fallback");
  var fallbackMail = document.getElementById("fallback-mail");
  var topic = document.getElementById("f-topic");
  // The access key lives in one place: the hidden access_key field in index.html.
  var keyField = form.elements.namedItem("access_key");

  // "Work with us" buttons choose the topic before jumping to the form.
  document.querySelectorAll("a[data-topic]").forEach(function (link) {
    link.addEventListener("click", function () {
      var wanted = link.getAttribute("data-topic");
      if (TOPICS.indexOf(wanted) !== -1) topic.value = wanted;
    });
  });

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
        if (v.length > MESSAGE_MAX) return "Please keep it under " + MESSAGE_MAX.toLocaleString("en-IN") + " characters (it's " + v.length.toLocaleString("en-IN") + " now).";
        return "";
      }
    }
  ];

  function show(check, message) {
    var input = document.getElementById(check.id);
    var error = document.getElementById(check.error);
    error.textContent = message;
    error.hidden = !message;
    if (message) input.setAttribute("aria-invalid", "true");
    else input.removeAttribute("aria-invalid");
  }

  function validate() {
    var first = null;
    checks.forEach(function (check) {
      var message = check.test(value(check.id));
      show(check, message);
      if (message && !first) first = document.getElementById(check.id);
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
        form.hidden = true;
        sent.hidden = false;
        sent.focus();
      })
      .catch(function (error) {
        if (timer) window.clearTimeout(timer);
        var offline = typeof navigator.onLine === "boolean" && !navigator.onLine;
        if (offline) fail("You seem to be offline, so your message wasn't sent. What you wrote is still here.");
        else if (error && error.status === 429) fail("Too many messages were sent from here just now, so yours wasn't sent. What you wrote is still here.");
        else fail("Your message wasn't sent. Try again in a moment; what you wrote is still here.");
      });
  });
})();
