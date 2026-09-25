(function () {
  const SIZES = [
    { id: "120", scale: 0.55 },
    { id: "250", scale: 0.7 },
    { id: "325", scale: 0.82 },
    { id: "500", scale: 1 },
    { id: "850", scale: 1.18 },
    { id: "1000", scale: 1.32 }
  ];
  const PATTERNS = [
    { id: "bare", name: "Bare white", src: null },
    { id: "birch-woodland", name: "Birch Woodland", src: "assets/pattern-birch-woodland.jpg" },
    { id: "limestone", name: "Limestone", src: "assets/pattern-limestone.jpg" },
    { id: "barn-silver", name: "Barn Silver", src: "assets/pattern-barn-silver.jpg" },
    { id: "prairie-grass", name: "Prairie Grass", src: "assets/pattern-prairie-grass.jpg" },
    { id: "winter-birch", name: "Winter Birch", src: "assets/pattern-winter-birch.jpg" },
    { id: "fieldstone", name: "Fieldstone", src: "assets/pattern-fieldstone.jpg" }
  ];

  const canvas = document.getElementById("board");
  const ctx = canvas.getContext("2d");
  const empty = document.getElementById("empty");
  const photoInput = document.getElementById("photo");
  let photo = null;
  let patternImg = null;
  let sizeId = "500";
  let patternId = "birch-woodland";
  let wrapped = true;
  const tank = { x: 0.62, y: 0.68, w: 0.34, rot: 0 };
  let drag = null;
  const patternCache = {};

  function sizeScale() {
    return (SIZES.find(function (s) { return s.id === sizeId; }) || SIZES[3]).scale;
  }

  function chips(el, items, current, onPick) {
    el.innerHTML = items.map(function (item) {
      const on = item.id === current ? " on" : "";
      const label = item.name || (item.id + " gal");
      return '<button type="button" class="filter-btn' + on + '" data-id="' + item.id + '">' + label + "</button>";
    }).join("");
    el.querySelectorAll("button").forEach(function (btn) {
      btn.addEventListener("click", function () { onPick(btn.getAttribute("data-id")); });
    });
  }

  function loadPattern(id) {
    const spec = PATTERNS.find(function (p) { return p.id === id; });
    if (!spec || !spec.src) { patternImg = null; draw(); return; }
    if (patternCache[id]) { patternImg = patternCache[id]; draw(); return; }
    const img = new Image();
    img.onload = function () { patternCache[id] = img; patternImg = img; draw(); };
    img.src = spec.src;
  }

  function drawTank(w, h) {
    const tw = w * tank.w * sizeScale();
    const th = tw * 0.42;
    const cx = w * tank.x;
    const cy = h * tank.y;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(tank.rot);
    ctx.beginPath();
    ctx.ellipse(0, 0, tw / 2, th / 2, 0, 0, Math.PI * 2);
    if (wrapped && patternImg) {
      ctx.save();
      ctx.clip();
      ctx.drawImage(patternImg, -tw / 2, -th / 2, tw, th);
      ctx.restore();
      ctx.strokeStyle = "rgba(26,25,22,0.28)";
    } else {
      ctx.fillStyle = "#f4f1ea";
      ctx.fill();
      ctx.strokeStyle = "rgba(26,25,22,0.22)";
    }
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(tw * 0.08, -th * 0.55, tw * 0.09, th * 0.22, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#ece8df";
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  function draw() {
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    if (photo) {
      ctx.drawImage(photo, 0, 0, w, h);
      drawTank(w, h);
    } else {
      ctx.fillStyle = "#cfc7b8";
      ctx.fillRect(0, 0, w, h);
    }
  }

  function hit(mx, my) {
    const w = canvas.width, h = canvas.height;
    const tw = w * tank.w * sizeScale();
    const th = tw * 0.42;
    return Math.abs(mx - w * tank.x) < tw / 2 && Math.abs(my - h * tank.y) < th / 2 + 24;
  }

  function posFromEvent(e) {
    const r = canvas.getBoundingClientRect();
    const t = e.touches ? e.touches[0] : e;
    return {
      x: (t.clientX - r.left) * (canvas.width / r.width),
      y: (t.clientY - r.top) * (canvas.height / r.height)
    };
  }

  canvas.addEventListener("pointerdown", function (e) {
    if (!photo) return;
    const p = posFromEvent(e);
    if (hit(p.x, p.y)) {
      drag = { x: p.x, y: p.y, tx: tank.x, ty: tank.y };
      canvas.setPointerCapture(e.pointerId);
    }
  });
  canvas.addEventListener("pointermove", function (e) {
    if (!drag) return;
    const p = posFromEvent(e);
    tank.x = Math.max(0.12, Math.min(0.88, drag.tx + (p.x - drag.x) / canvas.width));
    tank.y = Math.max(0.2, Math.min(0.9, drag.ty + (p.y - drag.y) / canvas.height));
    draw();
  });
  canvas.addEventListener("pointerup", function () { drag = null; });

  let pinch = null;
  canvas.addEventListener("touchstart", function (e) {
    if (e.touches.length === 2) {
      const a = e.touches[0], b = e.touches[1];
      pinch = { dist: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY), w: tank.w };
    }
  }, { passive: true });
  canvas.addEventListener("touchmove", function (e) {
    if (e.touches.length === 2 && pinch) {
      const a = e.touches[0], b = e.touches[1];
      const d = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      tank.w = Math.max(0.12, Math.min(0.7, pinch.w * (d / pinch.dist)));
      draw();
    }
  }, { passive: true });
  canvas.addEventListener("touchend", function () { pinch = null; });

  photoInput.addEventListener("change", function () {
    const file = photoInput.files && photoInput.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = function () {
      photo = img;
      empty.hidden = true;
      draw();
    };
    img.src = url;
  });

  document.getElementById("toggle-wrap").addEventListener("click", function () {
    wrapped = !wrapped;
    if (wrapped && patternId === "bare") patternId = "birch-woodland";
    if (!wrapped) patternId = "bare";
    loadPattern(patternId);
    paintChips();
  });
  document.getElementById("reset").addEventListener("click", function () {
    tank.x = 0.62; tank.y = 0.68; tank.w = 0.34; tank.rot = 0;
    draw();
  });
  document.getElementById("smaller").addEventListener("click", function () { tank.w = Math.max(0.12, tank.w * 0.9); draw(); });
  document.getElementById("larger").addEventListener("click", function () { tank.w = Math.min(0.7, tank.w * 1.1); draw(); });
  document.getElementById("left").addEventListener("click", function () { tank.rot -= 0.08; draw(); });
  document.getElementById("right").addEventListener("click", function () { tank.rot += 0.08; draw(); });
  document.getElementById("download").addEventListener("click", function () {
    if (!photo) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/jpeg", 0.9);
    a.download = "VEIL-preview.jpg";
    a.click();
  });

  function paintChips() {
    chips(document.getElementById("c-sizes"), SIZES, sizeId, function (id) { sizeId = id; paintChips(); draw(); });
    chips(document.getElementById("c-patterns"), PATTERNS, patternId, function (id) {
      patternId = id;
      wrapped = id !== "bare";
      loadPattern(id);
      paintChips();
    });
  }
  paintChips();
  loadPattern(patternId);
  draw();
})();
