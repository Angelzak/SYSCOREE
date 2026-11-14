const API = "/api";
let locations = [];
let selected = null;
let origin = null;
let destination = null;
let sol = 1;
const initialResources = { oxygen: 85, water: 70, energy: 92, food: 78 };
let resources = { ...initialResources };

const $ = (id) => document.getElementById(id);

async function init() {
    try {
        const response = await fetch(`${API}/locations`);
        if (!response.ok) throw new Error("No se pudo cargar el mapa");
        locations = await response.json();
        drawMarkers();
        const statusResponse = await fetch(`${API}/status`);
        if (statusResponse.ok) {
            const status = await statusResponse.json();
            console.info(status.note);
        }
    } catch (error) {
        addAlert("Error de conexión", "No se pudo consultar el servidor. Recarga la aplicación.", "warning");
    }
    updateResources();
}

function drawMarkers() {
    const group = $("mapMarkers");
    group.innerHTML = "";
    locations.forEach((place, index) => {
        const x = 60 + place.x * 7.8;
        const y = 35 + place.y * 4.5;
        const marker = document.createElementNS("http://www.w3.org/2000/svg", "g");
        marker.setAttribute("class", "map-marker");
        marker.setAttribute("tabindex", "0");
        marker.setAttribute("role", "button");
        marker.setAttribute("aria-label", place.name);
        marker.dataset.id = place.id;
        marker.innerHTML = `<circle class="halo" cx="${x}" cy="${y}" r="15"></circle>
            <circle class="core" cx="${x}" cy="${y}" r="7"></circle>
            <text x="${x + 13}" y="${y - 12}">${place.name}</text>`;
        marker.addEventListener("click", () => selectLocation(place.id));
        marker.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") selectLocation(place.id);
        });
        group.appendChild(marker);
    });
}

function selectLocation(id) {
    selected = locations.find(place => place.id === id);
    if (!selected) return;
    $("locationName").textContent = selected.name;
    $("locationType").textContent = selected.type.toUpperCase();
    $("locationDescription").textContent = selected.description;
    $("locationInterest").textContent = selected.interest;
    $("setOrigin").disabled = false;
    $("setDestination").disabled = false;
    document.querySelectorAll(".map-marker").forEach(marker => {
        marker.classList.toggle("selected", marker.dataset.id === id);
    });
}

function setRoutePoint(which) {
    if (!selected) return;
    if (which === "origin") origin = selected;
    else destination = selected;
    $("originName").textContent = origin ? origin.name : "Sin definir";
    $("destinationName").textContent = destination ? destination.name : "Sin definir";
    if (origin && destination) {
        if (origin.id === destination.id) {
            $("routeMessage").textContent = "El origen y el destino deben ser diferentes.";
        } else {
            $("routeMessage").textContent = `Recorrido preparado: ${origin.name} → ${destination.name}. Revisa el terreno antes de avanzar.`;
            addAlert("Recorrido preparado", `Ruta de exploración: ${origin.name} a ${destination.name}.`, "info");
        }
    } else {
        $("routeMessage").textContent = "Ahora selecciona la otra región para completar el recorrido.";
    }
}

function updateResources() {
    const keys = { oxygen: "oxygen", water: "water", energy: "energy", food: "food" };
    Object.entries(keys).forEach(([key, id]) => {
        $(`${id}Value`).textContent = `${resources[key]}%`;
        $(`${id}Bar`).style.width = `${resources[key]}%`;
    });
    $("sol").textContent = String(sol).padStart(2, "0");
}

function advanceSol() {
    sol++;
    resources.oxygen = Math.max(0, resources.oxygen - 7);
    resources.water = Math.max(0, resources.water - 9);
    resources.energy = Math.max(0, resources.energy - 6);
    resources.food = Math.max(0, resources.food - 8);
    updateResources();
    addAlert("Nuevo sol iniciado", `Comenzó el sol ${sol}. Los recursos disminuyeron por el consumo simulado.`, "warning");
    const low = Object.entries(resources).filter(([, value]) => value <= 25);
    if (low.length) addAlert("Recursos bajos", `Revisa: ${low.map(([key]) => key).join(", ")}.`, "warning");
}

function replenish() {
    resources.oxygen = Math.min(100, resources.oxygen + 8);
    resources.water = Math.min(100, resources.water + 12);
    resources.energy = Math.min(100, resources.energy + 5);
    resources.food = Math.min(100, resources.food + 10);
    updateResources();
    addAlert("Suministros revisados", "Se aplicó una reposición simulada de recursos. No representa un proceso real.", "info");
}

function resetMission() {
    resources = { ...initialResources };
    sol = 1;
    origin = null;
    destination = null;
    selected = null;
    $("originName").textContent = "Sin definir";
    $("destinationName").textContent = "Sin definir";
    $("routeMessage").textContent = "Selecciona dos regiones para preparar tu recorrido.";
    $("locationName").textContent = "Elige una ubicación";
    $("locationType").textContent = "SIN SELECCIÓN";
    $("locationDescription").textContent = "Pulsa un marcador del mapa para conocer sus características.";
    $("locationInterest").textContent = "Aquí aparecerá información útil para tu misión.";
    $("setOrigin").disabled = true;
    $("setDestination").disabled = true;
    document.querySelectorAll(".map-marker").forEach(marker => marker.classList.remove("selected"));
    $("alertsList").innerHTML = "";
    addAlert("Misión reiniciada", "Los indicadores regresaron a sus valores iniciales.", "info");
    updateResources();
}

function addAlert(title, message, type = "warning") {
    const item = document.createElement("div");
    item.className = `alert-item ${type}`;
    const symbol = document.createElement("span");
    symbol.className = "alert-symbol";
    symbol.textContent = type === "warning" ? "!" : "i";
    const content = document.createElement("div");
    const heading = document.createElement("strong");
    heading.textContent = title;
    const paragraph = document.createElement("p");
    paragraph.textContent = message;
    content.append(heading, paragraph);
    item.append(symbol, content);
    $("alertsList").prepend(item);
    $("alertCount").textContent = $("alertsList").children.length;
}

$("setOrigin").addEventListener("click", () => setRoutePoint("origin"));
$("setDestination").addEventListener("click", () => setRoutePoint("destination"));
$("clearRoute").addEventListener("click", () => {
    origin = null; destination = null;
    $("originName").textContent = "Sin definir";
    $("destinationName").textContent = "Sin definir";
    $("routeMessage").textContent = "Recorrido eliminado. Selecciona dos regiones para crear otro.";
});
$("advanceSol").addEventListener("click", advanceSol);
$("replenish").addEventListener("click", replenish);
$("reset").addEventListener("click", resetMission);
init();
