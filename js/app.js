// ============ Theme stops (RGB triplets) per section, in scroll order ============
const THEMES = {
  light: {
    bg:[10,10,10],
    surface:[25,25,25],
    ink:[255,255,255],
    inkSoft:[170,170,170],
    accent:[255,40,40],      // Red
    border:[60,20,20]
  },
  protosem:{
    bg:[11,11,12],
    surface:[26,23,21],
    ink:[246,236,227],
    inkSoft:[201,175,158],
    accent:[255,122,26],     // Orange
    border:[54,46,40]
  },
  edits:{
    bg:[27,27,31],
    surface:[35,35,41],
    ink:[237,237,243],
    inkSoft:[154,154,166],
    accent:[156,106,222],    // Purple
    border:[54,54,62]
  }
};


const role = document.getElementById("role");

const roles = ["DEV", "EDITOR"];
let index = 0;

function switchRole() {
    role.classList.add("glitching");

    // Change text halfway through the glitch
    setTimeout(() => {
        index = (index + 1) % roles.length;
        role.textContent = roles[index];
    }, 250);

    role.addEventListener(
        "animationend",
        () => role.classList.remove("glitching"),
        { once: true }
    );
}

// Change every 5 seconds
setInterval(switchRole, 5000);



const lerp = (a,b,t) => a + (b-a)*t;
const smooth = t => t*t*(3-2*t);
const lerpTheme = (A,B,t) => {
  const s = smooth(t);
  const out = {};
  for (const k of Object.keys(A)){
    out[k] = A[k].map((v,i) => Math.round(lerp(v, B[k][i], s)));
  }
  return out;
};

const root = document.documentElement.style;

function applyTheme(theme){
  root.setProperty('--bg', theme.bg.join(','));
  root.setProperty('--surface', theme.surface.join(','));
  root.setProperty('--border', theme.border.join(','));
  root.setProperty('--ink', theme.ink.join(','));
  root.setProperty('--ink-soft', theme.inkSoft.join(','));
  root.setProperty('--accent', theme.accent.join(','));
}

let ticking = false;
let navButtons = [];
let sectionEls = [];


window.addEventListener('scroll', () => {
  if (!ticking){ requestAnimationFrame(updateOnScroll); ticking = true; }
}, { passive:true });

// ---- Nav / hero links: smooth-scroll to section ----
function setupNavAndLinks(){
  navButtons = Array.from(document.querySelectorAll('nav button'));
  sectionEls = ['home','featured','protosem','edits'].map(id => document.getElementById('page-' + id));

  document.querySelectorAll('[data-target]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      document.getElementById('page-' + btn.dataset.target)?.scrollIntoView({ behavior:'smooth', block:'start' });
    });
  });
}

// ================= HERO PIXEL GRID (Home) =================
function setupCommitGrid(){
  const grid = document.getElementById('commitGrid');
  if (!grid) return;

  const cells = [];
  for (let i = 0; i < 121; i++){
    const cell = document.createElement('i');
    cell.className = 'on';
    cell.style.opacity = .18;
    grid.appendChild(cell);
    cells.push(cell);
  }

  function clearFace(){ cells.forEach(c => { c.style.opacity = .18; }); }
  function on(x,y){ cells[y*11+x].style.opacity = 1; }

  function drawSprite(sprite){

    clearFace();

    sprite.forEach((row,y)=>{

        [...row].forEach((pixel,x)=>{

            if(pixel=="#"){
                on(x,y);
            }

        });

    });

}

const sprites={

ghost: [
"...#####...",
"..#.....#..",
".#.......#.",
"#..##.##..#",
"#..##.##..#",
"#.........#",
"#..#...#..#",
"#...###...#",
"##.......##",
".#..###..#.",
"..##...##.."
],


};

  const faces = {
    smile(){
      clearFace();
      on(2,2); on(3,2); on(2,3); on(3,3);
      on(7,2); on(8,2); on(7,3); on(8,3);
      on(3,7); on(4,8); on(5,8); on(6,8); on(7,7);
    },




    neutral(){
      clearFace();
      on(2,2); on(3,2); on(2,3); on(3,3);
      on(7,2); on(8,2); on(7,3); on(8,3);
      on(3,8); on(4,8); on(5,8); on(6,8); on(7,8);
    },
    grin(){
      clearFace();
      on(2,2); on(3,2); on(2,3); on(3,3);
      on(7,2); on(8,2); on(7,3); on(8,3);
      on(2,7); on(3,8); on(4,9); on(5,9); on(6,9); on(7,8); on(8,7);
    },
    wink(){
      clearFace();
      on(2,2); on(3,2); on(2,3); on(3,3);
      on(7,3); on(8,3);
      on(3,7); on(4,8); on(5,8); on(6,8); on(7,7);
    },
    blink(){
      clearFace();
      on(2,3); on(3,3);
      on(7,3); on(8,3);
      on(3,7); on(4,8); on(5,8); on(6,8); on(7,7);
    }
  };

  const startup = setInterval(() => {
    clearFace();
    for (let i = 0; i < 35; i++){
      cells[Math.floor(Math.random()*121)].style.opacity = 1;
    }
  }, 50);

  setTimeout(() => {
    clearInterval(startup);
    grid.classList.add('smile');
    faces.smile();
    animateFace();
  }, 600);

  function animateFace(){

    const sequence=[

        ()=>faces.smile(),

        ()=>faces.wink(),

        ()=>drawSprite(sprites.ghost),

        ()=>faces.grin()

    ];

    let index=0;

    sequence[0]();

    setInterval(()=>{

        index=(index+1)%sequence.length;

        sequence[index]();

    },2000);

}
}

