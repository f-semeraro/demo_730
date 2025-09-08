const menus = [document.getElementById('menu1'), document.getElementById('menu2')];
let currentMenuIndex = 0;
let currentIndex = 0;

let selectedGroupIndex = 0;
let selectedKeyIndex = 0;

let myUdisplayCalls = new udisplayCalls();

let loadedKeys = [];

let baseUrl = "";
let keysByGroup = {};
let groupList = [];

document.addEventListener("DOMContentLoaded", async () => {
  await loadBaseUrl();
  await loadKeysAndPopulate();
  setInterval(() => {
    if (currentMenuIndex === 1) {
      refreshValuesForCurrentGroup();
    }
  }, 8000);
});

async function loadBaseUrl() {
  try {
    const response = await fetch("config/config.json");
    const config = await response.json();
    baseUrl = config.baseUrl;
  } catch (err) {
    console.error("Impossibile caricare app/config.json:", err);
  }
}

async function loadKeysAndPopulate() {
  try {
    const response = await fetch("config/keys_config.json");
    const json_keys = await response.json();
    const result = await fetch("config/keys_responce.json");
    const json_response = await result.json();

    loadedKeys = json_response.data;
    keysByGroup = {};
    groupList = [];

    loadedKeys.forEach(entry => {
      if (!keysByGroup[entry.group]) {
        keysByGroup[entry.group] = [];
        groupList.push(entry.group);
      }
      keysByGroup[entry.group].push(entry);
    });

  
    groupList.push("Exit");

    populateGroups();
  } catch (err) {
    console.error("Errore nel caricamento delle chiavi:", err);
  }
}

function populateGroups() {
  const menu1 = document.getElementById("menu1");
  const existing = menu1.querySelectorAll(".section:not(.header)");
  existing.forEach(el => el.remove());

  groupList.forEach((group, index) => {
    const div = document.createElement("div");
    div.classList.add("section");
   // if (index === selectedGroupIndex) div.classList.add("selected");
    div.textContent = group;
    menu1.appendChild(div);
  });
}

async function populateKeysForGroup(group) {
  const sectionContainer = document.querySelector("#menu2 .section-container");
  sectionContainer.innerHTML = "";

 

  if (!keysByGroup[group]) return;

    keysByGroup[group].forEach(entry => {
    const div = document.createElement("div");
    div.classList.add("section");

    const keyDiv = document.createElement("div");
    keyDiv.classList.add("key-column");
    keyDiv.textContent = entry.key;

    const valueDiv = document.createElement("div");
    valueDiv.classList.add("value-column");
    if(entry.value === "#button#"){
      valueDiv.textContent = "";
    }
    else{
      valueDiv.textContent = entry.value;
    }
   

    div.appendChild(keyDiv);
    div.appendChild(valueDiv);
    sectionContainer.appendChild(div);
  });
  
}

async function refreshValuesForCurrentGroup() {
  const selectedGroup = menus[0].querySelector(".section")?.textContent;
  if (!selectedGroup) return;

  // Ricarica TUTTE le chiavi, aggiornando anche keysByGroup
  await loadKeysAndPopulate();

  const updatedKeys = keysByGroup[selectedGroup];
  if (!updatedKeys) return;

  const sectionContainer = document.querySelector("#menu2 .section-container");
  const keyElements = sectionContainer.querySelectorAll(".section");

  updatedKeys.forEach((entry, index) => {
    const valueDiv = keyElements[index]?.querySelector(".value-column");
    if (valueDiv && entry.value !== "#button#") {
      valueDiv.textContent = entry.value;
    }
  });
}



function getCurrentSections() {
  return menus[currentMenuIndex].querySelectorAll(".section");
}

function clearSelection(sections) {
  sections.forEach(s => s.classList.remove("selected"));
}

