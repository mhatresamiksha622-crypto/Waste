let bins = [
    { id: 1, name: "Smart Bin A1", location: "College Campus", level: 92, collected: false },
    { id: 2, name: "Smart Bin A2", location: "Main Road", level: 65, collected: false },
    { id: 3, name: "Smart Bin B1", location: "City Garden", level: 85, collected: false },
    { id: 4, name: "Smart Bin B2", location: "Bus Stop", level: 35, collected: false }
];

let nextId = 5;

function getStatus(bin) {
    if (bin.collected) return "Collected";
    if (bin.level >= 80) return "Pickup Required";
    return "Normal";
}

function getClass(bin) {
    if (bin.collected) return "";
    if (bin.level >= 80) return "danger";
    if (bin.level >= 60) return "warning";
    return "";
}

function renderBin(bin) {
    const status = getStatus(bin);
    const cls = getClass(bin);

    return `
        <div class="bin">
            <div class="bin-top">
                <div>
                    <strong>${escapeHTML(bin.name)}</strong>
                    <div>${escapeHTML(bin.location)}</div>
                </div>
                <span class="badge ${cls}">${status}</span>
            </div>
            <div class="progress">
                <div class="bar ${cls}"
                     style="width:${bin.level}%"></div>
            </div>
            <div class="bin-top">
                <small>Waste Fill Level</small>
                <strong>${bin.level}%</strong>
            </div>
            ${!bin.collected && bin.level >= 80
                ? `<button class="action" onclick="collectBin(${bin.id})">
                    ✓ Mark Collected
                   </button>`
                : ""}
        </div>
    `;
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[char];
    });
}

function updateDashboard() {
    const pendingBins = bins.filter(b => !b.collected && b.level >= 80);
    const completedBins = bins.filter(b => b.collected);

    document.getElementById("totalBins").textContent = bins.length;
    document.getElementById("fullBins").textContent = pendingBins.length;
    document.getElementById("pending").textContent = pendingBins.length;
    document.getElementById("completed").textContent = completedBins.length;

    document.getElementById("binPreview").innerHTML =
        bins.map(renderBin).join("");

    document.getElementById("allBins").innerHTML =
        bins.map(renderBin).join("");

    document.getElementById("collectionList").innerHTML =
        bins.map(renderBin).join("");

    const alerts = bins.filter(b => !b.collected && b.level >= 80);

    document.getElementById("alertList").innerHTML = alerts.length
        ? alerts.map(b => `
            <div class="bin">
                🚨 <strong>${escapeHTML(b.name)}</strong>
                at ${escapeHTML(b.location)}
                is ${b.level}% full.
                <br><small>Priority: High</small>
            </div>
        `).join("")
        : "<p>✅ No pending high-priority alerts.</p>";
}

function showPage(page) {
    document.querySelectorAll(".page").forEach(section => {
        section.classList.add("hidden");
    });

    document.getElementById(page).classList.remove("hidden");

    const titles = {
        dashboard: "Dashboard",
        bins: "Smart Bin Management",
        collection: "Collection Management",
        alerts: "System Alerts"
    };

    document.getElementById("pageTitle").textContent = titles[page];
    updateDashboard();
}

function collectBin(id) {
    const bin = bins.find(b => b.id === id);
    if (!bin || bin.collected) return;

    bin.collected = true;
    bin.level = 0;

    updateDashboard();
    alert("Collection completed successfully!");
}

document.getElementById("binForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("binName").value.trim();
    const location = document.getElementById("binLocation").value.trim();
    const level = Number(document.getElementById("binLevel").value);

    if (!name || !location || !Number.isFinite(level) ||
        level < 0 || level > 100) {
        alert("Please enter valid bin details.");
        return;
    }

    bins.push({
        id: nextId++,
        name: name,
        location: location,
        level: level,
        collected: false
    });

    this.reset();
    updateDashboard();
    alert("New smart bin added successfully!");
});

updateDashboard();
