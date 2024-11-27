// Fungsi untuk menambahkan Hari baru ke tabel
document.getElementById("add-day").addEventListener("click", function () {
    const matrixTable = document.getElementById("matrix-table");
    const headerRow = matrixTable.rows[0];
    const newDayIndex = headerRow.cells.length;

    // Tambahkan kolom baru ke header
    const newHeader = document.createElement("th");
    newHeader.textContent = `Hari ${newDayIndex}`;
    headerRow.appendChild(newHeader);

    // Tambahkan tombol "+" di setiap baris device
    Array.from(matrixTable.querySelectorAll("tbody tr")).forEach(row => {
        const newCell = document.createElement("td");
        const addButton = document.createElement("button");
        addButton.textContent = "+";
        addButton.classList.add("matrix-btn");
        addButton.dataset.day = newDayIndex;
        newCell.appendChild(addButton);
        row.appendChild(newCell);
    });
});

// Fungsi untuk menambahkan Device baru ke tabel
document.getElementById("add-device").addEventListener("click", function () {
    const matrixTable = document.getElementById("matrix-table");
    const newRow = document.createElement("tr");

    // Tambahkan nama device
    const nameCell = document.createElement("td");
    nameCell.textContent = `Device ${matrixTable.rows.length}`;
    newRow.appendChild(nameCell);

    // Tambahkan kolom sesuai jumlah hari yang ada
    const totalDays = matrixTable.rows[0].cells.length;
    for (let i = 1; i < totalDays; i++) {
        const newCell = document.createElement("td");
        const addButton = document.createElement("button");
        addButton.textContent = "+";
        addButton.classList.add("matrix-btn");
        addButton.dataset.day = i;
        newCell.appendChild(addButton);
        newRow.appendChild(newCell);
    }

    matrixTable.querySelector("tbody").appendChild(newRow);
});

// Fungsi untuk mereset tabel ke kondisi awal
document.getElementById("reset-table").addEventListener("click", function () {
    const matrixTable = document.getElementById("matrix-table");
    matrixTable.innerHTML = `
        <thead>
            <tr>
                <th>Device</th>
                <th>Hari 1</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Device 1</td>
                <td>
                    <button class="matrix-btn" data-day="1">+</button>
                </td>
            </tr>
        </tbody>
    `;
    document.getElementById("results").innerHTML = "";
    document.getElementById("device-form").reset();
});

// Fungsi untuk menangani klik tombol "+" pada matriks
document.addEventListener("click", function (event) {
    if (event.target.classList.contains("matrix-btn")) {
        const day = event.target.dataset.day;
        openModal(day);
    }
});

// Fungsi untuk membuka modal tambah device
function openModal(day) {
    const modal = document.getElementById("modal");
    const overlay = document.getElementById("overlay");
    const deviceNameInput = document.getElementById("device-name");
    const usageHoursInput = document.getElementById("usage-hours");
    const powerUsageInput = document.getElementById("power-usage");

    modal.classList.remove("hidden");
    overlay.style.display = "block";

    document.getElementById("device-form").onsubmit = function (event) {
        event.preventDefault();

        if (deviceNameInput.value && usageHoursInput.value && powerUsageInput.value) {
            const deviceName = deviceNameInput.value;
            const usageHours = parseInt(usageHoursInput.value);
            const powerUsage = parseInt(powerUsageInput.value);

            // Masukkan data ke dalam tabel
            const matrixTable = document.getElementById("matrix-table");
            const deviceRow = matrixTable.querySelector(`tbody tr:nth-child(${day})`);
            deviceRow.cells[day].innerHTML = `${deviceName} - ${usageHours} jam, ${powerUsage} Watt`;

            modal.classList.add("hidden");
            overlay.style.display = "none";

            // Reset input form
            deviceNameInput.value = "";
            usageHoursInput.value = "";
            powerUsageInput.value = "";
        }
    };

    document.getElementById("close-modal").addEventListener("click", function () {
        modal.classList.add("hidden");
        overlay.style.display = "none";
    });
}
