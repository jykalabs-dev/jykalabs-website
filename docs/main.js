// The reply form: checks the letter, sends it to Web3Forms, and shows what happened.
(function () {
  "use strict";

  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  var form = document.getElementById("reply-form");
  if (!form) return;

  var fields = document.getElementById("reply-fields");
  var unavailable = document.getElementById("form-unavailable");
  var send = document.getElementById("send");
  var status = document.getElementById("send-status");
  var sent = document.getElementById("sent");
  var key = form.elements.namedItem("access_key");

  // No access key yet: say so rather than letting a letter fail.
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
    send.textContent = busy ? "Sending…" : "Send letter";
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
        setStatus("Your letter wasn't sent. Check your connection and try again; what you wrote is still here.", true);
      });
  });
})();