// ---- Protosem rail (week 0 - 20) ----
function setupRail(){
  const rail = document.getElementById('rail');
  if (!rail) return;
  for (let w = 0; w <= 20; w++){
    const node = document.createElement('div');
    node.className = 'rail-node' + (w<=1 ? ' done' : (w===2 ? ' now' : ''));
    node.innerHTML = `<div class="rail-dot"></div><div class="rail-label">${String(w).padStart(2,'0')}</div>`;
    rail.appendChild(node);
  }
}

// ---- Edits fake timeline clips ----
function setupTimeline(){
  const timeline = document.getElementById('timeline');
  if (!timeline) return;
  const rows = [
    {label:'V1', alt:false, clips:[30,60,45]},
    {label:'V2', alt:false, clips:[20,80]},
    {label:'A1', alt:true,  clips:[40,25,50]},
  ];
  rows.forEach(row => {
    const r = document.createElement('div');
    r.className = 'tl-row';
    let html = `<div class="lbl">${row.label}</div>`;
    row.clips.forEach(w => {
      html += `<div class="tl-clip${row.alt?' alt':''}" style="width:${w*3}px"><div class="wave">`;
      for (let i = 0; i < Math.floor(w/3); i++){
        html += `<i style="height:${6+Math.random()*16}px"></i>`;
      }
      html += `</div></div>`;
    });
    r.innerHTML = html;
    timeline.appendChild(r);
  });
}

// ---- Play video fullscreen ----
function setupVideoFullscreen(){
  document.querySelectorAll('.edit-video').forEach(video => {
    video.addEventListener('play', () => {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.webkitEnterFullscreen) {
        video.webkitEnterFullscreen(); // iPhone Safari
      }
    });
  });
}

// ---- Aurora parallax on mouse move ----
function setupParallax(){
  document.addEventListener('mousemove', e => {
    const x = (e.clientX/window.innerWidth-.5)*30;
    const y = (e.clientY/window.innerHeight-.5)*30;
    document.querySelectorAll('.panel').forEach(panel => {
      panel.style.setProperty('--mx', x+'px');
      panel.style.setProperty('--my', y+'px');
    });
  });
}

// ================= Load each tab's partial, in order, into one scrolling page =================
async function loadPartials(){
  const order = ['home','featured','protosem','edits'];
  const main = document.getElementById('main');

  for (const name of order){
    try {
      const res = await fetch(`partials/${name}.html`);
      if (!res.ok) throw new Error(`Failed to load partials/${name}.html`);
      main.insertAdjacentHTML('beforeend', await res.text());
    } catch (err) {
      console.error(err);
      main.insertAdjacentHTML(
        'beforeend',
        `<div class="panel"><section class="inner"><p>Couldn't load the "${name}" section. If you opened this file directly from disk, serve it through a local web server instead (e.g. <code>python -m http.server</code>) — fetch() is blocked on file://.</p></section></div>`
      );
    }
  }

  setupNavAndLinks();
  setupCommitGrid();
  setupRail();
  setupTimeline();
  setupVideoFullscreen();
  updateOnScroll();
}

