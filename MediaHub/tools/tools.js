// [T-13] Global State
let TOOLS_DATA = null;
let ACTIVE_CATEGORY = "all";

// [T-14] Init
document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("year").textContent = new Date().getFullYear();
  await loadToolsJSON();
  renderTabs();
  renderToolsGrid();
  bindSearch();
});

// [T-15] Load JSON
async function loadToolsJSON(){
  try{
    const res = await fetch("tools.json");
    TOOLS_DATA = await res.json();
  }catch(e){
    console.error("Tools JSON load error:", e);
    document.getElementById("toolsContent").innerHTML =
      `<p style="color:#f87171;font-weight:800">Failed to load tools.json</p>`;
  }
}

// [T-16] Render Tabs
function renderTabs(){
  const tabBox = document.getElementById("categoryTabs");
  tabBox.innerHTML = "";

  const allTab = createTab("all", "All / সব");
  tabBox.appendChild(allTab);

  TOOLS_DATA.categories.forEach(cat => {
    tabBox.appendChild(createTab(cat.id, `${cat.name_en} / ${cat.name_bn}`));
  });
}

// [T-17] Create Tab
function createTab(id, label){
  const div = document.createElement("div");
  div.className = "tab" + (id === ACTIVE_CATEGORY ? " active" : "");
  div.textContent = label;
  div.onclick = () => {
    ACTIVE_CATEGORY = id;
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    div.classList.add("active");
    renderToolsGrid();
  };
  return div;
}

// [T-18] Render Tools Grid
function renderToolsGrid(){
  const grid = document.getElementById("toolsContent");
  if(!TOOLS_DATA) return;

  const searchVal = (document.getElementById("toolSearch").value || "").toLowerCase();

  let tools = TOOLS_DATA.tools;

  // category filter
  if(ACTIVE_CATEGORY !== "all"){
    tools = tools.filter(t => t.category === ACTIVE_CATEGORY);
  }

  // search filter
  if(searchVal){
    tools = tools.filter(t =>
      (t.title_en + " " + t.title_bn + " " + t.desc_en + " " + t.desc_bn)
      .toLowerCase()
      .includes(searchVal)
    );
  }

  if(tools.length === 0){
    grid.innerHTML = `<p style="color:#94a3b8;font-weight:800">No tools found / কিছুই পাওয়া যায়নি</p>`;
    return;
  }

  grid.innerHTML = tools.map(toolCardHTML).join("");
}

// [T-19] Tool Card HTML (with SVG icon)
function toolCardHTML(t){
  return `
    <div class="tool-card">
      <div class="tool-top">
        <div class="tool-icon">
          ${getSVG(t.icon)}
        </div>
        <div>
          <div class="tool-title">${t.title_en}</div>
          <div class="tool-sub">${t.title_bn}</div>
        </div>
      </div>

      <div class="tool-desc">
        <b>${t.desc_en}</b><br/>
        <span style="color:#94a3b8">${t.desc_bn}</span>
      </div>

      <button class="open-btn" onclick="openTool('${t.path}')">Open / খুলুন</button>
    </div>
  `;
}

// [T-20] Open Tool
function openTool(path){
  window.location.href = path;
}

// [T-21] Search bind
function bindSearch(){
  document.getElementById("toolSearch").addEventListener("input", () => {
    renderToolsGrid();
  });
}

// [T-22] Back
function goBack(){
  // if user comes directly, fallback to hub
  if(history.length > 1) history.back();
  else window.location.href = "../index.html";
}

// [T-23] SVG Icons (Minimal set, can expand later)
function getSVG(name){
  const icons = {
    audio: `<svg viewBox="0 0 24 24"><path d="M12 3v10.55a4 4 0 1 0 2 3.45V7h4V3h-6z"/></svg>`,
    video: `<svg viewBox="0 0 24 24"><path d="M17 10.5V7c0-1.1-.9-2-2-2H5C3.9 5 3 5.9 3 7v10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-3.5l4 4v-11l-4 4z"/></svg>`,
    image: `<svg viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5C3.9 3 3 3.9 3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3 3.5-4.5 4.5 6H5l3.5-4.5z"/></svg>`,
    text: `<svg viewBox="0 0 24 24"><path d="M5 4v3h5.5v12h3V7H19V4H5z"/></svg>`,
    code: `<svg viewBox="0 0 24 24"><path d="M8 17l-5-5 5-5 1.4 1.4L5.8 12l3.6 3.6L8 17zm8 0l-1.4-1.4 3.6-3.6-3.6-3.6L16 7l5 5-5 5z"/></svg>`,
    link: `<svg viewBox="0 0 24 24"><path d="M3.9 12c0-2.3 1.8-4.1 4.1-4.1h4v2h-4c-1.2 0-2.1.9-2.1 2.1s.9 2.1 2.1 2.1h4v2h-4c-2.3 0-4.1-1.8-4.1-4.1zm6.1 1h4v-2h-4v2zm6-5h-4v2h4c1.2 0 2.1.9 2.1 2.1s-.9 2.1-2.1 2.1h-4v2h4c2.3 0 4.1-1.8 4.1-4.1S18.3 7.9 16 7.9z"/></svg>`,
    ai: `<svg viewBox="0 0 24 24"><path d="M12 2l2.1 6.3H21l-5.2 3.8 2 6.2L12 14.6 6.2 18.3l2-6.2L3 8.3h6.9L12 2z"/></svg>`,
    tool: `<svg viewBox="0 0 24 24"><path d="M22.7 19.3l-6.1-6.1c.4-1 .5-2.2.2-3.3-1-3.2-4.8-4.7-7.8-3l3.3 3.3-2.1 2.1-3.3-3.3c-1.7 3 0 6.8 3 7.8 1.1.3 2.3.2 3.3-.2l6.1 6.1 2.4-2.4z"/></svg>`
  };
  return icons[name] || icons.tool;
}
