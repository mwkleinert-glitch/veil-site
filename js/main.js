(function () {
  const toggle = document.querySelector("[data-menu]");
  const links = document.querySelector("[data-nav]");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  document.querySelectorAll("[data-slider]").forEach(function (root) {
    const after = root.querySelector(".after");
    const bar = root.querySelector(".slider-bar");
    const knob = root.querySelector(".slider-knob");
    const range = root.querySelector(".slider-range");
    function setPos(v) {
      const pct = Math.max(1, Math.min(99, Number(v)));
      after.style.clipPath = "inset(0 0 0 " + pct + "%)";
      bar.style.left = pct + "%";
      knob.style.left = pct + "%";
    }
    range.addEventListener("input", function () { setPos(range.value); });
    setPos(range.value || 52);
  });

  const form = document.querySelector("[data-inquire]");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const data = new FormData(form);
      const payload = {
        name: data.get("name") || "",
        phone: data.get("phone") || "",
        address: data.get("address") || "",
        tank: data.get("tank") || "",
        system: data.get("system") || "",
        pattern: data.get("pattern") || "",
        notes: data.get("notes") || ""
      };
      try {
        const existing = JSON.parse(localStorage.getItem("veil-inquiries") || "[]");
        existing.push({ ...payload, at: new Date().toISOString() });
        localStorage.setItem("veil-inquiries", JSON.stringify(existing));
      } catch (err) { /* ignore quota */ }

      const endpoint = form.getAttribute("data-endpoint") || "";
      const email = form.getAttribute("data-email") || "";
      const done = function () {
        form.hidden = true;
        const ok = document.querySelector("[data-form-ok]");
        if (ok) ok.style.display = "block";
      };

      if (endpoint) {
        fetch(endpoint, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: data
        }).then(done).catch(done);
        return;
      }

      if (email) {
        const body = [
          "VEIL inquiry",
          "Name: " + payload.name,
          "Phone: " + payload.phone,
          "Address: " + payload.address,
          "Tank size: " + payload.tank,
          "System: " + payload.system,
          "Pattern: " + payload.pattern,
          "",
          payload.notes
        ].join("\n");
        window.location.href = "mailto:" + email + "?subject=" + encodeURIComponent("VEIL inquiry — " + payload.name) + "&body=" + encodeURIComponent(body);
      }
      done();
    });
  }
})();