document.getElementById('year').textContent = new Date().getFullYear();
setupParallax();
loadPartials();

const cursor = document.getElementById("cursor");

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

let x = mouseX;
let y = mouseY;

window.addEventListener("mousemove", (e)=>{

    mouseX = e.clientX;
    mouseY = e.clientY;

});

function animate(){

    x += (mouseX - x) * 0.18;
    y += (mouseY - y) * 0.18;

    cursor.style.left = x + "px";
    cursor.style.top = y + "px";

    requestAnimationFrame(animate);
}

animate();


// -----------------------
// PAGE COLORS
// -----------------------

const blob = document.querySelector(".cursor-blob");

const colors = {
    "page-home":"#ff4444",
    "page-featured":"#ffffff",
    "page-protosem":"#ff7300",
    "page-edits":"#9b5cff"
};

function updateOnScroll(){

  const featured = document.getElementById("page-featured");
  const protosem = document.getElementById("page-protosem");
  const edits = document.getElementById("page-edits");

  if(!featured || !protosem || !edits) return;

  const featuredTop = featured.getBoundingClientRect().top;
  const protosemTop = protosem.getBoundingClientRect().top;
  const editsTop = edits.getBoundingClientRect().top;

  // HOME
  const trigger = window.innerHeight * 0.3;

if(featuredTop > trigger){

      applyTheme(THEMES.light);

      root.setProperty("--blob1","#ff3333");
      root.setProperty("--blob2","#ff4444");
  }

  // FEATURED
 else if(protosemTop > trigger){

      applyTheme(THEMES.light);

      root.setProperty("--blob1","#0b0835");
      root.setProperty("--blob2","#2b022b");
  }

  // PROTOSEM
  else if(editsTop > trigger){

      applyTheme(THEMES.protosem);

      root.setProperty("--blob1","#aa2e09");
      root.setProperty("--blob2","#520f0c");
  }

  // EDITS
  else{

      applyTheme(THEMES.edits);

      root.setProperty("--blob1","#0f0524");
      root.setProperty("--blob2","#3a0c6e");
  }

  // NAV
  const headerOffset = 90;
  const line = window.scrollY + headerOffset;

  let activeIdx = 0;

  sectionEls.forEach((el, idx)=>{
      if(el.offsetTop <= line) activeIdx = idx;
  });

  navButtons.forEach((b,idx)=>{
      b.classList.toggle("active",idx===activeIdx);
  });

  ticking = false;
}


updateCursorColor();

setInterval(() => {

    if(!cursor.classList.contains("featured-mode"))
        return;

    const trail = document.createElement("div");

    trail.className = "cursor-trail";

    trail.style.left = x + "px";
    trail.style.top = y + "px";

    document.body.appendChild(trail);

    setTimeout(() => trail.remove(), 450);

}, 40); // ~60 FPS

function updateCursorColor(){

    const sections = document.querySelectorAll(".panel");

    let active = null;

    sections.forEach(section=>{

        const rect = section.getBoundingClientRect();

        if(rect.top <= window.innerHeight/2 &&
           rect.bottom >= window.innerHeight/2){

            active = section.id;

        }

    });

    if(!active){
        requestAnimationFrame(updateCursorColor);
        return;
    }

    // FEATURED MODE
    if(active === "page-featured"){

        cursor.classList.add("featured-mode");

        blob.style.background = "#fff";

        blob.style.boxShadow = `
            0 0 8px rgba(255,255,255,.95),
            0 0 18px rgba(120,180,255,.8),
            0 0 35px rgba(120,180,255,.45)
        `;

    } else {

        cursor.classList.remove("featured-mode");

        blob.style.background = colors[active];

        blob.style.boxShadow = `
            0 0 20px ${colors[active]},
            0 0 45px ${colors[active]}
        `;

    }

    requestAnimationFrame(updateCursorColor);
}

const video = document.getElementById("ghostVideo");

if(video){

    const start = 11;   // seconds
    const end = 22;    // seconds

    video.currentTime = start;

    video.addEventListener("loadedmetadata", () => {
        video.currentTime = start;
    });

    video.addEventListener("timeupdate", () => {
        if(video.currentTime >= end){
            video.currentTime = start;
            video.play();
        }
    });

}