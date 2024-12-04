


// optimisasi listrik menggunakan regresi linear
function optimizeElectricity(matrixTable, maxWatt) {
    const devices = [];
    const totalRows = matrixTable.rows.length - 1; 
    const totalCols = matrixTable.rows[0].cells.length - 1; 

    //penaruhan data device pada table
    for (let i = 1; i <= totalRows; i++) {
        for (let j = 1; j <= totalCols; j++) {
            const cell = matrixTable.rows[i].cells[j];
            if (cell.textContent.includes("jam")) {
                const [name, usageDetails] = cell.textContent.split(" - ");
                const [hours, watt] = usageDetails
                    .match(/\d+/g)
                    .map(num => parseInt(num, 10));
                devices.push({ hours, watt });
            }
        }
    }


    //extract input matrix x dan y
    const X = devices.map(device => [device.hours, device.watt]);
    const y = devices.map(device => device.hours * device.watt);

    //rumus regresi linear
    const XT = math.transpose(X); // X^T
    const XTX = math.multiply(XT, X); // X^T * X
    const XTXInverse = math.inv(XTX); // (X^T * X)^-1
    const XTy = math.multiply(XT, y); // X^T * y
    const w = math.multiply(XTXInverse, XTy); // beban

    //kalkulasi dan sesuaikan prediksi dengan yang sudah dioptimisasi
    let optimized = 0;
    devices.forEach(device => {
        const prediction = w[0] * device.hours + w[1] * device.watt;
        optimized += prediction;
    });
    

    const results = document.getElementById("results");
    if (optimized <= maxWatt) {
        results.innerHTML = `Hasil Optimisasi listrik: ${optimized.toFixed(
            2
        )} Watt (Max: ${maxWatt} Watt).`;
    } else {
        results.innerHTML = `penggunaan litrik yang telah dioptimisasi: ${optimized.toFixed(
            2
        )} Watt (Max: ${maxWatt} Watt). rendahkan penggunaan listrik.`;
    }
}

document.getElementById("calculate").addEventListener("click", function () {
    const maxWattInput = document.getElementById("max-watt").value;
    if (!maxWattInput || isNaN(maxWattInput) || maxWattInput <= 0) {
        alert("Please enter a valid maximum wattage.");
        return;
    }

    const maxWatt = parseFloat(maxWattInput);
    const matrixTable = document.getElementById("matrix-table");
    optimizeElectricity(matrixTable, maxWatt);
});

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
        const day = event.target.dataset.day; // Day (column) from button
        const rowIndex = event.target.closest("tr").rowIndex; // Get row index dynamically
        openModal(rowIndex, day);
    }
});

// Fungsi untuk membuka modal tambah device
function openModal(rowIndex, day) {
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
            const usageHours = parseInt(usageHoursInput.value, 10);
            const powerUsage = parseInt(powerUsageInput.value, 10);

            // Get the table row and cell dynamically
            const matrixTable = document.getElementById("matrix-table");
            const targetRow = matrixTable.rows[rowIndex]; // Row based on button
            const targetCell = targetRow.cells[day]; // Cell based on day (column)

            // Update the table cell with input values
            targetCell.innerHTML = `${deviceName} - ${usageHours} jam, ${powerUsage} Watt`;

            // Close the modal and reset inputs
            modal.classList.add("hidden");
            overlay.style.display = "none";
            deviceNameInput.value = "";
            usageHoursInput.value = "";
            powerUsageInput.value = "";
        }
    };
}

    document.getElementById("close-modal").addEventListener("click", function () {
        const modal = document.getElementById("modal");
        const overlay = document.getElementById("overlay");
        modal.classList.add("hidden");
        overlay.style.display = "none";
    });
