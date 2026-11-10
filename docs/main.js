// The contact form: checks the message, sends it to Web3Forms, and shows what happened.
(function () {
  "use strict";

  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  // Sections fade up as they come into view, a little apart within each group.
  var reveals = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    reveals.forEach(function (el) {
      var siblings = Array.prototype.filter.call(el.parentElement.children, function (c) { return c.hasAttribute("data-reveal"); });
      el.style.setProperty("--reveal-delay", Math.min(siblings.indexOf(el), 6) * 70 + "ms");
    });
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    reveals.forEach(function (el) { observer.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // The header gains a soft shadow once the page scrolls under it.
  var header = document.querySelector(".site-header");
  var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 8); };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var form = document.getElementById("contact-form");
  if (!form) return;

  var fields = document.getElementById("form-fields");
  var unavailable = document.getElementById("form-unavailable");
  var send = document.getElementById("send");
  var status = document.getElementById("send-status");
  var sent = document.getElementById("sent");
  var key = form.elements.namedItem("access_key");

  // "Work with us" links choose the topic before jumping to the form.
  var topic = document.getElementById("f-topic");
  document.querySelectorAll("a[data-topic]").forEach(function (link) {
    link.addEventListener("click", function () {
      topic.value = link.getAttribute("data-topic");
    });
  });

  // No access key yet: say so rather than letting a message fail.
  if (!key || !key.value.trim()) {
    fields.disabled = true;
    unavailable.hidden = false;
    return;
  }

  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var checks = [
    { id: "f-name", error: "e-name", test: function (v) { return v.length > 0 ? "" : "Please write your name."; } },
    {
      id: "f-email",
      error: "e-email",
      test: function (v) {
        if (!v) return "Please write your email, so we can reply.";
        return EMAIL.test(v) ? "" : "That email doesn't look complete. Check it, for example name@company.com.";
      }
    },
    {
      id: "f-message",
      error: "e-message",
      test: function (v) {
        if (!v) return "Please write your message.";
        return v.length >= 10 ? "" : "Please tell us a little more (at least 10 characters).";
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
      var input = document.getElementById(check.id);
      var message = check.test(input.value.trim());
      show(check, message);
      if (message && !first) first = input;
    });
    return first;
  }

  // Once a field has been flagged, clear the message as soon as it's fixed.
  checks.forEach(function (check) {
    var input = document.getElementById(check.id);
    input.addEventListener("input", function () {
      if (input.getAttribute("aria-invalid") === "true") show(check, check.test(input.value.trim()));
    });
  });

  function setStatus(text, isError) {
    status.textContent = text;
    status.classList.toggle("is-error", Boolean(isError));
  }

  function setBusy(busy) {
    send.disabled = busy;
    if (busy) send.setAttribute("aria-busy", "true");
    else send.removeAttribute("aria-busy");
    send.textContent = busy ? "Sending…" : "Send message";
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    setStatus("");

    var invalid = validate();
    if (invalid) {
      invalid.focus();
      return;
    }

    var data = {};
    new FormData(form).forEach(function (value, name) {
      if (name !== "redirect") data[name] = typeof value === "string" ? value.trim() : value;
    });
    if (data.botcheck) return;
    delete data.botcheck;

    setBusy(true);
    fetch(form.action, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data)
    })
      .then(function (response) {
        return response.json().catch(function () { return {}; }).then(function (body) {
          if (!response.ok || body.success === false) throw new Error(body.message || "HTTP " + response.status);
        });
      })
      .then(function () {
        form.hidden = true;
        sent.hidden = false;
        sent.focus();
      })
      .catch(function () {
        setBusy(false);
        setStatus("Your message wasn't sent. Check your connection and try again; what you wrote is still here.", true);
      });
  });
})();
