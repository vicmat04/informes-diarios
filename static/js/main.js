const activityPaletteClasses = ["accent-1", "accent-2", "accent-3"]; // Simplified for Dashboard

const state = {
    reportDate: initialState.today,
    facilitator: initialState.facilitators[0],
    exitTime: "5:00 p.m.",
    activities: [...initialState.activities],
    workshopTopics: [...initialState.workshopTopics],
    reportItems: [],
    images: [] // Base64 images for annex
};

const elements = {
    reportDate: document.getElementById("reportDate"),
    exitTime: document.getElementById("exitTime"),
    facilitatorSelect: document.getElementById("facilitatorSelect"),
    workshopName: document.getElementById("workshopName"),
    workshopTheme: document.getElementById("workshopTheme"),
    manageTopicsBtn: document.getElementById("manageTopicsBtn"),
    topicsModal: document.getElementById("topicsModal"),
    topicModalInput: document.getElementById("topicModalInput"),
    addTopicModalBtn: document.getElementById("addTopicModalBtn"),
    topicsList: document.getElementById("topicsList"),
    closeTopicsIcon: document.getElementById("closeTopicsIcon"),
    closeTopicsBtn: document.getElementById("closeTopicsBtn"),
    newActivityTitle: document.getElementById("newActivityTitle"),
    newActivityDetail: document.getElementById("newActivityDetail"),
    customItem: document.getElementById("customItem"),
    activityButtons: document.getElementById("activityButtons"),
    reportList: document.getElementById("reportList"),
    preview: document.getElementById("preview"),
    status: document.getElementById("status"),
    themeToggle: document.getElementById("themeToggle"),
    imageUploadInput: document.getElementById("imageUploadInput"),
    triggerImageUploadBtn: document.getElementById("triggerImageUploadBtn"),
    imageThumbnails: document.getElementById("imageThumbnails")
};

const modalElements = {
    overlay: document.getElementById("activityModal"),
    titleLabel: document.getElementById("modalTitleLabel"),
    inputTitle: document.getElementById("modalInputTitle"),
    inputDetail: document.getElementById("modalInputDetail"),
    cancelBtn: document.getElementById("modalCancelBtn"),
    saveBtn: document.getElementById("modalSaveBtn"),
    closeIcon: document.getElementById("closeModalIcon")
};

let currentEditActivity = null;

function setStatus(message) {
    elements.status.textContent = message;
}

const MESES_JS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

function formatDisplayDate(isoDate) {
    if (!isoDate) return "N/A";
    const [year, month, day] = isoDate.split("-");
    return `${parseInt(day)} de ${MESES_JS[parseInt(month) - 1]} ${year}`;
}

function getRegional() {
    return initialState.regionalMap[state.facilitator] || "Regional de Panamá";
}

function buildReportText() {
    const lines = [
        "Infoplazas AIP",
        getRegional(),
        "*****************************",
        "Informe Diario",
        state.facilitator,
        "***Facilitador Interno***",
        `Fecha: ${formatDisplayDate(state.reportDate)}`,
        "",
        "Actividades realizadas:"
    ];

    const finalItems = [
        "Se realiza marcacion de entrada a las 8:00 a.m.",
        ...state.reportItems,
        "Se realizó la confección y envío de los informes diarios de actividades a la Licenciada Ilsa, manteniendo en copia a la Licenciada Madai para su debido seguimiento y control.",
        `Se realiza marcacion de salida a las ${state.exitTime}`
    ];

    finalItems.forEach((item, index) => lines.push(`${index + 1}. ${item}`));

    return lines.join("\n");
}

function refreshPreview() {
    const regional = getRegional();
    
    const finalItems = [
        "Se realiza marcacion de entrada a las 8:00 a.m.",
        ...state.reportItems,
        "Se realizó la confección y envío de los informes diarios de actividades a la Licenciada Ilsa, manteniendo en copia a la Licenciada Madai para su debido seguimiento y control.",
        `Se realiza marcacion de salida a las ${state.exitTime}`
    ];

    const entries = finalItems.map((item, index) => `<p>${index + 1}. ${item}</p>`);

    elements.preview.innerHTML = `
        <h4>Infoplazas AIP</h4>
        <h4>${regional}</h4>
        <div class="divider">*****************************</div>
        <h4>Informe Diario</h4>
        <h4>${state.facilitator}</h4>
        <h4>***Facilitador Interno***</h4>
        <div style="margin-top:20px;">Fecha: ${formatDisplayDate(state.reportDate)}</div>
        <div class="section" style="margin-top: 20px; margin-bottom: 10px;">Actividades realizadas:</div>
        ${entries.join("")}
    `;
}

