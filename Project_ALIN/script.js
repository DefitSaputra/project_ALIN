document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("modal");
    const form = document.getElementById("device-form");
    const closeModal = document.getElementById("close-modal");
    const dataMatriks = [];

    // Open Modal
    document.querySelectorAll(".matrix-btn").forEach((button) => {
        button.addEventListener("click", (e) => {
            const hari = e.target.dataset.hari;
            const device = e.target.dataset.device;
            form.dataset.hari = hari;
            form.dataset.device = device;
            modal.classList.remove("hidden");
        });
    });

    // Close Modal
    closeModal.addEventListener("click", () => {
        modal.classList.add("hidden");
    });

    // Save Data
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const hari = form.dataset.hari;
        const device = form.dataset.device;
        const name = document.getElementById("device-name").value;
        const hours = parseInt(document.getElementById("usage-hours").value, 10);
        const power = parseInt(document.getElementById("power-usage").value, 10);

        // Store data
        if (!dataMatriks[hari - 1]) {
            dataMatriks[hari - 1] = [];
        }
        dataMatriks[hari - 1][device - 1] = { name, hours, power };

        console.log("Data Matriks:", dataMatriks);

        // Close Modal
        modal.classList.add("hidden");
        form.reset();

        // Calculate and display results
        const results = calculateDailyEnergy(dataMatriks);
        displayResults(results);
    });

    // Fungsi untuk menghitung total energi harian
    function calculateDailyEnergy(dataMatriks) {
        const dailyEnergy = [];

        // Iterasi setiap hari
        dataMatriks.forEach((day, dayIndex) => {
            let totalEnergy = 0;

            // Iterasi setiap device dalam hari tersebut
            day.forEach((device) => {
                if (device) {
                    totalEnergy += device.power * device.hours; // Daya x Jam Pemakaian
                }
            });

            dailyEnergy[dayIndex] = totalEnergy; // Simpan total energi harian
        });

        return dailyEnergy;
    }

    // Fungsi untuk menampilkan hasil di halaman
    function displayResults(results) {
        const resultContainer = document.getElementById("results");
        resultContainer.innerHTML = "<h3>Total Energi Harian:</h3>";

        results.forEach((energy, index) => {
            const resultItem = document.createElement("p");
            resultItem.textContent = `Hari ${index + 1}: ${energy} Watt`;
            resultContainer.appendChild(resultItem);
        });
    }
});
