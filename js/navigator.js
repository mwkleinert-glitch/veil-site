const VEIL_SCENES = [
  { size: "500", setting: "woods", pattern: "birch-woodland", label: "Birch Woodland", before: "assets/scene-woods-500-bare.jpg", after: "assets/scene-woods-500-birch-woodland.jpg" },
  { size: "500", setting: "farm", pattern: "limestone", label: "Limestone", before: "assets/scene-farm-500-bare.jpg", after: "assets/scene-farm-500-limestone.jpg" },
  { size: "500", setting: "hoa", pattern: "barn-silver", label: "Barn Silver", before: "assets/scene-hoa-500-bare.jpg", after: "assets/scene-hoa-500-barn-silver.jpg" },
  { size: "500", setting: "home", pattern: "prairie-grass", label: "Prairie Grass", before: "assets/scene-home-500-bare.jpg", after: "assets/scene-home-500-prairie-grass.jpg" }
];
const SIZES = ["120", "250", "325", "500", "850", "1000"];
const SETTINGS = [
  { id: "woods", name: "Woods" },
  { id: "farm", name: "Farm" },
  { id: "hoa", name: "HOA / association" },
  { id: "home", name: "Homeowner yard" }
];
const PATTERNS = [
  { id: "birch-woodland", name: "Birch Woodland" },
  { id: "limestone", name: "Limestone" },
  { id: "barn-silver", name: "Barn Silver" },
  { id: "prairie-grass", name: "Prairie Grass" },
  { id: "winter-birch", name: "Winter Birch" },
  { id: "fieldstone", name: "Fieldstone" }
];

(function () {
  let size = "500", setting = "woods", pattern = "birch-woodland";

  function chips(el, items, getId, getName, current, onPick) {
    el.innerHTML = items.map(function (item) {
      const id = getId(item);
      const on = id === current ? " on" : "";
      return '<button type="button" class="filter-btn' + on + '" data-id="' + id + '">' + getName(item) + "</button>";
    }).join("");
    el.querySelectorAll("button").forEach(function (btn) {
      btn.addEventListener("click", function () { onPick(btn.getAttribute("data-id")); });
    });
  }

  function pickScene() {
    const exact = VEIL_SCENES.find(function (s) { return s.setting === setting && s.pattern === pattern; });
    const bySet = VEIL_SCENES.find(function (s) { return s.setting === setting; }) || VEIL_SCENES[0];
    return exact || bySet;
  }

  function render() {
    chips(document.getElementById("sizes"), SIZES, function (s) { return s; }, function (s) { return s + " gal" + (s === "500" ? " · hero" : ""); }, size, function (v) { size = v; render(); });
    chips(document.getElementById("patterns"), PATTERNS, function (p) { return p.id; }, function (p) { return p.name; }, pattern, function (v) { pattern = v; render(); });
    chips(document.getElementById("settings"), SETTINGS, function (s) { return s.id; }, function (s) { return s.name; }, setting, function (v) { setting = v; render(); });
    const scene = pickScene();
    document.getElementById("nav-before").src = scene.before;
    document.getElementById("nav-after").src = scene.after;
    const setName = SETTINGS.find(function (s) { return s.id === setting; }).name;
    const patName = (PATTERNS.find(function (p) { return p.id === pattern; }) || {}).name || scene.label;
    const note = scene.pattern === pattern ? "" : " · scene shows " + scene.label + " (illustration)";
    document.getElementById("nav-label").textContent = size + " gal · " + setName + " · " + patName + note;
  }
  render();
})();