function renderFacilitatorAvatars() {
    const container = document.getElementById("facilitatorAvatars");
    if (!container) return;
    container.innerHTML = "";
    
    initialState.facilitators.forEach(f => {
        const wrapper = document.createElement("div");
        wrapper.style.cssText = "display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 16px 8px; border-radius: var(--radius-md); cursor: pointer; transition: all 0.3s; border: 2px solid transparent; background: rgba(0,0,0,0.02); text-align: center;";
        
        const img = document.createElement("img");
        
        const baseName = f.replace(/Licdo\.\s*|Licda\.\s*/gi, "").trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        
        if (initialState.avatarMap && initialState.avatarMap[baseName]) {
            img.src = `/static/avatars/${encodeURIComponent(initialState.avatarMap[baseName])}`;
        } else {
            // Using ui-avatars to get initials
            img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(f.replace(/Licdo\.\s*|Licda\.\s*/gi, ""))} &background=random&color=fff&size=128`;
        }
        
        img.alt = f;
        img.title = f;
        img.style.cssText = "width: 72px; height: 72px; border-radius: 18px; object-fit: cover; transition: all 0.3s; box-shadow: 0 4px 10px rgba(0,0,0,0.05);";
        
        const nameSpan = document.createElement("span");
        // Remove "Licdo." for cleaner display in the grid
        nameSpan.textContent = f.replace(/Licdo\.\s*|Licda\.\s*/gi, "").trim();
        nameSpan.style.cssText = "font-size: 0.85rem; font-weight: 700; color: var(--text-muted); transition: all 0.3s; line-height: 1.2;";
        
        if (state.facilitator === f) {
            wrapper.style.background = "rgba(59, 130, 246, 0.08)";
            wrapper.style.borderColor = "var(--primary)";
            img.style.transform = "scale(1.05)";
            img.style.boxShadow = "0 8px 16px rgba(59, 130, 246, 0.2)";
            nameSpan.style.color = "var(--primary)";
        } else {
            wrapper.addEventListener("mouseenter", () => {
                wrapper.style.background = "rgba(0,0,0,0.05)";
                img.style.transform = "scale(1.05)";
            });
            wrapper.addEventListener("mouseleave", () => {
                wrapper.style.background = "rgba(0,0,0,0.02)";
                img.style.transform = "scale(1)";
            });
        }
        
        wrapper.addEventListener("click", () => {
            state.facilitator = f;
            elements.facilitatorSelect.value = f;
            renderFacilitatorAvatars();
            refreshPreview();
        });
        
        wrapper.append(img, nameSpan);
        container.appendChild(wrapper);
    });
}

function renderWorkshopTopics() {
    const currentValue = elements.workshopTheme.value;
    elements.workshopTheme.innerHTML = "";
    
    const blankOption = document.createElement("option");
    blankOption.value = "";
    blankOption.textContent = "Sin tema seleccionado";
    elements.workshopTheme.appendChild(blankOption);

    state.workshopTopics.forEach(topic => {
        const option = document.createElement("option");
        option.value = topic;
        option.textContent = topic;
        elements.workshopTheme.appendChild(option);
    });

    if (state.workshopTopics.includes(currentValue)) {
        elements.workshopTheme.value = currentValue;
    } else {
        elements.workshopTheme.value = "";
    }
}

function renderActivities() {
    elements.activityButtons.innerHTML = "";

    state.activities.forEach((activity, index) => {
        const button = document.createElement("div");
        button.className = "btn-activity";
        
        const fullText = `${activity.title}: ${activity.detail}`;
        if (state.reportItems.includes(fullText)) {
            button.classList.add("selected");
        }

        const textSpan = document.createElement("span");
        textSpan.className = "activity-text";
        textSpan.textContent = activity.title;
        textSpan.addEventListener("click", () => addReportItem(fullText));

        const actions = document.createElement("div");
        actions.className = "btn-actions";

        const infoBtn = document.createElement("button");
        infoBtn.className = "mini-btn mini-info";
        infoBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
        infoBtn.addEventListener("click", (e) => { e.stopPropagation(); openModal('view', activity); });

        const editBtn = document.createElement("button");
        editBtn.className = "mini-btn mini-edit";
        editBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>';
        editBtn.addEventListener("click", (e) => { e.stopPropagation(); openModal('edit', activity); });

        const delBtn = document.createElement("button");
        delBtn.className = "mini-btn mini-del";
        delBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
        delBtn.addEventListener("click", (e) => { e.stopPropagation(); removeActivity(activity); });

        actions.append(infoBtn, editBtn, delBtn);
        button.append(textSpan, actions);
        elements.activityButtons.appendChild(button);
    });
}

function renderReportItems() {
    elements.reportList.innerHTML = "";

    if (state.reportItems.length === 0) {
        const empty = document.createElement("div");
        empty.style.cssText = "font-size: 0.8rem; color: var(--text-muted); padding: 10px;";
        empty.textContent = "Ninguna actividad seleccionada.";
        elements.reportList.appendChild(empty);
        return;
    }

    state.reportItems.forEach((item, index) => {
        const row = document.createElement("div");
        row.style.cssText = "display: flex; gap: 8px; align-items: center; background: rgba(0,0,0,0.03); padding: 8px; border-radius: 8px; border: 1px solid var(--border);";

        const badge = document.createElement("span");
        badge.style.cssText = "font-weight: 800; color: var(--primary); font-size: 0.8rem;";
        badge.textContent = `${index + 1}.`;

        const text = document.createElement("span");
        text.style.cssText = "flex: 1; font-size: 0.8rem; font-weight: 500;";
        text.textContent = item;

        const upBtn = document.createElement("button");
        upBtn.className = "mini-btn";
        upBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>';
        upBtn.style.background = "rgba(0,0,0,0.05)";
        upBtn.style.color = "var(--text-main)";
        if (index === 0) upBtn.style.visibility = "hidden";
        upBtn.addEventListener("click", () => {
            if (index > 0) {
                const temp = state.reportItems[index - 1];
                state.reportItems[index - 1] = state.reportItems[index];
                state.reportItems[index] = temp;
                renderReportItems();
                refreshPreview();
            }
        });

        const downBtn = document.createElement("button");
        downBtn.className = "mini-btn";
        downBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>';
        downBtn.style.background = "rgba(0,0,0,0.05)";
        downBtn.style.color = "var(--text-main)";
        if (index === state.reportItems.length - 1) downBtn.style.visibility = "hidden";
        downBtn.addEventListener("click", () => {
            if (index < state.reportItems.length - 1) {
                const temp = state.reportItems[index + 1];
                state.reportItems[index + 1] = state.reportItems[index];
                state.reportItems[index] = temp;
                renderReportItems();
                refreshPreview();
            }
        });

        const del = document.createElement("button");
        del.className = "mini-btn mini-del";
        del.textContent = "✕";
        del.addEventListener("click", () => {
            state.reportItems.splice(index, 1);
            renderReportItems();
            refreshPreview();
            renderActivities();
        });

        row.append(badge, text, upBtn, downBtn, del);
        elements.reportList.appendChild(row);
    });
}

async function saveCatalog() {
    await fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            activities: state.activities,
            workshop_topics: state.workshopTopics
        })
    });
}

function addReportItem(item) {
    state.reportItems.push(item);
    renderReportItems();
    refreshPreview();
    renderActivities();
    setStatus(`Añadido: ${item.substring(0, 20)}...`);
}

async function addActivity() {
    const title = elements.newActivityTitle.value.trim();
    const detail = elements.newActivityDetail.value.trim();
    if (!title || !detail) return setStatus("Escribe un título y un detalle.");
    if (state.activities.some(a => a.title.toLowerCase() === title.toLowerCase())) {
        return setStatus("El título de la actividad ya existe.");
    }

    state.activities.push({ title: title, detail: detail });
    await saveCatalog();
    renderActivities();
    elements.newActivityTitle.value = "";
    elements.newActivityDetail.value = "";
    setStatus(`Actividad guardada.`);
}

async function removeActivity(activity) {
    if (!confirm(`¿Eliminar ${activity.title}?`)) return;
    state.activities = state.activities.filter(item => item.title !== activity.title);
    await saveCatalog();
    renderActivities();
    setStatus(`Eliminado.`);
}

function openModal(mode, activity) {
    modalElements.inputTitle.value = activity.title;
    modalElements.inputDetail.value = activity.detail;
    
    if (mode === 'view') {
        modalElements.titleLabel.textContent = "Detalle de Actividad";
        modalElements.inputTitle.readOnly = true;
        modalElements.inputDetail.readOnly = true;
        modalElements.saveBtn.style.display = "none";
        modalElements.cancelBtn.textContent = "Cerrar";
    } else if (mode === 'edit') {
        modalElements.titleLabel.textContent = "Editar Actividad";
        modalElements.inputTitle.readOnly = false;
        modalElements.inputDetail.readOnly = false;
        modalElements.saveBtn.style.display = "block";
        modalElements.cancelBtn.textContent = "Cancelar";
        currentEditActivity = activity;
    }
    
    modalElements.overlay.classList.remove("hidden");
}

function closeModal() {
    modalElements.overlay.classList.add("hidden");
    currentEditActivity = null;
}

function renderTopicsList() {
    elements.topicsList.innerHTML = "";
    state.workshopTopics.forEach(topic => {
        const li = document.createElement("li");
        li.style.cssText = "display: flex; justify-content: space-between; align-items: center; padding: 10px 16px; background: rgba(0,0,0,0.02); border-radius: var(--radius-sm); border: 1px solid var(--border);";
        
        const text = document.createElement("span");
        text.style.fontSize = "0.9rem";
        text.textContent = topic;
        
        const delBtn = document.createElement("button");
        delBtn.className = "mini-btn mini-del";
        delBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
        delBtn.addEventListener("click", async () => {
            if (!confirm(`¿Eliminar el tema "${topic}"?`)) return;
            state.workshopTopics = state.workshopTopics.filter(t => t !== topic);
            await saveCatalog();
            renderWorkshopTopics();
            renderTopicsList();
        });
        
        li.append(text, delBtn);
        elements.topicsList.appendChild(li);
    });
}

async function addWorkshopTopic() {
    const value = elements.topicModalInput.value.trim();
    if (!value) return;
    if (!state.workshopTopics.includes(value)) {
        state.workshopTopics.push(value);
        state.workshopTopics.sort((a, b) => a.localeCompare(b, "es"));
        await saveCatalog();
        renderWorkshopTopics();
        renderTopicsList();
    }
    elements.topicModalInput.value = "";
}

function openTopicsModal() {
    renderTopicsList();
    elements.topicsModal.classList.remove("hidden");
}

function closeTopicsModal() {
    elements.topicsModal.classList.add("hidden");
    elements.topicModalInput.value = "";
}

function addWorkshopItem() {
    const workshopName = elements.workshopName.value.trim();
    const topic = elements.workshopTheme.value.trim();
    if (!workshopName && !topic) return;

    let text = "Desarrollo de taller";
    if (workshopName) text += ` ${workshopName}`;
    if (topic) text += ` sobre ${topic}`;
    text += ".";

    addReportItem(text);
    elements.workshopName.value = "";
}

function addCustomItem() {
    const value = elements.customItem.value.trim();
    if (!value) return;
    addReportItem(value);
    elements.customItem.value = "";
}

function downloadTxt() {
    const blob = new Blob([buildReportText()], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `informe_${state.reportDate}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function handleImageUpload(e) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const base64String = event.target.result;
            state.images.push(base64String);
            renderImageThumbnails();
        };
        reader.readAsDataURL(file);
    });
    
    // Reset input
    elements.imageUploadInput.value = "";
    setStatus(`Se cargaron ${files.length} imágenes.`);
}

