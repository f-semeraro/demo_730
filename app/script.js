const menus = [document.getElementById('menu1'), document.getElementById('menu2')];
let myUdisplayCalls = new udisplayCalls();
let keysByGroup = {};
let groupList = [];
let currentMenuIndex = 0;
let currentGroup = "";

// Init

document.addEventListener("DOMContentLoaded", async () => {
  await loadKeysAndPopulate();
  updateHeaderTime();
  setInterval(updateHeaderTime, 1000 * 60);
});



async function loadKeysAndPopulate() {

  const result = await fetch("config/keys_responce.json");
  const json_response = await result.json();
  keysByGroup = {};
  groupList = [];

  json_response.data.forEach(entry => {
    if (!keysByGroup[entry.group]) {
      keysByGroup[entry.group] = [];
      groupList.push(entry.group);
    }
    keysByGroup[entry.group].push(entry);
  });
  showGroups();
}

function showGroups() {
  const menu1 = document.getElementById("menu1");
  menu1.innerHTML = "";
  groupList.forEach(group => {
    const div = document.createElement("div");
    div.className = "section";
    div.textContent = group;
    div.onclick = () => {
      if (group === "Exit") window.location.href = "login.html";
      else {
        currentGroup = group;
        showKeys(group);
        switchMenu(1);
      }
    };
    menu1.appendChild(div);
  });
  updateNavBar();
}

function showKeys(group) {
  const container = document.querySelector("#menu2");
  container.innerHTML = "";
  (keysByGroup[group] || []).forEach(entry => {
    const div = document.createElement("div");
    div.className = "section";
    // div.textContent = `${entry.key}: ${entry.value}`;
    div.innerHTML = `<div class='key-column'>${entry.key}</div><div class='value-column'>${entry.value}</div>`;
    div.onclick = () => {
      if (group === "Alarms") openModal(entry);
    };
    container.appendChild(div);
  });
  updateNavBar();
}

function switchMenu(idx) {
  menus[currentMenuIndex].classList.remove('active');
  currentMenuIndex = idx;
  menus[currentMenuIndex].classList.add('active');
  updateNavBar();
}

function openModal(item) {
  modalKeyTitle.textContent = item.key;
  document.getElementById('modal-value-text').textContent = item.sb || item.value;
  // Rimuovi eventuale video/iframe precedente
  const oldVideo = document.getElementById('modal-video');
  if (oldVideo) oldVideo.remove();
  const oldPdf = document.getElementById('modal-pdf');
  if (oldPdf) oldPdf.remove();
  if (item.key === "ERR_CONN") {
    const video = document.createElement('video');
    video.id = 'modal-video';
    video.src = 'img/alarm1.mp4';
    video.controls = false;
    video.autoplay = true;
    video.loop = true;
    video.style.width = '80%';
    video.style.maxHeight = '60vh';
    video.style.background = 'white';
    video.style.objectFit = 'contain';
    video.style.margin = '20px auto';
    modalKeyTitle.insertAdjacentElement('afterend', video);
  }
  if (item.key === "ERR_UPDATE") {
    const pdf = document.createElement('iframe');
    pdf.id = 'modal-pdf';
    pdf.src = 'doc/manual.pdf#page=109';
    pdf.style.width = '100%';
    pdf.style.height = '80vh';
    pdf.style.border = 'none';
    pdf.setAttribute('allowfullscreen', '');
    modalKeyTitle.insertAdjacentElement('afterend', pdf);
  }
  modal.classList.remove("hidden");
}

function updateNavBar() {
  const navBar = document.getElementById("nav-bar");
  navBar.innerHTML = "";
  if (currentMenuIndex === 0) {
    navBar.innerHTML = `<span class='nav-link nav-active'>Groups</span>`;
  } else {
    navBar.innerHTML = `<span class='nav-link nav-back'>&larr; Groups</span> <span class='nav-sep'>&rarr;</span> <span class='nav-link nav-active'>${currentGroup}</span>`;
    navBar.querySelector('.nav-back').onclick = () => {
      switchMenu(0);
      updateNavBar();
    };
  }
}

function updateHeaderTime() {
  const timeSpan = document.querySelector('.header-time');
  if (!timeSpan) return;
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  timeSpan.textContent = `${hh}:${mm}`;
}

// Modal
const modal = document.getElementById("modal");
const modalKeyTitle = document.getElementById("modal-key-title");
const modalValueInput = document.getElementById("modal-value-input");
const modalClose = document.getElementById("modal-close");
const modalCloseX = document.getElementById("modal-close-x");
if (modalClose) modalClose.addEventListener("click", () => modal.classList.add("hidden"));
if (modalCloseX) modalCloseX.addEventListener("click", () => modal.classList.add("hidden"));