function switchMenu(toIndex) {
  menus[currentMenuIndex].classList.remove('active');
  currentMenuIndex = toIndex;
  menus[currentMenuIndex].classList.add('active');

  const sections = getCurrentSections();
  clearSelection(sections);

  // Imposta currentIndex in base al menu attivo
  if (currentMenuIndex === 0) {
    currentIndex = selectedGroupIndex;
  } else {
    currentIndex = 0; // Seleziona sempre il primo elemento nella pagina delle chiavi
  }

  if (sections[currentIndex]) {
   // sections[currentIndex].classList.add('selected');
    sections[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
  } else {
    currentIndex = 0;
  }
}


document.addEventListener('keydown', async (e) => {
  if (!modal.classList.contains('hidden')) {
    if (e.key === "Escape") {
      modal.classList.add("hidden");
    } else if (e.key === "Enter") {
      const key = modalKeyTitle.textContent;
      let value;

      switch (modalValueInput.type) {
        case "checkbox":
          value = modalValueInput.checked ? "1" : "0";
          break;
        default:
          value = modalValueInput.value;
      }

      const selectedGroupElement = menus[0].querySelector(".section.selected");
      const selectedGroup = selectedGroupElement ? selectedGroupElement.textContent : null;

      if (value === "#button#") {
        await myUdisplayCalls.triggerUdisplayButton(key, baseUrl);
      } else {
        await myUdisplayCalls.updateUdisplayKey(key, value, baseUrl);
      }
      await loadKeysAndPopulate();

      if (currentMenuIndex === 1 && selectedGroup) {
        populateKeysForGroup(selectedGroup);
      }

      modal.classList.add("hidden");
      const sections = getCurrentSections();
      clearSelection(sections);
     if (sections[currentIndex]) {
       // sections[currentIndex].classList.add("selected");
        sections[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        currentIndex = 0;
      }
    }
    return;
  }

  const sections = getCurrentSections();

  if (e.key === "ArrowDown" && currentIndex < sections.length - 1) {
    clearSelection(sections);
    currentIndex++;
    if (currentMenuIndex === 0) {
      selectedGroupIndex = currentIndex;
    } else {
      selectedKeyIndex = currentIndex;
    }
    if (sections[currentIndex]) {
      //sections[currentIndex].classList.add("selected");
      sections[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      currentIndex = 0;
    }

  } else if (e.key === "ArrowUp" && currentIndex > 0) {
    clearSelection(sections);
    currentIndex--;
    if (currentMenuIndex === 0) {
      selectedGroupIndex = currentIndex;
    } else {
      selectedKeyIndex = currentIndex;
    }
     if (sections[currentIndex]) {
      //sections[currentIndex].classList.add("selected");
      sections[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      currentIndex = 0;
    }

  } else if (e.key === "ArrowRight" && currentMenuIndex === 0) {
    const selectedGroup = sections[currentIndex].textContent;
    if(selectedGroup === "Abandonner"){
      console.log("Logout ok");
			window.location.href = "login.html";
    }
    else{ 
      populateKeysForGroup(selectedGroup);
      switchMenu(1);
    }
   

  } else if (e.key === "ArrowLeft" && currentMenuIndex === 1) {
    switchMenu(0);

  } else if (e.key === "Enter" && currentMenuIndex === 1) {
    const selected = sections[currentIndex];
    const key = selected.querySelector(".key-column")?.textContent?.trim();
    const value = selected.querySelector(".value-column")?.textContent?.trim();
    const item = loadedKeys.find(e => e.key === key);

    if (item) {
      modalKeyTitle.textContent = item.key;


      if (item.type === "int" || item.type === "float") {
        modalValueInput.classList.remove("hidden");
        triggerButton.classList.add("hidden");
        modalValueInput.type = "number";
        modalValueInput.value = item.value;
      }
      else if (item.value === "#button#"){
        modalValueInput.classList.add("hidden");
        triggerButton.classList.remove("hidden");
        modalValueInput.type = "button";
        modalValueInput.value = item.value;
      }
      else {
        modalValueInput.classList.remove("hidden");
        triggerButton.classList.add("hidden");
        modalValueInput.type = "text";
        modalValueInput.value = item.value;
      }

      if (item.writable === "true") {
        modalValueInput.removeAttribute("readonly");
      } else {
        modalValueInput.setAttribute("readonly", true);
      }

    } else {
      modalKeyTitle.textContent = key;
      modalValueInput.type = "text";
      modalValueInput.value = "";
      modalValueInput.setAttribute("readonly", true);
    }

    modal.classList.remove("hidden");
    modalValueInput.focus();

  } else if (e.key === "Enter" && currentMenuIndex === 0) {
    const selectedGroup = sections[currentIndex].textContent;
    if(selectedGroup === "Abandonner"){
      console.log("Logout ok");
			window.location.href = "login.html";
    }
    else{ 
      populateKeysForGroup(selectedGroup);
      switchMenu(1);
    }

  } else if (e.key === "Escape" && currentMenuIndex === 1) {
    switchMenu(0);
  }
});

// Modal
const modal = document.getElementById("modal");
const modalKeyTitle = document.getElementById("modal-key-title");
const modalValueInput = document.getElementById("modal-value-input");
const triggerButton = document.getElementById("modal-trigger-button");
const modalClose = document.getElementById("modal-close");
const modalSave = document.getElementById("modal-save");

if (modalClose) {
  modalClose.addEventListener("click", () => {
    modal.classList.add("hidden");
  });
}

if (modalSave) {
  modalSave.addEventListener("click", () => {
    modal.classList.add("hidden");
  });
}