function renderImageThumbnails() {
    elements.imageThumbnails.innerHTML = "";
    state.images.forEach((imgData, index) => {
        const wrapper = document.createElement("div");
        wrapper.className = "thumb-wrapper";

        const img = document.createElement("img");
        img.className = "thumb-img";
        img.src = imgData;

        const delBtn = document.createElement("button");
        delBtn.className = "thumb-del";
        delBtn.textContent = "✕";
        delBtn.addEventListener("click", () => {
            state.images.splice(index, 1);
            renderImageThumbnails();
        });

        wrapper.append(img, delBtn);
        elements.imageThumbnails.appendChild(wrapper);
    });
}

async function downloadBinary(kind) {
    setStatus(`Generando ${kind.toUpperCase()}...`);
    try {
        const response = await fetch(`/api/export/${kind}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                report_date: state.reportDate,
                report_items: state.reportItems,
                facilitator: state.facilitator,
                exit_time: state.exitTime,
                images: state.images
            })
        });

        if (!response.ok) throw new Error("Error en el servidor.");

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `informe_${state.reportDate}.${kind === "pdf" ? "pdf" : "doc"}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setStatus(`${kind.toUpperCase()} descargado.`);
    } catch (err) {
        console.error(err);
        setStatus(`Error al descargar ${kind.toUpperCase()}.`);
    }
}

function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme");
    const target = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", target);
    localStorage.setItem("theme", target);
    elements.themeToggle.textContent = target === "dark" ? "☀️ Modo Claro" : "🌙 Modo Oscuro";
}

function switchView(viewId) {
    // Update Sidebar
    document.querySelectorAll(".nav-item").forEach(item => {
        item.classList.toggle("active", item.id === `nav${viewId.replace("view", "")}`);
    });

    // Update Views
    document.querySelectorAll(".app-view").forEach(view => {
        view.style.display = view.id === viewId ? "block" : "none";
    });

    setStatus(`Cargado ${viewId.replace("view", "")}`);
}

function bindEvents() {
    document.getElementById("navInicio").addEventListener("click", () => switchView("viewInicio"));

    elements.reportDate.addEventListener("change", () => {
        state.reportDate = elements.reportDate.value;
        refreshPreview();
    });

    elements.exitTime.addEventListener("input", () => {
        state.exitTime = elements.exitTime.value;
        refreshPreview();
    });

    document.getElementById("yesterdayButton").addEventListener("click", () => {
        const d = new Date(state.reportDate + "T12:00:00");
        d.setDate(d.getDate() - 1);
        state.reportDate = d.toISOString().slice(0, 10);
        elements.reportDate.value = state.reportDate;
        refreshPreview();
    });
    document.getElementById("todayButton").addEventListener("click", () => {
        state.reportDate = initialState.today;
        elements.reportDate.value = state.reportDate;
        refreshPreview();
    });

    document.getElementById("saveActivity").addEventListener("click", addActivity);
    elements.manageTopicsBtn.addEventListener("click", openTopicsModal);
    elements.closeTopicsIcon.addEventListener("click", closeTopicsModal);
    elements.closeTopicsBtn.addEventListener("click", closeTopicsModal);
    elements.addTopicModalBtn.addEventListener("click", addWorkshopTopic);
    
    document.getElementById("addWorkshopItem").addEventListener("click", addWorkshopItem);
    document.getElementById("addCustomItem").addEventListener("click", addCustomItem);
    document.getElementById("copyReport").addEventListener("click", () => {
        navigator.clipboard.writeText(buildReportText());
        setStatus("Copiado.");
    });

    document.getElementById("downloadTxt").addEventListener("click", downloadTxt);
    document.getElementById("downloadDoc").addEventListener("click", () => downloadBinary("doc"));
    document.getElementById("downloadPdf").addEventListener("click", () => downloadBinary("pdf"));
    document.getElementById("clearReport").addEventListener("click", () => {
        state.reportItems = [];
        renderReportItems();
        refreshPreview();
        renderActivities();
    });

    elements.triggerImageUploadBtn.addEventListener("click", () => elements.imageUploadInput.click());
    elements.imageUploadInput.addEventListener("change", handleImageUpload);

    elements.themeToggle.addEventListener("click", toggleTheme);

    modalElements.closeIcon.addEventListener("click", closeModal);
    modalElements.cancelBtn.addEventListener("click", closeModal);
    modalElements.overlay.addEventListener("click", (e) => {
        if (e.target === modalElements.overlay) closeModal();
    });

    modalElements.saveBtn.addEventListener("click", async () => {
        if (!currentEditActivity) return;
        
        const newTitle = modalElements.inputTitle.value.trim();
        const newDetail = modalElements.inputDetail.value.trim();
        
        if (!newTitle || !newDetail) return setStatus("El título y detalle no pueden estar vacíos.");
        
        state.activities = state.activities.map(item => 
            item.title === currentEditActivity.title ? { title: newTitle, detail: newDetail } : item
        );
        await saveCatalog();
        renderActivities();
        closeModal();
        setStatus("Actividad actualizada.");
    });

    const fabPreview = document.getElementById("fabPreview");
    const previewModal = document.getElementById("previewModal");
    const closePreviewBtn = document.getElementById("closePreviewBtn");
    const closePreviewIcon = document.getElementById("closePreviewIcon");
    
    function openPreviewModal() {
        refreshPreview();
        previewModal.classList.remove("hidden");
    }

    function closePreviewModal() {
        previewModal.classList.add("hidden");
    }

    fabPreview.addEventListener("click", openPreviewModal);
    closePreviewBtn.addEventListener("click", closePreviewModal);
    closePreviewIcon.addEventListener("click", closePreviewModal);
    previewModal.addEventListener("click", (e) => {
        if (e.target === previewModal) closePreviewModal();
    });
}

function init() {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    elements.themeToggle.textContent = savedTheme === "dark" ? "☀️ Modo Claro" : "🌙 Modo Oscuro";

    elements.reportDate.value = state.reportDate;
    elements.facilitatorSelect.value = state.facilitator;
    renderActivities();
    renderWorkshopTopics();
    renderReportItems();
    renderFacilitatorAvatars();
    refreshPreview();
    bindEvents();
}

init();
